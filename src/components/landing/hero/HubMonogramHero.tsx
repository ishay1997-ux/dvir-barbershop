'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Share2,
  Phone,
  Calendar,
  Clock,
  Heart,
  Globe,
  MessageCircle,
} from 'lucide-react';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import { getThemeTokens } from '@/lib/theme-tokens';
import {
  HeroSharedProps,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  WazeIcon,
} from './hero-types';

export function HubMonogramHero({
  business,
  themeColor,
  bizName,
  ownerName,
  phone,
  slug,
  instagram,
  facebook,
  tiktok,
  website,
  whatsapp,
  defaultWaze,
  industryMeta,
  onOpenHours,
  onOpenMyAppointments,
  onOpenShare,
}: HeroSharedProps) {
  const heroBg = (business?.heroImages && business.heroImages[0]) || industryMeta.heroImage;
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  return (
    <section className={`relative w-full transition-colors duration-500 pt-2 pb-8 overflow-hidden ${t.isLight ? 'text-slate-900' : 'text-white'}`} dir="rtl">
      <div className="relative w-full h-[240px] sm:h-[300px] md:h-[340px] bg-zinc-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('${heroBg}')`,
          }}
        />
        <div className={`absolute inset-0 ${t.isLight ? 'bg-gradient-to-t from-black/80 via-black/50 to-black/30' : 'bg-gradient-to-t from-[#141414] via-[#141414]/70 to-black/60'}`} />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${themeColor}25 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 container mx-auto px-4 pt-4 flex items-center justify-between">
          <button
            onClick={onOpenShare}
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
            className="py-3 px-4 rounded-2xl text-slate-950 font-black text-xs sm:text-sm text-center shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
            <span className="text-sm">{industryMeta.actionIcon}</span> {industryMeta.actionLabel}
          </Link>
          <button
            onClick={onOpenMyAppointments}
            id="action-pill-my-appointments"
            className={`py-3 px-4 rounded-2xl ${t.cardBg} font-bold text-xs sm:text-sm text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${t.textPrimary}`}
          >
            <Calendar className="w-4 h-4" style={{ color: themeColor }} /> התורים שלי
          </button>
          <button
            onClick={onOpenHours}
            id="action-pill-hours"
            className={`py-3 px-4 rounded-2xl ${t.cardBg} font-bold text-xs sm:text-sm text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${t.textPrimary}`}
          >
            <Clock className="w-4 h-4" style={{ color: themeColor }} /> שעות פתיחה
          </button>
          <a
            href="#about"
            id="action-pill-about"
            className={`py-3 px-4 rounded-2xl ${t.cardBg} font-bold text-xs sm:text-sm text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${t.textPrimary}`}
          >
            <Heart className="w-4 h-4" style={{ color: themeColor }} /> קצת עלינו
          </a>
        </div>
      </div>
    </section>
  );
}
