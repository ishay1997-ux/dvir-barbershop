'use client';

import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Zap,
  BarChart3,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

interface SuperAdminLoginScreenProps {
  adminTheme: 'dark' | 'light';
  googleLoading: boolean;
  onGoogleLogin: () => void;
}

export const SuperAdminLoginScreen: React.FC<SuperAdminLoginScreenProps> = ({
  adminTheme,
  googleLoading,
  onGoogleLogin,
}) => {
  return (
    <div
      className="min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-[#F8FAFC] text-slate-900 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white"
      dir="rtl"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform hover:scale-102"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20 text-lg">
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-slate-900 tracking-tight">CutWeb</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                Super Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">פורטל ניהול-על רב-עסקי</p>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-sm text-xs font-bold transition-all"
        >
          <span>חזרה לאתר הראשי</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </Link>
      </header>

      {/* Main Center Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-100/60 border border-slate-200/90 text-center relative transition-all">
          
          {/* Welcoming Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>מרכז השליטה והניהול הגלובלי</span>
          </div>

          {/* Master Icon */}
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 text-white flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-600/25 ring-8 ring-indigo-50 transform hover:scale-105 transition-transform">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            ברוכים הבאים ל-CutWeb OS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 font-sans leading-relaxed">
            שלום! אנא התחבר עם חשבון ה-Google המורשה שלך כדי לגשת לניהול העסקים, הלידים ודיווחי המערכת.
          </p>

          {/* Friendly Feature Highlights */}
          <div className="grid grid-cols-3 gap-2 mb-8 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
            <div className="flex flex-col items-center text-center p-1.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center mb-1 shadow-xs">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-tight">כל העסקים</span>
            </div>

            <div className="flex flex-col items-center text-center p-1.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-1 shadow-xs">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-tight">זמן אמת</span>
            </div>

            <div className="flex flex-col items-center text-center p-1.5">
              <div className="w-7 h-7 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center mb-1 shadow-xs">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-tight">בקרת-על</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={onGoogleLogin}
            disabled={googleLoading}
            className="w-full py-4 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-indigo-400 shadow-md shadow-slate-200/60 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 group transform active:scale-98"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>התחברות מהירה עם חשבון Google מורשה</span>
          </button>

          {/* Trust Guarantee Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-sans">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>חיבור מאובטח בתקן SSL/TLS · גישה מוגבלת למנהלים</span>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 py-4 border-t border-slate-200/60 text-xs text-slate-400 text-center sm:text-right font-sans">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>מערכת הענן ושרתי ה-API פעילים ותקינים</span>
        </div>
        <div>
          CutWeb Platform v2.2 · כל הזכויות שמורות
        </div>
      </footer>
    </div>
  );
};
