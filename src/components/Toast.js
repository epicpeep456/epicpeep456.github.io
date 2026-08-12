import React, { useEffect, useState } from 'react';
import './Toast.css';

export default function Toast({ message, type, definition, pronunciation }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      const duration = definition ? 3000 : 1300;
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, definition]);

  if (!message) return null;

  let className = 'toast';
  if (type === 'success') className += ' toast--success';
  if (type === 'reveal') className += ' toast--reveal';
  if (definition) className += ' toast--definition';
  if (!visible) className += ' toast--exit';

  return (
    <div className={className} role="alert">
      {definition ? (
        <div className="toast-definition-content">
          <span className="toast-definition-word">{message}</span>
          {pronunciation && <span className="toast-definition-pronunciation">{pronunciation}</span>}
          <span className="toast-definition-text">{definition}</span>
        </div>
      ) : type === 'reveal' ? (
        <div className="toast-reveal">
          <span className="toast-reveal-label">The word was</span>
          <span className="toast-reveal-word">{message}</span>
        </div>
      ) : (
        message
      )}
    </div>
  );
}