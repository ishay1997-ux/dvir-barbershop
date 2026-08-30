'use client';

import React from 'react';
import { INDUSTRY_PRESETS, IndustryPreset } from '@/lib/industry-presets';
import { BusinessConfig } from '@/types/business';

interface NichesTabProps {
  business?: Partial<BusinessConfig>;
  onApplyPreset: (preset: IndustryPreset) => void;
}

export function NichesTab({ business, onApplyPreset }: NichesTabProps) {
  const currentBg = business?.layout?.bgTheme || 'dark-obsidian';
  const currentAccent = business?.themeColor || '#C9A84C';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-black text-white flex items-center gap-1.5">
          <span>🎯</span>
          <span>תבניות ענף ב-1-Click (Industry Presets)</span>
        </h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          בחר תחום עיסוק וקבל מיתוג, צבעים, מחירון, גלריה וסדר סקשנים מותאם בבת אחת:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {INDUSTRY_PRESETS.map((preset) => {
          const isSelected =
            business?.themeColor === preset.themeColor && currentBg === preset.bgTheme;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 cursor-pointer group ${
                isSelected
                  ? 'border-amber-400 bg-zinc-800/90 shadow-md ring-2 ring-amber-400/40'
                  : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-white/20'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/10 shadow-sm"
                style={{ backgroundColor: `${preset.themeColor}25` }}
              >
                {preset.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                    {preset.name}
                  </span>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded font-black text-zinc-950 shrink-0"
                    style={{ backgroundColor: preset.themeColor }}
                  >
                    {preset.categoryName}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
                  {preset.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
