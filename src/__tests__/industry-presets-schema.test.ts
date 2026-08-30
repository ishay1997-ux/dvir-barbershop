import { describe, it, expect } from 'vitest';
import { INDUSTRY_PRESETS } from '@/lib/industry-presets';

describe('Industry Presets Integrity & Schema Validation Tests', () => {
  it('should load all 8 required industry presets', () => {
    expect(INDUSTRY_PRESETS.length).toBe(8);
    const expectedPresetIds = [
      'barbershop',
      'cosmetics-aesthetician',
      'nails-beauty',
      'spa-massage',
      'tattoo-piercing',
      'fitness-trainer',
      'clinics-aesthetics',
      'home-technician',
    ];

    const presetIds = INDUSTRY_PRESETS.map((p) => p.id);
    expectedPresetIds.forEach((id) => {
      expect(presetIds).toContain(id);
    });
  });

  INDUSTRY_PRESETS.forEach((preset) => {
    describe(`Preset: ${preset.name} (${preset.id})`, () => {
      it('should have valid metadata, icons, and non-empty Hebrew names', () => {
        expect(preset.name.trim().length).toBeGreaterThan(0);
        expect(preset.shopName.trim().length).toBeGreaterThan(0);
        expect(preset.ownerName.trim().length).toBeGreaterThan(0);
        expect(preset.slogan.trim().length).toBeGreaterThan(0);
        expect(preset.icon.trim().length).toBeGreaterThan(0);
      });

      it('should have a valid theme hex color and background theme', () => {
        expect(preset.themeColor).toMatch(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
        expect([
          'dark-obsidian',
          'brand-midnight',
          'luxury-light',
          'cyber-carbon',
          'lavender-mist',
          'botanical-sage',
        ]).toContain(preset.bgTheme);
      });

      it('should contain a valid list of services with positive prices and durations', () => {
        expect(preset.services.length).toBeGreaterThan(0);
        preset.services.forEach((service: any) => {
          expect(service.id.trim().length).toBeGreaterThan(0);
          expect(service.name.trim().length).toBeGreaterThan(0);
          expect(service.price).toBeGreaterThan(0);
          const dur = service.duration || service.durationMinutes;
          expect(dur).toBeGreaterThan(0);
        });
      });

      it('should contain valid FAQs with questions and answers', () => {
        expect(preset.faqs.length).toBeGreaterThan(0);
        preset.faqs.forEach((faq) => {
          expect(faq.question.trim().length).toBeGreaterThan(0);
          expect(faq.answer.trim().length).toBeGreaterThan(0);
        });
      });

      it('should define clear cancellation and arrival policies', () => {
        expect(preset.policies.cancellationNotice.trim().length).toBeGreaterThan(0);
        expect(preset.policies.arrivalTime.trim().length).toBeGreaterThan(0);
        expect(preset.policies.paymentMethods.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
