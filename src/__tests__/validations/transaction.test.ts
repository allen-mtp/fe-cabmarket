import { describe, it, expect } from 'vitest';
import { transactionSchema } from '@/lib/validations/transaction';

describe('transactionSchema', () => {
  const validTaxi = {
    amount: 30000,
    category: 'taxi' as const,
    date: '2025-06-25',
    payer: 'A',
    participants: ['A', 'B'],
    session: 'sang' as const,
  };

  const validMarket = {
    amount: 50000,
    category: 'market' as const,
    date: '2025-06-25',
    payer: 'B',
    participants: ['A', 'B', 'C'],
    note: 'Mua đồ ăn',
  };

  it('pass taxi hợp lệ', () => {
    expect(transactionSchema.safeParse(validTaxi).success).toBe(true);
  });

  it('pass market hợp lệ', () => {
    expect(transactionSchema.safeParse(validMarket).success).toBe(true);
  });

  it('từ chối amount = 0', () => {
    const result = transactionSchema.safeParse({ ...validTaxi, amount: 0 });
    expect(result.success).toBe(false);
  });

  it('từ chối amount âm', () => {
    const result = transactionSchema.safeParse({ ...validTaxi, amount: -1000 });
    expect(result.success).toBe(false);
  });

  it('từ chối amount quá 1 tỷ', () => {
    const result = transactionSchema.safeParse({ ...validTaxi, amount: 2_000_000_000 });
    expect(result.success).toBe(false);
  });

  it('từ chối thiếu amount', () => {
    const { amount, ...rest } = validTaxi;
    expect(transactionSchema.safeParse(rest).success).toBe(false);
  });

  it('từ chối category không hợp lệ', () => {
    const result = transactionSchema.safeParse({ ...validTaxi, category: 'food' });
    expect(result.success).toBe(false);
  });

  it('từ chối thiếu category', () => {
    const { category, ...rest } = validTaxi;
    expect(transactionSchema.safeParse(rest).success).toBe(false);
  });

  it('từ chối date không hợp lệ', () => {
    const result = transactionSchema.safeParse({ ...validTaxi, date: 'not-a-date' });
    expect(result.success).toBe(false);
  });

  it('từ chối participants rỗng', () => {
    const result = transactionSchema.safeParse({ ...validTaxi, participants: [] });
    expect(result.success).toBe(false);
  });

  it('từ chối payer rỗng', () => {
    const result = transactionSchema.safeParse({ ...validTaxi, payer: '' });
    expect(result.success).toBe(false);
  });

  it('taxi thiếu session bị từ chối', () => {
    const result = transactionSchema.safeParse({
      amount: 30000,
      category: 'taxi',
      date: '2025-06-25',
      payer: 'A',
      participants: ['A', 'B'],
    });
    expect(result.success).toBe(false);
    expect(String(result.error?.issues[0]?.path)).toContain('session');
  });

  it('market thiếu note bị từ chối', () => {
    const result = transactionSchema.safeParse({
      amount: 50000,
      category: 'market',
      date: '2025-06-25',
      payer: 'B',
      participants: ['A', 'B'],
    });
    expect(result.success).toBe(false);
    expect(String(result.error?.issues[0]?.path)).toContain('note');
  });

  it('market với note rỗng (toàn khoảng trắng) bị từ chối', () => {
    const result = transactionSchema.safeParse({ ...validMarket, note: '   ' });
    expect(result.success).toBe(false);
  });

  it('note quá 255 ký tự bị từ chối', () => {
    const result = transactionSchema.safeParse({
      ...validMarket,
      note: 'a'.repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it('session không hợp lệ bị từ chối', () => {
    const result = transactionSchema.safeParse({
      ...validTaxi,
      session: 'toi',
    });
    expect(result.success).toBe(false);
  });
});