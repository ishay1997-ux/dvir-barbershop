'use client';

import { useState, useEffect, useCallback } from 'react';
import { A11yState, defaultState, STORAGE_KEY } from './types';

interface UseAccessibilityOptions {
  storageKey?: string;
  defaultLanguage?: A11yState['language'];
}


// Live widget instances on this page: the <html> cleanup runs only when the last one unmounts.
let liveInstances = 0;

// Single source of truth for the stepped classes (a11y-font-1..5 etc.): apply + cleanup both derive from it.
const LEVEL_MAX = { font: 5, word: 4, line: 4, letter: 3 } as const;
const levelClasses = (kind: keyof typeof LEVEL_MAX) => Array.from({ length: LEVEL_MAX[kind] }, (_, i) => `a11y-${kind}-${i + 1}`);

const A11Y_ROOT_CLASSES = [
  ...levelClasses('font'), ...levelClasses('word'), ...levelClasses('line'), ...levelClasses('letter'),
  'a11y-contrast-light', 'a11y-contrast-dark', 'a11y-contrast-grayscale', 'a11y-contrast-invert',
  'a11y-has-custom-bg', 'a11y-has-custom-heading', 'a11y-has-custom-text',
  'a11y-readable-font', 'a11y-highlight-links', 'a11y-highlight-headings', 'a11y-screen-zoom',
  'a11y-stop-animations', 'a11y-keyboard-nav', 'a11y-image-alt-tooltips',
];

const CONTRAST_MODES: A11yState['contrastMode'][] = ['normal', 'light', 'dark', 'grayscale', 'invert'];
const COLOR_TARGETS: A11yState['colorTarget'][] = ['background', 'headings', 'text'];
const CURSOR_MODES: A11yState['cursorMode'][] = ['default', 'white', 'black'];
const FONT_MODES: A11yState['fontAdjustmentMode'][] = ['size', 'word', 'line', 'letter'];
const LANGS: A11yState['language'][] = ['he', 'en', 'ar', 'ru'];

/** Merge a stored blob over the current state, validating every field. Unknown or corrupt fields keep the current value. */
export function sanitizeState(raw: unknown, base: A11yState): A11yState {
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const num = (key: keyof A11yState, min: number, max: number) => {
    const v = r[key as string];
    return typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : (base[key] as number);
  };
  const numOrNull = (key: keyof A11yState) => {
    const v = r[key as string];
    if (v === null) return null;
    return typeof v === 'number' && Number.isFinite(v) ? Math.min(360, Math.max(0, Math.round(v))) : (base[key] as number | null);
  };
  const bool = (key: keyof A11yState) => (typeof r[key as string] === 'boolean' ? (r[key as string] as boolean) : (base[key] as boolean));
  const oneOf = <T extends string>(key: keyof A11yState, allowed: readonly T[]) =>
    (allowed as readonly string[]).includes(r[key as string] as string) ? (r[key as string] as T) : (base[key] as T);
  return {
    fontScaleLevel: num('fontScaleLevel', 0, 5),
    wordSpacingLevel: num('wordSpacingLevel', 0, 4),
    lineHeightLevel: num('lineHeightLevel', 0, 4),
    letterSpacingLevel: num('letterSpacingLevel', 0, 3),
    fontAdjustmentMode: oneOf('fontAdjustmentMode', FONT_MODES),
    contrastMode: oneOf('contrastMode', CONTRAST_MODES),
    colorTarget: oneOf('colorTarget', COLOR_TARGETS),
    customBgHue: numOrNull('customBgHue'),
    customHeadingHue: numOrNull('customHeadingHue'),
    customTextHue: numOrNull('customTextHue'),
    readableFont: bool('readableFont'),
    highlightLinks: bool('highlightLinks'),
    highlightHeadings: bool('highlightHeadings'),
    screenZoom: bool('screenZoom'),
    stopAnimations: bool('stopAnimations'),
    bigCursor: bool('bigCursor'),
    cursorMode: oneOf('cursorMode', CURSOR_MODES),
    keyboardNav: bool('keyboardNav'),
    imageAltTooltips: bool('imageAltTooltips'),
    virtualKeyboard: bool('virtualKeyboard'),
    language: oneOf('language', LANGS),
  };
}

export function useAccessibility(options?: UseAccessibilityOptions) {
  const activeStorageKey = options?.storageKey || STORAGE_KEY;
  const [isClient, setIsClient] = useState(false);
  const [state, setState] = useState<A11yState>(() => ({
    ...defaultState,
    language: options?.defaultLanguage || defaultState.language,
  }));

  // Initialize client state from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      // Capture the host's own root font-size BEFORE any a11y-font-N class can apply, so
      // font scaling multiplies the host's base (e.g. html{font-size:62.5%}) instead of replacing it.
      const root = document.documentElement;
      if (!root.style.getPropertyValue('--a11y-base-font') && !/\ba11y-font-\d\b/.test(root.className)) {
        root.style.setProperty('--a11y-base-font', getComputedStyle(root).fontSize);
      }
      const saved = localStorage.getItem(activeStorageKey);
      if (saved) {
        // Field-by-field validation: a legacy blob (no version) is merged, never discarded;
        // only unparsable JSON resets. Unknown enum values / out-of-range numbers fall back per field.
        const parsed: unknown = JSON.parse(saved);
        setState((prev) => sanitizeState(parsed, prev));
      }
    } catch (e) {
      console.warn('[a11y] could not read saved accessibility state — using defaults', e);
    }
  }, [activeStorageKey]);

  // Save to local storage
  const saveState = useCallback((newState: A11yState) => {
    setState(newState);
    try {
      localStorage.setItem(activeStorageKey, JSON.stringify(newState));
    } catch (e) {
      console.warn('[a11y] accessibility state was not saved (storage unavailable or full)', e);
    }
  }, [activeStorageKey]);

  // Apply Accessibility Classes & Styles to <html> and <body>
  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;
    const body = document.body;

    // 1. Font Scale
    root.classList.remove(...levelClasses('font'));
    if (state.fontScaleLevel > 0) {
      root.classList.add(`a11y-font-${state.fontScaleLevel}`);
    }

    // 2. Word Spacing
    root.classList.remove(...levelClasses('word'));
    if (state.wordSpacingLevel > 0) {
      root.classList.add(`a11y-word-${state.wordSpacingLevel}`);
    }

    // 3. Line Height
    root.classList.remove(...levelClasses('line'));
    if (state.lineHeightLevel > 0) {
      root.classList.add(`a11y-line-${state.lineHeightLevel}`);
    }

    // 4. Letter Spacing
    root.classList.remove(...levelClasses('letter'));
    if (state.letterSpacingLevel > 0) {
      root.classList.add(`a11y-letter-${state.letterSpacingLevel}`);
    }

    // 5. Contrast Mode
    root.classList.remove(
      'a11y-contrast-light',
      'a11y-contrast-dark',
      'a11y-contrast-grayscale',
      'a11y-contrast-invert'
    );
    if (state.contrastMode !== 'normal') {
      root.classList.add(`a11y-contrast-${state.contrastMode}`);
    }

    // 6. Custom Hues via CSS variables
    if (state.customBgHue !== null) {
      root.style.setProperty('--a11y-custom-bg', `hsl(${state.customBgHue}, 90%, 48%)`);
      root.classList.add('a11y-has-custom-bg');
    } else {
      root.style.removeProperty('--a11y-custom-bg');
      root.classList.remove('a11y-has-custom-bg');
    }

    if (state.customHeadingHue !== null) {
      root.style.setProperty('--a11y-custom-heading', `hsl(${state.customHeadingHue}, 95%, 50%)`);
      root.classList.add('a11y-has-custom-heading');
    } else {
      root.style.removeProperty('--a11y-custom-heading');
      root.classList.remove('a11y-has-custom-heading');
    }

    if (state.customTextHue !== null) {
      root.style.setProperty('--a11y-custom-text', `hsl(${state.customTextHue}, 95%, 48%)`);
      root.classList.add('a11y-has-custom-text');
    } else {
      root.style.removeProperty('--a11y-custom-text');
      root.classList.remove('a11y-has-custom-text');
    }

    // 7. Toggle Features
    root.classList.toggle('a11y-readable-font', state.readableFont);
    root.classList.toggle('a11y-highlight-links', state.highlightLinks);
    root.classList.toggle('a11y-highlight-headings', state.highlightHeadings);
    root.classList.toggle('a11y-screen-zoom', state.screenZoom);
    root.classList.toggle('a11y-stop-animations', state.stopAnimations);
    body.classList.toggle(
      'a11y-cursor-black',
      state.cursorMode === 'black' || (state.bigCursor && state.cursorMode !== 'white')
    );
    body.classList.toggle('a11y-cursor-white', state.cursorMode === 'white');
    root.classList.toggle('a11y-keyboard-nav', state.keyboardNav);
    root.classList.toggle('a11y-image-alt-tooltips', state.imageAltTooltips);

    // Save to storage
    saveState(state);
  }, [state, isClient, saveState]);

  // Remove every class / property this hook can set when the widget unmounts (route change in a
  // client-side-routed host, conditional render, StrictMode): the host page must be left untouched.
  useEffect(() => {
    liveInstances += 1;
    return () => {
      liveInstances -= 1;
      if (liveInstances > 0) return; // another widget instance still owns <html>
      const root = document.documentElement;
      const body = document.body;
      root.classList.remove(...A11Y_ROOT_CLASSES);
      body.classList.remove('a11y-cursor-black', 'a11y-cursor-white');
      ['--a11y-custom-bg', '--a11y-custom-heading', '--a11y-custom-text', '--a11y-base-font'].forEach((p) =>
        root.style.removeProperty(p)
      );
    };
  }, []);

  // Hue setter (keyboard-operable <input type="range"> in ColorSpectrumCard)
  const handleHueChange = useCallback((hue: number) => {
    const selectedHue = Math.max(0, Math.min(360, Math.round(hue)));

    setState((prev) => {
      if (prev.colorTarget === 'background') return { ...prev, customBgHue: selectedHue };
      if (prev.colorTarget === 'headings') return { ...prev, customHeadingHue: selectedHue };
      return { ...prev, customTextHue: selectedHue };
    });
  }, []);

  const handleResetColors = useCallback(() => {
    setState((prev) => {
      if (prev.colorTarget === 'background') return { ...prev, customBgHue: null };
      if (prev.colorTarget === 'headings') return { ...prev, customHeadingHue: null };
      return { ...prev, customTextHue: null };
    });
  }, []);

  // Cursor Toggle Handler
  const handleToggleCursor = useCallback((mode: 'white' | 'black') => {
    setState((prev) => {
      const isCurrentlyActive = prev.cursorMode === mode;
      return {
        ...prev,
        cursorMode: isCurrentlyActive ? 'default' : mode,
        bigCursor: !isCurrentlyActive,
      };
    });
  }, []);

  // Font Stepper Handlers
  const handleStepperIncrease = useCallback(() => {
    setState((prev) => {
      if (prev.fontAdjustmentMode === 'size') {
        return { ...prev, fontScaleLevel: Math.min(5, prev.fontScaleLevel + 1) };
      }
      if (prev.fontAdjustmentMode === 'word') {
        return { ...prev, wordSpacingLevel: Math.min(4, prev.wordSpacingLevel + 1) };
      }
      if (prev.fontAdjustmentMode === 'line') {
        return { ...prev, lineHeightLevel: Math.min(4, prev.lineHeightLevel + 1) };
      }
      return { ...prev, letterSpacingLevel: Math.min(3, prev.letterSpacingLevel + 1) };
    });
  }, []);

  const handleStepperDecrease = useCallback(() => {
    setState((prev) => {
      if (prev.fontAdjustmentMode === 'size') {
        return { ...prev, fontScaleLevel: Math.max(0, prev.fontScaleLevel - 1) };
      }
      if (prev.fontAdjustmentMode === 'word') {
        return { ...prev, wordSpacingLevel: Math.max(0, prev.wordSpacingLevel - 1) };
      }
      if (prev.fontAdjustmentMode === 'line') {
        return { ...prev, lineHeightLevel: Math.max(0, prev.lineHeightLevel - 1) };
      }
      return { ...prev, letterSpacingLevel: Math.max(0, prev.letterSpacingLevel - 1) };
    });
  }, []);

  // Check if any modification is active
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
    state.cursorMode !== 'default' ||
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

  const resetAllState = useCallback(() => {
    saveState(defaultState);
  }, [saveState]);

  return {
    isClient,
    state,
    setState,
    saveState,
    isModified,
    currentTargetHue,
    currentLevel,
    maxLevel,
    handleHueChange,
    handleResetColors,
    handleToggleCursor,
    handleStepperIncrease,
    handleStepperDecrease,
    resetAllState,
  };
}
