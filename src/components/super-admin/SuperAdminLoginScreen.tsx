'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

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
      className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
        adminTheme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#121212] text-white'
      }`}
      dir="rtl"
    >
      <div
        className={`max-w-md w-full rounded-3xl p-8 shadow-2xl border transition-all text-center ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200 shadow-slate-200/50'
            : 'bg-[#1C1C1C] border-[#C9A84C]/30 shadow-black/60'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />
        </div>

        <h1
          className={`text-xl font-black mb-1 ${
            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
          }`}
        >
          The Cut · Super Admin
        </h1>
        <p
          className={`text-xs mb-6 ${
            adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
          }`}
        >
          פורטל ניהול-על רב-עסקי (Multi-Tenant Master Panel)
        </p>

        <div className="space-y-3">
          <button
            onClick={onGoogleLogin}
            disabled={googleLoading}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md border ${
              adminTheme === 'light'
                ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-slate-200'
                : 'bg-white hover:bg-gray-100 text-black border-transparent shadow-lg'
            } disabled:opacity-50`}
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>התחבר עם חשבון Google מורשה</span>
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-zinc-500">
          גישה מאובטחת למורשים בלבד · CutWeb Platform v2.1
        </div>
      </div>
    </div>
  );
};
