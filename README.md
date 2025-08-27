# Client-side To‑Do App (Vanilla HTML/CSS/JS)

This is a single-page, client-side-only To‑Do application implemented with vanilla HTML, CSS, and JavaScript. No build step, no frameworks.

How to run:
- Open index.html in any modern (evergreen) browser.

## Features

- Add task: Type in the input at the top and press Enter or click Add. Empty titles are ignored.
- List tasks: Each item has a checkbox to toggle completion, title text, Edit and Delete buttons.
- Edit inline: Click the title or the Edit button to edit inline. Enter or blur saves; Esc cancels and restores the previous text.
- Filters with counts: All | Active | Completed. Counts update live.
- Search: A debounced (~150ms) search box filters the current list by title (case-insensitive).
- Clear Completed: Removes all completed tasks after a confirmation prompt.
- Persistence: State is saved to localStorage under key "todoapp:v1". The app loads saved data on startup and is robust to malformed stored data.
- Dark mode friendly: Uses `prefers-color-scheme` to look good in light/dark.
- Performance: Storage writes are throttled/debounced to reduce churn.

## Data Model

- Task:
  - id: string (uuid)
  - title: string
  - completed: boolean
  - createdAt: number (ms)
  - updatedAt: number (ms)
- AppState:
  - tasks: Task[]
  - filter: "all" | "active" | "completed"
  - search: string
  - version: 1

Storage key: `todoapp:v1`. A `version` field is included for future-proofing. The loader sanitizes malformed data via try/catch and basic shape checks.

## Accessibility and UX

- Keyboard:
  - Focus lands on the new task input on load.
  - Enter in the new task input adds a task.
  - Tab order follows logical control order.
  - Space toggles a task checkbox (native).
  - Editing: Enter or blur saves; Esc cancels edit and restores previous text.
- ARIA:
  - Labels associated with controls where implicit labels aren’t enough.
  - A polite aria-live region announces count updates (total/active/completed).
- Focus management:
  - After adding: focus remains in the new task input for fast entry.
  - After editing: focus returns to the edited task’s title.
  - After deleting: focus moves to the next task (or previous), otherwise to the new task input.

## Files

- index.html
- styles.css
- src/storage.js
- src/state.js
- src/dom.js
- src/app.js

## Testing (lightweight)

Open the browser console and optionally run `__todoTest()` (commented in src/app.js) to simulate core CRUD flows. Since this is a static app, no runner is included.

## Notes

- The app is designed for modern browsers. It uses `crypto.randomUUID()` when available and falls back to a simple generator.
- Storage writes are debounced (~200ms) to reduce frequent localStorage writes during rapid state changes.

