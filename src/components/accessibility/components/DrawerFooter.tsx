'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { A11Y_I18N } from '../i18n';

interface DrawerFooterProps {
  onResetAll: () => void;
  onClose: () => void;
  statementUrl?: string;
  t: typeof A11Y_I18N.he;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
  onResetAll,
  onClose,
  statementUrl = '/accessibility',
  t,
}) => {
  return (
    <div className="bg-[#085B7A] text-white p-3.5 space-y-2 mt-auto rounded-none sm:rounded-b-3xl">
      <button
        onClick={onResetAll}
        className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-black transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {t.resetAll}
      </button>

      <div className="flex items-center justify-between text-[11px] text-white/80 pt-1">
        <Link
          href={statementUrl}
          onClick={onClose}
          className="hover:underline font-bold text-white"
        >
          {t.statementLink}
        </Link>

        <span className="opacity-70 text-[10px]">{t.standardBadge}</span>
      </div>
    </div>
  );
};
