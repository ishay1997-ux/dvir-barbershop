'use client';

import React, { useRef, useMemo } from 'react';
import { useFocusTrap } from '../useFocusTrap';
import { X, Printer } from 'lucide-react';
import { A11Y_I18N } from '../i18n';

interface ReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
  t: typeof A11Y_I18N.he;
  currentDirection: 'rtl' | 'ltr';
}

interface PageSection {
  tag: string;
  text: string;
  isHeading: boolean;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  isOpen,
  onClose,
  siteName,
  t,
  currentDirection,
}) => {
  // Dynamically extract page readable content
  const pageSections = useMemo<PageSection[]>(() => {
    if (!isOpen || typeof document === 'undefined') return [];

    const mainContainer =
      document.querySelector('main') ||
      document.querySelector('article') ||
      document.body;

    const elements = Array.from(
      mainContainer.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, p, li, blockquote'
      )
    );

    const extracted: PageSection[] = [];
    const seen = new Set<string>();

    elements.forEach((el) => {
      if (el.closest('.a11y-ignore')) return;
      const text = (el.innerText || el.textContent || '').trim();
      if (text.length < 3 || seen.has(text)) return;
      seen.add(text);

      const tag = el.tagName.toLowerCase();
      const isHeading = ['h1', 'h2', 'h3', 'h4'].includes(tag);
      extracted.push({ tag, text, isHeading });
    });

    return extracted;
  }, [isOpen]);

  const readerRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(readerRef, isOpen);

  if (!isOpen) return null;

  const displayTitle = siteName
    ? `${siteName} – ${t.readerTitle || 'תצוגת קריאה נגישה'}`
    : t.readerTitle || 'תצוגת קריאה נגישה';

  return (
    <div
      ref={readerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-reader-title"
      className="acc:fixed acc:inset-0 acc:z-[999999] acc:bg-white acc:text-[#1C1C1C] acc:p-6 acc:sm:p-12 acc:overflow-y-auto a11y-widget-root a11y-ignore acc:font-sans acc:select-text"
      dir={currentDirection}
    >
      <div className="acc:max-w-3xl acc:mx-auto">
        {/* Header with Title and Print / Close buttons */}
        <div className="acc:flex acc:items-center acc:justify-between acc:pb-4 acc:mb-6 acc:border-b-2 acc:border-slate-900 acc:gap-3">
          <div>
            <h2 id="a11y-reader-title" className="acc:text-xl acc:sm:text-2xl acc:font-black acc:text-slate-900 acc:leading-tight">
              {displayTitle}
            </h2>
            <p className="acc:text-xs acc:text-slate-500 acc:font-medium acc:mt-1">
              {t.readerSubtitle || 'מותאם להדפסה ולקריאה מוגדלת ברורה'}
            </p>
          </div>

          <div className="acc:flex acc:items-center acc:gap-2.5 acc:shrink-0">
            <button
              onClick={() => window.print()}
              className="acc:bg-[#085B7A] acc:text-white acc:px-3.5 acc:sm:px-4 acc:py-2 acc:rounded-xl acc:text-xs acc:font-bold acc:flex acc:items-center acc:gap-1.5 acc:hover:bg-[#064961] acc:active:scale-95 acc:transition-all acc:cursor-pointer acc:shadow-xs"
            >
              <Printer className="acc:w-4 acc:h-4" /> {t.printBtn}
            </button>
            <button
              onClick={onClose}
              className="acc:bg-slate-100 acc:hover:bg-slate-200 acc:text-slate-700 acc:p-2 acc:rounded-xl acc:text-xs acc:font-bold acc:transition-colors acc:cursor-pointer"
              aria-label={t.close}
            >
              <X className="acc:w-5 acc:h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Page Content Rendered in High-Legibility Mode */}
        <div className="acc:space-y-4 acc:text-base acc:sm:text-lg acc:leading-relaxed acc:text-slate-800">
          {pageSections.length > 0 ? (
            pageSections.map((sec, idx) => {
              if (sec.tag === 'h1') {
                return (
                  <h1 key={idx} className="acc:text-2xl acc:sm:text-3xl acc:font-black acc:text-[#085B7A] acc:pt-4 acc:pb-1 acc:border-b acc:border-slate-200">
                    {sec.text}
                  </h1>
                );
              }
              if (sec.tag === 'h2' || sec.tag === 'h3') {
                return (
                  <h2 key={idx} className="acc:text-xl acc:sm:text-2xl acc:font-bold acc:text-slate-900 acc:pt-3">
                    {sec.text}
                  </h2>
                );
              }
              if (sec.tag === 'h4') {
                return (
                  <h3 key={idx} className="acc:text-lg acc:font-bold acc:text-slate-800 acc:pt-2">
                    {sec.text}
                  </h3>
                );
              }
              if (sec.tag === 'li') {
                return (
                  <li key={idx} className="acc:mr-5 acc:ml-5 acc:list-disc acc:leading-relaxed acc:text-slate-700">
                    {sec.text}
                  </li>
                );
              }
              return (
                <p key={idx} className="acc:leading-relaxed acc:text-slate-700">
                  {sec.text}
                </p>
              );
            })
          ) : (
            <div className="acc:space-y-6">
              <section>
                <h3 className="acc:text-xl acc:font-bold acc:mb-2">{t.readerAboutTitle}</h3>
                <p>{t.readerAboutContent}</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
