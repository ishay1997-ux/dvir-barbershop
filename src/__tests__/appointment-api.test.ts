import { describe, it, expect } from 'vitest';
import {
  validateAppointmentPayload,
  checkMemoryConflict,
  getPhoneVariations,
  createMemoryAppointment,
  MemoryAppointment,
} from '@/lib/appointment-helpers';
import { checkRateLimit } from '@/lib/rateLimit';

describe('Appointment API Logic & Verification Tests', () => {
  it('should validate a complete and correct appointment payload', () => {
    // Tomorrow date in YYYY-MM-DD
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const payload = {
      serviceId: 'srv-1',
      serviceName: 'תספורת גברים פרימיום',
      servicePrice: 80,
      barberId: 'dvir',
      barberName: 'דביר',
      branchId: 'ariel',
      branchName: 'סניף אריאל',
      businessSlug: 'dvir',
      businessName: 'המספרה של דביר',
      date: tomorrowStr,
      time: '14:30',
      customerName: 'יוסי כהן',
      customerPhone: '054-123-4567',
    };

    const result = validateAppointmentPayload(payload);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.cleanName).toBe('יוסי כהן');
    expect(result.data?.cleanPhone).toBe('0541234567');
    expect(result.data?.resolvedPrice).toBe(80);
  });

  it('should reject booking when mandatory fields are missing', () => {
    const payload = {
      serviceName: 'תספורת',
      // missing date, time, customerPhone
      customerName: 'דני',
    };

    const result = validateAppointmentPayload(payload);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('שדות החובה');
  });

  it('should reject booking when customer name is too short', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const payload = {
      serviceId: 'srv-1',
      date: tomorrow,
      time: '11:00',
      customerName: 'א', // 1 char
      customerPhone: '054-1234567',
    };

    const result = validateAppointmentPayload(payload);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('שם מלא');
  });

  it('should reject booking for a past date/time', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const payload = {
      serviceId: 'srv-1',
      date: yesterday,
      time: '10:00',
      customerName: 'משה לוי',
      customerPhone: '054-9988776',
    };

    const result = validateAppointmentPayload(payload);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('למועד שעבר');
  });

  it('should detect memory double-booking conflict accurately', () => {
    const existingAppointments: MemoryAppointment[] = [
      {
        id: 'apt-1',
        serviceId: 'srv-1',
        serviceName: 'תספורת',
        servicePrice: 80,
        barberId: 'dvir',
        barberName: 'דביר',
        branchId: 'ariel',
        branchName: 'אריאל',
        businessSlug: 'dvir',
        businessName: 'דביר',
        date: '2026-09-01',
        time: '16:00',
        customerName: 'לקוח א',
        customerPhone: '050-1111111',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ];

    // Conflict: same barber, date, time, businessSlug
    const hasConflict = checkMemoryConflict(
      existingAppointments,
      'dvir',
      '2026-09-01',
      '16:00',
      'dvir'
    );
    expect(hasConflict).toBe(true);

    // No conflict: different time
    const differentTime = checkMemoryConflict(
      existingAppointments,
      'dvir',
      '2026-09-01',
      '16:30',
      'dvir'
    );
    expect(differentTime).toBe(false);

    // No conflict: different barber
    const differentBarber = checkMemoryConflict(
      existingAppointments,
      'dvir',
      '2026-09-01',
      '16:00',
      'barber-2'
    );
    expect(differentBarber).toBe(false);
  });

  it('should generate complete phone variations for robust customer management and cancellation', () => {
    const variationsObj = getPhoneVariations('058-781-5071');
    expect(variationsObj.rawDigits).toBe('0587815071');
    expect(variationsObj.last9Digits).toBe('587815071');
    expect(variationsObj.variations).toContain('0587815071');
    expect(variationsObj.variations).toContain('058-781-5071');
    expect(variationsObj.variations).toContain('972587815071');
    expect(variationsObj.variations).toContain('+972587815071');
  });

  it('should enforce rate limiting protection per IP and phone number', () => {
    const testKey = `test_rate_limit_${Date.now()}`;
    const limit = 5;

    // Send 5 requests within limit
    for (let i = 0; i < limit; i++) {
      const res = checkRateLimit(testKey, limit, 10000);
      expect(res.success).toBe(true);
    }

    // 6th request should fail
    const overflowRes = checkRateLimit(testKey, limit, 10000);
    expect(overflowRes.success).toBe(false);
    expect(overflowRes.remaining).toBe(0);
  });
});
