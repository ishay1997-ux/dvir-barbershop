import React from 'react';
import { THEME_PALETTES } from '@/lib/archetypes';
import type { Business } from '../../types';

interface BrandThemeSelectorProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export function BrandThemeSelector({
  editingBiz,
  adminTheme,
  setEditingBiz,
}: BrandThemeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          className={`block font-bold ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          🎨 פלטת צבעי מיתוג והילת תאורה לאתר (Brand Color & Aura):
        </label>
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] ${
              adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
            }`}
          >
            דוגם צבע חופשי:
          </span>
          <input
            type="color"
            value={editingBiz.themeColor || '#C9A84C'}
            onChange={(e) => setEditingBiz({ ...editingBiz, themeColor: e.target.value })}
            className="w-7 h-7 rounded-lg border border-slate-300 bg-transparent cursor-pointer"
            title="בחר צבע חופשי"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {THEME_PALETTES.map((pal) => (
          <button
            key={pal.id}
            type="button"
            onClick={() => setEditingBiz({ ...editingBiz, themeColor: pal.color })}
            className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              editingBiz.themeColor === pal.color
                ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                : adminTheme === 'light'
                ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                : 'border-white/10 bg-[#141414] hover:bg-white/5'
            }`}
          >
            <div
              className="w-4 h-4 rounded-full shadow-xs flex-shrink-0"
              style={{ backgroundColor: pal.color }}
            />
            <span
              className={`text-[11px] font-bold truncate ${
                adminTheme === 'light' ? 'text-slate-800' : 'text-white'
              }`}
            >
              {pal.name.split('·')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
