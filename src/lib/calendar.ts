import { format, addMinutes } from 'date-fns';
import { SHOP_INFO } from './utils';
import type { BookingState } from './types';

/**
 * Generates a direct Google Calendar event creation URL
 */
export function generateGoogleCalendarUrl(booking: BookingState): string {
  if (!booking.selectedDate || !booking.selectedTime || !booking.selectedService) {
    return '#';
  }

  const [hours, minutes] = booking.selectedTime.split(':').map(Number);
  const startDate = new Date(booking.selectedDate);
  startDate.setHours(hours, minutes, 0, 0);

  const duration = booking.selectedService.duration || 45;
  const endDate = addMinutes(startDate, duration);

  const formatGCalDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d+/g, '');

  const branchName = booking.selectedBranch?.name || SHOP_INFO.name;
  const branchAddress = booking.selectedBranch?.address || 'ישראל';

  const title = encodeURIComponent(`תספורת ב${SHOP_INFO.name} – ${booking.selectedService.name}`);
  const details = encodeURIComponent(
    `תור לתספורת עם ${booking.selectedBarber?.name || 'דביר'}.\n📍 מיקום: ${branchName} (${branchAddress})\n✂️ שירות: ${booking.selectedService.name}\n📞 טלפון: ${SHOP_INFO.phone}`
  );
  const location = encodeURIComponent(branchAddress);
  const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

/**
 * Generates and triggers download of an .ics file for Apple Calendar, Outlook, etc.
 */
export function downloadIcsFile(booking: BookingState): void {
  if (!booking.selectedDate || !booking.selectedTime || !booking.selectedService) {
    return;
  }

  const [hours, minutes] = booking.selectedTime.split(':').map(Number);
  const startDate = new Date(booking.selectedDate);
  startDate.setHours(hours, minutes, 0, 0);

  const duration = booking.selectedService.duration || 45;
  const endDate = addMinutes(startDate, duration);

  const formatIcsDate = (d: Date) =>
    format(d, "yyyyMMdd'T'HHmmss");

  const branchName = booking.selectedBranch?.name || SHOP_INFO.name;
  const branchAddress = booking.selectedBranch?.address || 'ישראל';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SHOP_INFO.name}//Appointment Calendar//HE`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:cutweb-${Date.now()}@dvirbarber.co.il`,
    `DTSTAMP:${formatIcsDate(new Date())}Z`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:תספורת ב${SHOP_INFO.name} - ${booking.selectedService.name}`,
    `DESCRIPTION:תור עם ${booking.selectedBarber?.name || 'דביר'}\\nמיקום: ${branchName} (${branchAddress})\\nשירות: ${booking.selectedService.name}\\nטלפון: ${SHOP_INFO.phone}`,
    `LOCATION:${branchAddress}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:תזכורת לתור במספרה של דביר',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `appointment-${format(startDate, 'yyyy-MM-dd')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a pre-filled WhatsApp confirmation URL
 */
export function generateWhatsAppConfirmationUrl(booking: BookingState): string {
  const serviceName = booking.selectedService?.name || 'תספורת';
  const barberName = booking.selectedBarber?.name || 'דביר';
  const branchName = booking.selectedBranch ? booking.selectedBranch.name : 'המספרה';
  const dateStr = booking.selectedDate
    ? format(booking.selectedDate, 'dd/MM/yyyy')
    : '';
  const timeStr = booking.selectedTime || '';

  const cleanPhone = SHOP_INFO.phone.replace(/\D/g, '').replace(/^0/, '972');
  const message = encodeURIComponent(
    `שלום דביר! 👋\nהזמנתי תור דרך האתר:\n👤 שם: ${booking.customerName}\n📍 סניף: ${branchName}\n✂️ שירות: ${serviceName}\n💈 ספר: ${barberName}\n📅 תאריך: ${dateStr}\n⏰ שעה: ${timeStr}\n\nמחכה להגיע!`
  );

  return `https://wa.me/${cleanPhone}?text=${message}`;
}
