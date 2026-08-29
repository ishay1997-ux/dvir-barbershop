'use client';

import React from 'react';
import { Sliders, RotateCcw } from 'lucide-react';
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
}

export const ColorSpectrumCard: React.FC<ColorSpectrumCardProps> = ({
  colorTarget,
  onSelectTarget,
  currentTargetHue,
  onColorSpectrumClick,
  onResetColors,
  colorSliderRef,
  t,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-sm text-[#085B7A]">{t.colorSectionTitle}</h3>
          <p className="text-xs text-[#085B7A]/80">{t.colorSectionDesc}</p>
        </div>
        <Sliders className="w-4 h-4 text-[#085B7A]" />
      </div>

      {/* Target Buttons */}
      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
        <button
          onClick={() => onSelectTarget('background')}
          className={`py-1.5 px-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            colorTarget === 'background'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.targetBackground}
        </button>
        <button
          onClick={() => onSelectTarget('headings')}
          className={`py-1.5 px-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            colorTarget === 'headings'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.targetHeadings}
        </button>
        <button
          onClick={() => onSelectTarget('text')}
          className={`py-1.5 px-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            colorTarget === 'text'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
        >
          {t.targetText}
        </button>
      </div>

      {/* Rainbow Spectrum Color Bar */}
      <div
        ref={colorSliderRef}
        onClick={onColorSpectrumClick}
        className="relative h-5 rounded-full cursor-pointer shadow-inner mb-2.5 border border-black/10"
        style={{
          background:
            'linear-gradient(to right, #000 0%, #fff 15%, #ff0000 25%, #ffff00 40%, #00ff00 55%, #00ffff 70%, #0000ff 85%, #ff00ff 100%)',
        }}
        title={t.colorSectionTitle}
      >
        {currentTargetHue !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#085B7A] shadow-md -ml-2.5 pointer-events-none"
            style={{ left: `${(currentTargetHue / 360) * 100}%` }}
          />
        )}
      </div>

      {/* Reset Colors Button */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onResetColors}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#085B7A] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t.resetColors}
        </button>

        {currentTargetHue !== null && (
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            {t.activeCustomColor}
          </span>
        )}
      </div>
    </div>
  );
};
