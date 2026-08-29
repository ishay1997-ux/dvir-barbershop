'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Scissors, Star, Award, Sparkles, MapPin } from 'lucide-react';
import { useShopStore } from '@/lib/store';

const avatarGradients = [
  'from-amber-700 via-amber-600 to-yellow-500',
  'from-stone-600 via-stone-500 to-stone-400',
  'from-amber-900 via-amber-700 to-amber-500',
];

export default function BarberShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { barbers } = useShopStore();
  const activeBarbers = barbers.filter((b) => b.is_active);

  return (
    <section
      id="barbers"
      ref={ref}
      className="py-24 bg-[#F0EBE1]"
      aria-labelledby="barbers-heading"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">הספר שלכם</span>
          <h2
            id="barbers-heading"
            className="text-4xl sm:text-5xl font-black text-[#1C1C1C] mt-2 mb-4"
          >
            הכירו את דביר
          </h2>
          <div className="gold-divider" />
          <p className="text-[#6B6560] mt-4 max-w-md mx-auto text-base">
            אמן תספורות ומומחה לפיידים מודרניים, פיסול זקן מדויק וחוויית שירות אישית ברמה הגבוהה ביותר.
          </p>
        </motion.div>

        {/* Barber Cards */}
        <div className={`grid gap-8 mx-auto ${activeBarbers.length === 1 ? 'max-w-lg' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl'}`}>
          {activeBarbers.map((barber, i) => (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="card-hover group bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-card)] border border-[#E5DDD0] text-center"
              role="article"
              aria-label={`הספר ${barber.name}`}
            >
              {/* Avatar area */}
              <div className={`relative h-48 bg-gradient-to-br ${avatarGradients[i]}`}>
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 9px)',
                  }}
                />
                {/* Scissors decoration */}
                <div className="absolute top-4 left-4 text-white/20">
                  <Scissors className="w-8 h-8 -rotate-45" />
                </div>
                {/* Big avatar letter */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white text-4xl font-black">
                    {barber.name[0]}
                  </div>
                </div>
                {/* Color bar indicator */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: barber.color }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-black text-[#1C1C1C] mb-1 group-hover:text-gold transition-colors">
                  {barber.name}
                </h3>
                <p className="text-[#6B6560] text-sm mb-4 leading-relaxed">{barber.bio}</p>

                {/* Specialties */}
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                  {barber.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="text-xs px-2.5 py-1 rounded-full bg-[#F0EBE1] text-[#6B6560] border border-[#E5DDD0]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1.5 mb-5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-gold fill-gold" />
                  ))}
                  <span className="text-xs text-[#9E9891] font-semibold">5.0</span>
                </div>

                <Link
                  href={`/booking?barber=${barber.id}`}
                  className="btn-shimmer block text-[#1C1C1C] font-bold text-sm py-2.5 px-5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                  id={`barber-book-${barber.id}`}
                >
                  הזמן עם {barber.name.split(' ')[0]}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
