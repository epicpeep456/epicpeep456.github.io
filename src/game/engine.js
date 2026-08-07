const HOLE_ROWS = 4;
const HOLE_COLS = 4;
const HOLE_SPACING_X = 140;
const HOLE_SPACING_Y = 130;
const HOLE_START_X = 190;
const HOLE_START_Y = 195;
const HOLE_WIDTH = 90;
const HOLE_HEIGHT = 30;
const MOLE_WIDTH = 60;
const MOLE_HEIGHT = 70;
const ROUND_DURATION = 60000;

const DIFFICULTY_PRESETS = {
  easy: {
    riseDuration: 400,
    visibleDuration: 2500,
    fallDuration: 300,
    spawnIntervalMin: 2000,
    spawnIntervalMax: 3500,
    molesPerBatch: 4,
  },
  medium: {
    riseDuration: 300,
    visibleDuration: 2000,
    fallDuration: 250,
    spawnIntervalMin: 1500,
    spawnIntervalMax: 3000,
    molesPerBatch: 5,
  },
  hard: {
    riseDuration: 200,
    visibleDuration: 1200,
    fallDuration: 200,
    spawnIntervalMin: 800,
    spawnIntervalMax: 1800,
    molesPerBatch: 7,
  },
};

const STATES = {
  HIDDEN: 'hidden',
  RISING: 'rising',
  VISIBLE: 'visible',
  FALLING: 'falling',
};

function getHolePositions() {
  const positions = [];
  for (let row = 0; row < HOLE_ROWS; row++) {
    for (let col = 0; col < HOLE_COLS; col++) {
      positions.push({
        x: HOLE_START_X + col * HOLE_SPACING_X,
        y: HOLE_START_Y + row * HOLE_SPACING_Y,
      });
    }
  }
  return positions;
}

function pickRandomCharacter(characters) {
  return characters[Math.floor(Math.random() * characters.length)];
}

function pickDistractors(characters, target, count) {
  const pool = characters.filter((c) => c.id !== target.id);
  const distractors = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    distractors.push(pool.splice(idx, 1)[0]);
  }
  return distractors;
}

export function createGameState(characters, difficulty = 'medium') {
  const holes = getHolePositions();
  const target = pickRandomCharacter(characters);
  const preset = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.medium;
  return {
    characters,
    difficulty,
    holes,
    moles: holes.map(() => ({
      state: STATES.HIDDEN,
      character: null,
      isTarget: false,
      hit: false,
      timer: 0,
      x: 0,
      y: 0,
      riseY: 0,
    })),
    targetCharacter: target,
    score: 0,
    timeRemaining: ROUND_DURATION,
    spawnTimer: 0,
    nextSpawnTime: 500,
    riseDuration: preset.riseDuration,
    visibleDuration: preset.visibleDuration,
    fallDuration: preset.fallDuration,
    spawnIntervalMin: preset.spawnIntervalMin,
    spawnIntervalMax: preset.spawnIntervalMax,
    molesPerBatch: preset.molesPerBatch,
    gameOver: false,
    paused: false,
    hitEffects: [],
    wrongHitEffects: [],
  };
}

function findEmptyHoles(moles, count) {
  const emptyIndices = [];
  moles.forEach((mole, i) => {
    if (mole.state === STATES.HIDDEN && !mole.hit) {
      emptyIndices.push(i);
    }
  });
  const shuffled = emptyIndices.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function allMolesHidden(moles) {
  return moles.every((m) => m.state === STATES.HIDDEN);
}

function spawnBatch(state) {
  if (!allMolesHidden(state.moles)) return;

  const emptyIndices = findEmptyHoles(state.moles, state.molesPerBatch);
  if (emptyIndices.length === 0) return;

  const target = state.targetCharacter;
  const distractors = pickDistractors(state.characters, target, emptyIndices.length - 1);
  const targetIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  let distractorIndex = 0;
  emptyIndices.forEach((idx) => {
    const hole = state.holes[idx];
    const mole = state.moles[idx];
    mole.state = STATES.RISING;
    mole.timer = 0;
    mole.x = hole.x;
    mole.y = hole.y;
    mole.riseY = hole.y;

    if (idx === targetIdx) {
      mole.character = target;
      mole.isTarget = true;
    } else {
      mole.character = distractors[distractorIndex] || pickRandomCharacter(state.characters);
      mole.isTarget = false;
      distractorIndex++;
    }
  });
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function updateMole(mole, dt, state) {
  switch (mole.state) {
    case STATES.RISING: {
      mole.timer += dt;
      const progress = Math.min(mole.timer / state.riseDuration, 1);
      mole.riseY = mole.y - MOLE_HEIGHT * easeOutCubic(progress);
      if (progress >= 1) {
        mole.state = STATES.VISIBLE;
        mole.timer = 0;
      }
      break;
    }
    case STATES.VISIBLE: {
      mole.timer += dt;
      if (mole.timer >= state.visibleDuration) {
        mole.state = STATES.FALLING;
        mole.timer = 0;
      }
      break;
    }
    case STATES.FALLING: {
      mole.timer += dt;
      const progress = Math.min(mole.timer / state.fallDuration, 1);
      mole.riseY = mole.y - MOLE_HEIGHT * (1 - progress);
      if (progress >= 1) {
        mole.state = STATES.HIDDEN;
        mole.timer = 0;
        mole.character = null;
        mole.isTarget = false;
        mole.hit = false;
      }
      break;
    }
    default:
      break;
  }
}

export function updateGameState(state, dt) {
  if (state.gameOver) return state;
  if (state.paused) return state;

  state.timeRemaining -= dt;
  if (state.timeRemaining <= 0) {
    state.timeRemaining = 0;
    state.gameOver = true;
    return state;
  }

  state.spawnTimer += dt;
  if (state.spawnTimer >= state.nextSpawnTime) {
    spawnBatch(state);
    state.spawnTimer = 0;
    state.nextSpawnTime =
      state.spawnIntervalMin +
      Math.random() * (state.spawnIntervalMax - state.spawnIntervalMin);
  }

  state.moles.forEach((mole) => updateMole(mole, dt, state));

  state.hitEffects = state.hitEffects
    .map((e) => ({ ...e, timer: e.timer + dt }))
    .filter((e) => e.timer < 600);

  state.wrongHitEffects = state.wrongHitEffects
    .map((e) => ({ ...e, timer: e.timer + dt }))
    .filter((e) => e.timer < 400);

  return state;
}

export function handleClick(state, x, y, padding = 0) {
  if (state.gameOver) return null;
  if (state.paused) return null;

  for (let i = 0; i < state.moles.length; i++) {
    const mole = state.moles[i];
    if (mole.state !== STATES.VISIBLE && mole.state !== STATES.RISING) continue;

    const moleLeft = mole.x - MOLE_WIDTH / 2 - padding;
    const moleTop = mole.riseY - padding;
    const moleRight = mole.x + MOLE_WIDTH / 2 + padding;
    const moleBottom = mole.y + padding;

    if (x >= moleLeft && x <= moleRight && y >= moleTop && y <= moleBottom) {
      const wasTarget = mole.isTarget;

      if (wasTarget) {
        state.score += 10;
        state.hitEffects.push({
          x: mole.x,
          y: mole.riseY - 10,
          timer: 0,
          romanized: mole.character.romanized,
        });
        state.targetCharacter = pickRandomCharacter(state.characters);
        state.moles.forEach((m) => {
          if (m.state !== STATES.HIDDEN) {
            m.state = STATES.FALLING;
            m.timer = 0;
            m.hit = true;
          }
        });
      } else {
        state.score = Math.max(0, state.score - 5);
        state.wrongHitEffects.push({
          x: mole.x,
          y: mole.riseY - 10,
          timer: 0,
        });
        mole.state = STATES.FALLING;
        mole.timer = 0;
        mole.hit = true;
      }

      return wasTarget ? mole.character : null;
    }
  }

  return null;
}

export {
  HOLE_WIDTH,
  HOLE_HEIGHT,
  MOLE_WIDTH,
  MOLE_HEIGHT,
  STATES,
};
