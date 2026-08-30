'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import type { SectionId } from '@/types/business';

interface SectionsReorderTabProps {
  sectionsOrder: SectionId[];
  onToggleSection: (id: SectionId) => void;
  onMoveSection: (id: SectionId, direction: 'up' | 'down') => void;
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'פתיח האתר (Hero)',
  'booking-action-cards': 'כרטיסי פעולה מהירים (Action Pills)',
  services: 'מחירון ושירותים (Price List)',
  'before-after': 'גלריה ותוצאות (Showcase)',
  about: 'אודות והיכרות (Bio)',
  reviews: 'המלצות Google (Social Proof)',
  policies: 'מדיניות ותנאי הגעה',
  branches: 'סניפים ומיקומים',
  faq: 'שאלות ותשובות (FAQ)',
};

export function SectionsReorderTab({
  sectionsOrder,
  onToggleSection,
  onMoveSection,
}: SectionsReorderTabProps) {
  const allPossible: SectionId[] = [
    'hero',
    'booking-action-cards',
    'services',
    'before-after',
    'about',
    'reviews',
    'policies',
    'branches',
    'faq',
  ];

  const hiddenSections = allPossible.filter((s) => !sectionsOrder.includes(s));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-black text-white">סדר סקשנים פעילים בעמוד:</h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">שנה את סדר הסקשנים בעמוד או הסתר חלקים</p>
      </div>

      <div className="space-y-2">
        {sectionsOrder.map((sectionId, idx) => (
          <div
            key={sectionId}
            className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-zinc-900/80 text-right"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 font-mono text-[10px] flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <span className="text-xs font-bold text-white">
                {SECTION_LABELS[sectionId] || sectionId}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => onMoveSection(sectionId, 'up')}
                className="p-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="למעלה"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === sectionsOrder.length - 1}
                onClick={() => onMoveSection(sectionId, 'down')}
                className="p-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="למטה"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onToggleSection(sectionId)}
                className="p-1 rounded-md bg-red-950/40 text-red-400 hover:bg-red-900/60 cursor-pointer mr-1"
                title="הסתר"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {hiddenSections.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <span className="text-[11px] font-bold text-zinc-400 block mb-2">
            סקשנים מוסתרים (לחץ להחזרה):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {hiddenSections.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onToggleSection(s)}
                className="px-2.5 py-1 rounded-lg border border-dashed border-zinc-700 bg-zinc-900 hover:border-emerald-500 hover:text-emerald-400 text-[11px] text-zinc-400 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>{SECTION_LABELS[s] || s}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
