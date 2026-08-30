'use client';

import React from 'react';
import {
  Calendar,
  Scissors,
  Palette,
  Image as ImageIcon,
  MessageSquareQuote,
  MapPin,
  Megaphone,
  Users,
  ShieldCheck,
  Search,
  Sparkles,
  ChevronLeft,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SettingsTabId =
  | 'schedule'
  | 'services'
  | 'design'
  | 'media'
  | 'content'
  | 'branches'
  | 'marketing'
  | 'staff'
  | 'billing'
  | 'security';

export interface SettingsCategory {
  id: SettingsTabId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  group: 'operations' | 'branding' | 'communication' | 'system';
}

export const SETTINGS_CATEGORIES: SettingsCategory[] = [
  // 1. Operations Group
  {
    id: 'schedule',
    label: 'יומן, שעות ושיבוץ',
    shortLabel: 'שיבוץ ושעות',
    description: 'שיבוץ יומי דינמי, שעות פתיחה, חופשות והפסקות',
    icon: Calendar,
    group: 'operations',
  },
  {
    id: 'services',
    label: 'מחירון ושירותים',
    shortLabel: 'מחירון',
    description: 'ניהול תפריט טיפולים, תמחור, זמנים וקטגוריות',
    icon: Scissors,
    group: 'operations',
  },
  {
    id: 'staff',
    label: 'ניהול צוות וספרים',
    shortLabel: 'צוות וספרים',
    description: 'דביר, ספרים נוספים, התמחויות ושיוך לסניפים',
    icon: Users,
    group: 'operations',
  },

  // 2. Branding & Design Group
  {
    id: 'design',
    label: 'סטודיו עיצוב ומראה האתר',
    shortLabel: 'סטודיו עיצוב',
    description: 'ערכות נושא, צבעי מיתוג, סגנונות והפעלת סקשנים',
    icon: Palette,
    badge: 'Design',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    group: 'branding',
  },
  {
    id: 'media',
    label: 'מדיה, תמונות וגלריה',
    shortLabel: 'מדיה וגלריה',
    description: 'לוגו, באנר קאבר, גלריית תספורות וסליידר לפני/אחרי',
    icon: ImageIcon,
    group: 'branding',
  },

  // 3. Content & Communication Group
  {
    id: 'content',
    label: 'תוכן, שאלות נפוצות וביקורות',
    shortLabel: 'תוכן וביקורות',
    description: 'עריכת שאלות נפוצות (FAQ), המלצות לקוחות ואודות',
    icon: MessageSquareQuote,
    group: 'communication',
  },
  {
    id: 'branches',
    label: 'סניפים ורשתות חברתיות',
    shortLabel: 'סניפים ומדיה',
    description: 'אריאל & רחובות, קישורי Waze/Maps, אינסטגרם ווואטסאפ',
    icon: MapPin,
    group: 'communication',
  },
  {
    id: 'marketing',
    label: 'שיווק, באנר והודעות',
    shortLabel: 'שיווק והודעות',
    description: 'באנר הודעה עליונה, הודעות וואטסאפ ושימור לקוחות',
    icon: Megaphone,
    group: 'communication',
  },

  // 4. System & Security Group
  {
    id: 'billing',
    label: 'מנוי, חיובים ושדרוג',
    shortLabel: 'מנוי ותשלומים',
    description: 'מסלול פעיל (Starter/Pro/Team), חשבוניות מס ושדרוג',
    icon: CreditCard,
    badge: 'SaaS',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
    group: 'system',
  },
  {
    id: 'security',
    label: 'חוקי תורים ואבטחה',
    shortLabel: 'חוקים ואבטחה',
    description: 'חלון הזמנה מראש, זמני חיץ, סיסמת מנהל ואיפוס',
    icon: ShieldCheck,
    group: 'system',
  },
];

interface SettingsSidebarNavProps {
  activeTab: SettingsTabId;
  onSelectTab: (tabId: SettingsTabId) => void;
  badgeCounts?: {
    servicesCount?: number;
    branchesCount?: number;
    barbersCount?: number;
    faqsCount?: number;
    reviewsCount?: number;
    hasActiveBanner?: boolean;
  };
}

export default function SettingsSidebarNav({
  activeTab,
  onSelectTab,
  badgeCounts,
}: SettingsSidebarNavProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCategories = SETTINGS_CATEGORIES.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      cat.label.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.shortLabel.toLowerCase().includes(q)
    );
  });

  const getDynamicBadge = (catId: SettingsTabId) => {
    switch (catId) {
      case 'services':
        return badgeCounts?.servicesCount ? `${badgeCounts.servicesCount}` : undefined;
      case 'branches':
        return badgeCounts?.branchesCount ? `${badgeCounts.branchesCount}` : undefined;
      case 'staff':
        return badgeCounts?.barbersCount ? `${badgeCounts.barbersCount}` : undefined;
      case 'marketing':
        return badgeCounts?.hasActiveBanner ? 'פעיל' : undefined;
      default:
        return undefined;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search Input for Settings */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#9E9891] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="חפש הגדרה (למשל: עיצוב, מחירון, Waze, ביטול)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-9 pl-3 py-2.5 bg-white border border-[#E5DDD0] focus:border-gold rounded-2xl text-xs font-bold outline-none text-[#1C1C1C] placeholder-[#9E9891] shadow-2xs transition-all"
        />
      </div>

      {/* Mobile Horizontal Pill Scroller */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          const badge = getDynamicBadge(cat.id) || cat.badge;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectTab(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0',
                isActive
                  ? 'bg-gold text-[#1C1C1C] shadow-md font-black'
                  : 'bg-white text-[#6B6560] border border-[#E5DDD0] hover:border-gold hover:text-[#1C1C1C]'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.shortLabel}</span>
              {badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                    isActive ? 'bg-[#1C1C1C] text-gold' : 'bg-zinc-100 text-zinc-600'
                  )}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Categorized Menu */}
      <div className="hidden lg:flex flex-col gap-1 bg-white p-2.5 rounded-3xl border border-[#E5DDD0] shadow-sm">
        <div className="px-3 py-2 text-[10px] font-black text-[#9E9891] uppercase tracking-wider">
          קטגוריות ניהול והגדרות
        </div>

        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          const dynamicBadge = getDynamicBadge(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectTab(cat.id)}
              className={cn(
                'group flex items-center justify-between p-3 rounded-2xl transition-all text-right w-full relative',
                isActive
                  ? 'bg-gradient-to-r from-amber-500/15 to-gold/10 text-[#1C1C1C] border border-gold/40 shadow-xs'
                  : 'text-[#6B6560] hover:bg-[#FAF7F2] hover:text-[#1C1C1C]'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center transition-transform flex-shrink-0',
                    isActive
                      ? 'bg-gold text-[#1C1C1C] shadow-gold scale-105'
                      : 'bg-[#FAF7F2] text-[#6B6560] group-hover:text-gold group-hover:bg-gold/10'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs block truncate',
                        isActive ? 'font-black text-[#1C1C1C]' : 'font-bold'
                      )}
                    >
                      {cat.label}
                    </span>
                    {cat.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black bg-gold/20 text-[#856514] border border-gold/40">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9E9891] truncate font-normal mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 mr-2">
                {dynamicBadge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full font-mono',
                      isActive
                        ? 'bg-gold text-[#1C1C1C]'
                        : 'bg-zinc-100 text-zinc-600 group-hover:bg-gold/20'
                    )}
                  >
                    {dynamicBadge}
                  </span>
                )}
                <ChevronLeft
                  className={cn(
                    'w-4 h-4 transition-transform',
                    isActive ? 'text-gold translate-x-0.5' : 'text-[#9E9891] opacity-0 group-hover:opacity-100'
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
