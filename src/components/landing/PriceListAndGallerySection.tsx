'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Sparkles, X, ChevronLeft, Camera } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/store';
import { BusinessConfig } from '@/types/business';
import { formatPrice } from '@/lib/utils';
import { getThemeTokens } from '@/lib/theme-tokens';
import CardsGridServices from './services/CardsGridServices';
import CompactMenuServices from './services/CompactMenuServices';

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
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

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

  const galleryPhotos = Array.isArray(business?.galleryImages) && business.galleryImages.length > 0
    ? business.galleryImages.map((imgUrl, i) => ({
        id: i + 1,
        title: `תספורת ועבודה #${i + 1} - ${bizName}`,
        category: 'עבודות מספרה',
        src: imgUrl,
      }))
    : DEFAULT_GALLERY_PHOTOS;

  return (
    <section id="services-and-gallery" className={`py-12 sm:py-16 ${t.sectionBg}`} dir="rtl">
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
          <h2 className={`text-2xl sm:text-3xl font-black ${t.textPrimary}`}>
            {business?.layout?.sectionTitles?.services || `השירותים והעבודות של ${bizName}`}
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 font-sans ${t.textSecondary}`}>
            {business?.layout?.sectionTitles?.servicesSubtitle || 'מחירים שקופים, דיוק ללא פשרות, ואווירה אישית ומקצועית'}
          </p>
        </div>

        {/* Conditional Layout Styles: cards-grid / compact-menu / split-gallery */}
        {business?.layout?.servicesStyle === 'cards-grid' ? (
          <CardsGridServices services={services} themeColor={themeColor} slug={slug} bgTheme={bgTheme} />
        ) : business?.layout?.servicesStyle === 'compact-menu' ? (
          <CompactMenuServices services={services} themeColor={themeColor} slug={slug} bgTheme={bgTheme} />
        ) : (
          /* Default: 2-Column Split & Gallery Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ============================================================ */}
            {/* 1. RIGHT COLUMN: PRICE LIST & SERVICES                       */}
            {/* ============================================================ */}
            <div className={`lg:col-span-7 rounded-3xl p-5 sm:p-7 shadow-xl ${t.cardBg}`}>
              <div className={`flex items-center justify-between pb-4 mb-4 border-b ${t.borderColor}`}>
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" style={{ color: themeColor }} />
                  <h3 className={`font-black text-base sm:text-lg ${t.textPrimary}`}>מחירון שירותים דיגיטלי</h3>
                </div>
                <span className={`text-xs ${t.textMuted}`}>משך זמן ומחיר</span>
              </div>

              <div className={`divide-y ${t.divideColor} space-y-1`}>
                {services.map((service, idx) => (
                  <div
                    key={idx}
                    className={`py-3.5 flex items-center justify-between gap-3 group px-2 rounded-2xl transition-colors ${t.hoverItemBg}`}
                  >
                    {/* Service Info (Right in RTL) */}
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-sm transition-colors ${t.textPrimary}`}>
                          {service.name}
                        </span>
                        {service.popular && (
                          <span
                            className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-[#1C1C1C]"
                            style={{ backgroundColor: themeColor }}
                          >
                            נבחר
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 leading-relaxed font-sans ${t.textSecondary}`}>
                        {service.description}
                      </p>
                    </div>

                    {/* Duration & Price (Left in RTL) */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-sans ${t.textMuted}`}>
                        {service.duration} דק׳
                      </span>
                      <span
                        className="font-black text-base sm:text-lg min-w-[65px] text-left"
                        style={{ color: themeColor }}
                      >
                        {formatPrice(service.price)}
                      </span>
                      <Link
                        href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
                        className="p-1.5 rounded-xl transition-colors"
                        style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                        title="הזמן שירות זה"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ============================================================ */}
            {/* 2. LEFT COLUMN: GALLERY PHOTOS PREVIEW                       */}
            {/* ============================================================ */}
            <div className={`lg:col-span-5 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 ${t.cardBg}`}>
              <div className={`flex items-center justify-between pb-4 border-b ${t.borderColor}`}>
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5" style={{ color: themeColor }} />
                  <h3 className={`font-black text-base sm:text-lg ${t.textPrimary}`}>גלריית עבודות</h3>
                </div>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold hover:underline flex items-center gap-1"
                  style={{ color: themeColor }}
                >
                  <span>אינסטגרם</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {galleryPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/10 group shadow-md"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] font-bold text-white leading-tight truncate">
                        {photo.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border ${t.buttonSecondaryBg}`}
              >
                <span>צפה בעבודות נוספות באינסטגרם של {bizName} ←</span>
              </a>
            </div>
          </div>
        )}
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
              className={`relative max-w-lg w-full rounded-3xl overflow-hidden border p-4 shadow-2xl ${t.isLight ? 'bg-white' : 'bg-[#1C1C1C]'}`}
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
                  <h4 className={`font-bold text-sm ${t.textPrimary}`}>{selectedPhoto.title}</h4>
                  <span className="text-xs font-semibold" style={{ color: themeColor }}>{selectedPhoto.category}</span>
                </div>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${t.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-white'}`}
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
