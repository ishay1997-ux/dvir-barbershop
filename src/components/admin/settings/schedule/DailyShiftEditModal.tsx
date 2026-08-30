'use client';

import React from 'react';
import { Sparkles, RotateCcw, X } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface ShiftFormState {
  branchId: 'ariel' | 'rehovot' | 'closed';
  isOpen: boolean;
  startTime: string;
  endTime: string;
  note: string;
}

interface DailyShiftEditModalProps {
  editingDate: Date | null;
  shiftForm: ShiftFormState;
  onClose: () => void;
  onChangeShiftForm: (form: ShiftFormState) => void;
  onSaveShiftOverride: () => void;
  onResetShiftOverride: (date: Date) => void;
}

export const DailyShiftEditModal: React.FC<DailyShiftEditModalProps> = ({
  editingDate,
  shiftForm,
  onClose,
  onChangeShiftForm,
  onSaveShiftOverride,
  onResetShiftOverride,
}) => {
  if (!editingDate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl border border-[#E5DDD0] p-6 w-full max-w-md shadow-2xl relative"
        dir="rtl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 text-[#9E9891] hover:text-[#1C1C1C] p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-gold text-xs font-black uppercase mb-1">
          <Sparkles className="w-4 h-4 text-gold" />
          עריכת שיבוץ יומי מהיר
        </div>

        <h3 className="text-xl font-black text-[#1C1C1C]">
          {format(editingDate, 'EEEE, d בMMMM yyyy', { locale: he })}
        </h3>
        <p className="text-xs text-[#6B6560] mb-5">
          הגדר באיזה סניף תעבוד ובאילו שעות תוכל לקבל לקוחות ביום זה:
        </p>

        {/* 1. Branch Selector */}
        <div className="mb-5">
          <label className="block text-xs font-black text-[#1C1C1C] mb-2">
            באיזה סניף אתה ביום זה?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onChangeShiftForm({ ...shiftForm, branchId: 'ariel', isOpen: true })}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                shiftForm.branchId === 'ariel' && shiftForm.isOpen
                  ? 'bg-gold text-[#1C1C1C] border-gold font-black shadow-sm ring-2 ring-gold/30'
                  : 'bg-[#FAF7F2] text-[#6B6560] border-[#E5DDD0] hover:border-gold'
              }`}
            >
              📍 סניף אריאל
            </button>

            <button
              type="button"
              onClick={() => onChangeShiftForm({ ...shiftForm, branchId: 'rehovot', isOpen: true })}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                shiftForm.branchId === 'rehovot' && shiftForm.isOpen
                  ? 'bg-amber-900 text-white border-amber-900 font-black shadow-sm ring-2 ring-amber-900/30'
                  : 'bg-[#FAF7F2] text-[#6B6560] border-[#E5DDD0] hover:border-amber-900'
              }`}
            >
              📍 סניף רחובות
            </button>

            <button
              type="button"
              onClick={() =>
                onChangeShiftForm({
                  ...shiftForm,
                  branchId: 'closed',
                  isOpen: false,
                  note: 'סגור',
                })
              }
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                !shiftForm.isOpen || shiftForm.branchId === 'closed'
                  ? 'bg-zinc-800 text-white border-zinc-800 font-black shadow-sm'
                  : 'bg-[#FAF7F2] text-[#9E9891] border-[#E5DDD0] hover:bg-zinc-100'
              }`}
            >
              ⛔ סגור היום
            </button>
          </div>
        </div>

        {/* 2. Fast 1-Click Shift Presets */}
        {shiftForm.isOpen && shiftForm.branchId !== 'closed' && (
          <div className="mb-5">
            <label className="block text-xs font-black text-[#1C1C1C] mb-2 flex items-center justify-between">
              <span>⚡ כפתורי קיצור לשעות עבודה:</span>
              <span className="text-[10px] text-[#9E9891] font-normal">בלחיצה אחת</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onChangeShiftForm({
                    ...shiftForm,
                    isOpen: true,
                    startTime: '16:00',
                    endTime: '19:00',
                    note: '3 שעות ערב',
                  })
                }
                className="flex flex-col items-start p-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold transition-all text-right cursor-pointer"
              >
                <span className="text-xs font-black text-[#1C1C1C]">⚡ 3 שעות ערב</span>
                <span className="text-[10px] text-[#6B6560] font-mono mt-0.5">16:00 - 19:00</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChangeShiftForm({
                    ...shiftForm,
                    isOpen: true,
                    startTime: '09:00',
                    endTime: '13:00',
                    note: 'בוקר בלבד',
                  })
                }
                className="flex flex-col items-start p-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold transition-all text-right cursor-pointer"
              >
                <span className="text-xs font-black text-[#1C1C1C]">🌅 בוקר בלבד</span>
                <span className="text-[10px] text-[#6B6560] font-mono mt-0.5">09:00 - 13:00</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChangeShiftForm({
                    ...shiftForm,
                    isOpen: true,
                    startTime: '09:00',
                    endTime: '20:00',
                    note: 'יום מלא',
                  })
                }
                className="flex flex-col items-start p-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold transition-all text-right cursor-pointer"
              >
                <span className="text-xs font-black text-[#1C1C1C]">☀️ יום מלא</span>
                <span className="text-[10px] text-[#6B6560] font-mono mt-0.5">09:00 - 20:00</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChangeShiftForm({
                    ...shiftForm,
                    isOpen: true,
                    startTime: '14:00',
                    endTime: '21:00',
                    note: 'אחה״צ וערב',
                  })
                }
                className="flex flex-col items-start p-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold transition-all text-right cursor-pointer"
              >
                <span className="text-xs font-black text-[#1C1C1C]">🌙 אחה״צ וערב</span>
                <span className="text-[10px] text-[#6B6560] font-mono mt-0.5">14:00 - 21:00</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Custom Time Inputs */}
        {shiftForm.isOpen && shiftForm.branchId !== 'closed' && (
          <div className="mb-5 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]">
            <span className="block text-xs font-black text-[#1C1C1C] mb-2.5">
              או התאם שעות ידנית:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#6B6560] mb-1 font-bold">
                  שעת פתיחה
                </label>
                <input
                  type="time"
                  value={shiftForm.startTime}
                  onChange={(e) => onChangeShiftForm({ ...shiftForm, startTime: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] focus:border-gold rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#6B6560] mb-1 font-bold">
                  שעת סגירה
                </label>
                <input
                  type="time"
                  value={shiftForm.endTime}
                  onChange={(e) => onChangeShiftForm({ ...shiftForm, endTime: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] focus:border-gold rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] text-[#6B6560] mb-1 font-bold">
                הערה מיוחדת (מוצגת ללקוחות)
              </label>
              <input
                type="text"
                placeholder="למשל: 3 שעות בלבד / חלון ערב"
                value={shiftForm.note}
                onChange={(e) => onChangeShiftForm({ ...shiftForm, note: e.target.value })}
                className="w-full bg-white border border-[#E5DDD0] focus:border-gold rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onSaveShiftOverride}
            className="btn-shimmer flex-1 text-[#1C1C1C] font-black text-xs py-3 rounded-xl shadow-gold hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer"
          >
            שמור ועדכן תורים ללקוחות ✨
          </button>

          <button
            type="button"
            onClick={() => onResetShiftOverride(editingDate)}
            className="px-3 py-3 rounded-xl border border-[#E5DDD0] text-[#6B6560] hover:text-red-600 hover:border-red-200 text-xs font-bold transition-all cursor-pointer"
            title="איפוס לתבנית שבועית קבועה"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
