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
    <div className="bg-[#111420] rounded-2xl border border-slate-800/80 p-3 shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* View Mode Switcher */}
      <div className="flex items-center gap-1 bg-[#141827] p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onViewModeChange('day')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'day' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          יומי
        </button>
        <button
          onClick={() => onViewModeChange('week')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'week' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          שבועי
        </button>
        <button
          onClick={() => onViewModeChange('month')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'month' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          חודשי
        </button>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="font-bold text-sm text-white min-w-32 text-center font-sans">
          {viewMode === 'day' && format(currentDate, 'd בMMMM yyyy', { locale: he })}
          {viewMode === 'week' &&
            `${format(weekDays[0], 'd MMM', { locale: he })} - ${format(weekDays[6], 'd MMM yyyy', { locale: he })}`}
          {viewMode === 'month' && format(currentDate, 'MMMM yyyy', { locale: he })}
        </span>

        <button
          onClick={onNext}
          className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onToday}
          className="text-xs font-bold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 px-3 py-1.5 rounded-xl border border-indigo-500/30 transition-colors mr-2 cursor-pointer shadow-xs"
        >
          היום
        </button>
      </div>

      {/* Branch Filter Switcher */}
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          סניף:
        </span>
        <button
          onClick={() => onBranchFilterChange('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedBranchFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          הכל
        </button>
        <button
          onClick={() => onBranchFilterChange('ariel')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedBranchFilter === 'ariel'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          📍 סניף מרכזי
        </button>
      </div>
    </div>
  );
};
