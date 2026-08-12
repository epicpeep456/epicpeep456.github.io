// Tamil Wordle — Constants

import WORDS_DATA from './data/words.json';

export { WORDS_DATA };

// Difficulty configuration
export const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', wordLength: 2, description: '2 characters' },
  medium: { label: 'Medium', wordLength: 3, description: '3 characters' },
  hard: { label: 'Hard', wordLength: 4, description: '4 characters' },
  challenge: { label: 'Challenge', wordLength: 5, description: '5 characters' },
};

export const DIFFICULTIES = Object.keys(DIFFICULTY_CONFIG);

// Get words for a specific difficulty (word length)
export function getWordsForDifficulty(difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  if (!config) return {};
  return WORDS_DATA[String(config.wordLength)] || {};
}

// Get all word entries for a difficulty (flat array)
export function getEntriesForDifficulty(difficulty) {
  const wordsByCategory = getWordsForDifficulty(difficulty);
  return Object.values(wordsByCategory).flat();
}

// Get valid answers for a difficulty
export function getValidAnswers(difficulty) {
  return getEntriesForDifficulty(difficulty).map((e) => e.word);
}

// Get word definitions map for a difficulty
export function getWordDefinitions(difficulty) {
  return Object.fromEntries(
    getEntriesForDifficulty(difficulty).map((e) => [e.word, e.definition])
  );
}

// Get word pronunciations map for a difficulty
export function getWordPronunciations(difficulty) {
  return Object.fromEntries(
    getEntriesForDifficulty(difficulty).map((e) => [e.word, e.pronunciation])
  );
}

export const MAX_GUESSES = 6;

const segmenter = new Intl.Segmenter('ta', { granularity: 'grapheme' });

export function getGraphemes(str) {
  return [...segmenter.segment(str)].map((s) => s.segment);
}

const COMBINING_MARKS = new Set(['்', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ']);

export function isCombiningMark(char) {
  return COMBINING_MARKS.has(char);
}

export const TAMIL_CONSONANTS = new Set([
  'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம',
  'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன',
  'ஜ', 'ஷ', 'ஸ', 'ஹ',
]);

export function isConsonant(char) {
  return TAMIL_CONSONANTS.has(char);
}

export const MATRA_OPTIONS = [
  { mark: '\u0BCD', name: 'pulli' },
  { mark: '\u0BBE', name: 'aa' },
  { mark: '\u0BBF', name: 'i' },
  { mark: '\u0BC0', name: 'ii' },
  { mark: '\u0BC1', name: 'u' },
  { mark: '\u0BC2', name: 'uu' },
  { mark: '\u0BC6', name: 'e' },
  { mark: '\u0BC7', name: 'ee' },
  { mark: '\u0BC8', name: 'ai' },
  { mark: '\u0BCA', name: 'o' },
  { mark: '\u0BCB', name: 'oo' },
  { mark: '\u0BCC', name: 'au' },
];

export const TAMIL_VOWELS = [
  'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ',
];

export const TAMIL_CONSONANTS_ROW1 = [
  'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம',
];

export const TAMIL_CONSONANTS_ROW2 = [
  'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன',
];

export const TAMIL_SPECIAL_ROW = [
  'ஜ', 'ஷ', 'ஸ', 'ஹ',
];

export const ENTER_KEY = 'ENTER';
export const DELETE_KEY = 'DELETE';

export const STATUS = {
  CORRECT: 'correct',
  EXACT_CONSONANT: 'exact_consonant',
  PRESENT: 'present',
  PARTIAL: 'partial',
  ABSENT: 'absent',
  EMPTY: 'empty',
  TYPED: 'typed',
};

// Extract base consonant from a Tamil grapheme (strip combining marks/matras)
export function getBaseConsonant(grapheme) {
  if (!grapheme) return null;
  const chars = [...grapheme];
  const first = chars[0];
  return TAMIL_CONSONANTS.has(first) ? first : null;
}

export const ENGLISH_TO_TAMIL = {
  a: 'அ', q: 'ஆ',
  i: 'இ',
  u: 'உ',
  e: 'எ', E: 'ஏ',
  o: 'ஒ', O: 'ஓ',
  k: 'க', g: 'ங',
  s: 'ச', c: 'ச',
  n: 'ந', N: 'ண',
  t: 'த', T: 'ட',
  p: 'ப',
  m: 'ம',
  y: 'ய',
  r: 'ர',
  l: 'ல', L: 'ள',
  v: 'வ', w: 'வ',
  z: 'ழ',
  j: 'ஜ',
  h: 'ஹ',
};

// English keys → combining marks (matras) for physical keyboard support
export const ENGLISH_TO_MATRA = {
  M: '\u0BC6',   // ெ e
  P: '\u0BC7',   // ே ee
  I: '\u0BBF',   // ி i
  U: '\u0BC1',   // ு u
  D: '\u0BC0',   // ீ ii
  W: '\u0BC2',   // ூ uu
  X: '\u0BC8',   // ை ai
  G: '\u0BCA',   // ொ o
  H: '\u0BCB',   // ோ oo
  J: '\u0BCC',   // ௌ au
  F: '\u0BCD',   // ் pulli
  // Also lowercase for the most common ones
  f: '\u0BCD',   // ் pulli
  d: '\u0BBE',   // ா aa (d for 'aa' since a is taken)
};
