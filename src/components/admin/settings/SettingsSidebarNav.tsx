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
        <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="חפש הגדרה (למשל: עיצוב, מחירון, Waze, ביטול)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10 pl-3 py-2.5 bg-[#16171B] border border-white/10 focus:border-amber-400 rounded-2xl text-xs font-bold outline-none text-white placeholder-zinc-500 shadow-md transition-all"
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
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer',
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-[#16171B] text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.shortLabel}</span>
              {badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-zinc-300'
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
      <div className="hidden lg:flex flex-col gap-1 bg-[#16171B] p-2.5 rounded-3xl border border-white/10 shadow-xl">
        <div className="px-3 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-wider">
          קטגוריות ניהול והגדרות
        </div>

        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          const badge = getDynamicBadge(cat.id) || cat.badge;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectTab(cat.id)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-2xl text-right transition-all group cursor-pointer',
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0',
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-white/5 text-zinc-400 group-hover:text-amber-300 group-hover:bg-white/10'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs block truncate',
                        isActive ? 'font-black text-slate-950' : 'font-bold text-white group-hover:text-amber-300'
                      )}
                    >
                      {cat.label}
                    </span>
                    {cat.badge && (
                      <span className={cn('text-[9px] px-1.5 py-0.2 rounded-full font-black', isActive ? 'bg-slate-950 text-amber-300' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30')}>
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <p className={cn('text-[10px] truncate font-sans mt-0.5', isActive ? 'text-slate-900/80 font-bold' : 'text-zinc-400')}>
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 mr-2">
                {badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full font-mono',
                      isActive
                        ? 'bg-slate-950 text-amber-300'
                        : 'bg-white/10 text-zinc-300 group-hover:bg-amber-400/20 group-hover:text-amber-300'
                    )}
                  >
                    {badge}
                  </span>
                )}
                <ChevronLeft
                  className={cn(
                    'w-4 h-4 transition-transform',
                    isActive ? 'text-slate-950' : 'text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-[-2px]'
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
