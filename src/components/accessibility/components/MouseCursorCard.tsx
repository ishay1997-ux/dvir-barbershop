'use client';

import React from 'react';
import { A11yState } from '../types';
import { A11Y_I18N } from '../i18n';

interface MouseCursorCardProps {
  cursorMode: A11yState['cursorMode'];
  bigCursor: boolean;
  onToggleCursor: (mode: 'white' | 'black') => void;
  t: typeof A11Y_I18N.he;
  currentDirection: 'rtl' | 'ltr';
  isRtl: boolean;
}

export const MouseCursorCard: React.FC<MouseCursorCardProps> = ({
  cursorMode,
  bigCursor,
  onToggleCursor,
  t,
  currentDirection,
  isRtl,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
      <div className="flex items-center justify-between mb-3" dir={currentDirection}>
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h3 className="font-bold text-sm text-[#085B7A] leading-snug">
            {t.cursorSectionTitle}
          </h3>
          <p className="text-xs text-[#085B7A]/80 font-medium leading-snug">
            {t.cursorSectionDesc}
          </p>
        </div>
        <div className="text-[#085B7A] shrink-0">
          <svg
            className="w-6 h-6 fill-none stroke-current stroke-2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
        </div>
      </div>

      {/* 2 Pills: לבן / שחור */}
      <div className="grid grid-cols-2 gap-2.5" dir={currentDirection}>
        <button
          onClick={() => onToggleCursor('black')}
          className={`py-2 px-3 rounded-full text-xs font-bold transition-all border cursor-pointer text-center ${
            cursorMode === 'black' || (bigCursor && cursorMode !== 'white')
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={cursorMode === 'black'}
        >
          {t.cursorBlack}
        </button>

        <button
          onClick={() => onToggleCursor('white')}
          className={`py-2 px-3 rounded-full text-xs font-bold transition-all border cursor-pointer text-center ${
            cursorMode === 'white'
              ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
              : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
          }`}
          aria-pressed={cursorMode === 'white'}
        >
          {t.cursorWhite}
        </button>
      </div>
    </div>
  );
};
