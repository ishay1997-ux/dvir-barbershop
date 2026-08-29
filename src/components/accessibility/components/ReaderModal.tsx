'use client';

import React, { useMemo } from 'react';
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

  if (!isOpen) return null;

  const displayTitle = siteName
    ? `${siteName} – ${t.readerTitle || 'תצוגת קריאה נגישה'}`
    : t.readerTitle || 'תצוגת קריאה נגישה';

  return (
    <div
      className="fixed inset-0 z-[999999] bg-white text-[#1C1C1C] p-6 sm:p-12 overflow-y-auto a11y-ignore font-sans select-text"
      dir={currentDirection}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header with Title and Print / Close buttons */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-slate-900 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {displayTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {t.readerSubtitle || 'מותאם להדפסה ולקריאה מוגדלת ברורה'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="bg-[#085B7A] text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" /> {t.printBtn}
            </button>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Page Content Rendered in High-Legibility Mode */}
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-800">
          {pageSections.length > 0 ? (
            pageSections.map((sec, idx) => {
              if (sec.tag === 'h1') {
                return (
                  <h1 key={idx} className="text-2xl sm:text-3xl font-black text-[#085B7A] pt-4 pb-1 border-b border-slate-200">
                    {sec.text}
                  </h1>
                );
              }
              if (sec.tag === 'h2' || sec.tag === 'h3') {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 pt-3">
                    {sec.text}
                  </h2>
                );
              }
              if (sec.tag === 'h4') {
                return (
                  <h3 key={idx} className="text-lg font-bold text-slate-800 pt-2">
                    {sec.text}
                  </h3>
                );
              }
              if (sec.tag === 'li') {
                return (
                  <li key={idx} className="mr-5 ml-5 list-disc leading-relaxed text-slate-700">
                    {sec.text}
                  </li>
                );
              }
              return (
                <p key={idx} className="leading-relaxed text-slate-700">
                  {sec.text}
                </p>
              );
            })
          ) : (
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-bold mb-2">{t.readerAboutTitle}</h3>
                <p>{t.readerAboutContent}</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
