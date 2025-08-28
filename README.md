# Coinflip

A simple, static single-page Coinflip website. It shows an animated coin, lets you flip with a button or keyboard (Space/Enter), displays the result, keeps running counts for Heads/Tails/Total, shows the last 10 flips, and persists everything in your browser (localStorage). No build step required.

## Features

- Accessible, keyboard-friendly UI
- Flip via button or Space/Enter
- CSS 3D coin flip animation (800ms)
- Prevents multiple flips during animation
- Crypto-strong randomness via `crypto.getRandomValues` with Math.random fallback (50/50)
- Counters for Heads, Tails, and Total
- Last 10 flips history
- Persistent state using `localStorage`
- Reset button clears counts and history
- Responsive, centered layout with visible focus states
- Ready to deploy from repository root (GitHub Pages)

## How to run locally

- Option 1: Just open `index.html` in your browser.
- Option 2 (local server):
  - Using npm: `npx serve`
  - Using Python: `python3 -m http.server 8080` (then open http://localhost:8080)

Keyboard shortcut: Press Space or Enter to flip the coin.

## Deploy to GitHub Pages

1. Push the site files (index.html, style.css, script.js) to your repository’s default branch.
2. In your repository, go to Settings → Pages.
3. Under “Build and deployment”, set Source to “Deploy from a branch”.
4. Select your default branch and set the folder to “/ (root)”.
5. Save. After a few minutes, your site will be live at the provided Pages URL.

## Files

- `index.html` — Single-page app UI and structure
- `style.css` — Responsive styles, focus states, and flip animation
- `script.js` — Random flip logic, UI updates, storage, and keyboard support
- `.gitignore` — Common ignores for web projects

No build step or extra tooling is required.
