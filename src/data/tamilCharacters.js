const vowels = [
  { id: 'a', label: 'அ', romanized: 'A', audio: 'vowels/அ.mp3' },
  { id: 'aa', label: 'ஆ', romanized: 'Aa', audio: 'vowels/ஆ.mp3' },
  { id: 'i', label: 'இ', romanized: 'I', audio: 'vowels/இ.mp3' },
  { id: 'ii', label: 'ஈ', romanized: 'Ii', audio: 'vowels/ஈ.mp3' },
  { id: 'u', label: 'உ', romanized: 'U', audio: 'vowels/உ.mp3' },
  { id: 'uu', label: 'ஊ', romanized: 'Uu', audio: 'vowels/ஊ.mp3' },
  { id: 'e', label: 'எ', romanized: 'E', audio: 'vowels/எ.mp3' },
  { id: 'ee', label: 'ஏ', romanized: 'Ee', audio: 'vowels/ஏ.mp3' },
  { id: 'ai', label: 'ஐ', romanized: 'Ai', audio: 'vowels/ஐ.mp3' },
  { id: 'o', label: 'ஒ', romanized: 'O', audio: 'vowels/ஒ.mp3' },
  { id: 'oo', label: 'ஓ', romanized: 'Oo', audio: 'vowels/ஓ.mp3' },
  { id: 'au', label: 'ஔ', romanized: 'Au', audio: 'vowels/ஔ.mp3' },
];

const ayutha = [
  { id: 'ak', label: 'ஃ', romanized: 'Ak', audio: 'special/ஃ.mp3' },
];

const consonants = [
  { id: 'ka', label: 'க', romanized: 'Ka', audio: 'consonants/1.mp3' },
  { id: 'nga', label: 'ங', romanized: 'Nga', audio: 'consonants/2.mp3' },
  { id: 'cha', label: 'ச', romanized: 'Cha', audio: 'consonants/3.mp3' },
  { id: 'nya', label: 'ஞ', romanized: 'Nya', audio: 'consonants/4.mp3' },
  { id: 'ta', label: 'ட', romanized: 'Ta', audio: 'consonants/5.mp3' },
  { id: 'na', label: 'ண', romanized: 'Na', audio: 'consonants/6.mp3' },
  { id: 'tha', label: 'த', romanized: 'Tha', audio: 'consonants/7.mp3' },
  { id: 'nna', label: 'ந', romanized: 'Nna', audio: 'consonants/8.mp3' },
  { id: 'pa', label: 'ப', romanized: 'Pa', audio: 'consonants/9.mp3' },
  { id: 'ma', label: 'ம', romanized: 'Ma', audio: 'consonants/10.mp3' },
  { id: 'ya', label: 'ய', romanized: 'Ya', audio: 'consonants/11.mp3' },
  { id: 'ra', label: 'ர', romanized: 'Ra', audio: 'consonants/12.mp3' },
  { id: 'la', label: 'ல', romanized: 'La', audio: 'consonants/13.mp3' },
  { id: 'va', label: 'வ', romanized: 'Va', audio: 'consonants/14.mp3' },
  { id: 'zha', label: 'ழ', romanized: 'Zha', audio: 'consonants/15.mp3' },
  { id: 'lja', label: 'ள', romanized: 'Lja', audio: 'consonants/16.mp3' },
  { id: 'rra', label: 'ற', romanized: 'Rra', audio: 'consonants/17.mp3' },
  { id: 'nn', label: 'ன', romanized: 'Nn', audio: 'consonants/18.mp3' },
];

// Consonant bases for compound generation
const consonantData = [
  { char: '\u0B95', id: 'ka', romanized: 'Ka' },
  { char: '\u0B99', id: 'nga', romanized: 'Nga' },
  { char: '\u0B9A', id: 'cha', romanized: 'Cha' },
  { char: '\u0B9E', id: 'nya', romanized: 'Nya' },
  { char: '\u0B9F', id: 'ta', romanized: 'Ta' },
  { char: '\u0BA3', id: 'na', romanized: 'Na' },
  { char: '\u0BA4', id: 'tha', romanized: 'Tha' },
  { char: '\u0BA8', id: 'nna', romanized: 'Nna' },
  { char: '\u0BAA', id: 'pa', romanized: 'Pa' },
  { char: '\u0BAE', id: 'ma', romanized: 'Ma' },
  { char: '\u0BAF', id: 'ya', romanized: 'Ya' },
  { char: '\u0BB0', id: 'ra', romanized: 'Ra' },
  { char: '\u0BB2', id: 'la', romanized: 'La' },
  { char: '\u0BB5', id: 'va', romanized: 'Va' },
  { char: '\u0BB4', id: 'zha', romanized: 'Zha' },
  { char: '\u0BB3', id: 'lja', romanized: 'Lja' },
  { char: '\u0BB1', id: 'rra', romanized: 'Rra' },
  { char: '\u0BA9', id: 'nn', romanized: 'Nn' },
];

// Vowel signs for compound generation
const vowelSigns = [
  { sign: '', id: 'a', romanized: 'a' },           // V=1: bare consonant
  { sign: '\u0BBE', id: 'aa', romanized: 'aa' },   // V=2: ா
  { sign: '\u0BBF', id: 'i', romanized: 'i' },     // V=3: ி
  { sign: '\u0BC0', id: 'ii', romanized: 'ii' },   // V=4: ீ
  { sign: '\u0BC1', id: 'u', romanized: 'u' },     // V=5: ு
  { sign: '\u0BC2', id: 'uu', romanized: 'uu' },   // V=6: ூ
  { sign: '\u0BC6', id: 'e', romanized: 'e' },     // V=7: ெ
  { sign: '\u0BC7', id: 'ee', romanized: 'ee' },   // V=8: ே
  { sign: '\u0BC8', id: 'ai', romanized: 'ai' },   // V=9: ை
  { sign: '\u0BCA', id: 'o', romanized: 'o' },     // V=10: ொ
  { sign: '\u0BCB', id: 'oo', romanized: 'oo' },   // V=11: ோ
  { sign: '\u0BCC', id: 'au', romanized: 'au' },   // V=12: ௌ
];

// Generate all 216 compound letters (18 consonants x 12 vowels)
const compound = [];
for (let c = 0; c < consonantData.length; c++) {
  const cons = consonantData[c];
  for (let v = 0; v < vowelSigns.length; v++) {
    const vowel = vowelSigns[v];
    const cIndex = c + 1; // 1-based consonant index
    const vIndex = v + 1; // 1-based vowel index
    const romanized = vowel.id === 'a'
      ? cons.romanized
      : cons.romanized.replace(/a$/, '') + vowel.romanized;
    compound.push({
      id: `${cons.id}_${vowel.id}`,
      label: cons.char + vowel.sign,
      romanized,
      audio: `compound/${cIndex},${vIndex}.mp3`,
    });
  }
}

export const characterSets = {
  vowels,
  ayutha,
  consonants,
  compound,
  all: [...vowels, ...ayutha, ...consonants, ...compound],
};
