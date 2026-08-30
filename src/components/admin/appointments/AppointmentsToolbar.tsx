'use client';

import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { ChevronRight, ChevronLeft, Filter } from 'lucide-react';

interface AppointmentsToolbarProps {
  viewMode: 'day' | 'week' | 'month';
  currentDate: Date;
  weekDays: Date[];
  selectedBranchFilter: 'all' | 'ariel' | 'rehovot';
  onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onBranchFilterChange: (branch: 'all' | 'ariel' | 'rehovot') => void;
}

export const AppointmentsToolbar: React.FC<AppointmentsToolbarProps> = ({
  viewMode,
  currentDate,
  weekDays,
  selectedBranchFilter,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  onBranchFilterChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5DDD0] p-3 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* View Mode Switcher */}
      <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5DDD0]">
        <button
          onClick={() => onViewModeChange('day')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'day' ? 'bg-[#1C1C1C] text-gold shadow-sm' : 'text-[#6B6560] hover:text-[#1C1C1C]'
          }`}
        >
          יומי
        </button>
        <button
          onClick={() => onViewModeChange('week')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'week' ? 'bg-[#1C1C1C] text-gold shadow-sm' : 'text-[#6B6560] hover:text-[#1C1C1C]'
          }`}
        >
          שבועי
        </button>
        <button
          onClick={() => onViewModeChange('month')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'month' ? 'bg-[#1C1C1C] text-gold shadow-sm' : 'text-[#6B6560] hover:text-[#1C1C1C]'
          }`}
        >
          חודשי
        </button>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] flex items-center justify-center hover:border-gold transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 text-[#1C1C1C]" />
        </button>

        <span className="font-bold text-sm text-[#1C1C1C] min-w-32 text-center">
          {viewMode === 'day' && format(currentDate, 'd בMMMM yyyy', { locale: he })}
          {viewMode === 'week' &&
            `${format(weekDays[0], 'd MMM', { locale: he })} - ${format(weekDays[6], 'd MMM yyyy', { locale: he })}`}
          {viewMode === 'month' && format(currentDate, 'MMMM yyyy', { locale: he })}
        </span>

        <button
          onClick={onNext}
          className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] flex items-center justify-center hover:border-gold transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-[#1C1C1C]" />
        </button>

        <button
          onClick={onToday}
          className="text-xs font-bold text-gold bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-xl border border-gold/30 transition-colors mr-2 cursor-pointer"
        >
          היום
        </button>
      </div>

      {/* Branch Filter Switcher */}
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-[#6B6560] flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          סניף:
        </span>
        <button
          onClick={() => onBranchFilterChange('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedBranchFilter === 'all'
              ? 'bg-zinc-800 text-white'
              : 'bg-[#FAF7F2] text-[#6B6560] border'
          }`}
        >
          הכל
        </button>
        <button
          onClick={() => onBranchFilterChange('ariel')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedBranchFilter === 'ariel'
              ? 'bg-gold text-[#1C1C1C] font-black'
              : 'bg-[#FAF7F2] text-[#6B6560] border hover:border-gold'
          }`}
        >
          📍 סניף אריאל
        </button>
        <button
          onClick={() => onBranchFilterChange('rehovot')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedBranchFilter === 'rehovot'
              ? 'bg-amber-800 text-white font-black'
              : 'bg-[#FAF7F2] text-[#6B6560] border hover:border-amber-800'
          }`}
        >
          📍 סניף רחובות
        </button>
      </div>
    </div>
  );
};
