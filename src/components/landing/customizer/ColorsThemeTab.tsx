'use client';

import React from 'react';
import { Check, Sun, Moon } from 'lucide-react';
import { COLOR_PALETTES } from '@/components/admin/settings/design-studio/ThemePaletteSection';
import { BusinessConfig } from '@/types/business';

interface ColorsThemeTabProps {
  business?: Partial<BusinessConfig>;
  onThemeChange: (themeId: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon' | 'lavender-mist' | 'botanical-sage', defaultColor?: string) => void;
  onColorChange: (color: string) => void;
}

const THEME_OPTIONS = [
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    subtitle: 'לילך ולבנדר בוטיק',
    isDark: false,
    bgPreview: '#FBF9FE',
    accentPreview: '#8B5CF6',
  },
  {
    id: 'botanical-sage',
    name: 'Botanical Sage',
    subtitle: 'מרווה ומנטה בוטנית',
    isDark: false,
    bgPreview: '#F6FAF7',
    accentPreview: '#059669',
  },
  {
    id: 'luxury-light',
    name: 'Luxury Alabaster',
    subtitle: 'קרם אלבסטר ושמפניה',
    isDark: false,
    bgPreview: '#FAF7F2',
    accentPreview: '#C9A84C',
  },
  {
    id: 'dark-obsidian',
    name: 'Dark Obsidian',
    subtitle: 'פחם מט יוקרתי',
    isDark: true,
    bgPreview: '#121212',
    accentPreview: '#C9A84C',
  },
  {
    id: 'brand-midnight',
    name: 'Brand Midnight',
    subtitle: 'כחול נייבי עמוק',
    isDark: true,
    bgPreview: '#080C10',
    accentPreview: '#3B82F6',
  },
  {
    id: 'cyber-carbon',
    name: 'Cyber Carbon',
    subtitle: 'שחור מוחלט ספורטיבי',
    isDark: true,
    bgPreview: '#09090B',
    accentPreview: '#10B981',
  },
];

export function ColorsThemeTab({
  business,
  onThemeChange,
  onColorChange,
}: ColorsThemeTabProps) {
  const currentTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const currentColor = (business?.themeColor || '#C9A84C').toLowerCase();

  return (
    <div className="space-y-6">
      {/* Theme Atmosphere */}
      <div>
        <h3 className="text-xs font-black text-white mb-2.5 flex items-center gap-1.5">
          <span>🎨</span>
          <span>ערכת נושא ואווירת רקע (Atmosphere):</span>
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onThemeChange(theme.id as any, theme.accentPreview)}
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'border-amber-400 bg-zinc-900 shadow-md ring-2 ring-amber-400/40'
                    : 'border-white/10 bg-zinc-900/70 hover:bg-zinc-850 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {theme.isDark ? (
                      <Moon className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className="text-[10px] text-zinc-400 font-sans">
                      {theme.isDark ? 'כהה' : 'בהיר'}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-black text-white block group-hover:text-amber-300 transition-colors">
                    {theme.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    {theme.subtitle}
                  </span>
                </div>

                {/* Visual preview swatch */}
                <div className="mt-3 flex items-center gap-1.5 p-1.5 rounded-lg bg-black/40 border border-white/5">
                  <div
                    className="w-4 h-4 rounded-full border border-white/20 shadow-xs shrink-0"
                    style={{ backgroundColor: theme.bgPreview }}
                  />
                  <div
                    className="flex-1 h-2 rounded-full opacity-80"
                    style={{ backgroundColor: theme.accentPreview }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Color */}
      <div>
        <h3 className="text-xs font-black text-white mb-2.5 flex items-center gap-1.5">
          <span>✨</span>
          <span>צבע מיתוג ראשי (Accent Color):</span>
        </h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {COLOR_PALETTES.map((col) => {
            const isSelected = currentColor === col.hex.toLowerCase();
            return (
              <button
                key={col.hex}
                type="button"
                onClick={() => onColorChange(col.hex)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-white bg-zinc-900 shadow-md ring-2 ring-amber-400/50'
                    : 'border-white/10 bg-zinc-900/70 hover:bg-zinc-850 hover:border-white/20'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-white/20 shadow-md flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3] drop-shadow-md" />}
                </div>
                <span className="text-[10px] font-bold text-zinc-200 truncate w-full text-center group-hover:text-white">
                  {col.name.split('(')[0].split('&')[0]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white font-bold">צבע מותאם אישית:</span>
            <span className="text-[10px] text-zinc-400">בחר גוון מדויק</span>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={business?.themeColor || '#C9A84C'}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              aria-label="בחר צבע מותאם אישית"
            />
            <span className="font-mono text-xs font-black text-amber-400 uppercase tracking-wider" dir="ltr">
              {business?.themeColor || '#C9A84C'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

