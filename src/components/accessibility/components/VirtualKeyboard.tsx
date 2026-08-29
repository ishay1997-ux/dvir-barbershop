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
          className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-[999999] bg-[#1E293B] text-white p-3 rounded-2xl shadow-2xl border-2 border-cyan-500/40 select-none a11y-ignore"
          dir={currentDirection}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 text-xs">
            <span className="font-black text-cyan-300 flex items-center gap-1.5">
              {t.keyboardTitle}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {(KEYBOARD_LAYOUTS[language] || KEYBOARD_LAYOUTS.he).map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1">
                {row.map((char) => (
                  <button
                    key={char}
                    onClick={() => onKeyPress(char)}
                    className="flex-1 min-w-[24px] h-9 sm:h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-sm sm:text-base font-bold text-white shadow-xs border border-slate-600 transition-colors cursor-pointer"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}

            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => onKeyPress(' ')}
                className="flex-1 h-9 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-xs font-bold text-white shadow-xs border border-slate-600 cursor-pointer"
              >
                {t.spaceKey}
              </button>
              <button
                onClick={onBackspace}
                className="w-16 h-9 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                aria-label={t.backspaceKey}
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
