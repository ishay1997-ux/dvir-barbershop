'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { A11yState } from '../types';
import { A11Y_I18N } from '../i18n';

interface FontAdjustmentsCardProps {
  fontAdjustmentMode: A11yState['fontAdjustmentMode'];
  onSelectMode: (mode: A11yState['fontAdjustmentMode']) => void;
  currentLevel: number;
  maxLevel: number;
  onStepperIncrease: () => void;
  onStepperDecrease: () => void;
  t: typeof A11Y_I18N.he;
  currentDirection: 'rtl' | 'ltr';
  isRtl: boolean;
}

export const FontAdjustmentsCard: React.FC<FontAdjustmentsCardProps> = ({
  fontAdjustmentMode,
  onSelectMode,
  currentLevel,
  maxLevel,
  onStepperIncrease,
  onStepperDecrease,
  t,
  currentDirection,
  isRtl,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
      <div className="flex items-center justify-between mb-3" dir={currentDirection}>
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h3 className="font-bold text-sm text-[#085B7A] leading-snug">
            {t.fontSectionTitle}
          </h3>
          <p className="text-xs text-[#085B7A]/80 font-medium leading-snug">
            {t.fontSectionDesc}
          </p>
        </div>
        <div className="text-[#085B7A] shrink-0 font-bold flex items-center justify-center">
          <svg
            className="w-6 h-6 fill-none stroke-current stroke-2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 20h16" />
            <path d="M8 16l4-10 4 10" />
            <path d="M10 12h4" />
            <path d="M12 2v2" />
          </svg>
        </div>
      </div>

      {/* 4 Mode Pills in a single row (RTL order: גודל גופן, ריווח בין שורות, ריווח בין מילים, ריווח אותיות) */}
      <div className="grid grid-cols-4 gap-1.5 mb-3.5" dir={currentDirection}>
        <button
          onClick={() => onSelectMode('size')}
          className={`py-1.5 px-1.5 rounded-full text-[11px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
            fontAdjustmentMode === 'size'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.fontSize}
        </button>

        <button
          onClick={() => onSelectMode('line')}
          className={`py-1.5 px-1.5 rounded-full text-[11px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
            fontAdjustmentMode === 'line'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.lineHeight}
        </button>

        <button
          onClick={() => onSelectMode('word')}
          className={`py-1.5 px-1.5 rounded-full text-[11px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
            fontAdjustmentMode === 'word'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.wordSpacing}
        </button>

        <button
          onClick={() => onSelectMode('letter')}
          className={`py-1.5 px-1.5 rounded-full text-[11px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
            fontAdjustmentMode === 'letter'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.letterSpacing}
        </button>
      </div>

      {/* Smooth Range Slider Bar (Pill with - on left and + on right) */}
      <div
        className="relative h-9 bg-slate-100/90 rounded-full flex items-center p-1 border border-slate-200/80 shadow-inner select-none"
        dir="ltr"
      >
        {/* Minus Button */}
        <button
          onClick={onStepperDecrease}
          disabled={currentLevel <= 0}
          className="w-7 h-7 rounded-full bg-[#085B7A] text-white flex items-center justify-center font-black text-sm disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 z-10"
          aria-label="Decrease"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Blue Filled Range Bar */}
        <div className="flex-1 h-full mx-1.5 relative overflow-hidden rounded-full flex items-center bg-slate-200/60">
          <div
            className="h-full bg-[#085B7A]/75 rounded-full transition-all duration-200 shadow-xs"
            style={{
              width: `${(currentLevel / maxLevel) * 100}%`,
            }}
          />
        </div>

        {/* Plus Button */}
        <button
          onClick={onStepperIncrease}
          disabled={currentLevel >= maxLevel}
          className="w-7 h-7 rounded-full bg-[#085B7A] text-white flex items-center justify-center font-black text-sm disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 z-10"
          aria-label="Increase"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
