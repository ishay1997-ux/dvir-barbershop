import { BusinessLayoutConfig } from '@/types/business';

export interface BugReport {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  category: string;
  message: string;
  businessName: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface ServiceItem {
  name: string;
  price: number;
  duration: number;
  description?: string;
  popular?: boolean;
}

export interface BranchItem {
  name: string;
  address: string;
  wazeLink?: string;
  phone?: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  slogan?: string;
  announcement?: string;
  themeColor?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  wazeUrl?: string;
  whatsappNumber?: string;
  websiteUrl?: string;
  avatarUrl?: string;
  galleryImages?: string[];
  coverImageUrl?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  bookingButtonText?: string;
  philosophyQuote?: string;
  aboutText?: string;
  layout?: BusinessLayoutConfig;
  branchesCount?: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'starter' | 'pro' | 'team' | 'enterprise';
  createdAt: string;
  branches?: BranchItem[];
  services?: ServiceItem[];
  superAdminPasscode?: string;
}
