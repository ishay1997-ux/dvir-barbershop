'use client';

import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { ChevronRight, ChevronLeft, Filter } from 'lucide-react';

interface AppointmentsToolbarProps {
  viewMode: 'day' | 'week' | 'month';
  currentDate: Date;
  weekDays: Date[];
  selectedBranchFilter: string;
  branches?: { id: string; name: string }[];
  onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onBranchFilterChange: (branch: any) => void;
}

export const AppointmentsToolbar: React.FC<AppointmentsToolbarProps> = ({
  viewMode,
  currentDate,
  weekDays,
  selectedBranchFilter,
  branches = [],
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  onBranchFilterChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* View Mode Switcher */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => onViewModeChange('day')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'day' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          יומי
        </button>
        <button
          onClick={() => onViewModeChange('week')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'week' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          שבועי
        </button>
        <button
          onClick={() => onViewModeChange('month')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'month' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          חודשי
        </button>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="font-bold text-sm text-slate-900 min-w-32 text-center font-sans">
          {viewMode === 'day' && format(currentDate, 'd בMMMM yyyy', { locale: he })}
          {viewMode === 'week' &&
            `${format(weekDays[0], 'd MMM', { locale: he })} - ${format(weekDays[6], 'd MMM yyyy', { locale: he })}`}
          {viewMode === 'month' && format(currentDate, 'MMMM yyyy', { locale: he })}
        </span>

        <button
          onClick={onNext}
          className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onToday}
          className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors mr-2 cursor-pointer shadow-xs"
        >
          היום
        </button>
      </div>

      {/* Branch Filter Switcher */}
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          סניף:
        </span>
        <button
          onClick={() => onBranchFilterChange('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedBranchFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          הכל
        </button>
        {branches.length > 0 ? (
          branches.map((b) => (
            <button
              key={b.id}
              onClick={() => onBranchFilterChange(b.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBranchFilter === b.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b.name}
            </button>
          ))
        ) : (
          <button
            onClick={() => onBranchFilterChange('main')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedBranchFilter === 'main'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            סניף מרכזי
          </button>
        )}
      </div>
    </div>
  );
};
