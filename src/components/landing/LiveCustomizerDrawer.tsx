'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  Palette,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  X,
  ArrowUp,
  ArrowDown,
  Type,
  Square,
  Sparkle,
  GripVertical,
} from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { SaaSOnboardingModal } from '@/components/marketing/SaaSOnboardingModal';
import { INDUSTRY_PRESETS, IndustryPreset } from '@/lib/industry-presets';

interface LiveCustomizerDrawerProps {
  business: BusinessConfig;
  onChangeBusiness: (updated: BusinessConfig) => void;
}

const colorPresets = [
  { name: 'Gold Obsidian', color: '#C9A84C', icon: '💈', label: 'מספרות גברים פרימיום' },
  { name: 'Sunset Amber', color: '#F59E0B', icon: '🌅', label: 'קופר שקיעה & עץ חם' },
  { name: 'Nordic Teal', color: '#14B8A6', icon: '🌊', label: 'טורקיז מנטה נורדי מרענן' },
  { name: 'Rose Blush', color: '#EC4899', icon: '💅', label: 'קוסמטיקה & ציפורניים' },
  { name: 'Royal Violet', color: '#A855F7', icon: '💇‍♀️', label: 'סלוני יופי ונשים' },
  { name: 'Cyber Emerald', color: '#10B981', icon: '🏋️', label: 'קליניקות ומאמנים' },
  { name: 'Electric Ocean', color: '#0EA5E9', icon: '🔧', label: 'טכנאים ושירותי בית' },
  { name: 'Monochrome Luxury', color: '#E2E8F0', icon: '🖤', label: 'שחור-לבן מינימליסטי' },
];

const bgThemePresets = [
  { id: 'dark-obsidian', label: 'Dark Obsidian', icon: '🌌', desc: 'שחור פחם מט יוקרתי' },
  { id: 'brand-midnight', label: 'Brand Midnight', icon: '💎', desc: 'כחול נייבי-ספיר לילה עמוק' },
  { id: 'cyber-carbon', label: 'Cyber Carbon', icon: '🛸', desc: 'קרבון שחור מוחלט והילות ניאון' },
  { id: 'luxury-light', label: 'Luxury Alabaster', icon: '✨', desc: 'קרם אלבסטר ושמפניה נעימה' },
];

const SECTION_LABELS: Record<string, { label: string; icon: string; toggleKey?: string }> = {
  hero: { label: 'פתיח ראשי (Hero Hub)', icon: '💈' },
  'trust-badges': { label: 'תווי איכות וביטחון', icon: '🛡️', toggleKey: 'showTrustBadges' },
  services: { label: 'שירותים ומחירון דיגיטלי', icon: '📋' },
  bio: { label: 'פרופיל אודות הצוות (Bio)', icon: '👤', toggleKey: 'showBio' },
  policies: { label: 'מדיניות הגעה וביטולים', icon: '🤝', toggleKey: 'showPolicies' },
  branches: { label: 'סניפים ומפות ניווט Waze', icon: '🗺️', toggleKey: 'showBranches' },
  gallery: { label: 'גלריית לפני / אחרי (Slider)', icon: '✂️', toggleKey: 'showBeforeAfter' },
  reviews: { label: 'ביקורות ודירוגי לקוחות', icon: '⭐', toggleKey: 'showReviews' },
  faqs: { label: 'שאלות ותשובות נפוצות (FAQ)', icon: '❓', toggleKey: 'showFaqs' },
};

const DEFAULT_SECTIONS_ORDER = ['hero', 'trust-badges', 'services', 'bio', 'policies', 'branches', 'gallery', 'reviews', 'faqs'];

export function LiveCustomizerDrawer({
  business,
  onChangeBusiness,
}: LiveCustomizerDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'niches' | 'colors' | 'theme' | 'sections' | 'style'>('niches');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const sectionsOrder = (business.layout?.sectionsOrder && business.layout.sectionsOrder.length > 0)
    ? business.layout.sectionsOrder
    : DEFAULT_SECTIONS_ORDER;

  const currentRadius = business.layout?.borderRadius || 'modern-rounded';
  const currentFont = business.layout?.fontStyle || 'urban-bold';

  const handleColorChange = (newColor: string) => {
    onChangeBusiness({
      ...business,
      themeColor: newColor,
    });
  };

  const handleBgThemeChange = (newBg: any) => {
    onChangeBusiness({
      ...business,
      layout: {
        ...(business.layout || {}),
        bgTheme: newBg,
      },
    });
  };

  const handleApplyPreset = (preset: IndustryPreset) => {
    onChangeBusiness({
      ...business,
      name: preset.shopName,
      ownerName: preset.ownerName,
      slogan: preset.slogan,
      announcement: preset.announcement,
      themeColor: preset.themeColor,
      services: preset.services,
      faqs: preset.faqs,
      layout: {
        ...(business.layout || {}),
        bgTheme: preset.bgTheme,
        heroStyle: preset.heroStyle,
        servicesStyle: preset.servicesStyle,
        borderRadius: preset.borderRadius,
        fontStyle: preset.fontStyle,
        trustBadges: preset.trustBadges,
        policies: preset.policies,
      },
    });
  };

  const handleRadiusChange = (radius: 'modern-rounded' | 'sharp-luxury' | 'classic-soft') => {
    onChangeBusiness({
      ...business,
      layout: {
        ...(business.layout || {}),
        borderRadius: radius,
      },
    });
  };

  const handleFontChange = (font: 'modern-sans' | 'urban-bold' | 'luxury-serif') => {
    onChangeBusiness({
      ...business,
      layout: {
        ...(business.layout || {}),
        fontStyle: font,
      },
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sectionsOrder.length) return;

    const updated = [...sectionsOrder];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    onChangeBusiness({
      ...business,
      layout: {
        ...(business.layout || {}),
        sectionsOrder: updated as any,
      },
    });
  };

  const handleToggleSection = (sectionKey: string, currentVal: boolean = true) => {
    onChangeBusiness({
      ...business,
      layout: {
        ...(business.layout || {}),
        [sectionKey]: !currentVal,
      },
    });
  };

  const handleReset = () => {
    onChangeBusiness({
      ...business,
      themeColor: '#C9A84C',
      layout: {
        ...(business.layout || {}),
        bgTheme: 'dark-obsidian',
        heroStyle: 'hub-monogram',
        servicesStyle: 'split-gallery',
        borderRadius: 'modern-rounded',
        fontStyle: 'urban-bold',
        sectionsOrder: DEFAULT_SECTIONS_ORDER as any,
        sectionTitles: {},
        showBio: true,
        showBranches: true,
        showBeforeAfter: true,
        showReviews: true,
        showFaqs: true,
      },
    });
  };

  return (
    <>
      {/* Floating Trigger Button on the RIGHT side to avoid overlapping accessibility */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group px-4 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs shadow-2xl border border-slate-700/80 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xl"
          style={{ borderColor: `${business.themeColor || '#C9A84C'}80` }}
        >
          <div
            className="w-4 h-4 rounded-full shadow-inner animate-pulse shrink-0"
            style={{ backgroundColor: business.themeColor || '#C9A84C' }}
          />
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>התאמה אישית בלייב</span>
          </span>
          <span className="bg-indigo-600/30 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
            1-Click Live
          </span>
        </button>
      </div>

      {/* Slide-Up / Floating Studio Panel on the RIGHT side */}
      {isOpen && (
        <div
          className="live-customizer-drawer fixed bottom-22 right-6 z-50 w-full max-w-sm sm:max-w-md bg-[#0F172A] border border-slate-700 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-white space-y-4 text-right animate-in slide-in-from-bottom-5 duration-200 max-h-[85vh] overflow-y-auto"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-950 font-black text-xs shadow-xs"
                style={{ backgroundColor: business.themeColor || '#C9A84C' }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">סטודיו התאמה אישית בלייב</h4>
                <p className="text-[10px] text-slate-300">החלפת ענפים ב-1-Click, צבעים, סדר סקשנים וסגנון</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                title="איפוס להגדרות ברירת מחדל"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-tabs Switcher (5 tabs) */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-800/90 rounded-xl text-[10px] font-bold border border-slate-700/60 text-center">
            <button
              onClick={() => setActiveTab('niches')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'niches' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              ענפים 🎯
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'colors' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              צבעים 🎨
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'theme' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              אווירה 🌌
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'sections' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              סקשנים 🔀
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'style' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              סגנון
            </button>
          </div>

          {/* Tab 1: Color Presets */}
          {activeTab === 'colors' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map((p) => {
                  const isSelected = business.themeColor === p.color;
                  return (
                    <button
                      key={p.color}
                      onClick={() => handleColorChange(p.color)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-right cursor-pointer ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-950/80 shadow-xs'
                          : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-slate-950 font-black shadow-xs"
                        style={{ backgroundColor: p.color }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-slate-950" />}
                      </div>
                      <div className="truncate">
                        <div className="text-[11px] font-bold text-white truncate">{p.name}</div>
                        <div className="text-[9px] text-slate-300 truncate">{p.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Color Picker */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-300 font-bold">צבע מותאם אישית:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={business.themeColor || '#C9A84C'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-7 h-7 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                  />
                  <span className="font-mono text-[11px] text-white uppercase font-bold" dir="ltr">
                    {business.themeColor}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Background Themes */}
          {activeTab === 'theme' && (
            <div className="space-y-2">
              {bgThemePresets.map((t) => {
                const isSelected = (business.layout?.bgTheme || 'dark-obsidian') === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleBgThemeChange(t.id)}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all text-right cursor-pointer ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-950/80 shadow-xs'
                        : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <div className="text-xs font-black text-white">{t.label}</div>
                        <div className="text-[10px] text-slate-300">{t.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 3: Modular Layout & Section Reordering */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              <div className="text-[10px] text-slate-300 pb-1 flex items-center justify-between">
                <span>גרור או סדר את סדר המקטעים בעמוד:</span>
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <span>✋ Drag & Drop Reorder</span>
                </span>
              </div>
              <Reorder.Group
                axis="y"
                values={sectionsOrder}
                onReorder={(newOrder) => {
                  onChangeBusiness({
                    ...business,
                    layout: {
                      ...(business.layout || {}),
                      sectionsOrder: newOrder as any,
                    },
                  });
                }}
                className="space-y-2 select-none"
              >
                {sectionsOrder.map((sectionKey, idx) => {
                  const meta = SECTION_LABELS[sectionKey] || { label: sectionKey, icon: '📌' };
                  const isVisible = meta.toggleKey
                    ? (business.layout as any)?.[meta.toggleKey] !== false
                    : true;

                  return (
                    <Reorder.Item
                      key={sectionKey}
                      value={sectionKey}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md ${
                        isVisible
                          ? 'bg-slate-800/90 border-slate-700 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                      }`}
                      whileDrag={{
                        scale: 1.03,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
                        borderColor: "rgba(99, 102, 241, 0.8)",
                        zIndex: 50
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-grab active:cursor-grabbing" title="גרור לשינוי סדר">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className="text-base">{meta.icon}</span>
                        <div className="leading-tight">
                          <div className="text-xs font-bold">{meta.label}</div>
                          <div className="text-[9px] text-slate-400">גרור או הזז (מיקום {idx + 1})</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Up / Down Controls */}
                        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700/60">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveSection(idx, 'up');
                            }}
                            className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            title="הזז למעלה"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === sectionsOrder.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveSection(idx, 'down');
                            }}
                            className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            title="הזז למטה"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Visibility Toggle */}
                        {meta.toggleKey && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSection(meta.toggleKey!, isVisible);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isVisible
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-slate-800 border-slate-700 text-slate-500'
                            }`}
                            title={isVisible ? 'הסתר מקטע' : 'הצג מקטע'}
                          >
                            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              {/* Custom Headline Overrides */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-400" />
                  <span>עריכת כותרות סקשנים בהתאמה אישית:</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">כותרת סקשן שירותים:</label>
                    <input
                      type="text"
                      placeholder="השירותים והעבודות שלנו..."
                      value={business.layout?.sectionTitles?.services || ''}
                      onChange={(e) => {
                        onChangeBusiness({
                          ...business,
                          layout: {
                            ...(business.layout || {}),
                            sectionTitles: {
                              ...(business.layout?.sectionTitles || {}),
                              services: e.target.value,
                            },
                          },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">כותרת סקשן ביקורות:</label>
                    <input
                      type="text"
                      placeholder="מה אומרים הלקוחות..."
                      value={business.layout?.sectionTitles?.reviews || ''}
                      onChange={(e) => {
                        onChangeBusiness({
                          ...business,
                          layout: {
                            ...(business.layout || {}),
                            sectionTitles: {
                              ...(business.layout?.sectionTitles || {}),
                              reviews: e.target.value,
                            },
                          },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">כותרת סקשן סניפים:</label>
                    <input
                      type="text"
                      placeholder="איפה אנחנו נמצאים?..."
                      value={business.layout?.sectionTitles?.branches || ''}
                      onChange={(e) => {
                        onChangeBusiness({
                          ...business,
                          layout: {
                            ...(business.layout || {}),
                            sectionTitles: {
                              ...(business.layout?.sectionTitles || {}),
                              branches: e.target.value,
                            },
                          },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Hero Layout, Card Curves & Typography Moods */}
          {activeTab === 'style' && (
            <div className="space-y-4">
              {/* 1. Hero Layout Style */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-300">סגנון פתיח ראשי (Hero Layout):</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'hub-monogram', label: 'Panoramic Hub', sub: 'פנורמי + לוגו', icon: '💈' },
                    { id: 'split-cinema', label: 'Split Cinema', sub: 'תמונה + זימון', icon: '🎬' },
                    { id: 'minimalist-vip', label: 'Minimal VIP', sub: 'יוקרתי ממורכז', icon: '👑' },
                  ].map((h) => {
                    const isSelected = (business.layout?.heroStyle || 'hub-monogram') === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => {
                          onChangeBusiness({
                            ...business,
                            layout: {
                              ...(business.layout || {}),
                              heroStyle: h.id as any,
                            },
                          });
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-950/80 shadow-xs'
                            : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-base mb-1">{h.icon}</span>
                        <span className="text-xs font-bold text-white">{h.label}</span>
                        <span className="text-[9px] text-slate-400">{h.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Services Layout Style */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-300">סגנון תצוגת מחירון ושירותים:</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'split-gallery', label: 'Split Visuals', sub: 'מחירון + תמונות', icon: '📋' },
                    { id: 'cards-grid', label: 'Cards Grid', sub: 'כרטיסיות רחבות', icon: '🗂️' },
                    { id: 'compact-menu', label: 'Digital Menu', sub: 'תפריט מהיר', icon: '📑' },
                  ].map((s) => {
                    const isSelected = (business.layout?.servicesStyle || 'split-gallery') === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          onChangeBusiness({
                            ...business,
                            layout: {
                              ...(business.layout || {}),
                              servicesStyle: s.id as any,
                            },
                          });
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-950/80 shadow-xs'
                            : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-base mb-1">{s.icon}</span>
                        <span className="text-xs font-bold text-white">{s.label}</span>
                        <span className="text-[9px] text-slate-400">{s.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Gallery Archetype Style */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-300">סגנון גלריה ותוצאות:</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'before-after-slider', label: 'Before / After', sub: 'סליידר השוואה', icon: '✂️' },
                    { id: 'instagram-masonry', label: 'Insta Grid', sub: 'רשת עבודות', icon: '📸' },
                    { id: 'ambient-carousel', label: 'Ambient Carousel', sub: 'סליידר אווירה', icon: '🌿' },
                  ].map((g) => {
                    const isSelected = (business.layout?.galleryStyle || 'before-after-slider') === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          onChangeBusiness({
                            ...business,
                            layout: {
                              ...(business.layout || {}),
                              galleryStyle: g.id as any,
                            },
                          });
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-950/80 shadow-xs'
                            : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-base mb-1">{g.icon}</span>
                        <span className="text-xs font-bold text-white">{g.label}</span>
                        <span className="text-[9px] text-slate-400">{g.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Mobile Sticky Action Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-300">סרגל צף תחתון במובייל:</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'dual-action', label: 'תור + וואטסאפ', sub: 'קלאסי פרימיום', icon: '📱' },
                    { id: 'triple-action', label: 'תור + חיוג + Waze', sub: '3 פעולות מהירות', icon: '⚡' },
                    { id: 'minimal-pill', label: 'גלולת VIP זוהרת', sub: 'מינימליסטי נקי', icon: '👑' },
                  ].map((m) => {
                    const isSelected = (business.layout?.mobileStickyStyle || 'dual-action') === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onChangeBusiness({
                            ...business,
                            layout: {
                              ...(business.layout || {}),
                              mobileStickyStyle: m.id as any,
                            },
                          });
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-950/80 shadow-xs'
                            : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-base mb-1">{m.icon}</span>
                        <span className="text-xs font-bold text-white">{m.label}</span>
                        <span className="text-[9px] text-slate-400">{m.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Card Corner Radius */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-300">סגנון פינות וכרטיסיות:</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'modern-rounded', label: 'עגול מודרני', sub: '24px Soft', icon: '📱' },
                    { id: 'sharp-luxury', label: 'חד ומדויק', sub: '8px Sharp', icon: '💎' },
                    { id: 'classic-soft', label: 'קלאסי מעודן', sub: '16px Classic', icon: '⚖️' },
                  ].map((r) => {
                    const isSelected = currentRadius === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleRadiusChange(r.id as any)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-950/80 shadow-xs'
                            : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-base mb-1">{r.icon}</span>
                        <span className="text-xs font-bold text-white">{r.label}</span>
                        <span className="text-[9px] text-slate-400">{r.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Typography Mood */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-300">אופי גופנים וטיפוגרפיה:</div>
                <div className="space-y-1.5">
                  {[
                    { id: 'urban-bold', label: 'נועז ועוצמתי (Urban Bold)', font: 'Rubik & Bold', desc: 'מושלם למספרות גברים וסטודיו' },
                    { id: 'modern-sans', label: 'נקי והייטקי (Modern Clean)', font: 'Assistant / Heebo', desc: 'אלגנטי, קריא ורענן' },
                    { id: 'luxury-serif', label: 'יוקרתי ומעודן (Luxury Serif)', font: 'Editorial Style', desc: 'מתאים לסלונים וקליניקות בוטיק' },
                  ].map((f) => {
                    const isSelected = currentFont === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => handleFontChange(f.id as any)}
                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all text-right cursor-pointer ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-950/80 shadow-xs'
                            : 'border-slate-800 bg-slate-800/70 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{f.label}</div>
                          <div className="text-[10px] text-slate-300">{f.desc}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Conversion CTA: Create site with this design */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>אהבת את העיצוב? הקם אתר כזה בחינם 🚀</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              האתר יוקם עם פלטת הצבעים, סדר הסקשנים והסגנון שבחרת
            </p>
          </div>
        </div>
      )}

      {/* Onboarding Modal with pre-selected industry/colors */}
      <SaaSOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlan="pro"
      />
    </>
  );
}

