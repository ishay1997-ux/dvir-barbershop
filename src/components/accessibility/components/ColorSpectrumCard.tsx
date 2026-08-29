'use client';

import React from 'react';
import { Droplet, RotateCcw } from 'lucide-react';
import { A11yState } from '../types';
import { A11Y_I18N } from '../i18n';

interface ColorSpectrumCardProps {
  colorTarget: A11yState['colorTarget'];
  onSelectTarget: (target: A11yState['colorTarget']) => void;
  currentTargetHue: number | null;
  onColorSpectrumClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onResetColors: () => void;
  colorSliderRef: React.RefObject<HTMLDivElement | null>;
  t: typeof A11Y_I18N.he;
  currentDirection?: 'rtl' | 'ltr';
  isRtl?: boolean;
}

export const ColorSpectrumCard: React.FC<ColorSpectrumCardProps> = ({
  colorTarget,
  onSelectTarget,
  currentTargetHue,
  onColorSpectrumClick,
  onResetColors,
  colorSliderRef,
  t,
  currentDirection = 'rtl',
  isRtl = true,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-4.5 shadow-xs" dir={currentDirection}>
      {/* Header with Title and Droplet Icon */}
      <div className="flex items-center justify-between mb-3">
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h3 className="font-bold text-sm sm:text-base text-[#085B7A] leading-snug">
            {t.colorSectionTitle}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#085B7A]/80 font-medium leading-snug">
            {t.colorSectionDesc}
          </p>
        </div>
        <div className="text-[#085B7A] shrink-0">
          <Droplet className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Target Pills: רקעים / כותרות / תכנים */}
      <div className="grid grid-cols-3 gap-2 mb-3.5">
        <button
          onClick={() => onSelectTarget('background')}
          className={`py-2 px-3 rounded-full text-xs sm:text-[13px] font-bold transition-all border cursor-pointer text-center ${
            colorTarget === 'background'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={colorTarget === 'background'}
        >
          {t.targetBackground}
        </button>
        <button
          onClick={() => onSelectTarget('headings')}
          className={`py-2 px-3 rounded-full text-xs sm:text-[13px] font-bold transition-all border cursor-pointer text-center ${
            colorTarget === 'headings'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={colorTarget === 'headings'}
        >
          {t.targetHeadings}
        </button>
        <button
          onClick={() => onSelectTarget('text')}
          className={`py-2 px-3 rounded-full text-xs sm:text-[13px] font-bold transition-all border cursor-pointer text-center ${
            colorTarget === 'text'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={colorTarget === 'text'}
        >
          {t.targetText}
        </button>
      </div>

      {/* Rainbow Spectrum Color Bar */}
      <div
        ref={colorSliderRef}
        onClick={onColorSpectrumClick}
        className="relative h-7 sm:h-8 rounded-full cursor-pointer shadow-inner mb-3 border border-black/10 select-none overflow-hidden"
        style={{
          background:
            'linear-gradient(to right, #000 0%, #fff 12%, #ff0000 25%, #ffff00 40%, #00ff00 55%, #00ffff 70%, #0000ff 85%, #ff00ff 100%)',
        }}
        title={t.colorSectionTitle}
      >
        {currentTargetHue !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-[#085B7A] shadow-md -ml-3 pointer-events-none"
            style={{ left: `${(currentTargetHue / 360) * 100}%` }}
          />
        )}
      </div>

      {/* Reset Colors Button */}
      <div className="flex items-center justify-between pt-0.5">
        <button
          onClick={onResetColors}
          className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#085B7A] hover:underline cursor-pointer"
        >
          <span>{t.resetColors}</span>
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {currentTargetHue !== null && (
          <span className="text-[11px] sm:text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {t.activeCustomColor}
          </span>
        )}
      </div>
    </div>
  );
};
