import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit } from '@/lib/rateLimit';

describe('Rate Limiter Burst Protection & DoS Invariants Tests', () => {
  const testIp1 = '203.0.113.195';
  const testIp2 = '198.51.100.42';

  it('should allow requests within configured burst limit', () => {
    const limit = 5;
    const windowMs = 5000;
    const identifier = `burst-test-${Date.now()}-1`;

    for (let i = 1; i <= limit; i++) {
      const result = checkRateLimit(identifier, limit, windowMs);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(limit - i);
    }
  });

  it('should block subsequent requests once limit is exceeded', () => {
    const limit = 3;
    const windowMs = 5000;
    const identifier = `block-test-${Date.now()}-2`;

    // 3 allowed requests
    checkRateLimit(identifier, limit, windowMs);
    checkRateLimit(identifier, limit, windowMs);
    checkRateLimit(identifier, limit, windowMs);

    // 4th and 5th requests must be blocked
    const blocked1 = checkRateLimit(identifier, limit, windowMs);
    expect(blocked1.success).toBe(false);
    expect(blocked1.remaining).toBe(0);

    const blocked2 = checkRateLimit(identifier, limit, windowMs);
    expect(blocked2.success).toBe(false);
    expect(blocked2.remaining).toBe(0);
  });

  it('should isolate rate limits across different IP addresses / identifiers', () => {
    const limit = 2;
    const windowMs = 5000;
    const idA = `user-a-${Date.now()}`;
    const idB = `user-b-${Date.now()}`;

    // Exhaust idA
    checkRateLimit(idA, limit, windowMs);
    checkRateLimit(idA, limit, windowMs);
    const blockedA = checkRateLimit(idA, limit, windowMs);
    expect(blockedA.success).toBe(false);

    // idB should still be fresh and allowed
    const freshB = checkRateLimit(idB, limit, windowMs);
    expect(freshB.success).toBe(true);
    expect(freshB.remaining).toBe(1);
  });
});
