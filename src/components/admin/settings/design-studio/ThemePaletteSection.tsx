'use client';

import React from 'react';
import { Palette, Sparkles, Check } from 'lucide-react';

export const THEME_PRESETS = [
  {
    id: 'lavender-mist',
    name: 'Lavender Mist (לילך ולבנדר בוטיק)',
    description: 'עיצוב בהיר פסטלי מרהיב בגווני לבנדר ולילך עדינים. טרנדי במיוחד לקוסמטיקה, לק ג׳ל ואסתטיקה.',
    bg: '#FBF9FE',
    accentPreview: '#8B5CF6',
    isDark: false,
  },
  {
    id: 'botanical-sage',
    name: 'Botanical Sage (מרווה ומנטה בוטנית)',
    description: 'מראה פורצלן אורגני נקי ורענן עם הילות מרווה ומנטה. מושלם לספא, יוגה, טיפולי גוף וקליניקות.',
    bg: '#F6FAF7',
    accentPreview: '#059669',
    isDark: false,
  },
  {
    id: 'luxury-light',
    name: 'Luxury Alabaster (קרם אלבסטר ושמפניה)',
    description: 'עיצוב בהיר, נקי, חם ויוקרתי לעיניים עם ניגודיות מעולה וגווני שמפניה ואלבסטר.',
    bg: '#FAF7F2',
    accentPreview: '#C9A84C',
    isDark: false,
  },
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
];

export const COLOR_PALETTES = [
  { name: 'לילך ולבנדר בוטיק (Lavender Mist)', hex: '#8B5CF6' },
  { name: 'מרווה ומנטה בוטנית (Sage Green)', hex: '#059669' },
  { name: 'זהב מלכותי (Royal Gold)', hex: '#C9A84C' },
  { name: 'רוז בלאש ורובי (Rose Blush)', hex: '#EC4899' },
  { name: 'טורקיז מנטה נורדי (Nordic Teal)', hex: '#14B8A6' },
  { name: 'אמרלד פרימיום (Emerald Green)', hex: '#10B981' },
  { name: 'ספיר וקובלט (Cobalt Blue)', hex: '#0EA5E9' },
  { name: 'קופר & שקיעה (Sunset Amber)', hex: '#F59E0B' },
  { name: 'סגול רויאל (Royal Violet)', hex: '#A855F7' },
  { name: 'פלטינום וסילבר (Platinum Slate)', hex: '#E2E8F0' },
];

interface ThemePaletteSectionProps {
  currentTheme: string;
  currentColor: string;
  onSelectTheme: (themeId: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon' | 'lavender-mist' | 'botanical-sage') => void;
  onSelectColor: (hex: string) => void;
}

export function ThemePaletteSection({
  currentTheme,
  currentColor,
  onSelectTheme,
  onSelectColor,
}: ThemePaletteSectionProps) {
  return (
    <div className="space-y-6">
      {/* Theme Presets */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#C9A84C]" />
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
                onClick={() => onSelectTheme(preset.id as any)}
                className={`flex flex-col text-right p-4 rounded-2xl border-2 transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-[#C9A84C] shadow-md ring-2 ring-[#C9A84C]/20 scale-[1.01]'
                    : 'border-[#E5DDD0] hover:border-[#C9A84C]/50 bg-[#FAF7F2]'
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
                    <span className="bg-[#C9A84C] text-[#1C1C1C] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      נבחר
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#6B6560] leading-relaxed mb-3">
                  {preset.description}
                </p>

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

      {/* Primary Brand Color */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C9A84C]" />
            <h2 className="text-base font-black text-[#1C1C1C]">צבע מיתוג ראשי (Accent Brand Color)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הצבע שמדגיש כפתורים, כותרות, תגיות מחיר וגרדיאנטים באתר שלך
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {COLOR_PALETTES.map((col) => {
            const isSelected = currentColor.toLowerCase() === col.hex.toLowerCase();

            return (
              <button
                key={col.hex}
                type="button"
                onClick={() => onSelectColor(col.hex)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-right cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-[#C9A84C] shadow-xs font-black text-[#1C1C1C]'
                    : 'bg-[#FAF7F2] border-[#E5DDD0] text-[#6B6560] hover:border-[#C9A84C]/60'
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

        <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="block text-xs font-black text-[#1C1C1C]">או בחר צבע מותאם אישית (Hex Picker):</span>
            <span className="text-[11px] text-[#6B6560]">הזן קוד צבע מדויק של המותג שלך</span>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onSelectColor(e.target.value)}
              className="w-9 h-9 rounded-xl cursor-pointer border border-[#E5DDD0] p-0.5 bg-white"
            />
            <input
              type="text"
              value={currentColor}
              onChange={(e) => onSelectColor(e.target.value)}
              className="px-3 py-1.5 border border-[#E5DDD0] rounded-xl text-xs font-mono font-bold uppercase w-28 bg-white outline-none focus:border-[#C9A84C]"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
