import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { initDb, currentMonth } from '../db';
import { addExpense, getExpensesTotal, setMax, getMaxes } from '../store';

let db: Database.Database;

beforeEach(() => {
  db = new Database(':memory:');
  initDb(db);
});

describe('database operations', () => {
  it('adds expense and retrieves total', () => {
    const month = currentMonth();
    addExpense(1, 50, 'test', month, db);
    addExpense(1, 25, 'test2', month, db);
    expect(getExpensesTotal(month, db)).toBe(75);
  });

  it('sets max per user', () => {
    const month = currentMonth();
    setMax(1, 100, month, db);
    setMax(2, 200, month, db);
    const maxes = getMaxes(month, db);
    expect(maxes).toEqual([
      { user_id: 1, amount: 100 },
      { user_id: 2, amount: 200 },
    ]);
  });
});
