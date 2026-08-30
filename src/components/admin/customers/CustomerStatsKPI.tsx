'use client';

import React from 'react';
import { AlertTriangle, Users, Crown, TrendingUp, Sparkles } from 'lucide-react';
import type { ProcessedCustomer } from './types';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import { useShopStore } from '@/lib/store';

interface CustomerStatsKPIProps {
  processedCustomers: ProcessedCustomer[];
  atRiskCount: number;
  vipCount: number;
  onFilterAtRisk: () => void;
}

export const CustomerStatsKPI: React.FC<CustomerStatsKPIProps> = ({
  processedCustomers,
  atRiskCount,
  vipCount,
  onFilterAtRisk,
}) => {
  const { settings } = useShopStore();
  const terminology = getIndustryTerminology({
    name: settings.shopName,
    shopName: settings.shopName,
    category: settings.category,
    themeColor: settings.themeColor,
  });

  const avgVisits = (
    processedCustomers.reduce((acc, c) => acc + c.totalVisits, 0) /
    (processedCustomers.length || 1)
  ).toFixed(1);

  return (
    <>
      {/* Retention Alert Banner */}
      {atRiskCount > 0 && (
        <div className="bg-gradient-to-r from-rose-950/40 via-[#161722] to-[#111420] border border-rose-500/30 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                זוהו {atRiskCount} {terminology.clientPlural || 'לקוחות'} שלא תיאמו {terminology.serviceTitle || 'תור'} מעל 25 יום!
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                שמור על קשר אישי ישיר. לחיצה אחת שולחת תזכורת שימור אישית בוואטסאפ.
              </p>
            </div>
          </div>

          <button
            onClick={onFilterAtRisk}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-md shadow-rose-600/30 cursor-pointer"
          >
            הצג לקוחות לשימור מיידי ←
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111420] p-5 rounded-2xl border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold">סך {terminology.clientPlural || 'לקוחות'} פעילים</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{processedCustomers.length}</div>
        </div>

        <div className="bg-[#111420] p-5 rounded-2xl border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold">{terminology.clientTitle || 'לקוחות'} VIP (👑)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">{vipCount}</div>
        </div>

        <div className="bg-[#111420] p-5 rounded-2xl border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold">לשימור (מעל 25 יום)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400">{atRiskCount}</div>
        </div>

        <div className="bg-[#111420] p-5 rounded-2xl border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold">ממוצע {terminology.serviceTitlePlural || 'ביקורים'} ללקוח</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{avgVisits}</div>
        </div>
      </div>
    </>
  );
};

