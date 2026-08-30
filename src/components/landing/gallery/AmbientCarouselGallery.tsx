'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { getThemeTokens } from '@/lib/theme-tokens';
import { getIndustryAmbientSlides } from '@/lib/industry-media';

export default function AmbientCarouselGallery({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const themeColor = business?.themeColor || '#14B8A6';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const slides = getIndustryAmbientSlides(business);
  const current = slides[currentIdx] || slides[0];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="ambient-gallery" className={`py-12 sm:py-16 ${t.sectionBg}`} dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2.5 border"
            style={{
              backgroundColor: `${themeColor}15`,
              borderColor: `${themeColor}40`,
              color: themeColor,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
            <span>חלל הטיפולים והאווירה</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${t.textPrimary}`}>
            {business?.layout?.sectionTitles?.gallery || 'חוויית טיפול פרימיום ורגיעה'}
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 font-sans ${t.textSecondary}`}>
            הציצו בחלל המעוצב, בחדרי הטיפול ובאווירה המרגיעה שמחכה לכם
          </p>
        </div>

        <div className={`max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden text-right transition-colors ${t.cardBg}`}>
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
                i === currentIdx ? 'w-8' : 'w-2 bg-slate-400/40 hover:bg-slate-400'
              }`}
              style={i === currentIdx ? { backgroundColor: themeColor } : {}}
              aria-label={`עבור לשקופית ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
  );
}
