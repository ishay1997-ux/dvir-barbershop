'use client';

import React from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Phone,
  MessageCircle,
  Calendar,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import type { BugReport } from './types';
import { CustomerAppointmentsLookup } from './CustomerAppointmentsLookup';

interface ReportsTabProps {
  reports: BugReport[];
  statusFilter: 'all' | 'new' | 'in_progress' | 'resolved';
  reportsLoading: boolean;
  adminTheme: 'dark' | 'light';
  onFilterChange: (status: 'all' | 'new' | 'in_progress' | 'resolved') => void;
  onRefresh: () => void;
  onStatusChange: (id: string, newStatus: BugReport['status']) => void;
  onDeleteReport: (id: string) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  reports,
  statusFilter,
  reportsLoading,
  adminTheme,
  onFilterChange,
  onRefresh,
  onStatusChange,
  onDeleteReport,
}) => {
  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-colors ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200 shadow-xs'
            : 'bg-[#1C1C1C] border-white/10'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold ${
              adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
            }`}
          >
            סנן לפי סטטוס:
          </span>
          <div className="flex gap-1.5">
            {(['all', 'new', 'in_progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => onFilterChange(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : adminTheme === 'light'
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {st === 'all' && 'הכל'}
                {st === 'new' && 'חדש 🟢'}
                {st === 'in_progress' && 'בטיפול 🟡'}
                {st === 'resolved' && 'טופל ⚪'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={reportsLoading}
          className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl border cursor-pointer transition-colors ${
            adminTheme === 'light'
              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${reportsLoading ? 'animate-spin' : ''}`} />
          <span>רענן פניות</span>
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-3">
          {filteredReports.map((r) => (
            <div
              key={r.id}
              className={`border rounded-2xl p-5 shadow-xs transition-all ${
                adminTheme === 'light'
                  ? r.status === 'new'
                    ? 'border-emerald-300 bg-emerald-50/40 text-slate-900'
                    : r.status === 'in_progress'
                    ? 'border-amber-300 bg-amber-50/40 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-900 opacity-80'
                  : r.status === 'new'
                  ? 'border-emerald-500/40 bg-emerald-950/5'
                  : r.status === 'in_progress'
                  ? 'border-amber-500/40 bg-amber-950/5'
                  : 'border-white/10 opacity-75'
              }`}
            >
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b mb-3 ${
                  adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-black text-sm ${
                      adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {r.fullName}
                  </span>
                  <span className="text-xs text-[#B89230] bg-[#C9A84C]/15 px-2 py-0.5 rounded-md font-bold">
                    {r.category}
                  </span>
                  <span
                    className={`text-[11px] ${
                      adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                    }`}
                  >
                    📍 {r.businessName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status dropdown */}
                  <select
                    value={r.status}
                    onChange={(e) => onStatusChange(r.id, e.target.value as any)}
                    className={`border rounded-xl px-2.5 py-1 text-xs font-bold outline-none cursor-pointer ${
                      adminTheme === 'light'
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-[#141414] border-white/15 text-white'
                    }`}
                  >
                    <option value="new">חדש 🟢</option>
                    <option value="in_progress">בטיפול 🟡</option>
                    <option value="resolved">טופל ונסגר ⚪</option>
                  </select>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteReport(r.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="מחק דיווח"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <p
                className={`text-sm leading-relaxed p-3.5 rounded-xl border mb-3 font-sans ${
                  adminTheme === 'light'
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-[#141414] border-white/5 text-zinc-200'
                }`}
              >
                {r.message}
              </p>

              {/* Intelligent Appointment Helper for this Customer */}
              <CustomerAppointmentsLookup
                phone={r.phone}
                customerName={r.fullName}
                businessName={r.businessName}
              />

              {/* Contact Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={`tel:${r.phone}`}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A84C]" /> {r.phone}
                  </a>
                  <a
                    href={`https://wa.me/972${r.phone
                      .replace(/\D/g, '')
                      .replace(/^0/, '')}?text=${encodeURIComponent(
                      `היי ${r.fullName}, קיבלנו את פנייתך במערכת בנושא "${r.category}". נשמח לסייע:`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 font-bold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> מענה בוואטסאפ ללקוח
                  </a>
                  <Link
                    href="/admin/appointments"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[#967425] hover:text-[#7A5D1C] bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 font-bold transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" /> יומן תורים של {r.businessName} ↗
                  </Link>
                </div>

                <span
                  className={`text-[11px] ${
                    adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                  }`}
                  dir="ltr"
                >
                  {new Date(r.createdAt).toLocaleString('he-IL')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`rounded-2xl p-10 text-center border ${
            adminTheme === 'light'
              ? 'bg-white border-slate-200 text-slate-600 shadow-xs'
              : 'bg-[#1C1C1C] border-white/10 text-zinc-400'
          }`}
        >
          <CheckCircle className="w-10 h-10 text-emerald-500/50 mx-auto mb-2" />
          <p
            className={`text-sm font-bold mb-1 ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            אין פניות או תקלות בסטטוס זה
          </p>
          <p className="text-xs">כל הדיווחים מטופס "דווחו לנו על תקלה" יופיעו כאן בזמן אמת.</p>
        </div>
      )}
    </div>
  );
};
