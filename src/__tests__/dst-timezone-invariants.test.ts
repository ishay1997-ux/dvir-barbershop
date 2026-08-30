import { describe, it, expect } from 'vitest';
import {
  getAvailableSlots,
  timeToMinutes,
  minutesToTime,
  SlotEngineConfig,
} from '@/lib/slot-engine';

describe('Israel Daylight Saving Time (DST) & Timezone Invariants Tests', () => {
  // Israel DST transitions typically happen on the last Friday of March (spring forward)
  // and the last Sunday of October (fall back).
  const springForwardDate = '2026-03-27'; // March DST transition in Israel
  const fallBackDate = '2026-10-25';      // October DST transition in Israel
  const standardDate = '2026-06-15';      // Standard summer date

  it('should generate identical 30-min slot boundaries across DST transition dates', () => {
    const baseConfig: Omit<SlotEngineConfig, 'date'> = {
      workingHours: { open: '09:00', close: '18:00', closed: false },
      serviceDurationMinutes: 30,
      stepMinutes: 30,
      filterPastIfToday: false,
    };

    const standardSlots = getAvailableSlots({ ...baseConfig, date: standardDate });
    const springSlots = getAvailableSlots({ ...baseConfig, date: springForwardDate });
    const fallSlots = getAvailableSlots({ ...baseConfig, date: fallBackDate });

    // 09:00 to 18:00 (9 hours * 2 = 18 slots)
    expect(standardSlots.length).toBe(18);
    expect(springSlots.length).toBe(18);
    expect(fallSlots.length).toBe(18);

    // Exact slot arrays must match identically without shifting
    expect(springSlots).toEqual(standardSlots);
    expect(fallSlots).toEqual(standardSlots);
    expect(springSlots[0]).toBe('09:00');
    expect(springSlots[springSlots.length - 1]).toBe('17:30');
  });

  it('should maintain strict scalar arithmetic for time conversions regardless of time offset', () => {
    // 09:00 is always 540 minutes from midnight
    expect(timeToMinutes('09:00')).toBe(540);
    expect(minutesToTime(540)).toBe('09:00');

    // 14:30 is always 870 minutes
    expect(timeToMinutes('14:30')).toBe(870);
    expect(minutesToTime(870)).toBe('14:30');

    // 20:00 is always 1200 minutes
    expect(timeToMinutes('20:00')).toBe(1200);
    expect(minutesToTime(1200)).toBe('20:00');
  });
});
