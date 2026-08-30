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
        <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                זוהו {atRiskCount} {terminology.clientPlural || 'לקוחות'} שלא תיאמו {terminology.serviceTitle || 'תור'} מעל 25 יום!
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-sans">
                שמור על קשר אישי ישיר. לחיצה אחת שולחת תזכורת שימור אישית בוואטסאפ.
              </p>
            </div>
          </div>

          <button
            onClick={onFilterAtRisk}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all whitespace-nowrap shadow-xs cursor-pointer active:scale-95"
          >
            הצג לקוחות לשימור מיידי ←
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">סך {terminology.clientPlural || 'לקוחות'} פעילים</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{processedCustomers.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">{terminology.clientTitle || 'לקוחות'} VIP (👑)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{vipCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">לשימור (מעל 25 יום)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{atRiskCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">ממוצע {terminology.serviceTitlePlural || 'ביקורים'} ללקוח</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{avgVisits}</div>
        </div>
      </div>
    </>
  );
};

