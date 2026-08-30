'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { THEME_PRESETS, COLOR_PALETTES } from '@/components/admin/settings/design-studio/ThemePaletteSection';
import { BusinessConfig } from '@/types/business';

interface ColorsThemeTabProps {
  business?: Partial<BusinessConfig>;
  onThemeChange: (themeId: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon') => void;
  onColorChange: (color: string) => void;
}

export function ColorsThemeTab({
  business,
  onThemeChange,
  onColorChange,
}: ColorsThemeTabProps) {
  const currentTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const currentColor = business?.themeColor || '#C9A84C';

  return (
    <div className="space-y-6">
      {/* Theme Atmosphere */}
      <div>
        <h3 className="text-xs font-black text-white mb-2">ערכת נושא ואווירת רקע (Atmosphere):</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_PRESETS.map((preset) => {
            const isSelected = currentTheme === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onThemeChange(preset.id as any)}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-zinc-800 ring-2 ring-amber-400/30'
                    : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs">{preset.isDark ? '🌙' : '☀️'}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className="text-xs font-bold text-white block truncate">
                  {preset.name.split('(')[0]}
                </span>
                <div
                  className="w-full h-2 rounded mt-2 border border-white/10"
                  style={{ backgroundColor: preset.bg }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Color */}
      <div>
        <h3 className="text-xs font-black text-white mb-2">צבע מיתוג ראשי (Accent Color):</h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {COLOR_PALETTES.map((col) => {
            const isSelected = currentColor.toLowerCase() === col.hex.toLowerCase();
            return (
              <button
                key={col.hex}
                type="button"
                onClick={() => onColorChange(col.hex)}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-white bg-zinc-800 ring-2 ring-amber-400/40'
                    : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-white/20 shadow-xs flex items-center justify-center"
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-[10px] text-zinc-300 truncate w-full text-center">
                  {col.name.split('(')[0].split('&')[0]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between">
          <span className="text-xs text-zinc-300 font-bold">צבע מותאם אישית:</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <span className="font-mono text-xs font-bold text-amber-400 uppercase" dir="ltr">
              {currentColor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
