'use client';

import React, { useMemo, useState } from 'react';
import {
  format,
  addDays,
  startOfToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import { generateTimeSlots } from '@/lib/utils';
import { useShopStore, getEffectiveShiftForDate } from '@/lib/store';
import type { Service, Barber, Branch } from '@/lib/types';
import { BookingCalendar } from './BookingCalendar';
import { TimeSlotGrid } from './TimeSlotGrid';
import { BookingWaitlistModal, WaitlistRange } from './BookingWaitlistModal';

// Booked slots record
const MOCK_BOOKED: Record<string, string[]> = {};

interface DateTimeStepProps {
  branch?: Branch | null;
  service: Service | null;
  barber: Barber | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

export default function DateTimeStep({
  branch,
  service,
  barber,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: DateTimeStepProps) {
  const today = startOfToday();
  const { settings, addToWaitlist } = useShopStore();

  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || today);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [waitlistRange, setWaitlistRange] = useState<WaitlistRange>('any');

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistName.trim() || waitlistPhone.trim().length < 9 || !selectedDate) return;

    addToWaitlist({
      customerName: waitlistName.trim(),
      customerPhone: waitlistPhone.trim(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      preferredTimeRange: waitlistRange,
      serviceId: service?.id,
      serviceName: service?.name || 'תספורת גברים',
      branchId: branch?.id || 'ariel',
      branchName: branch?.name || 'סניף אריאל',
      notes: `הצטרף לרשימת המתנה דרך אשף ההזמנות (${waitlistRange})`,
    });

    setWaitlistSuccess(true);
    setTimeout(() => {
      setWaitlistSuccess(false);
      setShowWaitlistModal(false);
      setWaitlistName('');
      setWaitlistPhone('');
    }, 2800);
  };

  const handleQuickWaitlistSubmit = () => {
    if (!waitlistPhone.trim() || waitlistPhone.trim().length < 9 || !selectedDate) return;

    addToWaitlist({
      customerName: 'לקוח מהיר',
      customerPhone: waitlistPhone.trim(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      preferredTimeRange: 'any',
      serviceId: service?.id,
      serviceName: service?.name || 'תספורת גברים',
      branchId: branch?.id || 'ariel',
      branchName: branch?.name || 'סניף אריאל',
      notes: 'הצטרף לרשימת המתנה (חסימת תורים מלאה)',
    });

    setWaitlistSuccess(true);
  };

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
  const morningSlots = useMemo(() => timeSlots.filter((s) => s.time < '12:00'), [timeSlots]);
  const afternoonSlots = useMemo(
    () => timeSlots.filter((s) => s.time >= '12:00' && s.time < '16:30'),
    [timeSlots]
  );
  const eveningSlots = useMemo(() => timeSlots.filter((s) => s.time >= '16:30'), [timeSlots]);

  const availableCount = useMemo(() => timeSlots.filter((s) => s.available).length, [timeSlots]);

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
        <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
          בחר תאריך ושעה
        </h2>
        <p className="text-[#6B6560] text-sm mt-1 flex items-center gap-1.5 flex-wrap font-medium">
          {branch ? <span className="text-[#1C1C1C] font-bold">📍 {branch.name}</span> : null}
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
      <BookingCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        calendarDays={calendarDays}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onJumpToToday={handleJumpToToday}
        onDateSelect={onDateSelect}
        isDayDisabled={isDayDisabled}
      />

      {/* Time Slots Area */}
      {selectedDate && currentShift && (
        <TimeSlotGrid
          selectedDate={selectedDate}
          currentShift={currentShift}
          selectedTime={selectedTime}
          timeSlots={timeSlots}
          morningSlots={morningSlots}
          afternoonSlots={afternoonSlots}
          eveningSlots={eveningSlots}
          availableCount={availableCount}
          onTimeSelect={onTimeSelect}
          onOpenWaitlistModal={() => setShowWaitlistModal(true)}
          waitlistPhone={waitlistPhone}
          onWaitlistPhoneChange={setWaitlistPhone}
          waitlistSuccess={waitlistSuccess}
          onQuickWaitlistSubmit={handleQuickWaitlistSubmit}
        />
      )}

      {/* Waitlist Modal */}
      <BookingWaitlistModal
        isOpen={showWaitlistModal}
        selectedDate={selectedDate}
        waitlistName={waitlistName}
        waitlistPhone={waitlistPhone}
        waitlistRange={waitlistRange}
        waitlistSuccess={waitlistSuccess}
        onClose={() => setShowWaitlistModal(false)}
        onNameChange={setWaitlistName}
        onPhoneChange={setWaitlistPhone}
        onRangeChange={setWaitlistRange}
        onSubmit={handleJoinWaitlist}
      />
    </div>
  );
}
