'use client';

import React from 'react';
import Link from 'next/link';
import { INDUSTRY_PRESETS, IndustryPreset } from '@/lib/industry-presets';
import { BusinessConfig } from '@/types/business';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

const PRESET_ROUTES: Record<string, string> = {
  barbershop: '/dvir',
  'nails-beauty': '/beauty',
  'spa-massage': '/spa',
  'fitness-trainer': '/trainer',
  'clinics-aesthetics': '/clinic',
  'home-technician': '/services',
  'tattoo-piercing': '/tattoo',
};

interface NichesTabProps {
  business?: Partial<BusinessConfig>;
  onApplyPreset?: (preset: IndustryPreset) => void;
}

export function NichesTab({ business, onApplyPreset }: NichesTabProps) {
  const currentSlug = business?.slug || 'dvir';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-black text-white flex items-center gap-1.5">
          <span>🎯</span>
          <span>ענפי פעילות וסגנונות מותאמים</span>
        </h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          החל סגנון ענף בלחיצה אחת על האתר, או עבור לאתר ההדגמה המלא:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {INDUSTRY_PRESETS.map((preset) => {
          const route = PRESET_ROUTES[preset.id] || '/dvir';
          const isCurrent =
            currentSlug === preset.id ||
            (currentSlug === 'dvir' && preset.id === 'barbershop') ||
            (currentSlug === 'beauty' && preset.id === 'nails-beauty') ||
            (currentSlug === 'trainer' && preset.id === 'fitness-trainer') ||
            (currentSlug === 'spa' && preset.id === 'spa-massage') ||
            (currentSlug === 'clinic' && preset.id === 'clinics-aesthetics') ||
            (currentSlug === 'services' && preset.id === 'home-technician');

          return (
            <div
              key={preset.id}
              className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col gap-3 group ${
                isCurrent
                  ? 'border-emerald-500/60 bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/30'
                  : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/10 shadow-sm"
                  style={{ backgroundColor: `${preset.themeColor}25` }}
                >
                  {preset.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      {preset.name}
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                          פעיל
                        </span>
                      )}
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
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                {onApplyPreset && (
                  <button
                    type="button"
                    onClick={() => onApplyPreset(preset)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-400/40 text-[11px] font-black transition-all cursor-pointer text-center"
                  >
                    החל סגנון זה בלייב ✨
                  </button>
                )}
                <Link
                  href={route}
                  className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all flex items-center gap-1 shrink-0"
                  title="מעבר לעמוד המלא"
                >
                  <span>דמו</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

