'use client';

import { useState, useEffect, useCallback } from 'react';
import type { A11yState } from './types';

interface UseA11yShortcutsParams {
  setState: React.Dispatch<React.SetStateAction<A11yState>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLanguageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowReaderModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useA11yShortcuts({
  setState,
  setIsOpen,
  setIsLanguageOpen,
  setShowReaderModal,
  setIsHideModalOpen,
}: UseA11yShortcutsParams) {
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );

  // Listen to focus events to support virtual keyboard typing into any active input
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
        !target.closest('.a11y-ignore')
      ) {
        setActiveInput(target as HTMLInputElement | HTMLTextAreaElement);
      }
    };

    window.addEventListener('focusin', handleFocus);
    return () => window.removeEventListener('focusin', handleFocus);
  }, []);

  // Global Keyboard Shortcuts: Alt+A, Ctrl+F10 (opens drawer), Ctrl+F11 (toggle blind / keyboard nav mode), Escape (closes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open / Close Drawer
      if (
        (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) ||
        (e.ctrlKey && e.key === 'F10')
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Blind / Screen-Reader / Keyboard Mode Toggle
      if (e.ctrlKey && e.key === 'F11') {
        e.preventDefault();
        setState((prev) => ({
          ...prev,
          keyboardNav: !prev.keyboardNav,
        }));
      }
      // Close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsLanguageOpen(false);
        setShowReaderModal(false);
        setIsHideModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setState, setIsOpen, setIsLanguageOpen, setShowReaderModal, setIsHideModalOpen]);

  // Virtual Keyboard Actions
  const handleVirtualKeyPress = useCallback(
    (char: string) => {
      if (!activeInput) return;
      const start = activeInput.selectionStart || activeInput.value.length;
      const end = activeInput.selectionEnd || activeInput.value.length;
      const val = activeInput.value;
      const newVal = val.slice(0, start) + char + val.slice(end);
      activeInput.value = newVal;
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.setSelectionRange(start + char.length, start + char.length);
      activeInput.focus();
    },
    [activeInput]
  );

  const handleVirtualBackspace = useCallback(() => {
    if (!activeInput) return;
    const start = activeInput.selectionStart || activeInput.value.length;
    const end = activeInput.selectionEnd || activeInput.value.length;
    const val = activeInput.value;
    if (start === end && start > 0) {
      activeInput.value = val.slice(0, start - 1) + val.slice(end);
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.setSelectionRange(start - 1, start - 1);
    } else if (start !== end) {
      activeInput.value = val.slice(0, start) + val.slice(end);
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.setSelectionRange(start, start);
    }
    activeInput.focus();
  }, [activeInput]);

  return {
    activeInput,
    handleVirtualKeyPress,
    handleVirtualBackspace,
  };
}
