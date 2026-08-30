'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, MoveHorizontal, Scissors, Dumbbell, Stethoscope, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { BusinessConfig } from '@/types/business';
import { getThemeTokens } from '@/lib/theme-tokens';
import InstagramMasonryGallery from './gallery/InstagramMasonryGallery';
import AmbientCarouselGallery from './gallery/AmbientCarouselGallery';

interface Transformation {
  id: string;
  title: string;
  category: string;
  description: string;
  beforeGradient: string;
  afterGradient: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BARBER_TRANSFORMATIONS: Transformation[] = [
  {
    id: '1',
    title: 'סקין פייד קלאסי ועיצוב קווי מתאר',
    category: 'תספורת פרימיום',
    description: 'מעבר משיער פרוע לפייד מדויק עם קווי מתאר חדים וטקסטורה עליונה.',
    beforeGradient: 'from-stone-900 via-stone-800 to-zinc-900',
    afterGradient: 'from-amber-900 via-amber-800 to-yellow-700',
    beforeLabel: 'שיער לא מעוצב',
    afterLabel: 'דירוג חד ומדויק',
  },
  {
    id: '2',
    title: 'פיסול זקן מלא + דירוג לחיים',
    category: 'עיצוב זקן',
    description: 'יישור סימטרי מדויק של קו הלחיים והצוואר, שמן הזנה ועיצוב עם תער חם.',
    beforeGradient: 'from-zinc-900 via-neutral-900 to-stone-900',
    afterGradient: 'from-amber-950 via-amber-900 to-amber-700',
    beforeLabel: 'זקן ללא הגדרה',
    afterLabel: 'פיסול קווים כירורגי',
  },
  {
    id: '3',
    title: 'פרנץ\' קרופ מודרני וטקסטורה עשירה',
    category: 'סגנון מודרני',
    description: 'מראה צעיר, רענן וקל לעיצוב יומיומי עם חימר מט פרימיום.',
    beforeGradient: 'from-neutral-900 via-zinc-800 to-stone-900',
    afterGradient: 'from-yellow-950 via-amber-800 to-yellow-600',
    beforeLabel: 'מראה שגרתי',
    afterLabel: 'טקסטורה עשירה',
  },
];

const FITNESS_TRANSFORMATIONS: Transformation[] = [
  {
    id: '1',
    title: 'חיטוב גוף מלא וירידה ב-8% שומן',
    category: 'תוכנית ליווי 90 יום',
    description: 'תהליך חיטוב ממוקד המשלב אימוני כוח אישיים ותפריט תזונה עשיר בחלבון.',
    beforeGradient: 'from-stone-900 via-stone-800 to-zinc-900',
    afterGradient: 'from-emerald-950 via-teal-900 to-emerald-700',
    beforeLabel: 'אחוז שומן גבוה',
    afterLabel: 'חיטוב וקווי שריר',
  },
  {
    id: '2',
    title: 'עלייה במסת שריר ושיפור יציבה',
    category: 'אימוני היפרטרופיה',
    description: 'עלייה של 4.5 ק״ג מסת שריר נקייה, חיזוק חגורת הכתפיים ושרירי הליבה.',
    beforeGradient: 'from-zinc-900 via-neutral-900 to-stone-900',
    afterGradient: 'from-teal-950 via-emerald-900 to-teal-700',
    beforeLabel: 'מבנה גוף רפוי',
    afterLabel: 'מסת שריר ויציבה',
  },
  {
    id: '3',
    title: 'הצרת היקפים ובטן חטובה',
    category: 'חיטוב פונקציונלי',
    description: 'ירידה של 7 ס״מ בהיקף המותניים ושיפור דרמטי בסיבולת לב-ריאה.',
    beforeGradient: 'from-neutral-900 via-zinc-800 to-stone-900',
    afterGradient: 'from-emerald-900 via-teal-800 to-emerald-600',
    beforeLabel: 'חוסר אנרגיה',
    afterLabel: 'חיוניות וחיטוב',
  },
];

const CLINIC_TRANSFORMATIONS: Transformation[] = [
  {
    id: '1',
    title: 'טיפול פנים זוהר והעלמת פיגמנטציה',
    category: 'פרוטוקול Glow רפואי',
    description: 'חידוש מרקם העור, אחידות גוון הפנים והחזרת הברק הטבעי.',
    beforeGradient: 'from-slate-900 via-zinc-900 to-slate-950',
    afterGradient: 'from-sky-950 via-blue-900 to-sky-700',
    beforeLabel: 'עור עמום ופיגמנטציה',
    afterLabel: 'עור חלק וזוהר ✨',
  },
  {
    id: '2',
    title: 'פיסול ועיבוי שפתיים סימטרי',
    category: 'חומצה היאלורונית פרימיום',
    description: 'עיצוב קווי מתאר עדינים והענקת נפח טבעי ומחמיא במיוחד.',
    beforeGradient: 'from-slate-900 via-neutral-900 to-zinc-900',
    afterGradient: 'from-blue-950 via-indigo-900 to-sky-700',
    beforeLabel: 'שפתיים דקות',
    afterLabel: 'נפח וסימטריה טבעית',
  },
  {
    id: '3',
    title: 'טשטוש קמטי הבעה במצח',
    category: 'בוטוקס רפואי מדויק',
    description: 'מראה מצח חלק, פתוח ורענן תוך שמירה מלאה על הבעות הפנים הטבעיות.',
    beforeGradient: 'from-zinc-900 via-slate-900 to-stone-900',
    afterGradient: 'from-sky-900 via-blue-800 to-indigo-700',
    beforeLabel: 'קמטי הבעה מודגשים',
    afterLabel: 'מראה פתוח ורענן',
  },
];

export default function BeforeAfterSection({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeItem, setActiveItem] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100 from left)
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Check if this section is disabled for the business/industry
  if (business?.layout?.showBeforeAfter === false) {
    return null;
  }

  // 2. Delegate to Instagram Masonry or Ambient Carousel if chosen
  const galleryStyle = business?.layout?.galleryStyle || 'before-after-slider';
  if (galleryStyle === 'instagram-masonry') {
    return <InstagramMasonryGallery business={business} />;
  }
  if (galleryStyle === 'ambient-carousel') {
    return <AmbientCarouselGallery business={business} />;
  }

  const themeColor = business?.themeColor || '#C9A84C';
  const ownerName = business?.ownerName || 'דביר';
  const slug = business?.slug || 'dvir';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  // Determine industry-appropriate transformation dataset
  const combinedIndustry = `${business?.name || ''} ${business?.slogan || ''} ${business?.category || ''}`.toLowerCase();
  
  let transformations = BARBER_TRANSFORMATIONS;
  let industryBadge = 'מהפך ושינוי סגנון';
  let SectionIcon = Scissors;

  if (combinedIndustry.includes('כושר') || combinedIndustry.includes('מאמן') || combinedIndustry.includes('אימונים') || themeColor === '#10B981') {
    transformations = FITNESS_TRANSFORMATIONS;
    industryBadge = 'תוצאות ושינוי גוף';
    SectionIcon = Dumbbell;
  } else if (combinedIndustry.includes('קליניקה') || combinedIndustry.includes('אסתטיקה') || combinedIndustry.includes('רופא') || themeColor === '#0EA5E9' || themeColor === '#3B82F6') {
    transformations = CLINIC_TRANSFORMATIONS;
    industryBadge = 'תוצאות טיפולים ואסתטיקה';
    SectionIcon = Stethoscope;
  }

  const current = transformations[activeItem] || transformations[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <section
      id="transformations"
      ref={ref}
      className={`py-20 relative overflow-hidden transition-colors ${t.sectionBg}`}
      aria-labelledby="transformations-heading"
      dir="rtl"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ backgroundColor: themeColor }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-3"
            style={{
              borderColor: `${themeColor}40`,
              backgroundColor: `${themeColor}15`,
              color: themeColor,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-black tracking-widest uppercase">
              {industryBadge}
            </span>
          </div>
          <h2
            id="transformations-heading"
            className={`text-3xl sm:text-4xl font-black mt-1 mb-3 ${t.textPrimary}`}
          >
            {business?.layout?.sectionTitles?.gallery || 'לפני ואחרי'}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: themeColor }} />
          <p className={`mt-4 max-w-md mx-auto text-xs sm:text-sm font-sans ${t.textSecondary}`}>
            גרור את הסליידר כדי לראות את התוצאה המדויקת והחדה
          </p>
        </motion.div>

        {/* Tab selector for transformations */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto">
          {transformations.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(index);
                setSliderPosition(50);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                activeItem === index
                  ? 'text-[#1C1C1C] shadow-md font-black'
                  : `${t.buttonSecondaryBg}`
              }`}
              style={{
                backgroundColor: activeItem === index ? themeColor : undefined,
                borderColor: activeItem === index ? themeColor : undefined,
              }}
            >
              {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
            </button>
          ))}
        </div>

        {/* Interactive Split Comparison Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`max-w-3xl mx-auto rounded-3xl p-4 sm:p-6 shadow-2xl ${t.cardBg}`}
        >
          <div
            ref={containerRef}
            onMouseDown={() => (isDragging.current = true)}
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none touch-none border border-white/10"
            aria-label="סליידר השוואת לפני ואחרי"
          >
            {/* RTL LOGIC: In RTL Hebrew, RIGHT is BEFORE and LEFT is AFTER */}

            {/* 1. BEFORE LAYER (Full Background - Visible on the RIGHT) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${current.beforeGradient} flex items-center justify-end p-8 text-center`}
            >
              <div className="relative z-10 flex flex-col items-center ml-8 sm:ml-16">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 mb-2">
                  <SectionIcon className="w-6 h-6" />
                </div>
                <span className="text-white/80 text-xl sm:text-2xl font-black">
                  לפני
                </span>
                <span className="text-white/50 text-xs mt-1 max-w-[140px] hidden sm:block">
                  {current.beforeLabel || 'לפני הטיפול'}
                </span>
              </div>

              {/* Before label badge (Top Right in RTL) */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 border border-white/20 text-zinc-300 text-xs font-bold">
                לפני הטיפול
              </div>
            </div>

            {/* 2. AFTER LAYER (Clipped Overlay - Visible on the LEFT) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${current.afterGradient} flex items-center justify-start p-8 text-center`}
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <div className="relative z-10 flex flex-col items-center mr-8 sm:mr-16">
                <div
                  className="w-14 h-14 rounded-full border flex items-center justify-center mb-2 shadow-lg"
                  style={{
                    backgroundColor: `${themeColor}30`,
                    borderColor: themeColor,
                    color: themeColor,
                  }}
                >
                  <SectionIcon className="w-6 h-6 -rotate-45" />
                </div>
                <span className="text-xl sm:text-2xl font-black" style={{ color: themeColor }}>
                  אחרי ✨
                </span>
                <span className="text-white text-xs mt-1 max-w-[140px] hidden sm:block font-bold">
                  {current.afterLabel || 'תוצאה מושלמת ✨'}
                </span>
              </div>

              {/* After label badge (Top Left in RTL) */}
              <div
                className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 border text-xs font-bold"
                style={{ borderColor: `${themeColor}60`, color: themeColor }}
              >
                אחרי הטיפול ✨
              </div>
            </div>

            {/* Split Divider Line & Draggable Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 shadow-2xl z-20 pointer-events-none"
              style={{
                left: `${sliderPosition}%`,
                backgroundColor: themeColor,
                boxShadow: `0 0 15px ${themeColor}`,
              }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full border-2 border-white text-[#1C1C1C] flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: themeColor }}
              >
                <MoveHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Details & CTA below slider */}
          <div className={`mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${t.borderColor}`}>
            <div className="text-right">
              <div className="text-xs font-bold" style={{ color: themeColor }}>
                {current.category} · בוצע ע"י {ownerName}
              </div>
              <h3 className={`text-base sm:text-lg font-black mt-0.5 ${t.textPrimary}`}>{current.title}</h3>
              <p className={`text-xs mt-1 font-sans ${t.textSecondary}`}>{current.description}</p>
            </div>

            <Link
              href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
              className="text-[#1C1C1C] font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shrink-0 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              style={{ backgroundColor: themeColor }}
            >
              רוצה תוצאה כזאת? הזמן תור ←
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
