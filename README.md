# Coin Flip Web App

A tiny, client-side-only Coin Flip web app that runs entirely in your browser. It uses a cryptographically strong random source when available, keeps live statistics, and persists state locally.

- Live demo: open `index.html` in your browser (no build, no server needed)
- All flips and data stay on your device

## Features

- Fair coin flips using:
  - Primary: `crypto.getRandomValues(Uint32Array(1))[0] % 2`
  - Fallback: `Math.random()` if `crypto` is unavailable
- Displays the latest result (Heads/Tails) with an emoji
- Tracks counts and percentages for Heads, Tails, and Total
- Keeps a last-10 flips history (most recent first)
- Reset button clears state and UI
- Persists state in `localStorage` and handles first-run/corrupted data gracefully
- Accessibility:
  - `aria-live` announcement for new results
  - Keyboard navigability and visible focus styles
  - Clear labels and semantic markup
- No external dependencies; pure static files

## How to run

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.

No build steps or servers required.

## Implementation notes

- Randomness:
  - The app prefers `crypto.getRandomValues` to produce a fair bit with modulo 2. This ensures uniformity over the full 32-bit domain.
  - If `crypto` is not available (very old environments), it falls back to `Math.random()` (< 0.5 ⇒ Heads).
- State and persistence:
  - State shape: `{ heads, tails, total, history }`.
  - `history` stores up to 10 entries, newest first, where each entry is `"H"` or `"T"`.
  - Data is saved under the key `coin-flip-state-v1` and validated on load. If parsing or validation fails, the app resets to a safe default.
- Accessibility:
  - Latest result is announced via an `aria-live` region and also displayed visually.
  - Buttons are accessible via keyboard with visible focus rings.
  - Color choices maintain high contrast; animations are subtle and disabled when `prefers-reduced-motion: reduce` is set.
- Organization:
  - `app.js` is split into small functions: `rng()`, `loadState()`, `saveState()`, `render()`, `onFlip()`, `onReset()`.

## Project structure

- `index.html` — semantic, accessible markup and layout
- `styles.css` — responsive, high-contrast styling; respects `prefers-reduced-motion`
- `app.js` — client-only logic; no frameworks or build steps
- `favicon.svg` — optional favicon

## Contributing / Development

Open `index.html` directly to test locally. No tooling required.

## Pull Request

Branch: `feature/coin-flip-app`  
Title: `Add client-side Coin Flip web app`

PR body should describe:
- Features delivered (flip, reset, stats, history, persistence)
- RNG approach and fairness
- Accessibility considerations
- How to run (open `index.html`)
