'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, MapPin, Star, ChevronDown } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';

const stats = [
  { value: '4.9★', label: 'דירוג גוגל' },
  { value: '15+', label: 'שנות ניסיון' },
  { value: '3,000+', label: 'לקוחות מרוצים' },
  { value: '3', label: 'ספרים מקצועיים' },
];

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className="relative min-h-[calc(100vh-70px)] flex flex-col items-center justify-center overflow-hidden bg-[#1C1C1C] py-14 sm:py-20"
      aria-label="עמוד הבית הראשי"
    >
      {/* Background texture + gradient */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 75% 70%, rgba(201,168,76,0.08) 0%, transparent 50%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(201,168,76,0.015) 40px,
              rgba(201,168,76,0.015) 41px
            )
          `,
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-[#C9A84C]/10 animate-spin-slow" />
      <div className="absolute bottom-32 right-8 w-48 h-48 rounded-full border border-[#C9A84C]/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-gold opacity-60 animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-gold opacity-40 animate-float delay-300" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center">

        {/* Pre-title badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 shadow-xs">
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="text-gold text-xs font-bold tracking-wider">המספרה של דביר · אריאל & רחובות</span>
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-4 tracking-tight"
        >
          ה
          <span className="text-gradient-gold font-display italic"> סטייל</span>
          <br />
          <span className="text-white">שלך מתחיל</span>
          <br />
          <span className="text-gradient-gold">אצל דביר</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[#9E9891] text-base sm:text-lg max-w-lg mt-4 mb-8 leading-relaxed"
        >
          תספורות גברים פרימיום, דירוגי סקין פייד מדויקים ופיסול זקן בתער.
          <br />
          <span className="text-gold font-bold">באוניברסיטת אריאל (א׳-ג׳) וברחובות (ד׳-ו׳)</span> – שריין תור ב-30 שניות.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center mb-16"
        >
          <Link
            href="/booking"
            id="hero-cta-book"
            className="btn-shimmer text-[#1C1C1C] font-black text-base sm:text-lg px-8 py-4 rounded-full shadow-gold hover:scale-105 active:scale-95 transition-all duration-200 min-w-[200px] text-center"
          >
            🪒 הזמן תור עכשיו
          </Link>
          <a
            href="#contact"
            id="hero-cta-waze"
            className="flex items-center gap-2 text-white font-medium text-base px-8 py-4 rounded-full border border-white/20 hover:border-gold hover:text-gold hover:bg-white/5 active:scale-95 transition-all duration-200"
          >
            <MapPin className="w-4 h-4 text-gold" />
            סניפי אריאל ורחובות
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-8 sm:gap-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-gradient-gold">{stat.value}</div>
              <div className="text-xs text-[#9E9891] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Quick call */}
        <motion.a
          href={`tel:${SHOP_INFO.phone}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-2 text-[#9E9891] text-sm hover:text-gold transition-colors group"
          aria-label="התקשר אלינו"
        >
          <div className="w-8 h-8 rounded-full border border-[#3D3D3D] group-hover:border-gold flex items-center justify-center transition-colors animate-pulse-gold">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span dir="ltr">{SHOP_INFO.phone}</span>
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#6B6560]"
      >
        <span className="text-xs tracking-widest">גלול מטה</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  );
}
