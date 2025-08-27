---
Title: Client‑Side Tic‑Tac‑Toe – Tech Implementation Plan (Web, no PWA)

1) Scope
- Build a simple 2‑player local Tic‑Tac‑Toe for the browser. No AI, no networking, no PWA/offline.

2) Stack & Structure
- Stack: HTML5, CSS3, ES6+ (vanilla). No build tools.
- Files: index.html, styles.css, app.js, README.md, docs/tech-plan.md, .editorconfig (optional).

3) UI/UX
- Layout: centered column; heading, status (aria-live polite), 3×3 board, Restart button.
- Board: CSS Grid 3×3; each cell is a button with data-index 0..8 to simplify JS. Use aspect-ratio: 1/1 to keep squares.
- Visuals: subtle border; hover and focus ring; highlight winning cells via a .win class.
- Mobile: min target size 44×44 px; responsive typography.

4) Game Logic
- State: board = Array(9).fill(null); currentPlayer = 'X'; gameActive = true.
- Winning combos: const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].
- checkWinner(board): returns {winner:'X'|'O', line:[i,i,i]} or null.
- isDraw(board): board.every(Boolean) && !winner.
- handleCellSelect(i): if gameActive && board[i]==null -> set board[i]=currentPlayer; render; if winner -> end; else if draw -> end; else toggle currentPlayer.
- restart(): reset state and UI.

5) Accessibility
- Use role="grid" on container and role="row"/"gridcell" or simply <button> elements (preferred) for built‑in keyboard and focus. Each cell has aria-label like "Place X on row 1 column 1" updating to "X at row 1 column 1" after played; or simpler labels “Cell 1: X”.
- Status region with aria-live="polite" announces turn changes and results.
- Keyboard navigation: rely on Tab order by default; add optional arrow-key navigation by computing row/col and moving focus.
- Color contrast >= 4.5:1. Never rely on color alone for state; use icons/text.

6) Rendering & DOM
- At load: query all 9 cell buttons; attach click and keydown handlers; initialize status text.
- render(): write board array to textContent of each cell; toggle data-state classes; apply .win on winning indices.

7) Edge Cases
- Ignore input after game end; ignore clicks on occupied cells; Restart always clears.
- Prevent long-press text selection on mobile; disable double-tap zoom on buttons via CSS where safe.

8) Performance & Size
- Keep DOM minimal; no reflows in loops beyond the 9 cells; no timers.

9) Documentation
- README with features, keyboard controls, and how to preview via GitHub Pages.

10) Out of Scope
- PWA/offline, animations beyond simple transitions, AI/opponent, multiplayer, i18n.
---
