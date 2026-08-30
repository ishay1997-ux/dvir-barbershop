import { describe, it, expect } from 'vitest';
import {
  normalizeWhatsAppPhone,
  createWhatsAppUrl,
  createCustomerInquiryUrl,
  createAppointmentConfirmationUrl,
  createAppointmentCancellationUrl,
  createEmergencyRescheduleUrl,
  createAppointmentReminderUrl,
} from '@/lib/whatsapp';

describe('WhatsApp Notifications & Phone Normalization Tests', () => {
  describe('normalizeWhatsAppPhone', () => {
    it('should normalize standard Israeli 10-digit mobile phone starting with 0', () => {
      expect(normalizeWhatsAppPhone('054-123-4567')).toBe('972541234567');
      expect(normalizeWhatsAppPhone('0501234567')).toBe('972501234567');
      expect(normalizeWhatsAppPhone('058.781.5071')).toBe('972587815071');
    });

    it('should keep international 972 numbers intact', () => {
      expect(normalizeWhatsAppPhone('+972-54-123-4567')).toBe('972541234567');
      expect(normalizeWhatsAppPhone('972501234567')).toBe('972501234567');
    });

    it('should normalize 9-digit numbers without leading zero', () => {
      expect(normalizeWhatsAppPhone('541234567')).toBe('972541234567');
    });

    it('should return empty string or fallback on invalid input', () => {
      expect(normalizeWhatsAppPhone('')).toBe('');
      expect(normalizeWhatsAppPhone(undefined, '054-0000000')).toBe('972540000000');
    });
  });

  describe('createWhatsAppUrl & Encodings', () => {
    it('should generate valid wa.me link with encoded URI parameters', () => {
      const url = createWhatsAppUrl('054-1234567', 'שלום דביר!');
      expect(url).toContain('https://wa.me/972541234567?text=');
      expect(decodeURIComponent(url)).toContain('שלום דביר!');
    });

    it('should return plain wa.me link if message is empty', () => {
      const url = createWhatsAppUrl('054-1234567');
      expect(url).toBe('https://wa.me/972541234567');
    });
  });

  describe('Multi-Tenant Message Generators', () => {
    it('should format customer inquiry message dynamically for any business', () => {
      const url = createCustomerInquiryUrl({
        ownerPhone: '052-9988776',
        ownerName: 'נועה',
        businessName: 'קליניקת גלואו',
      });
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain('נועה');
      expect(decoded).toContain('קליניקת גלואו');
      expect(url).toContain('972529988776');
    });

    it('should format appointment confirmation with date, time, and service details', () => {
      const url = createAppointmentConfirmationUrl({
        targetPhone: '050-1122334',
        customerName: 'יוסי כהן',
        serviceName: 'תספורת וזקן',
        dateStr: '01/09/2026',
        time: '17:30',
        businessName: 'המספרה של דביר',
        ownerName: 'דביר',
      });
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain('יוסי כהן');
      expect(decoded).toContain('תספורת וזקן');
      expect(decoded).toContain('01/09/2026');
      expect(decoded).toContain('17:30');
      expect(decoded).toContain('המספרה של דביר');
    });

    it('should format appointment reminder properly', () => {
      const url = createAppointmentReminderUrl({
        customerPhone: '054-5556667',
        customerName: 'רונן',
        dateStr: '02/09/2026',
        time: '11:00',
        businessName: 'סטודיו פיטנס',
      });
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain('רונן');
      expect(decoded).toContain('תזכורת');
      expect(decoded).toContain('סטודיו פיטנס');
    });

    it('should format cancellation notice properly', () => {
      const url = createAppointmentCancellationUrl({
        ownerPhone: '054-5556667',
        customerName: 'רונן',
        dateStr: '02/09/2026',
        time: '11:00',
        businessName: 'סטודיו פיטנס',
      });
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain('רונן');
      expect(decoded).toContain('ביטלתי');
      expect(decoded).toContain('סטודיו פיטנס');
    });

    it('should format emergency / reserve duty closure notice in 1-Click', () => {
      const url = createEmergencyRescheduleUrl({
        customerPhone: '052-3334445',
        customerName: 'אבי',
        businessName: 'ברברשופ אריאל',
        dateStr: '03/09/2026',
        time: '14:00',
        reason: 'מילואים',
      });
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain('אבי');
      expect(decoded).toContain('ברברשופ אריאל');
      expect(decoded).toContain('מילואים');
    });
  });
});
