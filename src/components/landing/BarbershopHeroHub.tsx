'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Share2,
  Phone,
  Calendar,
  Clock,
  Heart,
  Globe,
  Navigation,
  MessageCircle,
  Scissors,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import { INITIAL_BRANCHES } from '@/lib/store';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import { OpeningHoursModal, MyAppointmentsModal, ShareBarbershopModal } from './QuickModals';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="3"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export default function BarbershopHeroHub() {
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isWazeBranchOpen, setIsWazeBranchOpen] = useState(false);

  const currentDay = new Date().getDay();
  // Ariel: Sun, Mon, Tue (0, 1, 2). Rehovot: Wed, Thu, Fri (3, 4, 5)
  const isArielToday = currentDay <= 2;
  const todayBranch = isArielToday ? INITIAL_BRANCHES[0] : INITIAL_BRANCHES[1];

  const handleShareClick = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'המספרה של דביר – אריאל & רחובות',
          text: 'המספרה של דביר – תספורות גברים פרימיום ודירוגים מדויקים. קבע תור מהיר:',
          url: window.location.origin,
        })
        .catch(() => setIsShareOpen(true));
    } else {
      setIsShareOpen(true);
    }
  };

  return (
    <>
      <section className="relative w-full bg-[#141414] text-white pt-2 pb-8 overflow-hidden" dir="rtl">
        {/* ============================================================ */}
        {/* 1. TOP HERO COVER BANNER                                     */}
        {/* ============================================================ */}
        <div className="relative w-full h-[240px] sm:h-[300px] md:h-[340px] bg-zinc-900 overflow-hidden">
          {/* Cover Background Image with Warm Ambient Lighting */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80')`,
            }}
          />
          {/* Subtle Dark + Gold Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.15)_0%,_transparent_70%)]" />

          {/* Top Header Controls (Share & Call Buttons) */}
          <div className="relative z-10 container mx-auto px-4 pt-4 flex items-center justify-between">
            {/* Share Circle Button */}
            <button
              onClick={handleShareClick}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="שתף מספרה"
              title="שתף קישור למספרה"
            >
              <Share2 className="w-4 h-4 text-[#DFCA85]" />
            </button>

            {/* Quick Phone Call Button */}
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="התקשר למספרה"
              title={`חייג לדביר (${SHOP_INFO.phone})`}
            >
              <Phone className="w-4 h-4 text-[#DFCA85]" />
            </a>
          </div>

          {/* Banner Main Title Text */}
          <div className="relative z-10 container mx-auto px-4 text-center mt-6 sm:mt-8 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md"
            >
              דביר עיצוב שיער לגברים וזקן
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-xs sm:text-sm text-[#E0E0E0] mt-1.5 font-medium flex items-center justify-center gap-2 drop-shadow-sm"
            >
              <span>מספרת בוטיק</span>
              <span>·</span>
              <a
                href={`tel:${SHOP_INFO.phone}`}
                className="hover:text-[#C9A84C] transition-colors inline-flex items-center gap-1 font-bold text-white"
              >
                📞 {SHOP_INFO.phone}
              </a>
            </motion.p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. OVERLAPPING CENTRAL MONOGRAM LOGO & SOCIAL CIRCLES       */}
        {/* ============================================================ */}
        <div className="relative z-20 container mx-auto px-4 -mt-14 sm:-mt-16 flex flex-col items-center">
          {/* Central Circular Monogram Badge */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1C1C1C] p-1.5 shadow-2xl border-2 border-[#C9A84C] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2A2A2A] to-[#141414] flex flex-col items-center justify-center border border-[#C9A84C]/40 text-center">
              <Scissors className="w-6 h-6 sm:w-7 sm:h-7 text-[#C9A84C] mb-0.5" />
              <span className="font-black text-xs sm:text-sm tracking-widest text-[#DFCA85]">DVIR</span>
              <span className="text-[9px] text-[#9E9891] tracking-wider uppercase font-semibold">Barbershop</span>
            </div>

            {/* Glowing Accent Ring */}
            <div className="absolute inset-0 rounded-full border border-[#C9A84C]/20 animate-pulse pointer-events-none" />
          </div>

          {/* Action & Social Circle Buttons Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-3.5 mt-4 flex-wrap">
            {/* Website / Home */}
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-[#242424] hover:bg-[#2F2F2F] border border-white/15 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
              title="עמוד הבית"
            >
              <Globe className="w-4 h-4 text-zinc-300" />
            </Link>

            {/* Waze Navigation Button */}
            <div className="relative">
              <button
                onClick={() => setIsWazeBranchOpen(!isWazeBranchOpen)}
                className="w-10 h-10 rounded-full bg-[#33CCFF]/15 hover:bg-[#33CCFF]/25 border border-[#33CCFF]/40 text-[#33CCFF] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
                title="נווט עם Waze"
              >
                <Navigation className="w-4 h-4 text-[#33CCFF]" />
              </button>

              {/* Waze Branch Dropdown */}
              {isWazeBranchOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#222222] border border-[#33CCFF]/30 rounded-2xl p-2 shadow-2xl z-30 min-w-[210px] space-y-1 text-right">
                  <div className="text-[11px] font-bold text-zinc-400 px-2 py-1 border-b border-white/10">
                    בחר סניף לניווט ב-Waze:
                  </div>
                  <a
                    href={INITIAL_BRANCHES[0].wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsWazeBranchOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    🚗 סניף אריאל (א׳-ג׳)
                  </a>
                  <a
                    href={INITIAL_BRANCHES[1].wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsWazeBranchOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    🚗 סניף רחובות (ד׳-ו׳)
                  </a>
                </div>
              )}
            </div>

            {/* WhatsApp Chat Button */}
            <a
              href={`https://wa.me/972521234567?text=${encodeURIComponent('היי דביר, רציתי לשאול לגבי תור במספרה')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
              title="וואטסאפ מהיר עם דביר"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </a>

            {/* Instagram Profile */}
            <a
              href={SHOP_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#E1306C]/15 hover:bg-[#E1306C]/25 border border-[#E1306C]/40 text-[#E1306C] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
              title="עמוד האינסטגרם של דביר"
            >
              <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
            </a>

            {/* Phone Call */}
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="w-10 h-10 rounded-full bg-[#C9A84C]/15 hover:bg-[#C9A84C]/25 border border-[#C9A84C]/40 text-[#C9A84C] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
              title="חיוג טלפוני לדביר"
            >
              <Phone className="w-4 h-4 text-[#C9A84C]" />
            </a>
          </div>

          {/* Live Open / Closed Status Badge */}
          <div className="mt-3.5 flex items-center justify-center">
            <OpenStatusBadge className="shadow-md bg-[#1E1E1E]" />
          </div>

          {/* ============================================================ */}
          {/* 3. 4 HIGH-CONVERSION ACTION PILL BUTTONS (Matching Reference) */}
          {/* ============================================================ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-2xl mt-5">
            {/* 1. Book Appointment (קביעת תור) */}
            <Link
              href="/booking"
              id="action-pill-book"
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs sm:text-sm text-center shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-emerald-400/30"
            >
              <Scissors className="w-4 h-4" /> קביעת תור
            </Link>

            {/* 2. My Appointments (התורים שלי) */}
            <button
              onClick={() => setIsMyAppointmentsOpen(true)}
              id="action-pill-my-appointments"
              className="py-3 px-4 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-white font-bold text-xs sm:text-sm text-center border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-[#C9A84C]" /> התורים שלי
            </button>

            {/* 3. Opening Hours (שעות פתיחה) */}
            <button
              onClick={() => setIsHoursOpen(true)}
              id="action-pill-hours"
              className="py-3 px-4 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-white font-bold text-xs sm:text-sm text-center border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-[#33CCFF]" /> שעות פתיחה
            </button>

            {/* 4. About Us (קצת עלינו) */}
            <a
              href="#about"
              id="action-pill-about"
              className="py-3 px-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-300 font-bold text-xs sm:text-sm text-center border border-emerald-500/30 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-emerald-400" /> קצת עלינו
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Modals */}
      <OpeningHoursModal isOpen={isHoursOpen} onClose={() => setIsHoursOpen(false)} />
      <MyAppointmentsModal isOpen={isMyAppointmentsOpen} onClose={() => setIsMyAppointmentsOpen(false)} />
      <ShareBarbershopModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
}
