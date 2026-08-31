export interface MemoryAppointment {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  barberId: string;
  barberName: string;
  branchId: string;
  branchName: string;
  businessSlug: string;
  businessName: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  locationType?: string;
  bookingType?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ValidatedAppointmentData {
  cleanName: string;
  cleanPhone: string;
  resolvedServiceName: string;
  resolvedPrice: number;
  resolvedSlug: string;
  resolvedBizName: string;
  resolvedDate: string;
  resolvedTime: string;
  resolvedBarberId: string;
  serviceId: string;
  barberName: string;
  branchId: string;
  branchName: string;
  customerPhone: string;
  customerAddress?: string;
  locationType: string;
  bookingType: string;
}

export function validateAppointmentPayload(body: any): {
  isValid: boolean;
  error?: string;
  data?: ValidatedAppointmentData;
} {
  const {
    serviceId,
    serviceName,
    service,
    servicePrice,
    price,
    barberId,
    barberName,
    branchId,
    branchName,
    businessSlug,
    businessName,
    date,
    time,
    customerName,
    customerPhone,
    customerAddress,
    locationType,
    bookingType,
  } = body || {};

  if ((!serviceId && !serviceName && !service) || !date || !time || !customerName || !customerPhone) {
    return { isValid: false, error: 'נא למלא את כל שדות החובה להזמנת תור' };
  }

  const cleanName = String(customerName).trim().slice(0, 60);
  const cleanPhone = String(customerPhone).replace(/\D/g, '').slice(0, 20);
  const resolvedServiceName = String(serviceName || service || 'תספורת גברים').trim().slice(0, 80);
  const resolvedPrice = Number(servicePrice || price) || 80;
  const resolvedSlug = String(businessSlug || 'dvir').toLowerCase().trim();
  const resolvedBizName = String(businessName || 'המספרה של דביר').trim();
  const resolvedDate = String(date).trim();
  const resolvedTime = String(time).trim();
  const resolvedBarberId = String(barberId || 'dvir').trim();

  if (cleanName.length < 2 || cleanPhone.length < 9) {
    return { isValid: false, error: 'שם מלא (לפחות 2 תווים) או מספר טלפון תקין (לפחות 9 ספרות) נדרשים' };
  }

  const isRangeTime = /^\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2}$/.test(resolvedTime);
  const isExactTime = /^\d{2}:\d{2}$/.test(resolvedTime);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(resolvedDate) || (!isExactTime && !isRangeTime)) {
    return { isValid: false, error: 'פורמט תאריך או שעה אינו תקין' };
  }

  try {
    const startTimeStr = isRangeTime ? resolvedTime.split(/[-–]/)[0].trim() : resolvedTime;
    const appointmentDateTime = new Date(`${resolvedDate}T${startTimeStr}:00`);
    if (isNaN(appointmentDateTime.getTime()) || appointmentDateTime.getTime() < Date.now() - 5 * 60 * 1000) {
      return { isValid: false, error: 'לא ניתן לקבוע תור למועד שעבר. אנא בחר שעה עתידית.' };
    }
  } catch {
    // ignore parse error fallback
  }

  return {
    isValid: true,
    data: {
      cleanName,
      cleanPhone,
      resolvedServiceName,
      resolvedPrice,
      resolvedSlug,
      resolvedBizName,
      resolvedDate,
      resolvedTime,
      resolvedBarberId,
      serviceId: serviceId || 'srv-haircut',
      barberName: barberName || 'דביר',
      branchId: branchId || 'ariel',
      branchName: branchName || (branchId === 'rehovot' ? 'סניף רחובות' : 'סניף אריאל'),
      customerPhone: String(customerPhone).trim(),
      customerAddress: customerAddress || undefined,
      locationType: locationType || 'BUSINESS_LOCATION',
      bookingType: bookingType || 'FIXED_SLOT',
    },
  };
}

export function checkMemoryConflict(
  memoryAppointments: MemoryAppointment[],
  businessSlug: string,
  date: string,
  time: string,
  barberId: string
): boolean {
  return memoryAppointments.some(
    (a) =>
      a.businessSlug === businessSlug &&
      a.date === date &&
      a.time === time &&
      a.barberId === barberId &&
      a.status === 'confirmed'
  );
}

export function getPhoneVariations(phone: string): { rawDigits: string; last9Digits: string; variations: string[] } {
  const rawDigits = phone.replace(/\D/g, '');
  const last9Digits = rawDigits.slice(-9);
  const variations = Array.from(
    new Set([
      rawDigits,
      phone.trim(),
      last9Digits,
      `0${last9Digits}`,
      `972${last9Digits}`,
      `+972${last9Digits}`,
    ].filter(Boolean))
  );

  return { rawDigits, last9Digits, variations };
}

export function createMemoryAppointment(id: string, data: ValidatedAppointmentData): MemoryAppointment {
  return {
    id,
    serviceId: data.serviceId,
    serviceName: data.resolvedServiceName,
    servicePrice: data.resolvedPrice,
    barberId: data.resolvedBarberId,
    barberName: data.barberName,
    branchId: data.branchId,
    branchName: data.branchName,
    businessSlug: data.resolvedSlug,
    businessName: data.resolvedBizName,
    date: data.resolvedDate,
    time: data.resolvedTime,
    customerName: data.cleanName,
    customerPhone: data.customerPhone,
    customerAddress: data.customerAddress,
    locationType: data.locationType,
    bookingType: data.bookingType,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
}
