# Coin Flip (Client-side Web App)

This repository hosts a tiny, dependency-free Coin Flip web app implemented with semantic HTML, minimal CSS, and modular JavaScript. It runs entirely in the browser with no build step and no server required.

## Overview
- Fair coin flips using secure randomness when available.
- Tracks counts, percentages, and the last 10 flips (most recent first).
- State persists in `localStorage` across page reloads.
- Accessible UI with live region announcements and visible focus styles.
- Lightweight animation that respects reduced motion preferences.

## Features
- RNG:
  - Uses `crypto.getRandomValues(Uint32Array(1))[0] % 2` when available.
  - Falls back to `Math.random()` if `window.crypto` is unavailable or errors.
- UI:
  - Result display with text (“Heads”/“Tails”) and an emoji.
  - Statistics: heads, tails, total, and percentages.
  - History: last 10 flips (newest first).
  - Controls: Flip and Reset buttons; keyboard shortcuts: `F` to flip, `R` to reset.
- Accessibility:
  - Result is announced via an `aria-live` region.
  - Proper labels and strong focus outlines.
  - High-contrast friendly color palette.
- Performance:
  - No frameworks or build tooling — static assets only.

## How to run locally
1. Clone the repository.
2. Open `index.html` in a modern browser.
   - No server is required, but you may also serve the folder with a simple static server if preferred.

## Notes on randomness
- When supported, the app uses the Web Crypto API to generate unbiased bits by taking a 32-bit unsigned integer and using modulo 2.
- If the Web Crypto API is not available, it falls back to `Math.random()`, which is sufficient for casual use but not cryptographically secure.

## QA / Manual checks
- Tested in current versions of Chromium, Firefox, and Safari.
- You can manually test the fallback path by stubbing `window.crypto` in DevTools:
  - Run `window.crypto = undefined;` and refresh, then flip to exercise the fallback.
- To reset state, click Reset or clear the key `coinFlipState.v1` in `localStorage`.

## Repository notes
- This app is placed at the repository root because the repository is otherwise suitable for a static site.
- All files are under 1000 lines and organized for clarity:
  - `index.html` — semantic markup and layout.
  - `styles.css` — minimal, responsive, high-contrast styling.
  - `app.js` — modular client-side logic (RNG, storage, state, UI).
  - `favicon.svg` — simple icon.

## License
MIT
