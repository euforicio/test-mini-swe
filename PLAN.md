# Plan: Minimal Self‑Contained Snake Game

## Summary and Goals
- Add a tiny, dependency-free Snake game implemented with plain HTML, CSS, and JavaScript.
- Provide a clear plan describing approach, constraints, and testing.
- Submit as a new feature under `snake/` with an accompanying PR.

## Constraints and Assumptions
- No external libraries or build steps.
- Must run by simply opening `snake/index.html` in a modern browser (Chrome/Firefox).
- Controls: Arrow keys or WASD to move; Space to pause; Enter to restart.
- Fixed grid and tick rate; snake grows upon eating food; food never spawns on the snake.
- Game ends on wall or self collision; shows overlay with final score.

## File Structure
- `snake/`
  - `index.html` — HTML5 page with canvas, score display, instructions.
  - `style.css` — Minimal styling to center canvas and overlays.
  - `script.js` — Game logic, rendering, input handling.
- `PLAN.md` — This plan.

## Implementation Plan (Steps)
1. Create `snake/` folder with the three files.
2. In `index.html`, include a centered `<canvas>` and visible score + instructions overlays.
3. In `style.css`, center content, set background gradient, style overlays.
4. In `script.js`:
   - Define a grid (20x20) and cell size (28 px).
   - Implement fixed-timestep loop (~10 FPS) with `setInterval`.
   - Track snake as an array of grid positions; block immediate reversal.
   - Spawn food at random positions excluding the snake’s body.
   - On tick: advance head, detect collisions, grow when eating, update score.
   - Render snake and food on canvas; update score in DOM.
   - Show overlays for Pause and Game Over; Enter restarts, Space toggles pause.
5. Manually test in browser and ensure acceptance criteria are met.
6. Commit to a feature branch and open a PR.

## Manual Test Plan / Acceptance Criteria
- Opening `snake/index.html` shows a working Snake game on a centered canvas.
- Arrow keys and WASD control movement; immediate reversal is ignored.
- Space toggles pause with an on-screen overlay.
- Enter restarts the game after Game Over.
- Eating food:
  - Increases score by 1.
  - Grows the snake by one segment.
  - Food respawns not on the snake.
- Colliding with a wall or self triggers Game Over with a visible overlay showing final score.
- No external libraries are used; no build steps required.

## Future Enhancements
- Difficulty options (speed increase over time).
- Keep best score (localStorage).
- Mobile controls (on-screen arrows or swipe).
- Optional grid toggling and color themes.
- Sound effects (with ability to mute).
