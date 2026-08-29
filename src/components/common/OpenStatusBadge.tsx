'use client';

import { useState, useEffect } from 'react';
import { SHOP_INFO } from '@/lib/utils';
import { Clock } from 'lucide-react';

export default function OpenStatusBadge({
  className = '',
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
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

      const daySchedule = SHOP_INFO.workingHours[currentDay];

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
        // Closed for today
        const nextDayIdx = (currentDay + 1) % 7;
        const nextDay = SHOP_INFO.workingHours[nextDayIdx];
        const nextOpenTime = nextDay && !nextDay.closed ? nextDay.open : '09:00';
        const nextDayName = nextDayIdx === 6 ? 'ראשון' : 'מחר';
        setStatus({
          isOpen: false,
          isClosingSoon: false,
          text: `סגור כרגע · נפתח ${nextDayName} ב-${nextOpenTime}`,
        });
      }
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 60000); // Re-check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
        status.isOpen
          ? status.isClosingSoon
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-zinc-800/60 border-zinc-700 text-zinc-300'
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Pulsating live dot */}
      <span className="relative flex h-2 w-2">
        {status.isOpen && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              status.isClosingSoon ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            status.isOpen
              ? status.isClosingSoon
                ? 'bg-amber-500'
                : 'bg-emerald-500'
              : 'bg-zinc-400'
          }`}
        />
      </span>

      {showIcon && <Clock className="w-3.5 h-3.5 opacity-80" />}
      <span>{status.text}</span>
    </div>
  );
}
