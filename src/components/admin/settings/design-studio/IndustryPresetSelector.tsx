'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { INDUSTRY_PRESETS, IndustryPreset } from '@/lib/industry-presets';
import type { ShopSettings } from '@/lib/types';

interface IndustryPresetSelectorProps {
  settings: ShopSettings;
  currentTheme: string;
  onApplyPreset: (preset: IndustryPreset) => void;
}

export function IndustryPresetSelector({
  settings,
  currentTheme,
  onApplyPreset,
}: IndustryPresetSelectorProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl border border-indigo-500/40 p-6 shadow-xl text-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-white">תבניות ענף מוכנות ב-1-Click (Industry Switcher)</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            בלחיצה אחת, התאם את כל האתר, הצבעים, המחירון, תווי האמון והסגנון לתחום העיסוק שלך
          </p>
        </div>
        <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-400 text-slate-950 self-start sm:self-auto">
          7 תבניות מקצועיות 🚀
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-2">
        {INDUSTRY_PRESETS.map((preset) => {
          const isCurrent = settings.themeColor === preset.themeColor && currentTheme === preset.bgTheme;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between group ${
                isCurrent
                  ? 'border-amber-400 bg-slate-800/90 shadow-md ring-2 ring-amber-400/40'
                  : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/10"
                    style={{ backgroundColor: `${preset.themeColor}25` }}
                  >
                    {preset.icon}
                  </div>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-md font-bold text-slate-950"
                    style={{ backgroundColor: preset.themeColor }}
                  >
                    {preset.categoryName}
                  </span>
                </div>

                <h3 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                  {preset.name}
                </h3>
                <p className="text-[10px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-amber-400 group-hover:underline">החל תבנית זו ←</span>
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: preset.themeColor }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
