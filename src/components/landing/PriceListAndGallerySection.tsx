'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Sparkles, X, ChevronLeft, Star } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/store';
import { BusinessConfig } from '@/types/business';
import { formatPrice } from '@/lib/utils';

const DEFAULT_GALLERY_PHOTOS = [
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

export default function PriceListAndGallerySection({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof DEFAULT_GALLERY_PHOTOS[0] | null>(null);

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'דביר';
  const slug = business?.slug || 'dvir';

  const services = business?.services && business.services.length > 0
    ? business.services
    : INITIAL_SERVICES.map((s) => ({
        name: s.name,
        price: s.price,
        duration: s.duration,
        description: s.description,
        popular: false,
      }));

  const instagram = business?.instagramHandle
    ? (business.instagramHandle.startsWith('http') ? business.instagramHandle : `https://instagram.com/${business.instagramHandle.replace('@', '')}`)
    : 'https://instagram.com/dvir_barber';

  const galleryPhotos = Array.isArray(business?.galleryImages)
    ? business.galleryImages.map((imgUrl, i) => ({
        id: i + 1,
        title: `תספורת ועבודה #${i + 1} - ${bizName}`,
        category: 'עבודות מספרה',
        src: imgUrl,
      }))
    : DEFAULT_GALLERY_PHOTOS;

  return (
    <section id="services-and-gallery" className="py-12 sm:py-16 bg-[#181818] text-white" dir="rtl">
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>מחירון ושירותי פרימיום</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {business?.layout?.sectionTitles?.services || `השירותים והעבודות של ${bizName}`}
          </h2>
          <p className="text-xs sm:text-sm text-[#9E9891] mt-1.5 font-sans">
            {business?.layout?.sectionTitles?.servicesSubtitle || 'מחירים שקופים, דיוק ללא פשרות, ואווירה אישית ומקצועית'}
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
                <Scissors className="w-5 h-5" style={{ color: themeColor }} />
                <h3 className="font-black text-base sm:text-lg text-white">מחירון שירותי מספרה</h3>
              </div>
              <span className="text-xs text-zinc-400">משך זמן ומחיר</span>
            </div>

            <div className="divide-y divide-white/5 space-y-1">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-white/[0.03] px-2 rounded-2xl transition-colors"
                >
                  {/* Service Info (Right in RTL) */}
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white group-hover:text-amber-200 transition-colors">
                        {service.name}
                      </span>
                      {service.popular && (
                        <span
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-[#1C1C1C]"
                          style={{ backgroundColor: themeColor }}
                        >
                          פופולרי 🔥
                        </span>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-xs text-[#9E9891] mt-0.5 font-sans leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Duration (Left in RTL) */}
                  <div className="text-left flex flex-col items-end gap-1 shrink-0">
                    <span className="font-black text-base text-white">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-[11px] text-[#9E9891]">
                      {service.duration} דקות
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Footer in Price Box */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#9E9891]">
                שריון תור אונליין מהיר תוך 30 שניות
              </span>
              <Link
                href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
                className="py-2.5 px-5 rounded-xl text-[#1C1C1C] font-black text-xs hover:opacity-95 transition-opacity shadow-md cursor-pointer shrink-0"
                style={{ backgroundColor: themeColor }}
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
                <Star className="w-5 h-5 fill-current" style={{ color: themeColor }} />
                <h3 className="font-black text-base sm:text-lg text-white">גלריית עבודות אחרונות</h3>
              </div>
              <span className="text-xs text-zinc-400">לחץ להגדלה</span>
            </div>

            {/* 3x2 Photos Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {galleryPhotos.slice(0, 9).map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo as any)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 focus:outline-none focus:ring-2 cursor-pointer"
                  style={{ '--tw-ring-color': themeColor } as any}
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
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold hover:underline"
                style={{ color: themeColor }}
              >
                צפה בעבודות נוספות באינסטגרם של {bizName} ←
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
              className="relative max-w-lg w-full bg-[#1C1C1C] rounded-3xl overflow-hidden border p-4 shadow-2xl"
              style={{ borderColor: `${themeColor}60` }}
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
                <div className="text-right">
                  <h4 className="font-bold text-sm text-white">{selectedPhoto.title}</h4>
                  <span className="text-xs font-semibold" style={{ color: themeColor }}>{selectedPhoto.category}</span>
                </div>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
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
