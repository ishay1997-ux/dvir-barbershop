'use client';

import React from 'react';
import { Crown, Send, Trash2, ArrowUpRight, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { ProcessedCustomer } from './types';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import { useShopStore } from '@/lib/store';

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
  const { settings } = useShopStore();
  const terminology = getIndustryTerminology({
    name: settings.shopName,
    shopName: settings.shopName,
    category: settings.category,
    themeColor: settings.themeColor,
  });

  return (
    <div
      onClick={() => onOpenModal(customer)}
      className="bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-slate-300 p-4 sm:p-5 transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-black shrink-0 shadow-xs">
          {customer.name.slice(0, 1)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
              {customer.name}
            </h3>
            {customer.calculatedStatus === 'vip' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500 fill-amber-500" /> VIP
              </span>
            )}
            {customer.calculatedStatus === 'at_risk' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                ללא פעילות {customer.daysSinceVisit} ימים
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-sans">
            <span dir="ltr">{customer.phone}</span>
            <span>•</span>
            <span>סך הכל {customer.totalVisits} {terminology.serviceTitlePlural || 'ביקורים'}</span>
            <span>•</span>
            <span className="font-bold text-slate-900 font-mono">{formatPrice(customer.totalSpent)}</span>
            {(customer.haircutFormula?.sides || customer.preferences?.machineNumber) && (
              <>
                <span>•</span>
                <span className="text-indigo-600 font-bold">
                  {terminology.icon || '✨'} {customer.haircutFormula?.sides || customer.preferences?.machineNumber}
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
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>וואטסאפ</span>
        </a>

        <button
          onClick={() => onOpenModal(customer)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold py-2 px-3.5 rounded-xl border border-slate-200 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
        >
          <span>כרטיס 360</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(customer)}
          title="מחק לקוח מהמערכת"
          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

