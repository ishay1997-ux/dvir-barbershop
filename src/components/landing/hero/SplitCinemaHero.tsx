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
  const heroBg = (business?.heroImages && business.heroImages[0]) || industryMeta.heroImage;

  return (
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
                {business?.city || 'ישראל'}
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
                  onClick={onOpenMyAppointments}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" style={{ color: themeColor }} /> התורים שלי
                </button>
                <button
                  onClick={onOpenHours}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-[#33CCFF]" /> שעות פתיחה
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onOpenShare}
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
  );
}
