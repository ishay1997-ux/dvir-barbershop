import React from 'react';
import { BusinessConfig } from '@/types/business';

export interface HeroSharedProps {
  business?: Partial<BusinessConfig>;
  themeColor: string;
  bizName: string;
  ownerName: string;
  phone: string;
  cleanPhone: string;
  slug: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  website: string;
  whatsapp: string;
  defaultWaze: string;
  branches: Array<{ name: string; address?: string; wazeLink?: string; phone?: string }>;
  industryMeta: {
    icon: string;
    label: string;
    heroImage: string;
    masterTitle: string;
    vipBadge: string;
    actionIcon: string;
    actionLabel: string;
  };
  onOpenHours: () => void;
  onOpenMyAppointments: () => void;
  onOpenShare: () => void;
  onOpenWaze: () => void;
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="3"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

export function WazeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.468 11.235c-.092-4.928-4.103-8.895-9.06-8.895-5.006 0-9.07 4.048-9.07 9.041 0 2.213.794 4.244 2.115 5.823L2.27 19.38a.747.747 0 0 0 .918.918l2.25-.795c1.47.886 3.19 1.4 5.034 1.4 5.006 0 9.07-4.048 9.07-9.041 0-.214-.008-.426-.024-.636l.044.009zm-13.62 1.257a1.503 1.503 0 1 1 0-3.006 1.503 1.503 0 0 1 0 3.006zm5.28 0a1.503 1.503 0 1 1 0-3.006 1.503 1.503 0 0 1 0 3.006zm-2.64 4.542c-2.02 0-3.72-1.37-4.22-3.23a.75.75 0 0 1 1.45-.4c.32 1.19 1.41 2.08 2.77 2.08s2.45-.89 2.77-2.08a.75.75 0 1 1 1.45.4c-.5 1.86-2.2 3.23-4.22 3.23z"/>
    </svg>
  );
}
