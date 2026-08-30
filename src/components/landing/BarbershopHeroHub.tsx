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
import { createCustomerInquiryUrl } from '@/lib/whatsapp';
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
  const whatsapp = createCustomerInquiryUrl({
    ownerPhone: business?.whatsappNumber || cleanPhone,
    ownerName,
    businessName: bizName,
  });

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

  const heroStyle = business?.layout?.heroStyle || 'hub-monogram';

  // Determine dynamic Industry Info
  const industryMeta = (() => {
    const combined = `${bizName} ${business?.slogan || ''} ${business?.category || ''}`.toLowerCase();
    if (combined.includes('ציפורניים') || combined.includes('קוסמטיקה') || combined.includes('יופי') || combined.includes('שירן') || themeColor === '#EC4899' || themeColor === '#8B5CF6' || themeColor === '#A855F7') {
      return { 
        icon: '💅', 
        label: 'Beauty & Nails',
        heroImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=80',
        masterTitle: 'אמנית ציפורניים ומטפלת ראשית',
        vipBadge: 'LUXURY BEAUTY & NAILS LOUNGE',
        actionIcon: '💅',
        actionLabel: 'קביעת תור',
      };
    }
    if (combined.includes('ספא') || combined.includes('עיסוי') || combined.includes('רפואה') || combined.includes('לוטוס') || themeColor === '#14B8A6' || themeColor === '#059669') {
      return { 
        icon: '🌿', 
        label: 'Spa & Wellness',
        heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
        masterTitle: 'מטפלת מוסמכת ומנהלת ספא',
        vipBadge: 'HOLISTIC WELLNESS SPA EXPERIENCE',
        actionIcon: '🌿',
        actionLabel: 'הזמנת טיפול',
      };
    }
    if (combined.includes('קעקוע') || combined.includes('פירסינג') || themeColor === '#E2E8F0') {
      return { 
        icon: '⚡', 
        label: 'Tattoo Studio',
        heroImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1600&q=80',
        masterTitle: 'אמן קעקועים ראשי',
        vipBadge: 'CUSTOM TATTOO ART & PIERCING',
        actionIcon: '⚡',
        actionLabel: 'תיאום סשן',
      };
    }
    if (combined.includes('כושר') || combined.includes('מאמן') || combined.includes('אימונים') || themeColor === '#10B981') {
      return { 
        icon: '🏋️', 
        label: 'Fitness & Coach',
        heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
        masterTitle: 'מאמן כושר אישי בכיר',
        vipBadge: 'PRO FITNESS & BODY COACHING',
        actionIcon: '🏋️',
        actionLabel: 'תיאום אימון',
      };
    }
    if (combined.includes('קליניקה') || combined.includes('אסתטיקה') || combined.includes('טיפולי פנים') || themeColor === '#3B82F6') {
      return { 
        icon: '🩺', 
        label: 'Aesthetic Clinic',
        heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
        masterTitle: 'רופא מומחה ומנהל קליניקה',
        vipBadge: 'ADVANCED MEDICAL AESTHETIC CLINIC',
        actionIcon: '🩺',
        actionLabel: 'קביעת ייעוץ',
      };
    }
    if (combined.includes('טכנאי') || combined.includes('מנעולן') || combined.includes('תיקונים') || themeColor === '#0EA5E9') {
      return { 
        icon: '🔧', 
        label: 'Tech & Repair',
        heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
        masterTitle: 'טכנאי מוסמך וחשמלאי מורשה',
        vipBadge: 'CERTIFIED PRO HOME SERVICES',
        actionIcon: '🔧',
        actionLabel: 'הזמן שירות',
      };
    }
    return { 
      icon: '✂️', 
      label: 'Barbershop',
      heroImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80',
      masterTitle: 'מאסטר ברבר ראשי',
      vipBadge: 'VIP BARBERSHOP & GROOMING EXPERIENCE',
      actionIcon: '✂️',
      actionLabel: 'קביעת תור',
    };
  })();

  const heroBg = (business?.heroImages && business.heroImages[0]) || industryMeta.heroImage;

  return (
    <>
      {heroStyle === 'hub-monogram' && (
        <section className="relative w-full bg-[#141414] text-white pt-2 pb-8 overflow-hidden" dir="rtl">
          <div className="relative w-full h-[240px] sm:h-[300px] md:h-[340px] bg-zinc-900 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url('${heroBg}')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-black/60" />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${themeColor}25 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10 container mx-auto px-4 pt-4 flex items-center justify-between">
              <button
                onClick={handleShareClick}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="שתף מספרה"
                title="שתף קישור למספרה"
              >
                <Share2 className="w-4 h-4" style={{ color: themeColor }} />
              </button>

              <a
                href={`tel:${phone}`}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="התקשר למספרה"
                title={`חייג ל-${ownerName} (${phone})`}
              >
                <Phone className="w-4 h-4" style={{ color: themeColor }} />
              </a>
            </div>

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

          <div className="relative z-20 container mx-auto px-4 -mt-14 sm:-mt-16 flex flex-col items-center">
            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1C1C1C] p-1.5 shadow-2xl border-2 flex items-center justify-center"
              style={{ borderColor: themeColor }}
            >
              {business?.logoUrl || business?.avatarUrl ? (
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={business.logoUrl || business.avatarUrl}
                    alt={bizName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2A2A2A] to-[#141414] flex flex-col items-center justify-center border border-white/10 text-center p-1">
                  <span className="text-xl sm:text-2xl mb-0.5">{industryMeta.icon}</span>
                  <span className="font-black text-xs sm:text-sm tracking-widest text-white uppercase truncate max-w-[80px]">
                    {ownerName}
                  </span>
                  <span className="text-[8px] text-[#9E9891] tracking-wider uppercase font-semibold truncate max-w-[80px]">
                    {industryMeta.label}
                  </span>
                </div>
              )}

              <div
                className="absolute inset-0 rounded-full border animate-pulse pointer-events-none"
                style={{ borderColor: `${themeColor}40` }}
              />
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 flex-wrap" dir="rtl">
              {website ? (
                <Link
                  href={website}
                  className="w-10 h-10 rounded-full bg-[#242424] hover:bg-[#2F2F2F] border border-white/15 text-white flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="עמוד האתר"
                >
                  <Globe className="w-4 h-4 text-zinc-200" />
                </Link>
              ) : null}

              {defaultWaze ? (
                <a
                  href={defaultWaze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#33CCFF]/15 hover:bg-[#33CCFF]/25 border border-[#33CCFF]/40 text-[#33CCFF] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="נווט עם Waze"
                >
                  <WazeIcon className="w-4 h-4 text-[#33CCFF]" />
                </a>
              ) : null}

              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="וואטסאפ לבירורים וקביעת תור"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </a>
              ) : null}

              {tiktok ? (
                <a
                  href={tiktok.startsWith('http') ? tiktok : `https://tiktok.com/@${tiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="טיקטוק"
                >
                  <TikTokIcon className="w-4 h-4 text-white" />
                </a>
              ) : null}

              {instagram ? (
                <a
                  href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:from-amber-500/30 hover:via-rose-500/30 hover:to-purple-500/30 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="אינסטגרם"
                >
                  <InstagramIcon className="w-4 h-4 text-rose-400" />
                </a>
              ) : null}

              {facebook ? (
                <a
                  href={facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#1877F2] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="פייסבוק"
                >
                  <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                </a>
              ) : null}
            </div>

            <div className="mt-3.5 flex items-center justify-center">
              <OpenStatusBadge className="shadow-md bg-[#1E1E1E]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-2xl mt-5">
              <Link
                href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
                id="action-pill-book"
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs sm:text-sm text-center shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-emerald-400/30 cursor-pointer"
              >
                <span className="text-sm">{industryMeta.actionIcon}</span> {industryMeta.actionLabel}
              </Link>
              <button
                onClick={() => setIsMyAppointmentsOpen(true)}
                id="action-pill-my-appointments"
                className="py-3 px-4 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-white font-bold text-xs sm:text-sm text-center border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" style={{ color: themeColor }} /> התורים שלי
              </button>
              <button
                onClick={() => setIsHoursOpen(true)}
                id="action-pill-hours"
                className="py-3 px-4 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-white font-bold text-xs sm:text-sm text-center border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-[#33CCFF]" /> שעות פתיחה
              </button>
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
      )}

      {heroStyle === 'split-cinema' && (
        <section className="relative w-full bg-[#121214] text-white py-10 sm:py-16 overflow-hidden" dir="rtl">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
              <div className="lg:col-span-7 space-y-5 text-right">
                <div className="flex items-center gap-2">
                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-black border flex items-center gap-1.5"
                    style={{
                      borderColor: `${themeColor}50`,
                      backgroundColor: `${themeColor}15`,
                      color: themeColor,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{industryMeta.vipBadge}</span>
                  </span>
                  <OpenStatusBadge className="bg-[#1C1C1E] border border-white/10" />
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                  {bizName}
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-xl">
                  {business?.slogan || 'שירות פרימיום, יחס אישי ומקצועיות ברמה הגבוהה ביותר בישראל.'}
                </p>

                <div className="flex items-center gap-4 text-xs font-bold text-zinc-300 py-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" style={{ color: themeColor }} />
                    {business?.city || 'אריאל & רחובות'}
                  </span>
                  <span>·</span>
                  <span className="text-amber-400 font-black flex items-center gap-1">
                    ★ 5.0 (420+ ביקורות Google)
                  </span>
                </div>

                <div className="bg-[#1C1C20] rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4 max-w-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-400 block">קבע תור מהיר אונליין</span>
                      <span className="text-sm font-black text-white">בחר שירות, שעה והבטח מקום</span>
                    </div>
                    <Link
                      href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-sm">{industryMeta.actionIcon}</span> {industryMeta.actionLabel}
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => setIsMyAppointmentsOpen(true)}
                      className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" style={{ color: themeColor }} /> התורים שלי
                    </button>
                    <button
                      onClick={() => setIsHoursOpen(true)}
                      className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#33CCFF]" /> שעות פתיחה
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleShareClick}
                    className="p-2.5 rounded-xl bg-[#1C1C20] border border-white/10 hover:bg-[#25252A] text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" style={{ color: themeColor }} /> שתף
                  </button>
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="p-2.5 rounded-xl bg-[#1C1C20] border border-white/10 hover:bg-[#25252A] text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      dir="ltr"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" /> {phone}
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" /> וואטסאפ
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden border-2 shadow-2xl aspect-[4/5] bg-zinc-900 group" style={{ borderColor: `${themeColor}40` }}>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${heroBg}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-right">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-zinc-400 block">{industryMeta.masterTitle}</span>
                        <span className="text-base font-black text-white">{ownerName}</span>
                      </div>
                      <div
                        className="px-3 py-1 rounded-xl text-xs font-black border"
                        style={{
                          borderColor: `${themeColor}60`,
                          backgroundColor: `${themeColor}20`,
                          color: themeColor,
                        }}
                      >
                        10+ שנות ותק
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {heroStyle === 'minimalist-vip' && (
        <section className="relative w-full bg-[#0D0D0E] text-white py-16 sm:py-24 overflow-hidden text-center" dir="rtl">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: themeColor }}
          />

          <div className="container mx-auto px-4 relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-md"
              style={{
                borderColor: `${themeColor}50`,
                backgroundColor: `${themeColor}15`,
                color: themeColor,
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black tracking-widest uppercase">
                {industryMeta.vipBadge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-4">
              {bizName}
            </h1>

            <p className="text-base sm:text-xl text-zinc-300 font-sans max-w-2xl mx-auto mb-6 leading-relaxed">
              {business?.slogan || 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר.'}
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
              <OpenStatusBadge className="bg-[#18181B] border border-white/10" />
              <div className="px-3.5 py-1.5 rounded-full bg-[#18181B] border border-white/10 text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-sm">
                ★ 5.0 דירוג Google Reviews (420+ לקוחות מרוצים)
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
              <Link
                href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-base shadow-2xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Scissors className="w-5 h-5" /> קבע תור עכשיו
              </Link>
              <button
                onClick={() => setIsMyAppointmentsOpen(true)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#1C1C20] hover:bg-[#25252A] text-white font-bold text-sm border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" style={{ color: themeColor }} /> התורים שלי
              </button>
              <button
                onClick={() => setIsHoursOpen(true)}
                className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-[#1C1C20] hover:bg-[#25252A] text-white font-bold text-sm border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-[#33CCFF]" /> שעות פתיחה
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10 flex-wrap">
              <button
                onClick={handleShareClick}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" style={{ color: themeColor }} /> שתף
              </button>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  dir="ltr"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {phone}
                </a>
              )}
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> וואטסאפ
                </a>
              )}
              {instagram && (
                <a
                  href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <InstagramIcon className="w-3.5 h-3.5" /> אינסטגרם
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <OpeningHoursModal isOpen={isHoursOpen} onClose={() => setIsHoursOpen(false)} business={business} />
      <MyAppointmentsModal isOpen={isMyAppointmentsOpen} onClose={() => setIsMyAppointmentsOpen(false)} business={business} />
      <ShareBarbershopModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} business={business} />
    </>
  );
}
