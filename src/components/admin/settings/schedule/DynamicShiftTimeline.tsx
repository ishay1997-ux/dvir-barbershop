'use client';

import React from 'react';
import { Clock, MapPin, Sparkles, RotateCcw } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { getEffectiveShiftForDate } from '@/lib/store';
import type { ShopSettings } from '@/lib/types';

interface DynamicShiftTimelineProps {
  settings: ShopSettings;
  today: Date;
  scheduleDaysView: 7 | 14 | 21;
  onSetScheduleDaysView: (days: 7 | 14 | 21) => void;
  onOpenShiftEditor: (date: Date) => void;
  onResetShiftOverride: (date: Date) => void;
}

export const DynamicShiftTimeline: React.FC<DynamicShiftTimelineProps> = ({
  settings,
  today,
  scheduleDaysView,
  onSetScheduleDaysView,
  onOpenShiftEditor,
  onResetShiftOverride,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping" />
            <h2 className="text-lg font-black text-[#1C1C1C]">
              לוח שיבוץ יומי דינמי (השבועות הקרובים)
            </h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הלו"ז שלך משתנה? לחץ על כל יום כדי לשנות סניף או לקבוע שעות מדויקות (למשל: 3 שעות בלבד
            בערב). השינוי מתעדכן מיידית ללקוחות!
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-[#FAF7F2] border border-[#E5DDD0] p-1 rounded-xl self-start sm:self-auto">
          {([7, 14, 21] as const).map((days) => (
            <button
              key={days}
              onClick={() => onSetScheduleDaysView(days)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                scheduleDaysView === days
                  ? 'bg-gold text-[#1C1C1C] shadow-xs'
                  : 'text-[#6B6560]'
              }`}
            >
              {days} ימים
            </button>
          ))}
        </div>
      </div>

      {/* Daily Shift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {Array.from({ length: scheduleDaysView }).map((_, idx) => {
          const dayDate = addDays(today, idx);
          const shift = getEffectiveShiftForDate(dayDate, settings);
          const isTodayDate = isSameDay(dayDate, today);

          return (
            <div
              key={shift.date}
              onClick={() => onOpenShiftEditor(dayDate)}
              className={`group relative p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-95 flex flex-col justify-between gap-3 ${
                shift.isCustomOverride
                  ? 'bg-amber-500/5 border-gold shadow-xs ring-1 ring-gold/20'
                  : shift.isOpen
                  ? 'bg-[#FAF7F2] border-[#E5DDD0] hover:border-gold/60'
                  : 'bg-zinc-50 border-zinc-200 opacity-70'
              }`}
            >
              {/* Top Row: Date & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-[#1C1C1C]">
                      {format(dayDate, 'EEEE', { locale: he })}
                    </span>
                    {isTodayDate && (
                      <span className="bg-gold text-[#1C1C1C] text-[10px] font-black px-2 py-0.5 rounded-full">
                        היום
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#6B6560] block font-mono mt-0.5">
                    {format(dayDate, 'd בMMMM yyyy', { locale: he })}
                  </span>
                </div>

                {/* Branch Badge */}
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-2xs ${
                    shift.branchId === 'ariel'
                      ? 'bg-gold/20 text-[#856514] border border-gold/40'
                      : shift.branchId === 'rehovot'
                      ? 'bg-amber-900/15 text-amber-900 border border-amber-900/30'
                      : 'bg-zinc-200 text-zinc-600 border border-zinc-300'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {shift.branchId === 'ariel'
                    ? 'אריאל'
                    : shift.branchId === 'rehovot'
                    ? 'רחובות'
                    : 'סגור'}
                </span>
              </div>

              {/* Middle Row: Active Hours & Notes */}
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#1C1C1C] font-bold">
                  <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  {shift.isOpen ? (
                    <span className="font-mono">
                      {shift.startTime} - {shift.endTime}
                    </span>
                  ) : (
                    <span className="text-zinc-500 font-normal">אין קבלת קהל</span>
                  )}
                </div>

                {shift.isCustomOverride ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-gold bg-[#1C1C1C] px-2 py-0.5 rounded-lg">
                    <Sparkles className="w-3 h-3 text-gold" />
                    {shift.note || 'מותאם אישית'}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#9E9891]">תבנית קבועה</span>
                )}
              </div>

              {/* Bottom Action: Edit Hint */}
              <div className="flex items-center justify-between text-[11px] font-bold text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>לחץ לעריכת שעות/סניף ✏️</span>
                {shift.isCustomOverride && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetShiftOverride(dayDate);
                    }}
                    className="text-red-500 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    איפוס
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
