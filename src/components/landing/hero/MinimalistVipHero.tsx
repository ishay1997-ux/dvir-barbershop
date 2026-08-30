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
  return (
    <section className="relative w-full bg-[#0D0D0E] text-white py-16 sm:py-24 overflow-hidden text-center" dir="rtl">
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
            onClick={onOpenMyAppointments}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#1C1C20] hover:bg-[#25252A] text-white font-bold text-sm border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" style={{ color: themeColor }} /> התורים שלי
          </button>
          <button
            onClick={onOpenHours}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-[#1C1C20] hover:bg-[#25252A] text-white font-bold text-sm border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4 text-[#33CCFF]" /> שעות פתיחה
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
