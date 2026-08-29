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
        className={`w-full p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
          stopAnimations
            ? 'border-[#085B7A] bg-[#085B7A]/10 text-[#085B7A] font-black'
            : 'border-slate-200 bg-white text-[#3D3D3D] hover:border-[#085B7A]'
        }`}
        aria-pressed={stopAnimations}
      >
        <Sparkles className="w-4 h-4 text-[#085B7A]" />
        {t.stopAnimations}
      </button>
    </div>
  );
};
