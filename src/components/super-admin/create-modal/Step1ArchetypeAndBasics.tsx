'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Step1ArchetypeAndBasicsProps {
  adminTheme: 'dark' | 'light';
  newBizName: string;
  setNewBizName: (name: string) => void;
  newBizSlug: string;
  setNewBizSlug: (slug: string) => void;
  newBizOwner: string;
  setNewBizOwner: (owner: string) => void;
  newBizPhone: string;
  setNewBizPhone: (phone: string) => void;
  newBizCity: string;
  setNewBizCity: (city: string) => void;
  newBizInstagram: string;
  setNewBizInstagram: (ig: string) => void;
  onNext: () => void;
}

export const Step1ArchetypeAndBasics: React.FC<Step1ArchetypeAndBasicsProps> = ({
  adminTheme,
  newBizName,
  setNewBizName,
  newBizSlug,
  setNewBizSlug,
  newBizOwner,
  setNewBizOwner,
  newBizPhone,
  setNewBizPhone,
  newBizCity,
  setNewBizCity,
  newBizInstagram,
  setNewBizInstagram,
  onNext,
}) => {
  return (
    <div className="space-y-3 text-xs">
      <div>
        <label
          className={`block font-bold mb-1 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
          }`}
        >
          שם העסק / המספרה *
        </label>
        <input
          type="text"
          value={newBizName}
          onChange={(e) => {
            setNewBizName(e.target.value);
            if (
              !newBizSlug ||
              newBizSlug === newBizName.toLowerCase().replace(/\s+/g, '-')
            ) {
              setNewBizSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-_]/g, '-')
                  .replace(/-+/g, '-')
              );
            }
          }}
          placeholder="למשל: אלון קוצץ עיצוב שיער"
          required
          className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-colors ${
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
          מזהה קישור ייחודי (Slug) *
        </label>
        <div
          className={`flex items-center rounded-xl px-3 py-2 text-sm border transition-colors ${
            adminTheme === 'light'
              ? 'bg-slate-50 border-slate-200'
              : 'bg-[#141414] border-white/15'
          }`}
          dir="ltr"
        >
          <span
            className={`text-xs mr-1 ${
              adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
            }`}
          >
            thecut.co.il/
          </span>
          <input
            type="text"
            value={newBizSlug}
            onChange={(e) =>
              setNewBizSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))
            }
            placeholder="alon-cut"
            required
            className={`flex-1 bg-transparent outline-none text-xs font-bold text-right ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label
            className={`block font-bold mb-1 ${
              adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
            }`}
          >
            שם בעל העסק *
          </label>
          <input
            type="text"
            value={newBizOwner}
            onChange={(e) => setNewBizOwner(e.target.value)}
            placeholder="למשל: אלון"
            required
            className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
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
            טלפון ראשי (לוואטסאפ) *
          </label>
          <input
            type="tel"
            value={newBizPhone}
            onChange={(e) => setNewBizPhone(e.target.value)}
            placeholder="050-1234567"
            required
            className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label
            className={`block font-bold mb-1 ${
              adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
            }`}
          >
            עיר / כתובת ראשי *
          </label>
          <input
            type="text"
            value={newBizCity}
            onChange={(e) => setNewBizCity(e.target.value)}
            placeholder="למשל: ראשון לציון"
            required
            className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
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
            אינסטגרם (אופציונלי)
          </label>
          <input
            type="text"
            value={newBizInstagram}
            onChange={(e) => setNewBizInstagram(e.target.value)}
            placeholder="@barber_alon"
            className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
            }`}
          />
        </div>
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
        >
          <span>המשך לבחירת סגנון ומיתוג</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
