# Rock–Paper–Scissors (Static Site)

A small, self-contained Rock–Paper–Scissors game you can open directly in your browser.

Overview
- Pure static assets (no build tools): index.html, styles.css, script.js
- Accessible and responsive UI
- Scoreboard persists for the current tab session
- No external dependencies or CDNs

Features
- Choose Rock, Paper, or Scissors via buttons
- Random computer choice
- Clear round result with emojis and status coloring
- Persistent scoreboard (player, computer, ties) for the session
- Reset button to clear the scoreboard
- Works on mobile and desktop

How to run
- Easiest: open rps/index.html in any modern browser
- Optional local server (prevents some browser restrictions on file:// in certain setups):
  - Python 3: cd rps && python3 -m http.server 8000
  - Then visit http://localhost:8000 in your browser

File structure
- rps/
  - index.html — semantic HTML with ARIA where appropriate
  - styles.css — minimal responsive styling
  - script.js — game logic and session scoreboard

Notes
- Score persists for the duration of the tab session (sessionStorage).
- No analytics, no network requests; everything runs locally.
