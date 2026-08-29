'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  VolumeX,
  Keyboard,
  Sun,
  Moon,
  Eye,
  Contrast,
  Type,
  ZoomIn,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading,
  Printer,
  MousePointer,
  RotateCcw,
  Sparkles,
  ChevronDown,
  EyeOff,
  Sliders,
  Check,
  Search,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

interface A11yState {
  // Font Adjustments
  fontScaleLevel: number; // 0..5 (100% to 150%)
  wordSpacingLevel: number; // 0..4 (0 to 8px)
  lineHeightLevel: number; // 0..4 (1.5 to 2.3)
  letterSpacingLevel: number; // 0..3 (0 to 3px)
  fontAdjustmentMode: 'size' | 'word' | 'line' | 'letter';

  // Contrast & Filters
  contrastMode: 'normal' | 'light' | 'dark' | 'grayscale' | 'invert';

  // Color Spectrum Customization
  colorTarget: 'background' | 'headings' | 'text';
  customBgHue: number | null; // 0..360
  customHeadingHue: number | null;
  customTextHue: number | null;

  // Toggle Features
  readableFont: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  screenZoom: boolean;
  stopAnimations: boolean;
  bigCursor: boolean;
  keyboardNav: boolean;
  imageAltTooltips: boolean;

  // Language
  language: 'he' | 'en' | 'ar' | 'ru';
}

const defaultState: A11yState = {
  fontScaleLevel: 0,
  wordSpacingLevel: 0,
  lineHeightLevel: 0,
  letterSpacingLevel: 0,
  fontAdjustmentMode: 'size',

  contrastMode: 'normal',

  colorTarget: 'background',
  customBgHue: null,
  customHeadingHue: null,
  customTextHue: null,

  readableFont: false,
  highlightLinks: false,
  highlightHeadings: false,
  screenZoom: false,
  stopAnimations: false,
  bigCursor: false,
  keyboardNav: false,
  imageAltTooltips: false,

  language: 'he',
};

const STORAGE_KEY = 'thecut_a11y_v3_state';

const LANGUAGES = [
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
] as const;

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<A11yState>(defaultState);
  const [isClient, setIsClient] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [isHiddenTemporarily, setIsHiddenTemporarily] = useState(false);
  const colorSliderRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Apply classes & CSS variables to <html>
  const applySettingsToDOM = useCallback((s: A11yState) => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;

    // 1. Font Size Scaling
    const fontScales = [1, 1.1, 1.2, 1.3, 1.4, 1.5];
    const currentScale = fontScales[s.fontScaleLevel] || 1;
    html.style.setProperty('--a11y-font-scale', currentScale.toString());
    html.classList.toggle('a11y-scaled', s.fontScaleLevel > 0);

    // 2. Line Height
    const lineHeights = [1.5, 1.7, 1.9, 2.1, 2.3];
    const currentLineHeight = lineHeights[s.lineHeightLevel] || 1.5;
    html.style.setProperty('--a11y-line-height', currentLineHeight.toString());
    html.classList.toggle('a11y-line-height', s.lineHeightLevel > 0);

    // 3. Word Spacing
    const wordSpacings = ['0px', '2px', '4px', '6px', '8px'];
    const currentWordSpacing = wordSpacings[s.wordSpacingLevel] || '0px';
    html.style.setProperty('--a11y-word-spacing', currentWordSpacing);
    html.classList.toggle('a11y-word-spacing', s.wordSpacingLevel > 0);

    // 4. Letter Spacing
    const letterSpacings = ['0px', '1px', '2px', '3px'];
    const currentLetterSpacing = letterSpacings[s.letterSpacingLevel] || '0px';
    html.style.setProperty('--a11y-letter-spacing', currentLetterSpacing);
    html.classList.toggle('a11y-letter-spacing', s.letterSpacingLevel > 0);

    // 5. Contrast Modes
    html.classList.remove('a11y-contrast-dark', 'a11y-contrast-light', 'a11y-grayscale', 'a11y-invert');
    if (s.contrastMode === 'dark') html.classList.add('a11y-contrast-dark');
    if (s.contrastMode === 'light') html.classList.add('a11y-contrast-light');
    if (s.contrastMode === 'grayscale') html.classList.add('a11y-grayscale');
    if (s.contrastMode === 'invert') html.classList.add('a11y-invert');

    // 6. Custom Colors (Spectrum)
    if (s.customBgHue !== null) {
      html.style.setProperty('--a11y-custom-bg', `hsl(${s.customBgHue}, 60%, 94%)`);
      html.classList.add('a11y-custom-bg');
    } else {
      html.classList.remove('a11y-custom-bg');
    }

    if (s.customHeadingHue !== null) {
      html.style.setProperty('--a11y-custom-headings', `hsl(${s.customHeadingHue}, 85%, 28%)`);
      html.classList.add('a11y-custom-headings');
    } else {
      html.classList.remove('a11y-custom-headings');
    }

    if (s.customTextHue !== null) {
      html.style.setProperty('--a11y-custom-text', `hsl(${s.customTextHue}, 90%, 20%)`);
      html.classList.add('a11y-custom-text');
    } else {
      html.classList.remove('a11y-custom-text');
    }

    // 7. Boolean Toggles
    html.classList.toggle('a11y-readable-font', s.readableFont);
    html.classList.toggle('a11y-highlight-links', s.highlightLinks);
    html.classList.toggle('a11y-highlight-headings', s.highlightHeadings);
    html.classList.toggle('a11y-zoom', s.screenZoom);
    html.classList.toggle('a11y-stop-animations', s.stopAnimations);
    html.classList.toggle('a11y-big-cursor', s.bigCursor);
    html.classList.toggle('a11y-keyboard-nav', s.keyboardNav);
  }, []);

  // Image Tooltips Handler
  useEffect(() => {
    if (!state.imageAltTooltips || typeof document === 'undefined') return;

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (img.alt && !img.hasAttribute('data-a11y-tagged')) {
        img.setAttribute('data-a11y-tagged', 'true');
        img.title = `תיאור תמונה: ${img.alt}`;
      }
    });
  }, [state.imageAltTooltips]);

  // Sync state to DOM and storage
  useEffect(() => {
    if (isClient) {
      applySettingsToDOM(state);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage disabled
      }
    }
  }, [state, isClient, applySettingsToDOM]);

  // Keyboard shortcut: Alt + A / Alt + ש
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        if (isOpen) setIsOpen(false);
        if (showReaderModal) setShowReaderModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showReaderModal]);

  // Text-To-Speech (SpeechSynthesis)
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('דפדפן זה אינו תומך בהקראת טקסט מובנית.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const selectedText = window.getSelection()?.toString().trim();
    const textToRead =
      selectedText ||
      'ברוכים הבאים למספרה של דביר באריאל וברחובות. לקביעת תור מהיר, לחצו על כפתור הזמן תור עכשיו או נווטו בין שירותי התספורת והזקן.';

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = state.language === 'he' ? 'he-IL' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Color Slider Click / Drag Handler
  const handleColorSpectrumClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!colorSliderRef.current) return;
    const rect = colorSliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const hue = Math.round(ratio * 360);

    if (state.colorTarget === 'background') {
      setState((prev) => ({ ...prev, customBgHue: hue }));
    } else if (state.colorTarget === 'headings') {
      setState((prev) => ({ ...prev, customHeadingHue: hue }));
    } else {
      setState((prev) => ({ ...prev, customTextHue: hue }));
    }
  };

  // Reset Colors
  const handleResetColors = () => {
    setState((prev) => ({
      ...prev,
      customBgHue: null,
      customHeadingHue: null,
      customTextHue: null,
    }));
  };

  // Stepper Handlers for Font Adjustments
  const handleStepperDecrease = () => {
    if (state.fontAdjustmentMode === 'size') {
      setState((prev) => ({ ...prev, fontScaleLevel: Math.max(0, prev.fontScaleLevel - 1) }));
    } else if (state.fontAdjustmentMode === 'word') {
      setState((prev) => ({ ...prev, wordSpacingLevel: Math.max(0, prev.wordSpacingLevel - 1) }));
    } else if (state.fontAdjustmentMode === 'line') {
      setState((prev) => ({ ...prev, lineHeightLevel: Math.max(0, prev.lineHeightLevel - 1) }));
    } else if (state.fontAdjustmentMode === 'letter') {
      setState((prev) => ({ ...prev, letterSpacingLevel: Math.max(0, prev.letterSpacingLevel - 1) }));
    }
  };

  const handleStepperIncrease = () => {
    if (state.fontAdjustmentMode === 'size') {
      setState((prev) => ({ ...prev, fontScaleLevel: Math.min(5, prev.fontScaleLevel + 1) }));
    } else if (state.fontAdjustmentMode === 'word') {
      setState((prev) => ({ ...prev, wordSpacingLevel: Math.min(4, prev.wordSpacingLevel + 1) }));
    } else if (state.fontAdjustmentMode === 'line') {
      setState((prev) => ({ ...prev, lineHeightLevel: Math.min(4, prev.lineHeightLevel + 1) }));
    } else if (state.fontAdjustmentMode === 'letter') {
      setState((prev) => ({ ...prev, letterSpacingLevel: Math.min(3, prev.letterSpacingLevel + 1) }));
    }
  };

  // Reset All Settings
  const handleResetAll = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setState(defaultState);
  };

  const isModified =
    state.fontScaleLevel > 0 ||
    state.wordSpacingLevel > 0 ||
    state.lineHeightLevel > 0 ||
    state.letterSpacingLevel > 0 ||
    state.contrastMode !== 'normal' ||
    state.customBgHue !== null ||
    state.customHeadingHue !== null ||
    state.customTextHue !== null ||
    state.readableFont ||
    state.highlightLinks ||
    state.highlightHeadings ||
    state.screenZoom ||
    state.stopAnimations ||
    state.bigCursor ||
    state.keyboardNav ||
    state.imageAltTooltips;

  // Active Hue for current selected color target
  const currentTargetHue =
    state.colorTarget === 'background'
      ? state.customBgHue
      : state.colorTarget === 'headings'
      ? state.customHeadingHue
      : state.customTextHue;

  // Stepper Current Level & Max Level
  const currentLevel =
    state.fontAdjustmentMode === 'size'
      ? state.fontScaleLevel
      : state.fontAdjustmentMode === 'word'
      ? state.wordSpacingLevel
      : state.fontAdjustmentMode === 'line'
      ? state.lineHeightLevel
      : state.letterSpacingLevel;

  const maxLevel =
    state.fontAdjustmentMode === 'size'
      ? 5
      : state.fontAdjustmentMode === 'word'
      ? 4
      : state.fontAdjustmentMode === 'line'
      ? 4
      : 3;

  if (!isClient) return null;

  return (
    <>
      {/* 1. Floating Accessibility Button (Bottom Left) */}
      {!isHiddenTemporarily && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-[9999] w-14 h-14 rounded-full bg-[#085B7A] text-white hover:bg-[#064961] shadow-2xl border-2 border-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 a11y-ignore group"
          aria-label="פתח תפריט נגישות (מקש קיצור: Alt + A)"
          aria-expanded={isOpen}
          id="a11y-trigger-btn"
        >
          {/* Universal Accessibility Icon */}
          <svg
            className="w-7 h-7 fill-current transition-transform group-hover:rotate-6"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
          </svg>

          {isModified && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"
              title="הגדרות נגישות מופעלות"
            />
          )}
        </button>
      )}

      {/* 2. Main Accessibility Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-start p-0 sm:p-4 bg-black/60 backdrop-blur-xs a11y-ignore">
            {/* Click outside backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full sm:w-[460px] max-h-[94vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#D5E2E8] text-[#1C1C1C] flex flex-col z-10 font-sans"
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-main-title"
              dir="rtl"
            >
              {/* Top Header Frame (matching reference design) */}
              <div className="bg-[#085B7A] text-white p-4 pt-4 rounded-t-3xl sm:rounded-t-3xl relative">
                <div className="flex items-center justify-between gap-3">
                  {/* Close button X */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    aria-label="סגור תפריט נגישות"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Language Selector Dropdown */}
                  <div className="relative flex-1 max-w-[200px]">
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="w-full flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors"
                      aria-expanded={isLanguageOpen}
                      aria-label="בחר שפת נגישות"
                    >
                      <span className="flex items-center gap-2">
                        <span>{LANGUAGES.find((l) => l.code === state.language)?.flag}</span>
                        <span>{LANGUAGES.find((l) => l.code === state.language)?.name}</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {isLanguageOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#1C1C1C] rounded-xl shadow-xl border border-[#D5E2E8] overflow-hidden z-30 py-1">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setState((prev) => ({ ...prev, language: lang.code as A11yState['language'] }));
                              setIsLanguageOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold hover:bg-[#F0F6F8] transition-colors ${
                              state.language === lang.code ? 'text-[#085B7A] bg-[#E5EFF2]' : 'text-[#3D3D3D]'
                            }`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                            {state.language === lang.code && <Check className="w-3.5 h-3.5 mr-auto text-[#085B7A]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hide widget button */}
                  <button
                    onClick={() => {
                      setIsHiddenTemporarily(true);
                      setIsOpen(false);
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    title="הסתר כפתור נגישות לזמן קצר"
                    aria-label="הסתר כפתור נגישות"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>

                {/* Banner title */}
                <div className="text-center mt-3 pb-1">
                  <h2 id="a11y-main-title" className="text-xl font-black tracking-wide text-white">
                    נגישות
                  </h2>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-4 space-y-4 overflow-y-auto">
                {/* ============================================================ */}
                {/* 1. FEATURE ACTIONS GRID (Icons & Tiles)                      */}
                {/* ============================================================ */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Screen Reader (הקראת טקסט) */}
                  <button
                    onClick={handleToggleSpeech}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      isSpeaking
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={isSpeaking}
                  >
                    {isSpeaking ? <VolumeX className="w-6 h-6 animate-pulse text-red-600" /> : <Volume2 className="w-6 h-6" />}
                    <span className="font-bold text-xs leading-tight">
                      {isSpeaking ? 'עצור הקראה' : 'הקראת טקסט'}
                    </span>
                  </button>

                  {/* Keyboard Navigation (ניווט מקלדת) */}
                  <button
                    onClick={() => setState((prev) => ({ ...prev, keyboardNav: !prev.keyboardNav }))}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.keyboardNav
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.keyboardNav}
                  >
                    <Keyboard className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">ניווט מקלדת</span>
                  </button>

                  {/* Light Contrast (ניגודיות בהירה) */}
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        contrastMode: prev.contrastMode === 'light' ? 'normal' : 'light',
                      }))
                    }
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.contrastMode === 'light'
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.contrastMode === 'light'}
                  >
                    <Sun className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">ניגודיות בהירה</span>
                  </button>

                  {/* Dark Contrast (ניגודיות כהה) */}
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        contrastMode: prev.contrastMode === 'dark' ? 'normal' : 'dark',
                      }))
                    }
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.contrastMode === 'dark'
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.contrastMode === 'dark'}
                  >
                    <Moon className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">ניגודיות כהה</span>
                  </button>

                  {/* Monochrome (מונוכרום) */}
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        contrastMode: prev.contrastMode === 'grayscale' ? 'normal' : 'grayscale',
                      }))
                    }
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.contrastMode === 'grayscale'
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.contrastMode === 'grayscale'}
                  >
                    <Eye className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">מונוכרום</span>
                  </button>

                  {/* Invert Contrast Mode (מוד ניגודיות הפוכה) */}
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        contrastMode: prev.contrastMode === 'invert' ? 'normal' : 'invert',
                      }))
                    }
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.contrastMode === 'invert'
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.contrastMode === 'invert'}
                  >
                    <Contrast className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">מוד ניגודיות</span>
                  </button>

                  {/* Readable Font (גופן קריא) */}
                  <button
                    onClick={() => setState((prev) => ({ ...prev, readableFont: !prev.readableFont }))}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.readableFont
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.readableFont}
                  >
                    <Type className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">גופן קריא</span>
                  </button>

                  {/* Screen Zoom (הגדלת תצוגה) */}
                  <button
                    onClick={() => setState((prev) => ({ ...prev, screenZoom: !prev.screenZoom }))}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.screenZoom
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.screenZoom}
                  >
                    <ZoomIn className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">הגדלת תצוגה</span>
                  </button>

                  {/* Highlight Links (הדגשת קישורים) */}
                  <button
                    onClick={() => setState((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks }))}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.highlightLinks
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.highlightLinks}
                  >
                    <LinkIcon className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">הדגשת קישורים</span>
                  </button>

                  {/* Image Alt Tooltips (תיאור לתמונות) */}
                  <button
                    onClick={() => setState((prev) => ({ ...prev, imageAltTooltips: !prev.imageAltTooltips }))}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.imageAltTooltips
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.imageAltTooltips}
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">תיאור לתמונות</span>
                  </button>

                  {/* Highlight Headings (הדגשת כותרות) */}
                  <button
                    onClick={() => setState((prev) => ({ ...prev, highlightHeadings: !prev.highlightHeadings }))}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95 ${
                      state.highlightHeadings
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20'
                        : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A]'
                    }`}
                    aria-pressed={state.highlightHeadings}
                  >
                    <Heading className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">הדגשת כותרות</span>
                  </button>

                  {/* Accessible Content Window / Reader Mode (הצגת תכנים בחלון קריאה) */}
                  <button
                    onClick={() => setShowReaderModal(true)}
                    className="p-3.5 rounded-2xl border-2 border-[#D5E2E8] bg-white hover:border-[#085B7A]/50 text-[#085B7A] flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span className="font-bold text-xs leading-tight">חלון קריאה והדפסה</span>
                  </button>
                </div>

                {/* ============================================================ */}
                {/* 2. SECTION: COLOR ADJUSTMENTS (התאמת צבעים)                 */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border-2 border-[#D5E2E8] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-black text-sm text-[#085B7A]">התאמת צבעים</h3>
                      <p className="text-[11px] text-[#6B6560]">שינוי צבעי האתר</p>
                    </div>
                    <Sliders className="w-4 h-4 text-[#085B7A]" />
                  </div>

                  {/* Target Buttons: [רקעים] [כותרות] [תכנים] */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'background' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        state.colorTarget === 'background'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-sm'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      רקעים
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'headings' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        state.colorTarget === 'headings'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-sm'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      כותרות
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'text' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        state.colorTarget === 'text'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-sm'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      תכנים
                    </button>
                  </div>

                  {/* Rainbow Spectrum Color Bar */}
                  <div
                    ref={colorSliderRef}
                    onClick={handleColorSpectrumClick}
                    className="relative h-6 rounded-full cursor-pointer shadow-inner mb-3 border border-black/10"
                    style={{
                      background:
                        'linear-gradient(to right, #000 0%, #fff 15%, #ff0000 25%, #ffff00 40%, #00ff00 55%, #00ffff 70%, #0000ff 85%, #ff00ff 100%)',
                    }}
                    title="לחץ לבחירת צבע"
                  >
                    {currentTargetHue !== null && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#085B7A] shadow-md -ml-3 pointer-events-none"
                        style={{ left: `${(currentTargetHue / 360) * 100}%` }}
                      />
                    )}
                  </div>

                  {/* Reset Colors Button */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleResetColors}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#085B7A] hover:underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      איפוס צבעים
                    </button>

                    {currentTargetHue !== null && (
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        צבע מותאם פעיל ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 3. SECTION: FONT ADJUSTMENTS (התאמות גופן)                  */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border-2 border-[#D5E2E8] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-black text-sm text-[#085B7A]">התאמות גופן</h3>
                      <p className="text-[11px] text-[#6B6560]">הגדלת והקטנת הגופן והריווחים</p>
                    </div>
                    <Type className="w-4 h-4 text-[#085B7A]" />
                  </div>

                  {/* Mode Buttons: [גודל גופן] [ריווח בין מילים] [ריווח בין שורות] [ריווח אותיות] */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'size' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        state.fontAdjustmentMode === 'size'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-sm'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      גודל גופן {state.fontScaleLevel > 0 && `(+${state.fontScaleLevel * 10}%)`}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'word' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        state.fontAdjustmentMode === 'word'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-sm'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      ריווח בין מילים
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'line' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        state.fontAdjustmentMode === 'line'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-sm'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      ריווח בין שורות
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'letter' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        state.fontAdjustmentMode === 'letter'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-sm'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      ריווח אותיות
                    </button>
                  </div>

                  {/* Stepper Control: [-] === [+] */}
                  <div className="flex items-center gap-3 bg-[#F0F6F8] rounded-2xl p-2 border border-[#D5E2E8]">
                    <button
                      onClick={handleStepperDecrease}
                      disabled={currentLevel <= 0}
                      className="w-10 h-10 rounded-xl bg-[#085B7A] text-white flex items-center justify-center font-black text-lg disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all"
                      aria-label="הקטן ערך"
                    >
                      -
                    </button>

                    {/* Level Track Bar */}
                    <div className="flex-1 px-2">
                      <div className="w-full bg-[#D5E2E8] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#085B7A] h-full transition-all duration-200"
                          style={{ width: `${(currentLevel / maxLevel) * 100}%` }}
                        />
                      </div>
                      <div className="text-center text-[10px] font-bold text-[#085B7A] mt-1">
                        דרגה {currentLevel} מתוך {maxLevel}
                      </div>
                    </div>

                    <button
                      onClick={handleStepperIncrease}
                      disabled={currentLevel >= maxLevel}
                      className="w-10 h-10 rounded-xl bg-[#085B7A] text-white flex items-center justify-center font-black text-lg disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all"
                      aria-label="הגדל ערך"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 4. EXTRA UTILITIES (Big cursor & Stop animations)           */}
                {/* ============================================================ */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setState((prev) => ({ ...prev, bigCursor: !prev.bigCursor }))}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      state.bigCursor
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A]'
                        : 'border-[#D5E2E8] bg-white text-[#3D3D3D] hover:border-[#085B7A]'
                    }`}
                    aria-pressed={state.bigCursor}
                  >
                    <MousePointer className="w-3.5 h-3.5" />
                    סמן עכבר מוגדל
                  </button>

                  <button
                    onClick={() => setState((prev) => ({ ...prev, stopAnimations: !prev.stopAnimations }))}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      state.stopAnimations
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A]'
                        : 'border-[#D5E2E8] bg-white text-[#3D3D3D] hover:border-[#085B7A]'
                    }`}
                    aria-pressed={state.stopAnimations}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    עצירת אנימציות
                  </button>
                </div>
              </div>

              {/* Bottom Footer Actions (Matching Reference) */}
              <div className="bg-[#085B7A] text-white p-4 space-y-2 mt-auto">
                <button
                  onClick={handleResetAll}
                  className="w-full py-2.5 rounded-xl bg-white text-[#085B7A] hover:bg-white/90 text-xs font-black transition-colors shadow-sm"
                >
                  בטל נגישות
                </button>

                <div className="flex items-center justify-between text-[11px] text-white/80 pt-1">
                  <Link
                    href="/accessibility"
                    onClick={() => setIsOpen(false)}
                    className="hover:underline font-bold text-white"
                  >
                    הצהרת נגישות תקן 5568 ←
                  </Link>

                  <span className="opacity-70">נגיש בקליק · WCAG 2.1 AA</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Accessible Reader & Print Mode Modal Window */}
      {showReaderModal && (
        <div className="fixed inset-0 z-[999999] bg-white text-[#1C1C1C] p-6 sm:p-12 overflow-y-auto a11y-ignore" dir="rtl">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
              <div>
                <h2 className="text-2xl font-black">המספרה של דביר – תצוגת קריאה נגישה</h2>
                <p className="text-xs text-[#6B6560]">מותאם להדפסה ולקריאה מוגדלת ברורה</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-[#085B7A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#064961] transition-colors"
                >
                  <Printer className="w-4 h-4" /> הדפס תוכן נגיש
                </button>
                <button
                  onClick={() => setShowReaderModal(false)}
                  className="bg-zinc-200 hover:bg-zinc-300 p-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 text-base sm:text-lg leading-relaxed">
              <section>
                <h3 className="text-xl font-bold mb-2">אודות המספרה</h3>
                <p>
                  המספרה של דביר פועלת בשני סניפים מרכזיים: סניף אריאל (ימים א׳-ג׳) וסניף רחובות (ימים ד׳-ו׳). דביר
                  מתמחה בדירוגים מודרניים, סקין פייד מדויק, פיסול זקנים וטיפולי פרימיום.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2">שירותים ומחירים</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>תספורת גברים פרימיום – ₪80 (30 דקות)</li>
                  <li>תספורת + פיסול זקן בתער – ₪120 (45 דקות)</li>
                  <li>עיצוב ופיסול זקן – ₪50 (20 דקות)</li>
                  <li>תספורת סטודנט / חייל – ₪70 (30 דקות)</li>
                  <li>טיפול פרימיום משולב – ₪160 (60 דקות)</li>
                  <li>צבע והסוואת שיער שיבה – ₪90 (35 דקות)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2">יצירת קשר והזמנת תורים</h3>
                <p>טלפון: 052-123-4567 | הזמנת תורים מקוונת: dvir-barbershop-reg-in.vercel.app</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
