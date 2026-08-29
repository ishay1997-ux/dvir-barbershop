import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, addMinutes } from 'date-fns';
import { he } from 'date-fns/locale';
import { INITIAL_BRANCHES, INITIAL_SERVICES, INITIAL_BARBERS } from './store';
import type { Branch, Service, Barber } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₪${price}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} דק'`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}:${m.toString().padStart(2, '0')} שעות` : `${h} שעה`;
}

export function formatDateHebrew(date: Date): string {
  return format(date, 'EEEE, d בMMMM yyyy', { locale: he });
}

export function formatTime(time: string): string {
  return time;
}

export function addDuration(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const date = new Date(2000, 0, 1, h, m);
  const end = addMinutes(date, minutes);
  return format(end, 'HH:mm');
}

export function generateTimeSlots(
  open: string,
  close: string,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  if (!open || !close) return slots;
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  
  let current = new Date(2000, 0, 1, oh, om);
  const end = new Date(2000, 0, 1, ch, cm);
  
  while (current < end) {
    slots.push(format(current, 'HH:mm'));
    current = addMinutes(current, intervalMinutes);
  }
  
  return slots;
}

export const SHOP_INFO = {
  name: 'המספרה של דביר',
  nameEnglish: 'Dvir Barbershop',
  tagline: 'אמנות התספורת והזקן – אריאל & רחובות',
  phone: '058-781-5071',
  branches: INITIAL_BRANCHES,
  instagram: 'https://instagram.com/dvir_barber',
  facebook: 'https://facebook.com/dvirbarber',
  workingHours: [
    { day: 'ראשון', open: '09:00', close: '20:00', closed: false, branch: 'אריאל' },
    { day: 'שני', open: '09:00', close: '20:00', closed: false, branch: 'אריאל' },
    { day: 'שלישי', open: '09:00', close: '20:00', closed: false, branch: 'אריאל' },
    { day: 'רביעי', open: '09:00', close: '20:00', closed: false, branch: 'רחובות' },
    { day: 'חמישי', open: '09:00', close: '21:00', closed: false, branch: 'רחובות' },
    { day: 'שישי', open: '08:00', close: '14:00', closed: false, branch: 'רחובות' },
    { day: 'שבת', open: '', close: '', closed: true, branch: '' },
  ],
} as const;

export const MOCK_SERVICES = INITIAL_SERVICES;
export const MOCK_BARBERS = INITIAL_BARBERS;
export const MOCK_BRANCHES = INITIAL_BRANCHES;

export const MOCK_REVIEWS = [
  { id: '1', author: 'איתי ברקוביץ', rating: 5, text: 'דביר ספר מטורף! הסקין פייד הכי מדויק שעשו לי באריאל. שירות ויחס ברמה הכי גבוהה שיש.', date: '2025-01-15' },
  { id: '2', author: 'עומר אלוני', rating: 5, text: 'מסתפר אצל דביר קבוע ברחובות. אווירה נעימה, מקצועיות שאין לתאר וזמנים מדויקים על הדקה.', date: '2025-01-10' },
  { id: '3', author: 'יונתן שפירא', rating: 5, text: 'אין על דביר, תמיד מקשיב ומדייק את התספורת והזקן בדיוק איך שאני אוהב. מומלץ בחום!', date: '2025-01-05' },
  { id: '4', author: 'מתן כהן', rating: 5, text: 'האפשרות להזמין תור באתר מראש ולראות מתי הוא באריאל ומתי ברחובות פשוט גאונית וחוסכת המון זמן.', date: '2024-12-28' },
];
