export interface ServiceItem {
  id?: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
  popular?: boolean;
}

export interface BranchItem {
  id?: string;
  name: string;
  address: string;
  phone?: string;
  wazeLink?: string;
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
  question: string;
  answer: string;
}

export interface BusinessLayoutConfig {
  bgTheme?: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon';
  heroStyle?: 'hub-monogram' | 'split-cinema' | 'minimalist-vip';
  servicesStyle?: 'split-gallery' | 'cards-grid' | 'accordion-list';
  cardStyle?: 'glass' | 'solid-dark' | 'bordered-neon';
  showBeforeAfter?: boolean;
  showReviews?: boolean;
  showFaqs?: boolean;
  showBranches?: boolean;
  showBio?: boolean;
}

export interface BusinessConfig {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  slogan: string;
  announcement?: string;
  themeColor?: string;
  branchesCount: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'pro' | 'starter' | 'enterprise';
  createdAt?: string;
  heroImages?: string[];
  galleryImages?: string[];
  services: ServiceItem[];
  branches: BranchItem[];
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
  layout?: BusinessLayoutConfig;
}
