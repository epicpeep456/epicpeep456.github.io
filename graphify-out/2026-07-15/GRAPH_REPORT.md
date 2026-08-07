# Graph Report - C:\Users\hi_is\Downloads\Wackamole\wackamole  (2026-07-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 95 nodes · 134 edges · 9 communities
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

## God Nodes (most connected - your core abstractions)
1. `Game()` - 14 edges
2. `createGameState()` - 6 edges
3. `spawnBatch()` - 6 edges
4. `updateGameState()` - 6 edges
5. `scripts` - 5 edges
6. `App()` - 5 edges
7. `handleClick()` - 5 edges
8. `production` - 4 edges
9. `development` - 4 edges
10. `pickRandomCharacter()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Game()` --calls--> `createGameState()`  [EXTRACTED]
  src/components/Game.js → src/game/engine.js
- `Game()` --calls--> `handleClick()`  [EXTRACTED]
  src/components/Game.js → src/game/engine.js
- `Game()` --calls--> `updateGameState()`  [EXTRACTED]
  src/components/Game.js → src/game/engine.js

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (19): dependencies, react, react-dom, react-scripts, eslintConfig, extends, name, private (+11 more)

### Community 1 - "engine.js"
Cohesion: 0.22
Nodes (14): allMolesHidden(), createGameState(), DIFFICULTY_PRESETS, easeOutCubic(), findEmptyHoles(), getHolePositions(), handleClick(), pickDistractors() (+6 more)

### Community 2 - "Game.js"
Cohesion: 0.23
Nodes (14): COLORS, drawBackground(), drawDirtMound(), drawHoleInteriors(), drawHoleRims(), drawMoleSprite(), drawPauseOverlay(), drawWhackEffect() (+6 more)

### Community 3 - "development"
Cohesion: 0.22
Nodes (9): browserslist, development, production, >0.2%, last 1 chrome version, last 1 firefox version, last 1 safari version, not dead (+1 more)

### Community 4 - "Menu.js"
Cohesion: 0.25
Nodes (7): DIFFICULTY_OPTIONS, Menu(), MENU_OPTIONS, characterSets, compound, consonants, vowels

### Community 5 - "manifest.json"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 6 - "App.js"
Cohesion: 0.43
Nodes (5): App(), formatDate(), loadScores(), saveScore(), root

### Community 7 - "devDependencies"
Cohesion: 0.38
Nodes (7): devDependencies, @testing-library/dom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @testing-library/dom, @testing-library/user-event

## Knowledge Gaps
- **35 isolated node(s):** `name`, `version`, `private`, `react`, `react-dom` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `browserslist` connect `development` to `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `Game()` connect `Game.js` to `engine.js`, `App.js`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._