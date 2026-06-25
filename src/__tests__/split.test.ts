import { describe, it, expect } from 'vitest';
import { computeSplit } from '@/lib/split';

describe('computeSplit', () => {
  it('chia đều 100k cho 4 người, mỗi người 25k', () => {
    const result = computeSplit(100_000, ['An', 'Bình', 'Châu', 'Dũng'], 'An');
    expect(result.count).toBe(4);
    expect(result.perPerson).toBe(25000);
    expect(result.shares).toHaveLength(4);
    expect(result.shares.every((s) => s.amount === 25000)).toBe(true);
  });

  it('rải phần dư đúng cách khi 100k / 3 = 33333+33333+33334', () => {
    const result = computeSplit(100_000, ['A', 'B', 'C'], 'A');
    expect(result.count).toBe(3);
    const amounts = result.shares.map((s) => s.amount);
    // two get base 33333, first gets remainder -> 33334
    expect(amounts).toContain(33334);
    expect(amounts.filter((a) => a === 33333)).toHaveLength(2);
    expect(amounts.reduce((s, v) => s + v, 0)).toBe(100_000);
  });

  it('owedToPayer = tổng phần của người KHÔNG trả', () => {
    const result = computeSplit(90_000, ['A', 'B', 'C'], 'A');
    // 90k/3=30k each: A (payer) 30k, B 30k, C 30k → owedToPayer = 60k
    expect(result.owedToPayer).toBe(60_000);
  });

  it('owedToPayer = 0 khi chỉ có payer là người đi', () => {
    const result = computeSplit(50_000, ['A'], 'A');
    expect(result.owedToPayer).toBe(0);
  });

  it('trả về rỗng khi amount <= 0', () => {
    const result1 = computeSplit(0, ['A', 'B'], 'A');
    expect(result1.shares).toEqual([]);
    expect(result1.count).toBe(2);
    expect(result1.owedToPayer).toBe(0);

    const result2 = computeSplit(-100, ['A'], 'A');
    expect(result2.shares).toEqual([]);
  });

  it('trả về rỗng khi participants trống hoặc toàn rỗng', () => {
    expect(computeSplit(100, [], 'A').shares).toEqual([]);
    expect(computeSplit(100, ['', '  '], 'A').shares).toEqual([]);
  });

  it('loại bỏ chuỗi rỗng trong participants và chia đúng', () => {
    const result = computeSplit(40_000, ['', 'A', 'B'], 'A');
    expect(result.count).toBe(2);
    expect(result.shares).toHaveLength(2);
    expect(result.owedToPayer).toBe(20_000);
  });

  it('isPayer đánh dấu đúng người trả', () => {
    const result = computeSplit(60_000, ['A', 'B', 'C'], 'B');
    const payer = result.shares.find((s) => s.name === 'B');
    const nonPayer = result.shares.find((s) => s.name === 'A');
    expect(payer).toBeDefined();
    expect(payer!.isPayer).toBe(true);
    expect(nonPayer).toBeDefined();
    expect(nonPayer!.isPayer).toBe(false);
  });

  it('xử lý số tiền lẻ không đều (13k / 5 người)', () => {
    const result = computeSplit(13, ['A', 'B', 'C', 'D', 'E'], 'A');
    const amounts = result.shares.map((s) => s.amount);
    // base = 2, remainder = 3 → first 3 get 3, last 2 get 2
    expect(amounts[0]).toBe(3);
    expect(amounts[1]).toBe(3);
    expect(amounts[2]).toBe(3);
    expect(amounts[3]).toBe(2);
    expect(amounts[4]).toBe(2);
    expect(amounts.reduce((s, v) => s + v, 0)).toBe(13);
  });
});