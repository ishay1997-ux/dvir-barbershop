export type ServiceCategory = 'haircut' | 'beard' | 'color' | 'treatment';

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  shortDescription: string;
  wazeUrl: string;
  googleMapsUrl?: string;
  activeDays: number[]; // e.g. [0, 1, 2] = Sun, Mon, Tue
  phone: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: ServiceCategory;
  icon?: string;
  isActive: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string; // e.g. 'ספר ראשי ומנהל', 'ספר בכיר'
  bio: string;
  photo_url: string | null;
  specialties: string[];
  color: string; // calendar color badge
  phone?: string;
  branchIds: string[]; // which branches this barber works in (e.g. ['ariel', 'rehovot'])
  is_active: boolean;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
}

export interface Appointment {
  id: string;
  branch_id?: string;
  barber_id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  start_time: string; // ISO
  end_time: string;   // ISO
  status: 'pending' | 'confirmed' | 'cancelled' | 'no_show';
  notes?: string;
  created_at: string;
}

export interface CustomerPreferences {
  machineNumber?: string; // e.g. "0.5 בצדדים, 2 למעלה"
  fadeType?: string;      // e.g. "Low Fade", "Mid Fade", "Skin Fade"
  beardStyle?: string;    // e.g. "קווים חדים, שמן ארגן"
  notes?: string;         // e.g. "רגיש בעורף, שותה מים קרים"
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  lastVisit: string; // ISO date
  totalVisits: number;
  totalSpent: number;
  status: 'vip' | 'active' | 'at_risk' | 'dormant';
  favoriteBarberId?: string;
  favoriteBranchId?: string;
  preferences?: CustomerPreferences;
}

export interface BookingState {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  selectedBranch: Branch | null;
  selectedService: Service | null;
  selectedBarber: Barber | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  customerName: string;
  customerPhone: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export interface WorkingHours {
  day: number; // 0=Sun, 6=Sat
  open: string; // HH:mm
  close: string;
  is_closed: boolean;
}

export interface BlockedDate {
  id: string;
  barberId: string; // 'all' or specific barber id
  date: string; // YYYY-MM-DD
  reason: string; // 'מילואים', 'חופשה', 'מחלה', 'אירוע'
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  mainPhone: string;
  whatsappGreeting: string;
  retentionMessageTemplate: string;
  cancellationNoticeHours: number;
  bufferMinutesBetweenAppointments: number;
  bookingWindowDays: number; // e.g. 14 or 30 days in advance
  lunchBreak?: {
    start: string;
    end: string;
    isActive: boolean;
  };
  announcementBanner?: {
    text: string;
    isActive: boolean;
  };
  branchSchedule: Record<number, 'ariel' | 'rehovot' | 'closed'>; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}
