'use client';

import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { he } from 'date-fns/locale';
import { format, addDays, startOfToday } from 'date-fns';
import { cn, generateTimeSlots } from '@/lib/utils';
import { useShopStore } from '@/lib/store';
import { Clock, Sun, Sunset, Moon, Bell, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Service, Barber, Branch } from '@/lib/types';
import 'react-day-picker/dist/style.css';

// Simulated booked slots (in production, synced with Firestore database)
const MOCK_BOOKED: Record<string, string[]> = {
  [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: ['10:00', '11:00', '14:30', '17:00'],
  [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
};

export default function DateTimeStep({
  branch,
  service,
  barber,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: {
  branch?: Branch | null;
  service: Service | null;
  barber: Barber | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}) {
  const today = startOfToday();
  const { settings } = useShopStore();

  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistPhone, setWaitlistPhone] = useState('');

  // 1. Generate & filter slots with lunch break protection
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const booked = MOCK_BOOKED[dateKey] ?? [];

    // Base slots 09:00 to 20:00
    const all = generateTimeSlots('09:00', '20:00', service?.duration && service.duration >= 45 ? 45 : 30);

    return all.map((time) => {
      // Check lunch break
      const isLunch =
        settings.lunchBreak?.isActive &&
        time >= (settings.lunchBreak?.start || '14:00') &&
        time < (settings.lunchBreak?.end || '14:30');

      return {
        time,
        available: !booked.includes(time) && !isLunch,
        isLunch,
      };
    });
  }, [selectedDate, service, settings.lunchBreak]);

  // Group slots into Morning / Afternoon / Evening
  const morningSlots = timeSlots.filter((s) => s.time < '12:00');
  const afternoonSlots = timeSlots.filter((s) => s.time >= '12:00' && s.time < '16:30');
  const eveningSlots = timeSlots.filter((s) => s.time >= '16:30');

  const availableCount = timeSlots.filter((s) => s.available).length;

  const disabledDays = [
    { before: today, after: addDays(today, settings.bookingWindowDays || 30) },
    (date: Date) => {
      if (date.getDay() === 6) return true; // Saturday closed
      if (branch && branch.activeDays && branch.activeDays.length > 0) {
        return !branch.activeDays.includes(date.getDay());
      }
      return false;
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1C1C1C]">בחר תאריך ושעה</h2>
        <p className="text-[#6B6560] text-sm mt-1">
          {branch ? `📍 ${branch.name}` : ''} {service ? `· ${service.name}` : ''}
        </p>
      </div>

      {/* Calendar */}
      <div className="flex justify-center mb-6">
        <div
          className="w-full bg-white rounded-3xl border border-[#E5DDD0] p-4 sm:p-6 shadow-sm"
          dir="rtl"
        >
          <style>{`
            .rdp { margin: 0; width: 100%; }
            .rdp-months { width: 100%; }
            .rdp-month { width: 100%; }
            .rdp-table { width: 100%; }
            .rdp-day_selected:not(.rdp-day_disabled) { background-color: #C9A84C !important; color: #1C1C1C !important; font-weight: 800; border-radius: 12px; }
            .rdp-day_today:not(.rdp-day_selected) { color: #C9A84C; font-weight: 800; }
            .rdp-button:hover:not(.rdp-day_disabled):not(.rdp-day_selected) { background-color: rgba(201,168,76,0.15) !important; border-radius: 12px; }
            .rdp-head_cell { color: #6B6560; font-size: 0.8rem; font-weight: 700; }
            .rdp-caption_label { font-family: var(--font-sans); font-weight: 800; font-size: 1rem; color: #1C1C1C; }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={(day) => day && onDateSelect(day)}
            locale={he}
            disabled={disabledDays}
            startMonth={today}
            endMonth={addDays(today, settings.bookingWindowDays || 30)}
          />
        </div>
      </div>

      {/* Time Slots Area */}
      {selectedDate && (
        <div className="bg-white rounded-3xl border border-[#E5DDD0] p-5 sm:p-6 shadow-sm animate-fadeIn">
          {/* Header & Live Capacity Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#F0EBE1]">
            <div>
              <span className="text-xs text-[#9E9891] block">תאריך נבחר:</span>
              <div className="text-base font-black text-[#1C1C1C]">
                {format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}
              </div>
            </div>

            <div>
              {availableCount > 3 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {availableCount} תורים פנויים ליום זה
                </span>
              ) : availableCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  נשארו {availableCount} תורים אחרונים!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                  היום מלא (אין תורים פנויים)
                </span>
              )}
            </div>
          </div>

          {/* If all slots booked -> Show Waitlist */}
          {availableCount === 0 ? (
            <div className="text-center py-6 bg-[#FAF7F2] rounded-2xl p-6 border border-[#E5DDD0]">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-3 text-gold">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-[#1C1C1C] mb-1">
                כל התורים ליום זה נתפסו!
              </h3>
              <p className="text-xs text-[#6B6560] max-w-sm mx-auto mb-4">
                רוצה לקבל עדכון ראשון אם לקוח אחר יבטל את התור שלו ליום זה? הירשם לרשימת המתנה:
              </p>

              {waitlistSuccess ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-xl max-w-xs mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                  נרשמת בהצלחה לרשימת ההמתנה!
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                  <input
                    type="tel"
                    placeholder="הכנס מספר נייד שלך"
                    value={waitlistPhone}
                    onChange={(e) => setWaitlistPhone(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                    dir="ltr"
                  />
                  <button
                    onClick={() => waitlistPhone && setWaitlistSuccess(true)}
                    className="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C]"
                  >
                    הודע לי כשיתפנה
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* 1. Morning */}
              {morningSlots.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B6560] mb-2.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>שעות הבוקר (09:00 – 12:00)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {morningSlots.map(({ time, available }) => (
                      <button
                        key={time}
                        onClick={() => available && onTimeSelect(time)}
                        disabled={!available}
                        className={cn(
                          'py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center active:scale-95',
                          selectedTime === time
                            ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40'
                            : available
                            ? 'bg-[#FAF7F2] text-[#1C1C1C] border-[#E5DDD0] hover:border-gold hover:bg-gold/10'
                            : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through opacity-50'
                        )}
                        dir="ltr"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Afternoon */}
              {afternoonSlots.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B6560] mb-2.5">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span>שעות הצהריים (12:00 – 16:30)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {afternoonSlots.map(({ time, available, isLunch }) => (
                      <button
                        key={time}
                        onClick={() => available && onTimeSelect(time)}
                        disabled={!available}
                        title={isLunch ? 'הפסקת צהריים' : undefined}
                        className={cn(
                          'py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center active:scale-95',
                          selectedTime === time
                            ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40'
                            : available
                            ? 'bg-[#FAF7F2] text-[#1C1C1C] border-[#E5DDD0] hover:border-gold hover:bg-gold/10'
                            : isLunch
                            ? 'bg-amber-50 text-amber-600/60 border-amber-200 cursor-not-allowed text-[10px]'
                            : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through opacity-50'
                        )}
                        dir="ltr"
                      >
                        {isLunch ? 'הפסקה ☕' : time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Evening */}
              {eveningSlots.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B6560] mb-2.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>שעות הערב (16:30 – 20:00)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {eveningSlots.map(({ time, available }) => (
                      <button
                        key={time}
                        onClick={() => available && onTimeSelect(time)}
                        disabled={!available}
                        className={cn(
                          'py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center active:scale-95',
                          selectedTime === time
                            ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40'
                            : available
                            ? 'bg-[#FAF7F2] text-[#1C1C1C] border-[#E5DDD0] hover:border-gold hover:bg-gold/10'
                            : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through opacity-50'
                        )}
                        dir="ltr"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
