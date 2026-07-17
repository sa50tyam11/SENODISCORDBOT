const db = require('./db');

function initDb() {
  console.log('Initializing database schema...');

  db.exec(`
    CREATE TABLE IF NOT EXISTS warnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      moderatorId TEXT NOT NULL,
      reason TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS focus_mode (
      userId TEXT PRIMARY KEY,
      expiresAt DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS standup_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      yesterday TEXT,
      today TEXT,
      blockers TEXT,
      date DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  console.log('Database initialized successfully.');
}

module.exports = { initDb };
