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
}) => {
  return (
    <div className="acc:bg-white acc:rounded-2xl acc:border acc:border-slate-200 acc:p-4 acc:sm:p-4.5 acc:shadow-xs">
      <div className="acc:flex acc:items-center acc:justify-between acc:mb-3" dir={currentDirection}>
        <div className="acc:text-start">
          <h3 className="acc:font-bold acc:text-sm acc:sm:text-base acc:text-[#085B7A] acc:leading-snug">
            {t.fontSectionTitle}
          </h3>
          <p className="acc:text-xs acc:sm:text-[13px] acc:text-[#085B7A]/80 acc:font-medium acc:leading-snug">
            {t.fontSectionDesc}
          </p>
        </div>
        <div className="acc:text-[#085B7A] acc:shrink-0 acc:font-bold acc:flex acc:items-center acc:justify-center">
          <Type className="acc:w-5 acc:h-5 acc:sm:w-6 acc:sm:h-6" />
        </div>
      </div>

      {/* 4 Mode Pills in a single row */}
      <div className="acc:grid acc:grid-cols-4 acc:gap-1.5 acc:mb-3.5" dir={currentDirection}>
        <button
          onClick={() => onSelectMode('size')}
          className={`acc:py-2 acc:px-1.5 acc:rounded-full acc:text-xs acc:sm:text-[12.5px] acc:font-bold acc:transition-all acc:border acc:text-center acc:cursor-pointer acc:whitespace-nowrap ${
            fontAdjustmentMode === 'size'
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs acc:font-black'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
          }`}
        >
          {t.fontSize}
        </button>

        <button
          onClick={() => onSelectMode('line')}
          className={`acc:py-2 acc:px-1.5 acc:rounded-full acc:text-xs acc:sm:text-[12.5px] acc:font-bold acc:transition-all acc:border acc:text-center acc:cursor-pointer acc:whitespace-nowrap ${
            fontAdjustmentMode === 'line'
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs acc:font-black'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
          }`}
        >
          {t.lineHeight}
        </button>

        <button
          onClick={() => onSelectMode('word')}
          className={`acc:py-2 acc:px-1.5 acc:rounded-full acc:text-xs acc:sm:text-[12.5px] acc:font-bold acc:transition-all acc:border acc:text-center acc:cursor-pointer acc:whitespace-nowrap ${
            fontAdjustmentMode === 'word'
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs acc:font-black'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
          }`}
        >
          {t.wordSpacing}
        </button>

        <button
          onClick={() => onSelectMode('letter')}
          className={`acc:py-2 acc:px-1.5 acc:rounded-full acc:text-xs acc:sm:text-[12.5px] acc:font-bold acc:transition-all acc:border acc:text-center acc:cursor-pointer acc:whitespace-nowrap ${
            fontAdjustmentMode === 'letter'
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs acc:font-black'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
          }`}
        >
          {t.letterSpacing}
        </button>
      </div>

      {/* Smooth Range Slider Bar */}
      <div
        className="acc:relative acc:h-9 acc:sm:h-10 acc:bg-slate-100/90 acc:rounded-full acc:flex acc:items-center acc:p-1 acc:border acc:border-slate-200/80 acc:shadow-inner acc:select-none"
        dir="ltr"
      >
        <button
          onClick={onStepperDecrease}
          disabled={currentLevel <= 0}
          className="acc:w-7 acc:h-7 acc:sm:w-8 acc:sm:h-8 acc:rounded-full acc:bg-[#085B7A] acc:text-white acc:flex acc:items-center acc:justify-center acc:font-black acc:text-sm acc:disabled:opacity-40 acc:hover:bg-[#064961] acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:shadow-xs acc:shrink-0 acc:z-10"
          aria-label="Decrease"
        >
          <Minus className="acc:w-3.5 acc:h-3.5" />
        </button>

        <div className="acc:flex-1 acc:h-full acc:mx-2 acc:relative acc:overflow-hidden acc:rounded-full acc:flex acc:items-center acc:bg-slate-200/60">
          <div
            className="acc:h-full acc:bg-[#085B7A] acc:rounded-full acc:transition-all acc:duration-200 acc:shadow-xs"
            style={{
              width: `${(currentLevel / maxLevel) * 100}%`,
            }}
          />
        </div>

        <button
          onClick={onStepperIncrease}
          disabled={currentLevel >= maxLevel}
          className="acc:w-7 acc:h-7 acc:sm:w-8 acc:sm:h-8 acc:rounded-full acc:bg-[#085B7A] acc:text-white acc:flex acc:items-center acc:justify-center acc:font-black acc:text-sm acc:disabled:opacity-40 acc:hover:bg-[#064961] acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:shadow-xs acc:shrink-0 acc:z-10"
          aria-label="Increase"
        >
          <Plus className="acc:w-3.5 acc:h-3.5" />
        </button>
      </div>
    </div>
  );
};
