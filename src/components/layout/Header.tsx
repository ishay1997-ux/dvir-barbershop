'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Scissors, Lock } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import AnnouncementBanner from '@/components/common/AnnouncementBanner';

const navLinks = [
  { label: 'שירותים', href: '#services' },
  { label: 'גלריה', href: '#gallery' },
  { label: 'ביקורות', href: '#reviews' },
  { label: 'צור קשר', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) setIsMobileOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  return (
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="ניווט ראשי">
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

        {/* CTA + Admin Login + Phone */}
        <div className="hidden md:flex items-center gap-3">
          <OpenStatusBadge />
          
          <a
            href={`tel:${SHOP_INFO.phone}`}
            className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-gold transition-colors"
            aria-label={`חייג: ${SHOP_INFO.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-gold" />
            <span dir="ltr">{SHOP_INFO.phone}</span>
          </a>

          {/* Prominent Admin Login Button for Dvir */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-gold hover:text-[#1C1C1C] hover:border-gold text-gold transition-all duration-200 shadow-xs"
            id="header-admin-button"
            title="כניסת מנהל למספרה של דביר"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>כניסת מנהל</span>
          </Link>

          {/* Book Appointment CTA */}
          <Link
            href="/booking"
            className="btn-shimmer text-[#1C1C1C] font-black text-xs px-5 py-2 rounded-full shadow-gold hover:scale-105 active:scale-95 transition-all duration-300"
            id="header-cta-button"
          >
            הזמן תור עכשיו
          </Link>
        </div>

        {/* Mobile Header Actions */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold"
            title="כניסת מנהל"
          >
            <Lock className="w-3 h-3 text-gold" />
            <span>מנהל</span>
          </Link>

          <Link
            href="/booking"
            className="btn-shimmer text-[#1C1C1C] font-bold text-xs px-3 py-1 rounded-full shadow-xs"
          >
            הזמן תור
          </Link>

          <button
            className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'סגור תפריט' : 'פתח תפריט'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-5 h-5 text-gold" /> : <Menu className="w-5 h-5 text-gold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#1C1C1C] px-4 pb-5 pt-3 flex flex-col gap-2 animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <OpenStatusBadge />
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="flex items-center gap-1.5 text-xs text-white/80"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span dir="ltr">{SHOP_INFO.phone}</span>
            </a>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 px-2 text-sm font-bold text-white/90 hover:text-gold border-b border-white/5 last:border-0 transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/booking"
              className="btn-shimmer text-center text-[#1C1C1C] font-black text-sm py-3 rounded-xl shadow-gold"
              onClick={() => setIsMobileOpen(false)}
              id="mobile-cta-button"
            >
              הזמן תור אונליין ←
            </Link>

            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 text-center text-xs font-bold text-gold bg-[#2A2A2A] border border-gold/20 py-2.5 rounded-xl transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <Lock className="w-3.5 h-3.5" />
              כניסת מנהל (דביר)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
