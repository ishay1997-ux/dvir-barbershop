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
          className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-[999999] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.18)] border border-slate-200/90 py-2 sm:py-2.5 px-3 sm:px-4 flex items-center gap-1.5 sm:gap-3 select-none a11y-ignore"
          dir="ltr"
        >
          {/* Top-Left Floating Circular Close X Button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -left-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label={t.speechClose}
            title={t.speechClose}
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* 1. Volume / Mute Speaker (🔊 / 🔇) */}
          <button
            onClick={onToggleMute}
            className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              isMuted
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-[#0088A9] hover:bg-[#0088A9]/10'
            }`}
            title={isMuted ? t.speechUnmute : t.speechMute}
            aria-label={isMuted ? t.speechUnmute : t.speechMute}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2
                className={`w-5 h-5 ${
                  isSpeaking ? 'animate-pulse text-[#0088A9]' : 'text-[#0088A9]'
                }`}
              />
            )}
          </button>

          {/* Vertical Divider */}
          <div className="w-[1px] h-6 bg-slate-200" />

          {/* 2. Play / Pause (▶️ / ⏸️) */}
          <button
            onClick={onPlayPause}
            className="p-1.5 sm:p-2 rounded-xl text-[#0088A9] hover:bg-[#0088A9]/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title={isSpeaking ? t.speechPause : t.speechPlay}
            aria-label={isSpeaking ? t.speechPause : t.speechPlay}
          >
            {isSpeaking ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
          </button>

          {/* 3. Rewind << (Previous section) */}
          <button
            onClick={onPrev}
            className="p-1.5 sm:p-2 rounded-xl text-[#0088A9] hover:bg-[#0088A9]/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title={t.speechPrev}
            aria-label={t.speechPrev}
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>

          {/* 4. Forward >> (Next section) */}
          <button
            onClick={onNext}
            className="p-1.5 sm:p-2 rounded-xl text-[#0088A9] hover:bg-[#0088A9]/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title={t.speechNext}
            aria-label={t.speechNext}
          >
            <ChevronsRight className="w-5 h-5" />
          </button>

          {/* Vertical Divider */}
          <div className="w-[1px] h-6 bg-slate-200" />

          {/* 5. Restart 🔄 (From beginning) */}
          <button
            onClick={onRestart}
            className="p-1.5 sm:p-2 rounded-xl text-[#0088A9] hover:bg-[#0088A9]/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title={t.speechRestart}
            aria-label={t.speechRestart}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Vertical Divider */}
          <div className="w-[1px] h-6 bg-slate-200" />

          {/* 6. Continuous / Hover-To-Read Mode 📑 (Notepad icon) */}
          <button
            onClick={onToggleContinuous}
            className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              continuousReading
                ? 'bg-[#0088A9] text-white shadow-md ring-2 ring-[#0088A9]/30'
                : 'text-[#0088A9] hover:bg-[#0088A9]/10'
            }`}
            title={`${t.continuousReadingTitle}: ${t.continuousReadingDesc}`}
            aria-label={t.continuousReadingTitle}
            aria-pressed={continuousReading}
          >
            <FileText className="w-5 h-5" />
          </button>

          {/* Vertical Divider */}
          <div className="w-[1px] h-6 bg-slate-200" />

          {/* 7. Settings Gear ⚙️ (Opens speech settings popup) */}
          <button
            onClick={onToggleSpeechSettings}
            className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              isSpeechSettingsOpen
                ? 'bg-[#0088A9] text-white shadow-md'
                : 'text-[#0088A9] hover:bg-[#0088A9]/10'
            }`}
            title={t.speechSettingsTitle}
            aria-label={t.speechSettingsTitle}
            aria-expanded={isSpeechSettingsOpen}
          >
            <Settings className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
