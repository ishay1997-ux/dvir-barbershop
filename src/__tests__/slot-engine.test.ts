import { describe, it, expect } from 'vitest';
import {
  getAvailableSlots,
  timeToMinutes,
  minutesToTime,
  SlotEngineConfig,
} from '@/lib/slot-engine';

describe('Slot Engine - Scheduling & Availability Pure Logic Tests', () => {
  describe('Time <-> Minutes Conversion', () => {
    it('should convert time string to minutes accurately', () => {
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('09:00')).toBe(540);
      expect(timeToMinutes('14:30')).toBe(870);
      expect(timeToMinutes('23:59')).toBe(1439);
    });

    it('should convert minutes to time string accurately', () => {
      expect(minutesToTime(0)).toBe('00:00');
      expect(minutesToTime(540)).toBe('09:00');
      expect(minutesToTime(870)).toBe('14:30');
      expect(minutesToTime(1439)).toBe('23:59');
    });
  });

  describe('Slot Generation & Boundaries', () => {
    const futureDate = '2030-01-15'; // Deterministic future date

    it('should generate continuous 30-min slots during standard working hours', () => {
      const config: SlotEngineConfig = {
        date: futureDate,
        workingHours: { open: '09:00', close: '12:00', closed: false },
        serviceDurationMinutes: 30,
        stepMinutes: 30,
        filterPastIfToday: false,
      };

      const slots = getAvailableSlots(config);
      // 09:00, 09:30, 10:00, 10:30, 11:00, 11:30 (12:00 is closing, so 6 slots)
      expect(slots).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']);
      expect(slots.length).toBe(6);
    });

    it('should return empty array if working hours are marked as closed', () => {
      const config: SlotEngineConfig = {
        date: futureDate,
        workingHours: { open: '09:00', close: '20:00', closed: true },
      };

      const slots = getAvailableSlots(config);
      expect(slots).toEqual([]);
    });

    it('should return empty array if daily override sets isOpen = false', () => {
      const config: SlotEngineConfig = {
        date: futureDate,
        workingHours: { open: '09:00', close: '20:00', closed: false },
        dailyOverride: { isOpen: false },
      };

      const slots = getAvailableSlots(config);
      expect(slots).toEqual([]);
    });

    it('should exclude slots that collide with active lunch break', () => {
      const config: SlotEngineConfig = {
        date: futureDate,
        workingHours: { open: '12:00', close: '15:00', closed: false },
        lunchBreak: { start: '13:00', end: '14:00', isActive: true },
        serviceDurationMinutes: 30,
        stepMinutes: 30,
        filterPastIfToday: false,
      };

      const slots = getAvailableSlots(config);
      // Expected: 12:00, 12:30, (13:00 & 13:30 in break), 14:00, 14:30
      expect(slots).toEqual(['12:00', '12:30', '14:00', '14:30']);
      expect(slots).not.toContain('13:00');
      expect(slots).not.toContain('13:30');
    });

    it('should exclude existing booked appointment times', () => {
      const config: SlotEngineConfig = {
        date: futureDate,
        workingHours: { open: '10:00', close: '12:00', closed: false },
        bookedTimes: ['10:30', '11:30'],
        serviceDurationMinutes: 30,
        stepMinutes: 30,
        filterPastIfToday: false,
      };

      const slots = getAvailableSlots(config);
      // 10:00 (available), 10:30 (booked), 11:00 (available), 11:30 (booked)
      expect(slots).toEqual(['10:00', '11:00']);
      expect(slots).not.toContain('10:30');
      expect(slots).not.toContain('11:30');
    });

    it('should respect custom service duration and buffer time', () => {
      const config: SlotEngineConfig = {
        date: futureDate,
        workingHours: { open: '10:00', close: '12:00', closed: false },
        serviceDurationMinutes: 45,
        stepMinutes: 45,
        filterPastIfToday: false,
      };

      const slots = getAvailableSlots(config);
      // 10:00 (ends 10:45), 10:45 (ends 11:30). Next would be 11:30 ending 12:15 which exceeds 12:00
      expect(slots).toEqual(['10:00', '10:45']);
    });
  });
});
