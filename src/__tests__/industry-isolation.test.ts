import { describe, it, expect } from 'vitest';
import { INDUSTRY_PRESETS } from '@/lib/industry-presets';
import {
  INDUSTRY_MEDIA_MAP,
  getIndustryGalleryPhotos,
  getIndustryAmbientSlides,
  getIndustryHeroImage,
  getIndustryAvatarUrl,
} from '@/lib/industry-media';
import {
  INDUSTRY_TERMINOLOGIES,
  INDUSTRY_META_MAP,
  resolveIndustryCategoryKey,
  getIndustryTerminology,
  getIndustryMeta,
} from '@/lib/industry-terminology';
import { getBusinessBySlug } from '@/lib/business-service';

describe('Industry Niche Isolation & Media Integrity Tests', () => {
  const EXPECTED_NICHES = [
    'barber',
    'beauty_salon',
    'cosmetics_aesthetician',
    'clinic_therapist',
    'private_instructor',
    'clinics_aesthetics',
    'home_technician',
    'tattoo_piercing',
  ];

  it('should contain all 8 distinct industry presets with complete configurations', () => {
    expect(INDUSTRY_PRESETS.length).toBe(8);

    for (const preset of INDUSTRY_PRESETS) {
      expect(preset.id).toBeDefined();
      expect(preset.name).toBeDefined();
      expect(preset.shopName).toBeDefined();
      expect(preset.themeColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(preset.services.length).toBeGreaterThan(0);
      expect(preset.faqs.length).toBeGreaterThan(0);
      expect(preset.trustBadges.length).toBeGreaterThan(0);
      expect(preset.policies).toBeDefined();
    }
  });

  it('should have complete and isolated media bundles in INDUSTRY_MEDIA_MAP for all 8 niches', () => {
    for (const nicheKey of EXPECTED_NICHES) {
      const bundle = INDUSTRY_MEDIA_MAP[nicheKey];
      expect(bundle).toBeDefined();
      expect(bundle.heroImage).toContain('https://');
      expect(bundle.heroImages.length).toBeGreaterThanOrEqual(2);
      expect(bundle.avatarUrl).toContain('https://');
      expect(bundle.galleryPhotos.length).toBeGreaterThanOrEqual(4);
      expect(bundle.ambientSlides.length).toBeGreaterThanOrEqual(3);

      // Verify gallery items have titles and categories
      for (const photo of bundle.galleryPhotos) {
        expect(photo.title).toBeDefined();
        expect(photo.category).toBeDefined();
        expect(photo.src).toContain('https://');
      }

      // Verify ambient slides have titles, descriptions and tags
      for (const slide of bundle.ambientSlides) {
        expect(slide.title).toBeDefined();
        expect(slide.description).toBeDefined();
        expect(slide.tag).toBeDefined();
        expect(slide.src).toContain('https://');
      }
    }
  });

  it('should guarantee zero image cross-contamination between niches', () => {
    const barberPhotos = INDUSTRY_MEDIA_MAP.barber.galleryPhotos.map((p) => p.src);
    const nailsPhotos = INDUSTRY_MEDIA_MAP.beauty_salon.galleryPhotos.map((p) => p.src);
    const cosmeticsPhotos = INDUSTRY_MEDIA_MAP.cosmetics_aesthetician.galleryPhotos.map((p) => p.src);
    const spaPhotos = INDUSTRY_MEDIA_MAP.clinic_therapist.galleryPhotos.map((p) => p.src);
    const fitnessPhotos = INDUSTRY_MEDIA_MAP.private_instructor.galleryPhotos.map((p) => p.src);
    const clinicsPhotos = INDUSTRY_MEDIA_MAP.clinics_aesthetics.galleryPhotos.map((p) => p.src);
    const technicianPhotos = INDUSTRY_MEDIA_MAP.home_technician.galleryPhotos.map((p) => p.src);
    const tattooPhotos = INDUSTRY_MEDIA_MAP.tattoo_piercing.galleryPhotos.map((p) => p.src);

    // Verify each gallery list is completely unique to its niche
    const checkOverlap = (a: string[], b: string[]) => a.some((img) => b.includes(img));

    expect(checkOverlap(barberPhotos, nailsPhotos)).toBe(false);
    expect(checkOverlap(barberPhotos, cosmeticsPhotos)).toBe(false);
    expect(checkOverlap(barberPhotos, fitnessPhotos)).toBe(false);
    expect(checkOverlap(nailsPhotos, cosmeticsPhotos)).toBe(false);
    expect(checkOverlap(spaPhotos, fitnessPhotos)).toBe(false);
    expect(checkOverlap(technicianPhotos, tattooPhotos)).toBe(false);
    expect(checkOverlap(clinicsPhotos, barberPhotos)).toBe(false);
  });

  it('should accurately resolve all demo site slugs to their exact corresponding category and media', async () => {
    const demoSlugMappings = [
      { slug: 'dvir', expectedCategory: 'barber', expectedBadge: 'פרימיום Barber Hub' },
      { slug: 'beauty', expectedCategory: 'beauty_salon', expectedBadge: 'Russian Manicure & Apex Studio' },
      { slug: 'cosmetics', expectedCategory: 'cosmetics_aesthetician', expectedBadge: 'P.M.E Clinical Skincare & Aesthetics' },
      { slug: 'spa', expectedCategory: 'clinic_therapist', expectedBadge: 'Holistic Botanical Wellness Spa' },
      { slug: 'trainer', expectedCategory: 'private_instructor', expectedBadge: 'Pro Fitness & Body Coaching' },
      { slug: 'clinic', expectedCategory: 'clinics_aesthetics', expectedBadge: 'Advanced Aesthetic Clinic' },
      { slug: 'services', expectedCategory: 'home_technician', expectedBadge: 'Certified Home Pro Services' },
      { slug: 'tattoo', expectedCategory: 'tattoo_piercing', expectedBadge: 'Custom Tattoo Art Studio' },
    ];

    for (const testCase of demoSlugMappings) {
      const biz = await getBusinessBySlug(testCase.slug);
      expect(biz).toBeDefined();

      const resolvedCategory = resolveIndustryCategoryKey(biz);
      expect(resolvedCategory).toBe(testCase.expectedCategory);

      const terminology = getIndustryTerminology(biz);
      expect(terminology).toBeDefined();
      expect(terminology.id).toBe(testCase.expectedCategory);

      const meta = getIndustryMeta(biz);
      expect(meta).toBeDefined();
      expect(meta.categoryKey).toBe(testCase.expectedCategory);

      // Verify dynamic media resolution
      const hero = getIndustryHeroImage(biz);
      const avatar = getIndustryAvatarUrl(biz);
      const gallery = getIndustryGalleryPhotos(biz);
      const ambient = getIndustryAmbientSlides(biz);

      expect(hero).toContain('https://');
      expect(avatar).toContain('https://');
      expect(gallery.length).toBeGreaterThanOrEqual(4);
      expect(ambient.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('should have complete tailored client notes fields and WhatsApp retention templates for all 8 niches', () => {
    for (const nicheKey of EXPECTED_NICHES) {
      const term = INDUSTRY_TERMINOLOGIES[nicheKey];
      expect(term).toBeDefined();
      expect(term.staffTitle).toBeDefined();
      expect(term.serviceTitle).toBeDefined();
      expect(term.whatsappGreeting.length).toBeGreaterThan(0);
      expect(term.clientNotesFields.field1Label).toBeDefined();
      expect(term.clientNotesFields.field2Label).toBeDefined();
      expect(term.clientNotesFields.field3Label).toBeDefined();
    }
  });
});
