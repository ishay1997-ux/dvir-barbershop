'use client';

import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Clock, Sun, Moon, Bell, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DailyShiftOverride } from '@/lib/types';

interface TimeSlotItem {
  time: string;
  available: boolean;
  isLunch?: boolean;
}

interface TimeSlotGridProps {
  selectedDate: Date;
  currentShift: DailyShiftOverride | { isOpen: boolean; branchId: string; startTime?: string; endTime?: string; note?: string; isCustomOverride?: boolean };
  selectedTime: string | null;
  timeSlots: TimeSlotItem[];
  morningSlots: TimeSlotItem[];
  afternoonSlots: TimeSlotItem[];
  eveningSlots: TimeSlotItem[];
  availableCount: number;
  onTimeSelect: (time: string) => void;
  onOpenWaitlistModal: () => void;
  waitlistPhone: string;
  onWaitlistPhoneChange: (phone: string) => void;
  waitlistSuccess: boolean;
  onQuickWaitlistSubmit: () => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedDate,
  currentShift,
  selectedTime,
  morningSlots,
  afternoonSlots,
  eveningSlots,
  availableCount,
  onTimeSelect,
  onOpenWaitlistModal,
  waitlistPhone,
  onWaitlistPhoneChange,
  waitlistSuccess,
  onQuickWaitlistSubmit,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] p-5 sm:p-7 shadow-sm animate-fadeIn">
      {/* Active Shift Indicator */}
      <div className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded-2xl px-4 py-3 mb-5 text-xs sm:text-sm font-bold text-[#1C1C1C]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold flex-shrink-0" />
          <span>
            שעות קבלת קהל:{' '}
            <strong className="font-mono text-black">
              {currentShift.startTime} - {currentShift.endTime}
            </strong>
            {currentShift.note ? ` (${currentShift.note})` : ''}
          </span>
        </div>
        <span className="text-xs text-[#6B6560] hidden sm:inline font-bold">
          📍 {currentShift.branchId === 'ariel' ? 'סניף אריאל' : currentShift.branchId === 'rehovot' ? 'סניף רחובות' : ''}
        </span>
      </div>

      {/* Header & Live Capacity Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#F0EBE1]">
        <div>
          <span className="text-xs text-[#9E9891] block font-bold">תאריך נבחר:</span>
          <div className="text-base sm:text-lg font-black text-[#1C1C1C]">
            {format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}
          </div>
        </div>

        <div>
          {availableCount > 3 ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {availableCount} תורים פנויים ליום זה
            </span>
          ) : availableCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              נשארו {availableCount} תורים אחרונים!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
              היום מלא (אין תורים פנויים)
            </span>
          )}
        </div>
      </div>

      {/* If all slots booked -> Show Waitlist */}
      {availableCount === 0 ? (
        <div className="text-center py-6 bg-[#FAF7F2] rounded-2xl p-6 border border-[#E5DDD0]">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-3 text-gold">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-black text-base text-[#1C1C1C] mb-1">
            כל התורים ליום זה נתפסו!
          </h3>
          <p className="text-xs text-[#6B6560] max-w-sm mx-auto mb-4">
            רוצה לקבל עדכון ראשון אם לקוח אחר יבטל את התור שלו ליום זה? הירשם לרשימת המתנה:
          </p>

          {waitlistSuccess ? (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-xl max-w-xs mx-auto">
              <CheckCircle2 className="w-4 h-4" />
              נרשמת בהצלחה לרשימת ההמתנה!
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <input
                type="tel"
                placeholder="הכנס מספר נייד שלך"
                value={waitlistPhone}
                onChange={(e) => onWaitlistPhoneChange(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold bg-white"
                dir="ltr"
              />
              <button
                type="button"
                onClick={onQuickWaitlistSubmit}
                className="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C] cursor-pointer"
              >
                הודע לי כשיתפנה
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Morning */}
          {morningSlots.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6B6560] mb-3">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>שעות הבוקר (09:00 – 12:00)</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                {morningSlots.map(({ time, available }) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => available && onTimeSelect(time)}
                    disabled={!available}
                    className={cn(
                      'py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-center active:scale-95 cursor-pointer',
                      selectedTime === time
                        ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40 scale-105'
                        : available
                        ? 'bg-[#FAF7F2] text-[#1C1C1C] border-[#E5DDD0] hover:border-gold hover:bg-gold/10'
                        : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through opacity-50'
                    )}
                    dir="ltr"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Afternoon */}
          {afternoonSlots.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6B6560] mb-3">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>שעות הצהריים (12:00 – 16:30)</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                {afternoonSlots.map(({ time, available, isLunch }) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => available && onTimeSelect(time)}
                    disabled={!available}
                    title={isLunch ? 'הפסקת צהריים' : undefined}
                    className={cn(
                      'py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-center active:scale-95 cursor-pointer',
                      selectedTime === time
                        ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40 scale-105'
                        : available
                        ? 'bg-[#FAF7F2] text-[#1C1C1C] border-[#E5DDD0] hover:border-gold hover:bg-gold/10'
                        : isLunch
                        ? 'bg-amber-50 text-amber-600/60 border-amber-200 cursor-not-allowed text-xs'
                        : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through opacity-50'
                    )}
                    dir="ltr"
                  >
                    {isLunch ? 'הפסקה ☕' : time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Evening */}
          {eveningSlots.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6B6560] mb-3">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>שעות הערב (16:30 – 20:00)</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                {eveningSlots.map(({ time, available }) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => available && onTimeSelect(time)}
                    disabled={!available}
                    className={cn(
                      'py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-center active:scale-95 cursor-pointer',
                      selectedTime === time
                        ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40 scale-105'
                        : available
                        ? 'bg-[#FAF7F2] text-[#1C1C1C] border-[#E5DDD0] hover:border-gold hover:bg-gold/10'
                        : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through opacity-50'
                    )}
                    dir="ltr"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Smart Waitlist Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#1C1C1C]">
                  לא מצאת שעה שמתאימה לך לתאריך זה?
                </h4>
                <p className="text-[11px] text-[#6B6560]">
                  הצטרף לרשימת ההמתנה ונודיע לך בוואטסאפ ברגע שיתפנה תור מביטול!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenWaitlistModal}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#1C1C1C] text-gold font-bold text-xs hover:bg-[#2C2C2C] active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>הצטרף לרשימת המתנה</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
