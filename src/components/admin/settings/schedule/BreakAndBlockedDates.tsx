'use client';

import React, { useState } from 'react';
import { Coffee, Trash2 } from 'lucide-react';
import type { ShopSettings, BlockedDate } from '@/lib/types';

interface BreakAndBlockedDatesProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export const BreakAndBlockedDates: React.FC<BreakAndBlockedDatesProps> = ({
  settings,
  onUpdateSettings,
  onNotifySave,
}) => {
  const [newBlock, setNewBlock] = useState<{ date: string; reason: string }>({
    date: '',
    reason: '',
  });

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
    <>
      {/* Section 3: Lunch Break Auto-Block */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-5 h-5 text-gold" />
            <div>
              <h2 className="font-black text-base text-[#1C1C1C]">הפסקת צהריים יומית קבועה</h2>
              <p className="text-xs text-[#6B6560]">
                חסימה אוטומטית של תורים באמצע היום למנוחה או אוכל
              </p>
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
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
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
            <span className="text-[#9E9891] text-[11px]">
              (שעות אלו ייחסמו אוטומטית לקביעת תור)
            </span>
          </div>
        )}
      </div>

      {/* Section 4: Blocked Dates */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <h2 className="font-black text-base text-[#1C1C1C] mb-1">
          חסימת ימי מילואים או חופשות ספציפיות
        </h2>
        <p className="text-xs text-[#6B6560] mb-4">
          תאריך שנחסם כאן ייסגר להזמנות אוטומטית לכל הלקוחות
        </p>

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
                  type="button"
                  onClick={() => handleRemoveBlockedDate(block.id)}
                  className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
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
            type="button"
            onClick={handleAddBlockedDate}
            className="btn-shimmer px-5 py-2.5 rounded-xl text-xs font-bold text-[#1C1C1C] hover:scale-105 active:scale-95 transition-transform whitespace-nowrap shadow-sm cursor-pointer"
          >
            הוסף חסימה
          </button>
        </div>
      </div>
    </>
  );
};
