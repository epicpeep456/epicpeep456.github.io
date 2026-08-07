import { useRef, useEffect, useCallback, useState } from 'react';
import {
  createGameState,
  updateGameState,
  handleClick,
  HOLE_WIDTH,
  HOLE_HEIGHT,
  MOLE_WIDTH,
  MOLE_HEIGHT,
  STATES,
} from '../game/engine';
import HUD from './HUD';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 720;

// Playful light palette
const COLORS = {
  gold: '#F59E0B',
  rose: '#F43F5E',
  skyLight: '#E0F2FE',
  skySoft: '#BAE6FD',
  skyLighter: '#F0F9FF',
  warmBrown: '#B45309',
  warmBrownLight: '#D97706',
  darkBrown: '#78350F',
  molePink: '#FF69B4',
  molePinkLight: '#ff8ec4',
  softBlue: '#BAE6FD',
  softBlueBorder: '#7DD3FC',
  violet: '#A78BFA',
  violetDark: '#7C3AED',
  cream: '#FFF8DC',
  slate700: '#334155',
  slate800: '#1E293B',
  emerald: '#34D399',
};

// --- Audio System ---
let audioContext = null;
let tamilVoiceAvailable = null;

function initAudioSystem() {
  const synth = window.speechSynthesis;
  if (!synth) {
    tamilVoiceAvailable = false;
    return;
  }

  function checkVoices() {
    const voices = synth.getVoices();
    if (voices.length > 0) {
      tamilVoiceAvailable = voices.some(v => v.lang.startsWith('ta'));
    }
  }

  checkVoices();
  synth.addEventListener('voiceschanged', checkVoices);
}

initAudioSystem();

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playFallbackTone() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.value = 523;
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.start(now);
    osc1.stop(now + 0.15);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.value = 659;
    gain2.gain.setValueAtTime(0.2, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.3);
  } catch (e) {
    // silent fallback
  }
}

function playWebSpeech(character) {
  if (tamilVoiceAvailable === true) {
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(character.label);
      utterance.lang = 'ta-IN';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voices = synth.getVoices();
      const tamilVoice = voices.find(v => v.lang.startsWith('ta'));
      if (tamilVoice) utterance.voice = tamilVoice;
      utterance.onerror = () => playFallbackTone();
      synth.speak(utterance);
      return;
    } catch (e) {
      // Fall through to tone
    }
  }
  // Final fallback: AudioContext tone
  playFallbackTone();
}

function playPlaceholderAudio(character) {
  if (!character || !character.label) return;

  // Primary: MP3 file playback
  if (character.audio) {
    try {
      const audioSrc = process.env.PUBLIC_URL + '/audio/' + character.audio;
      const audio = new Audio(audioSrc);
      audio.onerror = () => {
        // MP3 failed, fall through to Web Speech API
        playWebSpeech(character);
      };
      audio.play().catch(() => {
        // Autoplay blocked or other error, fall through
        playWebSpeech(character);
      });
      return;
    } catch (e) {
      // Audio constructor failed, fall through
    }
  }

  // Fallback: Web Speech API
  playWebSpeech(character);
}

// --- Sprite: Background (grass playfield, cabinet border, rivets) ---
function drawBackground(ctx) {
  // Sky blue base
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, COLORS.skyLighter);
  grad.addColorStop(0.5, COLORS.skyLight);
  grad.addColorStop(1, COLORS.skySoft);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Soft clouds / texture patches
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 30; i++) {
    const cx = (i * 193 + 71) % CANVAS_WIDTH;
    const cy = (i * 137 + 43) % CANVAS_HEIGHT;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18 + (i % 12), 12 + (i % 8), Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Scattered dots for texture
  ctx.fillStyle = 'rgba(186, 230, 253, 0.5)';
  for (let i = 0; i < 80; i++) {
    const gx = (i * 137 + 43) % CANVAS_WIDTH;
    const gy = (i * 193 + 71) % CANVAS_HEIGHT;
    ctx.beginPath();
    ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft border frame
  const borderW = 10;
  ctx.fillStyle = COLORS.softBlueBorder;
  ctx.fillRect(0, 0, CANVAS_WIDTH, borderW);
  ctx.fillRect(0, CANVAS_HEIGHT - borderW, CANVAS_WIDTH, borderW);
  ctx.fillRect(0, 0, borderW, CANVAS_HEIGHT);
  ctx.fillRect(CANVAS_WIDTH - borderW, 0, borderW, CANVAS_HEIGHT);

  // Inner border highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  ctx.strokeRect(borderW + 1, borderW + 1, CANVAS_WIDTH - (borderW + 1) * 2, CANVAS_HEIGHT - (borderW + 1) * 2);

  // Top banner
  ctx.fillStyle = COLORS.slate800;
  ctx.fillRect(borderW, borderW, CANVAS_WIDTH - borderW * 2, 26);
  ctx.fillStyle = COLORS.gold;
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TAMIL WHACK-A-MOLE', CANVAS_WIDTH / 2, borderW + 13);
}

// --- Dirt Mound ---
function drawDirtMound(ctx, hole) {
  const hx = hole.x;
  const hy = hole.y;
  const moundW = HOLE_WIDTH / 2 + 18;
  const moundH = 22;

  // Back mound
  ctx.fillStyle = COLORS.darkBrown;
  ctx.beginPath();
  ctx.ellipse(hx, hy - moundH + 4, moundW, moundH, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main mound
  ctx.fillStyle = COLORS.warmBrown;
  ctx.beginPath();
  ctx.ellipse(hx, hy - moundH + 6, moundW - 2, moundH - 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dirt texture
  ctx.fillStyle = COLORS.darkBrown;
  const dotSeed = Math.floor(hx * 7 + hy * 13);
  for (let i = 0; i < 8; i++) {
    const angle = (dotSeed + i * 47) % 360;
    const dist = 6 + ((dotSeed + i * 23) % 10);
    const dx = hx + Math.cos(angle * Math.PI / 180) * dist * (moundW / 30);
    const dy = hy - moundH + 6 + Math.sin(angle * Math.PI / 180) * dist * 0.4;
    ctx.beginPath();
    ctx.arc(dx, dy, 1.5 + (i % 3) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grass tufts
  ctx.strokeStyle = COLORS.emerald;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (let i = -2; i <= 2; i++) {
    const gx = hx + i * 12;
    const gy = hy - moundH + 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 3, gy - 6 - (i % 2) * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 3, gy - 5 - ((i + 1) % 2) * 2);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
}

// --- Hole Interiors ---
function drawHoleInteriors(ctx, holes) {
  holes.forEach((hole) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(hole.x + 2, hole.y + 3, HOLE_WIDTH / 2 + 6, HOLE_HEIGHT / 2 + 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.slate700;
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y, HOLE_WIDTH / 2, HOLE_HEIGHT / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Hole Rims ---
function drawHoleRims(ctx, holes) {
  holes.forEach((hole) => {
    ctx.fillStyle = COLORS.warmBrown;
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y + 2, HOLE_WIDTH / 2 + 6, 8, 0, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = COLORS.warmBrownLight;
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y + 1, HOLE_WIDTH / 2 + 4, 5, 0, 0, Math.PI);
    ctx.fill();
  });
}

// --- Mole Character ---
function drawMoleSprite(ctx, mole, hole) {
  if (mole.state === STATES.HIDDEN) return;

  const moleX = mole.x;
  const visibleTop = mole.riseY;
  const groundY = hole.y;
  const visibleHeight = Math.max(0, groundY - visibleTop);
  if (visibleHeight <= 0) return;

  ctx.save();
  ctx.beginPath();
  ctx.rect(moleX - MOLE_WIDTH / 2 - 2, 0, MOLE_WIDTH + 4, groundY);
  ctx.clip();

  const bodyW = MOLE_WIDTH;
  const bodyH = MOLE_HEIGHT;
  const cx = moleX;
  const topY = visibleTop;
  const bodyTop = topY;
  const bodyBottom = topY + bodyH;
  const bodyMidY = topY + bodyH * 0.45;

  // Body shadow
  ctx.fillStyle = COLORS.darkBrown;
  ctx.beginPath();
  ctx.ellipse(cx + 2, bodyBottom - 8, bodyW / 2 - 2, bodyH / 2 - 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main body - warmer brown
  ctx.fillStyle = COLORS.warmBrown;
  ctx.beginPath();
  ctx.moveTo(cx, bodyTop + 2);
  ctx.bezierCurveTo(
    cx + bodyW / 2 - 2, bodyTop + 8,
    cx + bodyW / 2 + 2, bodyMidY,
    cx + bodyW / 2, bodyBottom - 8
  );
  ctx.bezierCurveTo(
    cx + bodyW / 2, bodyBottom,
    cx - bodyW / 2, bodyBottom,
    cx - bodyW / 2, bodyBottom - 8
  );
  ctx.bezierCurveTo(
    cx - bodyW / 2 - 2, bodyMidY,
    cx - bodyW / 2 + 2, bodyTop + 8,
    cx, bodyTop + 2
  );
  ctx.fill();

  // Belly/face area
  ctx.fillStyle = COLORS.warmBrownLight;
  ctx.beginPath();
  ctx.ellipse(cx, bodyTop + bodyH * 0.5, bodyW / 2 - 6, bodyH / 2 - 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = COLORS.warmBrown;
  ctx.beginPath();
  ctx.ellipse(cx - bodyW / 2 + 8, bodyTop + 8, 7, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + bodyW / 2 - 8, bodyTop + 8, 7, 6, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.warmBrownLight;
  ctx.beginPath();
  ctx.ellipse(cx - bodyW / 2 + 8, bodyTop + 8, 4, 3, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + bodyW / 2 - 8, bodyTop + 8, 4, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eyeY = bodyTop + bodyH * 0.28;
  const eyeSpacing = 9;
  ctx.fillStyle = COLORS.cream;
  ctx.beginPath();
  ctx.ellipse(cx - eyeSpacing, eyeY, 7, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeSpacing, eyeY, 7, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.slate800;
  ctx.beginPath();
  ctx.arc(cx - eyeSpacing + 2, eyeY + 1, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + eyeSpacing - 2, eyeY + 1, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - eyeSpacing + 3, eyeY - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + eyeSpacing - 1, eyeY - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  const noseY = bodyTop + bodyH * 0.38;
  ctx.fillStyle = COLORS.molePink;
  ctx.beginPath();
  ctx.ellipse(cx, noseY, 6, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.molePinkLight;
  ctx.beginPath();
  ctx.ellipse(cx - 1, noseY - 1, 2.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Whiskers
  ctx.strokeStyle = COLORS.darkBrown;
  ctx.lineWidth = 1;
  const whiskerY = noseY + 3;
  for (let w = -1; w <= 1; w++) {
    ctx.beginPath();
    ctx.moveTo(cx - 8, whiskerY + w * 3);
    ctx.lineTo(cx - 24, whiskerY + w * 5 - 2);
    ctx.stroke();
  }
  for (let w = -1; w <= 1; w++) {
    ctx.beginPath();
    ctx.moveTo(cx + 8, whiskerY + w * 3);
    ctx.lineTo(cx + 24, whiskerY + w * 5 - 2);
    ctx.stroke();
  }

  // Smile
  ctx.strokeStyle = COLORS.darkBrown;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, noseY + 2, 8, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Tamil character on belly
  if (mole.character && visibleHeight > 30) {
    const charY = bodyTop + bodyH * 0.65;
    ctx.fillStyle = COLORS.darkBrown;
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mole.character.label, cx + 1, charY + 1);
    ctx.fillStyle = COLORS.cream;
    ctx.fillText(mole.character.label, cx, charY);
  }

  ctx.restore();
}

// --- Whack Effect ---
function drawWhackEffect(ctx, effect) {
  const progress = effect.timer / 600;
  const alpha = 1 - progress;
  const scale = 0.5 + progress * 0.8;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(effect.x, effect.y - progress * 50);

  // Starburst
  const rays = 8;
  const innerR = 8 * scale;
  const outerR = 22 * scale;
  ctx.fillStyle = COLORS.violet;
  ctx.beginPath();
  for (let i = 0; i < rays * 2; i++) {
    const angle = (i * Math.PI) / rays - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const sx = Math.cos(angle) * r;
    const sy = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();

  // Lightning bolts
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  const boltDist = 16 * scale;
  for (let b = 0; b < 4; b++) {
    const bAngle = (b * Math.PI) / 2 + progress * 2;
    const bx = Math.cos(bAngle) * boltDist;
    const by = Math.sin(bAngle) * boltDist;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + 4, by + 3);
    ctx.lineTo(bx + 1, by + 5);
    ctx.lineTo(bx + 5, by + 8);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';

  // +10 text
  ctx.fillStyle = COLORS.rose;
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = COLORS.slate800;
  ctx.lineWidth = 3;
  ctx.strokeText('+10', 0, -10 * scale);
  ctx.fillText('+10', 0, -10 * scale);

  // Romanized text
  if (effect.romanized) {
    ctx.fillStyle = COLORS.cream;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = COLORS.slate800;
    ctx.lineWidth = 2;
    ctx.strokeText(effect.romanized, 0, 10 * scale);
    ctx.fillText(effect.romanized, 0, 10 * scale);
  }

  ctx.restore();
}

// --- Wrong Hit Effect ---
function drawWrongHitEffect(ctx, effect) {
  const progress = effect.timer / 400;
  const alpha = 1 - progress;
  const rise = progress * 35;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(effect.x, effect.y - rise);

  ctx.strokeStyle = COLORS.rose;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const xSize = 14;
  ctx.beginPath();
  ctx.moveTo(-xSize, -xSize);
  ctx.lineTo(xSize, xSize);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(xSize, -xSize);
  ctx.lineTo(-xSize, xSize);
  ctx.stroke();
  ctx.lineCap = 'butt';

  ctx.fillStyle = COLORS.warmBrown;
  const puffDist = 18 * progress;
  for (let p = 0; p < 3; p++) {
    const pAngle = (p * 2.1) + 0.5;
    const px = Math.cos(pAngle) * puffDist;
    const py = Math.sin(pAngle) * puffDist + 10;
    const puffR = 4 * (1 - progress * 0.5);
    ctx.beginPath();
    ctx.arc(px, py, puffR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawPauseOverlay(ctx) {
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.gold;
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

  ctx.fillStyle = COLORS.cream;
  ctx.font = '20px sans-serif';
  ctx.fillText('Press Escape or click Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
}

// Wrapper functions
function drawWhackEffects(ctx, effects) {
  effects.forEach((effect) => drawWhackEffect(ctx, effect));
}

function drawWrongHitEffects(ctx, effects) {
  effects.forEach((effect) => drawWrongHitEffect(ctx, effect));
}

function Game({ characters, difficulty, onGameOver }) {
  const canvasRef = useRef(null);
  const gameStateRef = useRef(null);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);
  const [hudState, setHudState] = useState({
    score: 0,
    timeRemaining: 60000,
    targetCharacter: null,
  });
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      const next = !prev;
      isPausedRef.current = next;
      if (!next) {
        lastTimeRef.current = null;
      }
      return next;
    });
  }, []);

  const gameLoop = useCallback(
    (timestamp) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const state = gameStateRef.current;
      if (!state || state.gameOver) return;

      if (isPausedRef.current) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawBackground(ctx);
        state.holes.forEach((hole) => drawDirtMound(ctx, hole));
        drawHoleInteriors(ctx, state.holes);
        state.moles.forEach((mole, i) => {
          drawMoleSprite(ctx, mole, state.holes[i]);
        });
        drawHoleRims(ctx, state.holes);
        drawWhackEffects(ctx, state.hitEffects);
        drawWrongHitEffects(ctx, state.wrongHitEffects);
        drawPauseOverlay(ctx);
        rafRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      updateGameState(state, dt);

      setHudState({
        score: state.score,
        timeRemaining: state.timeRemaining,
        targetCharacter: state.targetCharacter,
      });

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBackground(ctx);
      state.holes.forEach((hole) => drawDirtMound(ctx, hole));
      drawHoleInteriors(ctx, state.holes);
      state.moles.forEach((mole, i) => {
        drawMoleSprite(ctx, mole, state.holes[i]);
      });
      drawHoleRims(ctx, state.holes);
      drawWhackEffects(ctx, state.hitEffects);
      drawWrongHitEffects(ctx, state.wrongHitEffects);

      if (state.gameOver) {
        onGameOver(state.score);
        return;
      }

      rafRef.current = requestAnimationFrame(gameLoop);
    },
    [onGameOver]
  );

  useEffect(() => {
    gameStateRef.current = createGameState(characters, difficulty);
    lastTimeRef.current = null;
    rafRef.current = requestAnimationFrame(gameLoop);

    // Preload audio files for characters in this set
    characters.forEach(char => {
      if (char.audio) {
        const audio = new Audio(process.env.PUBLIC_URL + '/audio/' + char.audio);
        audio.preload = 'auto';
      }
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') togglePause();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [characters, difficulty, gameLoop, togglePause]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const state = gameStateRef.current;
    if (!state) return;
    if (isPausedRef.current) return;

    const hitChar = handleClick(state, x, y);
    if (hitChar) {
      playPlaceholderAudio(hitChar);
    }
  }, []);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    const TOUCH_TARGET_MIN = 44;
    const displayMoleWidth = MOLE_WIDTH * (rect.width / CANVAS_WIDTH);
    const touchPadding = displayMoleWidth < TOUCH_TARGET_MIN
      ? Math.ceil(((TOUCH_TARGET_MIN - displayMoleWidth) / 2) * (CANVAS_WIDTH / rect.width))
      : 0;

    const state = gameStateRef.current;
    if (!state) return;
    if (isPausedRef.current) return;

    const hitChar = handleClick(state, x, y, touchPadding);
    if (hitChar) {
      playPlaceholderAudio(hitChar);
    }
  }, []);

  return (
    <div className="game-wrapper">
      <div className="game-container">
        <HUD
          score={hudState.score}
          timeRemaining={hudState.timeRemaining}
          targetCharacter={hudState.targetCharacter}
          isPaused={isPaused}
          onTogglePause={togglePause}
        />
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="game-canvas"
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
        />
      </div>
    </div>
  );
}

export default Game;
