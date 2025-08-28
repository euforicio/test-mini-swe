# Coinflip

A minimal, accessible, framework-free coin flip website. Flip a fair coin, see results, running totals, and a history of the last 10 flips. Fully static: just open index.html.

## Features

- Fair 50/50 coin flip using crypto.getRandomValues when available, with Math.random fallback
- Smooth CSS coin flip animation (~900ms)
- Accessible:
  - Keyboard: Enter or Space triggers a flip
  - Aria-live updates for results and history
  - Focus-visible styles
- Persists counts and last 10 flips in localStorage
- Reset button to clear counts and history
- Responsive, light/dark friendly design
- No build tooling; plain HTML/CSS/JS

## File structure

- index.html — Single-page app with the UI
- style.css — Clean, responsive styles with coin flip animation
- script.js — Logic for flipping, state, persistence, and accessibility
- .gitignore — Common ignores
- README.md — This document

## How to run locally

Option A: Double-click index.html (or open it in your browser).

Option B: Serve with a lightweight static server:

- Using npx:
  - npx serve
  - Open the printed URL (e.g., http://localhost:3000)

No build step is required.

## Keyboard shortcuts

- Enter or Space: Flip the coin
- Click the coin or the Flip button: Also flips

## Reset

Click the Reset button to clear counts and history (localStorage).

## Deployment: GitHub Pages

1. Push this repository to GitHub.
2. In your repository settings:
   - Pages: Source = “Deploy from a branch”
   - Branch = main (or your default branch), Folder = / (root)
3. Wait for GitHub Pages to build and publish.
4. Open the Pages URL.

## Screenshots (placeholders)

- Screenshot of main UI: [screenshot-ui.png]
- Screenshot of dark mode: [screenshot-dark.png]

## Notes

- The page works offline and only relies on browser APIs.
- All files are under 1000 lines and well-commented for readability.
