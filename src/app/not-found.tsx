import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E131F] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-indigo-500/20 shadow-lg">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase">
            שגיאה 404 · העמוד לא נמצא
          </span>
          <h1 className="text-2xl font-black text-white">הגעת לכתובת שאינה קיימת</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            העמוד שחיפשת אינו קיים או שהועבר לכתובת אחרת בפלטפורמת CutWeb OS.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>חזרה לאתר הראשי</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
          <Link
            href="/admin"
            className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700 flex items-center justify-center"
          >
            פורטל ניהול
          </Link>
        </div>
      </div>
    </div>
  );
}
