function HUD({ score, timeRemaining, targetCharacter, isPaused, onTogglePause }) {
  const seconds = Math.ceil(timeRemaining / 1000);
  const isLowTime = seconds <= 10;

  return (
    <div className="hud">
      <div className="hud-game-label">
        {'\uD83D\uDC3F'} Whack-a-Mole
      </div>

      <div className="hud-stats">
        <div className="hud-stat-card blue">
          <span className="hud-stat-label">Score</span>
          <span className="hud-stat-value">{score}</span>
        </div>

        <div className={`hud-stat-card ${isLowTime ? 'pink' : 'orange'}`}>
          <span className="hud-stat-label">Time</span>
          <span className={`hud-stat-value ${isLowTime ? 'low-time' : ''}`}>
            {seconds}s
          </span>
        </div>

        {targetCharacter && (
          <div className="hud-stat-card purple">
            <span className="hud-stat-label">Find</span>
            <div className="hud-target-display">
              <span className="hud-target-char">{targetCharacter.label}</span>
            </div>
          </div>
        )}

        <button className="hud-pause-btn" onClick={onTogglePause}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
}

export default HUD;
