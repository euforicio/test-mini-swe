# Todo App (Express + SQLite + Vanilla JS)

A complete, modern Todo application:
- Frontend: responsive, clean UI with HTML/CSS/JS to add, edit, delete, toggle completion, and filter (all/active/completed).
- Backend: Node.js/Express REST API with validation and error handling.
- Database: SQLite persistence with proper schema and timestamps.
- Tests: Jest + Supertest coverage for core CRUD and filters.
- Documentation: Setup, run, and API reference below.

## Quick Start

Prerequisites: Node.js >= 16 and npm

1. Install dependencies
   npm install

2. Run the app (visit http://localhost:3000)
   npm start

3. Run tests
   npm test

The server serves the frontend from the "public" directory and exposes the API under /api/todos.

## Project Structure

- server.js — Express server and REST API routes
- db.js — SQLite connection and schema initialization
- public/
  - index.html — UI
  - style.css — styles
  - app.js — client logic calling the API
- tests/ — Jest + Supertest API tests
- jest.config.js — Jest configuration

## Configuration

- SQLITE_DB: path to SQLite database file. Defaults to db.sqlite
  - Tests use an in-memory database by setting SQLITE_DB=":memory:".

## API

Base URL: http://localhost:3000

Resource: /api/todos

Todo object:
{
  id: number,
  title: string,
  description: string,
  completed: boolean,
  created_at: ISO8601 string,
  updated_at: ISO8601 string
}

- GET /api/todos?filter=all|active|completed
  200 OK -> Todo[]

- GET /api/todos/:id
  200 OK -> Todo
  404 Not Found

- POST /api/todos
  Body: { title: string (1..255), description?: string (<=2000), completed?: boolean }
  201 Created -> Todo
  400 Bad Request -> { errors: string[] }

- PUT /api/todos/:id
  Body: Partial<{ title, description, completed }>
  200 OK -> Todo
  400 Bad Request -> { errors: string[] }
  404 Not Found

- DELETE /api/todos/:id
  204 No Content
  404 Not Found

## Validation and Error Handling

- Title is required on create, optional on update, trimmed, max 255 chars.
- Description optional, max 2000 chars.
- Completed must be boolean when provided.
- Responses use appropriate HTTP statuses; unexpected errors return 500 JSON error.

## Development Notes

- The backend converts SQLite integer flags (0/1) into boolean "completed" in API responses.
- Timestamps use ISO 8601 strings (created_at, updated_at).
- Static files are served from /public.

## Testing

The tests use an in-memory SQLite DB (":memory:"). To run:
npm test

## License

MIT
