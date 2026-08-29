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
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-4.5 shadow-xs">
      <div className="flex items-center justify-between mb-3" dir={currentDirection}>
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h3 className="font-bold text-sm sm:text-base text-[#085B7A] leading-snug">
            {t.cursorSectionTitle}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#085B7A]/80 font-medium leading-snug">
            {t.cursorSectionDesc}
          </p>
        </div>
        <div className="text-[#085B7A] shrink-0">
          <MousePointer className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* 2 Pills: לבן / שחור */}
      <div className="grid grid-cols-2 gap-2.5" dir={currentDirection}>
        <button
          onClick={() => onToggleCursor('black')}
          className={`py-2 px-3 rounded-full text-xs sm:text-[13px] font-bold transition-all border cursor-pointer text-center ${
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
          className={`py-2 px-3 rounded-full text-xs sm:text-[13px] font-bold transition-all border cursor-pointer text-center ${
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
