'use client';

import React, { useState } from 'react';
import { startOfToday } from 'date-fns';
import { getEffectiveShiftForDate } from '@/lib/store';
import type { Branch, ShopSettings, DailyShiftOverride } from '@/lib/types';
import { DynamicShiftTimeline } from './schedule/DynamicShiftTimeline';
import { WeeklyTemplateEditor } from './schedule/WeeklyTemplateEditor';
import { BreakAndBlockedDates } from './schedule/BreakAndBlockedDates';
import { DailyShiftEditModal } from './schedule/DailyShiftEditModal';

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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section 1: Upcoming Dynamic Timeline */}
      <DynamicShiftTimeline
        settings={settings}
        today={today}
        scheduleDaysView={scheduleDaysView}
        onSetScheduleDaysView={setScheduleDaysView}
        onOpenShiftEditor={openShiftEditor}
        onResetShiftOverride={handleResetShiftOverride}
      />

      {/* Section 2: Recurring Weekly Default Template */}
      <WeeklyTemplateEditor
        settings={settings}
        branches={branches}
        onScheduleChange={handleScheduleChange}
      />

      {/* Section 3 & 4: Lunch Break & Blocked Dates */}
      <BreakAndBlockedDates
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onNotifySave={onNotifySave}
      />

      {/* QUICK DAILY SHIFT MODAL */}
      <DailyShiftEditModal
        editingDate={editingDate}
        shiftForm={shiftForm}
        onClose={() => setEditingDate(null)}
        onChangeShiftForm={setShiftForm}
        onSaveShiftOverride={handleSaveShiftOverride}
        onResetShiftOverride={handleResetShiftOverride}
      />
    </div>
  );
}
