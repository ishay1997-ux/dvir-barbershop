'use client';

import { useState, useEffect, useCallback } from 'react';
import type { A11yState } from './types';

interface UseA11yShortcutsParams {
  /** Current layer flags — Escape dismisses only the topmost open layer. */
  isLanguageOpen?: boolean;
  showReaderModal?: boolean;
  isHideModalOpen?: boolean;
  setState: React.Dispatch<React.SetStateAction<A11yState>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLanguageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowReaderModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useA11yShortcuts({
  isLanguageOpen = false,
  showReaderModal = false,
  isHideModalOpen = false,
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
      // Do not steal the toggle shortcuts while the user types in the host page (or when the host
      // already handled the key). Escape is never suppressed — it must work from any element.
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const inputType = tag === 'INPUT' ? (target as HTMLInputElement).type : '';
      const isTextEntry =
        !!target &&
        (tag === 'TEXTAREA' ||
          target.isContentEditable ||
          (tag === 'INPUT' && !['radio', 'checkbox', 'range', 'button', 'submit', 'reset', 'file', 'color'].includes(inputType)));
      const insideWidget = !!target?.closest?.('.a11y-ignore');
      const toggleAllowed = !e.defaultPrevented && (!isTextEntry || insideWidget);
      // Open / Close Drawer
      if (
        toggleAllowed &&
        ((e.altKey && (e.code === 'KeyA' || e.key === 'a' || e.key === 'A' || e.key === 'ש')) || // e.code: macOS Option+A yields 'å'
          (e.ctrlKey && e.key === 'F10'))
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Blind / Screen-Reader / Keyboard Mode Toggle
      if (toggleAllowed && e.ctrlKey && e.key === 'F11') {
        e.preventDefault();
        setState((prev) => ({
          ...prev,
          keyboardNav: !prev.keyboardNav,
        }));
      }
      // Close
      // Escape closes the TOPMOST layer only (never during IME composition)
      if (e.key === 'Escape' && !e.isComposing) {
        if (isHideModalOpen) { setIsHideModalOpen(false); return; }
        if (showReaderModal) { setShowReaderModal(false); return; }
        if (isLanguageOpen) { setIsLanguageOpen(false); return; }
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setState, setIsOpen, setIsLanguageOpen, setShowReaderModal, setIsHideModalOpen, isLanguageOpen, showReaderModal, isHideModalOpen]);

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
