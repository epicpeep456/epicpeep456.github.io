import {
  createGameState,
  updateGameState,
  handleClick,
  HOLE_WIDTH,
  HOLE_HEIGHT,
  MOLE_WIDTH,
  MOLE_HEIGHT,
  STATES,
} from './engine';

const testCharacters = [
  { id: 'a', label: 'அ', romanized: 'A', audio: 'a.mp3' },
  { id: 'aa', label: 'ஆ', romanized: 'Aa', audio: 'aa.mp3' },
  { id: 'ka', label: 'க', romanized: 'Ka', audio: 'ka.mp3' },
  { id: 'kaa', label: 'கா', romanized: 'Kaa', audio: 'kaa.mp3' },
  { id: 'i', label: 'இ', romanized: 'I', audio: 'i.mp3' },
];

describe('createGameState', () => {
  test('returns initial state with correct structure', () => {
    const state = createGameState(testCharacters, 'medium');

    expect(state.characters).toBe(testCharacters);
    expect(state.difficulty).toBe('medium');
    expect(state.score).toBe(0);
    expect(state.timeRemaining).toBe(60000);
    expect(state.gameOver).toBe(false);
    expect(state.holes).toHaveLength(16);
    expect(state.moles).toHaveLength(16);
    expect(state.hitEffects).toEqual([]);
    expect(state.wrongHitEffects).toEqual([]);
    expect(state.targetCharacter).toBeDefined();
    expect(testCharacters).toContainEqual(state.targetCharacter);
  });

  test('creates 16 holes in a 4x4 grid', () => {
    const state = createGameState(testCharacters, 'medium');

    // First hole at (190, 195), spacing 140x130
    expect(state.holes[0]).toEqual({ x: 190, y: 195 });
    expect(state.holes[3]).toEqual({ x: 190 + 3 * 140, y: 195 }); // last col row 0
    expect(state.holes[4]).toEqual({ x: 190, y: 195 + 130 }); // first col row 1
    expect(state.holes[15]).toEqual({ x: 190 + 3 * 140, y: 195 + 3 * 130 }); // last hole
  });

  test('all moles start as hidden', () => {
    const state = createGameState(testCharacters, 'medium');
    state.moles.forEach((mole) => {
      expect(mole.state).toBe(STATES.HIDDEN);
      expect(mole.character).toBeNull();
      expect(mole.isTarget).toBe(false);
      expect(mole.hit).toBe(false);
    });
  });

  test('applies easy difficulty preset', () => {
    const state = createGameState(testCharacters, 'easy');
    expect(state.riseDuration).toBe(400);
    expect(state.visibleDuration).toBe(2500);
    expect(state.fallDuration).toBe(300);
    expect(state.molesPerBatch).toBe(4);
  });

  test('applies medium difficulty preset', () => {
    const state = createGameState(testCharacters, 'medium');
    expect(state.riseDuration).toBe(300);
    expect(state.visibleDuration).toBe(2000);
    expect(state.fallDuration).toBe(250);
    expect(state.molesPerBatch).toBe(5);
  });

  test('applies hard difficulty preset', () => {
    const state = createGameState(testCharacters, 'hard');
    expect(state.riseDuration).toBe(200);
    expect(state.visibleDuration).toBe(1200);
    expect(state.fallDuration).toBe(200);
    expect(state.molesPerBatch).toBe(7);
  });

  test('defaults to medium if invalid difficulty given', () => {
    const state = createGameState(testCharacters, 'invalid');
    expect(state.riseDuration).toBe(300);
    expect(state.visibleDuration).toBe(2000);
    expect(state.fallDuration).toBe(250);
  });

  test('returns paused as false by default', () => {
    const state = createGameState(testCharacters, 'medium');
    expect(state.paused).toBe(false);
  });
});

describe('updateGameState', () => {
  test('decrements time remaining', () => {
    const state = createGameState(testCharacters, 'medium');
    const initial = state.timeRemaining;
    updateGameState(state, 1000);
    expect(state.timeRemaining).toBe(initial - 1000);
  });

  test('sets gameOver when time runs out', () => {
    const state = createGameState(testCharacters, 'medium');
    state.timeRemaining = 500;
    updateGameState(state, 600);
    expect(state.gameOver).toBe(true);
    expect(state.timeRemaining).toBe(0);
  });

  test('does not go below zero time', () => {
    const state = createGameState(testCharacters, 'medium');
    updateGameState(state, 999999);
    expect(state.timeRemaining).toBe(0);
    expect(state.gameOver).toBe(true);
  });

  test('does not update when game is over', () => {
    const state = createGameState(testCharacters, 'medium');
    state.gameOver = true;
    state.timeRemaining = 10000;
    updateGameState(state, 1000);
    // timeRemaining should not change because gameOver is true (early return)
    expect(state.timeRemaining).toBe(10000);
  });

  test('spawns moles after spawn timer elapses', () => {
    const state = createGameState(testCharacters, 'medium');
    state.nextSpawnTime = 500;
    state.spawnTimer = 0;

    // Advance past spawn time
    updateGameState(state, 600);

    const activeMoles = state.moles.filter((m) => m.state !== STATES.HIDDEN);
    // medium has 5 moles per batch, but spawn might need multiple ticks
    // After first spawn, there should be some active moles
    expect(activeMoles.length).toBeGreaterThan(0);
    expect(activeMoles.length).toBeLessThanOrEqual(state.molesPerBatch);
  });

  test('does not spawn while moles are active', () => {
    const state = createGameState(testCharacters, 'medium');
    state.nextSpawnTime = 0;

    // Trigger first spawn
    updateGameState(state, 1);
    const firstBatchCount = state.moles.filter((m) => m.state !== STATES.HIDDEN).length;
    expect(firstBatchCount).toBeGreaterThan(0);

    // Keep moles alive by advancing small amounts, and trigger another spawn
    state.spawnTimer = state.nextSpawnTime + 1;
    updateGameState(state, 1);
    // Should not have spawned a second batch since moles are still active
    expect(state.moles.filter((m) => m.state !== STATES.HIDDEN).length).toBe(firstBatchCount);
  });

  test('mole lifecycle: hidden -> rising -> visible -> falling -> hidden', () => {
    const state = createGameState(testCharacters, 'medium');
    const moleIdx = 0;
    const mole = state.moles[moleIdx];
    const hole = state.holes[moleIdx];

    // Manually set mole to RISING state (simulating spawn)
    mole.state = STATES.RISING;
    mole.timer = 0;
    mole.x = hole.x;
    mole.y = hole.y;
    mole.riseY = hole.y;
    mole.character = testCharacters[0];
    mole.isTarget = true;

    // Phase 1: RISING
    expect(mole.state).toBe(STATES.RISING);
    updateGameState(state, state.riseDuration / 2);
    // Should still be rising at halfway
    expect(mole.state).toBe(STATES.RISING);
    expect(mole.riseY).toBeLessThan(mole.y);

    // Complete rising
    updateGameState(state, state.riseDuration);
    expect(mole.state).toBe(STATES.VISIBLE);

    // Phase 2: VISIBLE
    updateGameState(state, 100);
    expect(mole.state).toBe(STATES.VISIBLE);

    // Complete visible phase
    updateGameState(state, state.visibleDuration);
    expect(mole.state).toBe(STATES.FALLING);

    // Phase 3: FALLING
    const fallingStartY = mole.riseY;
    updateGameState(state, state.fallDuration / 2);
    expect(mole.state).toBe(STATES.FALLING);

    // Complete falling
    updateGameState(state, state.fallDuration);
    expect(mole.state).toBe(STATES.HIDDEN);
    expect(mole.character).toBeNull();
    expect(mole.isTarget).toBe(false);
    expect(mole.hit).toBe(false);
  });

  test('hitEffects expire after 600ms', () => {
    const state = createGameState(testCharacters, 'medium');
    state.hitEffects = [{ x: 100, y: 100, timer: 0 }];
    updateGameState(state, 300);
    expect(state.hitEffects).toHaveLength(1);
    updateGameState(state, 400);
    expect(state.hitEffects).toHaveLength(0);
  });

  test('wrongHitEffects expire after 400ms', () => {
    const state = createGameState(testCharacters, 'medium');
    state.wrongHitEffects = [{ x: 100, y: 100, timer: 0 }];
    updateGameState(state, 200);
    expect(state.wrongHitEffects).toHaveLength(1);
    updateGameState(state, 300);
    expect(state.wrongHitEffects).toHaveLength(0);
  });

  test('does not update when paused', () => {
    const state = createGameState(testCharacters, 'medium');
    const initialTime = state.timeRemaining;
    state.paused = true;
    updateGameState(state, 1000);
    expect(state.timeRemaining).toBe(initialTime);
  });
});

describe('handleClick', () => {
  function setupVisibleMole(state, moleIndex, isTarget) {
    const mole = state.moles[moleIndex];
    const hole = state.holes[moleIndex];
    mole.state = STATES.VISIBLE;
    mole.x = hole.x;
    mole.y = hole.y;
    mole.riseY = hole.y - MOLE_HEIGHT; // fully risen
    mole.character = state.characters[0];
    mole.isTarget = isTarget;
    mole.hit = false;
    mole.timer = 0;
    return { mole, hole };
  }

  test('returns null for empty space with no moles', () => {
    const state = createGameState(testCharacters, 'medium');
    const result = handleClick(state, 0, 0);
    expect(result).toBeNull();
  });

  test('detects target hit and adds 10 points', () => {
    const state = createGameState(testCharacters, 'medium');
    state.targetCharacter = testCharacters[0];
    const { mole } = setupVisibleMole(state, 0, true);

    const result = handleClick(state, mole.x, mole.y - MOLE_HEIGHT / 2);

    expect(result).toEqual(testCharacters[0]);
    expect(state.score).toBe(10);
    expect(state.hitEffects).toHaveLength(1);
  });

  test('target hit causes all active moles to fall', () => {
    const state = createGameState(testCharacters, 'medium');
    state.targetCharacter = testCharacters[0];
    setupVisibleMole(state, 0, true);
    setupVisibleMole(state, 1, false);
    setupVisibleMole(state, 2, false);

    handleClick(state, state.moles[0].x, state.moles[0].y - MOLE_HEIGHT / 2);

    // All visible moles should now be falling
    expect(state.moles[0].state).toBe(STATES.FALLING);
    expect(state.moles[1].state).toBe(STATES.FALLING);
    expect(state.moles[2].state).toBe(STATES.FALLING);
    // Hidden moles should not be affected
    expect(state.moles[3].state).toBe(STATES.HIDDEN);
  });

  test('target hit picks a new target character', () => {
    const state = createGameState(testCharacters, 'medium');
    const oldTarget = state.targetCharacter;
    state.targetCharacter = testCharacters[0];
    setupVisibleMole(state, 0, true);

    handleClick(state, state.moles[0].x, state.moles[0].y - MOLE_HEIGHT / 2);

    expect(state.targetCharacter).toBeDefined();
    // New target should be from the character set
    expect(state.characters).toContainEqual(state.targetCharacter);
  });

  test('detects wrong hit and subtracts 5 points', () => {
    const state = createGameState(testCharacters, 'medium');
    state.score = 20;
    const { mole } = setupVisibleMole(state, 0, false);

    const result = handleClick(state, mole.x, mole.y - MOLE_HEIGHT / 2);

    expect(result).toBeNull();
    expect(state.score).toBe(15);
    expect(state.wrongHitEffects).toHaveLength(1);
  });

  test('wrong hit score does not go below 0', () => {
    const state = createGameState(testCharacters, 'medium');
    state.score = 3;
    setupVisibleMole(state, 0, false);

    handleClick(state, state.moles[0].x, state.moles[0].y - MOLE_HEIGHT / 2);

    expect(state.score).toBe(0);
  });

  test('wrong hit only affects clicked mole, not others', () => {
    const state = createGameState(testCharacters, 'medium');
    setupVisibleMole(state, 0, false);
    setupVisibleMole(state, 1, false);

    handleClick(state, state.moles[0].x, state.moles[0].y - MOLE_HEIGHT / 2);

    expect(state.moles[0].state).toBe(STATES.FALLING);
    expect(state.moles[1].state).toBe(STATES.VISIBLE); // unaffected
  });

  test('returns null when game is over', () => {
    const state = createGameState(testCharacters, 'medium');
    state.gameOver = true;
    setupVisibleMole(state, 0, true);

    const result = handleClick(state, state.moles[0].x, state.moles[0].y - MOLE_HEIGHT / 2);
    expect(result).toBeNull();
  });

  test('returns null when clicking a hidden mole', () => {
    const state = createGameState(testCharacters, 'medium');
    // Mole 0 is hidden, click at its hole position
    const hole = state.holes[0];
    const result = handleClick(state, hole.x, hole.y);
    expect(result).toBeNull();
  });

  test('click coordinates are correctly detected within mole bounds', () => {
    const state = createGameState(testCharacters, 'medium');
    const { mole } = setupVisibleMole(state, 0, true);

    // Click at the left edge of the mole
    const leftEdge = mole.x - MOLE_WIDTH / 2;
    const result1 = handleClick(state, leftEdge + 1, mole.riseY + 10);
    expect(result1).toBeTruthy();

    // Click at the right edge of the mole
    const rightEdge = mole.x + MOLE_WIDTH / 2;
    // Reset mole for second test
    setupVisibleMole(state, 0, true);
    const result2 = handleClick(state, rightEdge - 1, mole.riseY + 10);
    expect(result2).toBeTruthy();
  });

  test('click outside mole bounds returns null', () => {
    const state = createGameState(testCharacters, 'medium');
    const { mole } = setupVisibleMole(state, 0, true);

    // Click well to the right of the mole
    const result = handleClick(state, mole.x + MOLE_WIDTH, mole.riseY + 10);
    expect(result).toBeNull();
  });

  test('returns null when paused', () => {
    const state = createGameState(testCharacters, 'medium');
    state.paused = true;
    // Setup a visible mole at known position
    const mole = state.moles[0];
    const hole = state.holes[0];
    mole.state = STATES.VISIBLE;
    mole.x = hole.x;
    mole.y = hole.y;
    mole.riseY = hole.y - MOLE_HEIGHT;
    mole.character = state.characters[0];
    mole.isTarget = true;
    mole.hit = false;

    const result = handleClick(state, mole.x, mole.y - MOLE_HEIGHT / 2);
    expect(result).toBeNull();
    expect(state.score).toBe(0); // score should not change
  });
});

describe('constants', () => {
  test('grid dimensions are 4x4', () => {
    const state = createGameState(testCharacters, 'medium');
    expect(state.holes).toHaveLength(16);
  });

  test('first hole is at expected position', () => {
    const state = createGameState(testCharacters, 'medium');
    expect(state.holes[0]).toEqual({ x: 190, y: 195 });
  });

  test('exports expected constants', () => {
    expect(HOLE_WIDTH).toBe(90);
    expect(HOLE_HEIGHT).toBe(30);
    expect(MOLE_WIDTH).toBe(60);
    expect(MOLE_HEIGHT).toBe(70);
    expect(STATES).toEqual({
      HIDDEN: 'hidden',
      RISING: 'rising',
      VISIBLE: 'visible',
      FALLING: 'falling',
    });
  });
});