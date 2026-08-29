'use client';

import { useShopStore } from '@/lib/store';
import { Megaphone } from 'lucide-react';

export default function AnnouncementBanner() {
  const { settings, isLoaded } = useShopStore();

  if (!isLoaded || !settings.announcementBanner || !settings.announcementBanner.isActive || !settings.announcementBanner.text) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-600 via-gold to-amber-500 text-[#1C1C1C] py-2.5 px-4 text-center font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 relative z-50 animate-fadeIn">
      <Megaphone className="w-4 h-4 flex-shrink-0 animate-bounce" />
      <span>{settings.announcementBanner.text}</span>
    </div>
  );
}
