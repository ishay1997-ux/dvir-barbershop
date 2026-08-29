'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Scissors, Star, Award, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { BusinessConfig } from '@/types/business';

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

  const specialties = [
    'סקין פייד מדויק',
    'פיסול ויישור זקן בתער',
    'התאמת קווי פנים',
    'חפיפה וטיפוח VIP',
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 bg-[#1A1A1A] text-white border-y border-white/10"
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
            המאסטר שלכם
          </span>
          <h2
            id="barbers-heading"
            className="text-3xl sm:text-4xl font-black text-white mt-1 mb-3"
          >
            הכירו את {ownerName}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: themeColor }} />
          <p className="text-zinc-300 mt-4 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed font-sans">
            {business?.slogan || 'אמן תספורות ומומחה לפיידים מודרניים, פיסול זקן מדויק וחוויית שירות אישית ברמה הגבוהה ביותר.'}
          </p>
        </motion.div>

        {/* Barber Luxury Showcase Card */}
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-[#222222] rounded-3xl overflow-hidden shadow-2xl border border-white/10 text-center"
            role="article"
          >
            {/* Avatar area with gradient */}
            <div
              className="relative h-48 flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #1C1C1C, #2E2818, #1C1C1C)`,
              }}
            >
              {/* Scissors decoration */}
              <div className="absolute top-4 right-4 text-white/10">
                <Scissors className="w-12 h-12 -rotate-45" />
              </div>
              <div className="absolute bottom-4 left-4 text-white/10">
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
                {business?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.avatarUrl}
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
                  <h3 className="text-xl font-black text-white">{ownerName}</h3>
                  <span className="text-xs font-bold" style={{ color: themeColor }}>
                    מאסטר ברבר ומעצב שיער מוסמך
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
                  <Award className="w-3.5 h-3.5" /> מעל {experienceYears} שנות דיוק
                </div>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans">
                ב-{bizName} כל לקוח מקבל יחס VIP מלא הכולל אבחון סוג השיער ומבנה הפנים, סטריליזציה קפדנית, שימוש במוצרי הטיפוח המובילים בעולם וחוויית מספרה יוקרתית.
              </p>

              {/* Specialties Pills */}
              <div>
                <span className="block text-[11px] font-bold text-zinc-400 mb-2">התמחויות מרכזיות:</span>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((spec) => (
                    <span
                      key={spec}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white/5 text-zinc-200 border border-white/10 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: themeColor }} />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Badges row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                <div className="bg-[#181818] p-2.5 rounded-xl border border-white/5">
                  <span className="block font-black text-sm" style={{ color: themeColor }}>100%</span>
                  <span className="text-[10px] text-zinc-400">שביעות רצון</span>
                </div>
                <div className="bg-[#181818] p-2.5 rounded-xl border border-white/5">
                  <span className="block font-black text-sm" style={{ color: themeColor }}>סטריליות</span>
                  <span className="text-[10px] text-zinc-400">חיטוי מלא</span>
                </div>
                <div className="bg-[#181818] p-2.5 rounded-xl border border-white/5">
                  <span className="block font-black text-sm text-emerald-400">24/7</span>
                  <span className="text-[10px] text-zinc-400">זימון אונליין</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
