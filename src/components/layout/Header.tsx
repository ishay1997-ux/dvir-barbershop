'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Scissors, Lock } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import AnnouncementBanner from '@/components/common/AnnouncementBanner';
import SidebarDrawer from './SidebarDrawer';

const navLinks = [
  { label: 'שירותים ומחירון', href: '#services-and-gallery' },
  { label: 'אודות דביר', href: '#about' },
  { label: 'סניפים ודרכי הגעה', href: '#locations' },
  { label: 'ביקורות', href: '#reviews' },
  { label: 'שאלות ותשובות', href: '#faq' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50 bg-[#1C1C1C]/95 backdrop-blur-md border-b border-white/10 shadow-md transition-all duration-300">
        {/* Top Dynamic Announcement Banner */}
        <AnnouncementBanner />

        <div className="container mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="המספרה של דביר - עמוד הבית"
          >
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center transition-transform group-hover:scale-110 shadow-gold">
              <Scissors className="w-5 h-5 text-[#1C1C1C] -rotate-45" />
            </div>
            <div className="leading-tight">
              <span className="block text-base sm:text-lg font-black tracking-wider text-white">
                המספרה של <span className="text-gold">דביר</span>
              </span>
              <span className="text-[10px] text-[#9E9891]">אריאל & רחובות</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="ניווט ראשי">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-bold text-white/80 hover:text-gold transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <OpenStatusBadge />
            </div>

            {/* Admin Login Button for Dvir */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-gold hover:text-[#1C1C1C] hover:border-gold text-gold transition-all duration-200 shadow-xs"
              id="header-admin-button"
              title="כניסת מנהל למספרה של דביר"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">כניסת מנהל</span>
              <span className="sm:hidden">מנהל</span>
            </Link>

            {/* Book Appointment CTA */}
            <Link
              href="/booking"
              className="btn-shimmer text-[#1C1C1C] font-black text-xs px-4 sm:px-5 py-2 rounded-full shadow-gold hover:scale-105 active:scale-95 transition-all duration-300"
              id="header-cta-button"
            >
              הזמן תור
            </Link>

            {/* Hamburger Button opening Slide-out Sidebar Drawer */}
            <button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center border border-white/10"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="פתח תפריט צד"
              title="תפריט אפליקציה"
            >
              <Menu className="w-5 h-5 text-gold" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
