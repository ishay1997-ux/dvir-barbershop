'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Type,
  Sun,
  Moon,
  Eye,
  Link as LinkIcon,
  MousePointer,
  RotateCcw,
  FileText,
  Sparkles,
  Heading,
} from 'lucide-react';
import Link from 'next/link';

interface A11ySettings {
  fontSize: 'normal' | 'md' | 'lg' | 'xl';
  contrast: 'normal' | 'dark' | 'light' | 'grayscale';
  readableFont: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  stopAnimations: boolean;
  bigCursor: boolean;
}

const defaultSettings: A11ySettings = {
  fontSize: 'normal',
  contrast: 'normal',
  readableFont: false,
  highlightLinks: false,
  highlightHeadings: false,
  stopAnimations: false,
  bigCursor: false,
};

const STORAGE_KEY = 'cutweb_a11y_settings_v1';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(defaultSettings);
  const [isClient, setIsClient] = useState(false);

  // Load saved settings
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Apply classes to <html>
  const applySettings = useCallback((s: A11ySettings) => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;

    // Font size
    html.classList.remove('a11y-font-sm', 'a11y-font-md', 'a11y-font-lg', 'a11y-font-xl');
    if (s.fontSize === 'md') html.classList.add('a11y-font-md');
    if (s.fontSize === 'lg') html.classList.add('a11y-font-lg');
    if (s.fontSize === 'xl') html.classList.add('a11y-font-xl');

    // Contrast
    html.classList.remove('a11y-contrast-dark', 'a11y-contrast-light', 'a11y-grayscale');
    if (s.contrast === 'dark') html.classList.add('a11y-contrast-dark');
    if (s.contrast === 'light') html.classList.add('a11y-contrast-light');
    if (s.contrast === 'grayscale') html.classList.add('a11y-grayscale');

    // Readable font
    html.classList.toggle('a11y-readable-font', s.readableFont);

    // Highlight links
    html.classList.toggle('a11y-highlight-links', s.highlightLinks);

    // Highlight headings
    html.classList.toggle('a11y-highlight-headings', s.highlightHeadings);

    // Stop animations
    html.classList.toggle('a11y-stop-animations', s.stopAnimations);

    // Big cursor
    html.classList.toggle('a11y-big-cursor', s.bigCursor);
  }, []);

  useEffect(() => {
    if (isClient) {
      applySettings(settings);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch {
        // Storage full/disabled
      }
    }
  }, [settings, isClient, applySettings]);

  // Keyboard shortcut: Alt+A to toggle, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const updateSetting = <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setSettings(defaultSettings);
  };

  const isModified =
    settings.fontSize !== 'normal' ||
    settings.contrast !== 'normal' ||
    settings.readableFont ||
    settings.highlightLinks ||
    settings.highlightHeadings ||
    settings.stopAnimations ||
    settings.bigCursor;

  if (!isClient) return null;

  return (
    <>
      {/* Floating Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[9999] w-14 h-14 rounded-full bg-[#1C1C1C] text-[#C9A84C] hover:text-white hover:bg-[#C9A84C] hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] border-2 border-[#C9A84C] shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 a11y-ignore group"
        aria-label="פתח סרגל נגישות (מקש קיצור: Alt + A)"
        aria-expanded={isOpen}
        id="a11y-trigger-btn"
      >
        {/* Universal Accessibility Symbol SVG */}
        <svg
          className="w-7 h-7 fill-current transition-transform group-hover:rotate-12"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
        </svg>
        {isModified && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
            title="הגדרות נגישות פעילות"
          />
        )}
      </button>

      {/* Accessibility Modal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-start p-0 sm:p-6 bg-black/60 backdrop-blur-sm a11y-ignore">
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full sm:w-[420px] max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5DDD0] text-[#1C1C1C] flex flex-col p-6 z-10"
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 id="a11y-title" className="text-lg font-black text-[#1C1C1C]">
                      התאמת נגישות
                    </h2>
                    <p className="text-xs text-[#6B6560]">תקן ישראלי 5568 · WCAG 2.1 AA</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-[#F0EBE1] text-[#6B6560] hover:text-[#1C1C1C] transition-colors"
                  aria-label="סגור חלון נגישות"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tools Grid */}
              <div className="flex flex-col gap-4">
                {/* Text Size */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <Type className="w-4 h-4 text-[#C9A84C]" /> גודל טקסט
                    </span>
                    <span className="text-xs text-[#6B6560] font-semibold">
                      {settings.fontSize === 'normal'
                        ? '100%'
                        : settings.fontSize === 'md'
                        ? '110%'
                        : settings.fontSize === 'lg'
                        ? '120%'
                        : '130%'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'normal', label: 'רגיל' },
                      { id: 'md', label: '110%' },
                      { id: 'lg', label: '120%' },
                      { id: 'xl', label: '130%' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() =>
                          updateSetting('fontSize', btn.id as A11ySettings['fontSize'])
                        }
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          settings.fontSize === btn.id
                            ? 'bg-[#C9A84C] text-[#1C1C1C] border-[#C9A84C] shadow-sm'
                            : 'bg-white text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                        }`}
                        aria-pressed={settings.fontSize === btn.id}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contrast Modes */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0]">
                  <span className="text-sm font-bold flex items-center gap-2 mb-3">
                    <Sun className="w-4 h-4 text-[#C9A84C]" /> ניגודיות וצבע
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        updateSetting(
                          'contrast',
                          settings.contrast === 'dark' ? 'normal' : 'dark'
                        )
                      }
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                        settings.contrast === 'dark'
                          ? 'bg-[#1C1C1C] text-yellow-300 border-yellow-400'
                          : 'bg-white text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                      }`}
                      aria-pressed={settings.contrast === 'dark'}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      ניגודיות כהה
                    </button>

                    <button
                      onClick={() =>
                        updateSetting(
                          'contrast',
                          settings.contrast === 'light' ? 'normal' : 'light'
                        )
                      }
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                        settings.contrast === 'light'
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                      }`}
                      aria-pressed={settings.contrast === 'light'}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      ניגודיות בהירה
                    </button>

                    <button
                      onClick={() =>
                        updateSetting(
                          'contrast',
                          settings.contrast === 'grayscale' ? 'normal' : 'grayscale'
                        )
                      }
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 col-span-2 transition-all border ${
                        settings.contrast === 'grayscale'
                          ? 'bg-zinc-700 text-white border-zinc-900'
                          : 'bg-white text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                      }`}
                      aria-pressed={settings.contrast === 'grayscale'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      גווני אפור (מונוכרום)
                    </button>
                  </div>
                </div>

                {/* Additional Toggles */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Highlight links */}
                  <button
                    onClick={() =>
                      updateSetting('highlightLinks', !settings.highlightLinks)
                    }
                    className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center text-center gap-2 transition-all border ${
                      settings.highlightLinks
                        ? 'bg-[#FEF08A] text-[#1C1C1C] border-yellow-500 shadow-sm'
                        : 'bg-[#FAF7F2] text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                    }`}
                    aria-pressed={settings.highlightLinks}
                  >
                    <LinkIcon className="w-4 h-4 text-[#C9A84C]" />
                    הדגשת קישורים
                  </button>

                  {/* Highlight headings */}
                  <button
                    onClick={() =>
                      updateSetting('highlightHeadings', !settings.highlightHeadings)
                    }
                    className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center text-center gap-2 transition-all border ${
                      settings.highlightHeadings
                        ? 'bg-[#C9A84C]/25 text-[#1C1C1C] border-[#C9A84C] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                    }`}
                    aria-pressed={settings.highlightHeadings}
                  >
                    <Heading className="w-4 h-4 text-[#C9A84C]" />
                    הדגשת כותרות
                  </button>

                  {/* Readable font */}
                  <button
                    onClick={() =>
                      updateSetting('readableFont', !settings.readableFont)
                    }
                    className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center text-center gap-2 transition-all border ${
                      settings.readableFont
                        ? 'bg-[#C9A84C] text-[#1C1C1C] border-[#C9A84C] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                    }`}
                    aria-pressed={settings.readableFont}
                  >
                    <Type className="w-4 h-4 text-[#C9A84C]" />
                    גופן קריא
                  </button>

                  {/* Stop animations */}
                  <button
                    onClick={() =>
                      updateSetting('stopAnimations', !settings.stopAnimations)
                    }
                    className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center text-center gap-2 transition-all border ${
                      settings.stopAnimations
                        ? 'bg-[#C9A84C] text-[#1C1C1C] border-[#C9A84C] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                    }`}
                    aria-pressed={settings.stopAnimations}
                  >
                    <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                    עצירת אנימציות
                  </button>

                  {/* Big cursor */}
                  <button
                    onClick={() =>
                      updateSetting('bigCursor', !settings.bigCursor)
                    }
                    className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center text-center gap-2 col-span-2 transition-all border ${
                      settings.bigCursor
                        ? 'bg-[#C9A84C] text-[#1C1C1C] border-[#C9A84C] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#3D3D3D] border-[#E5DDD0] hover:border-[#C9A84C]'
                    }`}
                    aria-pressed={settings.bigCursor}
                  >
                    <MousePointer className="w-4 h-4 text-[#C9A84C]" />
                    סמן עכבר מוגדל
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-[#F0EBE1] pt-4 mt-5 flex flex-col gap-2.5">
                {isModified && (
                  <button
                    onClick={resetAll}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    איפוס כל ההגדרות
                  </button>
                )}

                <Link
                  href="/accessibility"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5DDD0] text-[#1C1C1C] hover:border-[#C9A84C] hover:text-[#C9A84C] text-xs font-bold transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C9A84C]" />
                  הצהרת נגישות מפורטת (תקן 5568)
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
