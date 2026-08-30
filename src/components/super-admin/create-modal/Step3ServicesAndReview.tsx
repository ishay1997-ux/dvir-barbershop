'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ServiceItem } from '../types';

interface Step3ServicesAndReviewProps {
  adminTheme: 'dark' | 'light';
  newBizSlogan: string;
  setNewBizSlogan: (slogan: string) => void;
  newBizServices: ServiceItem[];
  setNewBizServices: (services: ServiceItem[]) => void;
  newBizCity: string;
  newBizThemeColor: string;
  newBizSlug: string;
  isCreatingBiz: boolean;
  onPrev: () => void;
}

export const Step3ServicesAndReview: React.FC<Step3ServicesAndReviewProps> = ({
  adminTheme,
  newBizSlogan,
  setNewBizSlogan,
  newBizServices,
  setNewBizServices,
  newBizCity,
  newBizThemeColor,
  newBizSlug,
  isCreatingBiz,
  onPrev,
}) => {
  return (
    <div className="space-y-3.5 text-xs">
      <div>
        <label
          className={`block font-bold mb-1 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
          }`}
        >
          סלוגן לעמוד הבית:
        </label>
        <input
          type="text"
          value={newBizSlogan}
          onChange={(e) => setNewBizSlogan(e.target.value)}
          className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
            adminTheme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
              : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
          }`}
        />
      </div>

      <div>
        <label
          className={`block font-bold mb-1 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
          }`}
        >
          מחירון שירותים שנוצר אוטומטית (ניתן לעריכה):
        </label>
        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
          {newBizServices.map((srv, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between gap-2 p-2 rounded-xl border ${
                adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#141414] border-white/10'
              }`}
            >
              <input
                type="text"
                value={srv.name}
                onChange={(e) => {
                  const updated = [...newBizServices];
                  updated[idx].name = e.target.value;
                  setNewBizServices(updated);
                }}
                className={`flex-1 bg-transparent font-bold text-xs outline-none ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={srv.price}
                  onChange={(e) => {
                    const updated = [...newBizServices];
                    updated[idx].price = Number(e.target.value);
                    setNewBizServices(updated);
                  }}
                  className={`w-14 rounded-lg px-1.5 py-1 text-center font-bold text-xs outline-none border ${
                    adminTheme === 'light'
                      ? 'bg-white border-slate-300 text-[#967425]'
                      : 'bg-[#222] border-white/15 text-[#C9A84C]'
                  }`}
                />
                <span className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}>
                  ₪
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`p-3 rounded-2xl border space-y-1 ${
          adminTheme === 'light'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-[#141414] border-white/10'
        }`}
      >
        <div className="flex justify-between">
          <span className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}>
            סניף ראשי:
          </span>
          <strong className={adminTheme === 'light' ? 'text-slate-900' : 'text-white'}>
            {newBizCity}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}>
            צבע מיתוג:
          </span>
          <div className="flex items-center gap-1">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: newBizThemeColor }}
            />
            <span
              className={`font-bold ${
                adminTheme === 'light' ? 'text-slate-900' : 'text-white'
              }`}
            >
              {newBizThemeColor}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}>
            כתובת אתר חי:
          </span>
          <strong
            className={adminTheme === 'light' ? 'text-[#967425]' : 'text-[#C9A84C]'}
            dir="ltr"
          >
            thecut.co.il/{newBizSlug}
          </strong>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors ${
            adminTheme === 'light'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-white/10 hover:bg-white/15 text-zinc-300'
          }`}
        >
          <ArrowRight className="w-3.5 h-3.5" /> חזרה
        </button>

        <button
          type="submit"
          disabled={isCreatingBiz}
          className="px-6 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isCreatingBiz ? 'מקים אתר...' : 'הקם אתר מספרה מושלם באוויר 🎉'}
        </button>
      </div>
    </div>
  );
};
