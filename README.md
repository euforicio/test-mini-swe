# Test Repository for Mini-SWE Agent

This is a test repository for the PRD to PR workflow.

## Random number website (1–10)

This adds a very simple static webpage that shows a random integer between 1 and 10. On load it displays an initial value; clicking the "Generate" button produces a new random number.

How to run locally:
- Open index.html directly in your browser (no build step or dependencies).

How to verify:
- On page load, the number shows a value within 1–10 (inclusive).
- Click "Generate" repeatedly; each time, the number is an integer in the range [1,10], never 0 or >10.
- Activate the button using keyboard:
  - Focus the "Generate" button and press Enter or Space to generate a new number.
- The number region has aria-live so screen readers announce updates.
