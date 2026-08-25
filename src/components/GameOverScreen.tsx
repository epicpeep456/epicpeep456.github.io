import type { Difficulty } from '../types';

interface GameOverScreenProps {
  score: number;
  onReplay: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
];

export function GameOverScreen({ score, onReplay }: GameOverScreenProps) {
  return (
    <div className="game-over-screen">
      <h1>Time's Up!</h1>
      <div className="final-score">{score}</div>
      <div className="difficulty-buttons">
        {DIFFICULTIES.map(({ key, label }) => (
          <button
            key={key}
            className="difficulty-btn"
            onClick={() => onReplay(key)}
          >
            <span className="difficulty-btn-label">
              Play {label} Again
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
