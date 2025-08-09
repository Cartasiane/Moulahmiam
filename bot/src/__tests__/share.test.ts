import { describe, it, expect } from 'vitest';
import { calculateShares } from '../store';

describe('calculateShares', () => {
  it('calculates proportional shares', () => {
    const shares = calculateShares(100, [
      { user_id: 1, amount: 100 },
      { user_id: 2, amount: 200 },
    ], 50); // base 100 + expenses 50 = 150; sumMax 300
    // total = 150, sumMax=300 => factor=0.5
    expect(shares).toEqual([
      { userId: 1, max: 100, share: 50 },
      { userId: 2, max: 200, share: 100 },
    ]);
  });

  it('handles total greater than sum of max', () => {
    const shares = calculateShares(200, [
      { user_id: 1, amount: 100 },
      { user_id: 2, amount: 100 },
    ], 0); // total 200, sumMax 200, factor 1
    expect(shares).toEqual([
      { userId: 1, max: 100, share: 100 },
      { userId: 2, max: 100, share: 100 },
    ]);

    const shares2 = calculateShares(300, [
      { user_id: 1, amount: 100 },
      { user_id: 2, amount: 100 },
    ], 0); // total 300, sumMax 200, factor 1.5
    expect(shares2).toEqual([
      { userId: 1, max: 100, share: 150 },
      { userId: 2, max: 100, share: 150 },
    ]);
  });
});
