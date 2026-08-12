import React from 'react';
import {
  TAMIL_VOWELS,
  TAMIL_CONSONANTS_ROW1,
  TAMIL_CONSONANTS_ROW2,
  TAMIL_SPECIAL_ROW,
  ENTER_KEY,
  DELETE_KEY,
  MATRA_OPTIONS,
  STATUS,
} from '../constants';
import './Keyboard.css';

function getStatusColor(status) {
  if (status === STATUS.CORRECT) return '#538d4e';
  if (status === STATUS.EXACT_CONSONANT) return '#4a9eba';
  if (status === STATUS.PRESENT) return '#b59f3b';
  if (status === STATUS.PARTIAL) return '#d4770a';
  if (status === STATUS.ABSENT) return '#3a3a3c';
  return '#818384';
}

export default function Keyboard({ onKeyPress, keyStatuses, pendingConsonant }) {
  const handleKey = (key) => {
    onKeyPress(key);
  };

  const renderKey = (key, idx) => {
    const status = keyStatuses[key];
    const bg = status ? getStatusColor(status) : '#818384';
    const isSpecial = key === ENTER_KEY || key === DELETE_KEY;

    return (
      <button
        key={`${key}-${idx}`}
        className={`key ${isSpecial ? 'key--wide' : ''}`}
        style={{ backgroundColor: bg }}
        onClick={() => handleKey(key)}
        aria-label={key === DELETE_KEY ? 'Delete' : key === ENTER_KEY ? 'Enter' : key}
      >
        {key === DELETE_KEY ? '\u232B' : key === ENTER_KEY ? 'ENTER' : key}
      </button>
    );
  };

  return (
    <div className="keyboard">
      {/* Matra row — shown when a consonant is pending */}
      {pendingConsonant && (
        <div className="keyboard-row keyboard-row--matra">
          {MATRA_OPTIONS.map(({ mark, name }) => (
            <button
              key={`matra-${name}`}
              className="key key--matra"
              onClick={() => handleKey(mark)}
              aria-label={`${pendingConsonant}${mark} (${name})`}
            >
              {pendingConsonant + mark}
            </button>
          ))}
        </div>
      )}

      <div className="keyboard-row">
        {TAMIL_VOWELS.map((k, i) => renderKey(k, i))}
      </div>
      <div className="keyboard-row keyboard-row--offset">
        {TAMIL_CONSONANTS_ROW1.map((k, i) => renderKey(k, i))}
      </div>
      <div className="keyboard-row">
        {TAMIL_CONSONANTS_ROW2.map((k, i) => renderKey(k, i))}
      </div>
      <div className="keyboard-row">
        {renderKey(ENTER_KEY, 0)}
        {TAMIL_SPECIAL_ROW.map((k, i) => renderKey(k, i + 1))}
        {renderKey(DELETE_KEY, 100)}
      </div>
    </div>
  );
}