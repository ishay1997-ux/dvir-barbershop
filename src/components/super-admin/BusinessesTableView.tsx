'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  ExternalLink,
  Key,
  Trash2,
  Copy,
  Download,
  MessageCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  Building2,
  Sparkles,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import type { Business } from './types';

interface BusinessesTableViewProps {
  businesses: Business[];
  businessesLoading: boolean;
  adminTheme: 'dark' | 'light';
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (biz: Business) => void;
  onCloneBusiness?: (biz: Business) => void;
  onDeleteBusiness: (slug: string, name: string) => void;
  searchQuery: string;
}

export const BusinessesTableView: React.FC<BusinessesTableViewProps> = ({
  businesses,
  businessesLoading,
  adminTheme,
  onRefresh,
  onOpenCreateModal,
  onOpenEditModal,
  onCloneBusiness,
  onDeleteBusiness,
  searchQuery,
}) => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filtered = businesses.filter((biz) => {
    // Status filter
    if (statusFilter !== 'all' && biz.status !== statusFilter) return false;
    // Plan filter
    if (planFilter !== 'all' && biz.plan !== planFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (biz.name || '').toLowerCase().includes(q);
      const matchSlug = (biz.slug || '').toLowerCase().includes(q);
      const matchOwner = (biz.ownerName || '').toLowerCase().includes(q);
      const matchPhone = (biz.phone || '').toLowerCase().includes(q);
      if (!matchName && !matchSlug && !matchOwner && !matchPhone) return false;
    }
    return true;
  });

  const activeCount = businesses.filter((b) => b.status === 'active').length;
  const pendingCount = businesses.filter((b) => b.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Mini KPI Cards (REGIN Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-xl font-black ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            ניהול מספרות ועסקים
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            מעקב אחר כל העסקים שנפתחו, התאמה אישית, מחירונים וחיבורי דומיינים
          </p>
        </div>

        {/* Small KPI Badges */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2.5 rounded-2xl border text-center ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <span className="text-xs font-bold text-slate-400 block">עסקים פעילים</span>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-base font-black text-teal-600">{activeCount}</span>
              <span className="text-[11px] text-slate-400">/ {businesses.length}</span>
            </div>
          </div>

          <div
            className={`px-4 py-2.5 rounded-2xl border text-center ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <span className="text-xs font-bold text-slate-400 block">זמן תגובה וענן</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">100% תקין</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters (REGIN Style) */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200/90 shadow-xs'
            : 'bg-[#181818] border-white/10'
        }`}
      >
        {/* Left/Start: Primary Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>הקמת עסק חדש במערכת</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={businessesLoading}
            className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
            }`}
            title="רענן רשימה"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${businessesLoading ? 'animate-spin text-teal-600' : ''}`}
            />
          </button>
        </div>

        {/* Center: Segmented Status Filter Tabs (REGIN Style) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          {[
            { id: 'all' as const, label: 'הכל', count: businesses.length },
            { id: 'active' as const, label: 'פעילים', count: activeCount },
            { id: 'pending' as const, label: 'בהמתנה', count: pendingCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-white text-teal-800 shadow-xs dark:bg-teal-600 dark:text-white font-black'
                  : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.id
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-200 font-bold'
                    : 'bg-slate-200/70 text-slate-600 dark:bg-white/10 dark:text-zinc-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Plan Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border outline-none font-bold cursor-pointer transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'
                : 'bg-white/5 border-white/10 text-white focus:bg-zinc-800'
            }`}
          >
            <option value="all">כל המסלולים</option>
            <option value="starter">Starter (0 ₪)</option>
            <option value="pro">Pro (59 ₪)</option>
            <option value="team">Team (119 ₪)</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Main Data Table (High-End Enterprise View) */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200/90 shadow-xs'
            : 'bg-[#181818] border-white/10 shadow-lg'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs" dir="rtl">
            <thead
              className={`border-b text-slate-400 font-bold ${
                adminTheme === 'light' ? 'bg-slate-50/70 border-slate-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <tr>
                <th className="py-3.5 px-4">עסק ומיתוג</th>
                <th className="py-3.5 px-4">איש קשר וטלפון</th>
                <th className="py-3.5 px-4">סניפים ושירותים</th>
                <th className="py-3.5 px-4">חבילת מנוי</th>
                <th className="py-3.5 px-4">צבע מיתוג</th>
                <th className="py-3.5 px-4">סטטוס</th>
                <th className="py-3.5 px-4 text-center">פעולות</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((biz) => {
                const bizColor = biz.themeColor || '#C9A84C';
                const initial = (biz.name || 'ע').trim().charAt(0);

                return (
                  <tr
                    key={biz.id}
                    className={`group transition-colors ${
                      adminTheme === 'light' ? 'hover:bg-slate-50/80' : 'hover:bg-white/5'
                    }`}
                  >
                    {/* 1. Business Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs"
                          style={{
                            backgroundColor: `${bizColor}18`,
                            color: bizColor,
                            border: `1.5px solid ${bizColor}50`,
                          }}
                        >
                          {initial}
                        </div>
                        <div>
                          <span
                            className={`font-black text-sm block ${
                              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            {biz.name}
                          </span>
                          <span className="text-[11px] font-bold text-teal-600 block" dir="ltr">
                            {`thecut.co.il/${biz.slug}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Owner & Contact */}
                    <td className="py-4 px-4">
                      <span
                        className={`font-bold block ${
                          adminTheme === 'light' ? 'text-slate-800' : 'text-zinc-200'
                        }`}
                      >
                        {biz.ownerName || 'לא צוין'}
                      </span>
                      <span className="text-slate-400 text-[11px] block font-mono" dir="ltr">
                        {biz.phone}
                      </span>
                      <a
                        href={`https://wa.me/${(biz.phone || '').replace(/\D/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(
                          `היי ${biz.ownerName || 'יקר/ה'}! 🎉\nהאתר והמערכת שלך עבור "${biz.name}" מוכנים באוויר!\n\n🌐 קישור לאתר הלקוחות:\nhttps://thecut.co.il/${biz.slug}\n\n🔐 קישור לפאנל הניהול שלך:\nhttps://thecut.co.il/admin/login`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8F7F3] hover:bg-[#D1F2EB] text-[#00796B] border border-[#B2DFDB] transition-colors cursor-pointer"
                        title="שלח קישורים ישירות לוואטסאפ של בעל העסק"
                      >
                        <MessageCircle className="w-3 h-3 text-[#25D366]" />
                        <span>וואטסאפ לבעל העסק</span>
                      </a>
                    </td>

                    {/* 3. Branches & Services */}
                    <td className="py-4 px-4">
                      <span className="text-slate-600 dark:text-zinc-300 font-medium block">
                        {biz.branches?.length || biz.branchesCount || 1} סניפים
                      </span>
                      <span className="text-slate-400 text-[11px] block">
                        {biz.services?.length || 3} שירותים במחירון
                      </span>
                    </td>

                    {/* 4. Plan */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${
                          biz.plan === 'team'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300'
                            : biz.plan === 'starter'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/10 dark:text-zinc-300'
                            : biz.plan === 'enterprise'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300'
                        }`}
                      >
                        {biz.plan || 'pro'} Plan
                      </span>
                    </td>

                    {/* 5. Business Swatch Dot (isolated tenant palette) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-xs"
                          style={{ backgroundColor: bizColor }}
                        />
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          {bizColor}
                        </span>
                      </div>
                    </td>

                    {/* 6. Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          biz.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{biz.status === 'active' ? 'פעיל באוויר' : biz.status}</span>
                      </span>
                    </td>

                    {/* 7. Action Icons (Like REGIN: Clean Icon Buttons) */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => onOpenEditModal(biz)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 border border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title="ערוך והתאם אישית"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* View Live Site */}
                        <Link
                          href={`/${biz.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10 transition-colors"
                          title="צפה באתר הלקוחות"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Business Admin Login */}
                        <button
                          onClick={() => router.push('/admin')}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-400 transition-colors cursor-pointer"
                          title="כניסה לפאנל הניהול של העסק"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        {/* Export JSON Backup */}
                        <button
                          onClick={() => {
                            const dataStr =
                              'data:text/json;charset=utf-8,' +
                              encodeURIComponent(JSON.stringify(biz, null, 2));
                            const a = document.createElement('a');
                            a.setAttribute('href', dataStr);
                            a.setAttribute('download', `${biz.slug}-backup.json`);
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 transition-colors cursor-pointer"
                          title="הורד גיבוי JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Clone Business */}
                        {onCloneBusiness && (
                          <button
                            onClick={() => onCloneBusiness(biz)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 transition-colors cursor-pointer"
                            title="שכפל עסק זה"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Business */}
                        <button
                          onClick={() => onDeleteBusiness(biz.slug, biz.name)}
                          className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer dark:hover:bg-rose-950/40"
                          title="מחק עסק"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
