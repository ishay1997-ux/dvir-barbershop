import { describe, it, expect } from 'vitest';
import { getBusinessBySlug, getBusinessConfigSync } from '@/lib/business-service';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import { getAvailableSlots, getAvailableTimeWindows } from '@/lib/slot-engine';
import { validateAppointmentPayload } from '@/lib/appointment-helpers';

describe('Industry-Aware Booking Logic & Data Flow Invariant Tests', () => {
  // 1. Home Technicians (/tech)
  it('1. should properly configure Technician on-site booking logic with client address & time windows', async () => {
    const techBiz = await getBusinessBySlug('tech');
    expect(techBiz).not.toBeNull();
    expect(techBiz?.category).toBe('home_technician');
    expect(techBiz?.name).toContain('שירותי מיזוג');

    // Services should have realistic pricing and duration
    expect(techBiz?.services.length).toBeGreaterThan(0);
    const mainService = techBiz?.services[0];
    expect(mainService?.price).toBeGreaterThan(0);

    // Time window slot engine should return valid windows for technicians
    const windows = getAvailableTimeWindows({
      date: '2026-09-15',
      workingHours: { open: '08:00', close: '20:00', closed: false },
      filterPastIfToday: false,
    });
    expect(windows.length).toBeGreaterThanOrEqual(3);
    expect(windows.some((w) => w.range.includes('–') || w.range.includes('-'))).toBe(true);

    // Terminology check
    const terminology = getIndustryTerminology(techBiz || undefined);
    expect(terminology.staffTitle).toContain('טכנאי');
    expect(terminology.serviceTitle).toContain('שירות');
  });

  // 2. Barbershops (/dvir)
  it('2. should properly configure Barbershop booking logic with fixed chair slots and branches', async () => {
    const barberBiz = await getBusinessBySlug('dvir');
    expect(barberBiz).not.toBeNull();
    expect(barberBiz?.category).toBe('barber');
    expect(barberBiz?.branchesCount).toBeGreaterThanOrEqual(1);

    // Dynamic slot engine should generate exact granular slots
    const slots = getAvailableSlots({
      date: '2026-09-15',
      workingHours: { open: '09:00', close: '19:00', closed: false },
      serviceDurationMinutes: 30,
      bufferMinutes: 0,
      filterPastIfToday: false,
    });
    expect(slots.length).toBeGreaterThan(10);
    expect(slots).toContain('09:00');
    expect(slots).toContain('09:30');

    // Terminology check
    const terminology = getIndustryTerminology(barberBiz || undefined);
    expect(terminology.staffTitle).toContain('ספר');
    expect(terminology.bookingAction).toContain('תור');
  });

  // 3. Beauty & Nails (/beauty)
  it('3. should properly configure Beauty Salon booking logic with manicure durations & treatments', async () => {
    const beautyBiz = await getBusinessBySlug('beauty');
    expect(beautyBiz).not.toBeNull();
    expect(beautyBiz?.category).toBe('beauty_salon');
    expect(beautyBiz?.services.some((s) => s.name.includes('מבנה אנטומי') || s.name.includes('לק'))).toBe(true);

    const terminology = getIndustryTerminology(beautyBiz || undefined);
    expect(terminology.staffPlural).toContain('מטפלות');
  });

  // 4. Spa & Massage (/spa)
  it('4. should properly configure Spa & Massage booking with holistic treatments and durations', async () => {
    const spaBiz = await getBusinessBySlug('spa');
    expect(spaBiz).not.toBeNull();
    expect(spaBiz?.category).toBe('clinic_therapist');
    expect(spaBiz?.services.some((s) => s.duration >= 45)).toBe(true);

    const terminology = getIndustryTerminology(spaBiz || undefined);
    expect(terminology.serviceTitle).toContain('טיפול');
  });

  // 5. Fitness Coaching (/fitness)
  it('5. should properly configure Fitness Trainer booking with training sessions and goals', async () => {
    const fitnessBiz = await getBusinessBySlug('fitness');
    expect(fitnessBiz).not.toBeNull();
    expect(fitnessBiz?.category).toBe('private_instructor');

    const terminology = getIndustryTerminology(fitnessBiz || undefined);
    expect(terminology.staffTitle).toContain('מאמן');
  });

  // 6. Medical Aesthetics (/clinic)
  it('6. should properly configure Aesthetics Clinic booking with doctor consultations', async () => {
    const clinicBiz = await getBusinessBySlug('clinic');
    expect(clinicBiz).not.toBeNull();
    expect(clinicBiz?.category).toBe('clinics_aesthetics');

    const terminology = getIndustryTerminology(clinicBiz || undefined);
    expect(terminology.staffTitle).toContain('רופא');
  });

  // 7. Tattoo Studio (/tattoo)
  it('7. should properly configure Tattoo Studio booking with custom sketches and sessions', async () => {
    const tattooBiz = await getBusinessBySlug('tattoo');
    expect(tattooBiz).not.toBeNull();
    expect(tattooBiz?.category).toBe('tattoo_piercing');

    const terminology = getIndustryTerminology(tattooBiz || undefined);
    expect(terminology.staffTitle).toContain('קעקועים');
  });

  // 8. Payload Validation for Home Service vs In-Shop Service
  it('8. should validate appointment payload correctly for both on-site and in-shop bookings', () => {
    // Valid in-shop booking
    const inShopResult = validateAppointmentPayload({
      customerName: 'יוסי כהן',
      customerPhone: '052-1234567',
      date: '2026-09-15',
      time: '14:00',
      service: 'תספורת גברים',
      price: 80,
      businessSlug: 'dvir',
    });
    expect(inShopResult.isValid).toBe(true);
    expect(inShopResult.data?.cleanName).toBe('יוסי כהן');
    expect(inShopResult.data?.cleanPhone).toBe('0521234567');

    // Valid technician booking with address & fault description
    const techResult = validateAppointmentPayload({
      customerName: 'דנה לוי',
      customerPhone: '054-9876543',
      customerAddress: 'הרצל 15, תל אביב, קומה 2 דירה 4',
      faultDescription: 'מזגן תדיראן מרעיש ולא מקרר',
      date: '2026-09-15',
      time: '09:00 - 12:00',
      service: 'קריאת שירות לבית הלקוח',
      price: 180,
      businessSlug: 'tech',
      locationType: 'CLIENT_ADDRESS',
      bookingType: 'TIME_WINDOW',
    });
    expect(techResult.isValid).toBe(true);
    expect(techResult.data?.resolvedSlug).toBe('tech');
  });

  // 9. Sync Resolution Invariant
  it('9. should resolve all 8 niche slugs synchronously without error', () => {
    const slugs = ['dvir', 'beauty', 'spa', 'fitness', 'clinic', 'tech', 'tattoo'];
    for (const slug of slugs) {
      const config = getBusinessConfigSync(slug);
      expect(config).not.toBeNull();
      expect(config?.slug).toBe(slug);
      expect(config?.services.length).toBeGreaterThan(0);
      expect(config?.themeColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});
