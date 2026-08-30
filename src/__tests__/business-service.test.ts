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

  it('should correctly resolve and instantiate the cosmetics-aesthetician archetype', async () => {
    // 1. Check archetype definition
    expect(BUSINESS_ARCHETYPES['cosmetics-aesthetician']).toBeDefined();
    expect(BUSINESS_ARCHETYPES['cosmetics-aesthetician'].name).toContain('קוסמטיקה פרא-רפואית');

    // 2. Generate tailored business config
    const config = generateTailoredBusinessConfig({
      name: 'קליניקת גלואו סקין',
      slug: 'glow-skin',
      ownerName: 'שירן כהן',
      phone: '054-999-8888',
      city: 'הרצליה',
      archetypeId: 'cosmetics-aesthetician',
    });

    expect(config.category).toBe('beauty_salon');
    expect(config.layout?.bgTheme).toBe('lavender-mist');
    expect(config.layout?.fontStyle).toBe('luxury-serif');
    expect(config.services.some(s => s.name.includes('אקנה'))).toBe(true);
    expect(config.services.some(s => s.name.includes('פיגמנטציה'))).toBe(true);
    expect(config.services.some(s => s.name.includes('אנטי-אייג׳ינג'))).toBe(true);

    // 3. Demo slug resolution
    const demoCosmetics = await getBusinessBySlug('cosmetics');
    expect(demoCosmetics).toBeDefined();
    expect(demoCosmetics.category).toBe('beauty_salon');
    expect(demoCosmetics.transformations?.length).toBeGreaterThan(0);
    expect(demoCosmetics.transformations?.[0].title).toContain('אקנאי');
  });

  it('should correctly resolve and instantiate the nails-beauty archetype with authentic Israeli nail services', async () => {
    const config = generateTailoredBusinessConfig({
      name: 'סטודיו מיה לציפורניים',
      slug: 'maya-nails',
      ownerName: 'מיה',
      phone: '052-777-6666',
      city: 'ראשון לציון',
      archetypeId: 'beauty-cosmetics',
    });

    expect(config.category).toBe('beauty_salon');
    expect(config.services.some(s => s.name.includes('מבנה אנטומי'))).toBe(true);
    expect(config.services.some(s => s.name.includes('פוליג׳ל'))).toBe(true);
    expect(config.services.some(s => s.name.includes('פדיקור'))).toBe(true);

    const demoNails = await getBusinessBySlug('beauty');
    expect(demoNails).toBeDefined();
    expect(demoNails.category).toBe('beauty_salon');
    expect(demoNails.transformations?.length).toBeGreaterThan(0);
    expect(demoNails.transformations?.[0].title).toContain('מניקור רוסי');
  });

  it('should dynamically resolve industry-specific media, gallery photos, and ambient slides across all niches', async () => {
    const {
      getIndustryGalleryPhotos,
      getIndustryAmbientSlides,
      getIndustryHeroImage,
      getIndustryAvatarUrl,
      INDUSTRY_MEDIA_MAP,
    } = await import('@/lib/industry-media');

    // 1. Verify all 8 niches in INDUSTRY_MEDIA_MAP have authentic high-res images
    const niches = Object.keys(INDUSTRY_MEDIA_MAP) as (keyof typeof INDUSTRY_MEDIA_MAP)[];
    expect(niches.length).toBe(8);

    for (const niche of niches) {
      const media = INDUSTRY_MEDIA_MAP[niche];
      expect(media.heroImages.length).toBeGreaterThan(0);
      expect(media.galleryPhotos.length).toBeGreaterThan(0);
      expect(media.ambientSlides.length).toBeGreaterThan(0);
      expect(media.avatarUrl).toBeTruthy();
      expect(media.heroImages[0].startsWith('http')).toBe(true);
      expect(media.galleryPhotos[0].src.startsWith('http')).toBe(true);
    }

    // 2. Barbershop gallery vs Cosmetics vs Spa vs Tattoo
    const barberPhotos = getIndustryGalleryPhotos({ slug: 'dvir', category: 'barber' });
    expect(barberPhotos.length).toBe(6);
    expect(barberPhotos.some((p) => p.category.includes('דירוג') || p.category.includes('זקן') || p.category.includes('תספורת'))).toBe(true);

    const beautyPhotos = getIndustryGalleryPhotos({ slug: 'beauty', category: 'beauty_salon' });
    expect(beautyPhotos.length).toBe(6);
    expect(beautyPhotos.some((p) => p.category.includes('ציפורניים') || p.category.includes('מבנה אנטומי') || p.category.includes('מניקור'))).toBe(true);

    const spaPhotos = getIndustryGalleryPhotos({ slug: 'spa', category: 'clinic_therapist' });
    expect(spaPhotos.length).toBe(6);
    expect(spaPhotos.some((p) => p.category.includes('עיסוי') || p.category.includes('ספא'))).toBe(true);

    const tattooPhotos = getIndustryGalleryPhotos({ slug: 'tattoo' });
    expect(tattooPhotos.length).toBe(6);
    expect(tattooPhotos.some((p) => p.category.includes('קעקוע') || p.category.includes('פירסינג'))).toBe(true);

    // 3. Ambient slides resolution
    const spaSlides = getIndustryAmbientSlides({ slug: 'spa', category: 'clinic_therapist' });
    expect(spaSlides.length).toBe(3);
    expect(spaSlides[0].tag).toContain('ספא');

    const barberSlides = getIndustryAmbientSlides({ slug: 'dvir', category: 'barber' });
    expect(barberSlides.length).toBe(3);
    expect(barberSlides[0].tag).toContain('ברברשופ');

    // 4. Hero and avatar resolution
    const heroImage = getIndustryHeroImage({ slug: 'trainer' });
    expect(heroImage).toBeTruthy();
    expect(heroImage.startsWith('http')).toBe(true);

    const avatarUrl = getIndustryAvatarUrl({ slug: 'trainer' });
    expect(avatarUrl).toBeTruthy();
    expect(avatarUrl.startsWith('http')).toBe(true);
  });
});

