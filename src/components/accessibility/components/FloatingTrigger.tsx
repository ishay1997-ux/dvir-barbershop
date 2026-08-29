'use client';

import React from 'react';
import { Move } from 'lucide-react';
import { A11Y_I18N } from '../i18n';

interface FloatingTriggerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  dockSide: 'left' | 'right';
  isHiddenTemporarily: boolean;
  isModified: boolean;
  t: typeof A11Y_I18N.he;
  currentDirection: 'rtl' | 'ltr';
}

export const FloatingTrigger: React.FC<FloatingTriggerProps> = ({
  isOpen,
  setIsOpen,
  dockSide,
  isHiddenTemporarily,
  isModified,
  t,
  currentDirection,
}) => {
  if (isHiddenTemporarily) return null;

  return (
    <button
      onClick={() => setIsOpen((prev) => !prev)}
      className={`fixed bottom-6 ${
        dockSide === 'right' ? 'right-6' : 'left-6'
      } z-[9999] h-13 w-13 hover:w-auto bg-[#085B7A] text-white hover:bg-[#064961] shadow-2xl border-2 border-white/40 rounded-full hover:rounded-2xl flex items-center justify-center hover:justify-start gap-2.5 p-2.5 hover:px-4 transition-all duration-300 transform hover:scale-105 active:scale-95 a11y-ignore group cursor-pointer overflow-hidden`}
      aria-label={`${t.title} (Alt + A)`}
      aria-expanded={isOpen}
      id="a11y-trigger-btn"
      dir={currentDirection}
    >
      {/* Universal Accessibility Icon + 4 Directional Arrows on hover */}
      <div className="flex flex-col items-center justify-center text-white shrink-0 group-hover:border-l group-hover:border-white/20 group-hover:pl-2">
        <Move className="w-3.5 h-3.5 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:block -mb-0.5" />
        <svg
          className="w-7 h-7 fill-current text-white transition-transform group-hover:scale-90"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
        </svg>
      </div>

      {/* Text that only shows smoothly on hover */}
      <div className="text-right hidden group-hover:block whitespace-nowrap animate-fadeIn">
        <span className="block text-xs font-black text-white leading-tight">
          {t.triggerBtn}
        </span>
        <span className="block text-[11px] font-bold text-cyan-300 leading-tight">
          {t.triggerA11y}
        </span>
      </div>

      {/* Active State Red Badge matching reference */}
      {isModified && (
        <span
          className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 text-white font-black text-[10px] rounded-full border-2 border-white flex items-center justify-center shadow-md animate-pulse"
          title={t.activeSettingsBadge}
        >
          ✕
        </span>
      )}
    </button>
  );
};
