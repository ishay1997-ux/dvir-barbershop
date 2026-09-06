'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { A11Y_I18N } from '../i18n';

interface StopAnimationsCardProps {
  stopAnimations: boolean;
  onToggleStopAnimations: () => void;
  t: typeof A11Y_I18N.he;
}

export const StopAnimationsCard: React.FC<StopAnimationsCardProps> = ({
  stopAnimations,
  onToggleStopAnimations,
  t,
}) => {
  return (
    <div>
      <button
        onClick={onToggleStopAnimations}
        className={`acc:w-full acc:p-2.5 acc:rounded-2xl acc:border acc:text-xs acc:font-bold acc:flex acc:items-center acc:justify-center acc:gap-2 acc:transition-all acc:cursor-pointer ${
          stopAnimations
            ? 'acc:border-[#085B7A] acc:bg-[#085B7A]/10 acc:text-[#085B7A] acc:font-black'
            : 'acc:border-slate-200 acc:bg-white acc:text-[#3D3D3D] acc:hover:border-[#085B7A]'
        }`}
        aria-pressed={stopAnimations}
      >
        <Sparkles className="acc:w-4 acc:h-4 acc:text-[#085B7A]" />
        {t.stopAnimations}
      </button>
    </div>
  );
};
