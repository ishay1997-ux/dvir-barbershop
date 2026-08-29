'use client';

import { useMemo, useState } from 'react';
import {
  format,
  addDays,
  startOfToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { he } from 'date-fns/locale';
import { cn, generateTimeSlots } from '@/lib/utils';
import { useShopStore, getEffectiveShiftForDate } from '@/lib/store';
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  Bell,
  Phone,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
} from 'lucide-react';
import type { Service, Barber, Branch } from '@/lib/types';

// Booked slots record
const MOCK_BOOKED: Record<string, string[]> = {};

const WEEKDAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

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

  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || today);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistPhone, setWaitlistPhone] = useState('');

  // 1. Calculate dynamic effective shift for selected date
  const currentShift = useMemo(() => {
    if (!selectedDate) return null;
    return getEffectiveShiftForDate(selectedDate, settings);
  }, [selectedDate, settings]);

  // 2. Generate & filter slots strictly within the date's active hours
  const timeSlots = useMemo(() => {
    if (!selectedDate || !currentShift || !currentShift.isOpen) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const booked = MOCK_BOOKED[dateKey] ?? [];

    const start = currentShift.startTime || '09:00';
    const end = currentShift.endTime || '20:00';
    const interval = service?.duration && service.duration >= 45 ? 45 : 30;

    // Generate slots within Dvir's exact hours for this specific day
    const all = generateTimeSlots(start, end, interval);

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
  }, [selectedDate, currentShift, service, settings.lunchBreak]);

  // Group slots into Morning / Afternoon / Evening
  const morningSlots = timeSlots.filter((s) => s.time < '12:00');
  const afternoonSlots = timeSlots.filter((s) => s.time >= '12:00' && s.time < '16:30');
  const eveningSlots = timeSlots.filter((s) => s.time >= '16:30');

  const availableCount = timeSlots.filter((s) => s.available).length;

  // 3. Custom Month Grid Calculation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Saturday

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const maxBookingDate = useMemo(
    () => addDays(today, settings.bookingWindowDays || 30),
    [today, settings.bookingWindowDays]
  );

  const canGoPrev = useMemo(
    () => !isSameMonth(currentMonth, today) && currentMonth > today,
    [currentMonth, today]
  );

  const canGoNext = useMemo(
    () => currentMonth < maxBookingDate,
    [currentMonth, maxBookingDate]
  );

  const handlePrevMonth = () => {
    if (canGoPrev) setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    if (canGoNext) setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleJumpToToday = () => {
    setCurrentMonth(today);
    onDateSelect(today);
  };

  // Check if a day is disabled
  const isDayDisabled = (day: Date) => {
    if (day < today || day > maxBookingDate) return true;
    const shift = getEffectiveShiftForDate(day, settings);
    if (!shift.isOpen || shift.branchId === 'closed') return true;
    if (branch && shift.branchId !== branch.id) return true;
    return false;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">בחר תאריך ושעה</h2>
        <p className="text-[#6B6560] text-sm mt-1 flex items-center gap-1.5 flex-wrap font-medium">
          {branch ? (
            <span className="text-[#1C1C1C] font-bold">📍 {branch.name}</span>
          ) : null}
          {service ? (
            <>
              <span className="text-zinc-400">·</span>
              <span className="text-[#1C1C1C] font-bold">{service.name}</span>
            </>
          ) : null}
          {barber ? (
            <>
              <span className="text-zinc-400">·</span>
              <span className="text-[#C9A84C] font-bold">✂️ {barber.name}</span>
            </>
          ) : null}
        </p>
      </div>

      {/* Luxury Custom Calendar Card */}
      <div className="w-full bg-white rounded-3xl border border-[#E5DDD0] p-5 sm:p-7 shadow-sm">
        {/* Calendar Header with Month/Year Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0EBE1]">
          {/* Month & Year Display */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#C9A84C]" />
            <h3 className="text-lg sm:text-xl font-black text-[#1C1C1C] capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: he })}
            </h3>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleJumpToToday}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[#E5DDD0] text-[#6B6560] hover:text-[#1C1C1C] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all cursor-pointer ml-1"
            >
              היום
            </button>

            {/* In RTL: Right arrow goes to Previous month */}
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              className="w-9 h-9 rounded-xl border border-[#E5DDD0] flex items-center justify-center text-[#1C1C1C] hover:bg-[#FAF7F2] hover:border-[#C9A84C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="חודש קודם"
              aria-label="חודש קודם"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* In RTL: Left arrow goes to Next month */}
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={!canGoNext}
              className="w-9 h-9 rounded-xl border border-[#E5DDD0] flex items-center justify-center text-[#1C1C1C] hover:bg-[#FAF7F2] hover:border-[#C9A84C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="חודש הבא"
              aria-label="חודש הבא"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekdays Header (7 Columns) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center mb-3">
          {WEEKDAYS.map((weekday, i) => (
            <div
              key={i}
              className="text-xs sm:text-sm font-black text-[#8C827A] py-1"
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* Days Grid (7 Columns) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isDayToday = isToday(day);
            const disabled = isDayDisabled(day);

            if (!isCurrentMonth) {
              return (
                <div
                  key={day.toISOString()}
                  className="aspect-square flex items-center justify-center rounded-2xl text-xs text-zinc-300 opacity-20 pointer-events-none select-none"
                >
                  {format(day, 'd')}
                </div>
              );
            }

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => onDateSelect(day)}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center rounded-2xl text-xs sm:text-sm font-bold transition-all relative select-none cursor-pointer',
                  isSelected
                    ? 'bg-[#C9A84C] text-[#1C1C1C] font-black shadow-lg shadow-[#C9A84C]/35 scale-105 border-2 border-[#1C1C1C] z-10'
                    : disabled
                    ? 'text-zinc-300 bg-transparent cursor-not-allowed opacity-35 line-through font-normal'
                    : 'bg-[#FAF7F2] text-[#1C1C1C] border border-[#E5DDD0] hover:border-[#C9A84C] hover:bg-[#C9A84C]/15 hover:scale-105 active:scale-95'
                )}
              >
                <span>{format(day, 'd')}</span>

                {/* Today Indicator Dot */}
                {isDayToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute bottom-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Area */}
      {selectedDate && currentShift && (
        <div className="bg-white rounded-3xl border border-[#E5DDD0] p-5 sm:p-7 shadow-sm animate-fadeIn">
          {/* Active Shift Indicator */}
          <div className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded-2xl px-4 py-3 mb-5 text-xs sm:text-sm font-bold text-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold flex-shrink-0" />
              <span>
                שעות קבלת קהל: <strong className="font-mono text-black">{currentShift.startTime} - {currentShift.endTime}</strong>
                {currentShift.note ? ` (${currentShift.note})` : ''}
              </span>
            </div>
            <span className="text-xs text-[#6B6560] hidden sm:inline font-bold">
              📍 {currentShift.branchId === 'ariel' ? 'סניף אריאל' : currentShift.branchId === 'rehovot' ? 'סניף רחובות' : ''}
            </span>
          </div>

          {/* Header & Live Capacity Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#F0EBE1]">
            <div>
              <span className="text-xs text-[#9E9891] block font-bold">תאריך נבחר:</span>
              <div className="text-base sm:text-lg font-black text-[#1C1C1C]">
                {format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}
              </div>
            </div>

            <div>
              {availableCount > 3 ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {availableCount} תורים פנויים ליום זה
                </span>
              ) : availableCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  נשארו {availableCount} תורים אחרונים!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
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
                    className="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C] cursor-pointer"
                  >
                    הודע לי כשיתפנה
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Morning */}
              {morningSlots.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6B6560] mb-3">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>שעות הבוקר (09:00 – 12:00)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                    {morningSlots.map(({ time, available }) => (
                      <button
                        key={time}
                        onClick={() => available && onTimeSelect(time)}
                        disabled={!available}
                        className={cn(
                          'py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-center active:scale-95 cursor-pointer',
                          selectedTime === time
                            ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40 scale-105'
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
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6B6560] mb-3">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>שעות הצהריים (12:00 – 16:30)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                    {afternoonSlots.map(({ time, available, isLunch }) => (
                      <button
                        key={time}
                        onClick={() => available && onTimeSelect(time)}
                        disabled={!available}
                        title={isLunch ? 'הפסקת צהריים' : undefined}
                        className={cn(
                          'py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-center active:scale-95 cursor-pointer',
                          selectedTime === time
                            ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40 scale-105'
                            : available
                            ? 'bg-[#FAF7F2] text-[#1C1C1C] border-[#E5DDD0] hover:border-gold hover:bg-gold/10'
                            : isLunch
                            ? 'bg-amber-50 text-amber-600/60 border-amber-200 cursor-not-allowed text-xs'
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
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6B6560] mb-3">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>שעות הערב (16:30 – 20:00)</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                    {eveningSlots.map(({ time, available }) => (
                      <button
                        key={time}
                        onClick={() => available && onTimeSelect(time)}
                        disabled={!available}
                        className={cn(
                          'py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-center active:scale-95 cursor-pointer',
                          selectedTime === time
                            ? 'bg-[#1C1C1C] text-gold border-gold shadow-md font-black ring-2 ring-gold/40 scale-105'
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
