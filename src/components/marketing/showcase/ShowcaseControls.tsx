import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { ShowcaseSite } from './showcase-data';

interface ShowcaseControlsProps {
  sites: ShowcaseSite[];
  activeIndex: number;
  deviceMode: 'desktop' | 'mobile';
  onSelectNiche: (idx: number) => void;
  onSelectDeviceMode: (mode: 'desktop' | 'mobile') => void;
}

export function ShowcaseControls({
  sites,
  activeIndex,
  deviceMode,
  onSelectNiche,
  onSelectDeviceMode,
}: ShowcaseControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
      {/* Industry Archetype Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 px-1 w-full sm:w-auto no-scrollbar">
        {sites.map((site, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={site.id}
              onClick={() => onSelectNiche(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-slate-950 text-white shadow-md scale-105'
                  : 'bg-white/90 hover:bg-white text-slate-600 border border-slate-200 shadow-xs'
              }`}
            >
              <span>{site.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop vs Mobile Toggle */}
      <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-slate-200 shadow-xs shrink-0">
        <button
          onClick={() => onSelectDeviceMode('desktop')}
          className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            deviceMode === 'desktop'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>דסקטופ</span>
        </button>
        <button
          onClick={() => onSelectDeviceMode('mobile')}
          className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            deviceMode === 'mobile'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>מובייל (PWA)</span>
        </button>
      </div>
    </div>
  );
}
