'use client';

import React from 'react';
import { Sparkles, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

interface OnboardingStep2PlanProps {
  industry: string;
  setIndustry: (val: string) => void;
  plan: 'starter' | 'pro' | 'team';
  setPlan: (val: 'starter' | 'pro' | 'team') => void;
  notes: string;
  setNotes: (val: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const industriesList = [
  { id: 'מספרות ועיצוב שיער גברים', label: 'מספרת גברים', icon: '💈' },
  { id: 'מספרות נשים וסלוני יופי', label: 'סלון יופי ונשים', icon: '💇‍♀️' },
  { id: 'קוסמטיקה, ציפורניים & טיפוח', label: 'קוסמטיקה & ציפורניים', icon: '💅' },
  { id: 'אינסטלציה, טכנאים & שירותי בית', label: 'טכנאים ושירותי בית', icon: '🔧' },
  { id: 'מאמנים אישיים, קליניקות & טיפולים', label: 'קליניקה & מאמנים', icon: '🏋️' },
];

export function OnboardingStep2Plan({
  industry,
  setIndustry,
  plan,
  setPlan,
  notes,
  setNotes,
  isSubmitting,
  onBack,
  onSubmit,
}: OnboardingStep2PlanProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* 1. Industry Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 block">ענף הפעילות המרכזי:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {industriesList.map((ind) => (
            <button
              key={ind.id}
              type="button"
              onClick={() => setIndustry(ind.id)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer text-right ${
                industry === ind.id
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{ind.icon}</span>
              <span className="truncate">{ind.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Plan Selection */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-bold text-slate-700 block">מסלול פתיחה מבוקש:</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Starter */}
          <div
            onClick={() => setPlan('starter')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
              plan === 'starter'
                ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-900">חינמי (Starter)</span>
              {plan === 'starter' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="text-sm font-black text-slate-900">0 ₪</div>
            <div className="text-[10px] text-slate-500 mt-1">עד 35 תורים/חודש</div>
          </div>

          {/* Pro */}
          <div
            onClick={() => setPlan('pro')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative ${
              plan === 'pro'
                ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="absolute -top-2 left-2 px-2 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-black">
              מומלץ
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-900">עצמאי (Pro)</span>
              {plan === 'pro' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="text-sm font-black text-slate-900">59 ₪ / חודש</div>
            <div className="text-[10px] text-slate-500 mt-1">תורים ללא הגבלה + מיתוג אישי</div>
          </div>

          {/* Team */}
          <div
            onClick={() => setPlan('team')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
              plan === 'team'
                ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-900">צוות (Team)</span>
              {plan === 'team' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
            <div className="text-sm font-black text-slate-900">119 ₪ / חודש</div>
            <div className="text-[10px] text-slate-500 mt-1">עד 5 עובדים ויומנים נפרדים</div>
          </div>
        </div>
      </div>

      {/* 3. Notes */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 block">
          בקשות מיוחדות או שאלות (אופציונלי):
        </label>
        <textarea
          rows={2}
          placeholder="למשל: נשמח לסיוע בהגדרת שעות פעילות או בחיבור דומיין אישי..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          <span>חזרה</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-400" />
          )}
          <span>הקמת המערכת וקבלת גישה מיידית 🚀</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center pt-1">
        בלחיצה על "הקמת המערכת" הנך מאשר/ת את{' '}
        <Link href="/terms" className="underline hover:text-slate-600">
          תנאי השימוש
        </Link>{' '}
        ו
        <Link href="/privacy" className="underline hover:text-slate-600">
          מדיניות הפרטיות
        </Link>{' '}
        של פלטפורמת CutWeb.
      </p>
    </form>
  );
}
