import { useState, useEffect, useRef, useCallback } from 'react';
import type { Difficulty, GamePhase, DropState, GameState } from '../types';
import { DIFFICULTY_CONFIGS } from '../types';
import {
  TAMIL_CONSONANTS,
  TAMIL_VOWELS,
  getCompoundLetter,
} from '../data/tamil-letters';
import { playPop, playSplash, playWrong, playCombo, playTick } from '../utils/audio';

export function useGameEngine(difficulty: Difficulty) {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(60000);
  const [drops, setDrops] = useState<DropState[]>([]);
  const [targetCompound, setTargetCompound] = useState('');
  const [targetConsonant, setTargetConsonant] = useState('');
  const [targetVowel, setTargetVowel] = useState('');
  const [inputFrozen, setInputFrozen] = useState(false);

  const rafIdRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const dropsRef = useRef<DropState[]>([]);
  const targetCompoundRef = useRef('');
  const handleDropMissRef = useRef<(id: string) => void>(() => {});
  const spawnDropRef = useRef<() => void>(() => {});
  const cycleTargetRef = useRef<() => void>(() => {});
  const lastSecondRef = useRef(Math.ceil(60));
  const nextSpawnTimeRef = useRef<number>(0);
  const pauseStartRef = useRef<number>(0);

  dropsRef.current = drops;
  targetCompoundRef.current = targetCompound;

  const config = DIFFICULTY_CONFIGS[difficulty];

  const cycleTarget = useCallback(() => {
    setDrops(currentDrops => {
      const falling = currentDrops.filter(d => d.status === 'falling');
      if (falling.length > 0) {
        const t = falling[Math.floor(Math.random() * falling.length)];
        setTargetCompound(t.correctCompound);
        setTargetConsonant(t.consonantChar);
        setTargetVowel(t.vowelChar);
      }
      return currentDrops;
    });
  }, []);

  cycleTargetRef.current = cycleTarget;

  const spawnDrop = useCallback(() => {
    const consonantIndex = Math.floor(Math.random() * TAMIL_CONSONANTS.length);
    const vowelIndex = Math.floor(Math.random() * TAMIL_VOWELS.length);
    const correctCompound = getCompoundLetter(consonantIndex, vowelIndex);
    const consonantChar = TAMIL_CONSONANTS[consonantIndex].char;
    const vowelChar = TAMIL_VOWELS[vowelIndex].char;

    const drop: DropState = {
      id: crypto.randomUUID(),
      consonantIndex,
      vowelIndex,
      consonantChar,
      vowelChar,
      correctCompound,
      startTime: Date.now(),
      status: 'falling',
    };

    setDrops(prev => [...prev, drop]);

    const interval = config.spawnIntervalMin + Math.random() * (config.spawnIntervalMax - config.spawnIntervalMin);
    nextSpawnTimeRef.current = Date.now() + interval;
  }, [config.spawnIntervalMin, config.spawnIntervalMax]);

  spawnDropRef.current = spawnDrop;

  const handleDropMiss = useCallback((id: string) => {
    setDrops(prev => {
      const drop = prev.find(d => d.id === id);
      if (!drop) return prev;

      const wasTarget = drop.correctCompound === targetCompoundRef.current;
      if (wasTarget) {
        setCombo(1);
        playSplash();
        setTimeout(() => cycleTargetRef.current(), 200);
      } else {
        playSplash();
      }

      return prev.map(d => d.id === id ? { ...d, status: 'splashed' as const } : d);
    });

    setTimeout(() => {
      setDrops(prev => prev.filter(d => d.id !== id));
    }, 300);
  }, []);

  handleDropMissRef.current = handleDropMiss;

  const startGame = useCallback(() => {
    setPhase('playing');
    setScore(0);
    setCombo(1);
    setTimeRemaining(60000);
    setDrops([]);
    setTargetCompound('');
    setTargetConsonant('');
    setTargetVowel('');
    setInputFrozen(false);
    nextSpawnTimeRef.current = Date.now();

    // Spawn first drop immediately, then pick it as target
    setTimeout(() => {
      spawnDropRef.current();
      setTimeout(() => cycleTargetRef.current(), 50);
    }, 100);
  }, []);

  const handleDropClick = useCallback(
    (clickedDropId: string): { correct: boolean } => {
      if (inputFrozen || phase !== 'playing' || !targetCompound) {
        return { correct: false };
      }

      const clickedDrop = drops.find(d => d.id === clickedDropId);
      if (!clickedDrop || clickedDrop.status !== 'falling') {
        return { correct: false };
      }

      if (clickedDrop.correctCompound === targetCompound) {
        // CORRECT
        const dropProgress = (Date.now() - clickedDrop.startTime) / config.fallDuration;
        const heightBonus = Math.floor((1 - Math.min(dropProgress, 1)) * 50);
        const scoreIncrease = (100 + heightBonus) * combo;

        setScore(prev => prev + scoreIncrease);
        setCombo(prev => Math.min(prev + 1, 3));
        setDrops(prev => prev.map(d => d.id === clickedDropId ? { ...d, status: 'popped' as const } : d));
        playPop();
        playCombo(Math.min(combo + 1, 3));

        setTimeout(() => {
          setDrops(prev => prev.filter(d => d.id !== clickedDropId));
          cycleTargetRef.current();
        }, 300);
        return { correct: true };
      }

      // WRONG
      setCombo(1);
      playWrong();
      setInputFrozen(true);
      setDrops(prev => prev.map(d => d.id === clickedDropId ? { ...d, status: 'wrong' as const } : d));

      setTimeout(() => {
        setInputFrozen(false);
        setDrops(prev => prev.filter(d => d.id !== clickedDropId));
      }, 500);
      return { correct: false };
    },
    [inputFrozen, phase, targetCompound, drops, combo, config.fallDuration],
  );

  // Game loop: requestAnimationFrame
  useEffect(() => {
    if (phase !== 'playing') return;

    lastFrameTimeRef.current = performance.now();

    const tick = (now: number) => {
      const deltaMs = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      setTimeRemaining(prev => {
        const newTime = Math.max(prev - deltaMs, 0);
        const currentSecond = Math.ceil(newTime / 1000);
        if (currentSecond <= 10 && currentSecond !== lastSecondRef.current && currentSecond > 0) {
          playTick();
        }
        lastSecondRef.current = currentSecond;
        return newTime;
      });

      // Check for drops that have fallen out of view
      const currentDrops = dropsRef.current;
      for (const drop of currentDrops) {
        if (drop.status === 'falling') {
          const elapsed = Date.now() - drop.startTime;
          if (elapsed >= config.fallDuration) {
            handleDropMissRef.current(drop.id);
          }
        }
      }

      // Spawn new drops at random intervals
      if (Date.now() >= nextSpawnTimeRef.current) {
        const fallingCount = dropsRef.current.filter(d => d.status === 'falling').length;
        if (fallingCount < config.maxConcurrentDrops) {
          spawnDropRef.current();
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [phase, config.fallDuration, config.maxConcurrentDrops]);

  // Game over detection
  useEffect(() => {
    if (timeRemaining <= 0 && phase === 'playing') {
      setPhase('gameover');
      setDrops([]);
    }
  }, [timeRemaining, phase]);

  const togglePause = useCallback(() => {
    if (phase === 'playing') {
      pauseStartRef.current = performance.now();
      setPhase('paused');
    } else if (phase === 'paused') {
      const pauseDuration = performance.now() - pauseStartRef.current;
      setDrops(prev => prev.map(d =>
        d.status === 'falling' ? { ...d, startTime: d.startTime + pauseDuration } : d
      ));
      nextSpawnTimeRef.current += pauseDuration;
      lastFrameTimeRef.current = performance.now();
      setPhase('playing');
    }
  }, [phase]);

  const gameState: GameState = {
    phase,
    difficulty,
    score,
    combo,
    timeRemaining,
    drops,
    targetCompound,
    targetConsonant,
    targetVowel,
    inputFrozen,
  };

  return {
    gameState,
    startGame,
    handleDropClick,
    togglePause,
  };
}
