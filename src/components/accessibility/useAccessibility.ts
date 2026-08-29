'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { A11yState, defaultState, STORAGE_KEY } from './types';

interface UseAccessibilityOptions {
  storageKey?: string;
  defaultLanguage?: A11yState['language'];
}

export function useAccessibility(options?: UseAccessibilityOptions) {
  const activeStorageKey = options?.storageKey || STORAGE_KEY;
  const [isClient, setIsClient] = useState(false);
  const [state, setState] = useState<A11yState>(() => ({
    ...defaultState,
    language: options?.defaultLanguage || defaultState.language,
  }));
  const colorSliderRef = useRef<HTMLDivElement | null>(null);

  // Initialize client state from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(activeStorageKey);
      if (saved) {
        setState((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // Ignore
    }
  }, [activeStorageKey]);

  // Save to local storage
  const saveState = useCallback((newState: A11yState) => {
    setState(newState);
    try {
      localStorage.setItem(activeStorageKey, JSON.stringify(newState));
    } catch {
      // Ignore
    }
  }, [activeStorageKey]);

  // Apply Accessibility Classes & Styles to <html> and <body>
  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;
    const body = document.body;

    // 1. Font Scale
    root.classList.remove('a11y-font-1', 'a11y-font-2', 'a11y-font-3', 'a11y-font-4', 'a11y-font-5');
    if (state.fontScaleLevel > 0) {
      root.classList.add(`a11y-font-${state.fontScaleLevel}`);
    }

    // 2. Word Spacing
    root.classList.remove('a11y-word-1', 'a11y-word-2', 'a11y-word-3', 'a11y-word-4');
    if (state.wordSpacingLevel > 0) {
      root.classList.add(`a11y-word-${state.wordSpacingLevel}`);
    }

    // 3. Line Height
    root.classList.remove('a11y-line-1', 'a11y-line-2', 'a11y-line-3', 'a11y-line-4');
    if (state.lineHeightLevel > 0) {
      root.classList.add(`a11y-line-${state.lineHeightLevel}`);
    }

    // 4. Letter Spacing
    root.classList.remove('a11y-letter-1', 'a11y-letter-2', 'a11y-letter-3');
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

  // Color Spectrum Click Handler
  const handleColorSpectrumClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const selectedHue = Math.round(percentage * 360);

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
    colorSliderRef,
    currentTargetHue,
    currentLevel,
    maxLevel,
    handleColorSpectrumClick,
    handleResetColors,
    handleToggleCursor,
    handleStepperIncrease,
    handleStepperDecrease,
    resetAllState,
  };
}
