'use client';

import { useState } from 'react';
import { Sparkles, Save, RotateCcw, Eye, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import { IndustryPreset } from '@/lib/industry-presets';
import { IndustryPresetSelector } from './design-studio/IndustryPresetSelector';
import { ThemePaletteSection } from './design-studio/ThemePaletteSection';
import { BrandAssetsSection } from './design-studio/BrandAssetsSection';
import { LayoutArchetypesSection } from './design-studio/LayoutArchetypesSection';
import { SectionsManagerSection } from './design-studio/SectionsManagerSection';
import type { ShopSettings } from '@/lib/types';
import type {
  HeroArchetype,
  ServicesStyle,
  CardRadius,
  GalleryStyle,
  TypographyMood,
  SectionId,
} from '@/types/business';

interface DesignStudioSettingsProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export default function DesignStudioSettings({
  settings,
  onUpdateSettings,
  onNotifySave,
}: DesignStudioSettingsProps) {
  const { success, info } = useToast();

  const layout = settings.layoutConfig || {};
  const currentTheme = layout.bgTheme || settings.bgTheme || 'dark-obsidian';
  const currentColor = settings.themeColor || '#C9A84C';
  const currentHeroStyle: HeroArchetype = layout.heroStyle || 'hub-monogram';
  const currentServicesStyle: ServicesStyle = layout.servicesStyle || 'split-gallery';
  const currentCardRadius: CardRadius = layout.cardRadius || 'smooth';
  const currentGalleryStyle: GalleryStyle = layout.galleryStyle || 'before-after-slider';
  const currentTypographyMood: TypographyMood = layout.typographyMood || 'modern-clean';
  const currentSectionsOrder: SectionId[] = layout.sectionsOrder || [
    'hero',
    'booking-action-cards',
    'services',
    'before-after',
    'about',
    'reviews',
    'policies',
    'branches',
    'faq',
  ];
  const currentSectionTitles = layout.sectionTitles || {
    services: 'מחירון ושירותי פרימיום',
    gallery: 'לפני ואחרי & תוצאות עבודה',
    bio: `הכירו את ${settings.ownerName || 'הצוות'}`,
    reviews: 'מה הלקוחות שלנו אומרים',
  };
  const currentTrustBadges = layout.trustBadges || [
    'שירות ומקצועיות ללא פשרות',
    'חומרי פרימיום מובחרים',
    'היגיינה וסטריליזציה קפדנית',
    'חניה צמודה וגישה נוחה',
  ];

  const [isSaving, setIsSaving] = useState(false);

  const updateLayoutField = (updates: Record<string, any>) => {
    const updated: ShopSettings = {
      ...settings,
      layoutConfig: {
        ...layout,
        ...updates,
      },
    };
    onUpdateSettings(updated);
  };

  const handleApplyIndustryPreset = (preset: IndustryPreset) => {
    const updated: ShopSettings = {
      ...settings,
      themeColor: preset.themeColor,
      bgTheme: preset.bgTheme,
      layoutConfig: {
        ...layout,
        bgTheme: preset.bgTheme,
        heroStyle: preset.heroStyle,
        servicesStyle: preset.servicesStyle,
        cardRadius: preset.cardRadius || 'smooth',
        galleryStyle: preset.galleryStyle,
        typographyMood: preset.typographyMood || 'modern-clean',
        sectionsOrder: preset.sectionsOrder || [
          'hero',
          'booking-action-cards',
          'services',
          'before-after',
          'about',
          'reviews',
          'policies',
          'branches',
          'faq',
        ],
        trustBadges: preset.trustBadges,
        sectionTitles: {
          services: preset.sectionTitles?.services || 'מחירון ושירותים',
          gallery: preset.sectionTitles?.gallery || 'תוצאות ועבודות',
          bio: preset.sectionTitles?.bio || 'הכירו את הצוות',
          reviews: preset.sectionTitles?.reviews || 'מה הלקוחות אומרים',
        },
      },
    };
    onUpdateSettings(updated);
    info(`הוחלה תבנית ענף: "${preset.name}". לחץ 'שמור שינויים' להחלה קבועה.`);
  };

  const handleToggleSection = (id: SectionId) => {
    const newOrder = currentSectionsOrder.includes(id)
      ? currentSectionsOrder.filter((s) => s !== id)
      : [...currentSectionsOrder, id];
    updateLayoutField({ sectionsOrder: newOrder });
  };

  const handleMoveSection = (id: SectionId, direction: 'up' | 'down') => {
    const idx = currentSectionsOrder.indexOf(id);
    if (idx === -1) return;
    const newOrder = [...currentSectionsOrder];
    if (direction === 'up' && idx > 0) {
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    } else if (direction === 'down' && idx < newOrder.length - 1) {
      [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
    }
    updateLayoutField({ sectionsOrder: newOrder });
  };

  const handleResetToDefaults = () => {
    const updated: ShopSettings = {
      ...settings,
      themeColor: '#C9A84C',
      bgTheme: 'dark-obsidian',
      layoutConfig: {
        ...layout,
        bgTheme: 'dark-obsidian',
        heroStyle: 'hub-monogram',
        servicesStyle: 'split-gallery',
        cardRadius: 'smooth',
        galleryStyle: 'before-after-slider',
        typographyMood: 'modern-clean',
      },
    };
    onUpdateSettings(updated);
    info('ההגדרות אופסו לברירת המחדל היוקרתית');
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onNotifySave();
      success('הגדרות הסטודיו והעיצוב נשמרו בהצלחה!');
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-right" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#C9A84C]" />
            <h1 className="text-xl font-black text-[#1C1C1C]">סטודיו עיצוב ומיתוג (Design Studio)</h1>
          </div>
          <p className="text-xs text-[#6B6560] mt-1 font-sans">
            התאם את חוויית הנראות של האתר: תבניות ענף ב-1-Click, לוגו, צבעים, פתיח, גלריה וסדר סקשנים
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-[#E5DDD0]/50 text-[#1C1C1C] text-xs font-black flex items-center gap-2 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#C9A84C]" />
            צפה באתר החי
            <ExternalLink className="w-3 h-3 text-[#6B6560]" />
          </a>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="p-2.5 rounded-2xl border border-[#E5DDD0] text-[#6B6560] hover:bg-[#FAF7F2] transition-all cursor-pointer"
            title="אפס לברירת מחדל"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-2xl bg-[#C9A84C] hover:bg-[#B8973B] text-[#1C1C1C] text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
      </div>

      {/* 1. Industry Presets */}
      <IndustryPresetSelector
        settings={settings}
        currentTheme={currentTheme}
        onApplyPreset={handleApplyIndustryPreset}
      />

      {/* 2. Theme & Brand Color */}
      <ThemePaletteSection
        currentTheme={currentTheme}
        currentColor={currentColor}
        onSelectTheme={(t) => updateLayoutField({ bgTheme: t })}
        onSelectColor={(c) => onUpdateSettings({ ...settings, themeColor: c })}
      />

      {/* 3. Logo & Avatar Brand Assets */}
      <BrandAssetsSection
        logoUrl={settings.logoUrl}
        avatarUrl={settings.avatarUrl}
        ownerName={settings.ownerName || 'המנהל/ת'}
        onLogoChange={(url) => onUpdateSettings({ ...settings, logoUrl: url })}
        onAvatarChange={(url) => onUpdateSettings({ ...settings, avatarUrl: url })}
      />

      {/* 4. Layout Archetypes (Hero, Gallery, Services, Corners, Sticky Bar) */}
      <LayoutArchetypesSection
        heroStyle={currentHeroStyle}
        servicesStyle={currentServicesStyle}
        cardRadius={currentCardRadius}
        galleryStyle={currentGalleryStyle}
        typographyMood={currentTypographyMood}
        showMobileStickyBar={layout.showMobileStickyBar ?? true}
        onHeroStyleChange={(s) => updateLayoutField({ heroStyle: s })}
        onServicesStyleChange={(s) => updateLayoutField({ servicesStyle: s })}
        onCardRadiusChange={(r) => updateLayoutField({ cardRadius: r })}
        onGalleryStyleChange={(g) => updateLayoutField({ galleryStyle: g })}
        onTypographyMoodChange={(m) => updateLayoutField({ typographyMood: m })}
        onMobileStickyBarChange={(b) => updateLayoutField({ showMobileStickyBar: b })}
      />

      {/* 5. Sections Manager & Badges */}
      <SectionsManagerSection
        sectionsOrder={currentSectionsOrder}
        sectionTitles={currentSectionTitles}
        trustBadges={currentTrustBadges}
        onToggleSection={handleToggleSection}
        onMoveSection={handleMoveSection}
        onUpdateTitle={(key: string, val: string) =>
          updateLayoutField({
            sectionTitles: { ...currentSectionTitles, [key]: val },
          })
        }
        onAddTrustBadge={(b: string) =>
          updateLayoutField({ trustBadges: [...currentTrustBadges, b] })
        }
        onRemoveTrustBadge={(idx: number) =>
          updateLayoutField({
            trustBadges: currentTrustBadges.filter((_: string, i: number) => i !== idx),
          })
        }
      />
    </div>
  );
}
