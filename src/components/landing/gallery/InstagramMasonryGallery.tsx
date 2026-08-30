'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Eye, Heart, Camera } from 'lucide-react';
import { BusinessConfig } from '@/types/business';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const DEFAULT_MASONRY_PHOTOS = [
  {
    id: 1,
    title: 'מבנה אנטומי & לק ג׳ל מושלם',
    category: 'ציפורניים',
    src: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80',
    likes: 142,
  },
  {
    id: 2,
    title: 'סקין פייד כירורגי ופיסול זקן',
    category: 'תספורת',
    src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
    likes: 218,
  },
  {
    id: 3,
    title: 'הרמת ריסים טבעית ומלאה',
    category: 'ריסים וגבות',
    src: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80',
    likes: 95,
  },
  {
    id: 4,
    title: 'עיסוי אבנים חמות ורגיעה עמוקה',
    category: 'ספא וטיפולים',
    src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
    likes: 184,
  },
  {
    id: 5,
    title: 'קעקוע פיין-ליין גיאומטרי עדין',
    category: 'קעקועים',
    src: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=700&q=80',
    likes: 310,
  },
  {
    id: 6,
    title: 'טיפול פנים זוהר Glow & לחות',
    category: 'אסתטיקה',
    src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    likes: 167,
  },
];

export default function InstagramMasonryGallery({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof DEFAULT_MASONRY_PHOTOS[0] | null>(null);

  const themeColor = business?.themeColor || '#EC4899';
  const bizName = business?.name || 'הסטודיו';
  const instagram = business?.instagramHandle
    ? (business.instagramHandle.startsWith('http') ? business.instagramHandle : `https://instagram.com/${business.instagramHandle.replace('@', '')}`)
    : 'https://instagram.com';

  const photos = Array.isArray(business?.galleryImages) && business.galleryImages.length > 0
    ? business.galleryImages.map((src, i) => ({
        id: i + 1,
        title: `עבודה #${i + 1} - ${bizName}`,
        category: 'גלריית עבודות',
        src,
        likes: 100 + i * 23,
      }))
    : DEFAULT_MASONRY_PHOTOS;

  const sectionTitle = business?.layout?.sectionTitles?.gallery || 'גלריית עבודות ותוצאות מהאינסטגרם';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {photos.map((photo, idx) => (
          <motion.button
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative aspect-4/5 rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg cursor-pointer text-right focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': themeColor } as any}
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <span className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md">
                  <Eye className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-1">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-950 inline-block"
                  style={{ backgroundColor: themeColor }}
                >
                  {photo.category}
                </span>
                <p className="text-xs font-bold text-white leading-tight drop-shadow-md line-clamp-1">
                  {photo.title}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-pink-400 font-bold">
                  <Heart className="w-3 h-3 fill-current" />
                  <span>{photo.likes} לייקים</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="text-center pt-2">
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-all hover:scale-105"
        >
          <InstagramIcon className="w-4 h-4 text-pink-400" />
          <span>עקבו אחרינו באינסטגרם לעבודות נוספות ↗</span>
        </a>
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
              className="relative max-w-lg w-full bg-[#1A1A1E] rounded-3xl overflow-hidden border p-4 shadow-2xl"
              style={{ borderColor: `${themeColor}60` }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3">
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
                  <span className="text-xs font-semibold" style={{ color: themeColor }}>
                    {selectedPhoto.category}
                  </span>
                </div>

                <button
                  type="button"
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
    </div>
  );
}
