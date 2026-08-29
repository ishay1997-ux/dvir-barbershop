'use client';

import React from 'react';
import { Crown, Send, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { ProcessedCustomer } from './types';

interface CustomerListCardProps {
  customer: ProcessedCustomer;
  retentionUrl: string;
  onOpenModal: (customer: ProcessedCustomer) => void;
  onDelete: (customer: ProcessedCustomer) => void;
}

export const CustomerListCard: React.FC<CustomerListCardProps> = ({
  customer,
  retentionUrl,
  onOpenModal,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onOpenModal(customer)}
      className="bg-white hover:bg-[#FAF7F2]/60 rounded-2xl border border-[#E5DDD0] hover:border-gold/60 p-4 sm:p-5 transition-all cursor-pointer shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#1C1C1C] text-gold flex items-center justify-center text-lg font-black flex-shrink-0 shadow-sm">
          {customer.name.slice(0, 1)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base text-[#1C1C1C]">{customer.name}</h3>
            {customer.calculatedStatus === 'vip' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-amber-800 border border-gold/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-gold fill-gold" /> VIP
              </span>
            )}
            {customer.calculatedStatus === 'at_risk' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                לא הסתפר {customer.daysSinceVisit} ימים
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B6560] mt-1">
            <span dir="ltr">{customer.phone}</span>
            <span>•</span>
            <span>סך הכל {customer.totalVisits} תספורות</span>
            <span>•</span>
            <span className="font-bold text-[#1C1C1C]">{formatPrice(customer.totalSpent)}</span>
            {(customer.haircutFormula?.sides || customer.preferences?.machineNumber) && (
              <>
                <span>•</span>
                <span className="text-gold font-bold">
                  ✂️ {customer.haircutFormula?.sides || customer.preferences?.machineNumber}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex items-center gap-2 self-end sm:self-center"
        onClick={(e) => e.stopPropagation()}
      >
        <a
          href={retentionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          וואטסאפ
        </a>

        <button
          onClick={() => onOpenModal(customer)}
          className="btn-shimmer text-xs font-bold text-[#1C1C1C] py-2 px-3 rounded-xl shadow-sm cursor-pointer"
        >
          פתח כרטיס לקוח 360 ←
        </button>

        <button
          type="button"
          onClick={() => onDelete(customer)}
          title="מחק לקוח מהמערכת"
          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
