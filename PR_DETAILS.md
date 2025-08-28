# Add client-side Coin Flip web app

Base: main
Head: feature/coin-flip-app

PR not created programmatically. You can open it here:
https://github.com/euforicio/test-mini-swe/pull/new/feature/coin-flip-app

This PR adds a client-side-only Coin Flip web app.

Overview:
- A pure static site (index.html, styles.css, app.js, optional favicon.svg) placed at the repository root.
- Open index.html directly in a browser to use.

Features:
- Fair RNG using crypto.getRandomValues(Uint32Array(1))[0] % 2 with a Math.random() fallback.
- Displays latest result (Heads/Tails) with an emoji.
- Tracks heads, tails, total, and percentages; updates live.
- Keeps a last-10 flips history (most recent first).
- Reset button clears state and UI.
- Persists state in localStorage; handles first run and corrupted data gracefully.
- Accessibility: aria-live announcements for results, keyboard navigability, visible focus styles, and clear labels.
- Respects prefers-reduced-motion; high-contrast friendly.

Implementation notes:
- Code organized into small functions: rng(), loadState(), saveState(), render(), onFlip(), onReset().
- Minimal CSS animation for result changes; disabled when reduced motion is preferred.
- No frameworks or build steps; no external dependencies.

Usage:
- Open index.html in any modern browser.

Branch name: feature/coin-flip-app
