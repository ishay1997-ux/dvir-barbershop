'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';

export interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  pdfUrl?: string;
}

interface InvoicesHistoryTableProps {
  invoices: InvoiceItem[];
}

export function InvoicesHistoryTable({ invoices }: InvoicesHistoryTableProps) {
  const { info } = useToast();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900">היסטוריית חיובים וחשבוניות מס</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            חשבוניות מס-קבלה חתומות דיגיטלית המוכרות לצורכי מס בישראל
          </p>
        </div>
        <span className="text-xs text-slate-400 font-bold">סליקה מאובטחת</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 font-bold">
              <th className="py-3 px-3">מספר חשבונית</th>
              <th className="py-3 px-3">תאריך</th>
              <th className="py-3 px-3">פירוט</th>
              <th className="py-3 px-3">סכום</th>
              <th className="py-3 px-3">סטטוס</th>
              <th className="py-3 px-3 text-left">מסמך</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.id}</td>
                <td className="py-3 px-3 text-slate-600">{inv.date}</td>
                <td className="py-3 px-3 font-medium text-slate-800">{inv.description}</td>
                <td className="py-3 px-3 font-mono font-black text-slate-900">{inv.amount}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    {inv.status} ✓
                  </span>
                </td>
                <td className="py-3 px-3 text-left">
                  <button
                    type="button"
                    onClick={() => info('הורדת חשבונית', `חשבונית ${inv.id} נשלחה גם למייל שלך.`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    title="הורדת PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
