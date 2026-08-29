'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  RotateCcw,
  Coffee,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { getEffectiveShiftForDate } from '@/lib/store';
import type { Branch, ShopSettings, DailyShiftOverride, BlockedDate } from '@/lib/types';

const DAYS_META = [
  { dayIndex: 0, name: 'ראשון' },
  { dayIndex: 1, name: 'שני' },
  { dayIndex: 2, name: 'שלישי' },
  { dayIndex: 3, name: 'רביעי' },
  { dayIndex: 4, name: 'חמישי' },
  { dayIndex: 5, name: 'שישי' },
  { dayIndex: 6, name: 'שבת' },
];

interface ScheduleSettingsProps {
  settings: ShopSettings;
  branches: Branch[];
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onUpdateBranches: (newBranches: Branch[]) => void;
  onNotifySave: () => void;
}

export default function ScheduleSettings({
  settings,
  branches,
  onUpdateSettings,
  onUpdateBranches,
  onNotifySave,
}: ScheduleSettingsProps) {
  const today = startOfToday();
  const [scheduleDaysView, setScheduleDaysView] = useState<7 | 14 | 21>(14);
  const [editingDate, setEditingDate] = useState<Date | null>(null);

  // Shift Modal State
  const [shiftForm, setShiftForm] = useState<{
    branchId: 'ariel' | 'rehovot' | 'closed';
    isOpen: boolean;
    startTime: string;
    endTime: string;
    note: string;
  }>({
    branchId: 'ariel',
    isOpen: true,
    startTime: '16:00',
    endTime: '19:00',
    note: '3 שעות ערב',
  });

  // Blocked Dates
  const [newBlock, setNewBlock] = useState<{ date: string; reason: string }>({
    date: '',
    reason: '',
  });

  // Open Shift Editor for a specific date
  const openShiftEditor = (date: Date) => {
    const shift = getEffectiveShiftForDate(date, settings);
    setEditingDate(date);
    setShiftForm({
      branchId: shift.branchId,
      isOpen: shift.isOpen,
      startTime: shift.startTime || '09:00',
      endTime: shift.endTime || '20:00',
      note: shift.note || '',
    });
  };

  // Save Shift Override to Store + Cloud API
  const handleSaveShiftOverride = async () => {
    if (!editingDate) return;
    const y = editingDate.getFullYear();
    const m = String(editingDate.getMonth() + 1).padStart(2, '0');
    const d = String(editingDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    const newOverride: DailyShiftOverride = {
      date: dateKey,
      branchId: shiftForm.branchId,
      isOpen: shiftForm.isOpen && shiftForm.branchId !== 'closed',
      startTime: shiftForm.startTime,
      endTime: shiftForm.endTime,
      note: shiftForm.note.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    const updatedOverrides = {
      ...(settings.dailyOverrides || {}),
      [dateKey]: newOverride,
    };

    const updated = {
      ...settings,
      dailyOverrides: updatedOverrides,
    };

    onUpdateSettings(updated);
    setEditingDate(null);
    onNotifySave();

    // Async sync with Firestore API
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOverride),
      });
    } catch (e) {
      console.error('Failed to sync schedule override to cloud:', e);
    }
  };

  // Reset Shift Override to default template
  const handleResetShiftOverride = async (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    const updatedOverrides = { ...(settings.dailyOverrides || {}) };
    delete updatedOverrides[dateKey];

    const updated = {
      ...settings,
      dailyOverrides: updatedOverrides,
    };

    onUpdateSettings(updated);
    setEditingDate(null);
    onNotifySave();

    // Async sync with Firestore API
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateKey, isOpen: false, branchId: 'closed', reset: true }),
      });
    } catch (e) {
      console.error('Failed to reset schedule override on cloud:', e);
    }
  };

  // Save Weekly Branch Schedule Template
  const handleScheduleChange = (dayIndex: number, location: 'ariel' | 'rehovot' | 'closed') => {
    const updatedSchedule = {
      ...settings.branchSchedule,
      [dayIndex]: location,
    };
    const updated = { ...settings, branchSchedule: updatedSchedule };
    onUpdateSettings(updated);

    // Also sync activeDays on branches
    const arielDays = Object.entries(updatedSchedule)
      .filter(([_, loc]) => loc === 'ariel')
      .map(([d]) => Number(d));
    const rehovotDays = Object.entries(updatedSchedule)
      .filter(([_, loc]) => loc === 'rehovot')
      .map(([d]) => Number(d));

    const updatedBranches = branches.map((b) => {
      if (b.id === 'ariel') return { ...b, activeDays: arielDays };
      if (b.id === 'rehovot') return { ...b, activeDays: rehovotDays };
      return b;
    });
    onUpdateBranches(updatedBranches);
    onNotifySave();
  };

  // Add Blocked Date
  const handleAddBlockedDate = () => {
    if (!newBlock.date) return;
    const current = settings.blockedDates || [];
    const created: BlockedDate = {
      id: Date.now().toString(),
      barberId: 'all',
      date: newBlock.date,
      reason: newBlock.reason.trim() || 'חופשה / מילואים',
    };
    const updated = { ...settings, blockedDates: [...current, created] };
    onUpdateSettings(updated);
    setNewBlock({ date: '', reason: '' });
    onNotifySave();
  };

  const handleRemoveBlockedDate = (id: string) => {
    const current = settings.blockedDates || [];
    const updated = {
      ...settings,
      blockedDates: current.filter((b) => b.id !== id),
    };
    onUpdateSettings(updated);
    onNotifySave();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section 1: Upcoming Dynamic Timeline */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping" />
              <h2 className="text-lg font-black text-[#1C1C1C]">לוח שיבוץ יומי דינמי (השבועות הקרובים)</h2>
            </div>
            <p className="text-xs text-[#6B6560] mt-1">
              הלו"ז שלך משתנה? לחץ על כל יום כדי לשנות סניף או לקבוע שעות מדויקות (למשל: 3 שעות בלבד בערב). השינוי מתעדכן מיידית ללקוחות!
            </p>
          </div>

          {/* Range Selector */}
          <div className="flex items-center bg-[#FAF7F2] border border-[#E5DDD0] p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setScheduleDaysView(7)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                scheduleDaysView === 7 ? 'bg-gold text-[#1C1C1C] shadow-xs' : 'text-[#6B6560]'
              }`}
            >
              7 ימים
            </button>
            <button
              onClick={() => setScheduleDaysView(14)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                scheduleDaysView === 14 ? 'bg-gold text-[#1C1C1C] shadow-xs' : 'text-[#6B6560]'
              }`}
            >
              14 ימים
            </button>
            <button
              onClick={() => setScheduleDaysView(21)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                scheduleDaysView === 21 ? 'bg-gold text-[#1C1C1C] shadow-xs' : 'text-[#6B6560]'
              }`}
            >
              21 ימים
            </button>
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
                onClick={() => openShiftEditor(dayDate)}
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
                        handleResetShiftOverride(dayDate);
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

      {/* Section 2: Recurring Weekly Default Template */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-black text-[#1C1C1C]">תבנית שבועית קבועה (ברירת מחדל)</h2>
          <p className="text-xs text-[#6B6560] mt-1">
            הגדרת סניף ברירת מחדל לכל יום בשבוע. תאריכים שלא הוגדרו עבורם שעות מותאמות אישית ישתמשו בתבנית זו.
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
                    <span className="font-bold text-xs sm:text-sm text-[#1C1C1C]">יום {day.name}</span>
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
                    onClick={() => handleScheduleChange(day.dayIndex, 'ariel')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentLoc === 'ariel'
                        ? 'bg-gold text-[#1C1C1C] shadow-sm font-black'
                        : 'bg-white text-[#6B6560] border hover:border-gold'
                    }`}
                  >
                    סניף אריאל
                  </button>

                  <button
                    onClick={() => handleScheduleChange(day.dayIndex, 'rehovot')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentLoc === 'rehovot'
                        ? 'bg-amber-800 text-white shadow-sm font-black'
                        : 'bg-white text-[#6B6560] border hover:border-amber-800'
                    }`}
                  >
                    סניף רחובות
                  </button>

                  <button
                    onClick={() => handleScheduleChange(day.dayIndex, 'closed')}
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

      {/* Section 3: Lunch Break Auto-Block */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-5 h-5 text-gold" />
            <div>
              <h2 className="font-black text-base text-[#1C1C1C]">הפסקת צהריים יומית קבועה</h2>
              <p className="text-xs text-[#6B6560]">חסימה אוטומטית של תורים באמצע היום למנוחה או אוכל</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = settings.lunchBreak?.isActive ?? true;
              const updated = {
                ...settings,
                lunchBreak: {
                  start: settings.lunchBreak?.start || '14:00',
                  end: settings.lunchBreak?.end || '14:30',
                  isActive: !current,
                },
              };
              onUpdateSettings(updated);
              onNotifySave();
            }}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
              settings.lunchBreak?.isActive
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-200 text-zinc-600'
            }`}
          >
            {settings.lunchBreak?.isActive ? '✓ הפסקה מופעלת' : 'ללא הפסקה'}
          </button>
        </div>

        {settings.lunchBreak?.isActive && (
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0] flex flex-wrap items-center gap-3 text-xs mt-3">
            <span className="font-bold text-[#1C1C1C]">שעות הפסקה:</span>
            <div className="flex items-center gap-2" dir="ltr">
              <input
                type="time"
                value={settings.lunchBreak?.start || '14:00'}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    lunchBreak: {
                      start: e.target.value,
                      end: settings.lunchBreak?.end || '14:30',
                      isActive: true,
                    },
                  };
                  onUpdateSettings(updated);
                  onNotifySave();
                }}
                className="px-3 py-1.5 border rounded-xl bg-white font-mono font-bold"
              />
              <span className="text-[#9E9891]">עד</span>
              <input
                type="time"
                value={settings.lunchBreak?.end || '14:30'}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    lunchBreak: {
                      start: settings.lunchBreak?.start || '14:00',
                      end: e.target.value,
                      isActive: true,
                    },
                  };
                  onUpdateSettings(updated);
                  onNotifySave();
                }}
                className="px-3 py-1.5 border rounded-xl bg-white font-mono font-bold"
              />
            </div>
            <span className="text-[#9E9891] text-[11px]">(שעות אלו ייחסמו אוטומטית לקביעת תור)</span>
          </div>
        )}
      </div>

      {/* Section 4: Blocked Dates (Vacation / Military) */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <h2 className="font-black text-base text-[#1C1C1C] mb-1">חסימת ימי מילואים או חופשות ספציפיות</h2>
        <p className="text-xs text-[#6B6560] mb-4">תאריך שנחסם כאן ייסגר להזמנות אוטומטית לכל הלקוחות</p>

        {/* Existing Blocks */}
        {(settings.blockedDates || []).length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {settings.blockedDates?.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between bg-red-50 border border-red-100 px-4 py-2.5 rounded-2xl"
              >
                <div className="text-xs flex items-center gap-2">
                  <span className="font-mono font-bold text-red-700">{block.date}</span>
                  <span className="text-red-600 font-bold">({block.reason})</span>
                </div>
                <button
                  onClick={() => handleRemoveBlockedDate(block.id)}
                  className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-100 transition-colors"
                  title="בטל חסימה"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add block form */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="date"
            value={newBlock.date}
            onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
            className="px-3.5 py-2.5 border rounded-xl text-xs outline-none focus:border-gold bg-white"
          />
          <input
            type="text"
            placeholder="סיבת החסימה (למשל: שבוע מילואים / חופשה שנתית)"
            value={newBlock.reason}
            onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
            className="flex-1 px-3.5 py-2.5 border rounded-xl text-xs outline-none focus:border-gold bg-white"
          />
          <button
            onClick={handleAddBlockedDate}
            className="btn-shimmer px-5 py-2.5 rounded-xl text-xs font-bold text-[#1C1C1C] hover:scale-105 active:scale-95 transition-transform whitespace-nowrap shadow-sm"
          >
            הוסף חסימה
          </button>
        </div>
      </div>

      {/* QUICK DAILY SHIFT MODAL */}
      {editingDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 w-full max-w-md shadow-2xl relative" dir="rtl">
            <button
              onClick={() => setEditingDate(null)}
              className="absolute top-4 left-4 text-[#9E9891] hover:text-[#1C1C1C] p-1.5 rounded-full hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-gold text-xs font-black uppercase mb-1">
              <Sparkles className="w-4 h-4 text-gold" />
              עריכת שיבוץ יומי מהיר
            </div>

            <h3 className="text-xl font-black text-[#1C1C1C]">
              {format(editingDate, 'EEEE, d בMMMM yyyy', { locale: he })}
            </h3>
            <p className="text-xs text-[#6B6560] mb-5">
              הגדר באיזה סניף תעבוד ובאילו שעות תוכל לקבל לקוחות ביום זה:
            </p>

            {/* 1. Branch Selector */}
            <div className="mb-5">
              <label className="block text-xs font-black text-[#1C1C1C] mb-2">
                באיזה סניף אתה ביום זה?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setShiftForm({ ...shiftForm, branchId: 'ariel', isOpen: true })}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    shiftForm.branchId === 'ariel' && shiftForm.isOpen
                      ? 'bg-gold text-[#1C1C1C] border-gold font-black shadow-sm ring-2 ring-gold/30'
                      : 'bg-[#FAF7F2] text-[#6B6560] border-[#E5DDD0] hover:border-gold'
                  }`}
                >
                  📍 סניף אריאל
                </button>

                <button
                  type="button"
                  onClick={() => setShiftForm({ ...shiftForm, branchId: 'rehovot', isOpen: true })}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    shiftForm.branchId === 'rehovot' && shiftForm.isOpen
                      ? 'bg-amber-900 text-white border-amber-900 font-black shadow-sm ring-2 ring-amber-900/30'
                      : 'bg-[#FAF7F2] text-[#6B6560] border-[#E5DDD0] hover:border-amber-900'
                  }`}
                >
                  📍 סניף רחובות
                </button>

                <button
                  type="button"
                  onClick={() => setShiftForm({ ...shiftForm, branchId: 'closed', isOpen: false, note: 'סגור' })}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    !shiftForm.isOpen || shiftForm.branchId === 'closed'
                      ? 'bg-zinc-800 text-white border-zinc-800 font-black shadow-sm'
                      : 'bg-[#FAF7F2] text-[#9E9891] border-[#E5DDD0] hover:bg-zinc-100'
                  }`}
                >
                  ⛔ סגור היום
                </button>
              </div>
            </div>

            {/* 2. Fast 1-Click Shift Presets */}
            {shiftForm.isOpen && shiftForm.branchId !== 'closed' && (
              <div className="mb-5">
                <label className="block text-xs font-black text-[#1C1C1C] mb-2 flex items-center justify-between">
                  <span>⚡ כפתורי קיצור לשעות עבודה:</span>
                  <span className="text-[10px] text-[#9E9891] font-normal">בלחיצה אחת</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShiftForm({ ...shiftForm, isOpen: true, startTime: '16:00', endTime: '19:00', note: '3 שעות ערב' })}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold transition-all text-right"
                  >
                    <span className="text-xs font-black text-[#1C1C1C]">⚡ 3 שעות ערב</span>
                    <span className="text-[10px] text-[#6B6560] font-mono mt-0.5">16:00 - 19:00</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShiftForm({ ...shiftForm, isOpen: true, startTime: '09:00', endTime: '13:00', note: 'בוקר בלבד' })}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold transition-all text-right"
                  >
                    <span className="text-xs font-black text-[#1C1C1C]">🌅 בוקר בלבד</span>
                    <span className="text-[10px] text-[#6B6560] font-mono mt-0.5">09:00 - 13:00</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShiftForm({ ...shiftForm, isOpen: true, startTime: '09:00', endTime: '20:00', note: 'יום מלא' })}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold transition-all text-right"
                  >
                    <span className="text-xs font-black text-[#1C1C1C]">☀️ יום מלא</span>
                    <span className="text-[10px] text-[#6B6560] font-mono mt-0.5">09:00 - 20:00</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShiftForm({ ...shiftForm, isOpen: true, startTime: '14:00', endTime: '21:00', note: 'אחה״צ וערב' })}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold transition-all text-right"
                  >
                    <span className="text-xs font-black text-[#1C1C1C]">🌙 אחה״צ וערב</span>
                    <span className="text-[10px] text-[#6B6560] font-mono mt-0.5">14:00 - 21:00</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. Custom Time Inputs */}
            {shiftForm.isOpen && shiftForm.branchId !== 'closed' && (
              <div className="mb-5 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]">
                <span className="block text-xs font-black text-[#1C1C1C] mb-2.5">
                  או התאם שעות ידנית:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#6B6560] mb-1 font-bold">שעת פתיחה</label>
                    <input
                      type="time"
                      value={shiftForm.startTime}
                      onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                      className="w-full bg-white border border-[#E5DDD0] focus:border-gold rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6B6560] mb-1 font-bold">שעת סגירה</label>
                    <input
                      type="time"
                      value={shiftForm.endTime}
                      onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                      className="w-full bg-white border border-[#E5DDD0] focus:border-gold rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] text-[#6B6560] mb-1 font-bold">הערה מיוחדת (מוצגת ללקוחות)</label>
                  <input
                    type="text"
                    placeholder="למשל: 3 שעות בלבד / חלון ערב"
                    value={shiftForm.note}
                    onChange={(e) => setShiftForm({ ...shiftForm, note: e.target.value })}
                    className="w-full bg-white border border-[#E5DDD0] focus:border-gold rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveShiftOverride}
                className="btn-shimmer flex-1 text-[#1C1C1C] font-black text-xs py-3 rounded-xl shadow-gold hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                שמור ועדכן תורים ללקוחות ✨
              </button>

              <button
                type="button"
                onClick={() => handleResetShiftOverride(editingDate)}
                className="px-3 py-3 rounded-xl border border-[#E5DDD0] text-[#6B6560] hover:text-red-600 hover:border-red-200 text-xs font-bold transition-all"
                title="איפוס לתבנית שבועית קבועה"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
