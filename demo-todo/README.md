# Super Simple Todo (client-side only)

A tiny todo app built with vanilla HTML/CSS/JS. No dependencies, no build step. Just open the page and go.

- Data persists in your browser via localStorage
- Works offline by design (no network needed)
- Accessible controls: labels for checkboxes, polite live region for items-left, keyboard-friendly

## Run locally

- Open demo-todo/index.html in your browser.

## Features

- Add a todo via Enter or the Add button (empty/whitespace inputs are ignored)
- Toggle complete/incomplete
- Delete an item
- Filters: All | Active | Completed
- Items-left count updates and is announced via aria-live="polite"
- Clear completed removes all completed items
- State persists in localStorage and is restored on refresh
- No external libraries; a single static page

## Keyboard tips

- Focus the input and press Enter to add a todo
- Tab to the list; Space toggles a focused checkbox
- Tab to "Clear completed" or filter buttons and press Enter/Space to activate

## Deploy to GitHub Pages

Option A (project/site serves the whole repo root):
1) In GitHub, open Settings → Pages
2) Set Source to "Deploy from a branch", select your default branch (e.g., main), and the root directory
3) Save. Visit the Pages URL and navigate to /demo-todo/

Option B (dedicated gh-pages branch for the demo only):
- Create a gh-pages branch with the contents of demo-todo at the root, or use GitHub Actions to publish the folder.

No service worker is included to keep things minimal.
