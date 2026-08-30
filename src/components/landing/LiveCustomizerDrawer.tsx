'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  Target,
  Palette,
  Layout,
  Layers,
  RotateCcw,
  Sparkles,
  Save,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import { NichesTab } from './customizer/NichesTab';
import { ColorsThemeTab } from './customizer/ColorsThemeTab';
import { SectionsReorderTab } from './customizer/SectionsReorderTab';
import { StyleTypographyTab } from './customizer/StyleTypographyTab';
import type {
  HeroArchetype,
  ServicesStyle,
  CardRadius,
  GalleryStyle,
  TypographyMood,
  SectionId,
  BusinessConfig,
} from '@/types/business';

interface LiveCustomizerDrawerProps {
  business: BusinessConfig;
  onChangeBusiness: (updated: BusinessConfig) => void;
}

export function LiveCustomizerDrawer({
  business,
  onChangeBusiness,
}: LiveCustomizerDrawerProps) {
  const { success, info } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'layout' | 'sections' | 'niches'>('colors');
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSection = (id: SectionId) => {
    const currentOrder = business.layout?.sectionsOrder || [];
    const newOrder = currentOrder.includes(id)
      ? currentOrder.filter((s) => s !== id)
      : [...currentOrder, id];

    onChangeBusiness({
      ...business,
      layout: {
        ...business.layout,
        sectionsOrder: newOrder,
      },
    });
  };

  const handleMoveSection = (id: SectionId, direction: 'up' | 'down') => {
    const currentOrder = [...(business.layout?.sectionsOrder || [])];
    const idx = currentOrder.indexOf(id);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      [currentOrder[idx - 1], currentOrder[idx]] = [currentOrder[idx], currentOrder[idx - 1]];
    } else if (direction === 'down' && idx < currentOrder.length - 1) {
      [currentOrder[idx + 1], currentOrder[idx]] = [currentOrder[idx], currentOrder[idx + 1]];
    }

    onChangeBusiness({
      ...business,
      layout: {
        ...business.layout,
        sectionsOrder: currentOrder,
      },
    });
  };

  const handleReset = () => {
    onChangeBusiness({
      ...business,
      themeColor: '#C9A84C',
      layout: {
        ...business.layout,
        bgTheme: 'dark-obsidian',
        heroStyle: 'hub-monogram',
        servicesStyle: 'split-gallery',
        cardRadius: 'smooth',
        galleryStyle: 'before-after-slider',
        typographyMood: 'modern-clean',
      },
    });
    info('ההגדרות אופסו לברירת המחדל');
  };

  const handleApplyPreset = (preset: any) => {
    onChangeBusiness({
      ...business,
      name: preset.shopName,
      ownerName: preset.ownerName,
      slogan: preset.slogan,
      announcement: preset.announcement,
      themeColor: preset.themeColor,
      services: preset.services && preset.services.length > 0 ? preset.services : business.services,
      faqs: preset.faqs && preset.faqs.length > 0 ? preset.faqs : business.faqs,
      layout: {
        ...business.layout,
        bgTheme: preset.bgTheme,
        heroStyle: preset.heroStyle,
        servicesStyle: preset.servicesStyle,
        galleryStyle: preset.galleryStyle,
        borderRadius: preset.borderRadius,
        fontStyle: preset.fontStyle,
        sectionsOrder: preset.sectionsOrder || business.layout?.sectionsOrder,
      },
    });
    success(`סגנון ${preset.name} הוחל בהצלחה! ✨`);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      success('העיצוב נשמר בהצלחה!');
    }, 400);
  };

  return (
    <>
      {/* Trigger Floating Button - Bottom Right (no top collision, high contrast in all themes) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 px-4 py-2.5 rounded-full bg-[#090A0F]/95 text-amber-400 border border-amber-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group ring-2 ring-amber-400/20 hover:ring-amber-400/60 select-none"
          title="פתח מעצב חי (Live Customizer)"
          aria-label="פתח מעצב חי"
          id="live-customizer-trigger-btn"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:rotate-45 transition-transform">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black text-white">התאמה אישית (Live)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-400/40" />
        </button>
      )}

      {/* Slide-over Drawer - Opens from Right Side (Natural Hebrew RTL) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Panel (Right side slide) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-zinc-950 text-white z-50 shadow-2xl border-l border-white/10 flex flex-col live-customizer-drawer live-customizer-panel"
              dir="rtl"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">מעצב חי (Live Customizer)</h2>
                    <p className="text-[10px] text-zinc-400 font-sans">שינוי בזמן אמת של האתר</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="אפס לברירת מחדל"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="סגור"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="grid grid-cols-4 p-2 bg-zinc-900/50 border-b border-white/10 gap-1 text-center">
                {[
                  { id: 'colors', label: 'צבעים', icon: Palette },
                  { id: 'layout', label: 'סגנון', icon: Layout },
                  { id: 'sections', label: 'סקשנים', icon: Layers },
                  { id: 'niches', label: 'ענפים', icon: Target },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'niches' && (
                  <NichesTab business={business} onApplyPreset={handleApplyPreset} />
                )}

                {activeTab === 'colors' && (
                  <ColorsThemeTab
                    business={business}
                    onThemeChange={(t) =>
                      onChangeBusiness({
                        ...business,
                        layout: { ...business.layout, bgTheme: t },
                      })
                    }
                    onColorChange={(c) =>
                      onChangeBusiness({ ...business, themeColor: c })
                    }
                  />
                )}

                {activeTab === 'layout' && (
                  <StyleTypographyTab
                    business={business}
                    onHeroStyleChange={(s) =>
                      onChangeBusiness({
                        ...business,
                        layout: { ...business.layout, heroStyle: s },
                      })
                    }
                    onServicesStyleChange={(s) =>
                      onChangeBusiness({
                        ...business,
                        layout: { ...business.layout, servicesStyle: s },
                      })
                    }
                    onCardRadiusChange={(r) =>
                      onChangeBusiness({
                        ...business,
                        layout: { ...business.layout, cardRadius: r },
                      })
                    }
                    onGalleryStyleChange={(g) =>
                      onChangeBusiness({
                        ...business,
                        layout: { ...business.layout, galleryStyle: g },
                      })
                    }
                    onTypographyMoodChange={(m) =>
                      onChangeBusiness({
                        ...business,
                        layout: { ...business.layout, typographyMood: m },
                      })
                    }
                    onLogoChange={(url) =>
                      onChangeBusiness({ ...business, logoUrl: url })
                    }
                  />
                )}

                {activeTab === 'sections' && (
                  <SectionsReorderTab
                    sectionsOrder={business.layout?.sectionsOrder || []}
                    onToggleSection={handleToggleSection}
                    onMoveSection={handleMoveSection}
                  />
                )}
              </div>

              {/* Footer CTA */}
              <div className="p-3 border-t border-white/10 bg-zinc-900 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-sans">
                  השינויים מוחלים אוטומטית באתר החי
                </span>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'שומר...' : 'שמור'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default LiveCustomizerDrawer;
