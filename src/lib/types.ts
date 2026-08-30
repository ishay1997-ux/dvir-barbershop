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
  hours?: string;
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
  popular?: boolean;
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
  client_address?: {
    city: string;
    street: string;
    apartment?: string;
    floor?: string;
    notes?: string;
  };
  booking_type?: 'FIXED_SLOT' | 'TIME_WINDOW' | 'CONSULTATION_QUOTE';
  created_at: string;
}

export interface HaircutFormula {
  sides?: string;      // e.g. "0.5 סקין פייד"
  top?: string;        // e.g. "מספריים, קיצור בינוני"
  beard?: string;      // e.g. "קווים חדים בתער"
  beverage?: string;   // e.g. "אספרסו קצר בלי סוכר"
  notes?: string;      // e.g. "עור רגיש בעורף"
  updatedAt?: string;
}

export interface CustomerPreferences {
  machineNumber?: string; // e.g. "0.5 בצדדים, 2 למעלה"
  fadeType?: string;      // e.g. "Low Fade", "Mid Fade", "Skin Fade"
  beardStyle?: string;    // e.g. "קווים חדים, שמן ארגן"
  notes?: string;         // e.g. "רגיש בעורף, שותה מים קרים"
  customAttributes?: Record<string, string | number | boolean>;
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
  customAttributes?: Record<string, string | number | boolean>;
  haircutFormula?: HaircutFormula;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  icon?: string;
  category?: 'styling' | 'beard' | 'care';
}

export interface WaitlistEntry {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  preferredTimeRange: 'morning' | 'afternoon' | 'evening' | 'any';
  serviceId?: string;
  serviceName?: string;
  branchId: string;
  branchName: string;
  notes?: string;
  createdAt: string;
  status: 'waiting' | 'notified' | 'booked' | 'cancelled';
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
  selectedAddons?: ProductAddon[];
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

export interface DailyShiftOverride {
  date: string; // YYYY-MM-DD
  branchId: 'ariel' | 'rehovot' | 'closed';
  isOpen: boolean;
  startTime: string; // HH:mm e.g. "16:00"
  endTime: string;   // HH:mm e.g. "19:00"
  note?: string;     // e.g. "3 שעות בלבד", "חלון ערב"
  updatedAt?: string;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  comment: string;
  rating: number; // e.g. 5
  timeAgo?: string;
  serviceUsed?: string;
  avatar?: string;
}

export interface TransformationItem {
  id: string;
  title: string;
  category: string;
  description: string;
  beforeImage?: string;
  afterImage?: string;
  beforeGradient?: string;
  afterGradient?: string;
}

export interface BusinessLayoutConfig {
  bgTheme?: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon';
  heroStyle?: 'hub-monogram' | 'split-cinema' | 'minimalist-vip';
  servicesStyle?: 'split-gallery' | 'cards-grid' | 'accordion-list';
  cardStyle?: 'glass' | 'solid-dark' | 'bordered-neon';
  borderRadius?: 'modern-rounded' | 'sharp-luxury' | 'classic-soft';
  fontStyle?: 'modern-sans' | 'urban-bold' | 'luxury-serif';
  showBeforeAfter?: boolean;
  showReviews?: boolean;
  showFaqs?: boolean;
  showBranches?: boolean;
  showBio?: boolean;
  sectionsOrder?: Array<'hero' | 'services' | 'gallery' | 'bio' | 'reviews' | 'faqs' | 'branches'>;
  sectionTitles?: {
    services?: string;
    servicesSubtitle?: string;
    gallery?: string;
    bio?: string;
    branches?: string;
    reviews?: string;
    faqs?: string;
  };
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  mainPhone: string;
  city?: string;
  slogan?: string;
  bio?: string;
  experienceYears?: number;
  themeColor?: string;
  bgTheme?: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon';
  avatarUrl?: string;
  heroImage?: string;
  whatsappGreeting: string;
  retentionMessageTemplate: string;
  cancellationNoticeHours: number;
  bufferMinutesBetweenAppointments: number;
  bookingWindowDays: number; // e.g. 14, 21, or 30 days in advance
  lunchBreak?: {
    start: string;
    end: string;
    isActive: boolean;
  };
  announcementBanner?: {
    text: string;
    isActive: boolean;
    style?: 'gold' | 'urgent' | 'promo';
  };
  branchSchedule: Record<number, 'ariel' | 'rehovot' | 'closed'>; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  dailyOverrides?: Record<string, DailyShiftOverride>; // Key: YYYY-MM-DD
  blockedDates?: BlockedDate[];
  galleryImages?: string[];
  transformations?: TransformationItem[];
  faqs?: FaqItem[];
  testimonials?: TestimonialItem[];
  layout?: BusinessLayoutConfig;
  instagramUrl?: string;
  instagramHandle?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  wazeUrl?: string;
  googleMapsUrl?: string;
  whatsappNumber?: string;
}

