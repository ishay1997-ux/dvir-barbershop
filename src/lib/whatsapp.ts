/**
 * Universal Multi-Tenant WhatsApp Helper Module for CutWeb
 * 
 * Supports dynamic white-label configuration for multiple barbershops and businesses:
 * - Dynamic business names, owner/barber names, and contact phones
 * - Zero hardcoded business identities
 * - Standardized phone normalization (Israeli & International)
 * - Safe URL parameter encoding
 */

export interface WhatsAppBusinessContext {
  name?: string;
  slug?: string;
  ownerName?: string;
  phone?: string;
}

/**
 * Converts any phone format (e.g. "050-123-4567", "+972 50 123 4567", "0587815071")
 * into standard international format without symbols (e.g. "972501234567").
 */
export function normalizeWhatsAppPhone(phone?: string, fallbackPhone?: string): string {
  const target = phone || fallbackPhone || '';
  if (!target) return '';
  
  // Remove all non-digit characters
  const digits = target.replace(/\D/g, '');
  if (!digits) return '';

  // If starts with Israeli 0 (e.g. 0501234567), replace leading 0 with 972
  if (digits.startsWith('0')) {
    return `972${digits.slice(1)}`;
  }

  // If already starts with 972
  if (digits.startsWith('972')) {
    return digits;
  }

  // Fallback if 9 digits (e.g. 501234567)
  if (digits.length === 9) {
    return `972${digits}`;
  }

  return digits;
}

/**
 * Builds a direct wa.me link with encoded text message.
 */
export function createWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = normalizeWhatsAppPhone(phone);
  if (!cleanPhone) return '#';
  
  if (!message || !message.trim()) {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Helper to construct the dynamic booking/reschedule URL for a specific business
 */
export function getBusinessBookingUrl(slug?: string): string {
  if (slug && slug !== 'dvir') {
    return `https://thecut.co.il/${slug}/booking`;
  }
  return 'https://thecut.co.il/booking';
}

/**
 * 1. Customer Inquiry to Business Owner / Barber
 */
export function createCustomerInquiryUrl(params: {
  ownerPhone: string;
  ownerName?: string;
  businessName?: string;
  customText?: string;
}): string {
  const owner = params.ownerName || 'צוות המספרה';
  const biz = params.businessName || 'המספרה';
  const msg = params.customText || `היי ${owner}, רציתי לשאול לגבי תור ב-${biz} ✂️`;
  return createWhatsAppUrl(params.ownerPhone, msg);
}

/**
 * 2. Appointment Confirmation (sent by customer to barber or vice versa)
 */
export function createAppointmentConfirmationUrl(params: {
  targetPhone: string;
  customerName: string;
  serviceName?: string;
  dateStr: string;
  time: string;
  businessName?: string;
  ownerName?: string;
}): string {
  const owner = params.ownerName || 'הספר';
  const biz = params.businessName || 'המספרה';
  const srv = params.serviceName ? ` ל-${params.serviceName}` : '';
  const msg = `היי ${owner}, נקבע תור${srv} ב-${biz} בתאריך ${params.dateStr} בשעה ${params.time}. שם הלקוח: ${params.customerName}`;
  return createWhatsAppUrl(params.targetPhone, msg);
}

/**
 * 3. Appointment Reminder sent by Business Admin to Customer
 */
export function createAppointmentReminderUrl(params: {
  customerPhone: string;
  customerName: string;
  time: string;
  dateStr?: string;
  serviceName?: string;
  businessName?: string;
  barberName?: string;
}): string {
  const biz = params.businessName || 'המספרה';
  const service = params.serviceName ? ` ל-${params.serviceName}` : '';
  const barber = params.barberName ? ` אצל ${params.barberName}` : '';
  const date = params.dateStr ? ` בתאריך ${params.dateStr}` : ' היום';
  const msg = `היי ${params.customerName}, תזכורת לתור שלך${service}${barber} ב-${biz}${date} בשעה ${params.time} ✂️ נתראה!`;
  return createWhatsAppUrl(params.customerPhone, msg);
}

/**
 * 4. Smart Waitlist: Available slot notification sent to waiting customer
 */
export function createWaitlistAlertUrl(params: {
  customerPhone: string;
  customerName: string;
  dateStr: string;
  timeSlot: string;
  serviceName?: string;
  businessName?: string;
  slug?: string;
}): string {
  const biz = params.businessName || 'המספרה';
  const service = params.serviceName ? ` ל-${params.serviceName}` : '';
  const link = getBusinessBookingUrl(params.slug);
  const msg = `היי ${params.customerName}, התפנה תור${service} ב-${biz} לתאריך ${params.dateStr} (${params.timeSlot})! שריין עכשיו בקישור: ${link}`;
  return createWhatsAppUrl(params.customerPhone, msg);
}

/**
 * 5. Emergency Closure / Reschedule notification
 */
export function createEmergencyRescheduleUrl(params: {
  customerPhone: string;
  customerName: string;
  dateStr: string;
  time: string;
  businessName?: string;
  reason?: string;
  slug?: string;
}): string {
  const biz = params.businessName || 'המספרה';
  const reasonText = params.reason ? ` עקב ${params.reason}` : '';
  const link = getBusinessBookingUrl(params.slug);
  const msg = `היי ${params.customerName}, נאלצנו לבטל את התור שלך ב-${biz} לתאריך ${params.dateStr} בשעה ${params.time}${reasonText}. מתנצלים על אי הנוחות! אנא קבע מועד חלופי כאן: ${link} 🙏`;
  return createWhatsAppUrl(params.customerPhone, msg);
}

/**
 * 6. Appointment Cancellation by Customer
 */
export function createAppointmentCancellationUrl(params: {
  ownerPhone: string;
  customerName: string;
  dateStr: string;
  time: string;
  serviceName?: string;
  businessName?: string;
  ownerName?: string;
}): string {
  const owner = params.ownerName || 'הספר';
  const biz = params.businessName || 'המספרה';
  const srv = params.serviceName ? ` ל-${params.serviceName}` : '';
  const msg = `היי ${owner}, ביטלתי את התור שלי${srv} ב-${biz} בתאריך ${params.dateStr} בשעה ${params.time}. שם: ${params.customerName}`;
  return createWhatsAppUrl(params.ownerPhone, msg);
}
