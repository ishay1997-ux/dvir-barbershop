'use client';

import React, { useRef } from 'react';
import { useFocusTrap } from '../useFocusTrap';
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
  const panelRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(panelRef, isOpen);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-speech-settings-title"
          className="acc:fixed acc:bottom-24 acc:sm:bottom-28 acc:left-1/2 acc:-translate-x-1/2 acc:z-[9999999] acc:w-[92vw] acc:max-w-[370px] acc:bg-white acc:rounded-3xl acc:shadow-[0_16px_50px_rgba(0,0,0,0.22)] acc:border acc:border-slate-200 acc:p-4 acc:sm:p-5 a11y-widget-root a11y-ignore acc:text-slate-800 acc:select-none"
          dir="rtl"
        >
          {/* Accessible name for the dialog (visually hidden) */}
          <h2 id="a11y-speech-settings-title" className="acc:sr-only">{t.speechSettingsTitle}</h2>
          {/* Top Close X Button */}
          <div className="acc:flex acc:items-center acc:justify-end acc:pb-1 acc:mb-2">
            <button
              onClick={onClose}
              className="acc:w-7 acc:h-7 acc:rounded-full acc:hover:bg-slate-100 acc:flex acc:items-center acc:justify-center acc:text-[#0088A9] acc:hover:text-black acc:transition-colors acc:cursor-pointer"
              aria-label={t.close}
            >
              <X className="acc:w-5 acc:h-5" />
            </button>
          </div>

          {/* Top Voice Selector Banner (Teal / Cyan Banner with Flag & Name) */}
          <div className="acc:bg-[#0088A9] acc:text-white acc:rounded-2xl acc:px-3.5 acc:py-2.5 acc:flex acc:items-center acc:justify-between acc:gap-2 acc:mb-4 acc:shadow-sm">
            <div className="acc:flex acc:items-center acc:gap-2 acc:flex-1 acc:min-w-0">
              <span className="acc:text-lg">
                {LANGUAGES.find((l) => l.code === language)?.flag || '🇮🇱'}
              </span>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = availableVoices.find((v) => v.name === e.target.value);
                  if (voice) onSelectVoice(voice);
                }}
                className="acc:bg-transparent acc:text-white acc:font-bold acc:text-xs acc:outline-none acc:w-full acc:truncate acc:cursor-pointer"
                aria-label={t.speechVoice}
              >
                {availableVoices.length > 0 ? (
                  availableVoices.map((v) => (
                    <option key={v.name} value={v.name} className="acc:bg-slate-900 acc:text-white">
                      {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option value="" className="acc:bg-slate-900 acc:text-white">
                    Microsoft Asaf - Hebrew (Israel)
                  </option>
                )}
              </select>
            </div>
            <ChevronDown className="acc:w-4 acc:h-4 acc:text-white/80 acc:pointer-events-none acc:shrink-0" />
          </div>

          {/* 2 Circular Gauge Controls Side-by-Side (גובה צליל & קצב) */}
          <div className="acc:grid acc:grid-cols-2 acc:gap-3 acc:py-2 acc:relative">
            {/* Vertical Center Divider */}
            <div className="acc:absolute acc:top-2 acc:bottom-2 acc:left-1/2 acc:w-[1px] acc:bg-slate-200 acc:-translate-x-1/2" />

            {/* 1. גובה צליל (Pitch) */}
            <div className="acc:flex acc:flex-col acc:items-center acc:text-center">
              <span className="acc:text-xs acc:font-bold acc:text-[#0088A9] acc:mb-2.5">
                {t.speechPitch}
              </span>

              <div className="acc:flex acc:items-center acc:justify-center acc:gap-2 acc:w-full">
                {/* Minus Button */}
                <button
                  onClick={() =>
                    setSpeechPitch((p) => Math.max(0.5, Number((p - 0.1).toFixed(1))))
                  }
                  className="acc:w-7 acc:h-7 acc:sm:w-8 acc:sm:h-8 acc:rounded-full acc:bg-slate-100 acc:hover:bg-slate-200 acc:text-[#0088A9] acc:font-black acc:text-sm acc:flex acc:items-center acc:justify-center acc:active:scale-95 acc:transition-all acc:cursor-pointer"
                  title="הנמך גובה צליל"
                  aria-label="הנמך גובה צליל"
                >
                  <Minus className="acc:w-3.5 acc:h-3.5" />
                </button>

                {/* Rotary Dial Gauge */}
                <div className="acc:relative acc:w-14 acc:h-14 acc:sm:w-16 acc:sm:h-16 acc:rounded-full acc:border-[3px] acc:border-[#0088A9] acc:flex acc:items-center acc:justify-center acc:bg-white acc:shadow-xs">
                  {/* Inner Solid Circle with Current Value */}
                  <div className="acc:w-8 acc:h-8 acc:sm:w-10 acc:sm:h-10 acc:rounded-full acc:bg-[#0088A9] acc:flex acc:items-center acc:justify-center acc:text-white acc:font-black acc:text-xs acc:shadow-xs">
                    {speechPitch.toFixed(1)}
                  </div>

                  {/* Indicator Dot on the outer ring */}
                  <div
                    className="acc:absolute acc:w-3 acc:h-3 acc:rounded-full acc:bg-[#0088A9] acc:border-2 acc:border-white acc:shadow-sm"
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
                  className="acc:w-7 acc:h-7 acc:sm:w-8 acc:sm:h-8 acc:rounded-full acc:bg-slate-100 acc:hover:bg-slate-200 acc:text-[#0088A9] acc:font-black acc:text-sm acc:flex acc:items-center acc:justify-center acc:active:scale-95 acc:transition-all acc:cursor-pointer"
                  title="הגבר גובה צליל"
                  aria-label="הגבר גובה צליל"
                >
                  <Plus className="acc:w-3.5 acc:h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. קצב (Rate / Speed) */}
            <div className="acc:flex acc:flex-col acc:items-center acc:text-center">
              <span className="acc:text-xs acc:font-bold acc:text-[#0088A9] acc:mb-2.5">
                {t.speechRate}
              </span>

              <div className="acc:flex acc:items-center acc:justify-center acc:gap-2 acc:w-full">
                {/* Minus Button */}
                <button
                  onClick={() =>
                    setSpeechRate((r) => Math.max(0.5, Number((r - 0.1).toFixed(1))))
                  }
                  className="acc:w-7 acc:h-7 acc:sm:w-8 acc:sm:h-8 acc:rounded-full acc:bg-slate-100 acc:hover:bg-slate-200 acc:text-[#0088A9] acc:font-black acc:text-sm acc:flex acc:items-center acc:justify-center acc:active:scale-95 acc:transition-all acc:cursor-pointer"
                  title="האט קצב"
                  aria-label="האט קצב"
                >
                  <Minus className="acc:w-3.5 acc:h-3.5" />
                </button>

                {/* Rotary Dial Gauge */}
                <div className="acc:relative acc:w-14 acc:h-14 acc:sm:w-16 acc:sm:h-16 acc:rounded-full acc:border-[3px] acc:border-[#0088A9] acc:flex acc:items-center acc:justify-center acc:bg-white acc:shadow-xs">
                  {/* Inner Solid Circle with Current Value */}
                  <div className="acc:w-8 acc:h-8 acc:sm:w-10 acc:sm:h-10 acc:rounded-full acc:bg-[#0088A9] acc:flex acc:items-center acc:justify-center acc:text-white acc:font-black acc:text-xs acc:shadow-xs">
                    {speechRate.toFixed(1)}
                  </div>

                  {/* Indicator Dot on the outer ring */}
                  <div
                    className="acc:absolute acc:w-3 acc:h-3 acc:rounded-full acc:bg-[#0088A9] acc:border-2 acc:border-white acc:shadow-sm"
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
                  className="acc:w-7 acc:h-7 acc:sm:w-8 acc:sm:h-8 acc:rounded-full acc:bg-slate-100 acc:hover:bg-slate-200 acc:text-[#0088A9] acc:font-black acc:text-sm acc:flex acc:items-center acc:justify-center acc:active:scale-95 acc:transition-all acc:cursor-pointer"
                  title="הגבר קצב"
                  aria-label="הגבר קצב"
                >
                  <Plus className="acc:w-3.5 acc:h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Left Circular Close Button */}
          <div className="acc:flex acc:items-center acc:justify-start acc:pt-2 acc:mt-2 acc:border-t acc:border-slate-100">
            <button
              onClick={onClose}
              className="acc:w-7 acc:h-7 acc:rounded-full acc:bg-white acc:border acc:border-slate-300 acc:shadow-sm acc:flex acc:items-center acc:justify-center acc:text-slate-500 acc:hover:text-black acc:transition-colors acc:cursor-pointer"
              aria-label={t.close}
            >
              <X className="acc:w-3.5 acc:h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
