# Tic‑Tac‑Toe (HTML/CSS/JS, no build)

A minimal, accessible, client‑side Tic‑Tac‑Toe game for two local players (X and O). No frameworks, no build tools, no PWA, no AI.

## Quick start
- Clone or download this repository
- Open index.html in any modern browser
- Play!

No build step or dependencies are required.

## Features
- 3×3 board rendered as buttons with keyboard and screen‑reader support
- Turn handling: X starts; alternates X → O after each valid move
- Win/draw detection on rows, columns, and diagonals
- Winning line highlight and status announcements via aria-live
- Restart button to reset game state
- Responsive and mobile friendly; board keeps square cells
- Light/dark theme via prefers-color-scheme
- Plain HTML/CSS/vanilla JS (~200–300 lines each), no external deps

## Keyboard controls
- Arrow keys: move focus between cells
- Enter/Space: place the current player’s mark on the focused cell
- R: restart the game (focuses and activates Restart)
- Tab/Shift+Tab: standard navigation to reach the Restart button

## Accessibility notes
- Board container uses role="grid"; rows are role="row"; cells are native buttons (focusable)
- Status region uses aria-live="polite" and role="status" to announce turn changes and results
- Cells expose informative aria-labels that update with state (empty/occupied and current player)
- Visible focus styles with sufficient color contrast; not relying on color alone for meaning
- Minimum target sizes on mobile; no text selection on long press

## How to run locally
Just open index.html in your browser. That’s it.

## Deployment (optional)
You can serve this static site with GitHub Pages:
- In GitHub: Settings → Pages → “Deploy from a branch” → select your default branch and root (/)
- Save, then visit the provided Pages URL

## Project structure
- index.html — Single page app shell
- styles.css — Layout and theming (CSS Grid, variables, dark mode)
- app.js — Game logic and UI wiring
- docs/tech-plan.md — Detailed implementation plan (verbatim)
- .editorconfig — Consistent indentation and whitespace (optional)

## License
MIT
