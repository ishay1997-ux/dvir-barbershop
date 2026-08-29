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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

function WazeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.468 11.235c-.092-4.928-4.103-8.895-9.06-8.895-5.006 0-9.07 4.048-9.07 9.041 0 2.213.794 4.244 2.115 5.823L2.27 19.38a.747.747 0 0 0 .918.918l2.25-.795c1.47.886 3.19 1.4 5.034 1.4 5.006 0 9.07-4.048 9.07-9.041 0-.214-.008-.426-.024-.636l.044.009zm-13.62 1.257a1.503 1.503 0 1 1 0-3.006 1.503 1.503 0 0 1 0 3.006zm5.28 0a1.503 1.503 0 1 1 0-3.006 1.503 1.503 0 0 1 0 3.006zm-2.64 4.542c-2.02 0-3.72-1.37-4.22-3.23a.75.75 0 0 1 1.45-.4c.32 1.19 1.41 2.08 2.77 2.08s2.45-.89 2.77-2.08a.75.75 0 1 1 1.45.4c-.5 1.86-2.2 3.23-4.22 3.23z"/>
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

  // Social & Web Links (Active vs Disabled)
  const instagram = business?.instagramUrl || (business?.instagramHandle
    ? (business.instagramHandle.startsWith('http') ? business.instagramHandle : `https://instagram.com/${business.instagramHandle.replace('@', '')}`)
    : (slug === 'dvir' ? SHOP_INFO.instagram : ''));

  const facebook = business?.facebookUrl || '';
  const tiktok = business?.tiktokUrl || '';
  const website = business?.websiteUrl || (slug === 'dvir' || slug === 'thecut' ? '/' : `/${slug}`);
  const whatsapp = business?.whatsappNumber
    ? `https://wa.me/${business.whatsappNumber.replace(/\D/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(`היי ${ownerName}, רציתי לשאול לגבי תור ב-${bizName}`)}`
    : `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${ownerName}, רציתי לשאול לגבי תור ב-${bizName}`)}`;

  const defaultWaze = business?.wazeUrl || (business?.branches && business.branches[0]?.wazeLink) || '';

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
              <span>{business?.city || 'ישראל'}</span>
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
        {/* 2. OVERLAPPING CENTRAL MONOGRAM LOGO & 6 SOCIAL CIRCLES     */}
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

          {/* Action & Social Circle Buttons Bar (RTL Order: Website, Waze, WhatsApp, TikTok, Instagram, Facebook) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 flex-wrap" dir="rtl">
            {/* 1. Website / Home (🌐) */}
            {website ? (
              <Link
                href={website}
                className="w-10 h-10 rounded-full bg-[#242424] hover:bg-[#2F2F2F] border border-white/15 text-white flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="עמוד האתר"
              >
                <Globe className="w-4 h-4 text-zinc-200" />
              </Link>
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-600 flex items-center justify-center opacity-40 cursor-not-allowed"
                title="לא הוגדר קישור לאתר"
              >
                <Globe className="w-4 h-4 text-zinc-600" />
              </div>
            )}

            {/* 2. Waze Navigation (🚗) */}
            {branches.length > 1 ? (
              <div className="relative">
                <button
                  onClick={() => setIsWazeBranchOpen(!isWazeBranchOpen)}
                  className="w-10 h-10 rounded-full bg-[#33CCFF]/15 hover:bg-[#33CCFF]/25 border border-[#33CCFF]/40 text-[#33CCFF] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="נווט עם Waze"
                >
                  <WazeIcon className="w-4 h-4 text-[#33CCFF]" />
                </button>

                {isWazeBranchOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-[#222222] border border-[#33CCFF]/30 rounded-2xl p-2 shadow-2xl z-30 min-w-[220px] space-y-1 text-right">
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
            ) : defaultWaze || branches[0]?.wazeLink ? (
              <a
                href={defaultWaze || branches[0]?.wazeLink || `https://waze.com/ul?q=${encodeURIComponent(business?.city || bizName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#33CCFF]/15 hover:bg-[#33CCFF]/25 border border-[#33CCFF]/40 text-[#33CCFF] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="נווט עם Waze"
              >
                <WazeIcon className="w-4 h-4 text-[#33CCFF]" />
              </a>
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-600 flex items-center justify-center opacity-40 cursor-not-allowed"
                title="לא הוגדר קישור ל-Waze"
              >
                <WazeIcon className="w-4 h-4 text-zinc-600" />
              </div>
            )}

            {/* 3. WhatsApp Chat (💬) */}
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title={`וואטסאפ מהיר עם ${ownerName}`}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </a>
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-600 flex items-center justify-center opacity-40 cursor-not-allowed"
                title="לא הוגדר מספר וואטסאפ"
              >
                <MessageCircle className="w-4 h-4 text-zinc-600" />
              </div>
            )}

            {/* 4. TikTok Profile (🎵) */}
            {tiktok ? (
              <a
                href={tiktok.startsWith('http') ? tiktok : `https://tiktok.com/@${tiktok.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title={`עמוד הטיקטוק של ${ownerName}`}
              >
                <TikTokIcon className="w-4 h-4 text-white" />
              </a>
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-600 flex items-center justify-center opacity-40 cursor-not-allowed"
                title="לא הוגדר קישור לטיקטוק"
              >
                <TikTokIcon className="w-4 h-4 text-zinc-600" />
              </div>
            )}

            {/* 5. Instagram Profile (📸) */}
            {instagram ? (
              <a
                href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#E1306C]/15 hover:bg-[#E1306C]/25 border border-[#E1306C]/40 text-[#E1306C] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title={`עמוד האינסטגרם של ${ownerName}`}
              >
                <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
              </a>
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-600 flex items-center justify-center opacity-40 cursor-not-allowed"
                title="לא הוגדר קישור לאינסטגרם"
              >
                <InstagramIcon className="w-4 h-4 text-zinc-600" />
              </div>
            )}

            {/* 6. Facebook Profile (👤) */}
            {facebook ? (
              <a
                href={facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#1877F2] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title={`עמוד הפייסבוק של ${ownerName}`}
              >
                <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
              </a>
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-600 flex items-center justify-center opacity-40 cursor-not-allowed"
                title="לא הוגדר קישור לפייסבוק"
              >
                <FacebookIcon className="w-4 h-4 text-zinc-600" />
              </div>
            )}
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
