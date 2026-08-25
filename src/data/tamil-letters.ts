/**
 * Tamil letter data module for the Compound Letter Raindrop Game.
 * Contains all 18 consonants, 12 vowels, 12 vowel signs, and 216 compound letters.
 */

export const TAMIL_CONSONANTS = [
  { char: '\u0B95', name: 'ka', transliteration: 'k' },
  { char: '\u0B99', name: 'nga', transliteration: 'ng' },
  { char: '\u0B9A', name: 'cha', transliteration: 'ch' },
  { char: '\u0B9E', name: 'nja', transliteration: 'nj' },
  { char: '\u0B9F', name: 'tta', transliteration: 'tt' },
  { char: '\u0BA3', name: 'nna', transliteration: 'nn' },
  { char: '\u0BA4', name: 'tha', transliteration: 'th' },
  { char: '\u0BA8', name: 'na', transliteration: 'n' },
  { char: '\u0BAA', name: 'pa', transliteration: 'p' },
  { char: '\u0BAE', name: 'ma', transliteration: 'm' },
  { char: '\u0BAF', name: 'ya', transliteration: 'y' },
  { char: '\u0BB0', name: 'ra', transliteration: 'r' },
  { char: '\u0BB2', name: 'la', transliteration: 'l' },
  { char: '\u0BB4', name: 'zha', transliteration: 'zh' },
  { char: '\u0BB3', name: 'lla', transliteration: 'll' },
  { char: '\u0BB1', name: 'rra', transliteration: 'rr' },
  { char: '\u0BA9', name: 'na2', transliteration: 'n2' },
  { char: '\u0BB5', name: 'va', transliteration: 'v' },
] as const;

export const TAMIL_VOWELS = [
  { char: '\u0B85', name: 'a', transliteration: 'a' },
  { char: '\u0B86', name: 'aa', transliteration: 'aa' },
  { char: '\u0B87', name: 'i', transliteration: 'i' },
  { char: '\u0B88', name: 'ii', transliteration: 'ii' },
  { char: '\u0B89', name: 'u', transliteration: 'u' },
  { char: '\u0B8A', name: 'uu', transliteration: 'uu' },
  { char: '\u0B8E', name: 'e', transliteration: 'e' },
  { char: '\u0B8F', name: 'ee', transliteration: 'ee' },
  { char: '\u0B90', name: 'ai', transliteration: 'ai' },
  { char: '\u0B92', name: 'o', transliteration: 'o' },
  { char: '\u0B93', name: 'oo', transliteration: 'oo' },
  { char: '\u0B94', name: 'au', transliteration: 'au' },
] as const;

/** Vowel signs (matras) corresponding to each vowel. null = inherent அ. */
export const TAMIL_VOWEL_SIGNS = [
  null,        // inherent அ
  '\u0BBE',    // ா aa
  '\u0BBF',    // ி i
  '\u0BC0',    // ீ ii
  '\u0BC1',    // ு u
  '\u0BC2',    // ூ uu
  '\u0BC6',    // ெ e
  '\u0BC7',    // ே ee
  '\u0BC8',    // ை ai
  '\u0BCA',    // ொ o
  '\u0BCB',    // ோ oo
  '\u0BCC',    // ௌ au
] as const;

/** Virama (pulli) marker U+0BCD - suppresses inherent vowel. */
export const VIRAMA = '\u0BCD';

interface TamilCompound {
  readonly consonant: string;
  readonly vowel: string;
  readonly compound: string;
  readonly consonantIndex: number;
  readonly vowelIndex: number;
}

let _compounds: TamilCompound[] | undefined;

/**
 * Generate all 216 Tamil compound letters (18 consonants x 12 vowels).
 * Results are cached after first call.
 */
export function generateAllCompounds(): TamilCompound[] {
  if (_compounds !== undefined) return _compounds;

  const result: TamilCompound[] = [];
  for (let ci = 0; ci < TAMIL_CONSONANTS.length; ci++) {
    const consonant = TAMIL_CONSONANTS[ci];
    for (let vi = 0; vi < TAMIL_VOWELS.length; vi++) {
      const vowelSign = TAMIL_VOWEL_SIGNS[vi];
      const compound =
        vowelSign === null ? consonant.char : consonant.char + vowelSign;
      result.push({
        consonant: consonant.char,
        vowel: TAMIL_VOWELS[vi].char,
        compound,
        consonantIndex: ci,
        vowelIndex: vi,
      });
    }
  }
  _compounds = result;
  return result;
}

/**
 * Get a single compound letter by consonant and vowel indices.
 */
export function getCompoundLetter(
  consonantIndex: number,
  vowelIndex: number,
): string {
  const vowelSign = TAMIL_VOWEL_SIGNS[vowelIndex];
  const consonantChar = TAMIL_CONSONANTS[consonantIndex].char;
  return vowelSign === null ? consonantChar : consonantChar + vowelSign;
}

/**
 * Pick `count` random distractor compounds that differ from `correctCompound`.
 * Uses rejection sampling from the full 216-compound set.
 */
export function getRandomDistractors(
  correctCompound: string,
  count: number,
): string[] {
  const all = generateAllCompounds();
  const picked: string[] = [];
  const maxAttempts = count * 20;
  let attempts = 0;

  while (picked.length < count && attempts < maxAttempts) {
    const idx = Math.floor(Math.random() * all.length);
    const candidate = all[idx].compound;
    if (candidate !== correctCompound && !picked.includes(candidate)) {
      picked.push(candidate);
    }
    attempts++;
  }

  return picked;
}
