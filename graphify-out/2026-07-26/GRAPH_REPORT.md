# Graph Report - wackamole  (2026-07-15)

## Corpus Check
- 16 files · ~10,548 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 161 nodes · 196 edges · 13 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70928b04`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- engine.js
- Game.js
- development
- Menu.js
- manifest.json
- App.js
- devDependencies
- Tamil Whack-a-Mole — Developer Handoff
- Architecture
- Tamil Whack-a-Mole

## God Nodes (most connected - your core abstractions)
1. `Game()` - 14 edges
2. `Tamil Whack-a-Mole — Developer Handoff` - 12 edges
3. `Tamil Whack-a-Mole - Design System` - 10 edges
4. `Architecture` - 9 edges
5. `Tamil Whack-a-Mole` - 8 edges
6. `7. Canvas Design (Game Board)` - 7 edges
7. `createGameState()` - 6 edges
8. `spawnBatch()` - 6 edges
9. `updateGameState()` - 6 edges
10. `6. Component Styles` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Game()` --calls--> `createGameState()`  [EXTRACTED]
  src/components/Game.js → src/game/engine.js
- `Game()` --calls--> `handleClick()`  [EXTRACTED]
  src/components/Game.js → src/game/engine.js
- `Game()` --calls--> `updateGameState()`  [EXTRACTED]
  src/components/Game.js → src/game/engine.js

## Import Cycles
- None detected.

## Communities (13 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (19): dependencies, react, react-dom, react-scripts, eslintConfig, extends, name, private (+11 more)

### Community 1 - "engine.js"
Cohesion: 0.22
Nodes (14): allMolesHidden(), createGameState(), DIFFICULTY_PRESETS, easeOutCubic(), findEmptyHoles(), getHolePositions(), handleClick(), pickDistractors() (+6 more)

### Community 2 - "Game.js"
Cohesion: 0.19
Nodes (16): COLORS, drawBackground(), drawDirtMound(), drawHoleInteriors(), drawHoleRims(), drawMoleSprite(), drawPauseOverlay(), drawWhackEffect() (+8 more)

### Community 3 - "development"
Cohesion: 0.22
Nodes (9): browserslist, development, production, >0.2%, last 1 chrome version, last 1 firefox version, last 1 safari version, not dead (+1 more)

### Community 4 - "Menu.js"
Cohesion: 0.17
Nodes (12): App(), formatDate(), loadScores(), saveScore(), DIFFICULTY_OPTIONS, Menu(), MENU_OPTIONS, characterSets (+4 more)

### Community 5 - "manifest.json"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 6 - "App.js"
Cohesion: 0.08
Nodes (25): 1. Design Philosophy, 2. Color Palette, 3. Typography, 4. Spacing, 5. Borders & Radii, 6. Component Styles, 7. Canvas Design (Game Board), 8. Interaction States (+17 more)

### Community 7 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @testing-library/dom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @testing-library/dom, @testing-library/jest-dom, @testing-library/react (+1 more)

### Community 9 - "Tamil Whack-a-Mole — Developer Handoff"
Cohesion: 0.12
Nodes (15): Adding High Scores, Adding Mole Images, Adding More Characters, Audio System, Extension Points, Game Mechanics, Grid Layout Constants, How to Run (+7 more)

### Community 10 - "Architecture"
Cohesion: 0.22
Nodes (9): Architecture, Canvas Coordinates, Difficulty Presets, Game Engine (engine.js) — Pure Logic, No React, Game Loop (Game.js), Hit Detection, Menu (Menu.js), Mole Spawning (+1 more)

### Community 11 - "Tamil Whack-a-Mole"
Cohesion: 0.22
Nodes (8): Adding Audio, Features, Getting Started, How to Play, License, Project Structure, Tamil Whack-a-Mole, Tech Stack

## Knowledge Gaps
- **86 isolated node(s):** `name`, `version`, `private`, `react`, `react-dom` (+81 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `browserslist` connect `development` to `package.json`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _86 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `App.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Tamil Whack-a-Mole — Developer Handoff` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._