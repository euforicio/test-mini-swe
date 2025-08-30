const express = require('express');
const path = require('path');
const { db, init } = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to convert DB row to API shape
function toTodo(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    completed: !!row.completed,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// Validation helpers
function validateTitle(title, required = true) {
  if (!required && (title === undefined || title === null)) return null;
  if (typeof title !== 'string' || title.trim().length === 0) {
    return 'Title is required and must be a non-empty string.';
  }
  if (title.trim().length > 255) {
    return 'Title must be at most 255 characters.';
  }
  return null;
}

function validateDescription(description) {
  if (description === undefined || description === null) return null;
  if (typeof description !== 'string') return 'Description must be a string.';
  if (description.length > 2000) return 'Description must be at most 2000 characters.';
  return null;
}

function validateCompleted(completed) {
  if (completed === undefined || completed === null) return null;
  if (typeof completed !== 'boolean') return 'Completed must be a boolean.';
  return null;
}

// Routes
app.get('/api/todos', (req, res, next) => {
  const filter = (req.query.filter || 'all').toLowerCase();
  let where = '';
  if (filter === 'active') where = 'WHERE completed = 0';
  else if (filter === 'completed') where = 'WHERE completed = 1';

  db.all(`SELECT * FROM todos ${where} ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return next(err);
    res.json(rows.map(toTodo));
  });
});

app.get('/api/todos/:id', (req, res, next) => {
  const id = Number(req.params.id);
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Todo not found' });
    res.json(toTodo(row));
  });
});

app.post('/api/todos', (req, res, next) => {
  const { title, description = '', completed = false } = req.body || {};
  const errors = [
    validateTitle(title, true),
    validateDescription(description),
    validateCompleted(completed)
  ].filter(Boolean);
  if (errors.length) return res.status(400).json({ errors });

  const now = new Date().toISOString();
  db.run(
    `INSERT INTO todos (title, description, completed, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [title.trim(), description, completed ? 1 : 0, now, now],
    function (err) {
      if (err) return next(err);
      db.get('SELECT * FROM todos WHERE id = ?', [this.lastID], (err2, row) => {
        if (err2) return next(err2);
        res.status(201).json(toTodo(row));
      });
    }
  );
});

app.put('/api/todos/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const { title, description, completed } = req.body || {};

  const errors = [
    validateTitle(title, false),
    validateDescription(description),
    validateCompleted(completed)
  ].filter(Boolean);
  if (errors.length) return res.status(400).json({ errors });

  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, existing) => {
    if (err) return next(err);
    if (!existing) return res.status(404).json({ error: 'Todo not found' });

    const newTitle = title !== undefined ? title.trim() : existing.title;
    if (newTitle.length === 0) return res.status(400).json({ errors: ['Title cannot be empty.'] });
    const newDescription = description !== undefined ? description : existing.description;
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed;
    const now = new Date().toISOString();

    db.run(
      `UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = ? WHERE id = ?`,
      [newTitle, newDescription, newCompleted, now, id],
      function (err2) {
        if (err2) return next(err2);
        db.get('SELECT * FROM todos WHERE id = ?', [id], (err3, row) => {
          if (err3) return next(err3);
          res.json(toTodo(row));
        });
      }
    );
  });
});

app.delete('/api/todos/:id', (req, res, next) => {
  const id = Number(req.params.id);
  db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: 'Todo not found' });
    res.status(204).send();
  });
});

// Error handling
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize DB and start server if run directly
if (require.main === module) {
  init()
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
      });
    })
    .catch((e) => {
      console.error('Failed to initialize database:', e);
      process.exit(1);
    });
}

module.exports = { app, init };
