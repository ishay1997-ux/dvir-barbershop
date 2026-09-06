'use client';

import React from 'react';
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
    <div className="acc:bg-[#085B7A] acc:text-white acc:p-3.5 acc:space-y-2 acc:mt-auto acc:rounded-none acc:sm:rounded-b-3xl">
      <button
        onClick={onResetAll}
        className="acc:w-full acc:py-2.5 acc:rounded-xl acc:bg-white/15 acc:hover:bg-white/25 acc:border acc:border-white/30 acc:text-white acc:text-xs acc:font-black acc:transition-colors acc:shadow-xs acc:cursor-pointer acc:flex acc:items-center acc:justify-center acc:gap-1.5"
      >
        <RotateCcw className="acc:w-3.5 acc:h-3.5" />
        {t.resetAll}
      </button>

      <div className="acc:flex acc:items-center acc:justify-between acc:text-[11px] acc:text-white/80 acc:pt-1">
        <a
          href={statementUrl}
          onClick={onClose}
          className="acc:hover:underline acc:font-bold acc:text-white"
        >
          {t.statementLink}
        </a>

        <span className="acc:opacity-70 acc:text-[10px]">{t.standardBadge}</span>
      </div>
    </div>
  );
};
