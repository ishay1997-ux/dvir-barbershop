'use client';

import React from 'react';
import { format, isSameDay, eachDayOfInterval, addDays } from 'date-fns';
import type { AdminAppointment } from './types';

interface MonthlyCalendarGridProps {
  monthWeeks: Date[];
  currentDate: Date;
  today: Date;
  filteredAppointments: AdminAppointment[];
  onSelectDay: (day: Date) => void;
}

export const MonthlyCalendarGrid: React.FC<MonthlyCalendarGridProps> = ({
  monthWeeks,
  currentDate,
  today,
  filteredAppointments,
  onSelectDay,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#6B6560] mb-3 pb-2 border-b border-[#F0EBE1]">
        <span>א׳</span>
        <span>ב׳</span>
        <span>ג׳</span>
        <span>ד׳</span>
        <span>ה׳</span>
        <span>ו׳</span>
        <span>שבת</span>
      </div>

      <div className="space-y-2">
        {monthWeeks.map((week, wIdx) => {
          const days = eachDayOfInterval({ start: week, end: addDays(week, 6) });
          return (
            <div key={wIdx} className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = isSameDay(day, today);
                const dayAppts = filteredAppointments.filter((a) => isSameDay(a.date, day));

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => onSelectDay(day)}
                    className={`p-2 rounded-2xl text-center border transition-all h-20 flex flex-col justify-between ${
                      isToday
                        ? 'bg-gold/15 border-gold font-black'
                        : isCurrentMonth
                        ? 'bg-[#FAF7F2] border-[#E5DDD0] hover:border-gold'
                        : 'bg-zinc-50 border-zinc-100 opacity-40'
                    }`}
                  >
                    <span className="text-xs font-bold self-start">{format(day, 'd')}</span>
                    {dayAppts.length > 0 && (
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md py-0.5">
                        {dayAppts.length} תורים
                      </div>
                    )}
                    <span className="text-[9px] text-[#9E9891]">
                      {day.getDay() < 3 ? 'אריאל' : day.getDay() < 6 ? 'רחובות' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
