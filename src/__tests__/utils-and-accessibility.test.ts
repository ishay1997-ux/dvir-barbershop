import { describe, it, expect } from 'vitest';
import {
  sanitizeSlug,
  formatDuration,
  formatPrice,
  generateTimeSlots,
  toDateKey,
  addDuration,
} from '@/lib/utils';
import { getThemeTokens } from '@/lib/theme-tokens';

describe('Utility & Formatting Pure Function Tests', () => {
  describe('sanitizeSlug', () => {
    it('should convert mixed strings to valid, URL-safe lowercase slugs', () => {
      expect(sanitizeSlug('Dvir Barbershop')).toBe('dvir-barbershop');
      expect(sanitizeSlug('   Beauty & Nails 2026!  ')).toBe('beauty-nails-2026');
      expect(sanitizeSlug('---hello---world---')).toBe('hello-world');
      expect(sanitizeSlug('My_Shop_Name')).toBe('my_shop_name');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes under an hour accurately in Hebrew', () => {
      expect(formatDuration(20)).toBe("20 דק'");
      expect(formatDuration(45)).toBe("45 דק'");
    });

    it('should format full hours and mixed hours/minutes in Hebrew', () => {
      expect(formatDuration(60)).toBe('1 שעה');
      expect(formatDuration(90)).toBe('1:30 שעות');
      expect(formatDuration(120)).toBe('2 שעה');
    });
  });

  describe('formatPrice', () => {
    it('should format shekel currency symbol correctly', () => {
      expect(formatPrice(80)).toBe('₪80');
      expect(formatPrice(150)).toBe('₪150');
      expect(formatPrice(0)).toBe('₪0');
    });
  });

  describe('generateTimeSlots & addDuration', () => {
    it('should generate accurate stepped time slots', () => {
      const slots = generateTimeSlots('09:00', '11:00', 30);
      expect(slots).toEqual(['09:00', '09:30', '10:00', '10:30']);
    });

    it('should add duration to a time string properly', () => {
      expect(addDuration('09:30', 30)).toBe('10:00');
      expect(addDuration('14:45', 45)).toBe('15:30');
    });
  });

  describe('Date Key Standard Formatting', () => {
    it('should format date to YYYY-MM-DD padded key', () => {
      const sampleDate = new Date(2026, 4, 3); // May 3, 2026 (month is 0-indexed)
      expect(toDateKey(sampleDate)).toBe('2026-05-03');
    });
  });

  describe('Theme Tokens Accessibility & Semantic Contrast Structure', () => {
    const themes = [
      'dark-obsidian',
      'brand-midnight',
      'luxury-light',
      'cyber-carbon',
      'lavender-mist',
      'botanical-sage',
    ] as const;

    themes.forEach((theme) => {
      it(`should return valid semantic token classes for theme: ${theme}`, () => {
        const tokens = getThemeTokens(theme);
        expect(tokens).toBeDefined();
        expect(tokens.bgTheme).toBe(theme);
        expect(typeof tokens.isLight).toBe('boolean');
        expect(tokens.cardBg.length).toBeGreaterThan(0);
        expect(tokens.textPrimary.length).toBeGreaterThan(0);
        expect(tokens.textSecondary.length).toBeGreaterThan(0);
        expect(tokens.borderColor.length).toBeGreaterThan(0);

        if (tokens.isLight) {
          expect(tokens.textPrimary).toMatch(/slate-950|stone-900|slate-900/);
        } else {
          expect(tokens.textPrimary).toMatch(/white|zinc-100|blue-50|gray-100/);
        }
      });
    });
  });
});
