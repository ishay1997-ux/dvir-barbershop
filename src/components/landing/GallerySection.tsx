'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Gallery items - placeholder using gradient tiles until real photos are added
const galleryItems = [
  { id: 1, label: 'פייד קלאסי', category: 'תספורת', span: 'large' },
  { id: 2, label: 'עיצוב זקן', category: 'זקן', span: 'small' },
  { id: 3, label: 'טקסצ\'ר קאט', category: 'תספורת', span: 'small' },
  { id: 4, label: 'גילוח קלאסי', category: 'גילוח', span: 'small' },
  { id: 5, label: 'קרופ + פייד', category: 'תספורת', span: 'medium' },
  { id: 6, label: 'תספורת + זקן', category: 'קומבו', span: 'small' },
  { id: 7, label: 'צביעה מודרנית', category: 'צביעה', span: 'small' },
  { id: 8, label: 'אנדרקאט', category: 'תספורת', span: 'medium' },
];

// Color gradients for placeholder images
const gradients = [
  'from-amber-900 to-amber-700',
  'from-stone-700 to-stone-500',
  'from-amber-800 to-yellow-600',
  'from-zinc-800 to-zinc-600',
  'from-amber-700 to-amber-500',
  'from-stone-800 to-stone-600',
  'from-yellow-800 to-amber-600',
  'from-zinc-700 to-zinc-500',
];

export default function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = galleryItems.find((g) => g.id === selectedId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    if (selectedId !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedId]);

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-24 bg-[#1C1C1C]"
      aria-labelledby="gallery-heading"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">העבודות שלנו</span>
          <h2
            id="gallery-heading"
            className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4"
          >
            גלריית תספורות
          </h2>
          <div className="gold-divider" />
          <p className="text-[#9E9891] mt-4 max-w-sm mx-auto text-sm">
            כל תספורת היא יצירת אמנות. לחץ על תמונה לתצוגה מוגדלת.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] gap-3 sm:gap-4">
          {galleryItems.map((item, i) => {
            const rowSpan = item.span === 'large' ? 'row-span-2 col-span-2' : item.span === 'medium' ? 'row-span-2' : '';
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`${rowSpan} relative group rounded-2xl overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-gold`}
                onClick={() => setSelectedId(item.id)}
                aria-label={`הצג תמונה: ${item.label}`}
              >
                {/* Placeholder gradient "image" */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} transition-transform duration-500 group-hover:scale-110`} />

                {/* Overlay pattern */}
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(201,168,76,0.1) 10px, rgba(201,168,76,0.1) 11px)',
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1C1C1C]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center">
                    <span className="text-gold text-lg">+</span>
                  </div>
                  <span className="text-white text-xs font-semibold">{item.label}</span>
                </div>

                {/* Category badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-[#1C1C1C]/70 text-gold text-xs font-medium">
                  {item.category}
                </div>

                {/* Scissor watermark */}
                <div className="absolute top-3 left-3 text-white/10 text-2xl">✂</div>
              </motion.button>
            );
          })}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedId && selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedId(null)}
              role="dialog"
              aria-modal="true"
              aria-label={`תמונה: ${selected.label}`}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-2xl w-full aspect-[4/3] rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradients[(selected.id - 1) % gradients.length]} flex items-end`}
                >
                  <div className="p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                    <span className="text-gold text-xs font-semibold tracking-widest">{selected.category}</span>
                    <h3 className="text-white text-2xl font-bold">{selected.label}</h3>
                  </div>
                </div>
                <button
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:text-gold transition-colors"
                  onClick={() => setSelectedId(null)}
                  aria-label="סגור תמונה"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
