import { useState, useCallback } from 'react';
import Menu from './components/Menu';
import Game from './components/Game';
import './App.css';

const STORAGE_KEY = 'tamilWamScores';

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveScore(score, difficulty) {
  const scores = loadScores();
  scores.push({ score, difficulty, date: Date.now() });
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
  return top10;
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function calculateStarRating(score) {
  if (score >= 200) return 5;
  if (score >= 140) return 4;
  if (score >= 90) return 3;
  if (score >= 50) return 2;
  if (score >= 20) return 1;
  return 0;
}

function App() {
  const [screen, setScreen] = useState('menu');
  const [characters, setCharacters] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [finalScore, setFinalScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  const handleStart = useCallback((chars, diff) => {
    setCharacters(chars);
    setDifficulty(diff);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback((score) => {
    setFinalScore(score);
    const top10 = saveScore(score, difficulty);
    setLeaderboard(top10);
    setScreen('gameover');
  }, [difficulty]);

  const handlePlayAgain = useCallback(() => {
    setScreen('game');
  }, []);

  const handleBackToMenu = useCallback(() => {
    setScreen('menu');
    setCharacters([]);
  }, []);

  return (
    <div className="app">
      {screen === 'menu' && <Menu onStart={handleStart} />}
      {screen === 'game' && (
        <Game
          key={Date.now()}
          characters={characters}
          difficulty={difficulty}
          onGameOver={handleGameOver}
        />
      )}
      {screen === 'gameover' && (
        <div className="game-wrapper">
          <div className="gameover">
            <div className="gameover-icon">{'\uD83C\uDFC6'}</div>
            <h1 className="gameover-title">Time's Up!</h1>
            <p className="gameover-subtitle">Great job learning Tamil characters!</p>

            <div className="gameover-stars">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`gameover-star ${i < calculateStarRating(finalScore) ? 'filled' : 'empty'}`}
                />
              ))}
            </div>

            <div className="gameover-cards">
              <div className="gameover-card purple">
                <div className="gameover-card-value">{finalScore}</div>
                <div className="gameover-card-label">Score</div>
              </div>
              <div className="gameover-card green">
                <div className="gameover-card-value">{Math.floor(finalScore / 10)}</div>
                <div className="gameover-card-label">Correct</div>
              </div>
              <div className="gameover-card orange">
                <div className="gameover-card-value" style={{ textTransform: 'capitalize' }}>{difficulty}</div>
                <div className="gameover-card-label">Difficulty</div>
              </div>
            </div>

            {leaderboard.length > 0 && (
              <div className="leaderboard">
                <div className="leaderboard-title">Top 10 Scores</div>
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Score</th>
                      <th>Difficulty</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, i) => (
                      <tr key={i} className={entry.score === finalScore && i === leaderboard.findIndex(e => e === entry) ? 'leaderboard-current' : ''}>
                        <td>{i + 1}</td>
                        <td>{entry.score}</td>
                        <td className="leaderboard-difficulty">{entry.difficulty}</td>
                        <td>{formatDate(entry.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="gameover-buttons">
              <button className="gameover-btn primary" onClick={handlePlayAgain}>
                Play Again
              </button>
              <button className="gameover-btn secondary" onClick={handleBackToMenu}>
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
