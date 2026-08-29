'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Scissors, Lock } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';

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
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
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
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="המספרה של דביר - עמוד הבית"
        >
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
            <Scissors className="w-5 h-5 text-[#1C1C1C] -rotate-45" />
          </div>
          <div className="leading-tight">
            <span className={`block text-[1.1rem] font-black tracking-wider transition-colors duration-300 ${
              isScrolled ? 'text-[#1C1C1C]' : 'text-white'
            }`}>
              המספרה של <span className="text-gold">דביר</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="ניווט ראשי">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 relative group ${
                isScrolled
                  ? 'text-[#3D3D3D] hover:text-gold'
                  : 'text-white/90 hover:text-gold'
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* CTA + Admin Login + Phone */}
        <div className="hidden md:flex items-center gap-3">
          <OpenStatusBadge className={isScrolled ? '!bg-[#F0EBE1] !border-[#E5DDD0] !text-[#1C1C1C]' : ''} />
          
          <a
            href={`tel:${SHOP_INFO.phone}`}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              isScrolled
                ? 'text-[#6B6560] hover:text-gold'
                : 'text-white/80 hover:text-gold'
            }`}
            aria-label={`חייג: ${SHOP_INFO.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-gold" />
            <span dir="ltr">{SHOP_INFO.phone}</span>
          </a>

          {/* Prominent Admin Login Button for Dvir */}
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border transition-all duration-200 ${
              isScrolled
                ? 'bg-[#1C1C1C] text-gold border-[#1C1C1C] hover:bg-black'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-gold backdrop-blur-xs'
            }`}
            id="header-admin-button"
            title="כניסת מנהל למספרה של דביר"
          >
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>כניסת מנהל</span>
          </Link>

          {/* Book Appointment CTA */}
          <Link
            href="/booking"
            className="btn-shimmer text-[#1C1C1C] font-bold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
            id="header-cta-button"
          >
            הזמן תור
          </Link>
        </div>

        {/* Mobile Header Actions */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/admin"
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
              isScrolled
                ? 'bg-[#1C1C1C] text-gold border-[#1C1C1C]'
                : 'bg-white/15 text-white border-white/20'
            }`}
            title="כניסת מנהל"
          >
            <Lock className="w-3 h-3 text-gold" />
            <span>מנהל</span>
          </Link>

          <button
            className={`p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'text-[#1C1C1C] hover:bg-[#F0EBE1]'
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'סגור תפריט' : 'פתח תפריט'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass border-t border-[#E5DDD0] px-4 pb-4 pt-2 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-3 px-2 text-base font-medium text-[#2A2A2A] hover:text-gold border-b border-[#E5DDD0] last:border-0 transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E5DDD0] font-medium text-[#3D3D3D]"
            >
              <Phone className="w-4 h-4" />
              {SHOP_INFO.phone}
            </a>
            <Link
              href="/booking"
              className="btn-shimmer text-center text-[#1C1C1C] font-bold py-3 rounded-xl"
              onClick={() => setIsMobileOpen(false)}
              id="mobile-cta-button"
            >
              הזמן תור עכשיו
            </Link>

            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 text-center text-xs font-bold text-gold bg-[#1C1C1C] py-2.5 rounded-xl transition-colors mt-1 shadow-xs"
              onClick={() => setIsMobileOpen(false)}
            >
              <Lock className="w-3.5 h-3.5" />
              כניסת מנהל (דביר)
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
