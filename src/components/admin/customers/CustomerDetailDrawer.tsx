'use client';

import React from 'react';
import {
  X,
  Crown,
  Sparkles,
  CheckCircle2,
  Save,
  History,
  Trash2,
  Send,
  Plus,
  MessageCircle,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import type { ProcessedCustomer, CustomerHistoryItem } from './types';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import { useShopStore } from '@/lib/store';

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
  const { settings } = useShopStore();
  const terminology = getIndustryTerminology({
    name: settings.shopName,
    shopName: settings.shopName,
    category: settings.category,
    themeColor: settings.themeColor,
  });

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div
        className="bg-[#111420] text-slate-100 rounded-3xl border border-slate-800/80 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
        dir="rtl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute left-6 top-6 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800/80 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 text-indigo-400 text-2xl font-black flex items-center justify-center shadow-md">
            {customer.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">{customer.name}</h2>
              {customer.calculatedStatus === 'vip' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> לקוח VIP
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 font-sans">
              <span dir="ltr" className="font-bold text-white">
                {customer.phone}
              </span>
              <span>•</span>
              <span>ביקור אחרון: לפני {customer.daysSinceVisit} ימים</span>
            </div>
          </div>
        </div>

        {/* Customer Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#141827] p-3.5 rounded-2xl text-center border border-slate-800/80 shadow-xs">
            <span className="text-[11px] text-slate-400">סה״כ {terminology.serviceTitlePlural || 'ביקורים'}</span>
            <div className="text-lg font-black text-white mt-0.5">{customer.totalVisits}</div>
          </div>
          <div className="bg-[#141827] p-3.5 rounded-2xl text-center border border-slate-800/80 shadow-xs">
            <span className="text-[11px] text-slate-400">סה״כ הכנסות</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5 font-mono">
              {formatPrice(customer.totalSpent)}
            </div>
          </div>
          <div className="bg-[#141827] p-3.5 rounded-2xl text-center border border-slate-800/80 shadow-xs">
            <span className="text-[11px] text-slate-400">סניף מועדף</span>
            <div className="text-xs font-black text-white mt-1">סניף מרכזי</div>
          </div>
        </div>

        {/* Section 1: Industry Technical Specs */}
        <div className="bg-[#141827] rounded-2xl p-5 border border-slate-800/80 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="font-black text-sm text-white">
                {terminology.clientNotesTitle || 'מפרט טכני והעדפות לקוח'}
              </h3>
            </div>
            {savedNotice && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> נשמר בהצלחה!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {terminology.clientNotesFields?.field1Label || 'מפרט ראשי:'}
              </label>
              <input
                type="text"
                placeholder={terminology.clientNotesFields?.field1Placeholder || 'למשל: פרטים ומידות'}
                value={editSpecs.machineNumber}
                onChange={(e) => onChangeSpecs({ ...editSpecs, machineNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-white text-xs outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {terminology.clientNotesFields?.field2Label || 'סגנון ודגשים:'}
              </label>
              <input
                type="text"
                placeholder={terminology.clientNotesFields?.field2Placeholder || 'למשל: סגנון מועדף'}
                value={editSpecs.fadeType}
                onChange={(e) => onChangeSpecs({ ...editSpecs, fadeType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-white text-xs outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {terminology.clientNotesFields?.field3Label || 'פרטים משלימים:'}
              </label>
              <input
                type="text"
                placeholder={terminology.clientNotesFields?.field3Placeholder || 'למשל: תוקף / הערה'}
                value={editSpecs.beard}
                onChange={(e) => onChangeSpecs({ ...editSpecs, beard: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-white text-xs outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                ☕ שתייה והעדפות אישיות:
              </label>
              <input
                type="text"
                placeholder="למשל: אספרסו קצר / מים קרים"
                value={editSpecs.beverage}
                onChange={(e) => onChangeSpecs({ ...editSpecs, beverage: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-white text-xs outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              ⚠️ {terminology.clientNotesFields?.notesLabel || 'רגישויות והערות אישיות:'}
            </label>
            <textarea
              rows={2}
              placeholder={terminology.clientNotesFields?.notesPlaceholder || 'למשל: עור רגיש, דגשים מיוחדים...'}
              value={editSpecs.notes}
              onChange={(e) => onChangeSpecs({ ...editSpecs, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-white text-xs outline-none focus:border-indigo-500 leading-relaxed placeholder:text-slate-500"
            />
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={onSaveSpecs}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>שמור מפרט לקוח</span>
            </button>
          </div>
        </div>

        {/* Section 2: Full Appointment History Log */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="font-black text-sm text-white">היסטוריית תורים וביקורים קודמים</h3>
          </div>

          <div className="bg-[#141827] rounded-2xl border border-slate-800/80 overflow-hidden divide-y divide-slate-800">
            {history.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                אין היסטוריית תורים קודמת שנשמרה ללקוח זה עדיין
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-800/40 transition-colors">
                  <div>
                    <div className="font-bold text-white">{item.service}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-sans">
                      <span>
                        {item.date} {item.time ? `בשעה ${item.time}` : ''}
                      </span>
                      <span>•</span>
                      <span>{item.branch}</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="font-bold text-white font-mono">{formatPrice(item.price)}</div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-slate-800/80 mt-6">
          <button
            type="button"
            onClick={() => onDeleteCustomer(customer)}
            className="py-3 px-4 bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>מחק לקוח</span>
          </button>

          <a
            href={retentionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span>שלח הודעת WhatsApp</span>
          </a>

          <Link
            href="/booking"
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all text-center"
          >
            <Plus className="w-4 h-4" />
            <span>קבע תור חדש</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

