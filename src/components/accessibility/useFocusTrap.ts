'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Stack of active traps: only the topmost one handles Tab, so a modal opened on top of the
// drawer (hide / reader / speech settings) is not fought by the drawer's own trap.
const trapStack: symbol[] = [];

interface FocusTrapOptions {
  /** Where focus goes when the trap deactivates. Defaults to the element focused before activation. */
  returnTo?: () => HTMLElement | null;
  /** Selector inside the container to focus on activation (default: first focusable). */
  initialFocus?: string;
}

/**
 * Traps Tab / Shift+Tab inside `ref` while `active`, moves focus in on activation, and restores
 * focus on deactivation (to the previously focused element if it still exists, else to the
 * widget trigger `#a11y-trigger-btn`, else nothing). Escape is NOT handled here — the widget's
 * global shortcut hook owns Escape so it keeps working from any element.
 */
export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  options?: FocusTrapOptions
) {
  const idRef = useRef<symbol>(Symbol('a11y-focus-trap'));
  const previousRef = useRef<HTMLElement | null>(null);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!active) return;
    const container = ref.current; // captured now: ref.current may be null by cleanup time
    const id = idRef.current;
    trapStack.push(id);
    previousRef.current = (document.activeElement as HTMLElement | null) ?? null;

    const getFocusable = (): HTMLElement[] => {
      const root = ref.current;
      if (!root) return [];
      return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
    };

    // Move focus in (next frame, after the enter animation has mounted the content)
    const raf = requestAnimationFrame(() => {
      const root = ref.current;
      if (!root) return;
      const initial = optionsRef.current?.initialFocus
        ? root.querySelector<HTMLElement>(optionsRef.current.initialFocus)
        : null;
      const target = initial ?? getFocusable()[0] ?? root;
      if (target === root && !root.hasAttribute('tabindex')) root.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (trapStack[trapStack.length - 1] !== id) return; // not the topmost trap
      const root = ref.current;
      if (!root) return;
      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      const inside = !!current && root.contains(current);
      if (e.shiftKey) {
        if (!inside || current === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      const idx = trapStack.lastIndexOf(id);
      if (idx >= 0) trapStack.splice(idx, 1);
      const preferred = optionsRef.current?.returnTo?.() ?? previousRef.current;
      const target =
        preferred && document.contains(preferred)
          ? preferred
          : (document.getElementById('a11y-trigger-btn') as HTMLElement | null);
      // Restore unless another element outside this container already holds focus (e.g. a trap
      // stacked above took it). While the container is still mounted for its exit animation,
      // focus is typically still inside it — that counts as "ours", so restore.
      const activeNow = document.activeElement as HTMLElement | null;
      const oursOrNowhere =
        !activeNow || activeNow === document.body || !document.contains(activeNow) || (!!container && container.contains(activeNow));
      if (target && oursOrNowhere) {
        target.focus({ preventScroll: true });
      }
    };
  }, [active, ref]);
}
