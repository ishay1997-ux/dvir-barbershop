'use client';

import { useState, useEffect } from 'react';
import { SHOP_INFO } from '@/lib/utils';
import { Clock } from 'lucide-react';

export interface WorkingHourItem {
  day: string;
  open: string;
  close: string;
  closed: boolean;
  branch?: string;
}

export default function OpenStatusBadge({
  className = '',
  showIcon = true,
  workingHours,
}: {
  className?: string;
  showIcon?: boolean;
  workingHours?: readonly WorkingHourItem[] | WorkingHourItem[];
}) {
  const [status, setStatus] = useState<{
    isOpen: boolean;
    isClosingSoon: boolean;
    text: string;
  }>({
    isOpen: false,
    isClosingSoon: false,
    text: 'בודק שעות פעילות...',
  });

  useEffect(() => {
    const calculateStatus = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const scheduleSource = workingHours || SHOP_INFO.workingHours;
      const daySchedule = scheduleSource[currentDay];

      if (!daySchedule || daySchedule.closed || !daySchedule.open || !daySchedule.close) {
        // Find next open day
        let nextOpenText = 'נפתח מחר ב-09:00';
        if (currentDay === 6) nextOpenText = 'נפתח ביום ראשון ב-09:00';
        setStatus({
          isOpen: false,
          isClosingSoon: false,
          text: `סגור כרגע · ${nextOpenText}`,
        });
        return;
      }

      const [openH, openM] = daySchedule.open.split(':').map(Number);
      const [closeH, closeM] = daySchedule.close.split(':').map(Number);

      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        const minutesUntilClose = closeMinutes - currentMinutes;
        if (minutesUntilClose <= 45) {
          setStatus({
            isOpen: true,
            isClosingSoon: true,
            text: `נסגר בקרוב · ב-${daySchedule.close}`,
          });
        } else {
          setStatus({
            isOpen: true,
            isClosingSoon: false,
            text: `פתוח עכשיו · עד ${daySchedule.close}`,
          });
        }
      } else if (currentMinutes < openMinutes) {
        setStatus({
          isOpen: false,
          isClosingSoon: false,
          text: `סגור כרגע · נפתח היום ב-${daySchedule.open}`,
        });
      } else {
        // Closed for today, find next open day
        let foundNext = false;
        for (let i = 1; i <= 7; i++) {
          const nextDayIdx = (currentDay + i) % 7;
          const nextDay = scheduleSource[nextDayIdx];
          if (nextDay && !nextDay.closed && nextDay.open) {
            const dayName = i === 1 ? 'מחר' : `ביום ${nextDay.day}`;
            setStatus({
              isOpen: false,
              isClosingSoon: false,
              text: `סגור כרגע · נפתח ${dayName} ב-${nextDay.open}`,
            });
            foundNext = true;
            break;
          }
        }
        if (!foundNext) {
          setStatus({
            isOpen: false,
            isClosingSoon: false,
            text: 'סגור כרגע',
          });
        }
      }
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 60000);
    return () => clearInterval(interval);
  }, [workingHours]);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
        status.isOpen
          ? status.isClosingSoon
            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
            : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
          : 'bg-red-500/10 text-red-500 border border-red-500/30'
      } ${className}`}
    >
      {showIcon && (
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            status.isOpen
              ? status.isClosingSoon
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-500 animate-pulse'
              : 'bg-red-500'
          }`}
        />
      )}
      <span>{status.text}</span>
    </div>
  );
}
