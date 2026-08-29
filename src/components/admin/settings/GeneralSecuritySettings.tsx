'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Clock,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { ShopSettings } from '@/lib/types';

interface GeneralSecuritySettingsProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export default function GeneralSecuritySettings({
  settings,
  onUpdateSettings,
  onNotifySave,
}: GeneralSecuritySettingsProps) {
  const { success, showConfirm } = useToast();
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordChangedNotice, setPasswordChangedNotice] = useState(false);

  const handleUpdateField = (key: keyof ShopSettings, val: any) => {
    const updated = { ...settings, [key]: val };
    onUpdateSettings(updated);
    onNotifySave();
  };

  const handleUpdatePassword = () => {
    if (!adminPasswordInput.trim()) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dvir_admin_password', adminPasswordInput.trim());
      setPasswordChangedNotice(true);
      setAdminPasswordInput('');
      setTimeout(() => setPasswordChangedNotice(false), 3500);
      success('הסיסמה עודכנה בהצלחה', 'סיסמת המנהל החדשה נשמרה');
    }
  };

  const handleResetDemoData = () => {
    showConfirm({
      title: 'איפוס נתוני בדיקה',
      message: 'פעולה זו תנקה את כל התורים והלקוחות לדוגמה ותאפשר התחלת עבודה עם יומן נקי ב-100%. האם להמשיך?',
      confirmText: 'כן, אפס נתונים',
      cancelText: 'ביטול',
      type: 'danger',
      onConfirm: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('thecut_customers');
          localStorage.removeItem('thecut_appointments');
          window.location.reload();
        }
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Booking Rules & Policies */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">חוקי הזמנת תורים ומדיניות ביטולים (Booking Rules)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הגדרת זמני מנוחה בין לקוחות, מועד ביטול אפשרי וחלון זימון עתידי
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Booking Window Days */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD0]">
            <label className="block text-xs font-black text-[#1C1C1C] mb-1">
              📅 חלון הזמנה מראש (ימים)
            </label>
            <p className="text-[11px] text-[#6B6560] mb-2">
              כמה ימים קדימה פתוח היומן להזמנות לקוחות
            </p>
            <select
              value={settings.bookingWindowDays || 21}
              onChange={(e) => handleUpdateField('bookingWindowDays', Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-bold outline-none focus:border-gold"
            >
              <option value={7}>שבוע אחד קדימה (7 ימים)</option>
              <option value={14}>שבועיים קדימה (14 ימים)</option>
              <option value={21}>3 שבועות קדימה (21 ימים) - מומלץ</option>
              <option value={30}>חודש מלא קדימה (30 ימים)</option>
            </select>
          </div>

          {/* Buffer Minutes */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD0]">
            <label className="block text-xs font-black text-[#1C1C1C] mb-1">
              ⏱️ זמן מנוחה/חיץ בין תורים
            </label>
            <p className="text-[11px] text-[#6B6560] mb-2">
              דקות לניקוי, סטריליזציה והתארגנות בין לקוח ללקוח
            </p>
            <select
              value={settings.bufferMinutesBetweenAppointments ?? 5}
              onChange={(e) =>
                handleUpdateField('bufferMinutesBetweenAppointments', Number(e.target.value))
              }
              className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-bold outline-none focus:border-gold"
            >
              <option value={0}>ללא מרווח (0 דקות)</option>
              <option value={5}>5 דקות מרווח (מומלץ)</option>
              <option value={10}>10 דקות מרווח</option>
              <option value={15}>15 דקות מרווח</option>
            </select>
          </div>

          {/* Cancellation Notice Hours */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD0]">
            <label className="block text-xs font-black text-[#1C1C1C] mb-1">
              🚫 זמן התראה מינימלי לביטול
            </label>
            <p className="text-[11px] text-[#6B6560] mb-2">
              כמה שעות מראש הלקוח יכול לבטל תור באתר
            </p>
            <select
              value={settings.cancellationNoticeHours || 2}
              onChange={(e) =>
                handleUpdateField('cancellationNoticeHours', Number(e.target.value))
              }
              className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-bold outline-none focus:border-gold"
            >
              <option value={1}>שעה אחת לפני התור</option>
              <option value={2}>שעתיים לפני התור (מומלץ)</option>
              <option value={4}>4 שעות לפני התור</option>
              <option value={12}>12 שעות לפני התור</option>
              <option value={24}>24 שעות לפני התור</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Admin Password Change */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold" />
            <div>
              <h2 className="text-base font-black text-[#1C1C1C]">אבטחה ושינוי סיסמת מנהל (Admin Password)</h2>
              <p className="text-xs text-[#6B6560]">קבע סיסמה אישית חדשה לכניסה לפורטל הניהול של המספרה</p>
            </div>
          </div>
          {passwordChangedNotice && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              הסיסמה עודכנה בהצלחה!
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md pt-1">
          <input
            type="text"
            value={adminPasswordInput}
            onChange={(e) => setAdminPasswordInput(e.target.value)}
            placeholder="הקלד סיסמה חדשה (למשל: dvir2025)"
            className="flex-1 w-full px-3.5 py-2.5 border rounded-xl text-xs outline-none focus:border-gold bg-[#FAF7F2] font-mono"
            dir="ltr"
          />
          <button
            type="button"
            onClick={handleUpdatePassword}
            className="px-5 py-2.5 bg-[#1C1C1C] hover:bg-[#2A2A2A] text-gold rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 shadow-xs w-full sm:w-auto"
          >
            עדכן סיסמה
          </button>
        </div>
      </div>

      {/* 3. Demo Data Reset */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-sm text-[#1C1C1C]">איפוס והתחלה נקייה לייצור (Clean Slate Reset)</h3>
            <p className="text-xs text-[#6B6560] mt-0.5">
              רוצה לנקות לקוחות ותורים לדוגמה ולהתחיל לעבוד ב-100% עם יומן נקי לדביר?
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetDemoData}
          className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          אפס נתוני בדיקה
        </button>
      </div>
    </div>
  );
}
