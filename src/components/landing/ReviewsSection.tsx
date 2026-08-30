'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, CheckCircle, Sparkles } from 'lucide-react';
import { BusinessConfig } from '@/types/business';

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
    comment: 'דביר הוא פשוט אמן. הדירוג הכי מדויק ונקי שעשו לי בחיים. חוויית שירות מושלמת ומספרה ברמה הכי גבוהה בארץ!',
    rating: 5,
    timeAgo: 'לפני 3 ימים',
    serviceUsed: 'תספורת גברים VIP',
  },
  {
    name: 'מתן אברהם',
    comment: 'מגיע אליו במיוחד מרחובות כל שבועיים. תמיד בזמן, תמיד מקצועי, והזקן יוצא מפוסל ומדויק על המילימטר.',
    rating: 5,
    timeAgo: 'לפני שבוע',
    serviceUsed: 'תספורת + עיצוב זקן',
  },
  {
    name: 'איתי ברק',
    comment: 'קביעת תורים קלה ונוחה באתר, בלי להמתין דקה בתור. האווירה נעימה ומקצועית והתוצאה מעל ומעבר לציפיות.',
    rating: 5,
    timeAgo: 'לפני שבועיים',
    serviceUsed: 'סקין פייד קלאסי',
  },
];

function StarRating({ rating, color = '#C9A84C' }: { rating: number; color?: string }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`דירוג ${rating} מתוך 5 כוכבים`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-current"
          style={{ color: i < rating ? color : '#3D3D3D' }}
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
  const bizName = business?.name || 'המספרה של דביר';

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
      className="py-20 bg-[#161616] text-white overflow-hidden border-t border-white/10"
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
            className="text-3xl sm:text-4xl font-black text-white mt-1 mb-3"
          >
            {business?.layout?.sectionTitles?.reviews || 'חוויות והמלצות מאומתות'}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: themeColor }} />
          <p className="text-zinc-400 mt-4 max-w-md mx-auto text-xs sm:text-sm font-sans">
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
                className="bg-[#202020] rounded-3xl p-6 border border-white/10 shadow-xl"
              >
                <ReviewCard review={reviews[activeIndex]} color={themeColor} />
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
                  backgroundColor: i === activeIndex ? themeColor : '#3D3D3D',
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
              className="bg-[#202020] rounded-3xl p-6 border border-white/10 shadow-xl hover:border-white/20 transition-colors"
            >
              <ReviewCard review={review} color={themeColor} />
            </motion.div>
          ))}
        </div>

        {/* Overall rating card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-[#202020] rounded-3xl border border-white/10 shadow-xl max-w-lg mx-auto text-center sm:text-right"
        >
          <div className="text-center">
            <div className="text-4xl font-black mb-1" style={{ color: themeColor }}>5.0</div>
            <StarRating rating={5} color={themeColor} />
            <div className="text-[11px] text-zinc-400 mt-1">דירוג גוגל מאומת</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/10" />
          <div>
            <div className="text-base font-black text-white">100% המלצות חמות</div>
            <p className="text-xs text-zinc-400 mt-0.5 font-sans">
              מאות גברים נהנים מטיפוח שיער וזקן ברמה ללא פשרות
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewCard({ review, color }: { review: ReviewItem; color: string }) {
  return (
    <div className="text-right space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar circle */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm border"
            style={{
              backgroundColor: `${color}20`,
              borderColor: `${color}40`,
              color: color,
            }}
          >
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="font-black text-white text-sm flex items-center gap-1.5">
              <span>{review.name}</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div className="text-zinc-500 text-[11px] font-medium">{review.timeAgo}</div>
          </div>
        </div>
        <Quote className="w-5 h-5 opacity-40" style={{ color: color }} />
      </div>

      <StarRating rating={review.rating} color={color} />

      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans">
        "{review.comment}"
      </p>

      {review.serviceUsed && (
        <div className="pt-2 border-t border-white/5 flex items-center gap-1 text-[11px] text-zinc-400">
          <span>שירות שנבחר:</span>
          <strong className="text-white">{review.serviceUsed}</strong>
        </div>
      )}
    </div>
  );
}
