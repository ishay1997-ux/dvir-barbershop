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
      className={`acc:fixed acc:bottom-6 ${
        dockSide === 'right' ? 'acc:right-6' : 'acc:left-6'
      } acc:z-[9999] acc:h-13 acc:w-13 acc:hover:w-auto acc:bg-[#085B7A] acc:text-white acc:hover:bg-[#064961] acc:shadow-2xl acc:border-2 acc:border-white/40 acc:rounded-full acc:hover:rounded-2xl acc:flex acc:items-center acc:justify-center acc:hover:justify-start acc:gap-2.5 acc:p-2.5 acc:hover:px-4 acc:transition-all acc:duration-300 acc:transform acc:hover:scale-105 acc:active:scale-95 a11y-widget-root a11y-ignore acc:group acc:cursor-pointer acc:overflow-hidden`}
      aria-label={`${t.title} (Alt + A)`}
      aria-expanded={isOpen}
      id="a11y-trigger-btn"
      dir={currentDirection}
    >
      {/* Universal Accessibility Icon + 4 Directional Arrows on hover */}
      <div className="acc:flex acc:flex-col acc:items-center acc:justify-center acc:text-white acc:shrink-0 acc:group-hover:border-l acc:group-hover:border-white/20 acc:group-hover:pl-2">
        <Move className="acc:w-3.5 acc:h-3.5 acc:text-cyan-300 acc:opacity-0 acc:group-hover:opacity-100 acc:transition-opacity acc:hidden acc:group-hover:block acc:-mb-0.5" />
        <svg
          className="acc:w-7 acc:h-7 acc:fill-current acc:text-white acc:transition-transform acc:group-hover:scale-90"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
        </svg>
      </div>

      {/* Text that only shows smoothly on hover */}
      <div className="acc:text-start acc:hidden acc:group-hover:block acc:whitespace-nowrap animate-a11y-fadeIn">
        <span className="acc:block acc:text-xs acc:font-black acc:text-white acc:leading-tight">
          {t.triggerBtn}
        </span>
        <span className="acc:block acc:text-[11px] acc:font-bold acc:text-cyan-300 acc:leading-tight">
          {t.triggerA11y}
        </span>
      </div>

      {/* Active State Red Badge matching reference */}
      {isModified && (
        <span
          className="acc:absolute acc:-top-0.5 acc:-right-0.5 acc:w-5 acc:h-5 acc:bg-red-600 acc:text-white acc:font-black acc:text-[10px] acc:rounded-full acc:border-2 acc:border-white acc:flex acc:items-center acc:justify-center acc:shadow-md acc:animate-pulse"
          title={t.activeSettingsBadge}
        >
          ✕
        </span>
      )}
    </button>
  );
};
