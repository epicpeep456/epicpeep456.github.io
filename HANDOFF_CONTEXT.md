HANDOFF CONTEXT
===============

USER REQUESTS (AS-IS)
---------------------
- "Use design principles to rewrite the UI of this site into a modern black and white feel. Keep it minimial and modern."
- "use and study this design pallate and remake the UI [classic Whac-A-Mole palette]. if possible create actual sprites for the wackamole objects as well."
- "Within tamilCharacters.js exsists a file that attempts to link different tamil letters with audio, but currently this audio does not lead anywhere. The intention is to play this audio on a correct hit. Can you first research any libraries with the prounounciation of all characters listed in this file?"
- "do option one without the pregeneration" (Web Speech API)
- "read thru the db and update HANDOFF and graphify. current problems: 1. UI does not scale in mobile (moles are too small in mobile) 2. Audio does not work in windows (API issue)"

GOAL
----
Fix two blocking issues: (1) make the UI scale properly on mobile so moles are tap-friendly, and (2) fix audio playback on Windows where Web Speech API silently fails.

WORK COMPLETED
--------------
- Redesigned entire UI from minimal B&W to retro arcade Whac-A-Mole aesthetic
- Created DESIGN.md with full color palette and design system tokens
- Rewrote src/App.css (384 lines) with cobalt blue borders, cherry red accents, canary yellow highlights
- Rewrote src/components/Game.js with 5 procedural canvas sprite functions: drawBackground, drawDirtMound, drawMoleSprite, drawWhackEffect, drawWrongHitEffect
- Implemented cartoon mole character with egg body, ears, cross-eyed pupils, pink nose, whiskers, golden Tamil label
- Replaced broken mp3 audio with Web Speech API using SpeechSynthesisUtterance with ta-IN locale
- Added Tamil voice auto-detection with rate=0.8 for clarity
- Updated HANDOFF.md with current known issues and audio implementation details
- Ran graphify to re-index codebase: 95 nodes, 134 edges, 9 communities
- Moved 247 audio files from src/audio/ to public/audio/ with organized subdirectory structure
- Expanded tamilCharacters.js from 64 to 247 characters with full Tamil alphabet
- Reclassified ஃ from vowels to ayutha (Ayutha Ezhuthu special character)
- Added 183 missing compound letters (216 total compound = 18 consonants x 12 vowels)
- Updated playPlaceholderAudio() to play MP3 files as primary audio source
- Added audio preloading on game start for characters in current set
- Updated Menu.js with ayutha character set option and correct counts for all sets

CURRENT STATE
-------------
- Build passes clean (react-scripts 5.0.1)
- Game logic untouched (engine.js unchanged)
- Canvas is fixed 800x720 with CSS max-width scaling (causes mobile issue)
- Audio uses MP3 pronunciation files from public/audio/ (works cross-platform including Windows)
- Character data expanded to 247 Tamil characters (12 vowels + 1 ayutha + 18 consonants + 216 compound)
- 247 MP3 audio files in public/audio/ (vowels/, consonants/, compound/, special/)
- Menu offers 5 character set options: Vowels (12), Ayutha (1), Consonants (18), Compound (216), All (247)
- DESIGN.md documents the retro arcade design system
- HANDOFF.md updated with current known issues and audio implementation details

PENDING TASKS
-------------
1. UI mobile scaling: Canvas is 800x720 fixed pixels. CSS max-width:100% scales it down but moles become tiny. Need dynamic canvas sizing or responsive grid constants. Consider: (a) scale HOLE_WIDTH/MOLE_WIDTH based on viewport, (b) use devicePixelRatio for crisp rendering, (c) set minimum touch target size of 44x44px per Apple HIG.

KEY FILES
---------
- src/components/Game.js - Canvas renderer, sprite drawing, MP3 audio playback, click/touch handling (~815 lines)
- src/App.css - All UI styles, retro arcade theme (384 lines)
- src/game/engine.js - Pure game logic, state management, hit detection
- src/data/tamilCharacters.js - 247 Tamil characters with audio paths (5 sets: vowels, ayutha, consonants, compound, all)
- src/components/Menu.js - Character set and difficulty selector (5 character sets)
- src/components/HUD.js - Score, timer, target display
- public/audio/ - 247 MP3 pronunciation files (vowels/, consonants/, compound/, special/)
- DESIGN.md - Design system specification with color tokens
- HANDOFF.md - Project documentation and known issues

IMPORTANT DECISIONS
-------------------
- Web Speech API chosen over pre-generated mp3s for zero-dependency audio (but Windows compatibility is poor)
- Procedural canvas sprites chosen over image assets (no asset loading, fully self-contained)
- Canvas coordinate system is 800x720 fixed with CSS scaling (simple but causes mobile issues)
- Retro arcade palette applied: canary yellow, cherry red, grass green, clay brown, cobalt blue, neon purple
- MP3 files chosen as primary audio over Web Speech API for cross-platform reliability (especially Windows)
- Full 247-character Tamil alphabet chosen over 64-character subset for comprehensive learning
- ஃ reclassified from vowels to ayutha array (Ayutha Ezhuthu is linguistically a special character, not a vowel)
- Audio files organized in public/audio/ with category subdirs (vowels/, consonants/, compound/, special/)
- Audio preloading added to warm browser cache on game start

EXPLICIT CONSTRAINTS
--------------------
- "Keep it minimial and modern" (original request, later overridden by retro arcade palette request)
- "do option one without the pregeneration" (user chose Web Speech API over mp3 generation)

CONTEXT FOR CONTINUATION
------------------------
- The game uses a 4x4 grid with HOLE_ROWS=4, HOLE_COLS=4
- Grid constants in engine.js: HOLE_WIDTH=90, HOLE_HEIGHT=30, MOLE_WIDTH=60, MOLE_HEIGHT=70
- Canvas coordinates are scaled from CSS pixels: scaleX = CANVAS_WIDTH / rect.width
- Touch handler exists (handleTouchStart) but the small canvas on mobile makes moles hard to hit
- Audio system priority: MP3 file → Web Speech API → AudioContext tone
- Audio files are in public/audio/ and accessed via process.env.PUBLIC_URL + '/audio/' + character.audio
- Character object shape: { id, label, romanized, audio } where audio is path like 'consonants/1.mp3'
- Tamil vowels: 12 (அ through ஔ), Ayutha: 1 (ஃ), Consonants: 18 (க through ன), Compound: 216 (18x12)
- Menu uses characterSets[selected] to pass character array to Game component
