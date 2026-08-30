'use client';

import React from 'react';
import { format, isSameMonth, isSameDay, isToday } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

interface BookingCalendarProps {
  currentMonth: Date;
  selectedDate: Date | null;
  calendarDays: Date[];
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToToday: () => void;
  onDateSelect: (date: Date) => void;
  isDayDisabled: (day: Date) => boolean;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  currentMonth,
  selectedDate,
  calendarDays,
  canGoPrev,
  canGoNext,
  onPrevMonth,
  onNextMonth,
  onJumpToToday,
  onDateSelect,
  isDayDisabled,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-[#E5DDD0] p-5 sm:p-7 shadow-sm">
      {/* Calendar Header with Month/Year Navigation */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0EBE1]">
        {/* Month & Year Display */}
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#C9A84C]" />
          <h3 className="text-lg sm:text-xl font-black text-[#1C1C1C] capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: he })}
          </h3>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onJumpToToday}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[#E5DDD0] text-[#6B6560] hover:text-[#1C1C1C] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all cursor-pointer ml-1"
          >
            היום
          </button>

          {/* In RTL: Right arrow goes to Previous month */}
          <button
            type="button"
            onClick={onPrevMonth}
            disabled={!canGoPrev}
            className="w-9 h-9 rounded-xl border border-[#E5DDD0] flex items-center justify-center text-[#1C1C1C] hover:bg-[#FAF7F2] hover:border-[#C9A84C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="חודש קודם"
            aria-label="חודש קודם"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* In RTL: Left arrow goes to Next month */}
          <button
            type="button"
            onClick={onNextMonth}
            disabled={!canGoNext}
            className="w-9 h-9 rounded-xl border border-[#E5DDD0] flex items-center justify-center text-[#1C1C1C] hover:bg-[#FAF7F2] hover:border-[#C9A84C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="חודש הבא"
            aria-label="חודש הבא"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Header (7 Columns) */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center mb-3">
        {WEEKDAYS.map((weekday, i) => (
          <div key={i} className="text-xs sm:text-sm font-black text-[#8C827A] py-1">
            {weekday}
          </div>
        ))}
      </div>

      {/* Days Grid (7 Columns) */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isDayToday = isToday(day);
          const disabled = isDayDisabled(day);

          if (!isCurrentMonth) {
            return (
              <div
                key={day.toISOString()}
                className="aspect-square flex items-center justify-center rounded-2xl text-xs text-zinc-300 opacity-20 pointer-events-none select-none"
              >
                {format(day, 'd')}
              </div>
            );
          }

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onDateSelect(day)}
              className={cn(
                'aspect-square flex flex-col items-center justify-center rounded-2xl text-xs sm:text-sm font-bold transition-all relative select-none cursor-pointer',
                isSelected
                  ? 'bg-[#C9A84C] text-[#1C1C1C] font-black shadow-lg shadow-[#C9A84C]/35 scale-105 border-2 border-[#1C1C1C] z-10'
                  : disabled
                  ? 'text-zinc-300 bg-transparent cursor-not-allowed opacity-35 line-through font-normal'
                  : 'bg-[#FAF7F2] text-[#1C1C1C] border border-[#E5DDD0] hover:border-[#C9A84C] hover:bg-[#C9A84C]/15 hover:scale-105 active:scale-95'
              )}
            >
              <span>{format(day, 'd')}</span>

              {/* Today Indicator Dot */}
              {isDayToday && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute bottom-1.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
