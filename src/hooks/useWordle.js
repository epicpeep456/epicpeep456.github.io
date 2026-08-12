import { useState, useCallback, useRef, useMemo } from 'react';
import {
  getValidAnswers,
  getWordDefinitions,
  getWordPronunciations,
  DIFFICULTY_CONFIG,
  MAX_GUESSES,
  getGraphemes,
  getBaseConsonant,
  isCombiningMark,
  isConsonant,
  STATUS,
} from '../constants';

// Pick a random answer from a given list
function getRandomAnswer(validAnswers) {
  return validAnswers[Math.floor(Math.random() * validAnswers.length)];
}

// Evaluate a guess against the answer using Wordle rules on grapheme clusters
// Returns an array of { grapheme, status } for each position
function evaluateGuess(guessGraphemes, answerGraphemes, wordLength) {
  const result = guessGraphemes.map((g) => ({ grapheme: g, status: STATUS.ABSENT }));
  const answerUsed = new Array(wordLength).fill(false);
  const guessUsed = new Array(wordLength).fill(false);

  // Pass 1: exact matches (green)
  for (let i = 0; i < wordLength; i++) {
    if (guessGraphemes[i] === answerGraphemes[i]) {
      result[i].status = STATUS.CORRECT;
      answerUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Pass 2: same consonant, correct position, different matra (light blue)
  for (let i = 0; i < wordLength; i++) {
    if (guessUsed[i]) continue;
    const guessConsonant = getBaseConsonant(guessGraphemes[i]);
    if (!guessConsonant) continue;
    const answerConsonant = getBaseConsonant(answerGraphemes[i]);
    if (guessConsonant === answerConsonant && !answerUsed[i]) {
      result[i].status = STATUS.EXACT_CONSONANT;
      answerUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Pass 3: present but wrong position (yellow)
  for (let i = 0; i < wordLength; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < wordLength; j++) {
      if (answerUsed[j]) continue;
      if (guessGraphemes[i] === answerGraphemes[j]) {
        result[i].status = STATUS.PRESENT;
        answerUsed[j] = true;
        break;
      }
    }
  }

  // Pass 4: same base consonant but wrong position (orange)
  for (let i = 0; i < wordLength; i++) {
    if (guessUsed[i]) continue;
    const guessConsonant = getBaseConsonant(guessGraphemes[i]);
    if (!guessConsonant) continue;
    for (let j = 0; j < wordLength; j++) {
      if (answerUsed[j]) continue;
      const answerConsonant = getBaseConsonant(answerGraphemes[j]);
      if (guessConsonant === answerConsonant) {
        result[i].status = STATUS.PARTIAL;
        answerUsed[j] = true;
        break;
      }
    }
  }

  return result;
}

async function validateTamilWord(word) {
  const titleUrl =
    'https://en.wiktionary.org/w/api.php?action=query&titles=' +
    encodeURIComponent(word) +
    '&format=json&origin=*';
  const resp = await fetch(titleUrl);
  if (!resp.ok) throw new Error('Network error');
  const data = await resp.json();
  const valid = !('-1' in data.query.pages);

  let definition = null;
  if (valid) {
    try {
      const defResp = await fetch(
        'https://en.wiktionary.org/api/rest_v1/page/definition/' +
        encodeURIComponent(word)
      );
      if (defResp.ok) {
        const defData = await defResp.json();
        const langEntries = defData.ta || Object.values(defData)[0];
        if (langEntries && langEntries[0]?.definitions?.[0]?.definition) {
          definition = langEntries[0].definitions[0].definition
            .replace(/<[^>]+>/g, '')
            .trim();
        }
      }
    } catch {}
  }

  return { valid, definition };
}

export function useWordle(difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const wordLength = config ? config.wordLength : 3;

  // Memoize per-difficulty data
  const validAnswers = useMemo(() => getValidAnswers(difficulty), [difficulty]);
  const wordDefinitions = useMemo(() => getWordDefinitions(difficulty), [difficulty]);
  const wordPronunciations = useMemo(() => getWordPronunciations(difficulty), [difficulty]);

  const [answer, setAnswer] = useState(() => getRandomAnswer(validAnswers));
  const [guesses, setGuesses] = useState([]);         // array of { word, evaluation }
  const [currentGuess, setCurrentGuess] = useState(''); // current typed Tamil string
  const [gameStatus, setGameStatus] = useState('playing'); // playing | won | lost
  const [toast, setToast] = useState(null);              // { message, type }
  const [revealing, setRevealing] = useState(false);     // true during flip animation
  const [pendingConsonant, setPendingConsonant] = useState(null); // consonant awaiting matra
  const [validating, setValidating] = useState(false);
  const toastTimeout = useRef(null);
  const definitionCache = useRef({});
  const answerGraphemes = getGraphemes(answer);

  const showToast = useCallback((message, type = 'info', persist = false) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, type });
    if (!persist) {
      toastTimeout.current = setTimeout(() => setToast(null), 1500);
    }
  }, []);

  const addLetter = useCallback(
    (letter) => {
      if (gameStatus !== 'playing' || revealing) return;

      // Combining marks (matras/pulli): append to modify last grapheme — no count limit
      if (isCombiningMark(letter)) {
        setCurrentGuess((prev) => prev + letter);
        setPendingConsonant(null);
        return;
      }

      // Normal character (consonant/vowel/special): subject to wordLength limit
      setCurrentGuess((prev) => {
        const graphemes = getGraphemes(prev);
        if (graphemes.length >= wordLength) return prev;
        return prev + letter;
      });

      // Track consonant for matra mode
      if (isConsonant(letter)) {
        setPendingConsonant(letter);
      } else {
        setPendingConsonant(null);
      }
    },
    [gameStatus, revealing, wordLength]
  );

  const deleteLetter = useCallback(() => {
    if (gameStatus !== 'playing' || revealing) return;
    setCurrentGuess((prev) => {
      if (!prev) return prev;
      const graphemes = getGraphemes(prev);
      graphemes.pop();
      return graphemes.join('');
    });
    setPendingConsonant(null);
  }, [gameStatus, revealing]);

  const submitGuess = useCallback(async () => {
    setPendingConsonant(null);

    if (gameStatus !== 'playing' || revealing || validating) return;
    const guessGraphemes = getGraphemes(currentGuess);

    if (guessGraphemes.length < wordLength) {
      showToast('Not enough letters');
      return;
    }

    const guessWord = guessGraphemes.join('');

    setValidating(true);
    showToast('Checking word...', 'info', true);

    let isValid = false;
    let wiktionaryDef = null;
    try {
      const result = await validateTamilWord(guessWord);
      isValid = result.valid;
      wiktionaryDef = result.definition;
    } catch {
      setValidating(false);
      setToast(null);
      showToast('Could not verify word. Try again.');
      return;
    }

    if (!isValid) {
      setValidating(false);
      setToast(null);
      showToast('Not a valid Tamil word');
      return;
    }

    setValidating(false);
    setToast(null);

    if (wiktionaryDef) {
      definitionCache.current[guessWord] = wiktionaryDef;
    }

    const evaluation = evaluateGuess(guessGraphemes, answerGraphemes, wordLength);
    const newGuesses = [...guesses, { word: guessWord, evaluation }];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setRevealing(true);

    setTimeout(() => {
      setRevealing(false);
      if (guessWord === answer) {
        setGameStatus('won');
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
        showToast(messages[newGuesses.length - 1] || 'Nice!', 'success');
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus('lost');
        showToast(answer, 'reveal');
      }
    }, wordLength * 500 + 200);

    return {
      word: guessWord,
      definition: wordDefinitions[guessWord] || definitionCache.current[guessWord] || null,
      pronunciation: wordPronunciations[guessWord] || null,
    };
  }, [gameStatus, revealing, validating, currentGuess, answer, answerGraphemes, guesses, showToast, wordLength, wordDefinitions, wordPronunciations]);

  const resetGame = useCallback(() => {
    setAnswer(getRandomAnswer(validAnswers));
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setToast(null);
    setRevealing(false);
    setPendingConsonant(null);
  }, [validAnswers]);

  // Compute keyboard color statuses from all submitted guesses
  const keyStatuses = useCallback(() => {
    const statuses = {};
    const priority = { [STATUS.CORRECT]: 4, [STATUS.EXACT_CONSONANT]: 3, [STATUS.PRESENT]: 2, [STATUS.PARTIAL]: 1, [STATUS.ABSENT]: 0 };
    for (const guess of guesses) {
      for (const { grapheme, status } of guess.evaluation) {
        const existing = statuses[grapheme];
        if (!existing || priority[status] > priority[existing]) {
          statuses[grapheme] = status;
        }
      }
    }
    return statuses;
  }, [guesses]);

  const getWordDefinition = useCallback((word) => {
    const localDef = wordDefinitions[word];
    if (localDef) return { definition: localDef, pronunciation: wordPronunciations[word] || null };
    const cached = definitionCache.current[word];
    if (cached) return { definition: cached, pronunciation: null };
    return null;
  }, [wordDefinitions, wordPronunciations]);

  return {
    answer,
    answerDefinition: wordDefinitions[answer] || definitionCache.current[answer] || null,
    answerPronunciation: wordPronunciations[answer] || null,
    currentGuess,
    guesses,
    gameStatus,
    toast,
    revealing,
    validating,
    keyStatuses: keyStatuses(),
    pendingConsonant,
    wordLength,
    addLetter,
    deleteLetter,
    submitGuess,
    resetGame,
    showToast,
    getWordDefinition,
  };
}
