import React from 'react';
import type { Business } from '../../types';

interface BackgroundThemeSelectorProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

const BG_THEMES = [
  { id: 'lavender-mist', name: 'לילך ולבנדר בוטיק', sub: 'Lavender Mist', icon: '🌸' },
  { id: 'botanical-sage', name: 'מרווה ומנטה בוטנית', sub: 'Botanical Sage', icon: '🌿' },
  { id: 'luxury-light', name: 'קרם אלבסטר ושמפניה', sub: 'Luxury Alabaster', icon: '✨' },
  { id: 'dark-obsidian', name: 'שחור פחם מט', sub: 'Dark Obsidian', icon: '🌑' },
  { id: 'brand-midnight', name: 'כחול נייבי-ספיר', sub: 'Brand Midnight', icon: '🌌' },
  { id: 'cyber-carbon', name: 'קרבון שחור מוחלט', sub: 'Cyber Carbon', icon: '⚡' },
];

export function BackgroundThemeSelector({
  editingBiz,
  adminTheme,
  setEditingBiz,
}: BackgroundThemeSelectorProps) {
  return (
    <div>
      <label
        className={`block font-bold mb-2 ${
          adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
        }`}
      >
        ערכת רקע ואווירה כללית לאתר (Website Theme):
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {BG_THEMES.map((th) => {
          const currentBg = editingBiz.layout?.bgTheme || 'dark-obsidian';
          const isSelected = currentBg === th.id;
          return (
            <button
              key={th.id}
              type="button"
              onClick={() => {
                setEditingBiz({
                  ...editingBiz,
                  layout: {
                    ...(editingBiz.layout || {}),
                    bgTheme: th.id as any,
                  },
                });
              }}
              className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                  : adminTheme === 'light'
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                  : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
              }`}
            >
              <span className="text-xl mb-1">{th.icon}</span>
              <span
                className={`text-xs font-bold ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                {th.name}
              </span>
              <span
                className={`text-[10px] ${
                  adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                }`}
              >
                {th.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
