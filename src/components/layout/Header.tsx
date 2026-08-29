'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Scissors, Lock } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import { BusinessConfig } from '@/types/business';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import AnnouncementBanner from '@/components/common/AnnouncementBanner';
import SidebarDrawer from './SidebarDrawer';

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

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50 bg-[#1C1C1C]/95 backdrop-blur-md border-b border-white/10 shadow-md transition-all duration-300">
        {/* Top Dynamic Announcement Banner */}
        <AnnouncementBanner business={business} />

        <div className="container mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link
            href={slug === 'dvir' || slug === 'thecut' ? '/' : `/${slug}`}
            className="flex items-center gap-2.5 group"
            aria-label={`${bizName} - עמוד הבית`}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg text-[#1C1C1C]"
              style={{ backgroundColor: themeColor }}
            >
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div className="leading-tight">
              <span className="block text-base sm:text-lg font-black tracking-wider text-white">
                {bizName}
              </span>
              <span className="text-[10px] text-[#9E9891]">{city}</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="ניווט ראשי">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold text-white/80 hover:text-amber-200 transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span
                  className="absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: themeColor }}
                />
              </Link>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <OpenStatusBadge />
            </div>

            {/* Admin Login Button */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all duration-200 shadow-xs"
              id="header-admin-button"
              title="כניסת מנהל למספרה"
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

            {/* Hamburger Button opening Slide-out Sidebar Drawer */}
            <button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center border border-white/10 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="פתח תפריט צד"
              title="תפריט אפליקציה"
            >
              <Menu className="w-5 h-5" style={{ color: themeColor }} />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
