export type Difficulty = 'easy' | 'medium' | 'hard';

export type GamePhase = 'start' | 'playing' | 'paused' | 'gameover';

export interface DropState {
  id: string;
  consonantIndex: number;
  vowelIndex: number;
  consonantChar: string;
  vowelChar: string;
  correctCompound: string;
  startTime: number;
  status: 'falling' | 'popped' | 'splashed' | 'wrong';
}

export interface DifficultyConfig {
  fallDuration: number;
  spawnIntervalMin: number;
  spawnIntervalMax: number;
  maxConcurrentDrops: number;
  label: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { fallDuration: 7000, spawnIntervalMin: 400, spawnIntervalMax: 1000, maxConcurrentDrops: 6, label: 'Easy' },
  medium: { fallDuration: 5000, spawnIntervalMin: 300, spawnIntervalMax: 800, maxConcurrentDrops: 8, label: 'Medium' },
  hard: { fallDuration: 4000, spawnIntervalMin: 200, spawnIntervalMax: 500, maxConcurrentDrops: 12, label: 'Hard' },
};

export interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  score: number;
  combo: number;
  timeRemaining: number;
  drops: DropState[];
  targetCompound: string;
  targetConsonant: string;
  targetVowel: string;
  inputFrozen: boolean;
}
