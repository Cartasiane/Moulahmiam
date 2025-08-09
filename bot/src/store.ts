import { db, DB, currentMonth } from './db';
import type { Row } from 'better-sqlite3';

export interface Max { user_id: number; amount: number; }
export interface Share { userId: number; max: number; share: number; }

export function addExpense(userId: number, amount: number, description = '', month = currentMonth(), database: DB = db) {
  database.prepare('INSERT INTO expenses (user_id, amount, description, month) VALUES (?, ?, ?, ?)')
    .run(userId, amount, description, month);
}

export function setMax(userId: number, amount: number, month = currentMonth(), database: DB = db) {
  const del = database.prepare('DELETE FROM maxes WHERE user_id = ? AND month = ?');
  del.run(userId, month);
  database.prepare('INSERT INTO maxes (user_id, amount, month) VALUES (?, ?, ?)')
    .run(userId, amount, month);
}

export function getExpensesTotal(month = currentMonth(), database: DB = db): number {
  const row = database.prepare('SELECT SUM(amount) as total FROM expenses WHERE month = ?')
    .get(month) as Row & { total: number | null };
  return row.total || 0;
}

export function getMaxes(month = currentMonth(), database: DB = db): Max[] {
  return database.prepare('SELECT user_id, amount FROM maxes WHERE month = ?')
    .all(month) as Max[];
}

export function calculateShares(base: number, maxes: Max[], expensesTotal: number): Share[] {
  const total = base + expensesTotal;
  const sumMax = maxes.reduce((s, m) => s + m.amount, 0);
  if (sumMax === 0) return [];
  const factor = total / sumMax;
  return maxes.map(m => ({
    userId: m.user_id,
    max: m.amount,
    share: Math.round(m.amount * factor * 100) / 100,
  }));
}

export function getSummary(base: number, month = currentMonth(), database: DB = db): { text: string; shares: Share[] } {
  const expenses = getExpensesTotal(month, database);
  const maxes = getMaxes(month, database);
  const shares = calculateShares(base, maxes, expenses);
  const total = base + expenses;
  const sumMax = maxes.reduce((s, m) => s + m.amount, 0);
  const factor = sumMax === 0 ? 0 : total / sumMax;

  const lines = [
    `Base: ${base.toFixed(2)}`,
    `Frais: ${expenses.toFixed(2)}`,
    `Total: ${total.toFixed(2)}`,
    `Somme des max: ${sumMax.toFixed(2)}`,
    `Facteur: ${factor.toFixed(2)}`,
    '',
    'Parts:'
  ];

  for (const s of shares) {
    lines.push(`- ${s.userId}: ${s.share.toFixed(2)}`);
  }

  return { text: lines.join('\n'), shares };
}

export function markPaid(userId: number, month = currentMonth(), database: DB = db) {
  const existing = database.prepare('SELECT id FROM payments WHERE user_id = ? AND month = ?')
    .get(userId, month) as Row & { id?: number };
  if (existing && existing.id) {
    database.prepare('UPDATE payments SET paid = 1 WHERE id = ?').run(existing.id);
  } else {
    database.prepare('INSERT INTO payments (user_id, month, paid) VALUES (?, ?, 1)').run(userId, month);
  }
}
