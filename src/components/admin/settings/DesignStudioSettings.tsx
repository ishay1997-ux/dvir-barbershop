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

      {/* 4. Section Visibility Toggles */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">הצגה והסתרת סקשנים באתר (Section Visibility)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            החלט אילו חלקים יוצגו בעמוד הבית של המספרה בהתאם לצורך
          </p>
        </div>

        <div className="space-y-3">
          {/* Section: Before & After */}
          <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#1C1C1C] block">
                סליידר אינטראקטיבי "לפני ואחרי" (Before & After Transformation)
              </span>
              <span className="text-[11px] text-[#6B6560]">
                סליידר משיכה המציג תספורות ועיצובי זקן לפני ואחרי הטיפול
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('showBeforeAfter')}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                layout.showBeforeAfter !== false
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {layout.showBeforeAfter !== false ? 'מוצג באתר ✓' : 'מוסתר ✕'}
            </button>
          </div>

          {/* Section: Reviews & Testimonials */}
          <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#1C1C1C] block">
                המלצות וביקורות לקוחות Google (4.9★ Testimonials)
              </span>
              <span className="text-[11px] text-[#6B6560]">
                כרטיסיות חוות דעת של לקוחות מרוצים עם דירוג כוכבים
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('showReviews')}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                layout.showReviews !== false
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {layout.showReviews !== false ? 'מוצג באתר ✓' : 'מוסתר ✕'}
            </button>
          </div>

          {/* Section: FAQs */}
          <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#1C1C1C] block">
                שאלות נפוצות ותשובות (FAQ Section)
              </span>
              <span className="text-[11px] text-[#6B6560]">
                מענה על ביטולים, תשלומים, חניה ואיחורים ללקוחות
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('showFaqs')}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                layout.showFaqs !== false
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {layout.showFaqs !== false ? 'מוצג באתר ✓' : 'מוסתר ✕'}
            </button>
          </div>

          {/* Section: Branches Navigation */}
          <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#1C1C1C] block">
                כרטיסיות סניפים וניווט Waze (אריאל & רחובות)
              </span>
              <span className="text-[11px] text-[#6B6560]">
                הצגת כתובות מדויקות, שעות פעילות וכפתורי ניווט ישירים
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('showBranches')}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                layout.showBranches !== false
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {layout.showBranches !== false ? 'מוצג באתר ✓' : 'מוסתר ✕'}
            </button>
          </div>

          {/* Section: Bio / About */}
          <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]">
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#1C1C1C] block">
                אודות מאסטר ברבר והפילוסופיה (Barber Showcase)
              </span>
              <span className="text-[11px] text-[#6B6560]">
                פסקת ניסיון אישי, שנות ותק וציטוט פילוסופיה מקצועית
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection('showBio')}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                layout.showBio !== false
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {layout.showBio !== false ? 'מוצג באתר ✓' : 'מוסתר ✕'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
