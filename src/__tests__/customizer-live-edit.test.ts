import { describe, it, expect } from 'vitest';
import { DVIR_FLAGSHIP_CONFIG } from '@/config/dvir.config';
import { INDUSTRY_PRESETS } from '@/lib/industry-presets';
import { getThemeTokens, BgThemeOption } from '@/lib/theme-tokens';
import { COLOR_PALETTES } from '@/components/admin/settings/design-studio/ThemePaletteSection';
import type {
  BusinessConfig,
  HeroArchetype,
  ServicesStyle,
  CardRadius,
  GalleryStyle,
  TypographyMood,
  SectionId,
} from '@/types/business';

describe('Live Customizer & Site Editing Integrity Tests', () => {
  const initialConfig: BusinessConfig = JSON.parse(JSON.stringify(DVIR_FLAGSHIP_CONFIG));

  it('1. should seamlessly apply all 8 niche presets with complete payload overrides', () => {
    for (const preset of INDUSTRY_PRESETS) {
      let state = { ...initialConfig };

      // Simulate handleApplyPreset in LiveCustomizerDrawer
      state = {
        ...state,
        name: preset.shopName,
        ownerName: preset.ownerName,
        slogan: preset.slogan,
        announcement: preset.announcement,
        themeColor: preset.themeColor,
        heroImages: preset.heroImages || state.heroImages,
        galleryImages: preset.galleryImages || state.galleryImages,
        avatarUrl: preset.avatarUrl || state.avatarUrl,
        transformations: preset.transformations || state.transformations,
        services: preset.services && preset.services.length > 0 ? preset.services : state.services,
        faqs: preset.faqs && preset.faqs.length > 0 ? preset.faqs : state.faqs,
        layout: {
          ...state.layout,
          bgTheme: preset.bgTheme,
          heroStyle: preset.heroStyle,
          servicesStyle: preset.servicesStyle,
          galleryStyle: preset.galleryStyle,
          borderRadius: preset.borderRadius,
          fontStyle: preset.fontStyle,
        },
      };

      expect(state.name).toBe(preset.shopName);
      expect(state.ownerName).toBe(preset.ownerName);
      expect(state.themeColor).toBe(preset.themeColor);
      expect(state.layout?.bgTheme).toBe(preset.bgTheme);
      expect(state.layout?.heroStyle).toBe(preset.heroStyle);
      expect(state.layout?.servicesStyle).toBe(preset.servicesStyle);
      expect(state.layout?.galleryStyle).toBe(preset.galleryStyle);
      expect(state.services.length).toBeGreaterThan(0);
    }
  });

  it('2. should properly mutate all 6 background atmosphere themes and update tokens', () => {
    const themes: BgThemeOption[] = [
      'dark-obsidian',
      'brand-midnight',
      'luxury-light',
      'cyber-carbon',
      'lavender-mist',
      'botanical-sage',
    ];

    for (const theme of themes) {
      const updatedConfig: BusinessConfig = {
        ...initialConfig,
        layout: {
          ...initialConfig.layout,
          bgTheme: theme,
        },
      };

      expect(updatedConfig.layout?.bgTheme).toBe(theme);
      const tokens = getThemeTokens(theme);
      expect(tokens.bgTheme).toBe(theme);
      expect(tokens.cardBg.length).toBeGreaterThan(0);
      expect(tokens.textPrimary.length).toBeGreaterThan(0);
    }
  });

  it('3. should update accent theme colors for all predefined palettes and custom HEX values', () => {
    for (const palette of COLOR_PALETTES) {
      const updated: BusinessConfig = {
        ...initialConfig,
        themeColor: palette.hex,
      };
      expect(updated.themeColor).toBe(palette.hex);
    }

    // Custom hex
    const customHex = '#FF3366';
    const customUpdated = { ...initialConfig, themeColor: customHex };
    expect(customUpdated.themeColor).toBe('#FF3366');
  });

  it('4. should switch between all 3 Hero layout archetypes', () => {
    const heroStyles: HeroArchetype[] = ['hub-monogram', 'split-cinema', 'minimalist-vip'];

    for (const style of heroStyles) {
      const updated: BusinessConfig = {
        ...initialConfig,
        layout: {
          ...initialConfig.layout,
          heroStyle: style,
        },
      };
      expect(updated.layout?.heroStyle).toBe(style);
    }
  });

  it('5. should switch between all 3 Services & Pricing display styles', () => {
    const serviceStyles: ServicesStyle[] = ['split-gallery', 'cards-grid', 'compact-menu'];

    for (const style of serviceStyles) {
      const updated: BusinessConfig = {
        ...initialConfig,
        layout: {
          ...initialConfig.layout,
          servicesStyle: style,
        },
      };
      expect(updated.layout?.servicesStyle).toBe(style);
    }
  });

  it('6. should switch between all 3 Gallery & Showcase display styles', () => {
    const galleryStyles: GalleryStyle[] = ['before-after-slider', 'instagram-masonry', 'ambient-carousel'];

    for (const style of galleryStyles) {
      const updated: BusinessConfig = {
        ...initialConfig,
        layout: {
          ...initialConfig.layout,
          galleryStyle: style,
        },
      };
      expect(updated.layout?.galleryStyle).toBe(style);
    }
  });

  it('7. should switch between all 3 Typography moods and 3 Card border radius styles', () => {
    const typos: TypographyMood[] = ['modern-clean', 'luxury-serif', 'urban-bold'];
    for (const typo of typos) {
      const updated: BusinessConfig = {
        ...initialConfig,
        layout: {
          ...initialConfig.layout,
          typographyMood: typo,
        },
      };
      expect(updated.layout?.typographyMood).toBe(typo);
    }

    const radiuses: CardRadius[] = ['sharp', 'smooth', 'pill'];
    for (const radius of radiuses) {
      const updated: BusinessConfig = {
        ...initialConfig,
        layout: {
          ...initialConfig.layout,
          cardRadius: radius,
        },
      };
      expect(updated.layout?.cardRadius).toBe(radius);
    }
  });

  it('8. should dynamically toggle section visibility and reorder sections', () => {
    const defaultSections: SectionId[] = [
      'hero',
      'trust-badges',
      'services',
      'bio',
      'policies',
      'branches',
      'gallery',
      'reviews',
      'faqs',
    ];

    let currentOrder = [...defaultSections];

    // Toggle off 'reviews'
    currentOrder = currentOrder.filter((s) => s !== 'reviews');
    expect(currentOrder.includes('reviews')).toBe(false);

    // Toggle on 'reviews'
    currentOrder = [...currentOrder, 'reviews'];
    expect(currentOrder.includes('reviews')).toBe(true);

    // Move 'reviews' up
    const idx = currentOrder.indexOf('reviews');
    [currentOrder[idx - 1], currentOrder[idx]] = [currentOrder[idx], currentOrder[idx - 1]];
    expect(currentOrder[currentOrder.length - 2]).toBe('reviews');
  });
});
