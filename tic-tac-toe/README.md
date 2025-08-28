# Tic-Tac-Toe (Vanilla HTML/CSS/JS)

A simple, self-contained Tic-Tac-Toe game playable by two players on the same device. No frameworks or build steps required.

How to run
- Open tic-tac-toe/index.html in your browser.
- Click a cell or use Tab + Enter/Space to place your mark.
- The status text updates to show whose turn it is, or if someone wins or the game is a draw.
- Click Reset to start a new game.

Accessibility
- Cells are real <button> elements (focusable by default).
- Game status uses aria-live="polite" so screen readers announce turn/win/draw updates.
- Focus styles are visible for keyboard users.

No external dependencies.
