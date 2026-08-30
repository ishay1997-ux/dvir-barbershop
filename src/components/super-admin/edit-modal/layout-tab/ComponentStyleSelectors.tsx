import React from 'react';
import type { Business } from '../../types';

interface ComponentStyleSelectorsProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export function ComponentStyleSelectors({
  editingBiz,
  adminTheme,
  setEditingBiz,
}: ComponentStyleSelectorsProps) {
  return (
    <div className="space-y-4">
      {/* Hero Layout Style Selector */}
      <div>
        <label
          className={`block font-bold mb-2 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          סגנון פתיח עמוד הבית (Hero Archetype):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'hub-monogram', name: 'Panoramic Hero Hub', sub: 'פנורמי + לוגו עגול', icon: '💈' },
            { id: 'split-cinema', name: 'Split Cinema Showcase', sub: 'תמונה + כרטיס זימון', icon: '🎬' },
            { id: 'minimalist-vip', name: 'Minimalist VIP', sub: 'יוקרתי ממורכז + כפתור ענק', icon: '👑' },
          ].map((h) => {
            const currentHero = editingBiz.layout?.heroStyle || 'hub-monogram';
            const isSelected = currentHero === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  setEditingBiz({
                    ...editingBiz,
                    layout: {
                      ...(editingBiz.layout || {}),
                      heroStyle: h.id as any,
                    },
                  });
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                    : adminTheme === 'light'
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
                }`}
              >
                <span className="text-xl mb-1">{h.icon}</span>
                <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {h.name}
                </span>
                <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {h.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Layout Selector */}
      <div>
        <label
          className={`block font-bold mb-2 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          📋 סגנון תצוגת מחירון ושירותים (Services Layout):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'split-gallery', name: 'Split Visuals', sub: 'תמונות + מחירון', icon: '📋' },
            { id: 'cards-grid', name: 'Cards Grid', sub: 'כרטיסים רחבים', icon: '🗂️' },
            { id: 'compact-menu', name: 'Digital Menu', sub: 'תפריט מהיר', icon: '📑' },
          ].map((s) => {
            const isSelected = (editingBiz.layout?.servicesStyle || 'split-gallery') === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setEditingBiz({
                    ...editingBiz,
                    layout: {
                      ...(editingBiz.layout || {}),
                      servicesStyle: s.id as any,
                    },
                  });
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                    : adminTheme === 'light'
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
                }`}
              >
                <span className="text-xl mb-1">{s.icon}</span>
                <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {s.name}
                </span>
                <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {s.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Archetype Selector */}
      <div>
        <label
          className={`block font-bold mb-2 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          📸 סגנון הגלריה והעבודות (Gallery Archetype):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'before-after-slider', name: 'סליידר לפני/אחרי', sub: 'השוואת עבודות', icon: '✂️' },
            { id: 'instagram-masonry', name: 'Insta Grid', sub: 'רשת תמונות וזום', icon: '📸' },
            { id: 'ambient-carousel', name: 'Ambient Slider', sub: 'קרוסלת אווירה', icon: '🌿' },
          ].map((g) => {
            const isSelected = (editingBiz.layout?.galleryStyle || 'before-after-slider') === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setEditingBiz({
                    ...editingBiz,
                    layout: {
                      ...(editingBiz.layout || {}),
                      galleryStyle: g.id as any,
                    },
                  });
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                    : adminTheme === 'light'
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
                }`}
              >
                <span className="text-xl mb-1">{g.icon}</span>
                <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {g.name}
                </span>
                <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {g.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Radius & Typography Moods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Radius */}
        <div>
          <label className={`block font-bold mb-1.5 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
            פינות וכרטיסיות:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'modern-rounded', name: 'עגול 24px', icon: '📱' },
              { id: 'sharp-luxury', name: 'חד 8px', icon: '💎' },
              { id: 'classic-soft', name: 'קלאסי 16px', icon: '⚖️' },
            ].map((r) => {
              const isSelected = (editingBiz.layout?.borderRadius || 'modern-rounded') === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setEditingBiz({
                      ...editingBiz,
                      layout: {
                        ...(editingBiz.layout || {}),
                        borderRadius: r.id as any,
                      },
                    });
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#C9A84C] bg-amber-500/10 font-bold'
                      : adminTheme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#141414]'
                  }`}
                >
                  <span className="block text-sm">{r.icon}</span>
                  <span className="text-[10px]">{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Mood */}
        <div>
          <label className={`block font-bold mb-1.5 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
            אופי גופנים:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'urban-bold', name: 'Urban Bold', icon: '🦁' },
              { id: 'modern-sans', name: 'Modern Sans', icon: '⚡' },
              { id: 'luxury-serif', name: 'Luxury Serif', icon: '👑' },
            ].map((f) => {
              const isSelected = (editingBiz.layout?.fontStyle || 'urban-bold') === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setEditingBiz({
                      ...editingBiz,
                      layout: {
                        ...(editingBiz.layout || {}),
                        fontStyle: f.id as any,
                      },
                    });
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#C9A84C] bg-amber-500/10 font-bold'
                      : adminTheme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#141414]'
                  }`}
                >
                  <span className="block text-sm">{f.icon}</span>
                  <span className="text-[10px]">{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
