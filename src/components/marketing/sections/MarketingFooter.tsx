'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';

interface MarketingFooterProps {
  onOpenOnboarding?: () => void;
}

export function MarketingFooter({ onOpenOnboarding }: MarketingFooterProps) {
  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
      {/* Pre-Footer Grand CTA Banner */}
      <div className="border-b border-slate-800 py-16 sm:py-24 px-4 sm:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-indigo-300 text-xs font-black backdrop-blur-md border border-white/10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>הקמה מיידית ב-60 שניות</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            מוכנים לקחת את העסק שלכם{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              לרמה הגבוהה ביותר?
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-sans">
            הצטרפו למאות ספרים, קוסמטיקאיות, מאמני כושר ומטפלים שכבר נהנים מיומן מלא, אפס ביטולים וחיסכון של שעות עבודה.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-sm sm:text-base transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>התחילו עכשיו בחינם</span>
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
            </button>

            <Link
              href="/dvir"
              target="_blank"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-bold transition-all flex items-center justify-center gap-1.5 hover:scale-105"
            >
              <span>צפו באתר חי לדוגמה ↗</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-sans pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ללא צורך בכרטיס אשראי · תמיכה מלאה בוואטסאפ בהקמה</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation & Credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
        {/* Niche Demo Portals */}
        <div className="space-y-3 text-center sm:text-right">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
            אתרי הדגמה חיים (Live Client Websites):
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-300">
            <Link
              href="/dvir"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
            >
              💈 מספרת גברים (דביר)
            </Link>
            <Link
              href="/beauty"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
            >
              💅 קוסמטיקה & ציפורניים (שירן)
            </Link>
            <Link
              href="/spa"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
            >
              🌿 ספא & עיסויים (לוטוס)
            </Link>
            <Link
              href="/trainer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
            >
              🏋️ מאמני כושר (אופק)
            </Link>
            <Link
              href="/clinic"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
            >
              🩺 קליניקות & אסתטיקה (ד״ר לוי)
            </Link>
            <Link
              href="/services"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
            >
              🔧 טכנאים ושירות (שרון)
            </Link>
          </div>
        </div>

        {/* Legal & Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-400 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-black text-white tracking-tight">CutWeb Studio</span>
            <span>· הפלטפורמה המתקדמת בישראל לניהול תורים ועסקים</span>
          </div>

          <div className="flex items-center gap-6 font-bold text-slate-400">
            <Link href="/admin/login" className="hover:text-white transition-colors">
              כניסת מנהלים
            </Link>
            <Link href="/super-admin" className="hover:text-white transition-colors">
              Super Admin
            </Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">
              נגישות
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              תנאי שימוש
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              פרטיות
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
