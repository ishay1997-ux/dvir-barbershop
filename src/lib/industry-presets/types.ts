import { BusinessConfig, ServiceItem, FaqItem } from '@/types/business';
import { TransformationItem } from '@/lib/types';

export interface IndustryPreset {
  id: string;
  name: string;
  categoryName: string;
  icon: string;
  badge: string;
  description: string;
  themeColor: string;
  bgTheme: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon' | 'lavender-mist' | 'botanical-sage';
  heroStyle: 'hub-monogram' | 'split-cinema' | 'minimalist-vip';
  servicesStyle: 'split-gallery' | 'cards-grid' | 'compact-menu';
  galleryStyle: 'before-after-slider' | 'instagram-masonry' | 'ambient-carousel';
  showBeforeAfter?: boolean;
  showBio?: boolean;
  showBranches?: boolean;
  borderRadius: 'modern-rounded' | 'sharp-luxury' | 'classic-soft';
  cardRadius?: 'sharp' | 'smooth' | 'pill';
  fontStyle: 'modern-sans' | 'urban-bold' | 'luxury-serif';
  typographyMood?: 'modern-clean' | 'luxury-serif' | 'urban-bold';
  heroImages?: string[];
  galleryImages?: string[];
  avatarUrl?: string;
  shopName: string;
  ownerName: string;
  slogan: string;
  announcement: string;
  trustBadges: string[];
  services: ServiceItem[];
  faqs: FaqItem[];
  transformations?: TransformationItem[];
  sectionsOrder?: any[];
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
  policies: {
    cancellationNotice: string;
    arrivalTime: string;
    paymentMethods: string;
    customNote: string;
  };
}
