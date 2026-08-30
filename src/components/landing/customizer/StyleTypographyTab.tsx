'use client';

import React from 'react';
import { Check } from 'lucide-react';
import ImageUploadPicker from '@/components/common/ImageUploadPicker';
import type { HeroArchetype, ServicesStyle, CardRadius, GalleryStyle, TypographyMood, BusinessConfig } from '@/types/business';

interface StyleTypographyTabProps {
  business?: Partial<BusinessConfig>;
  onHeroStyleChange: (style: HeroArchetype) => void;
  onServicesStyleChange: (style: ServicesStyle) => void;
  onCardRadiusChange: (radius: CardRadius) => void;
  onGalleryStyleChange: (style: GalleryStyle) => void;
  onTypographyMoodChange: (mood: TypographyMood) => void;
  onLogoChange: (url: string) => void;
}

export function StyleTypographyTab({
  business,
  onHeroStyleChange,
  onServicesStyleChange,
  onCardRadiusChange,
  onGalleryStyleChange,
  onTypographyMoodChange,
  onLogoChange,
}: StyleTypographyTabProps) {
  const currentHero = business?.layout?.heroStyle || 'hub-monogram';
  const currentServices = business?.layout?.servicesStyle || 'split-gallery';
  const currentRadius = business?.layout?.cardRadius || 'smooth';
  const currentGallery = business?.layout?.galleryStyle || 'before-after-slider';
  const currentTypo = business?.layout?.typographyMood || 'modern-clean';

  return (
    <div className="space-y-5">
      {/* Brand Logo Upload */}
      <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-white">לוגו העסק (Header & Footer)</span>
          <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
            PNG שקוף מומלץ
          </span>
        </div>
        <ImageUploadPicker
          value={business?.logoUrl || ''}
          onChange={onLogoChange}
          placeholder="בחר קובץ לוגו או הדבק URL..."
          label="לוגו"
        />
      </div>

      {/* Hero Layout */}
      <div>
        <h3 className="text-xs font-black text-white mb-2">סגנון פתיח (Hero Archetype):</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'hub-monogram', title: 'האב מרכזי עם מונוגרמה', desc: 'עיגול לוגו מרכזי, כפתורי שיתוף ושעות' },
            { id: 'split-cinema', title: 'קולנועי מפוצל (Split Cinema)', desc: '2 עמודות: טקסט ומזמין בצד, תמונה גדולה בצד' },
            { id: 'minimalist-vip', title: 'מינימליסטי יוקרתי (Minimalist VIP)', desc: 'ממורכז ונקי עם דגש ישיר על קביעת תור' },
          ].map((item) => {
            const isSelected = currentHero === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onHeroStyleChange(item.id as HeroArchetype)}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-zinc-800 font-bold'
                    : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                }`}
              >
                <div>
                  <span className="text-xs text-white block">{item.title}</span>
                  <span className="text-[10px] text-zinc-400 font-normal">{item.desc}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Style */}
      <div>
        <h3 className="text-xs font-black text-white mb-2">סגנון גלריה ותוצאות (Showcase):</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'before-after-slider', title: 'סליידר לפני / אחרי אינטראקטיבי', icon: '↔️' },
            { id: 'instagram-masonry', title: 'גריד תמונות אינסטגרם מודרני', icon: '📸' },
            { id: 'ambient-carousel', title: 'קרוסלת אווירה ורוגע (Ambient)', icon: '🌿' },
          ].map((item) => {
            const isSelected = currentGallery === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onGalleryStyleChange(item.id as GalleryStyle)}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-zinc-800 font-bold'
                    : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs text-white">{item.title}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Style & Corner Radius */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <h3 className="text-xs font-black text-white mb-2">מחירון שירותים:</h3>
          <div className="space-y-1.5">
            {[
              { id: 'split-gallery', label: 'גלריה מפוצלת' },
              { id: 'cards-grid', label: 'גריד כרטיסים' },
              { id: 'compact-menu', label: 'תפריט קומפקטי' },
              { id: 'accordion', label: 'אקורדיון' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onServicesStyleChange(s.id as ServicesStyle)}
                className={`w-full p-2 rounded-lg border text-right text-xs transition-all cursor-pointer ${
                  currentServices === s.id
                    ? 'border-amber-400 bg-zinc-800 text-white font-bold'
                    : 'border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-white mb-2">פינות כרטיסים:</h3>
          <div className="space-y-1.5">
            {[
              { id: 'sharp', label: 'חדות (Sharp)' },
              { id: 'smooth', label: 'מעוגלות (Smooth)' },
              { id: 'pill', label: 'עגולות (Pill)' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onCardRadiusChange(r.id as CardRadius)}
                className={`w-full p-2 rounded-lg border text-right text-xs transition-all cursor-pointer ${
                  currentRadius === r.id
                    ? 'border-amber-400 bg-zinc-800 text-white font-bold'
                    : 'border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {r.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography Mood */}
      <div>
        <h3 className="text-xs font-black text-white mb-2">סגנון טיפוגרפיה ופונטים:</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'modern-clean', label: 'מודרני ונקי', sub: 'Clean Sans' },
            { id: 'luxury-serif', label: 'סריף יוקרתי', sub: 'Luxury Serif' },
            { id: 'urban-bold', label: 'אורבני ונועז', sub: 'Urban Bold' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTypographyMoodChange(t.id as TypographyMood)}
              className={`p-2 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                currentTypo === t.id
                  ? 'border-amber-400 bg-zinc-800 text-white font-bold ring-1 ring-amber-400/40'
                  : 'border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <span className="block text-xs text-white">{t.label}</span>
              <span className="block text-[9px] text-zinc-400 mt-0.5">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
