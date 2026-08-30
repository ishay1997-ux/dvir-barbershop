'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Building2,
  Calendar,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  User,
  Filter,
} from 'lucide-react';
import type { LeadPayload } from '@/app/api/leads/route';

interface LeadsTabProps {
  adminTheme: 'dark' | 'light';
  onConvertLeadToBusiness: (lead: LeadPayload) => void;
}

export const LeadsTab: React.FC<LeadsTabProps> = ({
  adminTheme,
  onConvertLeadToBusiness,
}) => {
  const [leads, setLeads] = useState<LeadPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'converted'>('all');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'converted' | 'archived') => {
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פנייה זו?')) return;
    try {
      await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (l.ownerName || '').toLowerCase().includes(q);
      const matchBiz = (l.businessName || '').toLowerCase().includes(q);
      const matchPhone = (l.phone || '').toLowerCase().includes(q);
      const matchInd = (l.industry || '').toLowerCase().includes(q);
      if (!matchName && !matchBiz && !matchPhone && !matchInd) return false;
    }
    return true;
  });

  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="space-y-6 select-none" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-lg font-black tracking-tight ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            לידים והרשמות חדשות מהאתר
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            מעקב אחר עסקים ובעלי מקצוע שנרשמו באתר השיווק וממתינים להקמת מערכת
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
                : 'bg-white/5 border-white/10 text-zinc-300'
            }`}
          >
            <span className="text-[11px] text-slate-400 font-medium">פניות חדשות:</span>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
              {newCount} <span className="text-[10px] text-slate-400 font-normal">/ {leads.length}</span>
            </span>
          </div>

          <button
            onClick={fetchLeads}
            disabled={loading}
            className={`p-2 rounded-xl border cursor-pointer transition-colors ${
              adminTheme === 'light'
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
            }`}
            title="רענן רשימה"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
          adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#15161A] border-white/10'
        }`}
      >
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          {[
            { id: 'all' as const, label: 'הכל', count: leads.length },
            { id: 'new' as const, label: 'חדש 🔔', count: newCount },
            { id: 'contacted' as const, label: 'נוצר קשר', count: leads.filter((l) => l.status === 'contacted').length },
            { id: 'converted' as const, label: 'הוקם עסק ✓', count: leads.filter((l) => l.status === 'converted').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-950 shadow-xs font-bold dark:bg-white/15 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש לפי שם, עסק, טלפון..."
            className={`w-full pr-9 pl-3 py-1.5 text-xs rounded-xl border outline-none ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                : 'bg-white/5 border-white/10 text-white placeholder:text-zinc-500'
            }`}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200 shadow-xs'
            : 'bg-[#15161A] border-white/10 shadow-lg'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse" dir="rtl">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold tracking-wider ${
                  adminTheme === 'light'
                    ? 'bg-slate-50/70 border-slate-200 text-slate-500'
                    : 'bg-white/5 border-white/10 text-zinc-400'
                }`}
              >
                <th className="py-3 px-4 w-52">שם העסק והענף</th>
                <th className="py-3 px-4 w-44">איש קשר וטלפון</th>
                <th className="py-3 px-4 w-28">מסלול מבוקש</th>
                <th className="py-3 px-4 w-44">עיר / הערות</th>
                <th className="py-3 px-4 w-32">סטטוס פנייה</th>
                <th className="py-3 px-4 text-center w-40">פעולות</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    אין לידים או פניות התואמות את הסינון
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const rawPhone = (lead.phone || '').replace(/\D/g, '').replace(/^0/, '972');

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors ${
                        adminTheme === 'light' ? 'hover:bg-slate-50/70' : 'hover:bg-white/5'
                      }`}
                    >
                      {/* 1. Business & Industry */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {lead.businessName}
                        </div>
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium block">
                          {lead.industry}
                        </span>
                      </td>

                      {/* 2. Contact & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-zinc-200">
                          {lead.ownerName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-slate-400 text-[11px] font-mono" dir="ltr">
                            {lead.phone}
                          </span>
                          <a
                            href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                              `היי ${lead.ownerName}! 👋\nראיתי שהשארת פנייה באתר CutWeb עבור "${lead.businessName}".\nאשמח לעזור לך להקים את האתר והמערכת!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-0.5 text-[#25D366] hover:opacity-80 transition-opacity"
                            title="פתח וואטסאפ"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* 3. Plan */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            lead.plan === 'team'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : lead.plan === 'starter'
                              ? 'bg-slate-100 text-slate-700 border border-slate-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {lead.plan}
                        </span>
                      </td>

                      {/* 4. City & Notes */}
                      <td className="py-3.5 px-4">
                        {lead.city && (
                          <span className="text-xs text-slate-700 dark:text-zinc-300 block font-medium">
                            📍 {lead.city}
                          </span>
                        )}
                        {lead.notes && (
                          <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                            "{lead.notes}"
                          </span>
                        )}
                      </td>

                      {/* 5. Status Select */}
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(
                              lead.id,
                              e.target.value as 'new' | 'contacted' | 'converted' | 'archived'
                            )
                          }
                          className={`px-2 py-1 text-[11px] font-bold rounded-lg border outline-none cursor-pointer ${
                            lead.status === 'new'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : lead.status === 'contacted'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : lead.status === 'converted'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="new">🔔 חדש</option>
                          <option value="contacted">💬 נוצר קשר</option>
                          <option value="converted">✓ הוקם עסק</option>
                          <option value="archived">ארכיון</option>
                        </select>
                      </td>

                      {/* 6. Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1-Click Convert to Business */}
                          <button
                            onClick={() => onConvertLeadToBusiness(lead)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                            title="הקם עסק במערכת מפרטי הליד"
                          >
                            <Plus className="w-3 h-3" />
                            <span>הקמת עסק</span>
                          </button>

                          {/* Delete Lead */}
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="מחק ליד"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
