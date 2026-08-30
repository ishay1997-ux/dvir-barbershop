'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { BusinessConfig } from '@/types/business';

const AMBIENT_SLIDES = [
  {
    id: 1,
    title: 'חדרי טיפול פרטיים ואווירת שלווה מוחלטת',
    description: 'חללים מרווחים, מוזיקה מרגיעה ותאורה עמומה לשחרור מוחלט של הגוף והנפש.',
    src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
    tag: 'אווירת ספא פרימיום',
  },
  {
    id: 2,
    title: 'שמנים ארומטיים טבעיים ועיסוי רקמות',
    description: 'תמציות צמחים אורגניות המעניקות לעור לחות עשירה ומשחררות עומסי שרירים.',
    src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
    tag: 'חומרים 100% טבעיים',
  },
  {
    id: 3,
    title: 'טיפולי אסתטיקה וחידוש מרקם העור',
    description: 'מכשור מתקדם וחומרי מילוי רפואיים להשגת תוצאות טבעיות ומדויקות.',
    src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    tag: 'רפואה ואסתטיקה',
  },
];

export default function AmbientCarouselGallery({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const themeColor = business?.themeColor || '#14B8A6';

  const slides = AMBIENT_SLIDES;
  const current = slides[currentIdx];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#1A1A1E] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl overflow-hidden text-right">
      <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden mb-5">
        <Image
          src={current.src}
          alt={current.title}
          fill
          className="object-cover transition-all duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full text-slate-950 inline-block w-fit mb-2 shadow-xs"
            style={{ backgroundColor: themeColor }}
          >
            {current.tag}
          </span>
          <h3 className="text-lg sm:text-2xl font-black text-white mb-1 drop-shadow-md">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl drop-shadow-sm font-sans">
            {current.description}
          </p>
        </div>

        {/* Carousel Arrows */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer"
            aria-label="הקודם"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer"
            aria-label="הבא"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIdx(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === currentIdx ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            style={{ backgroundColor: i === currentIdx ? themeColor : undefined }}
          />
        ))}
      </div>
    </div>
  );
}
