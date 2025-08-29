# Snake Game Website – Plan

## Goals and Scope
- Build a simple, static Snake game website with no build tools.
- Vanilla HTML/CSS/JS only.
- Provide an easily runnable demo and a concise plan doc for context.

## User Experience
- Centered layout with a clear title, score display, game canvas, and a Restart button.
- Controls: Arrow keys or WASD.
- Visual feedback on game over, and ability to quickly restart.

## Technical Design
- Grid: 20×20 cells on a 400×400 canvas; each cell is 20px.
- Snake State:
  - Array of segments, head at index 0, each segment is `{x, y}` in grid coordinates.
  - Direction as vector `{x, y}`, e.g. up `{0,-1}`.
- Movement & Logic:
  - Fixed timestep game loop (setInterval ~120ms).
  - At each tick, add a new head based on direction; remove tail unless food was eaten.
  - Food spawns at random empty grid positions; when eaten, score increments and snake grows.
  - Collisions:
    - Walls: if head goes out of 0..19 range in x or y → game over.
    - Self: if head moves into a cell occupied by the snake → game over.
- Input Handling:
  - Arrow keys and WASD.
  - Ignore immediate 180° reversals relative to current direction (prevents self-hit in-place).
- Rendering:
  - Canvas is always 400×400 pixels; CSS scales it responsively up to that size.
  - Subtle grid, green snake, red food; overlay on game over.
- Restart:
  - Resets state, places new food, resets score, and restarts the loop.

## Implementation Steps
1. Create static HTML structure: title, score, canvas, restart button, controls hint.
2. Add responsive, centered styles; cap visual width at 400px and keep canvas pixel size 400.
3. Implement JS:
   - State (snake, direction, food, score, loop).
   - Input (arrows/WASD) with opposite-direction prevention.
   - Game loop (move → collide → eat/grow → draw).
   - Restart handler.
4. Manual test in browser and adjust visuals.

## Testing Checklist
- Movement responds to Arrow keys and WASD.
- Immediate 180° reversal is ignored.
- Food spawns not on snake.
- Eating food grows the snake and increases score.
- Wall collision triggers game over.
- Self-collision triggers game over.
- Restart button resets state and starts a new game.
- Canvas scales visually but remains crisp enough; grid remains 20×20.

## How to Run Locally
- Open `snake-game/index.html` in any modern browser. No build tools required.

## Future Improvements
- Mobile/touch controls (swipe or on-screen D-pad).
- Pause/resume and a visible paused overlay.
- Speed increase as the snake grows and/or difficulty modes.
- Persistent high score using `localStorage`.
- Sound effects and simple animations.
- Theming (light/dark) and color-blind-friendly palettes.
