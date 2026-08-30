'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RefreshCw,
  Plus,
  Edit,
  ExternalLink,
  Key,
  Trash2,
  Building2,
  Copy,
  Download,
  MessageCircle,
} from 'lucide-react';
import type { Business } from './types';

interface BusinessesTabProps {
  businesses: Business[];
  businessesLoading: boolean;
  adminTheme: 'dark' | 'light';
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (biz: Business) => void;
  onCloneBusiness?: (biz: Business) => void;
  onDeleteBusiness: (slug: string, name: string) => void;
}

export const BusinessesTab: React.FC<BusinessesTabProps> = ({
  businesses,
  businessesLoading,
  adminTheme,
  onRefresh,
  onOpenCreateModal,
  onOpenEditModal,
  onCloneBusiness,
  onDeleteBusiness,
}) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2
            className={`text-base font-black ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            רשימת מספרות ועסקים פעילים
          </h2>
          <p className={`text-xs ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
            כל עסק מקבל אתר אישי יוקרתי ומערכת זימון תורים מותאמת ב-thecut.co.il/[slug]
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={businessesLoading}
            className={`text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
              adminTheme === 'light'
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                businessesLoading ? 'animate-spin text-[#C9A84C]' : ''
              }`}
            />
            <span>רענן מספרות</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs transition-colors shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>הקמת עסק / מספרה חדשה ✨</span>
          </button>
        </div>
      </div>

      {/* Businesses Loading Skeleton */}
      {businessesLoading && businesses.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 space-y-4 animate-pulse ${
                adminTheme === 'light'
                  ? 'bg-white border border-slate-200 shadow-xs'
                  : 'bg-[#1C1C1C] border border-white/10 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="space-y-1.5">
                    <div className="w-32 h-4 bg-slate-200 rounded" />
                    <div className="w-24 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="w-20 h-5 bg-slate-200 rounded-full" />
              </div>
              <div className="h-12 bg-slate-200 rounded-xl" />
              <div className="grid grid-cols-2 gap-2 h-16 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : businesses.length > 0 ? (
        /* Businesses Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((biz) => {
            const bizColor = biz.themeColor || '#C9A84C';

            return (
              <div
                key={biz.id}
                className={`rounded-2xl p-5 space-y-4 relative group transition-all ${
                  adminTheme === 'light'
                    ? 'bg-white border border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-xs hover:shadow-md'
                    : 'bg-[#1C1C1C] border border-white/10 hover:border-white/20 text-white shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-xs"
                      style={{
                        backgroundColor:
                          adminTheme === 'light' ? `${bizColor}18` : 'rgba(255,255,255,0.08)',
                        color: bizColor,
                        border: `1.5px solid ${bizColor}`,
                      }}
                    >
                      {biz.name.trim().charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-base font-black ${
                            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {biz.name}
                        </h3>
                      </div>
                      <span className="text-xs font-bold" style={{ color: bizColor }} dir="ltr">
                        {`thecut.co.il/${biz.slug}`}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      adminTheme === 'light'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {biz.status === 'active' ? 'פעיל באוויר ✓' : biz.status}
                  </span>
                </div>

                {biz.slogan && (
                  <p
                    className={`text-xs italic p-2.5 rounded-xl font-sans border ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200/80 text-slate-700'
                        : 'bg-[#141414] border-white/5 text-zinc-300'
                    }`}
                  >
                    "{biz.slogan}"
                  </p>
                )}

                <div
                  className={`grid grid-cols-2 gap-2 text-xs p-3 rounded-xl border ${
                    adminTheme === 'light'
                      ? 'bg-slate-50 border-slate-200/80 text-slate-800'
                      : 'bg-[#141414] border-white/5 text-zinc-300'
                  }`}
                >
                  <div>
                    <span
                      className={`block text-[10px] ${
                        adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                      }`}
                    >
                      מנהל עסק:
                    </span>
                    <strong
                      className={
                        adminTheme === 'light' ? 'text-slate-900 font-bold' : 'text-white'
                      }
                    >
                      {biz.ownerName}
                    </strong>
                  </div>
                  <div>
                    <span
                      className={`block text-[10px] ${
                        adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                      }`}
                    >
                      טלפון:
                    </span>
                    <strong
                      className={
                        adminTheme === 'light' ? 'text-slate-900 font-bold' : 'text-white'
                      }
                      dir="ltr"
                    >
                      {biz.phone}
                    </strong>
                  </div>
                  <div>
                    <span
                      className={`block text-[10px] ${
                        adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                      }`}
                    >
                      סניפים ושירותים:
                    </span>
                    <strong
                      className={
                        adminTheme === 'light' ? 'text-slate-900 font-bold' : 'text-white'
                      }
                    >
                      {biz.branches?.length || biz.branchesCount || 1} סניפים ·{' '}
                      {biz.services?.length || 3} שירותים
                    </strong>
                  </div>
                  <div>
                    <span
                      className={`block text-[10px] ${
                        adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                      }`}
                    >
                      חבילה:
                    </span>
                    <strong className="uppercase" style={{ color: bizColor }}>
                      {biz.plan} Plan
                    </strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenEditModal(biz)}
                    className="flex-1 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black text-center text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> ערוך והתאם אישית
                  </button>

                  <Link
                    href={`/${biz.slug}`}
                    target="_blank"
                    className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-colors flex items-center gap-1 border ${
                      adminTheme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        : 'bg-white/10 hover:bg-white/15 border-transparent text-white'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> צפה באתר
                  </Link>

                  <button
                    onClick={() => {
                      router.push('/admin');
                    }}
                    className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                      adminTheme === 'light'
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border-emerald-500/30'
                    }`}
                    title="התחבר כבעל מספרה זו"
                  >
                    <Key className="w-3.5 h-3.5" /> כניסה כמנהל
                  </button>

                  <a
                    href={`https://wa.me/${(biz.phone || '').replace(/\D/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(
                      `היי ${biz.ownerName || 'יקר/ה'}! 🎉\nהאתר והמערכת שלך עבור "${biz.name}" מוכנים באוויר!\n\n🌐 קישור לאתר הלקוחות להזמנת תורים:\nhttps://thecut.co.il/${biz.slug}\n\n🔐 קישור לפאנל הניהול והיומן שלך:\nhttps://thecut.co.il/admin/login\n\nבהצלחה רבה! 🚀`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 transition-colors cursor-pointer"
                    title={`שלח קישורי אתר וניהול ל-${biz.ownerName || biz.name} ב-WhatsApp`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(biz, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `${biz.slug}-backup.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      adminTheme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        : 'bg-white/10 hover:bg-white/15 text-zinc-300 border-transparent'
                    }`}
                    title="ייצא גיבוי JSON של העסק"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {onCloneBusiness && (
                    <button
                      onClick={() => onCloneBusiness(biz)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        adminTheme === 'light'
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-amber-950/30 hover:bg-amber-900/50 text-amber-400 border-amber-500/30'
                      }`}
                      title="שכפל עסק זה להקמת עסק חדש"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteBusiness(biz.slug, biz.name)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      adminTheme === 'light'
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                        : 'bg-red-950/30 hover:bg-red-900/50 text-red-400 border-red-500/30'
                    }`}
                    title="מחק מספרה זו"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`rounded-2xl p-10 text-center space-y-3 border ${
            adminTheme === 'light'
              ? 'bg-white border-slate-200 text-slate-600 shadow-xs'
              : 'bg-[#1C1C1C] border-white/10 text-zinc-400'
          }`}
        >
          <Building2 className="w-10 h-10 text-[#C9A84C] mx-auto opacity-70" />
          <p
            className={`text-sm font-bold ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            לא נמצאו עסקים רשומים
          </p>
          <p className="text-xs">לחץ על רענן או הקם עסק חדש</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-[#C9A84C] text-black font-bold text-xs rounded-xl hover:bg-[#DFCA85] cursor-pointer"
          >
            טען מחדש
          </button>
        </div>
      )}
    </div>
  );
};
