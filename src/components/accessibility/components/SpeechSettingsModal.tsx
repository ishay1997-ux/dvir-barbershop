'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Minus, Plus } from 'lucide-react';
import { LANGUAGES, A11yState } from '../types';
import { A11Y_I18N } from '../i18n';

interface SpeechSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: A11yState['language'];
  selectedVoice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
  speechPitch: number;
  setSpeechPitch: React.Dispatch<React.SetStateAction<number>>;
  speechRate: number;
  setSpeechRate: React.Dispatch<React.SetStateAction<number>>;
  t: typeof A11Y_I18N.he;
}

export const SpeechSettingsModal: React.FC<SpeechSettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  selectedVoice,
  availableVoices,
  onSelectVoice,
  speechPitch,
  setSpeechPitch,
  speechRate,
  setSpeechRate,
  t,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-[9999999] w-[92vw] max-w-[370px] bg-white rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.22)] border border-slate-200 p-4 sm:p-5 a11y-ignore text-slate-800 select-none"
          dir="rtl"
        >
          {/* Top Close X Button */}
          <div className="flex items-center justify-end pb-1 mb-2">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#0088A9] hover:text-black transition-colors cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Voice Selector Banner (Teal / Cyan Banner with Flag & Name) */}
          <div className="bg-[#0088A9] text-white rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 mb-4 shadow-sm">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-lg">
                {LANGUAGES.find((l) => l.code === language)?.flag || '🇮🇱'}
              </span>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = availableVoices.find((v) => v.name === e.target.value);
                  if (voice) onSelectVoice(voice);
                }}
                className="bg-transparent text-white font-bold text-xs outline-none w-full truncate cursor-pointer"
                aria-label={t.speechVoice}
              >
                {availableVoices.length > 0 ? (
                  availableVoices.map((v) => (
                    <option key={v.name} value={v.name} className="bg-slate-900 text-white">
                      {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option value="" className="bg-slate-900 text-white">
                    Microsoft Asaf - Hebrew (Israel)
                  </option>
                )}
              </select>
            </div>
            <ChevronDown className="w-4 h-4 text-white/80 pointer-events-none shrink-0" />
          </div>

          {/* 2 Circular Gauge Controls Side-by-Side (גובה צליל & קצב) */}
          <div className="grid grid-cols-2 gap-3 py-2 relative">
            {/* Vertical Center Divider */}
            <div className="absolute top-2 bottom-2 left-1/2 w-[1px] bg-slate-200 -translate-x-1/2" />

            {/* 1. גובה צליל (Pitch) */}
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-bold text-[#0088A9] mb-2.5">
                {t.speechPitch}
              </span>

              <div className="flex items-center justify-center gap-2 w-full">
                {/* Minus Button */}
                <button
                  onClick={() =>
                    setSpeechPitch((p) => Math.max(0.5, Number((p - 0.1).toFixed(1))))
                  }
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0088A9] font-black text-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  title="הנמך גובה צליל"
                  aria-label="הנמך גובה צליל"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Rotary Dial Gauge */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-[#0088A9] flex items-center justify-center bg-white shadow-xs">
                  {/* Inner Solid Circle with Current Value */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0088A9] flex items-center justify-center text-white font-black text-xs shadow-xs">
                    {speechPitch.toFixed(1)}
                  </div>

                  {/* Indicator Dot on the outer ring */}
                  <div
                    className="absolute w-3 h-3 rounded-full bg-[#0088A9] border-2 border-white shadow-sm"
                    style={{
                      top: `${50 - 46 * Math.cos(((speechPitch - 0.5) / 1.3) * 2 * Math.PI)}%`,
                      left: `${50 + 46 * Math.sin(((speechPitch - 0.5) / 1.3) * 2 * Math.PI)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>

                {/* Plus Button */}
                <button
                  onClick={() =>
                    setSpeechPitch((p) => Math.min(1.8, Number((p + 0.1).toFixed(1))))
                  }
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0088A9] font-black text-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  title="הגבר גובה צליל"
                  aria-label="הגבר גובה צליל"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. קצב (Rate / Speed) */}
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-bold text-[#0088A9] mb-2.5">
                {t.speechRate}
              </span>

              <div className="flex items-center justify-center gap-2 w-full">
                {/* Minus Button */}
                <button
                  onClick={() =>
                    setSpeechRate((r) => Math.max(0.5, Number((r - 0.1).toFixed(1))))
                  }
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0088A9] font-black text-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  title="האט קצב"
                  aria-label="האט קצב"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Rotary Dial Gauge */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-[#0088A9] flex items-center justify-center bg-white shadow-xs">
                  {/* Inner Solid Circle with Current Value */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0088A9] flex items-center justify-center text-white font-black text-xs shadow-xs">
                    {speechRate.toFixed(1)}
                  </div>

                  {/* Indicator Dot on the outer ring */}
                  <div
                    className="absolute w-3 h-3 rounded-full bg-[#0088A9] border-2 border-white shadow-sm"
                    style={{
                      top: `${50 - 46 * Math.cos(((speechRate - 0.5) / 1.5) * 2 * Math.PI)}%`,
                      left: `${50 + 46 * Math.sin(((speechRate - 0.5) / 1.5) * 2 * Math.PI)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>

                {/* Plus Button */}
                <button
                  onClick={() =>
                    setSpeechRate((r) => Math.min(2.0, Number((r + 0.1).toFixed(1))))
                  }
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0088A9] font-black text-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  title="הגבר קצב"
                  aria-label="הגבר קצב"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Left Circular Close Button */}
          <div className="flex items-center justify-start pt-2 mt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center text-slate-500 hover:text-black transition-colors cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
