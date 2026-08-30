'use client';

import React from 'react';
import {
  Palette,
  Sparkles,
  Eye,
  EyeOff,
  Layers,
  Layout,
  Check,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { ShopSettings, BusinessLayoutConfig } from '@/lib/types';

interface DesignStudioSettingsProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

const THEME_PRESETS = [
  {
    id: 'dark-obsidian',
    name: 'Dark Obsidian (שחור פחם מט יוקרתי)',
    description: 'מראה שחור מט עמוק עם נגיעות תאורה רכות. הבחירה המובילה למספרות גברים יוקרתיות.',
    bg: '#121214',
    accentPreview: '#C9A84C',
    isDark: true,
  },
  {
    id: 'brand-midnight',
    name: 'Brand Midnight (כחול נייבי-ספיר לילה עמוק)',
    description: 'גווני נייבי-ספיר עשירים ומרשימים המשדרים עוצמה, דיוק ואיכות פרימיום.',
    bg: '#060B18',
    accentPreview: '#38BDF8',
    isDark: true,
  },
  {
    id: 'cyber-carbon',
    name: 'Cyber Carbon (קרבון שחור מוחלט והילות ניאון)',
    description: 'שחור קרבון טכנולוגי חד (True Pitch Black) עם מסגרות זוהרות ומודרניות.',
    bg: '#030305',
    accentPreview: '#10B981',
    isDark: true,
  },
  {
    id: 'luxury-light',
    name: 'Luxury Alabaster (קרם אלבסטר ושמפניה נעימה)',
    description: 'עיצוב בהיר, נקי, חם ויוקרתי לעיניים עם ניגודיות מעולה וגווני שמפניה ואלבסטר.',
    bg: '#FAF7F2',
    accentPreview: '#C9A84C',
    isDark: false,
  },
];

const COLOR_PALETTES = [
  { name: 'זהב מלכותי (Royal Gold)', hex: '#C9A84C' },
  { name: 'קופר & שקיעה (Sunset Amber)', hex: '#F59E0B' },
  { name: 'טורקיז מנטה נורדי (Nordic Teal)', hex: '#14B8A6' },
  { name: 'אמרלד פרימיום (Emerald Green)', hex: '#10B981' },
  { name: 'ספיר וקובלט (Cobalt Blue)', hex: '#0EA5E9' },
  { name: 'רוז בלאש ורובי (Rose Blush)', hex: '#EC4899' },
  { name: 'סגול רויאל (Royal Violet)', hex: '#A855F7' },
  { name: 'פלטינום וסילבר (Platinum Slate)', hex: '#E2E8F0' },
];

export default function DesignStudioSettings({
  settings,
  onUpdateSettings,
  onNotifySave,
}: DesignStudioSettingsProps) {
  const { success } = useToast();

  const currentTheme = settings.bgTheme || settings.layout?.bgTheme || 'dark-obsidian';
  const currentColor = settings.themeColor || '#C9A84C';
  const layout = settings.layout || {
    showBeforeAfter: true,
    showReviews: true,
    showFaqs: true,
    showBranches: true,
    showBio: true,
  };

  const handleSelectTheme = (themeId: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon') => {
    const updated: ShopSettings = {
      ...settings,
      bgTheme: themeId,
      layout: {
        ...(settings.layout || {}),
        bgTheme: themeId,
      },
    };
    onUpdateSettings(updated);
    onNotifySave();
    success('ערכת הנושא עודכנה', 'העיצוב החדש הוחל על האתר');
  };

  const handleSelectColor = (hex: string) => {
    const updated: ShopSettings = {
      ...settings,
      themeColor: hex,
    };
    onUpdateSettings(updated);
    onNotifySave();
  };

  const handleToggleSection = (key: keyof BusinessLayoutConfig) => {
    const currentVal = layout[key] !== false;
    const updatedLayout: BusinessLayoutConfig = {
      ...layout,
      [key]: !currentVal,
    };
    const updated: ShopSettings = {
      ...settings,
      layout: updatedLayout,
    };
    onUpdateSettings(updated);
    onNotifySave();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Live Preview Banner */}
      <div
        className="rounded-3xl p-6 border transition-all shadow-md relative overflow-hidden"
        style={{
          backgroundColor:
            currentTheme === 'luxury-light'
              ? '#F8FAFC'
              : currentTheme === 'brand-midnight'
              ? '#080c10'
              : currentTheme === 'cyber-carbon'
              ? '#09090B'
              : '#121212',
          borderColor: `${currentColor}40`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentColor }}
              />
              <span
                className="text-xs font-black uppercase tracking-wider"
                style={{ color: currentColor }}
              >
                תצוגה מקדימה חיה של העיצוב (Live Preview)
              </span>
            </div>
            <h3
              className="text-xl font-black"
              style={{
                color: currentTheme === 'luxury-light' ? '#0F172A' : '#FFFFFF',
              }}
            >
              {settings.shopName || 'המספרה של דביר'}
            </h3>
            <p
              className="text-xs mt-1 max-w-md"
              style={{
                color: currentTheme === 'luxury-light' ? '#475569' : '#A1A1AA',
              }}
            >
              {settings.slogan || 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: currentColor,
                color: currentTheme === 'luxury-light' && currentColor === '#C9A84C' ? '#1C1C1C' : '#000000',
              }}
            >
              קבע תור עכשיו ✂️
            </button>
            <div
              className="px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-xs"
              style={{
                borderColor: `${currentColor}50`,
                color: currentTheme === 'luxury-light' ? '#334155' : '#E4E4E7',
                backgroundColor: `${currentColor}15`,
              }}
            >
              4.9 ★ Google Reviews
            </div>
          </div>
        </div>
      </div>

      {/* 2. Theme Presets */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">ערכת נושא ואווירת האתר (Theme Presets)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            בחר את סגנון הרקע והאווירה הכללית שתוצג ללקוחות בעמוד הבית ובאשף ההזמנות
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEME_PRESETS.map((preset) => {
            const isSelected = currentTheme === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectTheme(preset.id as any)}
                className={`flex flex-col text-right p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-gold shadow-md ring-2 ring-gold/20 scale-[1.01]'
                    : 'border-[#E5DDD0] hover:border-gold/50 bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-inner flex items-center justify-center text-[10px]"
                      style={{ backgroundColor: preset.bg }}
                    >
                      {preset.isDark ? '🌙' : '☀️'}
                    </div>
                    <span className="font-black text-xs text-[#1C1C1C]">{preset.name}</span>
                  </div>

                  {isSelected && (
                    <span className="bg-gold text-[#1C1C1C] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      נבחר
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#6B6560] leading-relaxed mb-3">
                  {preset.description}
                </p>

                {/* Color Strip Indicator */}
                <div
                  className="w-full h-3 rounded-lg border border-black/10 mt-auto"
                  style={{
                    backgroundColor: preset.bg,
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${currentColor}40, transparent 70%)`,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Primary Brand Color */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">צבע מיתוג ראשי (Accent Brand Color)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הצבע שמדגיש כפתורים, כותרות, תגיות מחיר וגרדיאנטים באתר שלך
          </p>
        </div>

        {/* Preset Palettes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {COLOR_PALETTES.map((col) => {
            const isSelected = currentColor.toLowerCase() === col.hex.toLowerCase();

            return (
              <button
                key={col.hex}
                type="button"
                onClick={() => handleSelectColor(col.hex)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-right ${
                  isSelected
                    ? 'bg-amber-500/10 border-gold shadow-xs font-black text-[#1C1C1C]'
                    : 'bg-[#FAF7F2] border-[#E5DDD0] text-[#6B6560] hover:border-gold/60'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-black/20 shadow-xs flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white drop-shadow-sm" />}
                </span>
                <span className="text-xs truncate">{col.name.split('(')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Color Input */}
        <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="block text-xs font-black text-[#1C1C1C]">או בחר צבע מותאם אישית (Hex Picker):</span>
            <span className="text-[11px] text-[#6B6560]">הזן קוד צבע מדויק של המותג שלך</span>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => handleSelectColor(e.target.value)}
              className="w-9 h-9 rounded-xl cursor-pointer border border-[#E5DDD0] p-0.5 bg-white"
            />
            <input
              type="text"
              value={currentColor}
              onChange={(e) => handleSelectColor(e.target.value)}
              className="px-3 py-1.5 border border-[#E5DDD0] rounded-xl text-xs font-mono font-bold uppercase w-28 bg-white outline-none focus:border-gold"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* 3. Hero Style, Card Curves & Typography Moods */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-gold" />
          <h2 className="text-base font-black text-[#1C1C1C]">סגנון פתיח, פינות וטיפוגרפיה (Layout Style & Typography)</h2>
        </div>

        {/* 1. Hero Layout Style */}
        <div>
          <label className="block text-xs font-bold text-[#1C1C1C] mb-2.5">
            סגנון הפתיח הראשי של האתר (Hero Archetype):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'hub-monogram', name: 'Panoramic Hero Hub', sub: 'פנורמי מלא + לוגו מונוגרם עגול', icon: '💈' },
              { id: 'split-cinema', name: 'Split Screen Showcase', sub: 'תצוגה מפוצלת + כרטיס זימון מיידי', icon: '🎬' },
              { id: 'minimalist-vip', name: 'Minimalist VIP', sub: 'יוקרתי ממורכז + כפתור CTA ענק', icon: '👑' },
            ].map((h) => {
              const isSelected = (layout.heroStyle || 'hub-monogram') === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    const updated: ShopSettings = {
                      ...settings,
                      layout: {
                        ...(settings.layout || {}),
                        heroStyle: h.id as any,
                      },
                    };
                    onUpdateSettings(updated);
                    onNotifySave();
                    success('סגנון הפתיח עודכן', h.name);
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-gold bg-[#FAF7F2] shadow-sm ring-2 ring-gold/20'
                      : 'border-[#E5DDD0] hover:border-gold/50 bg-white'
                  }`}
                >
                  <span className="text-xl mb-1">{h.icon}</span>
                  <span className="text-xs font-black text-[#1C1C1C]">{h.name}</span>
                  <span className="text-[10px] text-[#6B6560] mt-0.5">{h.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Radius */}
        <div className="pt-4 border-t border-[#E5DDD0]">
          <label className="block text-xs font-bold text-[#1C1C1C] mb-2.5">
            סגנון הפינות של הכרטיסיות והכפתורים:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'modern-rounded', name: 'עגול מודרני ואפליקטיבי', sub: '24px Soft Curves', icon: '📱' },
              { id: 'sharp-luxury', name: 'חד, גברי ומדויק', sub: '8px Sharp Edges', icon: '💎' },
              { id: 'classic-soft', name: 'קלאסי מעודן ומאוזן', sub: '16px Balanced', icon: '⚖️' },
            ].map((r) => {
              const isSelected = (layout.borderRadius || 'modern-rounded') === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    const updated: ShopSettings = {
                      ...settings,
                      layout: {
                        ...(settings.layout || {}),
                        borderRadius: r.id as any,
                      },
                    };
                    onUpdateSettings(updated);
                    onNotifySave();
                    success('סגנון הפינות עודכן', r.name);
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-gold bg-[#FAF7F2] shadow-sm ring-2 ring-gold/20'
                      : 'border-[#E5DDD0] hover:border-gold/50 bg-white'
                  }`}
                >
                  <span className="text-xl mb-1">{r.icon}</span>
                  <span className="text-xs font-black text-[#1C1C1C]">{r.name}</span>
                  <span className="text-[10px] text-[#6B6560] mt-0.5">{r.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Font Mood */}
        <div className="pt-4 border-t border-[#E5DDD0]">
          <label className="block text-xs font-bold text-[#1C1C1C] mb-2.5">
            אופי הטיפוגרפיה והגופנים באתר:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'urban-bold', name: 'נועז ועוצמתי (Urban Bold)', sub: 'Rubik Black · מומלץ למספרות', icon: '🦁' },
              { id: 'modern-sans', name: 'נקי והייטקי (Modern Clean)', sub: 'Assistant & Heebo · קליניקות וספא', icon: '⚡' },
              { id: 'luxury-serif', name: 'יוקרתי ומעודן (Luxury Serif)', sub: 'Frank Ruhl · סלוני נשים ובוטיק', icon: '👑' },
            ].map((f) => {
              const isSelected = (layout.fontStyle || 'urban-bold') === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    const updated: ShopSettings = {
                      ...settings,
                      layout: {
                        ...(settings.layout || {}),
                        fontStyle: f.id as any,
                      },
                    };
                    onUpdateSettings(updated);
                    onNotifySave();
                    success('סגנון הטיפוגרפיה עודכן', f.name);
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-gold bg-[#FAF7F2] shadow-sm ring-2 ring-gold/20'
                      : 'border-[#E5DDD0] hover:border-gold/50 bg-white'
                  }`}
                >
                  <span className="text-xl mb-1">{f.icon}</span>
                  <span className="text-xs font-black text-[#1C1C1C]">{f.name}</span>
                  <span className="text-[10px] text-[#6B6560] mt-0.5">{f.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Modular Section Reordering, Visibility & Custom Headlines */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-gold" />
              <h2 className="text-base font-black text-[#1C1C1C]">סדר מקטעים ומודולריות (1-Click Reorder)</h2>
            </div>
            <p className="text-xs text-[#6B6560] mt-1">
              שלוט בסדר שבו המקטעים מופיעים בעמוד והפעל או כבה סקשנים לפי הצורך
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(layout.sectionsOrder || ['hero', 'services', 'bio', 'branches', 'gallery', 'reviews', 'faqs']).map((secKey, idx, arr) => {
            const labels: Record<string, { name: string; desc: string; icon: string; toggleKey?: keyof BusinessLayoutConfig }> = {
              hero: { name: 'פתיח ראשי (Hero Hub)', desc: 'תמונת אווירה, לוגו, סטטוס פתיחה וכפתורי קביעת תור', icon: '💈' },
              services: { name: 'שירותים ומחירון דיגיטלי', desc: 'רשימת השירותים, זמנים, מחירים וגלריית תמונות', icon: '📋' },
              gallery: { name: 'גלריית לפני / אחרי (Slider)', desc: 'השוואת תמונות אינטראקטיבית עם סליידר', icon: '✂️', toggleKey: 'showBeforeAfter' },
              bio: { name: 'פרופיל אודות הצוות (Bio)', desc: 'שנות ניסיון, פילוסופיה מקצועית ותמונת הספר', icon: '👤', toggleKey: 'showBio' },
              branches: { name: 'סניפים ומפות ניווט Waze', desc: 'כתובות מדויקות, שעות פעילות וכפתורי הגעה', icon: '🗺️', toggleKey: 'showBranches' },
              reviews: { name: 'המלצות וביקורות לקוחות (5.0★)', desc: 'חוות דעת של לקוחות מאומתים מ-Google', icon: '⭐', toggleKey: 'showReviews' },
              faqs: { name: 'שאלות ותשובות נפוצות (FAQ)', desc: 'מענה על ביטולים, תשלומים, חניה ואיחורים', icon: '❓', toggleKey: 'showFaqs' },
            };

            const meta = labels[secKey] || { name: secKey, desc: '', icon: '📌' };
            const isVisible = meta.toggleKey ? layout[meta.toggleKey] !== false : true;

            const handleMove = (direction: 'up' | 'down') => {
              const newIdx = direction === 'up' ? idx - 1 : idx + 1;
              if (newIdx < 0 || newIdx >= arr.length) return;
              const newOrder = [...arr];
              const temp = newOrder[idx];
              newOrder[idx] = newOrder[newIdx];
              newOrder[newIdx] = temp;

              const updated: ShopSettings = {
                ...settings,
                layout: {
                  ...(settings.layout || {}),
                  sectionsOrder: newOrder as any,
                },
              };
              onUpdateSettings(updated);
              onNotifySave();
              success('סדר הסקשנים עודכן', `${meta.name} הועבר למיקום ${newIdx + 1}`);
            };

            return (
              <div
                key={secKey}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isVisible ? 'bg-[#FAF7F2] border-[#E5DDD0]' : 'bg-zinc-100 border-zinc-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{meta.icon}</span>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-[#1C1C1C] block">
                      {meta.name} <span className="text-[10px] text-slate-500 font-normal">(מיקום {idx + 1})</span>
                    </span>
                    <span className="text-[11px] text-[#6B6560]">{meta.desc}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-xl border border-[#E5DDD0] p-0.5 shadow-xs">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove('up')}
                      className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="הזז למעלה"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === arr.length - 1}
                      onClick={() => handleMove('down')}
                      className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="הזז למטה"
                    >
                      ▼
                    </button>
                  </div>

                  {meta.toggleKey && (
                    <button
                      type="button"
                      onClick={() => handleToggleSection(meta.toggleKey!)}
                      className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        isVisible
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-zinc-300 text-zinc-700'
                      }`}
                    >
                      {isVisible ? 'מוצג ✓' : 'מוסתר ✕'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Custom Headlines inputs */}
        <div className="pt-5 border-t border-[#E5DDD0] space-y-4">
          <div>
            <span className="font-black text-xs sm:text-sm text-[#1C1C1C] block">
              עריכת כותרות סקשנים בהתאמה אישית (Custom Section Headlines)
            </span>
            <span className="text-[11px] text-[#6B6560]">
              התאם אישית את ניסוח הכותרות שמופיעות ללקוחות בכל חלק בעמוד
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">כותרת סקשן שירותים ומחירון:</label>
              <input
                type="text"
                placeholder="לדוגמה: התפריט והטיפולים שלנו"
                value={layout.sectionTitles?.services || ''}
                onChange={(e) => {
                  const updated: ShopSettings = {
                    ...settings,
                    layout: {
                      ...(settings.layout || {}),
                      sectionTitles: {
                        ...(settings.layout?.sectionTitles || {}),
                        services: e.target.value,
                      },
                    },
                  };
                  onUpdateSettings(updated);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-xs font-bold text-[#1C1C1C] focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">כותרת סקשן ביקורות לקוחות:</label>
              <input
                type="text"
                placeholder="לדוגמה: מה אומרים הלקוחות הקבועים"
                value={layout.sectionTitles?.reviews || ''}
                onChange={(e) => {
                  const updated: ShopSettings = {
                    ...settings,
                    layout: {
                      ...(settings.layout || {}),
                      sectionTitles: {
                        ...(settings.layout?.sectionTitles || {}),
                        reviews: e.target.value,
                      },
                    },
                  };
                  onUpdateSettings(updated);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-xs font-bold text-[#1C1C1C] focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">כותרת סקשן סניפים וניווט:</label>
              <input
                type="text"
                placeholder="לדוגמה: איפה נפגשים?"
                value={layout.sectionTitles?.branches || ''}
                onChange={(e) => {
                  const updated: ShopSettings = {
                    ...settings,
                    layout: {
                      ...(settings.layout || {}),
                      sectionTitles: {
                        ...(settings.layout?.sectionTitles || {}),
                        branches: e.target.value,
                      },
                    },
                  };
                  onUpdateSettings(updated);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-xs font-bold text-[#1C1C1C] focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">כותרת סקשן שאלות ותשובות:</label>
              <input
                type="text"
                placeholder="לדוגמה: שאלות נפוצות ותשובות"
                value={layout.sectionTitles?.faqs || ''}
                onChange={(e) => {
                  const updated: ShopSettings = {
                    ...settings,
                    layout: {
                      ...(settings.layout || {}),
                      sectionTitles: {
                        ...(settings.layout?.sectionTitles || {}),
                        faqs: e.target.value,
                      },
                    },
                  };
                  onUpdateSettings(updated);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-xs font-bold text-[#1C1C1C] focus:border-gold outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
