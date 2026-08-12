import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWordle } from './hooks/useWordle';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Modal from './components/Modal';
import Toast from './components/Toast';
import { ENTER_KEY, DELETE_KEY, ENGLISH_TO_TAMIL, ENGLISH_TO_MATRA, DIFFICULTY_CONFIG, DIFFICULTIES } from './constants';
import './App.css';

function WinConfetti() {
  return (
    <div className="confetti-container">
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            '--x': `${Math.random() * 100}vw`,
            '--delay': `${Math.random() * 1.5}s`,
            '--duration': `${2 + Math.random() * 2}s`,
            '--rotation': `${Math.random() * 720 - 360}deg`,
            '--color': ['#538d4e', '#b59f3b', '#d4770a', '#4a9eba', '#ffffff'][i % 5],
          }}
        />
      ))}
    </div>
  );
}

function HomeScreen({ onSelectDifficulty }) {
  return (
    <div className="home">
      <div className="home-content">
        <div className="home-title-group">
          <h1 className="home-title">Tamil Wordle</h1>
          <span className="home-subtitle">தமிழ் வேர்டில்</span>
        </div>

        <p className="home-description">
          Guess the Tamil word in 6 tries.
        </p>

        <div className="difficulty-grid">
          {DIFFICULTIES.map((key) => {
            const config = DIFFICULTY_CONFIG[key];
            return (
              <button
                key={key}
                className={`difficulty-btn difficulty-btn--${key}`}
                onClick={() => onSelectDifficulty(key)}
              >
                <span className="difficulty-label">{config.label}</span>
                <span className="difficulty-desc">{config.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GameScreen({ difficulty, onBackToHome }) {
  const {
    answer,
    answerDefinition,
    answerPronunciation,
    currentGuess,
    guesses,
    gameStatus,
    toast,
    revealing,
    validating,
    keyStatuses,
    pendingConsonant,
    wordLength,
    addLetter,
    deleteLetter,
    submitGuess,
    resetGame,
    getWordDefinition,
  } = useWordle(difficulty);

  const [showRules, setShowRules] = useState(false);
  const [definitionToast, setDefinitionToast] = useState(null);
  const [toastKey, setToastKey] = useState(0);
  const definitionTimer = useRef(null);

  const handleShowDefinition = useCallback((word) => {
    const result = getWordDefinition(word);
    if (!result) return;
    if (definitionTimer.current) clearTimeout(definitionTimer.current);
    setDefinitionToast({ message: word, definition: result.definition, pronunciation: result.pronunciation });
    setToastKey((k) => k + 1);
    definitionTimer.current = setTimeout(() => setDefinitionToast(null), 3000);
  }, [getWordDefinition]);

  const handleKeyPress = useCallback(
    (key) => {
      if (validating) return;
      if (key === ENTER_KEY) {
        submitGuess().then((result) => {
          if (result?.definition) {
            if (definitionTimer.current) clearTimeout(definitionTimer.current);
            definitionTimer.current = setTimeout(() => {
              setDefinitionToast({ message: result.word, definition: result.definition, pronunciation: result.pronunciation });
              setToastKey((k) => k + 1);
              setTimeout(() => setDefinitionToast(null), 3000);
            }, 1700);
          }
        });
      } else if (key === DELETE_KEY) {
        deleteLetter();
      } else {
        addLetter(key);
      }
    },
    [submitGuess, deleteLetter, addLetter, validating]
  );

  useEffect(() => {
    return () => { if (definitionTimer.current) clearTimeout(definitionTimer.current); };
  }, []);

  useEffect(() => {
    if (gameStatus !== 'playing') {
      if (definitionTimer.current) clearTimeout(definitionTimer.current);
    }
  }, [gameStatus]);

  // Physical keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showRules || validating) return;

      const key = e.key;

      // Enter
      if (key === 'Enter') {
        e.preventDefault();
        submitGuess().then((result) => {
          if (result?.definition) {
            if (definitionTimer.current) clearTimeout(definitionTimer.current);
            definitionTimer.current = setTimeout(() => {
              setDefinitionToast({ message: result.word, definition: result.definition, pronunciation: result.pronunciation });
              setToastKey((k) => k + 1);
              setTimeout(() => setDefinitionToast(null), 3000);
            }, 1700);
          }
        });
        return;
      }

      // Backspace
      if (key === 'Backspace') {
        e.preventDefault();
        deleteLetter();
        return;
      }

      // Direct Tamil character input (from IME)
      // Tamil Unicode range: U+0B80–U+0BFF
      if (key.length === 1) {
        const code = key.charCodeAt(0);

        // Tamil combining marks (matras) — U+0BBE–U+0BCD
        if (code >= 0x0BBE && code <= 0x0BCD) {
          addLetter(key);
          return;
        }

        if (code >= 0x0B80 && code <= 0x0BFF) {
          addLetter(key);
          return;
        }

        // English to Tamil mapping
        const tamil = ENGLISH_TO_TAMIL[key];
        if (tamil) {
          addLetter(tamil);
          return;
        }

        // English to combining mark mapping
        const matra = ENGLISH_TO_MATRA[key];
        if (matra) {
          addLetter(matra);
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [submitGuess, deleteLetter, addLetter, showRules, validating]);

  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="game">
      {gameStatus === 'won' && <WinConfetti />}

      <header className="header">
        <div className="header-left">
          <button
            className="icon-btn"
            onClick={onBackToHome}
            aria-label="Back to home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="header-center">
          <h1 className="title">Tamil Wordle</h1>
          <span className="subtitle">{config.description}</span>
        </div>
        <div className="header-right">
          <button
            className="icon-btn"
            onClick={() => setShowRules(true)}
            aria-label="How to play"
          >
            ?
          </button>
        </div>
      </header>

      <main className="main">
        <Board guesses={guesses} currentGuess={currentGuess} revealing={revealing} onShowDefinition={handleShowDefinition} wordLength={wordLength} />

        {gameStatus !== 'playing' && (
          <div className="game-end-card">
            <div className="game-end-message">
              {gameStatus === 'won' ? (
                <>
                  <p className="game-end-emoji">&#127881;</p>
                  <p className="game-end-text">
                    You got it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
                  </p>
                  {answerDefinition && (
                    <p className="game-end-definition">
                      {answerPronunciation && <span className="game-end-pronunciation">{answerPronunciation} — </span>}
                      {answerDefinition}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="game-end-emoji">&#128532;</p>
                  <p className="game-end-text">The word was</p>
                  <p className="game-end-answer">{answer}</p>
                  {answerDefinition && (
                    <p className="game-end-definition">
                      {answerPronunciation && <span className="game-end-pronunciation">{answerPronunciation} — </span>}
                      {answerDefinition}
                    </p>
                  )}
                </>
              )}
            </div>
            <button className="play-again-btn" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}

        <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} pendingConsonant={pendingConsonant} />
      </main>

      <Toast message={toast?.message} type={toast?.type} />
      {definitionToast && (
        <Toast
          key={toastKey}
          message={definitionToast.message}
          type="definition"
          definition={definitionToast.definition}
          pronunciation={definitionToast.pronunciation}
        />
      )}
      <Modal isOpen={showRules} onClose={() => setShowRules(false)} wordLength={wordLength} />
    </div>
  );
}

function App() {
  const [difficulty, setDifficulty] = useState(null);

  const handleSelectDifficulty = useCallback((diff) => {
    setDifficulty(diff);
  }, []);

  const handleBackToHome = useCallback(() => {
    setDifficulty(null);
  }, []);

  if (!difficulty) {
    return <HomeScreen onSelectDifficulty={handleSelectDifficulty} />;
  }

  return <GameScreen key={difficulty} difficulty={difficulty} onBackToHome={handleBackToHome} />;
}

export default App;
