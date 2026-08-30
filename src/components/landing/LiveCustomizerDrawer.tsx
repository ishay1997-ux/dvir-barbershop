'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { SaaSOnboardingModal } from '@/components/marketing/SaaSOnboardingModal';

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
  services: { label: 'שירותים ומחירון דיגיטלי', icon: '📋' },
  gallery: { label: 'גלריית לפני / אחרי (Slider)', icon: '✂️', toggleKey: 'showBeforeAfter' },
  bio: { label: 'פרופיל אודות הצוות (Bio)', icon: '👤', toggleKey: 'showBio' },
  branches: { label: 'סניפים ומפות ניווט Waze', icon: '🗺️', toggleKey: 'showBranches' },
  reviews: { label: 'ביקורות ודירוגי לקוחות', icon: '⭐', toggleKey: 'showReviews' },
  faqs: { label: 'שאלות ותשובות נפוצות (FAQ)', icon: '❓', toggleKey: 'showFaqs' },
};

const DEFAULT_SECTIONS_ORDER = ['hero', 'services', 'bio', 'branches', 'gallery', 'reviews', 'faqs'];

export function LiveCustomizerDrawer({
  business,
  onChangeBusiness,
}: LiveCustomizerDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'theme' | 'sections' | 'style'>('colors');
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
        borderRadius: 'modern-rounded',
        fontStyle: 'urban-bold',
        sectionsOrder: DEFAULT_SECTIONS_ORDER as any,
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
      {/* Floating Trigger Button on the RIGHT side */}
      <div className="fixed bottom-6 right-6 z-40" dir="rtl">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="py-3 px-5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white font-black text-xs flex items-center gap-2.5 shadow-2xl border border-white/20 backdrop-blur-lg hover:scale-105 transition-all cursor-pointer group"
          style={{
            boxShadow: `0 10px 30px -5px ${business.themeColor || '#C9A84C'}40`,
          }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 group-hover:rotate-45 transition-transform"
            style={{ backgroundColor: business.themeColor || '#C9A84C' }}
          >
            <Palette className="w-3 h-3 text-slate-950" />
          </div>
          <span>סטודיו עיצוב חי</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-indigo-300 font-bold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Live
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
                <p className="text-[10px] text-slate-300">שינוי סדר סקשנים, צבעים וסגנון בזמן אמת</p>
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

          {/* Sub-tabs Switcher (4 tabs) */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/90 rounded-xl text-[11px] font-bold border border-slate-700/60">
            <button
              onClick={() => setActiveTab('colors')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'colors' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              צבעים
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'theme' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              אווירה
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'sections' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              סקשנים
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
                <span>סדר את סדר המקטעים בעמוד:</span>
                <span className="text-indigo-400 font-bold">1-Click Live Reorder</span>
              </div>
              <div className="space-y-2">
                {sectionsOrder.map((sectionKey, idx) => {
                  const meta = SECTION_LABELS[sectionKey] || { label: sectionKey, icon: '📌' };
                  const isVisible = meta.toggleKey
                    ? (business.layout as any)?.[meta.toggleKey] !== false
                    : true;

                  return (
                    <div
                      key={sectionKey}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isVisible
                          ? 'bg-slate-800/70 border-slate-700/80 text-white'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{meta.icon}</span>
                        <div className="leading-tight">
                          <div className="text-xs font-bold">{meta.label}</div>
                          <div className="text-[9px] text-slate-400">מיקום {idx + 1} בעמוד</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Up / Down Controls */}
                        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700/60">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveSection(idx, 'up')}
                            className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            title="הזז למעלה"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === sectionsOrder.length - 1}
                            onClick={() => handleMoveSection(idx, 'down')}
                            className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            title="הזז למטה"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Visibility Toggle */}
                        {meta.toggleKey && (
                          <button
                            onClick={() => handleToggleSection(meta.toggleKey!, isVisible)}
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
                    </div>
                  );
                })}
              </div>

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

              {/* 2. Card Corner Radius */}
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

              {/* 3. Typography Mood */}
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

