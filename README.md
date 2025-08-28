# Coinflip

A simple, accessible, framework-free coin flip website built with static HTML, CSS, and Vanilla JavaScript.

## Overview

This project provides a fair coin flip using the Web Crypto API when available, with a graceful fallback to `Math.random()` otherwise. It includes a lightweight CSS flip animation, live-updating stats, a timestamped history, and strong accessibility features.

## Features

- Fair coin flip:
  - Uses `crypto.getRandomValues` when available
  - Falls back to `Math.random()` otherwise
- Prominent result display (Heads/Tails) with a simple animated coin
- CSS-based animation (respects `prefers-reduced-motion`)
- Stats: total flips, heads count, tails count
- History: last 10 flips with timestamps
- Reset button to clear stats/history
- Accessibility:
  - Keyboard operable controls
  - Visible focus styling
  - `aria-live` region announces result changes for screen readers
  - Sufficient color contrast
- Responsive layout for mobile and desktop
- No external dependencies; pure static site
- Testable pure function: `flipCoin()` returns "Heads" or "Tails"

## Project Structure

- `index.html` — Semantic markup for the app
- `styles.css` — Layout, theme, and animation
- `app.js` — App logic and DOM interactions (exposes `flipCoin()`)
- `.gitignore` — Common OS/editor ignores
- `README.md` — This documentation

## How to Run Locally

Option 1: Open directly
1. Clone the repository
2. Open `index.html` in your favorite browser

Option 2: Use a simple static server (recommended for testing)
- Python 3:
  ```
  python -m http.server 8000
  ```
  Then visit http://localhost:8000

## How to Deploy

GitHub Pages:
1. Push the repository to GitHub
2. In GitHub, go to Settings → Pages
3. Set the source to “Deploy from a branch”
4. Select branch (e.g., `main`) and `/ (root)` folder and save
5. Your site will be available at the provided Pages URL

Any static host will work since the project is pure HTML/CSS/JS.

## Accessibility Notes

- Buttons are native `<button>` elements for keyboard operability (Enter/Space)
- Focus-visible styling helps keyboard users
- Results are announced via an `aria-live="polite"` region
- Colors chosen for good contrast
- Animation respects `prefers-reduced-motion`

## Randomness Approach

- Primary: `window.crypto.getRandomValues` to get uniform random bits
- Fallback: `Math.random()` if crypto is not available
- The pure function:
  ```js
  // returns "Heads" or "Tails"
  flipCoin()
  ```

## Development Notes

- No build step; edit the files directly
- Keep bundle size minimal, no dependencies
- All logic is in `app.js`
- Files kept intentionally short for maintainability
