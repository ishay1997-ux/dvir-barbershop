/**
 * WhatsApp Helper Module for CutWeb
 * Handles universal phone number normalization for Israel/International
 * and structured 1-click message generation.
 */

/**
 * Converts any phone format (e.g. "050-123-4567", "+972 50 123 4567", "0587815071")
 * into standard international format without symbols (e.g. "972501234567").
 */
export function normalizeWhatsAppPhone(phone: string, defaultPhone: string = '972587815071'): string {
  if (!phone) return defaultPhone;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (!digits) return defaultPhone;

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
  if (!message || !message.trim()) {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Template: Customer inquiry to business owner
 */
export function createCustomerInquiryUrl(params: {
  ownerPhone: string;
  ownerName?: string;
  businessName?: string;
  customText?: string;
}): string {
  const owner = params.ownerName || 'דביר';
  const biz = params.businessName || 'המספרה';
  const msg = params.customText || `היי ${owner}, רציתי לשאול לגבי תור ב-${biz} ✂️`;
  return createWhatsAppUrl(params.ownerPhone, msg);
}

/**
 * Template: Appointment Confirmation / Reminder sent to customer
 */
export function createAppointmentReminderUrl(params: {
  customerPhone: string;
  customerName: string;
  time: string;
  dateStr?: string;
  serviceName?: string;
  businessName?: string;
}): string {
  const biz = params.businessName || 'המספרה של דביר';
  const service = params.serviceName ? ` ל-${params.serviceName}` : '';
  const date = params.dateStr ? ` בתאריך ${params.dateStr}` : ' היום';
  const msg = `היי ${params.customerName}, תזכורת לתור שלך${service} ב-${biz}${date} בשעה ${params.time} ✂️ נתראה!`;
  return createWhatsAppUrl(params.customerPhone, msg);
}

/**
 * Template: Waitlist available spot notification
 */
export function createWaitlistAlertUrl(params: {
  customerPhone: string;
  customerName: string;
  dateStr: string;
  timeSlot: string;
  serviceName?: string;
  businessName?: string;
}): string {
  const biz = params.businessName || 'המספרה של דביר';
  const service = params.serviceName ? ` ל-${params.serviceName}` : '';
  const msg = `היי ${params.customerName}, התפנה תור${service} ב-${biz} לתאריך ${params.dateStr} בשעה ${params.timeSlot}! רוצה לשריין?`;
  return createWhatsAppUrl(params.customerPhone, msg);
}

/**
 * Template: Emergency Closure / Reschedule notification
 */
export function createEmergencyRescheduleUrl(params: {
  customerPhone: string;
  customerName: string;
  dateStr: string;
  time: string;
  businessName?: string;
  reason?: string;
}): string {
  const biz = params.businessName || 'המספרה';
  const reasonText = params.reason ? ` עקב ${params.reason}` : '';
  const msg = `היי ${params.customerName}, נאלצנו לבטל את התור שלך ב-${biz} לתאריך ${params.dateStr} בשעה ${params.time}${reasonText}. נשמח לתאם עבורך מועד חלופי בהקדם 🙏`;
  return createWhatsAppUrl(params.customerPhone, msg);
}
