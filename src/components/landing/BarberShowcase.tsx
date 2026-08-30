'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Scissors, Star, Award, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { getThemeTokens } from '@/lib/theme-tokens';
import { getIndustryMeta } from '@/lib/industry-terminology';
import { getIndustryAvatarUrl } from '@/lib/industry-media';

export default function BarberShowcase({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const themeColor = business?.themeColor || '#C9A84C';
  const ownerName = business?.ownerName || 'דביר';
  const bizName = business?.name || 'המספרה של דביר';
  const city = business?.city || 'ישראל';
  const experienceYears = business?.experienceYears || 5;
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const specialties = [
    'שירות ומקצועיות ללא פשרות',
    'חומרי פרימיום מובחרים',
    'התאמת סגנון אישי לכל לקוח',
    'היגיינה וסטריליזציה קפדנית',
  ];

  const meta = getIndustryMeta(business);
  const industryMeta = {
    title: meta.masterTitle,
    badge: meta.categoryKey === 'barber' ? 'המאסטר שלכם' : meta.categoryKey === 'beauty_salon' ? 'הכירו את המומחית' : meta.vipBadge,
    icon: meta.icon,
  };

  return (
    <section
      id="about"
      ref={ref}
      className={`py-20 border-y transition-colors ${t.sectionBg} ${t.borderColor}`}
      aria-labelledby="barbers-heading"
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border inline-block mb-2"
            style={{
              color: themeColor,
              borderColor: `${themeColor}40`,
              backgroundColor: `${themeColor}10`,
            }}
          >
            {industryMeta.badge}
          </span>
          <h2
            id="barbers-heading"
            className={`text-3xl sm:text-4xl font-black mt-1 mb-3 ${t.textPrimary}`}
          >
            {business?.layout?.sectionTitles?.bio || `הכירו את ${ownerName}`}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: themeColor }} />
          <p className={`mt-4 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed font-sans ${t.textSecondary}`}>
            {business?.slogan || 'שירות מקצועי, יחס אישי וסטנדרט עבודה ברמה הגבוהה ביותר בישראל.'}
          </p>
        </motion.div>

        {/* Barber Luxury Showcase Card */}
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`rounded-3xl overflow-hidden shadow-2xl text-center transition-colors ${t.cardBg}`}
            role="article"
          >
            {/* Avatar area with gradient */}
            <div
              className="relative h-48 flex items-center justify-center overflow-hidden"
              style={{
                background: t.isLight
                  ? `linear-gradient(135deg, #FAF7F2, #F3ECE1, #FAF7F2)`
                  : `linear-gradient(135deg, #1C1C1C, #2E2818, #1C1C1C)`,
              }}
            >
              {/* Industry decoration */}
              <div className={`absolute top-4 right-4 text-2xl ${t.isLight ? 'opacity-20' : 'opacity-30'}`}>
                {industryMeta.icon}
              </div>
              <div className={`absolute bottom-4 left-4 ${t.isLight ? 'text-slate-400/20' : 'text-white/10'}`}>
                <Sparkles className="w-10 h-10" />
              </div>

              {/* Barber Avatar Photo or Monogram Letter */}
              <div
                className="w-24 h-24 rounded-full border-2 flex items-center justify-center text-white text-4xl font-black shadow-2xl overflow-hidden relative"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderColor: themeColor,
                  color: themeColor,
                }}
              >
                {business?.avatarUrl || getIndustryAvatarUrl(business) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business?.avatarUrl || getIndustryAvatarUrl(business)}
                    alt={ownerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{ownerName.charAt(0)}</span>
                )}
              </div>

              {/* Color bar indicator */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: themeColor }}
              />
            </div>

            {/* Content */}
            <div className="p-6 text-right space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-black ${t.textPrimary}`}>{ownerName}</h3>
                  <span className="text-xs font-bold" style={{ color: themeColor }}>
                    {industryMeta.title}
                  </span>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    borderColor: `${themeColor}40`,
                    color: themeColor,
                  }}
                >
                  <Award className="w-3.5 h-3.5" /> מעל {experienceYears} שנות ניסיון
                </div>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed font-sans ${t.textSecondary}`}>
                ב-{bizName} כל לקוח מקבל יחס VIP מלא הכולל אבחון והתאמה אישית, סטריליזציה קפדנית, שימוש במוצרים המובילים בעולם וחוויית שירות יוקרתית.
              </p>

              {/* Specialties Pills */}
              <div>
                <span className={`block text-[11px] font-bold mb-2 ${t.textMuted}`}>התמחויות מרכזיות:</span>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((spec) => (
                    <span
                      key={spec}
                      className={`text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${t.cardSubtleBg} ${t.textPrimary}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: themeColor }} />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Badges row */}
              <div className={`grid grid-cols-3 gap-2 pt-2 border-t text-center text-xs ${t.borderColor}`}>
                <div className={`p-2.5 rounded-xl ${t.cardSubtleBg}`}>
                  <span className="block font-black text-sm" style={{ color: themeColor }}>100%</span>
                  <span className={`text-[10px] ${t.textMuted}`}>שביעות רצון</span>
                </div>
                <div className={`p-2.5 rounded-xl ${t.cardSubtleBg}`}>
                  <span className="block font-black text-sm" style={{ color: themeColor }}>סטריליות</span>
                  <span className={`text-[10px] ${t.textMuted}`}>חיטוי מלא</span>
                </div>
                <div className={`p-2.5 rounded-xl ${t.cardSubtleBg}`}>
                  <span className="block font-black text-sm text-emerald-500">24/7</span>
                  <span className={`text-[10px] ${t.textMuted}`}>זימון אונליין</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
