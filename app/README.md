# Todo App (Client-only)

Tech: React + TypeScript + Vite + Tailwind. Data is stored in localStorage (key "todoapp:v1"), with debounced writes. Includes reducers/selectors, accessibility, keyboard shortcuts, import/export JSON (skips invalid items with feedback), native drag-and-drop and keyboard reordering, unit tests and minimal Playwright e2e, strict ESLint + Prettier + lint-staged, and GitHub Actions CI.

## Scripts
- pnpm dev
- pnpm build && pnpm preview
- pnpm test (Vitest)
- pnpm test:e2e (Playwright)
- pnpm lint
- pnpm format

## Keyboard
- N: focus New Task
- /: focus Search
- ?: toggle Help
- Space: toggle focused item
- E: edit focused item
- Alt+ArrowUp/Down: reorder focused item

## Import/Export
- Export JSON button downloads the todos.
- Import JSON accepts a JSON file; invalid items are skipped and reported.

## Notes
- No backend. All data is in localStorage under "todoapp:v1".
- Migration scaffold is included in lib/storage.ts.
