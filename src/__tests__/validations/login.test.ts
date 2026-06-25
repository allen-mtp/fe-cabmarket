import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/lib/validations/login';

describe('loginSchema', () => {
  const valid = {
    email: 'test@example.com',
    password: 'Password1',
  };

  it('pass login hợp lệ', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it('từ chối email rỗng', () => {
    expect(loginSchema.safeParse({ ...valid, email: '' }).success).toBe(false);
  });

  it('từ chối email không đúng định dạng', () => {
    expect(loginSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('từ chối thiếu email', () => {
    expect(loginSchema.safeParse({ password: 'Password1' }).success).toBe(false);
  });

  it('từ chối password dưới 6 ký tự', () => {
    expect(loginSchema.safeParse({ ...valid, password: '12345' }).success).toBe(false);
  });

  it('từ chối password rỗng', () => {
    expect(loginSchema.safeParse({ ...valid, password: '' }).success).toBe(false);
  });

  it('từ chối thiếu password', () => {
    expect(loginSchema.safeParse({ email: 'test@example.com' }).success).toBe(false);
  });

  it('pass password 6 ký tự', () => {
    expect(loginSchema.safeParse({ ...valid, password: '123456' }).success).toBe(true);
  });
});