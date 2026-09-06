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
    <div className="acc:bg-[#085B7A] acc:text-white acc:p-4 acc:pt-3.5 acc:rounded-none acc:sm:rounded-t-3xl acc:relative acc:shadow-md">
      {/* Top Controls Row (Close X, Language Dropdown, Actions) */}
      <div className="acc:flex acc:items-center acc:justify-between acc:gap-2.5">
        {/* Close button X */}
        <button
          onClick={onClose}
          className="acc:w-8 acc:h-8 acc:rounded-full acc:bg-white/10 acc:hover:bg-white/20 acc:flex acc:items-center acc:justify-center acc:transition-colors acc:text-white acc:cursor-pointer"
          aria-label={t.close}
        >
          <X className="acc:w-5 acc:h-5" />
        </button>

        {/* Language Selector Dropdown */}
        <div className="acc:relative acc:flex-1 acc:max-w-[190px]">
          <button
            onClick={() => setIsLanguageOpen((prev) => !prev)}
            className="acc:w-full acc:flex acc:items-center acc:justify-between acc:bg-white/15 acc:hover:bg-white/25 acc:border acc:border-white/25 acc:rounded-xl acc:px-3 acc:py-1.5 acc:text-xs acc:font-bold acc:text-white acc:transition-colors acc:cursor-pointer"
            aria-expanded={isLanguageOpen}
            aria-label={t.selectLanguage}
          >
            <span className="acc:flex acc:items-center acc:gap-1.5 acc:truncate">
              <span>{LANGUAGES.find((l) => l.code === language)?.flag}</span>
              <span>{LANGUAGES.find((l) => l.code === language)?.name}</span>
            </span>
            <ChevronDown className="acc:w-3.5 acc:h-3.5 acc:flex-shrink-0" />
          </button>

          {isLanguageOpen && (
            <div className="acc:absolute acc:top-full acc:left-0 acc:right-0 acc:mt-1 acc:bg-white acc:text-[#1C1C1C] acc:rounded-xl acc:shadow-xl acc:border acc:border-slate-200 acc:overflow-hidden acc:z-30 acc:py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code as A11yState['language']);
                    setIsLanguageOpen(false);
                  }}
                  className={`acc:w-full acc:flex acc:items-center acc:gap-2.5 acc:px-3.5 acc:py-2 acc:text-xs acc:font-bold acc:hover:bg-slate-100 acc:transition-colors acc:cursor-pointer ${
                    language === lang.code ? 'acc:text-[#085B7A] acc:bg-[#085B7A]/10 acc:font-black' : 'acc:text-[#3D3D3D]'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <Check className={`acc:w-3.5 acc:h-3.5 ${isRtl ? 'acc:mr-auto' : 'acc:ml-auto'} acc:text-[#085B7A]`} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions: Hide Widget & Toggle Left/Right Side */}
        <div className="acc:flex acc:items-center acc:gap-1.5">
          {/* Hide button */}
          <button
            onClick={onHideWidget}
            className="acc:w-8 acc:h-8 acc:rounded-full acc:bg-white/10 acc:hover:bg-white/20 acc:flex acc:items-center acc:justify-center acc:transition-colors acc:text-white acc:cursor-pointer"
            title={t.hideWidget}
            aria-label={t.hideWidget}
          >
            <EyeOff className="acc:w-4 acc:h-4" />
          </button>

          {/* Switch Left / Right Dock Side */}
          <button
            onClick={onToggleDockSide}
            className="acc:w-8 acc:h-8 acc:rounded-full acc:bg-white/10 acc:hover:bg-white/20 acc:flex acc:items-center acc:justify-center acc:transition-colors acc:text-white acc:cursor-pointer"
            title="החלף צד תפריט (שמאל / ימין)"
            aria-label="החלף צד תפריט"
          >
            <ArrowLeftRight className="acc:w-4 acc:h-4" />
          </button>
        </div>
      </div>

      {/* Centered Outline Pill: "נגישות" */}
      <div className="acc:flex acc:justify-center acc:mt-3 acc:pb-1">
        <h2 id="a11y-main-title" className="acc:px-8 acc:py-1 acc:rounded-full acc:border acc:border-white/70 acc:text-white acc:font-black acc:text-xs acc:tracking-wider acc:shadow-xs acc:m-0">
          {t.title}
        </h2>
      </div>
    </div>
  );
};
