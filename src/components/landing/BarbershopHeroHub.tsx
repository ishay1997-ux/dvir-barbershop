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
import { BusinessConfig } from '@/types/business';
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

export default function BarbershopHeroHub({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isWazeBranchOpen, setIsWazeBranchOpen] = useState(false);

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'דביר עיצוב שיער לגברים וזקן';
  const ownerName = business?.ownerName || 'דביר';
  const phone = business?.phone || SHOP_INFO.phone;
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '972');
  const slug = business?.slug || 'dvir';
  const instagram = business?.instagramHandle
    ? (business.instagramHandle.startsWith('http') ? business.instagramHandle : `https://instagram.com/${business.instagramHandle.replace('@', '')}`)
    : SHOP_INFO.instagram;

  const branches = business?.branches && business.branches.length > 0
    ? business.branches
    : INITIAL_BRANCHES.map((b) => ({
        name: b.name,
        address: b.address,
        wazeLink: b.wazeUrl,
        phone: b.phone,
      }));

  const handleShareClick = () => {
    const shareUrl = typeof window !== 'undefined'
      ? (slug === 'dvir' || slug === 'thecut' ? window.location.origin : `${window.location.origin}/${slug}`)
      : `https://thecut-reg-in.vercel.app/${slug}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: bizName,
          text: `${bizName} – ${business?.slogan || 'תספורות פרימיום ודירוגים מדויקים'}. קבע תור מהיר:`,
          url: shareUrl,
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
          {/* Subtle Dark + Brand Theme Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-black/60" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${themeColor}25 0%, transparent 70%)`,
            }}
          />

          {/* Top Header Controls (Share & Call Buttons) */}
          <div className="relative z-10 container mx-auto px-4 pt-4 flex items-center justify-between">
            {/* Share Circle Button */}
            <button
              onClick={handleShareClick}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="שתף מספרה"
              title="שתף קישור למספרה"
            >
              <Share2 className="w-4 h-4" style={{ color: themeColor }} />
            </button>

            {/* Quick Phone Call Button */}
            <a
              href={`tel:${phone}`}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="התקשר למספרה"
              title={`חייג ל-${ownerName} (${phone})`}
            >
              <Phone className="w-4 h-4" style={{ color: themeColor }} />
            </a>
          </div>

          {/* Banner Main Title Text */}
          <div className="relative z-10 container mx-auto px-4 text-center mt-6 sm:mt-8 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md"
            >
              {bizName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-xs sm:text-sm text-[#E0E0E0] mt-1.5 font-medium flex items-center justify-center gap-2 drop-shadow-sm"
            >
              <span>מספרת בוטיק</span>
              <span>·</span>
              <span>{business?.city || 'אריאל & רחובות'}</span>
              <span>·</span>
              <a
                href={`tel:${phone}`}
                className="hover:underline transition-colors inline-flex items-center gap-1 font-bold text-white"
                style={{ color: themeColor }}
                dir="ltr"
              >
                📞 {phone}
              </a>
            </motion.p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. OVERLAPPING CENTRAL MONOGRAM LOGO & SOCIAL CIRCLES       */}
        {/* ============================================================ */}
        <div className="relative z-20 container mx-auto px-4 -mt-14 sm:-mt-16 flex flex-col items-center">
          {/* Central Circular Monogram Badge */}
          <div
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1C1C1C] p-1.5 shadow-2xl border-2 flex items-center justify-center"
            style={{ borderColor: themeColor }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2A2A2A] to-[#141414] flex flex-col items-center justify-center border border-white/10 text-center">
              <Scissors className="w-6 h-6 sm:w-7 sm:h-7 mb-0.5" style={{ color: themeColor }} />
              <span className="font-black text-xs sm:text-sm tracking-widest text-white uppercase truncate max-w-[80px]">
                {ownerName}
              </span>
              <span className="text-[9px] text-[#9E9891] tracking-wider uppercase font-semibold">
                Barbershop
              </span>
            </div>

            {/* Glowing Accent Ring */}
            <div
              className="absolute inset-0 rounded-full border animate-pulse pointer-events-none"
              style={{ borderColor: `${themeColor}40` }}
            />
          </div>

          {/* Action & Social Circle Buttons Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-3.5 mt-4 flex-wrap">
            {/* Website / Home */}
            <Link
              href={slug === 'dvir' || slug === 'thecut' ? '/' : `/${slug}`}
              className="w-10 h-10 rounded-full bg-[#242424] hover:bg-[#2F2F2F] border border-white/15 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="עמוד הבית"
            >
              <Globe className="w-4 h-4 text-zinc-300" />
            </Link>

            {/* Waze Navigation Button */}
            <div className="relative">
              <button
                onClick={() => setIsWazeBranchOpen(!isWazeBranchOpen)}
                className="w-10 h-10 rounded-full bg-[#33CCFF]/15 hover:bg-[#33CCFF]/25 border border-[#33CCFF]/40 text-[#33CCFF] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                title="נווט עם Waze"
              >
                <Navigation className="w-4 h-4 text-[#33CCFF]" />
              </button>

              {/* Waze Branch Dropdown */}
              {isWazeBranchOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#222222] border border-[#33CCFF]/30 rounded-2xl p-2 shadow-2xl z-30 min-w-[220px] space-y-1 text-right">
                  <div className="text-[11px] font-bold text-zinc-400 px-2 py-1 border-b border-white/10">
                    בחר סניף לניווט ב-Waze:
                  </div>
                  {branches.map((b, idx) => (
                    <a
                      key={idx}
                      href={b.wazeLink || `https://waze.com/ul?q=${encodeURIComponent(b.address || b.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsWazeBranchOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      🚗 {b.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp Chat Button */}
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${ownerName}, רציתי לשאול לגבי תור ב-${bizName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title={`וואטסאפ מהיר עם ${ownerName}`}
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </a>

            {/* Instagram Profile */}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#E1306C]/15 hover:bg-[#E1306C]/25 border border-[#E1306C]/40 text-[#E1306C] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title={`עמוד האינסטגרם של ${ownerName}`}
            >
              <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
            </a>

            {/* Phone Call */}
            <a
              href={`tel:${phone}`}
              className="w-10 h-10 rounded-full border flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`,
                color: themeColor,
              }}
              title={`חיוג טלפוני ל-${ownerName}`}
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Live Open / Closed Status Badge */}
          <div className="mt-3.5 flex items-center justify-center">
            <OpenStatusBadge className="shadow-md bg-[#1E1E1E]" />
          </div>

          {/* ============================================================ */}
          {/* 3. 4 HIGH-CONVERSION ACTION PILL BUTTONS                     */}
          {/* ============================================================ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-2xl mt-5">
            {/* 1. Book Appointment (קביעת תור) */}
            <Link
              href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
              id="action-pill-book"
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs sm:text-sm text-center shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-emerald-400/30 cursor-pointer"
            >
              <Scissors className="w-4 h-4" /> קביעת תור
            </Link>

            {/* 2. My Appointments (התורים שלי) */}
            <button
              onClick={() => setIsMyAppointmentsOpen(true)}
              id="action-pill-my-appointments"
              className="py-3 px-4 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-white font-bold text-xs sm:text-sm text-center border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" style={{ color: themeColor }} /> התורים שלי
            </button>

            {/* 3. Opening Hours (שעות פתיחה) */}
            <button
              onClick={() => setIsHoursOpen(true)}
              id="action-pill-hours"
              className="py-3 px-4 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-white font-bold text-xs sm:text-sm text-center border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#33CCFF]" /> שעות פתיחה
            </button>

            {/* 4. About Us (קצת עלינו) */}
            <a
              href="#about"
              id="action-pill-about"
              className="py-3 px-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-300 font-bold text-xs sm:text-sm text-center border border-emerald-500/30 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-emerald-400" /> קצת עלינו
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Modals */}
      <OpeningHoursModal isOpen={isHoursOpen} onClose={() => setIsHoursOpen(false)} business={business} />
      <MyAppointmentsModal isOpen={isMyAppointmentsOpen} onClose={() => setIsMyAppointmentsOpen(false)} business={business} />
      <ShareBarbershopModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} business={business} />
    </>
  );
}
