'use client';

import React from 'react';
import { Minus, Plus, Type } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-4.5 shadow-xs">
      <div className="flex items-center justify-between mb-3" dir={currentDirection}>
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h3 className="font-bold text-sm sm:text-base text-[#085B7A] leading-snug">
            {t.fontSectionTitle}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#085B7A]/80 font-medium leading-snug">
            {t.fontSectionDesc}
          </p>
        </div>
        <div className="text-[#085B7A] shrink-0 font-bold flex items-center justify-center">
          <Type className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* 4 Mode Pills in a single row */}
      <div className="grid grid-cols-4 gap-1.5 mb-3.5" dir={currentDirection}>
        <button
          onClick={() => onSelectMode('size')}
          className={`py-2 px-1.5 rounded-full text-xs sm:text-[12.5px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
            fontAdjustmentMode === 'size'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.fontSize}
        </button>

        <button
          onClick={() => onSelectMode('line')}
          className={`py-2 px-1.5 rounded-full text-xs sm:text-[12.5px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
            fontAdjustmentMode === 'line'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.lineHeight}
        </button>

        <button
          onClick={() => onSelectMode('word')}
          className={`py-2 px-1.5 rounded-full text-xs sm:text-[12.5px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
            fontAdjustmentMode === 'word'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.wordSpacing}
        </button>

        <button
          onClick={() => onSelectMode('letter')}
          className={`py-2 px-1.5 rounded-full text-xs sm:text-[12.5px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
            fontAdjustmentMode === 'letter'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.letterSpacing}
        </button>
      </div>

      {/* Smooth Range Slider Bar */}
      <div
        className="relative h-9 sm:h-10 bg-slate-100/90 rounded-full flex items-center p-1 border border-slate-200/80 shadow-inner select-none"
        dir="ltr"
      >
        <button
          onClick={onStepperDecrease}
          disabled={currentLevel <= 0}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#085B7A] text-white flex items-center justify-center font-black text-sm disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 z-10"
          aria-label="Decrease"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 h-full mx-2 relative overflow-hidden rounded-full flex items-center bg-slate-200/60">
          <div
            className="h-full bg-[#085B7A] rounded-full transition-all duration-200 shadow-xs"
            style={{
              width: `${(currentLevel / maxLevel) * 100}%`,
            }}
          />
        </div>

        <button
          onClick={onStepperIncrease}
          disabled={currentLevel >= maxLevel}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#085B7A] text-white flex items-center justify-center font-black text-sm disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 z-10"
          aria-label="Increase"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
