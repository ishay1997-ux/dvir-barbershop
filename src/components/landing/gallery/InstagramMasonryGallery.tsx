'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Eye, Heart, Camera } from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { getThemeTokens } from '@/lib/theme-tokens';
import { getIndustryGalleryPhotos, GalleryPhotoItem } from '@/lib/industry-media';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function InstagramMasonryGallery({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(null);

  const themeColor = business?.themeColor || '#EC4899';
  const bizName = business?.name || 'הסטודיו';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const instagram = business?.instagramHandle
    ? (business.instagramHandle.startsWith('http') ? business.instagramHandle : `https://instagram.com/${business.instagramHandle.replace('@', '')}`)
    : 'https://instagram.com';

  const photos = getIndustryGalleryPhotos(business);

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
            className={`group relative aspect-4/5 rounded-3xl overflow-hidden shadow-lg cursor-pointer text-right focus:outline-none focus:ring-2 ${t.cardBg}`}
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
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs border transition-all hover:scale-105 ${t.buttonSecondaryBg}`}
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
              className={`relative max-w-lg w-full rounded-3xl overflow-hidden border p-4 shadow-2xl ${t.isLight ? 'bg-white text-slate-900' : 'bg-[#1A1A1E] text-white'}`}
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
                  <h4 className={`font-bold text-sm ${t.textPrimary}`}>{selectedPhoto.title}</h4>
                  <span className="text-xs font-semibold" style={{ color: themeColor }}>
                    {selectedPhoto.category}
                  </span>
                </div>

                <button
                  type="button"
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
    </div>
  );
}
