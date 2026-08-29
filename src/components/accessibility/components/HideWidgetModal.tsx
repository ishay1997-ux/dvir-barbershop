'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, EyeOff } from 'lucide-react';
import { A11Y_I18N } from '../i18n';

export type HideDuration = 'session' | '24h' | '1w' | '1m';

interface HideWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmHide: (duration: HideDuration) => void;
  t: typeof A11Y_I18N.he;
  currentDirection?: 'rtl' | 'ltr';
  isRtl?: boolean;
}

export const HideWidgetModal: React.FC<HideWidgetModalProps> = ({
  isOpen,
  onClose,
  onConfirmHide,
  t,
  currentDirection = 'rtl',
  isRtl = true,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<HideDuration>('session');

  const options: { id: HideDuration; label: string }[] = [
    { id: 'session', label: t.hideSession || 'להפעלה הנוכחית בכרטיסייה זו בלבד' },
    { id: '24h', label: t.hide24h || 'ל-24 שעות' },
    { id: '1w', label: t.hide1w || 'לשבוע' },
    { id: '1m', label: t.hide1m || 'לחודש' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs a11y-ignore select-none"
          dir={currentDirection}
        >
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-[460px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 font-sans text-slate-800"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hide-widget-title"
          >
            {/* Top Blue Header Banner */}
            <div className="bg-[#085B7A] text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
              <h2 id="hide-widget-title" className="text-base sm:text-lg font-bold">
                {t.hideWidgetTitle || "הסתר ווידג'ט נגישות"}
              </h2>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
                {t.hideDurationTitle || 'בחר לכמה זמן יוסתר הכפתור'}
              </h3>

              {/* Radio Options List */}
              <div className="space-y-3 mb-6">
                {options.map((option) => {
                  const isChecked = selectedDuration === option.id;
                  return (
                    <label
                      key={option.id}
                      onClick={() => setSelectedDuration(option.id)}
                      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                        isChecked ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Custom Stylized Radio Circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                          isChecked ? 'border-[#085B7A] bg-white' : 'border-slate-400 bg-white'
                        }`}
                      >
                        {isChecked && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#085B7A]" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Action Buttons: Cancel on Right, Confirm on Left in RTL */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  {t.close || 'ביטול'}
                </button>
                <button
                  onClick={() => onConfirmHide(selectedDuration)}
                  className="bg-[#085B7A] hover:bg-[#064961] text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-lg transition-colors shadow-sm cursor-pointer active:scale-95"
                >
                  {t.hideConfirmBtn || 'אשר והסר את כפתור הנגישות'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
