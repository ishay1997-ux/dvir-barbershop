'use client';

import React from 'react';
import Link from 'next/link';
import {
  Share2,
  Phone,
  Calendar,
  Clock,
  MessageCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import { HeroSharedProps } from './hero-types';
import { getThemeTokens } from '@/lib/theme-tokens';
import { getIndustryHeroImage } from '@/lib/industry-media';

export function SplitCinemaHero({
  business,
  themeColor,
  bizName,
  ownerName,
  phone,
  slug,
  whatsapp,
  industryMeta,
  onOpenHours,
  onOpenMyAppointments,
  onOpenShare,
}: HeroSharedProps) {
  const heroBg = (business?.heroImages && business.heroImages[0]) || getIndustryHeroImage(business);
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  return (
    <section className={`relative w-full transition-colors duration-500 py-10 sm:py-16 overflow-hidden ${t.isLight ? 'text-slate-900' : 'text-white'}`} dir="rtl">
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
              <OpenStatusBadge className={t.cardSubtleBg} />
            </div>

            <h1 className={`text-3xl sm:text-5xl font-black leading-tight ${t.textPrimary}`}>
              {bizName}
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed font-sans max-w-xl ${t.textSecondary}`}>
              {business?.slogan || 'שירות פרימיום, יחס אישי ומקצועיות ברמה הגבוהה ביותר בישראל.'}
            </p>

            <div className="flex items-center gap-4 text-xs font-bold text-zinc-300 py-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" style={{ color: themeColor }} />
                {business?.city || 'ישראל'}
              </span>
              <span>·</span>
              <span className="text-amber-400 font-black flex items-center gap-1">
                ★ 5.0 (420+ ביקורות Google)
              </span>
            </div>

            <div className={`${t.cardBg} rounded-3xl p-5 shadow-2xl space-y-4 max-w-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-xs font-bold block ${t.textMuted}`}>קבע תור מהיר אונליין</span>
                  <span className={`text-sm font-black ${t.textPrimary}`}>בחר שירות, שעה והבטח מקום</span>
                </div>
                <Link
                  href={`/${slug}/booking`}
                  className="px-6 py-3 rounded-2xl text-slate-950 font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
                  style={{ backgroundColor: themeColor }}
                >
                  <span className="text-sm">{industryMeta.actionIcon}</span> {industryMeta.actionLabel}
                </Link>
              </div>

              <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${t.borderColor}`}>
                <button
                  onClick={onOpenMyAppointments}
                  className={`py-2 px-3 rounded-xl ${t.buttonSecondaryBg} text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                >
                  <Calendar className="w-3.5 h-3.5" style={{ color: themeColor }} /> התורים שלי
                </button>
                <button
                  onClick={onOpenHours}
                  className={`py-2 px-3 rounded-xl ${t.buttonSecondaryBg} text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                >
                  <Clock className="w-3.5 h-3.5" style={{ color: themeColor }} /> שעות פתיחה
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onOpenShare}
                className={`p-2.5 rounded-xl ${t.cardBg} text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${t.textPrimary}`}
              >
                <Share2 className="w-4 h-4" style={{ color: themeColor }} /> שתף
              </button>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className={`p-2.5 rounded-xl ${t.cardBg} text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${t.textPrimary}`}
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
  );
}
