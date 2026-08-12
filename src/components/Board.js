import React from 'react';
import { MAX_GUESSES, STATUS, getGraphemes } from '../constants';
import './Board.css';

function Cell({ grapheme, status, delay, showAnimation }) {
  const isEvaluated =
    status === STATUS.CORRECT ||
    status === STATUS.EXACT_CONSONANT ||
    status === STATUS.PARTIAL ||
    status === STATUS.PRESENT ||
    status === STATUS.ABSENT;

  const animStyle =
    showAnimation && delay > 0
      ? { animationDelay: `${delay}ms` }
      : undefined;

  if (!isEvaluated) {
    let cls = 'cell';
    if (status === STATUS.TYPED) cls += ' cell--typed';
    return (
      <div className={cls}>
        <div className="cell-face">{grapheme || ''}</div>
      </div>
    );
  }

  if (!showAnimation) {
    return (
      <div className="cell">
        <div className={`cell-face cell-face--${status}`}>{grapheme}</div>
      </div>
    );
  }

  return (
    <div className="cell" style={animStyle}>
      <div className="cell-inner">
        <div className="cell-face cell-face--front">{grapheme}</div>
        <div className={`cell-face cell-face--back cell-face--${status}`}>
          {grapheme}
        </div>
      </div>
    </div>
  );
}

export default function Board({ guesses, currentGuess, revealing, onShowDefinition, wordLength }) {
  const rows = [];
  const animatingRow = revealing ? guesses.length - 1 : -1;

  for (let i = 0; i < guesses.length; i++) {
    const { word, evaluation } = guesses[i];
    const graphemes = getGraphemes(word);
    const isAnimating = i === animatingRow;
    rows.push(
      <div className="board-row" key={`guess-${i}`}>
        {graphemes.map((g, j) => (
          <Cell
            key={j}
            grapheme={g}
            status={evaluation[j].status}
            delay={isAnimating ? j * 500 : 0}
            showAnimation={isAnimating}
          />
        ))}
        {!isAnimating && (
          <button
            className="row-question-btn"
            onClick={() => onShowDefinition && onShowDefinition(word)}
            aria-label="Show word definition"
          >
            ?
          </button>
        )}
      </div>
    );
  }

  if (guesses.length < MAX_GUESSES) {
    const currentGraphemes = getGraphemes(currentGuess);
    rows.push(
      <div className="board-row" key="current">
        {Array.from({ length: wordLength }, (_, j) => (
          <Cell
            key={j}
            grapheme={currentGraphemes[j] || ''}
            status={currentGraphemes[j] ? STATUS.TYPED : STATUS.EMPTY}
            delay={0}
            showAnimation={false}
          />
        ))}
      </div>
    );
  }

  const totalRendered = rows.length;
  for (let i = totalRendered; i < MAX_GUESSES; i++) {
    rows.push(
      <div className="board-row" key={`empty-${i}`}>
        {Array.from({ length: wordLength }, (_, j) => (
          <Cell key={j} grapheme="" status={STATUS.EMPTY} delay={0} showAnimation={false} />
        ))}
      </div>
    );
  }

  return <div className="board">{rows}</div>;
}
