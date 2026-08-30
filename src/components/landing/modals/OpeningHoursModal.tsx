'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Scissors } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import type { BusinessConfig } from '@/types/business';
import Link from 'next/link';

export function OpeningHoursModal({
  isOpen,
  onClose,
  business,
}: {
  isOpen: boolean;
  onClose: () => void;
  business?: Partial<BusinessConfig>;
}) {
  const currentDayIdx = new Date().getDay();
  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';
  const slug = business?.slug || 'dvir';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#222222] border rounded-3xl p-6 shadow-2xl z-10"
        style={{ borderColor: `${themeColor}40`, backgroundColor: '#1E1E1E', color: '#FFFFFF' }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`,
                color: themeColor,
              }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white" style={{ color: '#FFFFFF' }}>
                שעות פתיחה ופעילות
              </h3>
              <p className="text-xs text-zinc-400">
                {bizName} · {business?.city || 'ישראל'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule List */}
        <div className="space-y-2 mb-6">
          {(business?.workingHours || (SHOP_INFO.workingHours as unknown as Array<{ day: string; open: string; close: string; closed: boolean; branch?: string }>)).map((schedule, idx: number) => {
            const isToday = currentDayIdx === idx;
            return (
              <div
                key={schedule.day}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isToday
                    ? 'border-white/40 shadow-md text-white'
                    : 'bg-white/5 border-white/5 text-zinc-200'
                }`}
                style={{
                  backgroundColor: isToday ? `${themeColor}20` : undefined,
                  borderColor: isToday ? themeColor : undefined,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: isToday ? '#FFFFFF' : '#E2E8F0' }}>
                    {schedule.day}
                  </span>
                  {isToday && (
                    <span
                      className="text-[#1C1C1C] text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    >
                      היום
                    </span>
                  )}
                  {schedule.branch && !business?.branches?.length && (
                    <span className="text-xs text-zinc-400 mr-1">({schedule.branch})</span>
                  )}
                </div>

                <div className="text-sm font-bold">
                  {schedule.closed ? (
                    <span className="text-red-400">סגור</span>
                  ) : (
                    <span className="font-mono text-zinc-100" dir="ltr">
                      {schedule.open} - {schedule.close}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <Link
          href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl text-[#1C1C1C] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
          style={{ backgroundColor: themeColor }}
        >
          <Scissors className="w-4 h-4" /> לקביעת תור עכשיו
        </Link>
      </motion.div>
    </div>
  );
}
