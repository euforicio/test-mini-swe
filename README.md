# Test Repository for Mini-SWE Agent

This is a test repository for the PRD to PR workflow.

## Simple Random Number 1–10

This adds a tiny website that shows a random integer between 1 and 10 and a "Generate" button.

How to run locally:
- Static: Open ./random.html directly in your browser (no build tools required).

Accessibility:
- The button includes an aria-label.
- The current number uses aria-live to announce updates.

Implementation notes:
- Generates a number via Math.floor(Math.random() * 10) + 1 on load and on click.
- Minimal styling for readability; no external dependencies.
