import React from 'react';
import type { Business } from '../../types';

interface SectionVisibilityTogglesProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

const SECTIONS = [
  {
    key: 'showBio',
    label: '✂️ אודות הספר והניסיון (Barber Bio & Philosophy)',
    desc: 'הצגת פסקת האודות, שנות הניסיון והסטנדרטים',
  },
  {
    key: 'showBranches',
    label: '📍 סניפים וניווט Waze (Branches & Hours)',
    desc: 'הצגת שעות פעילות, כתובת וניווט ישיר',
  },
  {
    key: 'showBeforeAfter',
    label: '🌓 סליידר לפני / אחרי (Before & After Slider)',
    desc: 'סליידר אינטראקטיבי למהפכי תספורת וזקן',
  },
  {
    key: 'showReviews',
    label: '⭐ ביקורות והמלצות (Google Reviews 5.0★)',
    desc: 'הצגת פידבק לקוחות מרוצים וציון ממוצע',
  },
  {
    key: 'showFaqs',
    label: '❓ שאלות נפוצות (FAQ Section)',
    desc: 'אקורדיון שאלות ותשובות לקוחות',
  },
];

export function SectionVisibilityToggles({
  editingBiz,
  adminTheme,
  setEditingBiz,
}: SectionVisibilityTogglesProps) {
  return (
    <div>
      <label
        className={`block font-bold mb-2 ${
          adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
        }`}
      >
        מודולים וסקשנים פעילים בעמוד הבית:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SECTIONS.map((sec) => {
          const isEnabled = (editingBiz.layout as any)?.[sec.key] !== false;
          return (
            <div
              key={sec.key}
              onClick={() => {
                setEditingBiz({
                  ...editingBiz,
                  layout: {
                    ...(editingBiz.layout || {}),
                    [sec.key]: !isEnabled,
                  },
                });
              }}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isEnabled
                  ? adminTheme === 'light'
                  ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                  : 'bg-emerald-950/20 border-emerald-500/40 text-white'
                  : adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                  : 'bg-white/5 border-white/10 text-zinc-500 opacity-60'
              }`}
            >
              <div>
                <div
                  className={`font-bold text-xs ${
                    adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {sec.label}
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                  }`}
                >
                  {sec.desc}
                </div>
              </div>
              <div
                className={`w-8 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                  isEnabled ? 'bg-emerald-500 justify-end' : 'bg-zinc-400 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
