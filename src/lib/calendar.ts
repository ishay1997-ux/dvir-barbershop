import { format, addMinutes } from 'date-fns';
import { SHOP_INFO } from './utils';
import type { BookingState } from './types';

export interface CalendarBusinessContext {
  name?: string;
  phone?: string;
  ownerName?: string;
  category?: string;
}

/**
 * Generates a direct Google Calendar event creation URL
 */
export function generateGoogleCalendarUrl(
  booking: BookingState,
  businessContext?: CalendarBusinessContext
): string {
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

  const bizName = businessContext?.name || SHOP_INFO.name;
  const bizPhone = businessContext?.phone || SHOP_INFO.phone;
  const staffName = booking.selectedBarber?.name || businessContext?.ownerName || 'איש הצוות';

  const branchName = booking.selectedBranch?.name || bizName;
  const branchAddress = booking.selectedBranch?.address || 'ישראל';

  const title = encodeURIComponent(`פגישה ב${bizName} – ${booking.selectedService.name}`);
  const details = encodeURIComponent(
    `תור לפגישה/טיפול עם ${staffName}.\n📍 מיקום: ${branchName} (${branchAddress})\n✨ שירות: ${booking.selectedService.name}\n📞 טלפון לבירורים: ${bizPhone}`
  );
  const location = encodeURIComponent(branchAddress);
  const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

/**
 * Generates and triggers download of an .ics file for Apple Calendar, Outlook, etc.
 */
export function downloadIcsFile(
  booking: BookingState,
  businessContext?: CalendarBusinessContext
): void {
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

  const bizName = businessContext?.name || SHOP_INFO.name;
  const bizPhone = businessContext?.phone || SHOP_INFO.phone;
  const staffName = booking.selectedBarber?.name || businessContext?.ownerName || 'איש הצוות';

  const branchName = booking.selectedBranch?.name || bizName;
  const branchAddress = booking.selectedBranch?.address || 'ישראל';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${bizName}//Appointment Calendar//HE`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:cutweb-${Date.now()}@thecut.co.il`,
    `DTSTAMP:${formatIcsDate(new Date())}Z`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:תור ב${bizName} - ${booking.selectedService.name}`,
    `DESCRIPTION:תור עם ${staffName}\\nמיקום: ${branchName} (${branchAddress})\\nשירות: ${booking.selectedService.name}\\nטלפון: ${bizPhone}`,
    `LOCATION:${branchAddress}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:תזכורת לתור ב-${bizName}`,
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
export function generateWhatsAppConfirmationUrl(
  booking: BookingState,
  businessContext?: CalendarBusinessContext
): string {
  const serviceName = booking.selectedService?.name || 'שירות';
  const bizName = businessContext?.name || 'העסק';
  const staffName = booking.selectedBarber?.name || businessContext?.ownerName || 'איש הצוות';
  const branchName = booking.selectedBranch ? booking.selectedBranch.name : bizName;
  const dateStr = booking.selectedDate
    ? format(booking.selectedDate, 'dd/MM/yyyy')
    : 'תאריך נבחר';
  const timeStr = booking.selectedTime || 'שעה נבחרת';
  const phone = businessContext?.phone || SHOP_INFO.phone;

  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '972');

  const message = encodeURIComponent(
    `היי ${staffName}, הזמנתי תור דרך האתר של ${bizName}!\n` +
      `✨ שירות: ${serviceName}\n` +
      `📍 סניף/מיקום: ${branchName}\n` +
      `📅 תאריך: ${dateStr}\n` +
      `⏰ שעה: ${timeStr}\n\n` +
      `שם: ${booking.customerName}\n` +
      `טלפון: ${booking.customerPhone}\n\n` +
      `אשמח לאישור סופי 🙌`
  );

  return `https://wa.me/${cleanPhone}?text=${message}`;
}

