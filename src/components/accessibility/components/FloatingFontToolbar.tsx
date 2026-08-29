'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Type, AlignJustify, MoveHorizontal, ArrowLeftRight } from 'lucide-react';
import { A11yState } from '../types';
import { A11Y_I18N } from '../i18n';

interface FloatingFontToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  fontAdjustmentMode: A11yState['fontAdjustmentMode'];
  onSelectMode: (mode: A11yState['fontAdjustmentMode']) => void;
  currentLevel: number;
  maxLevel: number;
  onStepperIncrease: () => void;
  onStepperDecrease: () => void;
  dockSide?: 'left' | 'right';
  t: typeof A11Y_I18N.he;
  isRtl: boolean;
}

export const FloatingFontToolbar: React.FC<FloatingFontToolbarProps> = ({
  isOpen,
  onClose,
  fontAdjustmentMode,
  onSelectMode,
  currentLevel,
  maxLevel,
  onStepperIncrease,
  onStepperDecrease,
  dockSide = 'left',
  t,
  isRtl,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 25, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`fixed bottom-6 ${
          dockSide === 'right' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
        } z-[99998] bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-[#085B7A]/25 p-3.5 sm:p-4 shadow-2xl w-[350px] sm:w-[440px] max-w-[calc(100vw-32px)] a11y-ignore select-none font-sans`}
        dir={isRtl ? 'rtl' : 'ltr'}
        role="region"
        aria-label={t.fontSectionTitle}
      >
        {/* Top Header with Close 'X' Button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#085B7A]/10 text-[#085B7A] flex items-center justify-center font-black">
              <Type className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-[#085B7A]">
              {t.fontSectionTitle}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close toolbar"
            title="סגור סרגל"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Mode Pills Row */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          <button
            onClick={() => onSelectMode('size')}
            className={`py-1.5 px-1 rounded-full text-[11px] sm:text-xs font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
              fontAdjustmentMode === 'size'
                ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
                : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
            }`}
          >
            {t.fontSize}
          </button>

          <button
            onClick={() => onSelectMode('line')}
            className={`py-1.5 px-1 rounded-full text-[11px] sm:text-xs font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
              fontAdjustmentMode === 'line'
                ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
                : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
            }`}
          >
            {t.lineHeight}
          </button>

          <button
            onClick={() => onSelectMode('word')}
            className={`py-1.5 px-1 rounded-full text-[11px] sm:text-xs font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
              fontAdjustmentMode === 'word'
                ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
                : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
            }`}
          >
            {t.wordSpacing}
          </button>

          <button
            onClick={() => onSelectMode('letter')}
            className={`py-1.5 px-1 rounded-full text-[11px] sm:text-xs font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
              fontAdjustmentMode === 'letter'
                ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
                : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
            }`}
          >
            {t.letterSpacing}
          </button>
        </div>

        {/* Range Slider with [-] and [+] Buttons */}
        <div
          className="relative h-9 sm:h-10 bg-slate-100/90 rounded-full flex items-center p-1 border border-slate-200 shadow-inner"
          dir="ltr"
        >
          <button
            onClick={onStepperDecrease}
            disabled={currentLevel <= 0}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#085B7A] text-white flex items-center justify-center font-black text-sm disabled:opacity-30 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 z-10"
            aria-label="Decrease level"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1 h-full mx-2 relative overflow-hidden rounded-full flex items-center bg-slate-200/70">
            <div
              className="h-full bg-[#085B7A] rounded-full transition-all duration-150 shadow-xs"
              style={{
                width: `${Math.max(6, (currentLevel / maxLevel) * 100)}%`,
              }}
            />
          </div>

          <button
            onClick={onStepperIncrease}
            disabled={currentLevel >= maxLevel}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#085B7A] text-white flex items-center justify-center font-black text-sm disabled:opacity-30 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 z-10"
            aria-label="Increase level"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
