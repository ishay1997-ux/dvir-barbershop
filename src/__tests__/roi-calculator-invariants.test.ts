import { describe, it, expect } from 'vitest';
import { calculateBusinessRoi } from '@/lib/utils';

describe('ROI Calculator Mathematical Invariants Tests', () => {
  it('should calculate standard realistic salon ROI projection correctly', () => {
    // 14 appts/day, 90 NIS avg price, 24 work days
    const result = calculateBusinessRoi(14, 90, 24);

    expect(result.monthlyAppointments).toBe(336); // 14 * 24
    expect(result.hoursSavedPerMonth).toBe(28);   // (336 * 5) / 60
    expect(result.recoveredNoShowsMonthly).toBe(27); // Math.round(336 * 0.08)
    expect(result.recoveredRevenueMonthly).toBe(2430); // 27 * 90
    expect(result.recoveredRevenueYearly).toBe(29160); // 2430 * 12
  });

  describe('Mathematical Boundary Invariants', () => {
    it('should clamp 0 appointments or 0 price to 0 without NaN', () => {
      const zeroAppts = calculateBusinessRoi(0, 100, 24);
      expect(zeroAppts.monthlyAppointments).toBe(0);
      expect(zeroAppts.hoursSavedPerMonth).toBe(0);
      expect(zeroAppts.recoveredRevenueMonthly).toBe(0);
      expect(zeroAppts.recoveredRevenueYearly).toBe(0);

      const zeroPrice = calculateBusinessRoi(20, 0, 24);
      expect(zeroPrice.monthlyAppointments).toBe(480);
      expect(zeroPrice.recoveredRevenueMonthly).toBe(0);
      expect(zeroPrice.recoveredRevenueYearly).toBe(0);
    });

    it('should clamp negative numbers safely to zero', () => {
      const negativeResult = calculateBusinessRoi(-10, -50, -5);
      expect(negativeResult.monthlyAppointments).toBe(0);
      expect(negativeResult.hoursSavedPerMonth).toBe(0);
      expect(negativeResult.recoveredRevenueMonthly).toBe(0);
      expect(negativeResult.recoveredRevenueYearly).toBe(0);
    });

    it('should handle extreme high load without precision loss or Infinity', () => {
      const highLoad = calculateBusinessRoi(500, 1500, 26);
      expect(Number.isFinite(highLoad.monthlyAppointments)).toBe(true);
      expect(Number.isFinite(highLoad.recoveredRevenueMonthly)).toBe(true);
      expect(Number.isFinite(highLoad.recoveredRevenueYearly)).toBe(true);
      expect(highLoad.recoveredRevenueYearly).toBe(highLoad.recoveredRevenueMonthly * 12);
    });

    it('should handle non-numeric or undefined inputs gracefully', () => {
      const badInput = calculateBusinessRoi('invalid' as any, null as any, undefined as any);
      expect(badInput.monthlyAppointments).toBe(0);
      expect(badInput.hoursSavedPerMonth).toBe(0);
      expect(badInput.recoveredRevenueMonthly).toBe(0);
      expect(badInput.recoveredRevenueYearly).toBe(0);
      expect(Number.isNaN(badInput.recoveredRevenueMonthly)).toBe(false);
    });
  });
});
