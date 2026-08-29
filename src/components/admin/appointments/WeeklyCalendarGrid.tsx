'use client';

import React from 'react';
import { format, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { formatPrice } from '@/lib/utils';
import type { ShopSettings } from '@/lib/types';
import type { AdminAppointment } from './types';

interface WeeklyCalendarGridProps {
  weekDays: Date[];
  today: Date;
  filteredAppointments: AdminAppointment[];
  settings: ShopSettings;
  onSelectDay: (day: Date) => void;
}

export const WeeklyCalendarGrid: React.FC<WeeklyCalendarGridProps> = ({
  weekDays,
  today,
  filteredAppointments,
  settings,
  onSelectDay,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#F0EBE1]">
        {weekDays.map((day) => {
          const dayIndex = day.getDay();
          const isToday = isSameDay(day, today);
          const dayAppts = filteredAppointments.filter((a) => isSameDay(a.date, day));
          const isSat = dayIndex === 6;

          const branchLocation =
            settings.branchSchedule?.[dayIndex] ||
            (dayIndex < 3 ? 'ariel' : dayIndex < 6 ? 'rehovot' : 'closed');

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDay(day)}
              className={`p-3 sm:p-4 flex flex-col justify-between min-h-[220px] transition-colors cursor-pointer hover:bg-[#FAF7F2]/80 ${
                isToday ? 'bg-gold/10' : isSat ? 'bg-zinc-50' : 'bg-white'
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#6B6560]">
                    {format(day, 'EEEE', { locale: he })}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                      isToday ? 'bg-[#1C1C1C] text-gold' : 'text-[#1C1C1C]'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Branch Badge */}
                <div className="mb-3">
                  {branchLocation === 'ariel' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-[#1C1C1C] border border-gold/40 block text-center">
                      אריאל (אוניברסיטה)
                    </span>
                  )}
                  {branchLocation === 'rehovot' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-800 text-white block text-center">
                      רחובות (בית ההורים)
                    </span>
                  )}
                  {branchLocation === 'closed' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600 block text-center">
                      סגור / חופש
                    </span>
                  )}
                </div>

                {/* Appointments list preview */}
                <div className="space-y-1.5">
                  {dayAppts.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-1.5 rounded-lg border border-[#E5DDD0] text-[11px] font-bold shadow-xs truncate"
                    >
                      <span className="text-gold ml-1" dir="ltr">
                        {app.time}
                      </span>
                      <span className="text-[#1C1C1C]">{app.customerName}</span>
                    </div>
                  ))}
                  {dayAppts.length > 3 && (
                    <div className="text-[10px] font-bold text-center text-[#6B6560]">
                      + עוד {dayAppts.length - 3} תורים
                    </div>
                  )}
                </div>
              </div>

              {/* Day Footer */}
              <div className="pt-3 border-t border-[#F0EBE1] text-[11px] font-bold flex items-center justify-between text-[#6B6560]">
                <span>{dayAppts.length} תורים</span>
                {dayAppts.length > 0 && (
                  <span className="text-emerald-600">
                    {formatPrice(dayAppts.reduce((s, a) => s + a.price, 0))}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
