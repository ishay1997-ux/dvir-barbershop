import { isToday as isDateToday, parseISO } from 'date-fns';

export interface WorkingHoursRange {
  open: string;  // "09:00"
  close: string; // "20:00"
  closed?: boolean;
}

export interface BreakRange {
  start: string; // "13:00"
  end: string;   // "14:00"
  isActive: boolean;
}

export interface DailyOverrideConfig {
  isOpen: boolean;
  startTime?: string;
  endTime?: string;
}

export interface SlotEngineConfig {
  date: Date | string;
  workingHours?: WorkingHoursRange;
  lunchBreak?: BreakRange;
  serviceDurationMinutes?: number; // e.g. 30, 45, 60
  bufferMinutes?: number;          // e.g. 5, 10
  bookedTimes?: string[];          // e.g. ['10:00', '14:30']
  dailyOverride?: DailyOverrideConfig;
  stepMinutes?: number;            // grid step, defaults to 30 or duration
  filterPastIfToday?: boolean;     // defaults to true
}

export interface TimeWindowOption {
  id: string;
  label: string;
  range: string;
  available: boolean;
}

export type TimeWindowSlot = TimeWindowOption;

/**
 * Converts "HH:mm" to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts minutes from midnight to "HH:mm"
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Pure slot calculation engine inspired by Cal.com
 * Calculates all valid, unconflicted booking slots for a given date
 */
export function getAvailableSlots(config: SlotEngineConfig): string[] {
  const targetDate = typeof config.date === 'string' ? parseISO(config.date) : config.date;
  
  // 1. Check daily override or closed day
  if (config.dailyOverride && !config.dailyOverride.isOpen) {
    return [];
  }

  const workingHours = config.workingHours || { open: '09:00', close: '20:00', closed: false };
  if (workingHours.closed) {
    return [];
  }

  // 2. Determine start and end times in minutes
  const openTimeStr = config.dailyOverride?.startTime || workingHours.open || '09:00';
  const closeTimeStr = config.dailyOverride?.endTime || workingHours.close || '20:00';

  const openMinutes = timeToMinutes(openTimeStr);
  const closeMinutes = timeToMinutes(closeTimeStr);

  if (openMinutes >= closeMinutes) {
    return [];
  }

  const duration = config.serviceDurationMinutes || 30;
  const buffer = config.bufferMinutes || 0;
  const step = config.stepMinutes || 30; // standard 30-min booking intervals

  // 3. Calculate lunch break range if active
  let breakStart = -1;
  let breakEnd = -1;
  if (config.lunchBreak && config.lunchBreak.isActive && config.lunchBreak.start && config.lunchBreak.end) {
    breakStart = timeToMinutes(config.lunchBreak.start);
    breakEnd = timeToMinutes(config.lunchBreak.end);
  }

  // 4. Check if date is today and calculate current minutes
  const isToday = isDateToday(targetDate);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const bookedSet = new Set(config.bookedTimes || []);
  const availableSlots: string[] = [];

  // 5. Generate slots iteratively
  for (let m = openMinutes; m + duration <= closeMinutes; m += step) {
    const slotEndTime = m + duration;
    const slotTimeStr = minutesToTime(m);

    // A. Filter past slots if today (with a 5-minute grace period)
    if (config.filterPastIfToday !== false && isToday && m <= currentMinutes + 5) {
      continue;
    }

    // B. Filter lunch break overlap
    if (breakStart !== -1 && breakEnd !== -1) {
      // If slot starts during break, or overlaps into break
      if ((m >= breakStart && m < breakEnd) || (slotEndTime > breakStart && m < breakEnd)) {
        continue;
      }
    }

    // C. Filter already booked slots
    if (bookedSet.has(slotTimeStr)) {
      continue;
    }

    availableSlots.push(slotTimeStr);
  }

  return availableSlots;
}

/**
 * Generates arrival time windows for home services, technicians, and plumbers
 */
export function getAvailableTimeWindows(config: SlotEngineConfig): TimeWindowOption[] {
  const allSlots = getAvailableSlots(config);
  const hasSlots = allSlots.length > 0;

  return [
    {
      id: 'morning',
      label: 'חלון בוקר',
      range: '08:30 – 12:00',
      available: hasSlots && allSlots.some(s => timeToMinutes(s) < 12 * 60),
    },
    {
      id: 'afternoon',
      label: 'חלון צהריים',
      range: '12:00 – 16:00',
      available: hasSlots && allSlots.some(s => timeToMinutes(s) >= 12 * 60 && timeToMinutes(s) < 16 * 60),
    },
    {
      id: 'evening',
      label: 'חלון ערב',
      range: '16:00 – 19:30',
      available: hasSlots && allSlots.some(s => timeToMinutes(s) >= 16 * 60),
    },
  ];
}
