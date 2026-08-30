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

export function NichesTab({ business }: NichesTabProps) {
  const currentSlug = business?.slug || 'dvir';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-black text-white flex items-center gap-1.5">
          <span>🎯</span>
          <span>אתרי הדגמה חיים לכל הענפים</span>
        </h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          צפה באתרים מלאים ודאשבורד ניהול ייעודי מותאם לכל ענף:
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
            <Link
              key={preset.id}
              href={route}
              className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 group ${
                isCurrent
                  ? 'border-emerald-500/60 bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/30'
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
                  <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    {preset.name}
                    {isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                        אתר פעיל
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
                {!isCurrent && (
                  <div className="mt-2 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <span>מעבר להדגמת ענף זה</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

