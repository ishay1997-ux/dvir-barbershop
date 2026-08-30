'use client';

import React from 'react';
import { Building2, Bug, Calendar, Settings2 } from 'lucide-react';
import type { Business, BugReport } from './types';

interface SuperAdminStatsBarProps {
  adminTheme: 'dark' | 'light';
  businesses: Business[];
  reports: BugReport[];
}

export const SuperAdminStatsBar: React.FC<SuperAdminStatsBarProps> = ({
  adminTheme,
  businesses,
  reports,
}) => {
  const newReportsCount = reports.filter((r) => r.status === 'new').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Active Businesses */}
      <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${
          adminTheme === 'light'
            ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
            : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-bold ${
              adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
            }`}
          >
            מספרות ועסקים פעילים
          </span>
          <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-amber-50' : 'bg-white/5'}`}>
            <Building2 className="w-4 h-4 text-[#C9A84C]" />
          </div>
        </div>
        <div
          className={`text-2xl font-black ${
            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
          }`}
        >
          {businesses.length}
        </div>
        <span className="text-[10px] text-[#B89230] font-bold">The Cut Multi-Tenant</span>
      </div>

      {/* 2. Bug Reports */}
      <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${
          adminTheme === 'light'
            ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
            : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-bold ${
              adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
            }`}
          >
            דיווחי תקלות חדשים
          </span>
          <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-rose-50' : 'bg-white/5'}`}>
            <Bug className="w-4 h-4 text-rose-500" />
          </div>
        </div>
        <div className="text-2xl font-black text-rose-500">
          {newReportsCount}
        </div>
        <span
          className={`text-[10px] ${
            adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-400'
          }`}
        >
          מתוך {reports.length} סך הכל
        </span>
      </div>

      {/* 3. Platform Status */}
      <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${
          adminTheme === 'light'
            ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
            : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-bold ${
              adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
            }`}
          >
            תורים בפלטפורמה
          </span>
          <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-amber-50' : 'bg-white/5'}`}>
            <Calendar className="w-4 h-4 text-[#C9A84C]" />
          </div>
        </div>
        <div
          className={`text-2xl font-black ${
            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
          }`}
        >
          פעיל
        </div>
        <span
          className={`text-[10px] ${
            adminTheme === 'light' ? 'text-emerald-600 font-semibold' : 'text-emerald-400'
          }`}
        >
          סנכרון ענן בזמן אמת
        </span>
      </div>

      {/* 4. Customization */}
      <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${
          adminTheme === 'light'
            ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
            : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-bold ${
              adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
            }`}
          >
            התאמה אישית
          </span>
          <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-emerald-50' : 'bg-white/5'}`}>
            <Settings2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div
          className={`text-2xl font-black ${
            adminTheme === 'light' ? 'text-emerald-600' : 'text-emerald-400'
          }`}
        >
          100%
        </div>
        <span
          className={`text-[10px] ${
            adminTheme === 'light' ? 'text-emerald-600 font-semibold' : 'text-emerald-400'
          }`}
        >
          מיתוג & מחירון דינמי
        </span>
      </div>
    </div>
  );
};
