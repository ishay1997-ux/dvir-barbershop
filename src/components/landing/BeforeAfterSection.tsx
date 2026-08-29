'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, MoveHorizontal, Scissors } from 'lucide-react';
import Link from 'next/link';

interface Transformation {
  id: string;
  title: string;
  category: string;
  description: string;
  beforeGradient: string;
  afterGradient: string;
  barber: string;
}

const transformations: Transformation[] = [
  {
    id: '1',
    title: 'סקין פייד קלאסי ועיצוב קווי מתאר',
    category: 'תספורת פרימיום',
    description: 'מעבר משיער פרוע לפייד מדויק עם קווי מתאר חדים וטקסטורה עליונה.',
    beforeGradient: 'from-stone-800 via-stone-700 to-zinc-900',
    afterGradient: 'from-amber-900 via-amber-800 to-yellow-700',
    barber: 'יוסי כהן',
  },
  {
    id: '2',
    title: 'פיסול זקן מלא + דירוג לחיים',
    category: 'עיצוב זקן',
    description: 'יישור סימטרי מדויק של קו הלחיים והצוואר, שמן הזנה ועיצוב עם תער חם.',
    beforeGradient: 'from-zinc-900 via-neutral-800 to-stone-800',
    afterGradient: 'from-amber-950 via-amber-900 to-amber-700',
    barber: 'דניאל לוי',
  },
  {
    id: '3',
    title: 'פרנץ\' קרופ מודרני וטקסטורה עשירה',
    category: 'סגנון מודרני',
    description: 'מראה צעיר, רענן וקל לעיצוב יומיומי עם חימר מט פרימיום.',
    beforeGradient: 'from-neutral-800 via-zinc-700 to-stone-900',
    afterGradient: 'from-yellow-950 via-amber-800 to-yellow-600',
    barber: 'אבי מזרחי',
  },
];

export default function BeforeAfterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeItem, setActiveItem] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = transformations[activeItem];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    // RTL: left in DOM is right in RTL visually
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <section
      id="transformations"
      ref={ref}
      className="py-24 bg-[#1C1C1C] text-white relative overflow-hidden"
      aria-labelledby="transformations-heading"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-bold tracking-widest uppercase">
              מהפך ושינוי סגנון
            </span>
          </div>
          <h2
            id="transformations-heading"
            className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4"
          >
            לפני ואחרי
          </h2>
          <div className="gold-divider" />
          <p className="text-[#9E9891] mt-4 max-w-md mx-auto text-sm sm:text-base">
            גרור את הסליידר כדי לראות את ההבדל והתוצאה המקצועית של הצוות שלנו.
          </p>
        </motion.div>

        {/* Tab selector for transformations */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10 max-w-2xl mx-auto">
          {transformations.map((t, index) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveItem(index);
                setSliderPosition(50);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                activeItem === index
                  ? 'bg-gold text-[#1C1C1C] border-gold shadow-md'
                  : 'bg-[#2A2A2A] text-[#9E9891] border-[#3D3D3D] hover:border-gold/40 hover:text-white'
              }`}
            >
              {t.title.split(' ')[0]} {t.title.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Interactive Split Comparison Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-[#2A2A2A] border border-[#3D3D3D] rounded-3xl p-4 sm:p-6 shadow-2xl"
        >
          <div
            ref={containerRef}
            onMouseDown={() => (isDragging.current = true)}
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none touch-none border border-[#3D3D3D]"
            aria-label="סליידר השוואת לפני ואחרי"
          >
            {/* AFTER Layer (Full Background) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${current.afterGradient} flex items-center justify-center p-8 text-center`}
            >
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold mb-3 shadow-gold">
                  <Scissors className="w-8 h-8 -rotate-45" />
                </div>
                <span className="text-gold font-display italic text-2xl sm:text-3xl font-black">
                  אחרי
                </span>
                <span className="text-white text-xs sm:text-sm font-semibold mt-1 max-w-xs">
                  גימור מדויק, דירוג נקי וסטיילינג פרימיום
                </span>
              </div>

              {/* After label badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-gold/40 text-gold text-xs font-bold">
                אחרי הטיפול ✨
              </div>
            </div>

            {/* BEFORE Layer (Clipped Foreground) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${current.beforeGradient} flex items-center justify-center p-8 text-center`}
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 mb-3">
                  <span className="text-2xl font-black">✂</span>
                </div>
                <span className="text-white/80 font-display text-2xl sm:text-3xl font-black">
                  לפני
                </span>
                <span className="text-white/60 text-xs sm:text-sm mt-1 max-w-xs">
                  שיער לא מעוצב וקווי מתאר מטושטשים
                </span>
              </div>

              {/* Before label badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white/80 text-xs font-bold">
                לפני הטיפול
              </div>
            </div>

            {/* Split Divider Line & Draggable Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gold shadow-[0_0_15px_rgba(201,168,76,0.8)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gold border-2 border-white text-[#1C1C1C] flex items-center justify-center shadow-2xl">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Details & CTA below slider */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#3D3D3D]">
            <div>
              <div className="text-xs text-gold font-bold">{current.category} · בוצע ע"י {current.barber}</div>
              <h3 className="text-lg font-black text-white mt-0.5">{current.title}</h3>
              <p className="text-[#9E9891] text-xs sm:text-sm mt-1">{current.description}</p>
            </div>

            <Link
              href="/booking"
              className="btn-shimmer text-[#1C1C1C] font-bold text-xs sm:text-sm px-6 py-3 rounded-full flex-shrink-0 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              רוצה תוצאה כזאת? הזמן תור ←
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
