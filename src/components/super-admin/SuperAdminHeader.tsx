'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Moon, Sun, Lock, ExternalLink } from 'lucide-react';

interface SuperAdminHeaderProps {
  adminTheme: 'dark' | 'light';
  adminUser: { email?: string; displayName?: string } | null;
  toggleAdminTheme: () => void;
  onLogout: () => void;
}

export const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({
  adminTheme,
  adminUser,
  toggleAdminTheme,
  onLogout,
}) => {
  return (
    <header
      className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
        adminTheme === 'light'
          ? 'bg-white/90 border-slate-200 shadow-xs'
          : 'bg-[#141414]/90 border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shadow-md ${
              adminTheme === 'light'
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-indigo-500 text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span
              className={`font-black text-sm block leading-tight ${
                adminTheme === 'light' ? 'text-slate-900' : 'text-white'
              }`}
            >
              Cut<span className="text-indigo-600">Web</span> · Super Admin
            </span>
            <span
              className={`text-[10px] font-bold ${
                adminTheme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
              }`}
            >
              Multi-Tenant Master Panel
            </span>
          </div>
        </div>

        {/* Theme & User Profile Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleAdminTheme}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              adminTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-400'
            }`}
            title={adminTheme === 'light' ? 'עבור למצב כהה' : 'עבור למצב בהיר'}
          >
            {adminTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {adminUser && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                adminTheme === 'light'
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-white/5 border-white/10 text-zinc-300'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold truncate max-w-[120px] sm:max-w-[200px]">
                {adminUser.displayName || adminUser.email}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onLogout}
            className={`text-xs px-3 py-2 rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
              adminTheme === 'light'
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-bold">התנתק</span>
          </button>

          <Link
            href="/"
            className={`text-xs px-3 py-2 rounded-xl transition-colors font-bold flex items-center gap-1.5 border ${
              adminTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">אתר שיווק ראשי</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
