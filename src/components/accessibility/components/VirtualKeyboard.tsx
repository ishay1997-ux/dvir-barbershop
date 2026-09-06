'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Delete } from 'lucide-react';
import { A11yState } from '../types';
import { A11Y_I18N, KEYBOARD_LAYOUTS } from '../i18n';

interface VirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  language: A11yState['language'];
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  t: typeof A11Y_I18N.he;
  currentDirection: 'rtl' | 'ltr';
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  isOpen,
  onClose,
  language,
  onKeyPress,
  onBackspace,
  t,
  currentDirection,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="acc:fixed acc:bottom-4 acc:inset-x-4 acc:max-w-2xl acc:mx-auto acc:z-[999999] acc:bg-[#1E293B] acc:text-white acc:p-3 acc:rounded-2xl acc:shadow-2xl acc:border-2 acc:border-cyan-500/40 acc:select-none a11y-widget-root a11y-ignore"
          dir={currentDirection}
        >
          <div className="acc:flex acc:items-center acc:justify-between acc:pb-2 acc:mb-2 acc:border-b acc:border-slate-700 acc:text-xs">
            <span className="acc:font-black acc:text-cyan-300 acc:flex acc:items-center acc:gap-1.5">
              {t.keyboardTitle}
            </span>
            <button
              onClick={onClose}
              className="acc:text-slate-400 acc:hover:text-white acc:p-1 acc:cursor-pointer"
              aria-label={t.close}
            >
              <X className="acc:w-4 acc:h-4" />
            </button>
          </div>

          <div className="acc:space-y-1.5">
            {(KEYBOARD_LAYOUTS[language] || KEYBOARD_LAYOUTS.he).map((row, rIdx) => (
              <div key={rIdx} className="acc:flex acc:justify-center acc:gap-1">
                {row.map((char) => (
                  <button
                    key={char}
                    onClick={() => onKeyPress(char)}
                    className="acc:flex-1 acc:min-w-[24px] acc:h-9 acc:sm:h-10 acc:bg-slate-800 acc:hover:bg-slate-700 acc:active:bg-cyan-600 acc:rounded-lg acc:text-sm acc:sm:text-base acc:font-bold acc:text-white acc:shadow-xs acc:border acc:border-slate-600 acc:transition-colors acc:cursor-pointer"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}

            <div className="acc:flex acc:gap-1.5 acc:pt-1">
              <button
                onClick={() => onKeyPress(' ')}
                className="acc:flex-1 acc:h-9 acc:bg-slate-800 acc:hover:bg-slate-700 acc:active:bg-cyan-600 acc:rounded-lg acc:text-xs acc:font-bold acc:text-white acc:shadow-xs acc:border acc:border-slate-600 acc:cursor-pointer"
              >
                {t.spaceKey}
              </button>
              <button
                onClick={onBackspace}
                className="acc:w-16 acc:h-9 acc:bg-red-950/60 acc:hover:bg-red-900 acc:border acc:border-red-500/40 acc:text-red-300 acc:rounded-lg acc:text-xs acc:font-bold acc:flex acc:items-center acc:justify-center acc:cursor-pointer"
                aria-label={t.backspaceKey}
              >
                <Delete className="acc:w-4 acc:h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
