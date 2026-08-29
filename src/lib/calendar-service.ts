/**
 * Calendar Service — Generates Google Calendar URLs and downloadable .ics files
 * for Apple Calendar, Google Calendar, and Outlook.
 */

export interface CalendarEventData {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  durationMinutes: number;
}

/**
 * Format a Date to UTC string for .ics: YYYYMMDDTHHmmssZ
 */
function formatUtcForIcs(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generate a direct Google Calendar add-event URL
 */
export function generateGoogleCalendarUrl(event: CalendarEventData): string {
  const startIso = formatUtcForIcs(event.startDate);
  const endDate = new Date(event.startDate.getTime() + event.durationMinutes * 60000);
  const endIso = formatUtcForIcs(endDate);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startIso}/${endIso}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate standard iCalendar (.ics) string content
 */
export function generateIcsContent(event: CalendarEventData): string {
  const startIso = formatUtcForIcs(event.startDate);
  const endDate = new Date(event.startDate.getTime() + event.durationMinutes * 60000);
  const endIso = formatUtcForIcs(endDate);
  const uid = `cutweb-${Date.now()}@thecut.co.il`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Cut Barbershop//Appointment Calendar//HE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatUtcForIcs(new Date())}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT120M', // 2 hours before reminder
    'ACTION:DISPLAY',
    'DESCRIPTION:תזכורת: תור למספרה בעוד שעתיים',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Trigger immediate browser download of the .ics file
 */
export function downloadIcsFile(event: CalendarEventData, filename = 'appointment.ics') {
  if (typeof window === 'undefined') return;

  const ics = generateIcsContent(event);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
