import { useRef, useEffect, useState } from 'react';

interface HUDProps {
  timeRemaining: number;
  score: number;
  combo: number;
  onPause: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function HUD({ timeRemaining, score, combo, onPause }: HUDProps) {
  const prevComboRef = useRef(combo);
  const [comboPulse, setComboPulse] = useState(false);

  useEffect(() => {
    if (combo !== prevComboRef.current) {
      prevComboRef.current = combo;
      setComboPulse(true);
      const timer = setTimeout(() => setComboPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  return (
    <div className="hud">
      <span
        className={`hud-timer${timeRemaining < 10000 ? ' hud-timer--warning' : ''}`}
      >
        {formatTime(timeRemaining)}
      </span>
      <span className="hud-score">Score: {score}</span>
      <span
        className={`combo-indicator${comboPulse ? ' combo-indicator--pulse' : ''}`}
      >
        x{combo}
      </span>
      <button className="hud-pause-btn" onClick={onPause} aria-label="Pause game">
        ⏸
      </button>
    </div>
  );
}
