# Snake Game Feature Plan

## Goals and Scope
- Deliver a minimal, self-contained, static Snake game website.
- No build tools or external frameworks; must run by opening index.html directly or via a simple static server.
- Include a plan document and, optionally, a README note linking to the game.

## Tech Choices and Rationale
- Vanilla HTML/CSS/JS for simplicity, portability, and zero build step.
- Canvas-based rendering for predictable game-loop drawing.
- File structure:
  - snake-game/
    - index.html
    - style.css
    - script.js
  - SNAKE_GAME_PLAN.md (this document)
- Rationale: keeps the feature isolated and easy to delete or move without impacting other code.

## Game Rules and Controls
- 20x20 grid on a 400x400 canvas (each cell 20px).
- Arrow keys or WASD to control direction.
- Immediate 180° reversals are disallowed.
- Food spawns at random empty cells (never on the snake).
- Each food increments the score by 1 and grows the snake by 1.
- Game over on wall collision or self collision.
- Visible score and a restart control on the page; Enter key also restarts after game over.
- Fixed tick rate ~10 FPS.

## Implementation Plan and Milestones
1. Scaffold files and layout (index.html, style.css, script.js).
2. Implement core game state (snake array, direction, food, score).
3. Input handling (Arrow/WASD) with reversal prevention.
4. Game loop (~10 FPS), movement, growth, and collision detection.
5. Rendering (canvas draw for snake + food, HUD for score/message, restart control).
6. Random food placement avoiding the snake.
7. Game over flow and restart logic.
8. Light styling and responsiveness (centered layout, readable UI).
9. Manual testing across scenarios; polish and comments.

## Testing Checklist
- Keyboard input: Arrow keys and WASD move the snake as expected.
- No immediate 180° reversals.
- Eating food increases score by 1 and grows the snake by 1.
- Food never spawns on the snake.
- Wall collision ends the game.
- Self collision ends the game.
- Restart button resets the game.
- Enter key restarts after game over.
- Page works when opened directly (file://) and via a simple static server.

## How to Run Locally
- Easiest: open snake-game/index.html directly in your browser.
- Or serve the repo root (or snake-game folder) with a simple static server, e.g.:
  - Python: python -m http.server 8000
  - Node: npx serve
  - Then visit http://localhost:8000/snake-game/

## Future Improvements
- Mobile touch controls (swipe or on-screen D-pad).
- Sound effects and simple animations.
- Difficulty options (speed increase over time, obstacles).
- High score persistence (localStorage).
- Pause/resume, step-by-step debug mode.
- Accessibility enhancements (reduced motion, colorblind-friendly palette).
