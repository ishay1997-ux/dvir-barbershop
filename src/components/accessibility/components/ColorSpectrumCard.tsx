'use client';

import React from 'react';
import { Droplet, RotateCcw } from 'lucide-react';
import { A11yState } from '../types';
import { A11Y_I18N } from '../i18n';

interface ColorSpectrumCardProps {
  colorTarget: A11yState['colorTarget'];
  onSelectTarget: (target: A11yState['colorTarget']) => void;
  currentTargetHue: number | null;
  onHueChange: (hue: number) => void;
  onResetColors: () => void;
  t: typeof A11Y_I18N.he;
  currentDirection?: 'rtl' | 'ltr';
  isRtl?: boolean;
}

export const ColorSpectrumCard: React.FC<ColorSpectrumCardProps> = ({
  colorTarget,
  onSelectTarget,
  currentTargetHue,
  onHueChange,
  onResetColors,
  t,
  currentDirection = 'rtl',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-4.5 shadow-xs" dir={currentDirection}>
      {/* Header with Title and Droplet Icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-start">
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

      {/* Rainbow Spectrum Color Bar - a real range input: keyboard (arrows / Home / End), screen-reader value, mouse.
          dir="ltr" keeps hue 0 (red) on the physical left, matching the gradient, in RTL locales too. */}
      <input
        type="range"
        min={0}
        max={360}
        step={1}
        dir="ltr"
        value={currentTargetHue ?? 0}
        onChange={(e) => onHueChange(Number(e.target.value))}
        className="a11y-hue-range w-full h-7 sm:h-8 rounded-full shadow-inner mb-3 border border-black/10 cursor-pointer"
        style={{
          background:
            'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
        }}
        aria-label={t.colorSectionTitle}
        aria-valuetext={currentTargetHue === null ? t.colorNoneSelected : `${currentTargetHue}°`}
        data-inactive={currentTargetHue === null ? 'true' : 'false'}
        title={t.colorSectionTitle}
      />

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
