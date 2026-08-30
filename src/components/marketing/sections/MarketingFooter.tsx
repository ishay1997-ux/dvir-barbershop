'use client';

import React from 'react';
import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="py-14 bg-white border-t border-slate-200/80 text-center text-xs text-slate-500 space-y-6">
      {/* Live Niche Demos Row */}
      <div className="max-w-4xl mx-auto px-4">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-3">
          אתרי הדגמה חיים לפי ענף (Live Demos):
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-700">
          <Link
            href="/dvir"
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:text-indigo-600 transition-all"
          >
            💈 מספרת גברים (דביר)
          </Link>
          <Link
            href="/beauty"
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:text-indigo-600 transition-all"
          >
            💅 קוסמטיקה & ציפורניים
          </Link>
          <Link
            href="/spa"
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:text-indigo-600 transition-all"
          >
            🌿 ספא & טיפולי גוף
          </Link>
          <Link
            href="/trainer"
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:text-indigo-600 transition-all"
          >
            🏋️ כושר & אימונים אישיים
          </Link>
          <Link
            href="/clinic"
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:text-indigo-600 transition-all"
          >
            🩺 קליניקות & אסתטיקה
          </Link>
          <Link
            href="/services"
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:text-indigo-600 transition-all"
          >
            🔧 טכנאים & שירותי בית
          </Link>
        </div>
      </div>

      {/* Main & Legal Links */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-bold border-t border-slate-100 pt-6">
        <Link href="/admin/login" className="hover:text-indigo-600 transition-colors">
          כניסת מנהלי עסק
        </Link>
        <Link href="/super-admin" className="hover:text-indigo-600 transition-colors">
          Super Admin
        </Link>
        <Link href="/accessibility" className="hover:text-indigo-600 transition-colors">
          הצהרת נגישות
        </Link>
        <Link href="/terms" className="hover:text-indigo-600 transition-colors">
          תנאי שימוש
        </Link>
        <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
          מדיניות פרטיות
        </Link>
      </div>

      <p className="text-[11px] text-slate-400">
        © {new Date().getFullYear()} CutWeb Platform · כל הזכויות שמורות לפלטפורמת CutWeb
      </p>
    </footer>
  );
}
