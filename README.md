# Test Repository for Mini-SWE Agent

This is a test repository for the PRD to PR workflow.

## Coinflip mini app

A tiny, self-contained coin flip website located at `./coinflip`.

Features:
- Accessible UI with live region for announcing results
- Flip and Reset buttons
- Stats: total flips, heads, tails
- Uses Web Crypto for randomness with a safe fallback to Math.random
- Lightweight, responsive styling and visible focus states

How to run locally:
- Option 1 (Python): `cd coinflip && python3 -m http.server 8080` then open http://localhost:8080
- Option 2 (Node): `npx http-server ./coinflip -p 8080` then open http://localhost:8080

Randomness:
- Primary: `window.crypto.getRandomValues` provides high-quality random bits
- Fallback: if Web Crypto is unavailable, uses an unbiased Math.random approach (rejection sampling) to derive a fair bit

Accessibility notes:
- The result text uses `role="status"` and `aria-live="polite"` so screen readers announce updates without stealing focus
- Buttons have clear, visible focus outlines and large click/tap targets
