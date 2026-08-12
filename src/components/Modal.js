import React, { useEffect, useRef } from 'react';
import './Modal.css';

export default function Modal({ isOpen, onClose, wordLength }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  const charLabel = wordLength === 1 ? '1 character' : `${wordLength} characters`;

  return (
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdrop}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 className="modal-title">How To Play</h2>
        <p className="modal-subtitle">Guess the Tamil word in 6 tries.</p>

        <div className="modal-section">
          <p>Each guess must be a valid {charLabel} Tamil word. Press ENTER to submit.</p>
          <p>
            After each guess, the color of the tiles will change to show how close
            your guess was to the word.
          </p>
        </div>

        <div className="modal-section">
          <div className="modal-example">
            <div className="modal-example-row">
              <span className="tile tile--green">க</span>
              <span className="tile">ட</span>
              <span className="tile">ல்</span>
            </div>
            <p>
              <strong>Green</strong> &mdash; The letter is in the word and in the correct spot.
            </p>
          </div>

          <div className="modal-example">
            <div className="modal-example-row">
              <span className="tile tile--lightblue">கா</span>
              <span className="tile">ட</span>
              <span className="tile">ல்</span>
            </div>
            <p>
              <strong>Blue</strong> &mdash; The consonant is correct and in the right position, but the vowel attached is different.
            </p>
          </div>

          <div className="modal-example">
            <div className="modal-example-row">
              <span className="tile">கோ</span>
              <span className="tile tile--yellow">ப</span>
              <span className="tile">ம்</span>
            </div>
            <p>
              <strong>Yellow</strong> &mdash; The letter is in the word but in the wrong spot.
            </p>
          </div>

          <div className="modal-example">
            <div className="modal-example-row">
              <span className="tile">க</span>
              <span className="tile">ட</span>
              <span className="tile tile--orange">லா</span>
            </div>
            <p>
              <strong>Orange</strong> &mdash; The consonant is in the word but in the wrong position, with a different vowel attached.
            </p>
          </div>

          <div className="modal-example">
            <div className="modal-example-row">
              <span className="tile">க</span>
              <span className="tile tile--gray">ங்</span>
              <span className="tile">று</span>
            </div>
            <p>
              <strong>Gray</strong> &mdash; The letter is not in the word.
            </p>
          </div>
        </div>

        <p className="modal-note">
          You can type Tamil characters directly or use the on-screen keyboard. Please note that the game does not support English keyboard layouts for Tamil Input.
          Tamil characters may consist of multiple Unicode codepoints &mdash; the game
          handles this automatically using grapheme cluster segmentation. 
        </p>
      </div>
    </div>
  );
}
