'use client';

import React from 'react';
import { MousePointer } from 'lucide-react';
import { A11yState } from '../types';
import { A11Y_I18N } from '../i18n';

interface MouseCursorCardProps {
  cursorMode: A11yState['cursorMode'];
  bigCursor: boolean;
  onToggleCursor: (mode: 'white' | 'black') => void;
  t: typeof A11Y_I18N.he;
  currentDirection: 'rtl' | 'ltr';
}

export const MouseCursorCard: React.FC<MouseCursorCardProps> = ({
  cursorMode,
  bigCursor,
  onToggleCursor,
  t,
  currentDirection,
}) => {
  return (
    <div className="acc:bg-white acc:rounded-2xl acc:border acc:border-slate-200 acc:p-4 acc:sm:p-4.5 acc:shadow-xs">
      <div className="acc:flex acc:items-center acc:justify-between acc:mb-3" dir={currentDirection}>
        <div className="acc:text-start">
          <h3 className="acc:font-bold acc:text-sm acc:sm:text-base acc:text-[#085B7A] acc:leading-snug">
            {t.cursorSectionTitle}
          </h3>
          <p className="acc:text-xs acc:sm:text-[13px] acc:text-[#085B7A]/80 acc:font-medium acc:leading-snug">
            {t.cursorSectionDesc}
          </p>
        </div>
        <div className="acc:text-[#085B7A] acc:shrink-0">
          <MousePointer className="acc:w-5 acc:h-5 acc:sm:w-6 acc:sm:h-6" />
        </div>
      </div>

      {/* 2 Pills: לבן / שחור */}
      <div className="acc:grid acc:grid-cols-2 acc:gap-2.5" dir={currentDirection}>
        <button
          onClick={() => onToggleCursor('black')}
          className={`acc:py-2 acc:px-3 acc:rounded-full acc:text-xs acc:sm:text-[13px] acc:font-bold acc:transition-all acc:border acc:cursor-pointer acc:text-center ${
            cursorMode === 'black' || (bigCursor && cursorMode !== 'white')
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={cursorMode === 'black'}
        >
          {t.cursorBlack}
        </button>

        <button
          onClick={() => onToggleCursor('white')}
          className={`acc:py-2 acc:px-3 acc:rounded-full acc:text-xs acc:sm:text-[13px] acc:font-bold acc:transition-all acc:border acc:cursor-pointer acc:text-center ${
            cursorMode === 'white'
              ? 'acc:bg-[#085B7A] acc:text-white acc:border-[#085B7A] acc:shadow-xs'
              : 'acc:bg-white acc:text-[#085B7A] acc:border-[#085B7A]/35 acc:hover:border-[#085B7A] acc:hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={cursorMode === 'white'}
        >
          {t.cursorWhite}
        </button>
      </div>
    </div>
  );
};
