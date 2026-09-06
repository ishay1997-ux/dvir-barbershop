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
        className={`acc:fixed acc:bottom-6 ${
          dockSide === 'right' ? 'acc:left-4 acc:sm:left-6' : 'acc:right-4 acc:sm:right-6'
        } acc:z-[99998] acc:bg-white/95 acc:backdrop-blur-md acc:rounded-2xl acc:sm:rounded-3xl acc:border-2 acc:border-[#085B7A]/25 acc:p-3.5 acc:sm:p-4 acc:shadow-2xl acc:w-[350px] acc:sm:w-[440px] acc:max-w-[calc(100vw-32px)] a11y-widget-root a11y-ignore acc:select-none acc:font-sans`}
        dir={isRtl ? 'rtl' : 'ltr'}
        role="region"
        aria-label={t.fontSectionTitle}
      >
        {/* Top Header with Close 'X' Button */}
        <div className="acc:flex acc:items-center acc:justify-between acc:mb-3">
          <div className="acc:flex acc:items-center acc:gap-2">
            <div className="acc:w-7 acc:h-7 acc:rounded-full acc:bg-[#085B7A]/10 acc:text-[#085B7A] acc:flex acc:items-center acc:justify-center acc:font-black">
              <Type className="acc:w-4 acc:h-4" />
            </div>
            <span className="acc:font-bold acc:text-xs acc:sm:text-sm acc:text-[#085B7A]">
              {t.fontSectionTitle}
            </span>
          </div>

          <button
            onClick={onClose}
            className="acc:w-7 acc:h-7 acc:rounded-full acc:bg-slate-100 acc:hover:bg-slate-200 acc:text-slate-600 acc:hover:text-slate-900 acc:flex acc:items-center acc:justify-center acc:transition-colors acc:cursor-pointer"
            aria-label="Close toolbar"
            title="סגור סרגל"
          >
            <X className="acc:w-4 acc:h-4" />
          </button>
        </div>

        {/* 4 Mode Pills Row */}
        <div className="acc:grid acc:grid-cols-4 acc:gap-1.5 acc:mb-3">
          <button
            onClick={() => onSelectMode('size')}
            className={`acc:py-1.5 acc:px-1 acc:rounded-full acc:text-[11px] acc:sm:text-xs acc:font-bold acc:transition-all acc:border acc:text-center acc:cursor-pointer acc:whitespace-nowrap ${
              fontAdjustmentMode === 'size'
                ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs acc:font-black'
                : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
            }`}
          >
            {t.fontSize}
          </button>

          <button
            onClick={() => onSelectMode('line')}
            className={`acc:py-1.5 acc:px-1 acc:rounded-full acc:text-[11px] acc:sm:text-xs acc:font-bold acc:transition-all acc:border acc:text-center acc:cursor-pointer acc:whitespace-nowrap ${
              fontAdjustmentMode === 'line'
                ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs acc:font-black'
                : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
            }`}
          >
            {t.lineHeight}
          </button>

          <button
            onClick={() => onSelectMode('word')}
            className={`acc:py-1.5 acc:px-1 acc:rounded-full acc:text-[11px] acc:sm:text-xs acc:font-bold acc:transition-all acc:border acc:text-center acc:cursor-pointer acc:whitespace-nowrap ${
              fontAdjustmentMode === 'word'
                ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs acc:font-black'
                : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
            }`}
          >
            {t.wordSpacing}
          </button>

          <button
            onClick={() => onSelectMode('letter')}
            className={`acc:py-1.5 acc:px-1 acc:rounded-full acc:text-[11px] acc:sm:text-xs acc:font-bold acc:transition-all acc:border acc:text-center acc:cursor-pointer acc:whitespace-nowrap ${
              fontAdjustmentMode === 'letter'
                ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs acc:font-black'
                : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
            }`}
          >
            {t.letterSpacing}
          </button>
        </div>

        {/* Range Slider with [-] and [+] Buttons */}
        <div
          className="acc:relative acc:h-9 acc:sm:h-10 acc:bg-slate-100/90 acc:rounded-full acc:flex acc:items-center acc:p-1 acc:border acc:border-slate-200 acc:shadow-inner"
          dir="ltr"
        >
          <button
            onClick={onStepperDecrease}
            disabled={currentLevel <= 0}
            className="acc:w-7 acc:h-7 acc:sm:w-8 acc:sm:h-8 acc:rounded-full acc:bg-[#085B7A] acc:text-white acc:flex acc:items-center acc:justify-center acc:font-black acc:text-sm acc:disabled:opacity-30 acc:hover:bg-[#064961] acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:shadow-xs acc:shrink-0 acc:z-10"
            aria-label="Decrease level"
          >
            <Minus className="acc:w-3.5 acc:h-3.5" />
          </button>

          <div className="acc:flex-1 acc:h-full acc:mx-2 acc:relative acc:overflow-hidden acc:rounded-full acc:flex acc:items-center acc:bg-slate-200/70">
            <div
              className="acc:h-full acc:bg-[#085B7A] acc:rounded-full acc:transition-all acc:duration-150 acc:shadow-xs"
              style={{
                width: `${Math.max(6, (currentLevel / maxLevel) * 100)}%`,
              }}
            />
          </div>

          <button
            onClick={onStepperIncrease}
            disabled={currentLevel >= maxLevel}
            className="acc:w-7 acc:h-7 acc:sm:w-8 acc:sm:h-8 acc:rounded-full acc:bg-[#085B7A] acc:text-white acc:flex acc:items-center acc:justify-center acc:font-black acc:text-sm acc:disabled:opacity-30 acc:hover:bg-[#064961] acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:shadow-xs acc:shrink-0 acc:z-10"
            aria-label="Increase level"
          >
            <Plus className="acc:w-3.5 acc:h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
