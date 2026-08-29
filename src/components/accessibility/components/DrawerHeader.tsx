'use client';

import React from 'react';
import { X, ChevronDown, Check, EyeOff, ArrowLeftRight } from 'lucide-react';
import { LANGUAGES, A11yState } from '../types';
import { A11Y_I18N } from '../i18n';

interface DrawerHeaderProps {
  onClose: () => void;
  isLanguageOpen: boolean;
  setIsLanguageOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  language: A11yState['language'];
  onSelectLanguage: (lang: A11yState['language']) => void;
  onHideWidget: () => void;
  onToggleDockSide: () => void;
  t: typeof A11Y_I18N.he;
  isRtl: boolean;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  onClose,
  isLanguageOpen,
  setIsLanguageOpen,
  language,
  onSelectLanguage,
  onHideWidget,
  onToggleDockSide,
  t,
  isRtl,
}) => {
  return (
    <div className="bg-[#085B7A] text-white p-4 pt-3.5 rounded-none sm:rounded-t-3xl relative shadow-md">
      {/* Top Controls Row (Close X, Language Dropdown, Actions) */}
      <div className="flex items-center justify-between gap-2.5">
        {/* Close button X */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative flex-1 max-w-[190px]">
          <button
            onClick={() => setIsLanguageOpen((prev) => !prev)}
            className="w-full flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
            aria-expanded={isLanguageOpen}
            aria-label={t.selectLanguage}
          >
            <span className="flex items-center gap-1.5 truncate">
              <span>{LANGUAGES.find((l) => l.code === language)?.flag}</span>
              <span>{LANGUAGES.find((l) => l.code === language)?.name}</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
          </button>

          {isLanguageOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#1C1C1C] rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code as A11yState['language']);
                    setIsLanguageOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer ${
                    language === lang.code ? 'text-[#085B7A] bg-[#085B7A]/10 font-black' : 'text-[#3D3D3D]'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <Check className={`w-3.5 h-3.5 ${isRtl ? 'mr-auto' : 'ml-auto'} text-[#085B7A]`} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions: Hide Widget & Toggle Left/Right Side */}
        <div className="flex items-center gap-1.5">
          {/* Hide button */}
          <button
            onClick={onHideWidget}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
            title={t.hideWidget}
            aria-label={t.hideWidget}
          >
            <EyeOff className="w-4 h-4" />
          </button>

          {/* Switch Left / Right Dock Side */}
          <button
            onClick={onToggleDockSide}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
            title="החלף צד תפריט (שמאל / ימין)"
            aria-label="החלף צד תפריט"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Centered Outline Pill: "נגישות" */}
      <div className="flex justify-center mt-3 pb-1">
        <div className="px-8 py-1 rounded-full border border-white/70 text-white font-black text-xs tracking-wider shadow-xs">
          {t.title}
        </div>
      </div>
    </div>
  );
};
