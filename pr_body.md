This PR implements a simple client‑side Tic‑Tac‑Toe game using plain HTML, CSS, and vanilla JS. No frameworks, no build tools, no PWA, no AI.

Highlights
- 3×3 board rendered as accessible buttons
- Turn handling (X starts), win/draw detection, and restart
- Arrow‑key navigation, Enter/Space to play, R to restart
- aria‑live status updates and visible focus outlines
- Responsive layout with square cells; light/dark theme
- No dependencies or build step; open index.html to run

Files added at repo root
- index.html
- styles.css
- app.js
- README.md
- docs/tech-plan.md (implementation plan, verbatim)
- .editorconfig (optional, for consistent indentation)

How to run
- Open index.html in your browser. That’s it.

Deployment
- Optional: enable GitHub Pages (Settings → Pages → Deploy from branch → root) to serve the static site.

Tech plan
See docs/tech-plan.md for the full implementation plan used for this work.
