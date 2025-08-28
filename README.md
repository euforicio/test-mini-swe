# Test Repository for Mini-SWE Agent

This is a test repository for the PRD to PR workflow.

## Rock–Paper–Scissors Website

Purpose:
- A minimal, dependency-free static web app to play Rock–Paper–Scissors (first to 5 wins).

Files:
- rps/index.html
- rps/style.css
- rps/script.js

How to run:
- Open rps/index.html directly in any modern browser, or
- Serve the rps/ directory with any static server.

Controls:
- Click the Rock, Paper, or Scissors buttons, or use keyboard shortcuts:
  - R = Rock, P = Paper, S = Scissors
- The first to 5 wins. After a winner is declared, choice buttons are disabled until you press Reset.

Accessibility:
- Buttons have aria-labels and visible focus styles.
- Live regions announce selections, results, and scores.
- High-contrast colors for readability.

Light smoke tests (optional):
- Open the browser console on rps/index.html and run:
  - __rpsDetermineWinner('rock','scissors') // returns 'win'
  - __rpsSmokeTest() // runs a small set of assertions
