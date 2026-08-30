export type BusinessCategory = 
  | 'barber'            // מספרות ועיצוב שיער
  | 'beauty_salon'       // קוסמטיקה, ציפורניים, טיפוח
  | 'clinic_therapist'   // עיסוי, טיפולים, רפואה משלימה
  | 'home_technician'    // אינסטלטורים, חשמלאים, מנעולנים
  | 'private_instructor';// מאמני כושר, שיעורים פרטיים

export type ServiceBookingType = 
  | 'FIXED_SLOT'         // תור מוגדר על הדקה (תספורת 30 דק')
  | 'TIME_WINDOW'        // חלון הגעה (אינסטלטור יגיע בין 10:00 ל-13:00)
  | 'CONSULTATION_QUOTE';// ייעוץ / הצעת מחיר

export type ServiceLocationType = 
  | 'BUSINESS_LOCATION'  // הגעה לסניף/קליניקה/מספרה
  | 'CLIENT_ADDRESS'     // שירות בבית הלקוח
  | 'ONLINE_VIDEO';      // פגישה אונליין

export interface ClientAddress {
  city: string;
  street: string;
  houseNumber?: string;
  apartment?: string;
  floor?: string;
  entryCode?: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
  servicesProvided?: string[]; // IDs של השירותים שהעובד מבצע
  isActive?: boolean;
}

export interface ServiceItem {
  id?: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
  popular?: boolean;
  bookingType?: ServiceBookingType;
  locationType?: ServiceLocationType;
  bufferAfterMinutes?: number; // זמן ניקיון / מעבר בין לקוחות
  staffIds?: string[];
}

export type BusinessService = ServiceItem;

export interface BranchItem {
  id?: string;
  name: string;
  address: string;
  phone?: string;
  wazeLink?: string;
  wazeUrl?: string;
  googleMapsLink?: string;
  hours?: string;
}

export interface TestimonialItem {
  id?: string;
  name: string;
  comment: string;
  rating: number; // e.g. 5
  timeAgo?: string;
  serviceUsed?: string;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export interface BusinessLayoutConfig {
  bgTheme?: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon';
  heroStyle?: 'hub-monogram' | 'split-cinema' | 'minimalist-vip';
  servicesStyle?: 'split-gallery' | 'cards-grid' | 'compact-menu' | 'accordion-list';
  galleryStyle?: 'before-after-slider' | 'instagram-masonry' | 'ambient-carousel';
  mobileStickyStyle?: 'dual-action' | 'triple-action' | 'minimal-pill';
  cardStyle?: 'glass' | 'solid-dark' | 'bordered-neon';
  borderRadius?: 'modern-rounded' | 'sharp-luxury' | 'classic-soft';
  fontStyle?: 'modern-sans' | 'urban-bold' | 'luxury-serif';
  showBeforeAfter?: boolean;
  showReviews?: boolean;
  showFaqs?: boolean;
  showBranches?: boolean;
  showBio?: boolean;
  showTrustBadges?: boolean;
  trustBadges?: string[];
  showAnnouncement?: boolean;
  announcementLink?: string;
  showPolicies?: boolean;
  policies?: {
    cancellationNotice?: string;
    arrivalTime?: string;
    paymentMethods?: string;
    customNote?: string;
  };
  sectionsOrder?: Array<'hero' | 'announcement' | 'trust-badges' | 'services' | 'gallery' | 'bio' | 'policies' | 'branches' | 'reviews' | 'faqs'>;
  sectionTitles?: {
    services?: string;
    servicesSubtitle?: string;
    gallery?: string;
    bio?: string;
    branches?: string;
    reviews?: string;
    faqs?: string;
    trustBadges?: string;
    policies?: string;
  };
}

export interface BusinessConfig {
  id: string;
  name: string;
  slug: string;
  category?: BusinessCategory;
  ownerName: string;
  phone: string;
  city: string;
  address?: string;
  slogan?: string;
  announcement?: string;
  themeColor?: string;
  branchesCount: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'starter' | 'pro' | 'team' | 'enterprise';
  createdAt?: string;
  heroImages?: string[];
  galleryImages?: string[];
  services: ServiceItem[];
  branches: BranchItem[];
  staff?: StaffMember[];
  bufferMinutesDefault?: number;
  testimonials?: TestimonialItem[];
  faqs?: FaqItem[];
  instagramHandle?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  wazeUrl?: string;
  whatsappNumber?: string;
  websiteUrl?: string;
  avatarUrl?: string;
  experienceYears?: number;
  workingHours?: Array<{ day: string; open: string; close: string; closed: boolean; branch?: string }>;
  features?: {
    enableWaitlist?: boolean;
    enableWhatsAppReminders?: boolean;
    enableProductAddons?: boolean;
    enableReviewsCollection?: boolean;
    enableMultiStaff?: boolean;
    enableEmergencyClosure?: boolean;
    enableAdvancedAnalytics?: boolean;
  };
  layout?: BusinessLayoutConfig;
}
