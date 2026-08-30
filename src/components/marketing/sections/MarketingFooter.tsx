'use client';

import React from 'react';
import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="py-12 bg-white border-t border-slate-200/80 text-center text-xs text-slate-500 space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-bold">
        <Link href="/dvir" className="hover:text-indigo-600 transition-colors">
          אתר לדוגמה (Live Demo)
        </Link>
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
      <p>© {new Date().getFullYear()} CutWeb Platform · כל הזכויות שמורות לפלטפורמת CutWeb</p>
    </footer>
  );
}
