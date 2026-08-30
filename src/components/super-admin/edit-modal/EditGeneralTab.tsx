'use client';

import React from 'react';
import type { Business } from '../types';

interface EditGeneralTabProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export const EditGeneralTab: React.FC<EditGeneralTabProps> = ({
  editingBiz,
  adminTheme,
  setEditingBiz,
}) => {
  return (
    <div className="space-y-3.5 text-xs">
      <div>
        <label
          className={`block font-bold mb-1 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          שם המספרה / העסק:
        </label>
        <input
          type="text"
          value={editingBiz.name}
          onChange={(e) => setEditingBiz({ ...editingBiz, name: e.target.value })}
          className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
            adminTheme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
              : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
          }`}
        />
      </div>

      <div>
        <label
          className={`block font-bold mb-1 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          סלוגן / תיאור קצר לעמוד הבית:
        </label>
        <input
          type="text"
          value={editingBiz.slogan || ''}
          onChange={(e) => setEditingBiz({ ...editingBiz, slogan: e.target.value })}
          placeholder="למשל: מרכז החלקות אורגניות, בלונד ועיצוב שיער מקצועי"
          className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
            adminTheme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
              : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
          }`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className={`block font-bold mb-1 ${
              adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
            }`}
          >
            טלפון ראשי (לוואטסאפ של הלקוחות):
          </label>
          <input
            type="tel"
            value={editingBiz.phone}
            onChange={(e) => setEditingBiz({ ...editingBiz, phone: e.target.value })}
            className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
            }`}
          />
        </div>
        <div>
          <label
            className={`block font-bold mb-1 ${
              adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
            }`}
          >
            שם בעל המספרה:
          </label>
          <input
            type="text"
            value={editingBiz.ownerName}
            onChange={(e) => setEditingBiz({ ...editingBiz, ownerName: e.target.value })}
            className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className={`block font-bold mb-1 ${
              adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
            }`}
          >
            עיר / אזור פעילות:
          </label>
          <input
            type="text"
            value={editingBiz.city}
            onChange={(e) => setEditingBiz({ ...editingBiz, city: e.target.value })}
            className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
            }`}
          />
        </div>
        <div>
          <label
            className={`block font-bold mb-1 ${
              adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
            }`}
          >
            סטטוס פעילות:
          </label>
          <select
            value={editingBiz.status}
            onChange={(e) =>
              setEditingBiz({ ...editingBiz, status: e.target.value as any })
            }
            className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors cursor-pointer ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
            }`}
          >
            <option value="active">פעיל באוויר 🟢</option>
            <option value="pending">בהקמה / טיוטה 🟡</option>
            <option value="suspended">מושהה זמנית 🔴</option>
          </select>
        </div>
      </div>

      <div>
        <label
          className={`block font-bold mb-1 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          מסלול מנוי (Pricing Plan):
        </label>
        <select
          value={editingBiz.plan || 'pro'}
          onChange={(e) =>
            setEditingBiz({ ...editingBiz, plan: e.target.value as any })
          }
          className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors cursor-pointer ${
            adminTheme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
              : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
          }`}
        >
          <option value="starter">חינמי (Starter · 0 ₪)</option>
          <option value="pro">עצמאי (Pro · 59 ₪/חודש או 490 ₪/שנה) 🔥</option>
          <option value="team">צוות (Team · 119 ₪/חודש או 990 ₪/שנה)</option>
          <option value="enterprise">רשת / Enterprise (299 ₪)</option>
        </select>
      </div>
    </div>
  );
};
