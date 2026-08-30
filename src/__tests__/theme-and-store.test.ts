import { describe, it, expect } from 'vitest';
import { getThemeTokens } from '@/lib/theme-tokens';
import {
  getEffectiveShiftForDate,
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_BRANCHES,
  INITIAL_SETTINGS,
} from '@/lib/store/initial-data';
import type { ShopSettings } from '@/lib/types';

describe('Theme Tokens & Store Shift Calculation Tests', () => {
  const ALL_BG_THEMES = [
    'dark-obsidian',
    'brand-midnight',
    'luxury-light',
    'cyber-carbon',
    'lavender-mist',
    'botanical-sage',
  ] as const;

  it('should generate valid theme tokens for all 6 background themes', () => {
    for (const theme of ALL_BG_THEMES) {
      const tokens = getThemeTokens(theme);
      expect(tokens).toBeDefined();
      expect(tokens.cardBg).toBeDefined();
      expect(tokens.cardSubtleBg).toBeDefined();
      expect(tokens.textPrimary).toBeDefined();
      expect(tokens.textSecondary).toBeDefined();
      expect(tokens.borderColor).toBeDefined();
      expect(tokens.buttonSecondaryBg).toBeDefined();
      expect(typeof tokens.isLight).toBe('boolean');
    }
  });

  it('should accurately tag light vs dark themes', () => {
    expect(getThemeTokens('dark-obsidian').isLight).toBe(false);
    expect(getThemeTokens('brand-midnight').isLight).toBe(false);
    expect(getThemeTokens('cyber-carbon').isLight).toBe(false);

    expect(getThemeTokens('luxury-light').isLight).toBe(true);
    expect(getThemeTokens('lavender-mist').isLight).toBe(true);
    expect(getThemeTokens('botanical-sage').isLight).toBe(true);
  });

  it('should calculate effective shifts for normal weekdays, Fridays, and Saturdays', () => {
    // 2026-09-01 is a Tuesday (Ariel branch in seed)
    const tuesdayDate = new Date(2026, 8, 1);
    const tuesdayShift = getEffectiveShiftForDate(tuesdayDate, INITIAL_SETTINGS);
    expect(tuesdayShift.isOpen).toBe(true);
    expect(tuesdayShift.startTime).toBe('09:00');
    expect(tuesdayShift.endTime).toBe('20:00');
    expect(tuesdayShift.branchId).toBe('ariel');

    // 2026-09-04 is a Friday (short day, Rehovot branch)
    const fridayDate = new Date(2026, 8, 4);
    const fridayShift = getEffectiveShiftForDate(fridayDate, INITIAL_SETTINGS);
    expect(fridayShift.isOpen).toBe(true);
    expect(fridayShift.startTime).toBe('08:30');
    expect(fridayShift.endTime).toBe('13:30');
    expect(fridayShift.branchId).toBe('rehovot');

    // 2026-09-05 is a Saturday (closed)
    const saturdayDate = new Date(2026, 8, 5);
    const saturdayShift = getEffectiveShiftForDate(saturdayDate, INITIAL_SETTINGS);
    expect(saturdayShift.isOpen).toBe(false);
  });

  it('should apply custom shift overrides for specific dates', () => {
    const customSettings: ShopSettings = {
      ...INITIAL_SETTINGS,
      dailyOverrides: {
        '2026-09-01': {
          date: '2026-09-01',
          branchId: 'rehovot',
          isOpen: true,
          startTime: '08:00',
          endTime: '12:00',
          note: 'ערב חג',
        },
        '2026-09-02': {
          date: '2026-09-02',
          branchId: 'closed',
          isOpen: false,
          startTime: '09:00',
          endTime: '20:00',
          note: 'יום כיפור / חג סגור',
        },
      },
    };

    const tuesdayDate = new Date(2026, 8, 1);
    const holidayEve = getEffectiveShiftForDate(tuesdayDate, customSettings);
    expect(holidayEve.isOpen).toBe(true);
    expect(holidayEve.startTime).toBe('08:00');
    expect(holidayEve.endTime).toBe('12:00');
    expect(holidayEve.note).toBe('ערב חג');
    expect(holidayEve.isCustomOverride).toBe(true);

    const wednesdayDate = new Date(2026, 8, 2);
    const holidayFull = getEffectiveShiftForDate(wednesdayDate, customSettings);
    expect(holidayFull.isOpen).toBe(false);
    expect(holidayFull.note).toBe('יום כיפור / חג סגור');
    expect(holidayFull.isCustomOverride).toBe(true);
  });

  it('should have complete seed data for branches, barbers and services', () => {
    expect(INITIAL_SERVICES.length).toBeGreaterThan(0);
    expect(INITIAL_BARBERS.length).toBeGreaterThan(0);
    expect(INITIAL_BRANCHES.length).toBeGreaterThan(0);

    for (const srv of INITIAL_SERVICES) {
      expect(srv.id).toBeDefined();
      expect(srv.name).toBeDefined();
      expect(srv.price).toBeGreaterThan(0);
      expect(srv.duration).toBeGreaterThan(0);
    }

    for (const barber of INITIAL_BARBERS) {
      expect(barber.id).toBeDefined();
      expect(barber.name).toBeDefined();
      expect(barber.role).toBeDefined();
    }
  });
});
