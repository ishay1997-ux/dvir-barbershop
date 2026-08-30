'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Scissors, Lock } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import { BusinessConfig } from '@/types/business';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import AnnouncementBanner from '@/components/common/AnnouncementBanner';
import SidebarDrawer from './SidebarDrawer';
import { getThemeTokens } from '@/lib/theme-tokens';

export default function Header({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';
  const city = business?.city || 'אריאל & רחובות';
  const slug = business?.slug || 'dvir';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const basePath = slug === 'dvir' || slug === 'thecut' ? '' : `/${slug}`;

  const navLinks = [
    { label: 'שירותים ומחירון', href: `${basePath}/#services-and-gallery` },
    { label: `אודות ${business?.ownerName || 'המספרה'}`, href: `${basePath}/#about` },
    { label: 'סניפים ודרכי הגעה', href: `${basePath}/#locations` },
    { label: 'ביקורות', href: `${basePath}/#reviews` },
    { label: 'שאלות ותשובות', href: `${basePath}/#faq` },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const industryIcon = (() => {
    const combined = `${bizName} ${business?.slogan || ''} ${business?.category || ''}`.toLowerCase();
    if (combined.includes('ציפורניים') || combined.includes('קוסמטיקה') || combined.includes('יופי') || themeColor === '#EC4899' || themeColor === '#A855F7') {
      return '💅';
    }
    if (combined.includes('ספא') || combined.includes('עיסוי') || combined.includes('רפואה') || themeColor === '#14B8A6') {
      return '🌿';
    }
    if (combined.includes('קעקוע') || combined.includes('פירסינג') || themeColor === '#E2E8F0') {
      return '⚡';
    }
    if (combined.includes('כושר') || combined.includes('מאמן') || combined.includes('אימונים') || themeColor === '#10B981') {
      return '🏋️';
    }
    if (combined.includes('קליניקה') || combined.includes('אסתטיקה') || combined.includes('טיפולי פנים') || themeColor === '#3B82F6') {
      return '🩺';
    }
    if (combined.includes('טכנאי') || combined.includes('מנעולן') || combined.includes('תיקונים') || themeColor === '#0EA5E9') {
      return '🔧';
    }
    return '✂️';
  })();

  return (
    <>
      <header className={`sticky top-0 inset-x-0 z-50 backdrop-blur-md border-b shadow-md transition-all duration-300 ${t.isLight ? 'bg-white/95 border-slate-200 text-slate-900' : 'bg-[#1C1C1C]/95 border-white/10 text-white'}`}>
        {/* Top Dynamic Announcement Banner */}
        <AnnouncementBanner business={business} />

        <div className="container mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
          {/* Right Side: Hamburger Button + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button opening Slide-out Sidebar Drawer on Right */}
            <button
              className={`p-2 rounded-xl transition-colors flex items-center justify-center border cursor-pointer ${t.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200' : 'bg-white/10 hover:bg-white/20 text-white border-white/10'}`}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="פתח תפריט צד"
              title="תפריט אפליקציה"
            >
              <Menu className="w-5 h-5" style={{ color: themeColor }} />
            </button>

            {/* Logo */}
            <Link
              href={slug === 'dvir' || slug === 'thecut' ? '/' : `/${slug}`}
              className="flex items-center gap-2.5 group"
              aria-label={`${bizName} - עמוד הבית`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg text-[#1C1C1C] overflow-hidden"
                style={{ backgroundColor: themeColor }}
              >
                {business?.logoUrl || business?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={business.logoUrl || business.avatarUrl}
                    alt={bizName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base">{industryIcon}</span>
                )}
              </div>
              <div className="leading-tight">
                <span className={`block text-base sm:text-lg font-black tracking-wider ${t.textPrimary}`}>
                  {bizName}
                </span>
                <span className={`text-[10px] ${t.textMuted}`}>{city}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="ניווט ראשי">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold transition-colors duration-200 relative group py-1 ${t.isLight ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-amber-200'}`}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: themeColor }}
                />
              </Link>
            ))}
          </nav>

          {/* Left Action Controls (Status, Admin, Book CTA) */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <OpenStatusBadge />
            </div>

            {/* Admin Login Button */}
            <Link
              href={slug ? `/admin/login?slug=${slug}` : '/admin/login'}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-200 shadow-xs ${t.isLight ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800' : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'}`}
              id="header-admin-button"
              title={`כניסת מנהל ל-${bizName}`}
            >
              <Lock className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span className="hidden sm:inline">ניהול</span>
            </Link>

            {/* Book Appointment CTA */}
            <Link
              href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
              className="text-[#1C1C1C] font-black text-xs px-4 sm:px-5 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: themeColor }}
              id="header-cta-button"
            >
              הזמן תור
            </Link>
          </div>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        business={business}
      />
    </>
  );
}
