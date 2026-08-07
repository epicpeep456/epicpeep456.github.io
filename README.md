# Tamil Whack-a-Mole

Learn the Tamil alphabet by whacking moles. A target character is shown in the HUD — find and click the matching mole before it disappears.

## Getting Started

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

## How to Play

1. Choose a character set (Vowels, Consonants, Compound Letters, or All)
2. Pick a difficulty
3. Click the correct moles as they pop up
4. Correct hits score +10, wrong hits cost -5

## Features

- **247 Tamil characters** — 12 vowels, 18 consonants, 216 compound letters, 1 special character (Ayutha)
- **3 difficulty modes** — Easy, Medium, Hard with tuned timings
- **4×4 grid** with procedural canvas rendering (no sprites or frameworks)
- **Audio feedback** — pronunciation on correct hit (requires audio files in `public/audio/`)
- **60-second rounds** with score tracking

## Tech Stack

- React 19
- HTML5 Canvas 2D
- Vanilla JavaScript game engine (~280 lines)

## Project Structure

```
src/
├── App.js                  # Screen router (menu → game → gameover)
├── components/
│   ├── Menu.js             # Character set & difficulty selector
│   ├── Game.js             # Canvas rendering & game loop
│   └── HUD.js              # Score, timer, target display
├── data/
│   └── tamilCharacters.js  # Tamil character data
└── game/
    └── engine.js           # Game logic, spawning, hit detection
```

## Adding Audio

Place `.mp3` files in `public/audio/` named to match character IDs (e.g., `ka.mp3`, `a.mp3`).

## License

MIT
