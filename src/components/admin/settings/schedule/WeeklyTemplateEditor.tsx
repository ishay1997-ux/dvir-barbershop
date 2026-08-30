'use client';

import React from 'react';
import type { ShopSettings, Branch } from '@/lib/types';

const DAYS_META = [
  { dayIndex: 0, name: 'ראשון' },
  { dayIndex: 1, name: 'שני' },
  { dayIndex: 2, name: 'שלישי' },
  { dayIndex: 3, name: 'רביעי' },
  { dayIndex: 4, name: 'חמישי' },
  { dayIndex: 5, name: 'שישי' },
  { dayIndex: 6, name: 'שבת' },
];

interface WeeklyTemplateEditorProps {
  settings: ShopSettings;
  branches: Branch[];
  onScheduleChange: (dayIndex: number, location: 'ariel' | 'rehovot' | 'closed') => void;
}

export const WeeklyTemplateEditor: React.FC<WeeklyTemplateEditorProps> = ({
  settings,
  onScheduleChange,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-black text-[#1C1C1C]">תבנית שבועית קבועה (ברירת מחדל)</h2>
        <p className="text-xs text-[#6B6560] mt-1">
          הגדרת סניף ברירת מחדל לכל יום בשבוע. תאריכים שלא הוגדרו עבורם שעות מותאמות אישית ישתמשו
          בתבנית זו.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {DAYS_META.map((day) => {
          const currentLoc =
            settings.branchSchedule?.[day.dayIndex] ||
            (day.dayIndex < 3 ? 'ariel' : day.dayIndex < 6 ? 'rehovot' : 'closed');

          return (
            <div
              key={day.dayIndex}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#1C1C1C] text-gold font-black text-xs flex items-center justify-center flex-shrink-0">
                  {day.name.slice(0, 1)}
                </span>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-[#1C1C1C]">
                    יום {day.name}
                  </span>
                  <div className="text-[11px] text-[#6B6560]">
                    {currentLoc === 'ariel' && '📍 סניף אריאל'}
                    {currentLoc === 'rehovot' && '📍 סניף רחובות'}
                    {currentLoc === 'closed' && '⚪ סגור / חופש'}
                  </div>
                </div>
              </div>

              {/* Location Selector Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onScheduleChange(day.dayIndex, 'ariel')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentLoc === 'ariel'
                      ? 'bg-gold text-[#1C1C1C] shadow-sm font-black'
                      : 'bg-white text-[#6B6560] border hover:border-gold'
                  }`}
                >
                  סניף אריאל
                </button>

                <button
                  type="button"
                  onClick={() => onScheduleChange(day.dayIndex, 'rehovot')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentLoc === 'rehovot'
                      ? 'bg-amber-800 text-white shadow-sm font-black'
                      : 'bg-white text-[#6B6560] border hover:border-amber-800'
                  }`}
                >
                  סניף רחובות
                </button>

                <button
                  type="button"
                  onClick={() => onScheduleChange(day.dayIndex, 'closed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentLoc === 'closed'
                      ? 'bg-zinc-700 text-white shadow-sm'
                      : 'bg-white text-[#9E9891] border hover:bg-zinc-100'
                  }`}
                >
                  סגור
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
