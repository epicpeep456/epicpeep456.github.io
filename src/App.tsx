import { useState, useEffect } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { Raindrop } from './components/Raindrop';
import { TargetDisplay } from './components/TargetDisplay';
import { HUD } from './components/HUD';
import type { Difficulty } from './types';
import { DIFFICULTY_CONFIGS } from './types';
import './styles/game.css';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const { gameState, startGame, handleDropClick, togglePause } =
    useGameEngine(difficulty);

  const handleStart = (d: Difficulty) => {
    setDifficulty(d);
    startGame();
  };

  const handleReplay = (d: Difficulty) => {
    setDifficulty(d);
    startGame();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (gameState.phase === 'playing' || gameState.phase === 'paused')) {
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase, togglePause]);

  if (gameState.phase === 'start') {
    return <StartScreen onStart={handleStart} />;
  }

  if (gameState.phase === 'gameover') {
    return <GameOverScreen score={gameState.score} onReplay={handleReplay} />;
  }

  const config = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div className="game-container">
      <HUD
        timeRemaining={gameState.timeRemaining}
        score={gameState.score}
        combo={gameState.combo}
        onPause={togglePause}
      />
      <div className={`sky-area${gameState.phase === 'paused' ? ' paused' : ''}`}>
        {gameState.drops
          .filter(d => d.status !== 'splashed')
          .map(drop => (
            <Raindrop
              key={drop.id}
              drop={drop}
              fallDuration={config.fallDuration}
              onClick={handleDropClick}
            />
          ))}
      </div>
      <div className="water-area">
        {gameState.targetConsonant && (
          <TargetDisplay
            consonant={gameState.targetConsonant}
            vowel={gameState.targetVowel}
          />
        )}
      </div>
      {gameState.phase === 'paused' && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h2>Paused</h2>
            <button className="pause-resume-btn" onClick={togglePause}>
              Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
