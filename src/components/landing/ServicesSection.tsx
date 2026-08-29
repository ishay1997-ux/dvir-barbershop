'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, type Variants, AnimatePresence } from 'framer-motion';
import { Clock, Scissors } from 'lucide-react';
import { MOCK_SERVICES, formatPrice, formatDuration, cn } from '@/lib/utils';
import type { ServiceCategory } from '@/lib/types';

const categoryLabels: Record<ServiceCategory, string> = {
  haircut:   'תספורת',
  beard:     'זקן',
  color:     'צביעה',
  treatment: 'טיפוח',
};

const categoryColors: Record<ServiceCategory, string> = {
  haircut:   'bg-amber-50 text-amber-700 border-amber-200',
  beard:     'bg-stone-100 text-stone-600 border-stone-200',
  color:     'bg-yellow-50 text-yellow-700 border-yellow-200',
  treatment: 'bg-orange-50 text-orange-600 border-orange-200',
};

const filterTabs: { id: 'all' | ServiceCategory; label: string }[] = [
  { id: 'all', label: 'כל השירותים' },
  { id: 'haircut', label: 'תספורות' },
  { id: 'beard', label: 'עיצוב זקן' },
  { id: 'color', label: 'צביעה' },
  { id: 'treatment', label: 'טיפוח וספא' },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: 'easeOut' },
  }),
};

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState<'all' | ServiceCategory>('all');

  const filteredServices = activeCategory === 'all'
    ? MOCK_SERVICES
    : MOCK_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section
      id="services"
      ref={ref}
      className="py-24 bg-[#FAF7F2]"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">מה אנחנו מציעים</span>
          <h2
            id="services-heading"
            className="text-4xl sm:text-5xl font-black text-[#1C1C1C] mt-2 mb-4"
          >
            השירותים שלנו
          </h2>
          <div className="gold-divider" />
          <p className="text-[#6B6560] mt-4 max-w-md mx-auto text-base">
            כל שירות מבוצע עם מוצרים איכותיים ומיומנות מקצועית. המחירים כוללים שמפו וסידור.
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 active:scale-95 ${
                  isActive
                    ? 'text-[#1C1C1C]'
                    : 'text-[#6B6560] hover:text-[#1C1C1C] bg-white/70 hover:bg-white border border-[#E5DDD0]'
                }`}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-gold rounded-full shadow-md -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.id}
                layout
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  href="/booking"
                  className="card-hover group bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] border border-[#F0EBE1] hover:border-[#C9A84C]/50 relative overflow-hidden block transition-all duration-200 active:scale-[0.98] h-full flex flex-col justify-between"
                  aria-label={`הזמן שירות: ${service.name}`}
                >
                  {/* Gold accent line on hover */}
                  <div className="absolute top-0 right-0 w-0 h-1 gradient-gold group-hover:w-full transition-all duration-500 rounded-t-2xl" />

                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl transition-transform group-hover:scale-110 duration-200">{service.icon}</div>
                      <span
                        className={cn(
                          'text-xs font-semibold px-2.5 py-1 rounded-full border',
                          categoryColors[service.category]
                        )}
                      >
                        {categoryLabels[service.category]}
                      </span>
                    </div>

                    {/* Name & description */}
                    <h3 className="text-lg font-bold text-[#1C1C1C] mb-1 group-hover:text-gold transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-[#6B6560] leading-relaxed mb-5">
                      {service.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE1] mt-auto">
                    <div className="flex items-center gap-1.5 text-[#6B6560] text-sm">
                      <Clock className="w-4 h-4 text-[#C9A84C]" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                    <div className="text-xl font-black text-[#1C1C1C] group-hover:text-gold transition-colors">
                      {formatPrice(service.price)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link
            href="/booking"
            id="services-cta-button"
            className="btn-shimmer inline-flex items-center gap-2 text-[#1C1C1C] font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-md"
          >
            <Scissors className="w-4 h-4 -rotate-45" />
            הזמן תור עכשיו
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
