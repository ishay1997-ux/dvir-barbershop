'use client';

import React from 'react';
import { X, Printer } from 'lucide-react';
import { A11Y_I18N } from '../i18n';

interface ReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: typeof A11Y_I18N.he;
  currentDirection: 'rtl' | 'ltr';
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  isOpen,
  onClose,
  t,
  currentDirection,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] bg-white text-[#1C1C1C] p-6 sm:p-12 overflow-y-auto a11y-ignore"
      dir={currentDirection}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
          <div>
            <h2 className="text-2xl font-black">{t.readerTitle}</h2>
            <p className="text-xs text-[#6B6560]">{t.readerSubtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="bg-[#085B7A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#064961] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> {t.printBtn}
            </button>
            <button
              onClick={onClose}
              className="bg-zinc-200 hover:bg-zinc-300 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6 text-base sm:text-lg leading-relaxed">
          <section>
            <h3 className="text-xl font-bold mb-2">{t.readerAboutTitle}</h3>
            <p>{t.readerAboutContent}</p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">{t.readerServicesTitle}</h3>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>תספורת גברים פרימיום – ₪80 (30 דקות)</li>
              <li>עיצוב ופיסול זקן Master – ₪40 (20 דקות)</li>
              <li>חבילת VIP משולבת (תספורת + זקן) – ₪110 (45 דקות)</li>
              <li>תספורת ילדים ונוער – ₪70 (30 דקות)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
