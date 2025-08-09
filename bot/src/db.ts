import Database from 'better-sqlite3';

export type DB = Database.Database;

export const db = new Database(process.env.DB_PATH || 'moulahmiam.db');

export function initDb(database: DB = db) {
  database.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      month TEXT NOT NULL
    )
  `).run();

  database.prepare(`
    CREATE TABLE IF NOT EXISTS maxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      month TEXT NOT NULL
    )
  `).run();

  database.prepare(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      month TEXT NOT NULL,
      paid INTEGER NOT NULL DEFAULT 0
    )
  `).run();
}

export function currentMonth(date = new Date()): string {
  return date.toISOString().slice(0, 7); // YYYY-MM
}
