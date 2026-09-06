'use client';

import React, { useState, useRef } from 'react';
import { useFocusTrap } from '../useFocusTrap';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { A11Y_I18N } from '../i18n';

export type HideDuration = 'session' | '24h' | '1w' | '1m';

interface HideWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmHide: (duration: HideDuration) => void;
  t: typeof A11Y_I18N.he;
  currentDirection?: 'rtl' | 'ltr';
}

export const HideWidgetModal: React.FC<HideWidgetModalProps> = ({
  isOpen,
  onClose,
  onConfirmHide,
  t,
  currentDirection = 'rtl',
}) => {
  const [selectedDuration, setSelectedDuration] = useState<HideDuration>('session');

  const options: { id: HideDuration; label: string }[] = [
    { id: 'session', label: t.hideSession || 'להפעלה הנוכחית בכרטיסייה זו בלבד' },
    { id: '24h', label: t.hide24h || 'ל-24 שעות' },
    { id: '1w', label: t.hide1w || 'לשבוע' },
    { id: '1m', label: t.hide1m || 'לחודש' },
  ];
  const modalRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(modalRef, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="acc:fixed acc:inset-0 acc:z-[9999999] acc:flex acc:items-center acc:justify-center acc:p-4 acc:bg-black/60 acc:backdrop-blur-xs a11y-widget-root a11y-ignore acc:select-none"
          dir={currentDirection}
        >
          {/* Backdrop click to close */}
          <div className="acc:absolute acc:inset-0" onClick={onClose} aria-hidden="true" />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="acc:relative acc:w-full acc:max-w-[460px] acc:bg-white acc:rounded-2xl acc:shadow-2xl acc:border acc:border-slate-200 acc:overflow-hidden acc:z-10 acc:font-sans acc:text-slate-800"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hide-widget-title"
          >
            {/* Top Blue Header Banner */}
            <div className="acc:bg-[#085B7A] acc:text-white acc:px-5 acc:py-3.5 acc:flex acc:items-center acc:justify-between acc:shadow-xs">
              <h2 id="hide-widget-title" className="acc:text-base acc:sm:text-lg acc:font-bold">
                {t.hideWidgetTitle || "הסתר ווידג'ט נגישות"}
              </h2>
              <button
                onClick={onClose}
                className="acc:w-7 acc:h-7 acc:rounded-full acc:bg-white/10 acc:hover:bg-white/20 acc:flex acc:items-center acc:justify-center acc:text-white acc:transition-colors acc:cursor-pointer"
                aria-label={t.close}
              >
                <X className="acc:w-4 acc:h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="acc:p-6">
              <h3 className="acc:text-base acc:sm:text-lg acc:font-bold acc:text-slate-900 acc:mb-4">
                {t.hideDurationTitle || 'בחר לכמה זמן יוסתר הכפתור'}
              </h3>

              {/* Radio Options List */}
              <div className="acc:space-y-3 acc:mb-6">
                {options.map((option) => {
                  const isChecked = selectedDuration === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`acc:flex acc:items-center acc:gap-3 acc:p-2 acc:rounded-xl acc:cursor-pointer acc:transition-colors acc:focus-within:ring-2 acc:focus-within:ring-[#085B7A] ${
                        isChecked ? 'acc:bg-slate-50' : 'acc:hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Real radio input (keyboard + screen reader); the circle below is decoration */}
                      <input
                        type="radio"
                        name="a11y-hide-duration"
                        value={option.id}
                        checked={isChecked}
                        onChange={() => setSelectedDuration(option.id)}
                        className="acc:sr-only"
                      />
                      <div
                        aria-hidden="true"
                        className={`acc:w-5 acc:h-5 acc:rounded-full acc:border-2 acc:flex acc:items-center acc:justify-center acc:transition-all acc:shrink-0 ${
                          isChecked ? 'acc:border-[#085B7A] acc:bg-white' : 'acc:border-slate-400 acc:bg-white'
                        }`}
                      >
                        {isChecked && (
                          <div className="acc:w-2.5 acc:h-2.5 acc:rounded-full acc:bg-[#085B7A]" />
                        )}
                      </div>
                      <span className="acc:text-xs acc:sm:text-sm acc:font-semibold acc:text-slate-800">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Action Buttons: Cancel on Right, Confirm on Left in RTL */}
              <div className="acc:flex acc:items-center acc:justify-end acc:gap-3 acc:pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="acc:bg-slate-100 acc:hover:bg-slate-200 acc:text-slate-700 acc:font-bold acc:text-xs acc:sm:text-sm acc:py-2.5 acc:px-4 acc:rounded-lg acc:transition-colors acc:cursor-pointer"
                >
                  {t.close || 'ביטול'}
                </button>
                <button
                  onClick={() => onConfirmHide(selectedDuration)}
                  className="acc:bg-[#085B7A] acc:hover:bg-[#064961] acc:text-white acc:font-bold acc:text-xs acc:sm:text-sm acc:py-2.5 acc:px-6 acc:rounded-lg acc:transition-colors acc:shadow-sm acc:cursor-pointer acc:active:scale-95"
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
