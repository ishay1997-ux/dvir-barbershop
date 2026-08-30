'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, CheckCircle, Sparkles } from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { getThemeTokens, ThemeTokens } from '@/lib/theme-tokens';

interface ReviewItem {
  name: string;
  comment: string;
  rating: number;
  timeAgo?: string;
  serviceUsed?: string;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    name: 'רועי שחר',
    comment: 'פשוט אמן ומקצוען ברמות הגבוהות ביותר. התוצאה הכי מדויקת ונקייה שקיבלתי בחיים. חוויית שירות מושלמת!',
    rating: 5,
    timeAgo: 'לפני 3 ימים',
    serviceUsed: 'שירות פרימיום VIP',
  },
  {
    name: 'מתן אברהם',
    comment: 'מגיע אליו במיוחד מרחוק כל שבועיים. תמיד בזמן, תמיד מקצועי, והתוצאה מדויקת על המילימטר.',
    rating: 5,
    timeAgo: 'לפני שבוע',
    serviceUsed: 'טיפול מקיף משולב',
  },
  {
    name: 'איתי ברק',
    comment: 'קביעת תורים קלה ונוחה באתר, בלי להמתין דקה בתור. האווירה נעימה ומקצועית והתוצאה מעל ומעבר לציפיות.',
    rating: 5,
    timeAgo: 'לפני שבועיים',
    serviceUsed: 'שירות מקצועי מומלץ',
  },
];

function StarRating({ rating, color = '#C9A84C', isLight = false }: { rating: number; color?: string; isLight?: boolean }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`דירוג ${rating} מתוך 5 כוכבים`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-current"
          style={{ color: i < rating ? color : (isLight ? '#CBD5E1' : '#3D3D3D') }}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'העסק';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const reviews: ReviewItem[] = business?.testimonials && business.testimonials.length > 0
    ? business.testimonials
    : DEFAULT_REVIEWS;

  // Auto-advance for mobile
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  return (
    <section
      id="reviews"
      ref={ref}
      className={`py-20 overflow-hidden border-t transition-colors ${t.sectionBg} ${t.borderColor}`}
      aria-labelledby="reviews-heading"
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
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-3"
            style={{
              borderColor: `${themeColor}40`,
              backgroundColor: `${themeColor}15`,
              color: themeColor,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-black tracking-widest uppercase">
              מה אומרים הלקוחות
            </span>
          </div>
          <h2
            id="reviews-heading"
            className={`text-3xl sm:text-4xl font-black mt-1 mb-3 ${t.textPrimary}`}
          >
            {business?.layout?.sectionTitles?.reviews || 'חוויות והמלצות מאומתות'}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: themeColor }} />
          <p className={`mt-4 max-w-md mx-auto text-xs sm:text-sm font-sans ${t.textSecondary}`}>
            שביעות רצון מלאה ודירוגי 5.0 כוכבים מלקוחות {bizName}
          </p>
        </motion.div>

        {/* Mobile: single-card carousel */}
        <div
          className="md:hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={`rounded-3xl p-6 shadow-xl ${t.cardBg}`}
              >
                <ReviewCard review={reviews[activeIndex]} color={themeColor} t={t} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); setIsPaused(true); }}
                className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === activeIndex ? '24px' : '8px',
                  backgroundColor: i === activeIndex ? themeColor : (t.isLight ? '#CBD5E1' : '#3D3D3D'),
                }}
                aria-label={`עבור לביקורת ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 3-Column Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-3xl p-6 shadow-xl transition-all ${t.cardBg}`}
            >
              <ReviewCard review={review} color={themeColor} t={t} />
            </motion.div>
          ))}
        </div>

        {/* Overall rating card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-3xl shadow-xl max-w-lg mx-auto text-center sm:text-right ${t.cardBg}`}
        >
          <div className="text-center">
            <div className="text-4xl font-black mb-1" style={{ color: themeColor }}>5.0</div>
            <StarRating rating={5} color={themeColor} isLight={t.isLight} />
            <div className={`text-[11px] mt-1 ${t.textMuted}`}>דירוג גוגל מאומת</div>
          </div>
          <div className={`hidden sm:block w-px h-12 ${t.borderColor} border-r`} />
          <div>
            <div className={`text-base font-black ${t.textPrimary}`}>100% המלצות חמות</div>
            <p className={`text-xs mt-0.5 font-sans ${t.textSecondary}`}>
              מאות לקוחות נהנים מחוויית שירות אישית ברמה ללא פשרות
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewCard({ review, color, t }: { review: ReviewItem; color: string; t: ThemeTokens }) {
  return (
    <div className="text-right space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar circle */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border"
            style={{
              backgroundColor: `${color}20`,
              borderColor: `${color}40`,
              color: color,
            }}
          >
            {review.name.charAt(0)}
          </div>
          <div>
            <div className={`font-black text-sm flex items-center gap-1.5 ${t.textPrimary}`}>
              <span>{review.name}</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
            </div>
            <div className={`text-[11px] font-medium ${t.textMuted}`}>{review.timeAgo}</div>
          </div>
        </div>
        <Quote className="w-5 h-5 opacity-40" style={{ color: color }} />
      </div>

      <StarRating rating={review.rating} color={color} isLight={t.isLight} />

      <p className={`text-xs sm:text-sm leading-relaxed font-sans ${t.textSecondary}`}>
        "{review.comment}"
      </p>

      {review.serviceUsed && (
        <div className={`pt-2 border-t flex items-center gap-1 text-[11px] ${t.borderColor} ${t.textMuted}`}>
          <span>שירות שנבחר:</span>
          <strong className={t.textPrimary}>{review.serviceUsed}</strong>
        </div>
      )}
    </div>
  );
}
