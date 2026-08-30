'use client';

import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { BUSINESS_ARCHETYPES, THEME_PALETTES } from '@/lib/archetypes';

interface Step2ArchetypeAndBrandingProps {
  adminTheme: 'dark' | 'light';
  newBizArchetype: string;
  setNewBizArchetype: (arch: string) => void;
  newBizThemeColor: string;
  setNewBizThemeColor: (color: string) => void;
  syncArchetypeDefaults: (archId: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2ArchetypeAndBranding: React.FC<Step2ArchetypeAndBrandingProps> = ({
  adminTheme,
  newBizArchetype,
  setNewBizArchetype,
  newBizThemeColor,
  setNewBizThemeColor,
  syncArchetypeDefaults,
  onPrev,
  onNext,
}) => {
  return (
    <div className="space-y-3.5 text-xs">
      <div>
        <label
          className={`block font-bold mb-1.5 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
          }`}
        >
          בחר תחום עיסוק וסגנון לעסק החדש:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.values(BUSINESS_ARCHETYPES).map((arch) => (
            <div
              key={arch.id}
              onClick={() => {
                setNewBizArchetype(arch.id);
                syncArchetypeDefaults(arch.id);
              }}
              className={`p-3 rounded-2xl border text-right cursor-pointer transition-all ${
                newBizArchetype === arch.id
                  ? 'bg-amber-500/10 border-[#C9A84C] shadow-xs ring-1 ring-[#C9A84C]'
                  : adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                  : 'bg-[#141414] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{arch.icon}</span>
                {newBizArchetype === arch.id && (
                  <span className="text-emerald-600 font-bold text-[10px]">נבחר ✓</span>
                )}
              </div>
              <h4
                className={`font-black text-xs mb-0.5 ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                {arch.name}
              </h4>
              <p
                className={`text-[11px] leading-tight ${
                  adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                }`}
              >
                {arch.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          className={`block font-bold mb-1.5 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
          }`}
        >
          בחר פלטת צבעי יוקרה לאתר:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {THEME_PALETTES.map((pal) => (
            <div
              key={pal.id}
              onClick={() => setNewBizThemeColor(pal.color)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                newBizThemeColor === pal.color
                  ? 'bg-amber-500/10 border-[#C9A84C] shadow-xs'
                  : adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  : 'bg-[#141414] border-white/10 hover:border-white/20'
              }`}
            >
              <div
                className="w-5 h-5 rounded-full shadow-xs"
                style={{ backgroundColor: pal.color }}
              />
              <span
                className={`text-[11px] font-bold truncate ${
                  adminTheme === 'light' ? 'text-slate-800' : 'text-white'
                }`}
              >
                {pal.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors ${
            adminTheme === 'light'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-white/10 hover:bg-white/15 text-zinc-300'
          }`}
        >
          <ArrowRight className="w-3.5 h-3.5" /> חזרה
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
        >
          <span>המשך לסקירת מחירון וסיום</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
