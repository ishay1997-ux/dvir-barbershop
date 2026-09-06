'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  FileText,
  Settings,
} from 'lucide-react';
import { A11Y_I18N } from '../i18n';

interface SpeechPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isSpeaking: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
  continuousReading: boolean;
  onToggleContinuous: () => void;
  isSpeechSettingsOpen: boolean;
  onToggleSpeechSettings: () => void;
  t: typeof A11Y_I18N.he;
}

export const SpeechPlayer: React.FC<SpeechPlayerProps> = ({
  isOpen,
  onClose,
  isSpeaking,
  isMuted,
  onToggleMute,
  onPlayPause,
  onPrev,
  onNext,
  onRestart,
  continuousReading,
  onToggleContinuous,
  isSpeechSettingsOpen,
  onToggleSpeechSettings,
  t,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="acc:fixed acc:bottom-6 acc:sm:bottom-8 acc:left-1/2 acc:-translate-x-1/2 acc:z-[999999] acc:bg-white acc:rounded-2xl acc:sm:rounded-3xl acc:shadow-[0_12px_45px_rgba(0,0,0,0.18)] acc:border acc:border-slate-200/90 acc:py-2 acc:sm:py-2.5 acc:px-3 acc:sm:px-4 acc:flex acc:items-center acc:gap-1.5 acc:sm:gap-3 acc:select-none a11y-widget-root a11y-ignore"
          dir="ltr"
        >
          {/* Top-Left Floating Circular Close X Button */}
          <button
            onClick={onClose}
            className="acc:absolute acc:-top-3 acc:-left-3 acc:w-6 acc:h-6 acc:sm:w-7 acc:sm:h-7 acc:rounded-full acc:bg-white acc:border acc:border-slate-300 acc:shadow-md acc:flex acc:items-center acc:justify-center acc:text-slate-500 acc:hover:text-slate-900 acc:hover:scale-110 acc:active:scale-95 acc:transition-all acc:cursor-pointer"
            aria-label={t.speechClose}
            title={t.speechClose}
          >
            <X className="acc:w-3.5 acc:h-3.5 acc:sm:w-4 acc:sm:h-4" />
          </button>

          {/* 1. Volume / Mute Speaker (🔊 / 🔇) */}
          <button
            onClick={onToggleMute}
            className={`acc:p-1.5 acc:sm:p-2 acc:rounded-xl acc:transition-all acc:cursor-pointer acc:flex acc:items-center acc:justify-center ${
              isMuted
                ? 'acc:text-red-500 acc:bg-red-50 acc:hover:bg-red-100'
                : 'acc:text-[#0088A9] acc:hover:bg-[#0088A9]/10'
            }`}
            title={isMuted ? t.speechUnmute : t.speechMute}
            aria-label={isMuted ? t.speechUnmute : t.speechMute}
          >
            {isMuted ? (
              <VolumeX className="acc:w-5 acc:h-5" />
            ) : (
              <Volume2
                className={`acc:w-5 acc:h-5 ${
                  isSpeaking ? 'acc:animate-pulse acc:text-[#0088A9]' : 'acc:text-[#0088A9]'
                }`}
              />
            )}
          </button>

          {/* Vertical Divider */}
          <div className="acc:w-[1px] acc:h-6 acc:bg-slate-200" />

          {/* 2. Play / Pause (▶️ / ⏸️) */}
          <button
            onClick={onPlayPause}
            className="acc:p-1.5 acc:sm:p-2 acc:rounded-xl acc:text-[#0088A9] acc:hover:bg-[#0088A9]/10 acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:flex acc:items-center acc:justify-center"
            title={isSpeaking ? t.speechPause : t.speechPlay}
            aria-label={isSpeaking ? t.speechPause : t.speechPlay}
          >
            {isSpeaking ? (
              <Pause className="acc:w-5 acc:h-5 acc:fill-current" />
            ) : (
              <Play className="acc:w-5 acc:h-5 acc:fill-current" />
            )}
          </button>

          {/* 3. Rewind << (Previous section) */}
          <button
            onClick={onPrev}
            className="acc:p-1.5 acc:sm:p-2 acc:rounded-xl acc:text-[#0088A9] acc:hover:bg-[#0088A9]/10 acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:flex acc:items-center acc:justify-center"
            title={t.speechPrev}
            aria-label={t.speechPrev}
          >
            <ChevronsLeft className="acc:w-5 acc:h-5" />
          </button>

          {/* 4. Forward >> (Next section) */}
          <button
            onClick={onNext}
            className="acc:p-1.5 acc:sm:p-2 acc:rounded-xl acc:text-[#0088A9] acc:hover:bg-[#0088A9]/10 acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:flex acc:items-center acc:justify-center"
            title={t.speechNext}
            aria-label={t.speechNext}
          >
            <ChevronsRight className="acc:w-5 acc:h-5" />
          </button>

          {/* Vertical Divider */}
          <div className="acc:w-[1px] acc:h-6 acc:bg-slate-200" />

          {/* 5. Restart 🔄 (From beginning) */}
          <button
            onClick={onRestart}
            className="acc:p-1.5 acc:sm:p-2 acc:rounded-xl acc:text-[#0088A9] acc:hover:bg-[#0088A9]/10 acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:flex acc:items-center acc:justify-center"
            title={t.speechRestart}
            aria-label={t.speechRestart}
          >
            <RotateCcw className="acc:w-5 acc:h-5" />
          </button>

          {/* Vertical Divider */}
          <div className="acc:w-[1px] acc:h-6 acc:bg-slate-200" />

          {/* 6. Continuous / Hover-To-Read Mode 📑 (Notepad icon) */}
          <button
            onClick={onToggleContinuous}
            className={`acc:p-1.5 acc:sm:p-2 acc:rounded-xl acc:transition-all acc:cursor-pointer acc:flex acc:items-center acc:justify-center ${
              continuousReading
                ? 'acc:bg-[#0088A9] acc:text-white acc:shadow-md acc:ring-2 acc:ring-[#0088A9]/30'
                : 'acc:text-[#0088A9] acc:hover:bg-[#0088A9]/10'
            }`}
            title={`${t.continuousReadingTitle}: ${t.continuousReadingDesc}`}
            aria-label={t.continuousReadingTitle}
            aria-pressed={continuousReading}
          >
            <FileText className="acc:w-5 acc:h-5" />
          </button>

          {/* Vertical Divider */}
          <div className="acc:w-[1px] acc:h-6 acc:bg-slate-200" />

          {/* 7. Settings Gear ⚙️ (Opens speech settings popup) */}
          <button
            onClick={onToggleSpeechSettings}
            className={`acc:p-1.5 acc:sm:p-2 acc:rounded-xl acc:transition-all acc:cursor-pointer acc:flex acc:items-center acc:justify-center ${
              isSpeechSettingsOpen
                ? 'acc:bg-[#0088A9] acc:text-white acc:shadow-md'
                : 'acc:text-[#0088A9] acc:hover:bg-[#0088A9]/10'
            }`}
            title={t.speechSettingsTitle}
            aria-label={t.speechSettingsTitle}
            aria-expanded={isSpeechSettingsOpen}
          >
            <Settings className="acc:w-5 acc:h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
