'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Sparkles, X, ChevronLeft, Star } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/store';

const GALLERY_PHOTOS = [
  {
    id: 1,
    title: 'סקין פייד מדויק עם קו תער חד',
    category: 'דירוגים',
    src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'פיסול ויישור זקן פרימיום',
    category: 'זקנים',
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'קלאסי מודרני מעוצב בחימר מט',
    category: 'תספורת',
    src: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'קרופ צרפתי טקסטורלי',
    category: 'דירוגים',
    src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'טייפר פייד נקי ומסגרת חדה',
    category: 'פייד',
    src: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    title: 'עיצוב זקן מלא ומטופח',
    category: 'זקנים',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
];

export default function PriceListAndGallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof GALLERY_PHOTOS[0] | null>(null);

  return (
    <section id="services-and-gallery" className="py-12 sm:py-16 bg-[#181818] text-white" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-bold mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>מחירון ושירותי פרימיום</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            השירותים והעבודות של דביר
          </h2>
          <p className="text-xs sm:text-sm text-[#9E9891] mt-1.5">
            מחירים שקופים, דיוק ללא פשרות, ואווירה אישית ומקצועית
          </p>
        </div>

        {/* 2-Column Grid matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ============================================================ */}
          {/* 1. RIGHT COLUMN: PRICE LIST & SERVICES                       */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 bg-[#202020] rounded-3xl border border-white/10 p-5 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#C9A84C]" />
                <h3 className="font-black text-base sm:text-lg text-white">מחירון שירותי מספרה</h3>
              </div>
              <span className="text-xs text-zinc-400">משך זמן ומחיר</span>
            </div>

            <div className="divide-y divide-white/5 space-y-1">
              {INITIAL_SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-white/[0.02] px-2 rounded-2xl transition-colors"
                >
                  {/* Service Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-[#DFCA85] transition-colors">
                        {service.name}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 line-clamp-1">
                      {service.description}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-medium">⏱️ {service.duration} דקות</span>
                  </div>

                  {/* Price & Book Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-left font-black text-base sm:text-lg text-[#C9A84C]">
                      ₪{service.price}
                    </div>

                    <Link
                      href={`/booking?service=${service.id}`}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#C9A84C] hover:text-[#1C1C1C] text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                    >
                      הזמן <ChevronLeft className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Total CTA footer */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-400">חייל / סטודנט? מחירון מוזל בלחיצה על השירות</span>
              <Link
                href="/booking"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#DFCA85] text-[#1C1C1C] font-black text-xs hover:opacity-95 transition-opacity"
              >
                לקביעת תור מהיר ←
              </Link>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. LEFT COLUMN: HAIRCUTS GALLERY                            */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 bg-[#202020] rounded-3xl border border-white/10 p-5 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#C9A84C] fill-[#C9A84C]" />
                <h3 className="font-black text-base sm:text-lg text-white">גלריית עבודות אחרונות</h3>
              </div>
              <span className="text-xs text-zinc-400">לחץ להגדלה</span>
            </div>

            {/* 3x2 Photos Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {GALLERY_PHOTOS.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
                    <span className="text-[10px] font-bold text-white leading-tight drop-shadow-sm">
                      {photo.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <a
                href="https://instagram.com/dvir_barber"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#C9A84C] hover:underline"
              >
                צפה בעבודות נוספות באינסטגרם של דביר ←
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-lg w-full bg-[#1C1C1C] rounded-3xl overflow-hidden border border-[#C9A84C]/40 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden mb-3">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedPhoto.title}</h4>
                  <span className="text-xs text-[#C9A84C] font-semibold">{selectedPhoto.category}</span>
                </div>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
