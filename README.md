# Coin Flip

A simple, static Coin Flip website built with vanilla HTML, CSS, and JavaScript. No build step and no external dependencies.

## Features

- Clean, centered UI with a coin, Flip button, and results area
- CSS-powered 3D flip animation (~700ms) for the coin
- Cryptographically secure randomness via `window.crypto.getRandomValues`; automatic fallback to `Math.random()` with a console warning if crypto is unavailable
- Running totals for Heads, Tails, and Total flips
- Accessible experience:
  - Flip button has an `aria-label`
  - Result announcements via an `aria-live` region
  - Keyboard-friendly (focus-visible styles, Enter/Space activation)
  - Sufficient color contrast

## Tech

- Vanilla HTML/CSS/JS only
- No external network requests; works fully offline

## Run locally

Just open `index.html` in a modern web browser (double-click or drag into the browser window).

No servers, no installs, no build step.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In the GitHub repository, go to Settings → Pages.
3. Select the branch (e.g., `main`) and root `/` folder.
4. Save. Your site will be available at the provided GitHub Pages URL.

Alternatively, you can serve locally with any static file server, but it's not required.

## Randomness Notes

- The app prefers `window.crypto.getRandomValues` for cryptographically secure randomness.
- If `window.crypto` is not available (very old browsers or restricted environments), it falls back to `Math.random()` and logs a warning to the console.
- Either way, the UI continues to function.

## Accessibility Considerations

- The Flip button includes a descriptive `aria-label`.
- The result text is announced via an `aria-live="polite"` region.
- Focus-visible outlines are provided for keyboard navigation.
- Color contrast is designed to be readable in low-contrast environments.

## Files

- `index.html` — Markup for the app
- `styles.css` — Styling and flip animation
- `script.js` — Flip logic, randomness, counters, and accessibility hooks
- `README.md` — This documentation

## Testing

1. Open `index.html` in your browser.
2. Click Flip:
   - The coin should animate flipping for about 700ms.
   - A result ("Heads" or "Tails") should be displayed and announced.
   - Counters for Heads, Tails, and Total should update.
3. Check DevTools Console:
   - No errors should appear.
   - A warning appears only if `window.crypto.getRandomValues` is unavailable.

