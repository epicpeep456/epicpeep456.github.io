import { useState } from 'react';
import { characterSets } from '../data/tamilCharacters';

const MENU_OPTIONS = [
  { key: 'vowels', label: 'Vowels', count: characterSets.vowels.length },
  { key: 'consonants', label: 'Consonants', count: characterSets.consonants.length },
  { key: 'compound', label: 'Compound', count: characterSets.compound.length },
  { key: 'all', label: 'All Characters', count: characterSets.all.length },
];

const DIFFICULTY_OPTIONS = [
  { key: 'easy', label: 'Easy', description: 'Slower moles' },
  { key: 'medium', label: 'Medium', description: 'Balanced' },
  { key: 'hard', label: 'Hard', description: 'Fast moles' },
];

function Menu({ onStart }) {
  const [selected, setSelected] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');

  const handleStart = () => {
    if (selected) {
      onStart(characterSets[selected], difficulty);
    }
  };

  return (
    <div className="menu">
      <div className="menu-icon">{'\uD83D\uDC3F'}</div>
      <h1 className="menu-title">Tamil Whack-a-Mole</h1>
      <p className="menu-subtitle">Learn the Tamil alphabet by whacking moles!</p>

      <p className="menu-section-label">Choose a character set</p>
      <div className="menu-options">
        {MENU_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            className={`menu-option ${selected === opt.key ? 'selected' : ''}`}
            onClick={() => setSelected(opt.key)}
          >
            <span className="menu-option-label">{opt.label}</span>
            <span className="menu-option-count">{opt.count} characters</span>
          </button>
        ))}
      </div>

      <p className="menu-section-label">Select difficulty</p>
      <div className="difficulty-options">
        {DIFFICULTY_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            className={`difficulty-btn ${difficulty === opt.key ? 'selected' : ''}`}
            onClick={() => setDifficulty(opt.key)}
          >
            <span className="difficulty-label">{opt.label}</span>
            <span className="difficulty-desc">{opt.description}</span>
          </button>
        ))}
      </div>

      <button
        className="menu-start-btn"
        disabled={!selected}
        onClick={handleStart}
      >
        Start Game
      </button>
      <p className="menu-hint">60 seconds per round &bull; Click moles to whack them</p>
    </div>
  );
}

export default Menu;
