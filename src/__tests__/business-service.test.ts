import { describe, it, expect } from 'vitest';
import { getBusinessBySlug } from '@/lib/business-service';
import { generateTailoredBusinessConfig, BUSINESS_ARCHETYPES } from '@/lib/archetypes';

describe('Multi-Tenant Business Service & Configuration', () => {
  it('should generate complete and valid archetype config for any business', () => {
    const config = generateTailoredBusinessConfig({
      name: 'מספרת אלפא',
      slug: 'alpha',
      ownerName: 'יוסי',
      phone: '050-111-2222',
      city: 'חיפה',
      archetypeId: 'mens-barbershop',
      themeColor: '#10B981',
    });

    expect(config.name).toBe('מספרת אלפא');
    expect(config.slug).toBe('alpha');
    expect(config.ownerName).toBe('יוסי');
    expect(config.city).toBe('חיפה');
    expect(config.themeColor).toBe('#10B981');
    expect(config.services.length).toBeGreaterThan(0);
    expect(config.branches.length).toBeGreaterThan(0);
    expect(config.faqs?.length).toBeGreaterThan(0);
    expect(config.testimonials?.length).toBeGreaterThan(0);
  });

  it('should contain all required archetypes', () => {
    expect(BUSINESS_ARCHETYPES['mens-barbershop']).toBeDefined();
    expect(BUSINESS_ARCHETYPES['womens-salon']).toBeDefined();
    expect(BUSINESS_ARCHETYPES['luxury-vip']).toBeDefined();
    expect(BUSINESS_ARCHETYPES['unisex-family']).toBeDefined();
  });

  it('should resolve fallback config gracefully when offline', async () => {
    const business = await getBusinessBySlug('unknown-tenant');
    expect(business).toBeDefined();
    expect(business.slug).toBe('unknown-tenant');
    expect(business.services.length).toBeGreaterThan(0);
  });
});
