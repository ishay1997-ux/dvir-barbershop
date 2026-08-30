import { describe, it, expect } from 'vitest';
import { getBusinessBySlug } from '@/lib/business-service';
import { generateTailoredBusinessConfig, BUSINESS_ARCHETYPES } from '@/lib/archetypes';
import { getIndustryMeta, getIndustryTerminology, resolveIndustryCategoryKey } from '@/lib/industry-terminology';
import { DVIR_FLAGSHIP_CONFIG } from '@/config/dvir.config';

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
    expect(BUSINESS_ARCHETYPES['beauty-cosmetics']).toBeDefined();
    expect(BUSINESS_ARCHETYPES['home-technician']).toBeDefined();
    expect(BUSINESS_ARCHETYPES['clinic-therapist']).toBeDefined();
  });

  it('should resolve fallback config gracefully when offline', async () => {
    const business = await getBusinessBySlug('unknown-tenant');
    expect(business).toBeDefined();
    expect(business.slug).toBe('unknown-tenant');
    expect(business.services.length).toBeGreaterThan(0);
  });

  it('should guarantee Barbershop classification regardless of theme color', () => {
    // Test barbershop with Emerald Green (#10B981)
    const greenBarberMeta = getIndustryMeta({
      name: 'המספרה של דביר',
      slug: 'dvir',
      themeColor: '#10B981',
    });
    expect(greenBarberMeta.categoryKey).toBe('barber');
    expect(greenBarberMeta.icon).toBe('✂️');
    expect(greenBarberMeta.label).toBe('Barbershop');
    expect(greenBarberMeta.vipBadge).toContain('BARBERSHOP');

    // Test barbershop with Sapphire Blue (#3B82F6)
    const blueBarberMeta = getIndustryMeta({
      name: 'דביר ברברשופ VIP',
      category: 'barber',
      themeColor: '#3B82F6',
    });
    expect(blueBarberMeta.categoryKey).toBe('barber');
    expect(blueBarberMeta.icon).toBe('✂️');

    // Test Flagship Config
    const flagshipMeta = getIndustryMeta(DVIR_FLAGSHIP_CONFIG);
    expect(flagshipMeta.categoryKey).toBe('barber');
    expect(flagshipMeta.icon).toBe('✂️');

    // Test Fitness Trainer correctly resolves to fitness
    const trainerMeta = getIndustryMeta({
      name: 'סטודיו אופק - אימונים אישיים',
      slug: 'trainer',
      category: 'private_instructor',
      themeColor: '#10B981',
    });
    expect(trainerMeta.categoryKey).toBe('private_instructor');
    expect(trainerMeta.icon).toBe('🏋️');
  });
});

