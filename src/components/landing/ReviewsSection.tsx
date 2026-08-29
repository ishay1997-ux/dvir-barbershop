'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/utils';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`דירוג ${rating} מתוך 5 כוכבים`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold fill-gold' : 'text-[#E5DDD0]'}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOCK_REVIEWS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id="reviews"
      ref={ref}
      className="py-24 bg-[#F0EBE1] overflow-hidden"
      aria-labelledby="reviews-heading"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">מה אומרים עלינו</span>
          <h2
            id="reviews-heading"
            className="text-4xl sm:text-5xl font-black text-[#1C1C1C] mt-2 mb-4"
          >
            ביקורות לקוחות
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Mobile: single-card carousel */}
        <div
          className="lg:hidden relative"
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
                className="bg-white rounded-2xl p-7 shadow-[var(--shadow-card)] border border-[#E5DDD0]"
              >
                <ReviewCard review={MOCK_REVIEWS[activeIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {MOCK_REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); setIsPaused(true); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-gold w-6' : 'bg-[#D5CBB8]'}`}
                aria-label={`עבור לביקורת ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: masonry grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-7 shadow-[var(--shadow-card)] border border-[#E5DDD0] card-hover ${i === 1 ? 'lg:mt-6' : ''}`}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>

        {/* Overall rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-white rounded-2xl border border-[#E5DDD0] shadow-sm max-w-lg mx-auto"
        >
          <div className="text-center">
            <div className="text-5xl font-black text-gold">4.9</div>
            <StarRating rating={5} />
            <div className="text-xs text-[#6B6560] mt-1">דירוג גוגל</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-[#E5DDD0]" />
          <div className="text-center sm:text-right">
            <div className="text-2xl font-bold text-[#1C1C1C]">200+ ביקורות</div>
            <p className="text-sm text-[#6B6560] mt-1 max-w-[200px]">
              לקוחות מרוצים ממליצים עלינו ברשת
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: (typeof MOCK_REVIEWS)[0] }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base bg-gradient-to-br from-amber-700 to-amber-500 flex-shrink-0"
            aria-hidden="true"
          >
            {review.author[0]}
          </div>
          <div>
            <div className="font-bold text-[#1C1C1C] text-sm">{review.author}</div>
            <div className="text-[#9E9891] text-xs">{review.date}</div>
          </div>
        </div>
        <Quote className="w-6 h-6 text-gold opacity-40" aria-hidden="true" />
      </div>
      <StarRating rating={review.rating} />
      <p className="text-[#3D3D3D] text-sm leading-relaxed mt-3">{review.text}</p>
    </div>
  );
}
