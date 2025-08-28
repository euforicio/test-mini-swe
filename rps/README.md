# Rock–Paper–Scissors (Static Site)

A minimal, dependency-free Rock–Paper–Scissors game you can open directly in your browser.

## Overview
- Accessible, semantic HTML
- Clean, responsive CSS with focus/hover states
- Pure JavaScript game logic (no frameworks)
- Tracks scores in memory and lets you reset

## Features
- Random computer move
- Outcome resolution (win/lose/draw)
- Live scoreboard updates
- Reset Score button
- Keyboard- and screen-reader-friendly focus management

## How to run locally
- Easiest: double-click `index.html` to open in your browser.
- Or serve with a static server (optional):
  - Python 3: `python3 -m http.server` and open `http://localhost:8000/`
  - Node (if installed): `npx serve .`

## File structure
.
├── index.html
├── script.js
├── style.css
└── README.md

(Note: If this lives under `rps/`, the structure is the same within that folder.)

## Future improvements
- Add best-of-N mode and match history
- Animations for choices/results
- Persist scores with localStorage
- Basic unit tests for the decide() function

