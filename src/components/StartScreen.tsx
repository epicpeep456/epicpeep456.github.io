import type { Difficulty } from '../types';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: { key: Difficulty; label: string; desc: string }[] = [
  { key: 'easy', label: 'Easy', desc: 'Slow raindrops' },
  { key: 'medium', label: 'Medium', desc: 'Average raindrops' },
  { key: 'hard', label: 'Hard', desc: 'Fast raindrops' },
];

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-screen">
      <h1>Tamil Letter Rain</h1>
      <p>
        Catch the falling raindrops by selecting the correct Tamil compound
        letter!
      </p>
      <div className="difficulty-buttons">
        {DIFFICULTIES.map(({ key, label, desc }) => (
          <button
            key={key}
            className="difficulty-btn"
            onClick={() => onStart(key)}
          >
            <span className="difficulty-btn-label">{label}</span>
            <span className="difficulty-btn-desc">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
