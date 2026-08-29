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
  Move,
  Delete,
} from 'lucide-react';
import Link from 'next/link';

interface A11yState {
  // Font & Content Adjustments
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
  virtualKeyboard: boolean;

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
  virtualKeyboard: false,

  language: 'he',
};

const STORAGE_KEY = 'thecut_a11y_v3_state';

const LANGUAGES = [
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
] as const;

// Hebrew Virtual Keyboard layout
const HEBREW_KEYS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
  ['/', '\'', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
  ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
  ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', '.'],
];

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<A11yState>(defaultState);
  const [isClient, setIsClient] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [isHiddenTemporarily, setIsHiddenTemporarily] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<{ id: string; title: string; desc: string } | null>(null);
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
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

  // Track focused input for virtual keyboard
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        setActiveInput(target as HTMLInputElement | HTMLTextAreaElement);
      }
    };
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
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
    html.classList.toggle('a11y-contrast-dark', s.contrastMode === 'dark');
    html.classList.toggle('a11y-contrast-light', s.contrastMode === 'light');
    html.classList.toggle('a11y-grayscale', s.contrastMode === 'grayscale');
    html.classList.toggle('a11y-invert', s.contrastMode === 'invert');

    // 6. Custom Hues
    if (s.customBgHue !== null) {
      html.style.setProperty('--a11y-custom-bg', `hsl(${s.customBgHue}, 60%, 92%)`);
      html.classList.add('a11y-custom-bg');
    } else {
      html.style.removeProperty('--a11y-custom-bg');
      html.classList.remove('a11y-custom-bg');
    }

    if (s.customHeadingHue !== null) {
      html.style.setProperty('--a11y-custom-headings', `hsl(${s.customHeadingHue}, 80%, 30%)`);
      html.classList.add('a11y-custom-headings');
    } else {
      html.style.removeProperty('--a11y-custom-headings');
      html.classList.remove('a11y-custom-headings');
    }

    if (s.customTextHue !== null) {
      html.style.setProperty('--a11y-custom-text', `hsl(${s.customTextHue}, 80%, 25%)`);
      html.classList.add('a11y-custom-text');
    } else {
      html.style.removeProperty('--a11y-custom-text');
      html.classList.remove('a11y-custom-text');
    }

    // 7. Toggle Features
    html.classList.toggle('a11y-readable-font', s.readableFont);
    html.classList.toggle('a11y-highlight-links', s.highlightLinks);
    html.classList.toggle('a11y-highlight-headings', s.highlightHeadings);
    html.classList.toggle('a11y-zoom', s.screenZoom);
    html.classList.toggle('a11y-stop-animations', s.stopAnimations);
    html.classList.toggle('a11y-big-cursor', s.bigCursor);
    html.classList.toggle('a11y-keyboard-nav', s.keyboardNav);
    html.classList.toggle('a11y-image-descriptions', s.imageAltTooltips);

    // Save to storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      applySettingsToDOM(state);
    }
  }, [state, isClient, applySettingsToDOM]);

  // Keyboard navigation Alt+A shortcut
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

  // Screen Reader (Text-to-Speech)
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

    const mainEl = document.querySelector('main') || document.body;
    const textToRead = mainEl.innerText.slice(0, 1500);

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = state.language === 'he' ? 'he-IL' : state.language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Virtual keyboard key press
  const handleVirtualKeyPress = (char: string) => {
    if (!activeInput) return;
    const start = activeInput.selectionStart || 0;
    const end = activeInput.selectionEnd || 0;
    const val = activeInput.value;
    activeInput.value = val.substring(0, start) + char + val.substring(end);
    activeInput.focus();
    activeInput.setSelectionRange(start + char.length, start + char.length);
    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const handleVirtualBackspace = () => {
    if (!activeInput || activeInput.value.length === 0) return;
    const start = activeInput.selectionStart || 0;
    const end = activeInput.selectionEnd || 0;
    const val = activeInput.value;
    if (start === end && start > 0) {
      activeInput.value = val.substring(0, start - 1) + val.substring(end);
      activeInput.focus();
      activeInput.setSelectionRange(start - 1, start - 1);
    } else {
      activeInput.value = val.substring(0, start) + val.substring(end);
      activeInput.focus();
      activeInput.setSelectionRange(start, start);
    }
    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
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
    state.imageAltTooltips ||
    state.virtualKeyboard;

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

  // 14 Core Accessibility Features with Exact Descriptions & Icons (Matching Reference)
  const A11Y_TILES = [
    {
      id: 'keyboardNav',
      title: 'ניווט מקלדת',
      desc: 'התאמת האתר לניווט באמצעות המקלדת, ללא צורך בעכבר',
      icon: <Keyboard className="w-7 h-7 text-[#085B7A]" />,
      active: state.keyboardNav,
      onClick: () => setState((prev) => ({ ...prev, keyboardNav: !prev.keyboardNav })),
    },
    {
      id: 'speech',
      title: isSpeaking ? 'עצור הקראה' : 'הקראת טקסט',
      desc: 'הקראה קולית חכמה של תכנים, פסקאות וכותרות באתר בעברית',
      icon: isSpeaking ? <VolumeX className="w-7 h-7 text-red-500 animate-pulse" /> : <Volume2 className="w-7 h-7 text-[#085B7A]" />,
      active: isSpeaking,
      onClick: handleToggleSpeech,
    },
    {
      id: 'contrastDark',
      title: 'ניגודיות כהה',
      desc: 'הצגת האתר על רקע שחור מלא עם טקסט צהוב וכחול זוהר לקריאה קלה',
      icon: <Moon className="w-7 h-7 text-[#085B7A]" />,
      active: state.contrastMode === 'dark',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'dark' ? 'normal' : 'dark' })),
    },
    {
      id: 'contrastLight',
      title: 'ניגודיות בהירה',
      desc: 'הצגת האתר על גבי רקע לבן צח עם טקסט שחור כהה וקישורים בולטים',
      icon: <Sun className="w-7 h-7 text-[#085B7A]" />,
      active: state.contrastMode === 'light',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'light' ? 'normal' : 'light' })),
    },
    {
      id: 'contrastInvert',
      title: 'מוד ניגודיות',
      desc: 'היפוך צבעי האתר בצורה חדה תוך שמירה מלאה על צבעי תמונות ווידאו',
      icon: <Contrast className="w-7 h-7 text-[#085B7A]" />,
      active: state.contrastMode === 'invert',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'invert' ? 'normal' : 'invert' })),
    },
    {
      id: 'grayscale',
      title: 'מונוכרום',
      desc: 'הפיכת כל צבעי האתר לגווני אפור (שחור-לבן) למניעת עומס ראייתי',
      icon: <Eye className="w-7 h-7 text-[#085B7A]" />,
      active: state.contrastMode === 'grayscale',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'grayscale' ? 'normal' : 'grayscale' })),
    },
    {
      id: 'screenZoom',
      title: 'הגדלת תצוגה',
      desc: 'הגדלת כל שטח התצוגה של האתר ב-15% לצפייה נוחה וברורה',
      icon: <ZoomIn className="w-7 h-7 text-[#085B7A]" />,
      active: state.screenZoom,
      onClick: () => setState((prev) => ({ ...prev, screenZoom: !prev.screenZoom })),
    },
    {
      id: 'readableFont',
      title: 'גופן קריא',
      desc: 'החלפת גופן האתר לגופן קריא, פשוט וברור (Arial / מותאם לדיסלקטים)',
      icon: <Type className="w-7 h-7 text-[#085B7A]" />,
      active: state.readableFont,
      onClick: () => setState((prev) => ({ ...prev, readableFont: !prev.readableFont })),
    },
    {
      id: 'imageAlt',
      title: 'תיאור לתמונות',
      desc: 'הצגת תיאורי תוכן והסברים טקסטואליים ישירות על גבי התמונות באתר',
      icon: <ImageIcon className="w-7 h-7 text-[#085B7A]" />,
      active: state.imageAltTooltips,
      onClick: () => setState((prev) => ({ ...prev, imageAltTooltips: !prev.imageAltTooltips })),
    },
    {
      id: 'highlightLinks',
      title: 'הדגשת קישורים',
      desc: 'הדגשה בולטת בצהוב עם קו תחתי על כל הקישורים והכפתורים באתר',
      icon: <LinkIcon className="w-7 h-7 text-[#085B7A]" />,
      active: state.highlightLinks,
      onClick: () => setState((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks })),
    },
    {
      id: 'highlightHeadings',
      title: 'הדגשת כותרות',
      desc: 'סימון והדגשה בצבע טורקיז ברור של כל הכותרות והקטעים המרכזיים',
      icon: <Heading className="w-7 h-7 text-[#085B7A]" />,
      active: state.highlightHeadings,
      onClick: () => setState((prev) => ({ ...prev, highlightHeadings: !prev.highlightHeadings })),
    },
    {
      id: 'readingMode',
      title: 'תצוגה קריאה',
      desc: 'פתיחת חלון קריאה נקי ונטול הסחות דעת עם אפשרות להדפסה ישירה',
      icon: <BookOpen className="w-7 h-7 text-[#085B7A]" />,
      active: showReaderModal,
      onClick: () => setShowReaderModal(true),
    },
    {
      id: 'contentScale',
      title: 'הגדלת תכנים',
      desc: 'הגדלת גודל הטקסטים והפסקאות בכל עמודי האתר עד 150%',
      icon: <Search className="w-7 h-7 text-[#085B7A]" />,
      active: state.fontScaleLevel > 0,
      onClick: () => setState((prev) => ({
        ...prev,
        fontAdjustmentMode: 'size',
        fontScaleLevel: prev.fontScaleLevel >= 5 ? 0 : prev.fontScaleLevel + 1,
      })),
    },
    {
      id: 'virtualKeyboard',
      title: 'מקלדת וירטואלית',
      desc: 'הצגת מקלדת על גבי המסך להקלדה נוחה בעברית באמצעות העכבר בלבד',
      icon: (
        <div className="w-7 h-7 border-2 border-[#085B7A] rounded-md flex flex-wrap gap-0.5 p-0.5 items-center justify-center">
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
        </div>
      ),
      active: state.virtualKeyboard,
      onClick: () => setState((prev) => ({ ...prev, virtualKeyboard: !prev.virtualKeyboard })),
    },
  ];

  if (!isClient) return null;

  return (
    <>
      {/* 1. Floating Accessibility Button (Matching User's Reference Image) */}
      {!isHiddenTemporarily && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-[9999] bg-[#1A2228] text-white hover:bg-[#253038] shadow-2xl border border-white/20 rounded-2xl flex items-center gap-2.5 p-2 px-3.5 transition-all duration-300 transform hover:scale-105 active:scale-95 a11y-ignore group cursor-pointer"
          aria-label="פתח תפריט נגישות (מקש קיצור: Alt + A)"
          aria-expanded={isOpen}
          id="a11y-trigger-btn"
          dir="rtl"
        >
          {/* Universal Accessibility Icon + 4 Directional Arrows */}
          <div className="flex flex-col items-center justify-center text-white border-l border-white/20 pl-2.5">
            <Move className="w-3 h-3 text-cyan-300 opacity-80 mb-0.5" />
            <svg
              className="w-5 h-5 fill-current text-white transition-transform group-hover:rotate-6"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
            </svg>
          </div>

          <div className="text-right">
            <span className="block text-xs font-black text-white tracking-wide">
              כפתור
            </span>
            <span className="block text-xs font-bold text-cyan-300">
              נגישות
            </span>
          </div>

          {isModified && (
            <span
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"
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
              className="relative w-full sm:w-[480px] max-h-[94vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#D5E2E8] text-[#1C1C1C] flex flex-col z-10 font-sans"
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-main-title"
              dir="rtl"
            >
              {/* Top Header Frame (Matching Reference) */}
              <div className="bg-[#085B7A] text-white p-4 pt-4 rounded-t-3xl sm:rounded-t-3xl relative">
                <div className="flex items-center justify-between gap-3">
                  {/* Close button X */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                    aria-label="סגור תפריט נגישות"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Language Selector Dropdown */}
                  <div className="relative flex-1 max-w-[200px]">
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="w-full flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
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
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold hover:bg-[#F0F6F8] transition-colors cursor-pointer ${
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
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
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
              <div className="p-4 space-y-4 overflow-y-auto relative">
                {/* Interactive Hover Tooltip Box (Matching User's Reference Image 2) */}
                <div className="min-h-[54px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {hoveredTile ? (
                      <motion.div
                        key={hoveredTile.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="w-full bg-[#475569] text-white p-2.5 px-3.5 rounded-xl shadow-lg text-center text-xs font-semibold leading-relaxed border border-slate-500/40"
                      >
                        <strong className="text-amber-300 ml-1">{hoveredTile.title}:</strong>
                        <span>{hoveredTile.desc}</span>
                      </motion.div>
                    ) : (
                      <div className="w-full bg-slate-100 text-slate-600 p-2.5 px-3.5 rounded-xl text-center text-xs font-medium border border-slate-200">
                        💡 העבר את העכבר על כל אפשרות כדי לקרוא את הפירוט המדויק שלה
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ============================================================ */}
                {/* 1. 14 CORE FEATURES GRID (3 columns / 2 columns matching UI) */}
                {/* ============================================================ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {A11Y_TILES.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={tile.onClick}
                      onMouseEnter={() => setHoveredTile(tile)}
                      onMouseLeave={() => setHoveredTile(null)}
                      onFocus={() => setHoveredTile(tile)}
                      onBlur={() => setHoveredTile(null)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-1.5 transition-all active:scale-95 cursor-pointer relative group ${
                        tile.active
                          ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20 shadow-xs'
                          : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/60 hover:bg-[#F8FBFC] text-[#085B7A]'
                      }`}
                      aria-pressed={tile.active}
                      title={tile.title}
                    >
                      <div className="flex items-center justify-center h-8">
                        {tile.icon}
                      </div>
                      <span className="font-bold text-[11px] sm:text-xs leading-tight text-[#085B7A]">
                        {tile.title}
                      </span>
                      {tile.active && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* ============================================================ */}
                {/* 2. SECTION: COLOR ADJUSTMENTS (התאמת צבעים)                 */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border-2 border-[#D5E2E8] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-black text-sm text-[#085B7A]">התאמת צבעים אישית</h3>
                      <p className="text-[11px] text-[#6B6560]">שינוי צבעי הרקע, הכותרות והטקסטים</p>
                    </div>
                    <Sliders className="w-4 h-4 text-[#085B7A]" />
                  </div>

                  {/* Target Buttons: [רקעים] [כותרות] [תכנים] */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'background' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'background'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      רקעים
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'headings' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'headings'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      כותרות
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'text' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'text'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
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
                    title="לחץ לבחירת גוון"
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
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#085B7A] hover:underline cursor-pointer"
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
                {/* 3. SECTION: FONT ADJUSTMENTS (התאמות גופן וריווח)           */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border-2 border-[#D5E2E8] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-black text-sm text-[#085B7A]">התאמות גופן וריווחים</h3>
                      <p className="text-[11px] text-[#6B6560]">שליטה מדויקת בגודל הגופן ובריווח בין מילים ושורות</p>
                    </div>
                    <Type className="w-4 h-4 text-[#085B7A]" />
                  </div>

                  {/* Mode Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'size' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.fontAdjustmentMode === 'size'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      גודל גופן {state.fontScaleLevel > 0 && `(+${state.fontScaleLevel * 10}%)`}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'word' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.fontAdjustmentMode === 'word'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      ריווח בין מילים
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'line' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.fontAdjustmentMode === 'line'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      ריווח בין שורות
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'letter' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.fontAdjustmentMode === 'letter'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
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
                      className="w-10 h-10 rounded-xl bg-[#085B7A] text-white flex items-center justify-center font-black text-lg disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer"
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
                      className="w-10 h-10 rounded-xl bg-[#085B7A] text-white flex items-center justify-center font-black text-lg disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer"
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
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                  className="w-full py-2.5 rounded-xl bg-white text-[#085B7A] hover:bg-white/90 text-xs font-black transition-colors shadow-xs cursor-pointer"
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

      {/* 3. On-Screen Virtual Keyboard (מקלדת וירטואלית) */}
      <AnimatePresence>
        {state.virtualKeyboard && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-[999999] bg-[#1E293B] text-white p-3 rounded-2xl shadow-2xl border-2 border-cyan-500/40 select-none a11y-ignore"
            dir="rtl"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 text-xs">
              <span className="font-black text-cyan-300 flex items-center gap-1.5">
                ⌨️ מקלדת וירטואלית על המסך
              </span>
              <button
                onClick={() => setState((prev) => ({ ...prev, virtualKeyboard: false }))}
                className="text-slate-400 hover:text-white p-1"
                aria-label="סגור מקלדת"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {HEBREW_KEYS.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center gap-1">
                  {row.map((char) => (
                    <button
                      key={char}
                      onClick={() => handleVirtualKeyPress(char)}
                      className="flex-1 min-w-[24px] h-9 sm:h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-sm sm:text-base font-bold text-white shadow-xs border border-slate-600 transition-colors"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}

              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => handleVirtualKeyPress(' ')}
                  className="flex-1 h-9 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-xs font-bold text-white shadow-xs border border-slate-600"
                >
                  רווח (Space)
                </button>
                <button
                  onClick={handleVirtualBackspace}
                  className="w-16 h-9 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 rounded-lg text-xs font-bold flex items-center justify-center"
                  aria-label="מחיקה"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Accessible Reader & Print Mode Modal Window */}
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
                  className="bg-[#085B7A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#064961] transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> הדפס תוכן נגיש
                </button>
                <button
                  onClick={() => setShowReaderModal(false)}
                  className="bg-zinc-200 hover:bg-zinc-300 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
                <p>טלפון: 052-123-4567 | הזמנת תורים מקוונת: thecut-reg-in.vercel.app</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
