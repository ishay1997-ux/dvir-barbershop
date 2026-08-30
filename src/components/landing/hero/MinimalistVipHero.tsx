'use client';

import React from 'react';
import Link from 'next/link';
import {
  Share2,
  Phone,
  Calendar,
  Clock,
  MessageCircle,
  Scissors,
  Sparkles,
} from 'lucide-react';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import { HeroSharedProps, InstagramIcon } from './hero-types';
import { getThemeTokens } from '@/lib/theme-tokens';

export function MinimalistVipHero({
  business,
  themeColor,
  bizName,
  phone,
  slug,
  instagram,
  whatsapp,
  industryMeta,
  onOpenHours,
  onOpenMyAppointments,
  onOpenShare,
}: HeroSharedProps) {
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  return (
    <section className={`relative w-full transition-colors duration-500 py-16 sm:py-24 overflow-hidden text-center ${t.isLight ? 'text-slate-900' : 'text-white'}`} dir="rtl">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: themeColor }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-md"
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

        <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4 ${t.textPrimary}`}>
          {bizName}
        </h1>

        <p className={`text-base sm:text-xl font-sans max-w-2xl mx-auto mb-6 leading-relaxed ${t.textSecondary}`}>
          {business?.slogan || 'שירות פרימיום, יחס אישי ומקצועיות ברמה הגבוהה ביותר בישראל.'}
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
          <OpenStatusBadge className={t.cardSubtleBg} />
          <div className={`px-3.5 py-1.5 rounded-full ${t.cardSubtleBg} text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-sm`}>
            ★ 5.0 דירוג Google Reviews (420+ לקוחות מרוצים)
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
          <Link
            href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-slate-950 font-black text-base shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20"
            style={{ backgroundColor: themeColor }}
          >
            <span className="text-lg">{industryMeta.actionIcon}</span> {industryMeta.actionLabel}
          </Link>
          <button
            onClick={onOpenMyAppointments}
            className={`w-full sm:w-auto px-6 py-4 rounded-2xl ${t.buttonSecondaryBg} font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer`}
          >
            <Calendar className="w-4 h-4" style={{ color: themeColor }} /> התורים שלי
          </button>
          <button
            onClick={onOpenHours}
            className={`w-full sm:w-auto px-5 py-4 rounded-2xl ${t.buttonSecondaryBg} font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer`}
          >
            <Clock className="w-4 h-4" style={{ color: themeColor }} /> שעות פתיחה
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10 flex-wrap">
          <button
            onClick={onOpenShare}
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
  );
}
