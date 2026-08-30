'use client';

import React from 'react';
import { Layout, Smartphone, Check } from 'lucide-react';
import type { HeroArchetype, ServicesStyle, CardRadius, GalleryStyle, TypographyMood } from '@/types/business';

interface LayoutArchetypesSectionProps {
  heroStyle: HeroArchetype;
  servicesStyle: ServicesStyle;
  cardRadius: CardRadius;
  galleryStyle?: GalleryStyle;
  typographyMood?: TypographyMood;
  showMobileStickyBar?: boolean;
  onHeroStyleChange: (style: HeroArchetype) => void;
  onServicesStyleChange: (style: ServicesStyle) => void;
  onCardRadiusChange: (radius: CardRadius) => void;
  onGalleryStyleChange: (style: GalleryStyle) => void;
  onTypographyMoodChange: (mood: TypographyMood) => void;
  onMobileStickyBarChange: (enabled: boolean) => void;
}

export function LayoutArchetypesSection({
  heroStyle,
  servicesStyle,
  cardRadius,
  galleryStyle = 'before-after-slider',
  typographyMood = 'modern-clean',
  showMobileStickyBar = true,
  onHeroStyleChange,
  onServicesStyleChange,
  onCardRadiusChange,
  onGalleryStyleChange,
  onTypographyMoodChange,
  onMobileStickyBarChange,
}: LayoutArchetypesSectionProps) {
  return (
    <div className="space-y-6">
      {/* Hero Style Archetypes */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#C9A84C]" />
            <h2 className="text-base font-black text-[#1C1C1C]">מבנה פתיח האתר (Hero Archetype)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            בחר את סגנון החלק העליון שרואה הלקוח עם כניסתו לאתר
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: 'hub-monogram',
              title: 'האב מרכזי עם מונוגרמה',
              desc: 'עיגול לוגו מרכזי, כפתורי שיתוף, שעות פתיחה וכפתורי ניווט מהירים.',
              badge: 'המוביל למספרות וסטודיו',
            },
            {
              id: 'split-cinema',
              title: 'קולנועי מפוצל (Split Cinema)',
              desc: 'חלוקה ל-2 עמודות: כותרת ומזמין תורים בצד אחד, תמונת אווירה גדולה בצד שני.',
              badge: 'לקליניקות וספא',
            },
            {
              id: 'minimalist-vip',
              title: 'מינימליסטי יוקרתי (Minimalist VIP)',
              desc: 'עיצוב ממורכז ונקי מאוד עם הילה זוהרת ודגש ישיר על קביעת תור מהיר.',
              badge: 'מודרני והייטקי',
            },
          ].map((item) => {
            const isSelected = heroStyle === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onHeroStyleChange(item.id as HeroArchetype)}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/5 ring-2 ring-[#C9A84C]/20 shadow-xs font-black'
                    : 'border-[#E5DDD0] hover:border-[#C9A84C]/60 bg-[#FAF7F2]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                      {item.badge}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#C9A84C]" />}
                  </div>
                  <h3 className="text-xs font-black text-[#1C1C1C] mb-1">{item.title}</h3>
                  <p className="text-[11px] text-[#6B6560] leading-relaxed font-sans font-normal">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Archetypes */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#C9A84C]" />
            <h2 className="text-base font-black text-[#1C1C1C]">סגנון הגלריה והתוצאות (Gallery & Showcase)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            בחר כיצד להציג את עבודות העסק ללקוחות
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: 'before-after-slider',
              title: 'סליידר לפני / אחרי אינטראקטיבי',
              desc: 'גרירה אינטראקטיבית המדגישה שינוי דרמטי (תספורות, ירידה במשקל, טיפולי פנים).',
              icon: '↔️',
            },
            {
              id: 'instagram-masonry',
              title: 'גריד תמונות אינסטגרם מודרני',
              desc: 'רשת תמונות מגוונת בגדלים משתנים עם אפקט זום (ציפורניים, קעקועים, עיצובים).',
              icon: '📸',
            },
            {
              id: 'ambient-carousel',
              title: 'קרוסלת אווירה ורוגע (Ambient Carousel)',
              desc: 'כרטיסי תמונה רחבים ומרגיעים עם טקסטים מעוררי השראה (ספא, מרכזי בריאות).',
              icon: '🌿',
            },
          ].map((item) => {
            const isSelected = galleryStyle === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onGalleryStyleChange(item.id as GalleryStyle)}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/5 ring-2 ring-[#C9A84C]/20 shadow-xs font-black'
                    : 'border-[#E5DDD0] hover:border-[#C9A84C]/60 bg-[#FAF7F2]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{item.icon}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#C9A84C]" />}
                  </div>
                  <h3 className="text-xs font-black text-[#1C1C1C] mb-1">{item.title}</h3>
                  <p className="text-[11px] text-[#6B6560] leading-relaxed font-sans font-normal">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Style & Card Radius */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services Layout */}
        <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-[#1C1C1C]">עיצוב תצוגת השירותים והמחירון</h3>
            <p className="text-xs text-[#6B6560] mt-1">בחר כיצד יוצג המחירון בעמוד הבית</p>
          </div>

          <div className="space-y-2">
            {[
              { id: 'split-gallery', label: 'גלריה מפוצלת (תמונה גדולה וכרטיסים)', desc: 'יוקרתי עם תמונות מתחלפות' },
              { id: 'cards-grid', label: 'גריד כרטיסים עשיר', desc: 'כל שירות בכרטיס מעוצב' },
              { id: 'compact-menu', label: 'תפריט מחירון קומפקטי', desc: 'רשימה נקייה ללא תמונות כבדות' },
              { id: 'accordion', label: 'אקורדיון נפתח לפי קטגוריות', desc: 'מעולה לעסקים עם עשרות שירותים' },
            ].map((s) => {
              const isSelected = servicesStyle === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onServicesStyleChange(s.id as ServicesStyle)}
                  className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#C9A84C] bg-amber-500/10 text-[#1C1C1C] font-black'
                      : 'border-[#E5DDD0] bg-[#FAF7F2] text-[#6B6560] hover:border-[#C9A84C]/50'
                  }`}
                >
                  <div>
                    <span className="text-xs block">{s.label}</span>
                    <span className="text-[10px] text-[#6B6560] font-normal">{s.desc}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#C9A84C]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Radius & Typography */}
        <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-[#1C1C1C]">פינות הכרטיסים וגופנים</h3>
            <p className="text-xs text-[#6B6560] mt-1">התאם את רדיוס הפינות והאווירה הטיפוגרפית</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sharp', label: 'חדות (Sharp)', radius: 'rounded-none' },
              { id: 'smooth', label: 'מעוגלות (Smooth)', radius: 'rounded-xl' },
              { id: 'pill', label: 'עגולות (Pill/Organic)', radius: 'rounded-3xl' },
            ].map((r) => {
              const isSelected = cardRadius === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onCardRadiusChange(r.id as CardRadius)}
                  className={`p-3 border text-center transition-all cursor-pointer ${r.radius} ${
                    isSelected
                      ? 'border-[#C9A84C] bg-amber-500/10 text-[#1C1C1C] font-black'
                      : 'border-[#E5DDD0] bg-[#FAF7F2] text-[#6B6560] hover:border-[#C9A84C]/50'
                  }`}
                >
                  <span className="text-xs block">{r.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E5DDD0]">
            <span className="text-xs font-black text-[#1C1C1C] block mb-2">אווירה טיפוגרפית (Typography):</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'modern-clean', label: 'מודרני ונקי (Rubik)' },
                { id: 'luxury-serif', label: 'יוקרתי (Heebo Elegant)' },
                { id: 'urban-bold', label: 'אורבני מודגש (Assistant)' },
              ].map((m) => {
                const isSelected = typographyMood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onTypographyMoodChange(m.id as TypographyMood)}
                    className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C9A84C] bg-amber-500/10 text-[#1C1C1C] font-black'
                        : 'border-[#E5DDD0] bg-[#FAF7F2] text-[#6B6560]'
                    }`}
                  >
                    {m.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-[#1C1C1C]">
              בר הזמנה צף ומהיר במובייל (Mobile Sticky Bar)
            </h3>
            <p className="text-[11px] text-[#6B6560]">
              פס תחתון צף במכשירים ניידים המאפשר ללקוחות להזמין תור / לחייג בלחיצה אחת מכל מקום בעמוד
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={showMobileStickyBar}
            onChange={(e) => onMobileStickyBarChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
        </label>
      </div>
    </div>
  );
}
