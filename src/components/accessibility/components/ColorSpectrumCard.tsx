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
    <div className="acc:bg-white acc:rounded-2xl acc:border acc:border-slate-200 acc:p-4 acc:sm:p-4.5 acc:shadow-xs" dir={currentDirection}>
      {/* Header with Title and Droplet Icon */}
      <div className="acc:flex acc:items-center acc:justify-between acc:mb-3">
        <div className="acc:text-start">
          <h3 className="acc:font-bold acc:text-sm acc:sm:text-base acc:text-[#085B7A] acc:leading-snug">
            {t.colorSectionTitle}
          </h3>
          <p className="acc:text-xs acc:sm:text-[13px] acc:text-[#085B7A]/80 acc:font-medium acc:leading-snug">
            {t.colorSectionDesc}
          </p>
        </div>
        <div className="acc:text-[#085B7A] acc:shrink-0">
          <Droplet className="acc:w-5 acc:h-5 acc:sm:w-6 acc:sm:h-6" />
        </div>
      </div>

      {/* Target Pills: רקעים / כותרות / תכנים */}
      <div className="acc:grid acc:grid-cols-3 acc:gap-2 acc:mb-3.5">
        <button
          onClick={() => onSelectTarget('background')}
          className={`acc:py-2 acc:px-3 acc:rounded-full acc:text-xs acc:sm:text-[13px] acc:font-bold acc:transition-all acc:border acc:cursor-pointer acc:text-center ${
            colorTarget === 'background'
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={colorTarget === 'background'}
        >
          {t.targetBackground}
        </button>
        <button
          onClick={() => onSelectTarget('headings')}
          className={`acc:py-2 acc:px-3 acc:rounded-full acc:text-xs acc:sm:text-[13px] acc:font-bold acc:transition-all acc:border acc:cursor-pointer acc:text-center ${
            colorTarget === 'headings'
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={colorTarget === 'headings'}
        >
          {t.targetHeadings}
        </button>
        <button
          onClick={() => onSelectTarget('text')}
          className={`acc:py-2 acc:px-3 acc:rounded-full acc:text-xs acc:sm:text-[13px] acc:font-bold acc:transition-all acc:border acc:cursor-pointer acc:text-center ${
            colorTarget === 'text'
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
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
        className="a11y-hue-range acc:w-full acc:h-7 acc:sm:h-8 acc:rounded-full acc:shadow-inner acc:mb-3 acc:border acc:border-black/10 acc:cursor-pointer"
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
      <div className="acc:flex acc:items-center acc:justify-between acc:pt-0.5">
        <button
          onClick={onResetColors}
          className="acc:inline-flex acc:items-center acc:gap-1.5 acc:text-xs acc:sm:text-[13px] acc:font-bold acc:text-[#085B7A] acc:hover:underline acc:cursor-pointer"
        >
          <span>{t.resetColors}</span>
          <RotateCcw className="acc:w-3.5 acc:h-3.5" />
        </button>

        {currentTargetHue !== null && (
          <span className="acc:text-[11px] acc:sm:text-xs acc:text-emerald-700 acc:font-bold acc:bg-emerald-50 acc:px-2.5 acc:py-0.5 acc:rounded-full acc:border acc:border-emerald-200">
            {t.activeCustomColor}
          </span>
        )}
      </div>
    </div>
  );
};
