import { useShopStore } from '@/lib/store';
import { Megaphone } from 'lucide-react';
import { BusinessConfig } from '@/types/business';

export default function AnnouncementBanner({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const { settings, isLoaded } = useShopStore();

  const announcementText = business?.announcement !== undefined
    ? business.announcement
    : (isLoaded && settings.announcementBanner?.isActive ? settings.announcementBanner.text : '');

  if (!announcementText || !announcementText.trim()) {
    return null;
  }

  const themeColor = business?.themeColor || '#C9A84C';

  return (
    <div
      className="text-[#1C1C1C] py-2.5 px-4 text-center font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 relative z-50 animate-fadeIn"
      style={{
        background: `linear-gradient(to right, ${themeColor}, #F3E5AB, ${themeColor})`,
      }}
    >
      <Megaphone className="w-4 h-4 shrink-0 animate-bounce" />
      <span>{announcementText}</span>
    </div>
  );
}
