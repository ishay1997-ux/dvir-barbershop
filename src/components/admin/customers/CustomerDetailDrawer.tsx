'use client';

import React from 'react';
import {
  X,
  Crown,
  Scissors,
  CheckCircle2,
  Save,
  History,
  Trash2,
  Send,
  Plus,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import type { ProcessedCustomer, CustomerHistoryItem } from './types';

interface EditSpecsState {
  machineNumber: string;
  fadeType: string;
  beard: string;
  beverage: string;
  notes: string;
}

interface CustomerDetailDrawerProps {
  customer: ProcessedCustomer | null;
  editSpecs: EditSpecsState;
  savedNotice: boolean;
  history: CustomerHistoryItem[];
  retentionUrl: string;
  onChangeSpecs: (specs: EditSpecsState) => void;
  onSaveSpecs: () => void;
  onDeleteCustomer: (customer: ProcessedCustomer) => void;
  onClose: () => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  editSpecs,
  savedNotice,
  history,
  retentionUrl,
  onChangeSpecs,
  onSaveSpecs,
  onDeleteCustomer,
  onClose,
}) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div
        className="bg-white rounded-3xl border border-[#E5DDD0] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
        dir="rtl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute left-6 top-6 p-2 rounded-full hover:bg-zinc-100 text-[#6B6560] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#F0EBE1] mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] text-gold text-2xl font-black flex items-center justify-center shadow-md">
            {customer.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[#1C1C1C]">{customer.name}</h2>
              {customer.calculatedStatus === 'vip' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold/20 text-amber-800 border border-gold">
                  👑 לקוח VIP
                </span>
              )}
            </div>
            <div className="text-xs text-[#6B6560] mt-1 flex items-center gap-3">
              <span dir="ltr" className="font-bold text-[#1C1C1C]">
                {customer.phone}
              </span>
              <span>•</span>
              <span>ביקור אחרון: לפני {customer.daysSinceVisit} ימים</span>
            </div>
          </div>
        </div>

        {/* Customer Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#FAF7F2] p-3 rounded-2xl text-center border border-[#E5DDD0]">
            <span className="text-[11px] text-[#9E9891]">סה״כ תספורות</span>
            <div className="text-lg font-black text-[#1C1C1C]">{customer.totalVisits}</div>
          </div>
          <div className="bg-[#FAF7F2] p-3 rounded-2xl text-center border border-[#E5DDD0]">
            <span className="text-[11px] text-[#9E9891]">סה״כ הכנסות</span>
            <div className="text-lg font-black text-emerald-600">
              {formatPrice(customer.totalSpent)}
            </div>
          </div>
          <div className="bg-[#FAF7F2] p-3 rounded-2xl text-center border border-[#E5DDD0]">
            <span className="text-[11px] text-[#9E9891]">סניף מועדף</span>
            <div className="text-xs font-black text-[#1C1C1C] mt-1">סניף אריאל</div>
          </div>
        </div>

        {/* Section 1: Haircut Technical Specs (מפרט תספורת שמור) */}
        <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E5DDD0] mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-gold" />
              <h3 className="font-black text-sm text-[#1C1C1C]">מפרט תספורת והעדפות שמורות (דביר)</h3>
            </div>
            {savedNotice && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> נשמר בהצלחה!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                ✂️ מספרי מכונה ופייד (צדדים):
              </label>
              <input
                type="text"
                placeholder="למשל: 0.5 סקין פייד, טייפר נמוך"
                value={editSpecs.machineNumber}
                onChange={(e) => onChangeSpecs({ ...editSpecs, machineNumber: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5DDD0] text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                💈 עיצוב עליון ומספריים:
              </label>
              <input
                type="text"
                placeholder="למשל: קיצור חצי אורך, טקסטורה"
                value={editSpecs.fadeType}
                onChange={(e) => onChangeSpecs({ ...editSpecs, fadeType: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5DDD0] text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                🪒 זקן וקווי מתאר:
              </label>
              <input
                type="text"
                placeholder="למשל: קווים חדים בתער, קיצור סנטר"
                value={editSpecs.beard}
                onChange={(e) => onChangeSpecs({ ...editSpecs, beard: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5DDD0] text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                ☕ שתייה והעדפה במספרה:
              </label>
              <input
                type="text"
                placeholder="למשל: אספרסו קצר בלי סוכר"
                value={editSpecs.beverage}
                onChange={(e) => onChangeSpecs({ ...editSpecs, beverage: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5DDD0] text-xs outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
              ⚠️ רגישויות והערות אישיות של הספר:
            </label>
            <textarea
              rows={2}
              placeholder="למשל: עורף רגיש, מעדיף חימר מט ללא ברק"
              value={editSpecs.notes}
              onChange={(e) => onChangeSpecs({ ...editSpecs, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5DDD0] text-xs outline-none focus:border-gold leading-relaxed"
            />
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={onSaveSpecs}
              className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C]"
            >
              <Save className="w-3.5 h-3.5" />
              שמור מפרט לקוח
            </button>
          </div>
        </div>

        {/* Section 2: Full Appointment History Log */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-gold" />
            <h3 className="font-black text-sm text-[#1C1C1C]">היסטוריית תורים וביקורים קודמים</h3>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden divide-y divide-[#F0EBE1]">
            {history.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#9E9891]">
                אין היסטוריית תורים קודמת שנשמרה ללקוח זה עדיין
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#1C1C1C]">{item.service}</div>
                    <div className="text-[11px] text-[#9E9891] mt-0.5 flex items-center gap-2">
                      <span>
                        {item.date} {item.time ? `בשעה ${item.time}` : ''}
                      </span>
                      <span>•</span>
                      <span>{item.branch}</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="font-bold text-[#1C1C1C]">{formatPrice(item.price)}</div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-[#F0EBE1] mt-6">
          <button
            type="button"
            onClick={() => onDeleteCustomer(customer)}
            className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>מחק לקוח</span>
          </button>

          <a
            href={retentionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            שלח הודעת WhatsApp
          </a>

          <Link
            href="/booking"
            className="flex-1 btn-shimmer py-3 text-[#1C1C1C] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            קבע תור חדש ללקוח
          </Link>
        </div>
      </div>
    </div>
  );
};
