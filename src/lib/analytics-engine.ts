export interface AppointmentAnalyticsRecord {
  id?: string;
  price?: number;
  servicePrice?: number;
  serviceName?: string;
  service?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  customerPhone?: string;
  status?: 'confirmed' | 'cancelled' | 'pending' | 'no_show' | string;
}

export interface PopularServiceStats {
  name: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface DayOfWeekStats {
  dayIndex: number;
  dayName: string;
  count: number;
  revenue: number;
}

export interface BusinessAnalyticsSummary {
  totalAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  averageTicketPrice: number;
  cancellationRate: number; // in percentage e.g. 5.2
  popularServices: PopularServiceStats[];
  daysDistribution: DayOfWeekStats[];
  peakHours: Array<{ hour: string; count: number }>;
  customerRetention: {
    uniqueCustomers: number;
    returningCustomers: number;
    retentionRate: number; // in percentage
  };
}

const HEBREW_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

/**
 * Pure analytics calculation engine for business intelligence and reporting
 */
export function calculateBusinessAnalytics(
  appointments: AppointmentAnalyticsRecord[]
): BusinessAnalyticsSummary {
  if (!appointments || appointments.length === 0) {
    return {
      totalAppointments: 0,
      confirmedAppointments: 0,
      cancelledAppointments: 0,
      totalRevenue: 0,
      averageTicketPrice: 0,
      cancellationRate: 0,
      popularServices: [],
      daysDistribution: HEBREW_DAYS.map((dayName, dayIndex) => ({
        dayIndex,
        dayName: `יום ${dayName}`,
        count: 0,
        revenue: 0,
      })),
      peakHours: [],
      customerRetention: {
        uniqueCustomers: 0,
        returningCustomers: 0,
        retentionRate: 0,
      },
    };
  }

  let totalRevenue = 0;
  let confirmedCount = 0;
  let cancelledCount = 0;

  const serviceMap = new Map<string, { count: number; revenue: number }>();
  const dayMap = new Map<number, { count: number; revenue: number }>();
  const hourMap = new Map<string, number>();
  const customerVisits = new Map<string, number>();

  for (let i = 0; i < 7; i++) {
    dayMap.set(i, { count: 0, revenue: 0 });
  }

  for (const apt of appointments) {
    const isCancelled = apt.status === 'cancelled';
    if (isCancelled) {
      cancelledCount++;
      continue;
    }

    confirmedCount++;
    const price = Number(apt.price || apt.servicePrice || 0);
    totalRevenue += price;

    // Service stats
    const serviceName = apt.serviceName || apt.service || 'שירות כללי';
    const currentService = serviceMap.get(serviceName) || { count: 0, revenue: 0 };
    currentService.count += 1;
    currentService.revenue += price;
    serviceMap.set(serviceName, currentService);

    // Day of week stats
    if (apt.date) {
      try {
        const dayIdx = new Date(apt.date).getDay();
        if (dayIdx >= 0 && dayIdx <= 6) {
          const currentDay = dayMap.get(dayIdx) || { count: 0, revenue: 0 };
          currentDay.count += 1;
          currentDay.revenue += price;
          dayMap.set(dayIdx, currentDay);
        }
      } catch {
        // ignore parse error
      }
    }

    // Peak hours stats
    if (apt.time) {
      const hourKey = apt.time.split(':')[0] + ':00';
      hourMap.set(hourKey, (hourMap.get(hourKey) || 0) + 1);
    }

    // Customer retention
    if (apt.customerPhone) {
      const clean = apt.customerPhone.replace(/\D/g, '');
      customerVisits.set(clean, (customerVisits.get(clean) || 0) + 1);
    }
  }

  const total = confirmedCount + cancelledCount;
  const cancellationRate = total > 0 ? Number(((cancelledCount / total) * 100).toFixed(1)) : 0;
  const averageTicketPrice = confirmedCount > 0 ? Math.round(totalRevenue / confirmedCount) : 0;

  // Popular Services Array sorted desc
  const popularServices: PopularServiceStats[] = Array.from(serviceMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
      percentage: confirmedCount > 0 ? Math.round((data.count / confirmedCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Day distribution Array
  const daysDistribution: DayOfWeekStats[] = Array.from(dayMap.entries()).map(([dayIndex, data]) => ({
    dayIndex,
    dayName: `יום ${HEBREW_DAYS[dayIndex]}`,
    count: data.count,
    revenue: data.revenue,
  }));

  // Peak hours Array sorted by count desc
  const peakHours = Array.from(hourMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Customer retention
  const uniqueCustomers = customerVisits.size;
  let returningCustomers = 0;
  customerVisits.forEach((visits) => {
    if (visits > 1) returningCustomers++;
  });
  const retentionRate = uniqueCustomers > 0 ? Math.round((returningCustomers / uniqueCustomers) * 100) : 0;

  return {
    totalAppointments: total,
    confirmedAppointments: confirmedCount,
    cancelledAppointments: cancelledCount,
    totalRevenue,
    averageTicketPrice,
    cancellationRate,
    popularServices,
    daysDistribution,
    peakHours,
    customerRetention: {
      uniqueCustomers,
      returningCustomers,
      retentionRate,
    },
  };
}
