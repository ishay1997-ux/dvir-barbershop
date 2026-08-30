'use client';

import React from 'react';
import { Search, Sun, Moon, ShieldCheck, Bell } from 'lucide-react';
import type { AdminUser } from './types';

interface SuperAdminTopHeaderProps {
  adminTheme: 'dark' | 'light';
  adminUser: AdminUser | null;
  toggleAdminTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  newReportsCount: number;
}

export const SuperAdminTopHeader: React.FC<SuperAdminTopHeaderProps> = ({
  adminTheme,
  adminUser,
  toggleAdminTheme,
  searchQuery,
  onSearchChange,
  newReportsCount,
}) => {
  const displayName = adminUser?.displayName || 'ישי אטיאס';
  const roleTitle = adminUser?.role === 'super_admin' ? 'סופר אדמין' : 'מנהל מערכת';
  const initial = displayName.trim().charAt(0) || 'י';

  return (
    <header
      className={`h-16 px-6 border-b sticky top-0 z-30 flex items-center justify-between transition-colors select-none ${
        adminTheme === 'light'
          ? 'bg-white/95 backdrop-blur-md border-slate-200/80 text-slate-900'
          : 'bg-[#111215]/95 backdrop-blur-md border-white/10 text-white'
      }`}
      dir="rtl"
    >
      {/* Search Input Bar */}
      <div className="flex-1 max-w-sm relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="חיפוש מהיר של עסק, סניף, טלפון..."
          className={`w-full pr-9 pl-3 py-1.5 text-xs rounded-xl border outline-none transition-all ${
            adminTheme === 'light'
              ? 'bg-slate-50/80 border-slate-200 focus:bg-white focus:border-slate-400 text-slate-900 placeholder:text-slate-400'
              : 'bg-white/5 border-white/10 focus:border-white/20 text-white placeholder:text-zinc-500'
          }`}
        />
      </div>

      {/* Left: User Profile & Actions */}
      <div className="flex items-center gap-3">
        {newReportsCount > 0 && (
          <div className="relative p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
        )}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleAdminTheme}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            adminTheme === 'light'
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
          }`}
          title={adminTheme === 'light' ? 'החלף למצב כהה' : 'החלף למצב בהיר'}
        >
          {adminTheme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* User Profile Pill */}
        <div
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
            adminTheme === 'light'
              ? 'bg-slate-50/80 border-slate-200/80 text-slate-900'
              : 'bg-white/5 border-white/10 text-white'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {initial}
          </div>
          <div className="text-right leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">{displayName}</span>
            <span className="text-[10px] text-slate-400 font-medium block">{roleTitle}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
