import { describe, it, expect } from 'vitest';
import { isReservedSlug, sanitizeSlug, RESERVED_SYSTEM_SLUGS } from '@/lib/utils';

describe('Slug Reservation & Path Collision Security Tests', () => {
  describe('isReservedSlug System Route Guard', () => {
    it('should block all system critical routes from being registered as merchant slugs', () => {
      RESERVED_SYSTEM_SLUGS.forEach((reserved) => {
        expect(isReservedSlug(reserved)).toBe(true);
      });
    });

    it('should block case-insensitive and slash-padded variations of reserved slugs', () => {
      expect(isReservedSlug('ADMIN')).toBe(true);
      expect(isReservedSlug('/admin')).toBe(true);
      expect(isReservedSlug('super-admin/')).toBe(true);
      expect(isReservedSlug('//api//')).toBe(true);
      expect(isReservedSlug('   booking   ')).toBe(true);
      expect(isReservedSlug('ACCESSIBILITY')).toBe(true);
    });

    it('should allow legitimate merchant and niche business slugs', () => {
      const allowedSlugs = [
        'dvir',
        'salon-maya',
        'barber-tlv',
        'spa-lotus',
        'dr-dan-clinic',
        'fitness-with-yossi',
        'plumber-haifa',
      ];

      allowedSlugs.forEach((slug) => {
        expect(isReservedSlug(slug)).toBe(false);
      });
    });

    it('should treat empty or undefined slug as reserved/invalid', () => {
      expect(isReservedSlug('')).toBe(true);
      expect(isReservedSlug(null as any)).toBe(true);
      expect(isReservedSlug(undefined as any)).toBe(true);
    });
  });

  describe('sanitizeSlug Security & Edge Cases', () => {
    it('should neutralize path traversal attempts', () => {
      expect(sanitizeSlug('../admin')).toBe('admin');
      expect(sanitizeSlug('../../etc/passwd')).toBe('etc-passwd');
      expect(sanitizeSlug('..\\..\\windows')).toBe('windows');
    });

    it('should strip special characters, spaces, and duplicate hyphens', () => {
      expect(sanitizeSlug('My Barbershop @ TLV #1!')).toBe('my-barbershop-tlv-1');
      expect(sanitizeSlug('---multiple---dashes---')).toBe('multiple-dashes');
      expect(sanitizeSlug('__under__scores__')).toBe('under__scores');
    });

    it('should handle empty input safely', () => {
      expect(sanitizeSlug('')).toBe('');
      expect(sanitizeSlug('   ')).toBe('');
    });
  });
});
