'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ProcessedCustomer } from './types';

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
  const avgVisits = (
    processedCustomers.reduce((acc, c) => acc + c.totalVisits, 0) /
    (processedCustomers.length || 1)
  ).toFixed(1);

  return (
    <>
      {/* Retention Alert Banner (When there are dormant customers) */}
      {atRiskCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/40 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#1C1C1C]">
                זוהו {atRiskCount} לקוחות שלא הסתפרו מעל 25 יום!
              </h2>
              <p className="text-xs text-[#6B6560] mt-0.5">
                אל תיתן להם ללכת למספרה אחרת. לחיצה אחת שולחת להם הודעת שימור אישית בוואטסאפ.
              </p>
            </div>
          </div>

          <button
            onClick={onFilterAtRisk}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            הצג לקוחות לשימור מיידי ←
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-sm">
          <span className="text-xs text-[#6B6560] font-bold">סך לקוחות פעילים</span>
          <div className="text-2xl font-black text-[#1C1C1C] mt-1">{processedCustomers.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-sm">
          <span className="text-xs text-[#6B6560] font-bold">לקוחות VIP קבועים (👑)</span>
          <div className="text-2xl font-black text-gold mt-1">{vipCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-sm">
          <span className="text-xs text-[#6B6560] font-bold">לקוחות לשימור (מעל 25 יום)</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{atRiskCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-sm">
          <span className="text-xs text-[#6B6560] font-bold">ממוצע תספורות ללקוח</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{avgVisits}</div>
        </div>
      </div>
    </>
  );
};
