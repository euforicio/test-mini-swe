const sqlite3 = require('sqlite3').verbose();

const DB_FILE = process.env.SQLITE_DB || 'db.sqlite';
const db = new sqlite3.Database(DB_FILE);

function init() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 255),
          description TEXT DEFAULT '',
          completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

module.exports = { db, init };
