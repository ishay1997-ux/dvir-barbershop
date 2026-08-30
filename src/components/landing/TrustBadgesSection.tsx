'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { getThemeTokens } from '@/lib/theme-tokens';

const DEFAULT_BADGES = [
  'דירוג 5.0 כוכבים ב-Google',
  '10+ שנות ותק וניסיון מקצועי',
  'חניה חינם ובשפע במקום',
  'תשלום ב-Bit, Apple Pay ואשראי',
  'אספרסו וכיבוד פרימיום חינם',
];

export default function TrustBadgesSection({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const themeColor = business?.themeColor || '#C9A84C';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const badges = (business?.layout?.trustBadges && business.layout.trustBadges.length > 0)
    ? business.layout.trustBadges
    : DEFAULT_BADGES;

  const sectionTitle = business?.layout?.sectionTitles?.trustBadges || 'למה לקוחות בוחרים בנו שוב ושוב?';

  return (
    <section className={`py-8 relative overflow-hidden transition-colors ${t.sectionBg}`} dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold mb-1 ${t.textMuted}`}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: themeColor }} />
            <span>תווי איכות וביטחון</span>
          </div>
          <h3 className={`text-lg sm:text-xl font-black ${t.textPrimary}`}>{sectionTitle}</h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
          {badges.map((badgeText, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all hover:scale-105 ${t.cardSubtleBg} ${t.isLight ? 'bg-white shadow-sm hover:shadow-md' : 'shadow-md hover:border-white/20'}`}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: themeColor }}
              />
              <span className={`text-xs sm:text-sm font-bold ${t.textPrimary}`}>{badgeText}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
