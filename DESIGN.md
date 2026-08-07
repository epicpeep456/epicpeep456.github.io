# Tamil Whack-a-Mole - Design System

## 1. Design Philosophy

Classic retro arcade Whac-A-Mole cabinet aesthetic. The playfield is a vivid grass-green surface with earthy brown mole characters emerging from clay dirt mounds. The cabinet frame uses cobalt blue borders with yellow rivet accents. All UI elements evoke the golden age of arcade cabinets - bold colors, strong contrast, chunky typography, and hand-drawn canvas sprites with personality.

## 2. Color Palette

### Primary Arcade Colors

| Token               | Hex       | Role                                            |
|---------------------|-----------|-------------------------------------------------|
| `--canary-yellow`   | `#FFD700` | Cabinet background, signage, playfield text     |
| `--cherry-red`      | `#E31B23` | Mallets, logo, score displays, action elements  |
| `--grass-green`     | `#4CAF50` | Playfield surface (grass), cabinet accent borders|
| `--clay-brown`      | `#8B4513` | Mole characters, dirt mounds                    |
| `--dark-brown`      | `#5D3A1A` | Mole shadows, deeper dirt                       |
| `--mole-pink`       | `#FF69B4` | Mole noses                                      |
| `--cobalt-blue`     | `#1E3A8A` | Retro side-art, cabinet borders                 |
| `--neon-purple`     | `#7C3AED` | Lightning bolt effects, whack sparkles          |
| `--cream`           | `#FFF8DC` | Text on dark backgrounds, highlights            |
| `--dark-navy`       | `#0F172A` | Deep shadows, cabinet base                      |

### Semantic Colors

| Token           | Hex       | Usage                                    |
|-----------------|-----------|------------------------------------------|
| `--danger`      | `#E31B23` | Wrong-hit X effect (cherry red)          |
| `--danger-dark` | `#E31B23` | Low-time warning pulse                   |
| `--success`     | `#FFD700` | Correct hit +10 effect (canary yellow)   |
| `--highlight`   | `#7C3AED` | Whack sparkle effect (neon purple)       |

## 3. Typography

### Font Stack

```
'Press Start 2P', 'SF Pro Display', 'Geist Sans', 'Helvetica Neue', system-ui, sans-serif
```

Canvas text uses `'bold 26px sans-serif'` for Tamil characters and `'bold sans-serif'` for effects.

### Scale

| Role         | Size    | Weight | Letter-spacing | Color          |
|------------- |---------|--------|----------------|----------------|
| Title        | 2.8rem  | 700    | -0.02em        | `--canary-yellow` |
| Subtitle     | 1.1rem  | 400    | 0              | `--cream`      |
| Body         | 1.0rem  | 400    | 0              | `--cream`      |
| Label        | 0.75rem | 600    | 0.08em         | `--cherry-red` |
| Caption      | 0.85rem | 400    | 0              | `--cream`      |
| Button       | 1.1rem  | 700    | 0.06em         | `--cream`      |
| Button large | 1.2rem  | 700    | 0.06em         | `--cream`      |
| HUD value    | 1.8rem  | 700    | 0              | `--cherry-red` |
| HUD target   | 2.2rem  | 400    | 0              | `--canary-yellow` |

## 4. Spacing

Base unit: 4px. All spacing derives from multiples of 4.

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| `xs`  | 4px   | Tight gaps               |
| `sm`  | 8px   | Inner padding, small gaps|
| `md`  | 12px  | Card padding, option gaps|
| `lg`  | 16px  | Section gaps             |
| `xl`  | 20px  | Page padding, outer gaps |
| `2xl` | 30px  | Major section dividers   |
| `3xl` | 40px  | Large section padding    |

## 5. Borders & Radii

| Element          | Border                          | Radius  |
|-----------------|----------------------------------|---------|
| Menu / panels    | 3px solid `--cobalt-blue`       | 12px    |
| Buttons          | 2px solid `--cobalt-blue`       | 8px     |
| Canvas           | 4px solid `--cobalt-blue`       | 10px    |
| Option buttons   | 2px solid `--cobalt-blue`       | 10px    |
| Option selected  | 3px solid `--cherry-red`        | 10px    |
| HUD bar          | 3px solid `--cobalt-blue`       | 10px    |
| Target char box  | 2px solid `--cherry-red`        | 8px     |

## 6. Component Styles

### Buttons

- **Primary (Start, Play Again):** `background: #E31B23`, `color: #FFF8DC`, border `2px solid #1E3A8A`
- **Secondary (Back to Menu):** `background: #1E3A8A`, `color: #FFF8DC`, border `2px solid #1E3A8A`
- **Pause:** `background: #FFD700`, `color: #0F172A`, border `2px solid #1E3A8A`
- All buttons: `border-radius: 8px`, `padding: 14px 40px` (large) or `8px 16px` (small), `text-transform: uppercase`, `letter-spacing: 0.08em`
- Hover: `filter: brightness(1.15)`, slight scale

### Menu

- Background: `#0F172A` with `border: 3px solid #1E3A8A` and `box-shadow: 0 0 20px rgba(30, 58, 138, 0.3)`
- Title color: `#FFD700`
- Subtitle: `#FFF8DC`
- Instruction text: `#FFF8DC`
- Option cards: `background: #1E3A8A`, `border: 2px solid #1E3A8A`
- Option hover: `border-color: #FFD700`, `background: #2444a8`
- Option selected: `background: #E31B23`, `border: 3px solid #FFD700`
- Option label: `#FFF8DC`, count: `#FFD700` (selected: `#FFF8DC`)
- Hint text: `#FFD700`

### HUD

- Background: `rgba(15, 23, 42, 0.95)` with `border: 3px solid #1E3A8A`
- Label: `#E31B23`, uppercase, letter-spacing 1px
- Value: `#FFD700`
- Target char: `color: #FFD700`, `background: rgba(30, 58, 138, 0.4)`, `border: 2px solid #E31B23`
- Target romanized: `#FFF8DC`
- Low time: `#E31B23` with pulse animation

### Game Over

- Background: `#0F172A` with `border: 3px solid #1E3A8A`
- Title: `#FFD700`
- Score: `#E31B23`

### Leaderboard

- Title: `#FFD700`
- Table header: `#E31B23`, `border-bottom: 2px solid #1E3A8A`
- Table cells: `#FFF8DC`
- Current row: `#FFD700`, bold

## 7. Canvas Design (Game Board)

### Background (drawBackground)

- Base fill: `#4CAF50` (grass green) covering full 800x720
- Grass texture: Slightly darker green `#3D8B40` horizontal stripes or dot pattern
- Cabinet border frame: `#1E3A8A` (cobalt blue) thick frame around edges
- Decorative rivets: Small `#FFD700` circles at corners (arcade cabinet rivets)
- Top banner: `#0F172A` strip with `#FFD700` text "TAMIL WHACK-A-MOLE"

### Holes (drawHoleInteriors)

- Interior: `#0F172A` (dark navy, deep hole)
- Shadow: `rgba(0, 0, 0, 0.4)` offset shadow

### Dirt Mounds (drawDirtMound)

- Base mound: `#8B4513` (clay brown) elliptical mound
- Dirt texture: `#5D3A1A` small circles/dots for texture
- Grass tufts: `#4CAF50` small green lines on top edges
- Should frame the hole opening naturally

### Moles (drawMoleSprite)

A full cartoon mole character drawn within 60x70 bounds:

- **Body**: Rounded `#8B4513` body, wider at bottom (egg/tapered shape)
- **Belly/face**: `#A0522D` lighter brown oval on front
- **Eyes**: Two `#FFF8DC` circles with `#0F172A` pupils, slightly cross-eyed for cuteness
- **Nose**: `#FF69B4` (pink) oval at center
- **Whiskers**: 3 thin `#5D3A1A` lines on each side
- **Ears**: Small `#8B4513` rounded bumps on top
- **Tamil character**: Displayed prominently on the mole's belly/chest area in `#FFD700` bold 22px
- Body shadow: `#5D3A1A` darker on bottom edge

### Effects

- Correct hit (+10): `#7C3AED` starburst + `#FFD700` lightning bolts + `#E31B23` "+10" text, fades over 600ms
- Wrong hit (X): `#E31B23` X mark + `#8B4513` dust puffs, fades over 400ms

### Pause Overlay

- Semi-transparent dark navy: `rgba(15, 23, 42, 0.8)`
- "PAUSED" text: `#FFD700`, bold 48px
- Subtitle: `#FFF8DC`, 20px

## 8. Interaction States

| State    | Transform          | Notes                              |
|----------|--------------------|------------------------------------|
| Default  | none               | Resting state                      |
| Hover    | translateY(-2px)   | Cards only, not buttons            |
| Selected | border-color shift | Cherry red border, bold yellow label|
| Disabled | opacity: 0.4       | Grayed out, cursor not-allowed      |

## 9. Accessibility

- All text meets WCAG AA contrast on its background
- Tamil characters rendered at bold 22px minimum on mole body for legibility
- Target character display at 2.2rem for clear identification
- Cursor changes: `crosshair` on canvas, `pointer` on interactive elements
- Green-brown color blind safe: mole shapes distinct from background by form, not color alone
