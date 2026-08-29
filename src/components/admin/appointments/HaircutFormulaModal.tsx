'use client';

import React from 'react';
import { Scissors, Check } from 'lucide-react';
import type { HaircutFormula } from '@/lib/types';
import type { AdminAppointment } from './types';

interface HaircutFormulaModalProps {
  appointment: AdminAppointment | null;
  formula: HaircutFormula;
  onChangeFormula: (formula: HaircutFormula) => void;
  onSave: () => void;
  onClose: () => void;
}

export const HaircutFormulaModal: React.FC<HaircutFormulaModalProps> = ({
  appointment,
  formula,
  onChangeFormula,
  onSave,
  onClose,
}) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E5DDD0] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1C1C1C] text-gold flex items-center justify-center font-black">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#1C1C1C]">נוסחת תספורת והעדפות אישיות</h3>
              <p className="text-xs text-[#6B6560]">
                {appointment.customerName} · {appointment.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs font-bold text-[#6B6560]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              ✂️ מספר מכונה בצדדים וסגנון פייד
            </label>
            <input
              type="text"
              placeholder="למשל: 0.5 סקין פייד נמוך, טייפר עדין"
              value={formula.sides || ''}
              onChange={(e) => onChangeFormula({ ...formula, sides: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              💈 חלק עליון ומספריים
            </label>
            <input
              type="text"
              placeholder="למשל: קיצור חצי אורך, טקסטורה, פוני ישר"
              value={formula.top || ''}
              onChange={(e) => onChangeFormula({ ...formula, top: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              🪒 זקן וקווי מתאר
            </label>
            <input
              type="text"
              placeholder="למשל: קווים חדים בתער בלחיים, קיצור סנטר, שמן ארגן"
              value={formula.beard || ''}
              onChange={(e) => onChangeFormula({ ...formula, beard: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                ☕ שתייה והעדפה במספרה
              </label>
              <input
                type="text"
                placeholder="למשל: אספרסו קצר בלי סוכר"
                value={formula.beverage || ''}
                onChange={(e) => onChangeFormula({ ...formula, beverage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                ⚠️ רגישויות והערות אישיות
              </label>
              <input
                type="text"
                placeholder="למשל: עור רגיש בעורף, לא להשתמש באלכוהול"
                value={formula.notes || ''}
                onChange={(e) => onChangeFormula({ ...formula, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E5DDD0] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#E5DDD0] text-xs font-bold text-[#6B6560]"
          >
            סגור
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 rounded-xl bg-[#1C1C1C] text-gold hover:bg-[#2C2C2C] text-xs font-black shadow-md transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>שמור נוסחה ללקוח ב-CRM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
