Title: feat: Full-stack Todo application (Express + SQLite + Vanilla JS)

Summary:
This PR introduces a complete Todo application:
- Backend: Node.js/Express REST API with CRUD, validation, and error handling.
- Database: SQLite with schema for todos (id, title, description, completed, created_at, updated_at).
- Frontend: Responsive HTML/CSS/JS interface with add, edit, delete, toggle, and filtering (all/active/completed).
- Tests: Jest + Supertest API tests.
- Documentation: Comprehensive README with setup and API docs.

Architecture Overview:
- server.js: Initializes Express, registers JSON middleware, serves static frontend, and defines RESTful routes under /api/todos.
  - Endpoints: GET collection (with filter), GET by id, POST create, PUT update, DELETE remove.
  - Validation helpers ensure title/description/completed meet constraints.
  - Error middleware standardizes 500 responses.
- db.js: Exposes a single sqlite3 database connection and "init" to ensure the todos table exists. DB file is configurable via SQLITE_DB; tests use ":memory:".
- Frontend (public/):
  - index.html: Semantically structured UI with form to add todos, filter controls, and a list.
  - style.css: Modern, accessible, responsive styling with dark theme.
  - app.js: Fetch-based client that calls the API, maintains state, renders list, and wires UI events (add, edit via prompts, delete, toggle, filter).
- Testing:
  - tests/todos.test.js: Covers create, list, update, filtering, delete, and validation errors using Supertest. Each test isolates data via table cleanup. Jest runs in Node environment.

Setup and Usage:
- Install: npm install
- Run: npm start (http://localhost:3000)
- Test: npm test

Notes:
- The API returns "completed" as boolean; SQLite stores it as 0/1 with constraints.
- Timestamps are ISO strings; "updated_at" changes on updates.
- The PR includes a .gitignore, jest config, and PR documentation.

Closes: N/A
