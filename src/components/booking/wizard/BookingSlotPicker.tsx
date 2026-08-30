'use client';

import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import type { TimeWindowSlot } from '@/lib/slot-engine';
import type { BusinessService } from '@/types/business';

interface BookingSlotPickerProps {
  next7Days: Date[];
  selectedDate: string;
  selectedTime: string;
  selectedService: BusinessService | null;
  themeColor: string;
  dynamicSlots: string[];
  timeWindows: TimeWindowSlot[];
  onSelectDate: (dateStr: string) => void;
  onSelectTime: (timeStr: string) => void;
}

export const BookingSlotPicker: React.FC<BookingSlotPickerProps> = ({
  next7Days,
  selectedDate,
  selectedTime,
  selectedService,
  themeColor,
  dynamicSlots,
  timeWindows,
  onSelectDate,
  onSelectTime,
}) => {
  const isTimeWindow = selectedService?.bookingType === 'TIME_WINDOW';

  return (
    <div className="space-y-4">
      {/* 2. Choose Date */}
      <div>
        <label className="block text-xs font-bold text-zinc-300 mb-2">2. בחר יום:</label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {next7Days.map((d) => {
            const dStr = format(d, 'yyyy-MM-dd');
            const isSelected = selectedDate === dStr;
            return (
              <button
                key={dStr}
                type="button"
                onClick={() => onSelectDate(dStr)}
                className={`shrink-0 w-16 py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'text-black font-black'
                    : 'bg-[#141414] border-white/10 text-zinc-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? themeColor : '#141414',
                  borderColor: isSelected ? themeColor : 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="text-[10px] uppercase">{format(d, 'EEE', { locale: he })}</div>
                <div className="text-sm font-black">{format(d, 'd')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Choose Time */}
      <div>
        <label className="block text-xs font-bold text-zinc-300 mb-2">
          {isTimeWindow ? '3. בחר חלון הגעה נוח:' : '3. בחר שעה פנויה:'}
        </label>

        {isTimeWindow ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {timeWindows.map((w) => {
              const isSelected = selectedTime === w.range;
              return (
                <button
                  key={w.id}
                  type="button"
                  disabled={!w.available}
                  onClick={() => onSelectTime(w.range)}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    !w.available
                      ? 'opacity-40 bg-white/5 border-transparent text-zinc-500 cursor-not-allowed'
                      : isSelected
                      ? 'text-black font-black shadow-md'
                      : 'bg-[#141414] border-white/10 text-white hover:border-white/30'
                  }`}
                  style={{
                    backgroundColor: isSelected ? themeColor : undefined,
                    borderColor: isSelected ? themeColor : undefined,
                  }}
                >
                  <div className="text-xs font-bold">{w.label}</div>
                  <div className="text-[11px] opacity-80">{w.range}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5" dir="ltr">
            {dynamicSlots.length === 0 ? (
              <div className="col-span-full py-4 text-center text-xs text-zinc-500" dir="rtl">
                אין שעות פנויות זמינות למועד זה. נא לבחור תאריך אחר.
              </div>
            ) : (
              dynamicSlots.map((t) => {
                const isSelected = selectedTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onSelectTime(t)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected ? 'text-black shadow-md' : 'bg-[#141414] border-white/10 text-zinc-300 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isSelected ? themeColor : '#141414',
                      borderColor: isSelected ? themeColor : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {t}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
