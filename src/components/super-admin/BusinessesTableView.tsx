'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit2,
  ExternalLink,
  KeyRound,
  Trash2,
  Copy,
  Download,
  MessageCircle,
  RefreshCw,
  Building2,
  CheckCircle2,
  Sparkles,
  Layers,
  Phone,
} from 'lucide-react';
import type { Business } from './types';
import { BusinessDetailDrawer } from './BusinessDetailDrawer';

interface BusinessesTableViewProps {
  businesses: Business[];
  businessesLoading: boolean;
  adminTheme: 'dark' | 'light';
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (biz: Business) => void;
  onCloneBusiness?: (biz: Business) => void;
  onDeleteBusiness: (slug: string, name: string, id?: string) => void;
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
  const [selectedDetailBiz, setSelectedDetailBiz] = useState<Business | null>(null);

  const filtered = businesses.filter((biz) => {
    if (statusFilter !== 'all' && biz.status !== statusFilter) return false;
    if (planFilter !== 'all' && biz.plan !== planFilter) return false;
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

  const totalMRR = businesses.reduce((acc, b) => {
    if (b.status !== 'active') return acc;
    if (b.plan === 'team') return acc + 119;
    if (b.plan === 'pro') return acc + 59;
    if (b.plan === 'enterprise') return acc + 199;
    return acc;
  }, 0);

  return (
    <div className="space-y-6 select-none" dir="rtl">
      {/* Top Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-lg font-black tracking-tight ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            ניהול מספרות ועסקים בפלטפורמה
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            מעקב אחר כל העסקים שנפתחו, התאמה אישית, חבילות וחיבורי דומיינים
          </p>
        </div>

        {/* Compact KPI Stats Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* MRR Card */}
          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${
              adminTheme === 'light'
                ? 'bg-indigo-50/80 border-indigo-200/90 text-indigo-950 shadow-xs'
                : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
            }`}
          >
            <span className="text-[11px] text-indigo-600 font-bold">הכנסה חודשית (MRR):</span>
            <span className="text-xs font-black font-mono">
              {totalMRR.toLocaleString()} ₪
            </span>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200/90 text-slate-700 shadow-xs'
                : 'bg-white/5 border-white/10 text-zinc-300'
            }`}
          >
            <span className="text-[11px] text-slate-400 font-medium">עסקים פעילים:</span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {activeCount} <span className="text-[10px] text-slate-400 font-normal">/ {businesses.length}</span>
            </span>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200/90 text-emerald-700 shadow-xs'
                : 'bg-white/5 border-white/10 text-emerald-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold">ענן מסונכרן 100%</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Controls */}
      <div
        className={`p-3 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200/90 shadow-xs'
            : 'bg-[#15161A] border-white/10'
        }`}
      >
        {/* Right: Primary Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            <span>הקמת עסק חדש</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={businessesLoading}
            className={`p-2 rounded-xl border cursor-pointer transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
            }`}
            title="רענן רשימה"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${businessesLoading ? 'animate-spin text-slate-900' : ''}`}
            />
          </button>
        </div>

        {/* Center: Segmented Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          {[
            { id: 'all' as const, label: 'הכל', count: businesses.length },
            { id: 'active' as const, label: 'פעילים', count: activeCount },
            { id: 'pending' as const, label: 'בהמתנה', count: pendingCount },
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
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                  statusFilter === tab.id
                    ? 'bg-slate-100 text-slate-900 dark:bg-white/20 dark:text-white'
                    : 'bg-slate-200/60 text-slate-500 dark:bg-white/10 dark:text-zinc-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Left: Plan Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-xl border outline-none font-semibold cursor-pointer transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-700 focus:bg-white focus:border-slate-400'
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

      {/* Main Data Table */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200/90 shadow-xs'
            : 'bg-[#15161A] border-white/10 shadow-lg'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse" dir="rtl">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold tracking-wider ${
                  adminTheme === 'light'
                    ? 'bg-slate-50/70 border-slate-200/80 text-slate-500'
                    : 'bg-white/5 border-white/10 text-zinc-400'
                }`}
              >
                <th className="py-3 px-4 w-60">עסק ודומיין</th>
                <th className="py-3 px-4 w-48">איש קשר וטלפון</th>
                <th className="py-3 px-4 w-36">סניפים ושירותים</th>
                <th className="py-3 px-4 w-32">מסלול</th>
                <th className="py-3 px-4 w-28">צבע מיתוג</th>
                <th className="py-3 px-4 w-28">סטטוס</th>
                <th className="py-3 px-4 text-center w-40">פעולות</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((biz) => {
                const bizColor = biz.themeColor || '#C9A84C';
                const initial = (biz.name || 'ע').trim().charAt(0);

                return (
                  <tr
                    key={biz.id}
                    onClick={() => setSelectedDetailBiz(biz)}
                    className={`transition-colors cursor-pointer ${
                      adminTheme === 'light' ? 'hover:bg-slate-50/80' : 'hover:bg-white/5'
                    }`}
                  >
                    {/* 1. Business Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs"
                          style={{
                            backgroundColor: `${bizColor}15`,
                            color: bizColor,
                            border: `1.5px solid ${bizColor}40`,
                          }}
                        >
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`font-bold text-xs block truncate hover:underline ${
                              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            {biz.name}
                          </span>
                          <Link
                            href={`/${biz.slug}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-medium text-indigo-600 hover:underline block truncate"
                            dir="ltr"
                          >
                            {`thecut.co.il/${biz.slug}`}
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* 2. Owner & Contact */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold text-xs block ${
                          adminTheme === 'light' ? 'text-slate-800' : 'text-zinc-200'
                        }`}
                      >
                        {biz.ownerName || 'לא צוין'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-slate-400 text-[11px] font-mono" dir="ltr">
                          {biz.phone}
                        </span>
                        <a
                          href={`https://wa.me/${(biz.phone || '').replace(/\D/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(
                            `היי ${biz.ownerName || 'יקר/ה'}! 🎉\nהאתר והמערכת שלך עבור "${biz.name}" מוכנים באוויר!\n\n🌐 קישור לאתר הלקוחות:\nhttps://thecut.co.il/${biz.slug}\n\n🔐 קישור לפאנל הניהול שלך:\nhttps://thecut.co.il/admin/login`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-0.5 text-[#25D366] hover:opacity-80 transition-opacity"
                          title="שלח וואטסאפ"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* 3. Branches & Services */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-600 dark:text-zinc-300 text-xs font-medium">
                        {biz.branches?.length || biz.branchesCount || 1} סניפים
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        {biz.services?.length || 3} שירותים
                      </div>
                    </td>

                    {/* 4. Plan */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          biz.plan === 'team'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300'
                            : biz.plan === 'starter'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/10 dark:text-zinc-300'
                            : biz.plan === 'enterprise'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300'
                        }`}
                      >
                        {biz.plan || 'pro'}
                      </span>
                    </td>

                    {/* 5. Brand Color Swatch */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: bizColor }}
                        />
                        <span className="text-[11px] font-mono text-slate-500 uppercase" dir="ltr">
                          {bizColor.startsWith('#') ? bizColor : `#${bizColor}`}
                        </span>
                      </div>
                    </td>

                    {/* 6. Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          biz.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{biz.status === 'active' ? 'פעיל באוויר' : biz.status}</span>
                      </span>
                    </td>

                    {/* 7. Action Icons Group */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditModal(biz);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title="ערוך והתאם אישית"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* View Live Site */}
                        <Link
                          href={`/${biz.slug}`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10 transition-colors"
                          title="צפה באתר הלקוחות"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Business Admin Login */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push('/admin');
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title="כניסה לפאנל הניהול"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        {/* Export JSON Backup */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
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
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title="הורד גיבוי JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Clone Business */}
                        {onCloneBusiness && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCloneBusiness(biz);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            title="שכפל עסק"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Business */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteBusiness(biz.slug, biz.name, biz.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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

      {/* Full Business Detail Drawer Modal */}
      <BusinessDetailDrawer
        business={selectedDetailBiz}
        adminTheme={adminTheme}
        onClose={() => setSelectedDetailBiz(null)}
        onOpenEditModal={onOpenEditModal}
      />
    </div>
  );
};
