'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Clock,
  MessageCircle,
  Calendar,
  Zap,
  Star,
  MapPin,
  Flame,
} from 'lucide-react';

interface SolutionsSectionProps {
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team', industryTitle: string) => void;
}

interface Superpower {
  title: string;
  desc: string;
  icon: string;
}

interface IndustrySolution {
  id: string;
  icon: string;
  tabLabel: string;
  title: string;
  tagline: string;
  themeColor: string;
  bgGradient: string;
  slug: string;
  bizName: string;
  city: string;
  stats: string;
  statsDesc: string;
  ctaLabel: string;
  superpowers: Superpower[];
  servicePreview: {
    name: string;
    price: string;
    duration: string;
  };
  whatsappPreview: {
    client: string;
    message: string;
    status: string;
  };
}

const INDUSTRY_SOLUTIONS: Record<string, IndustrySolution> = {
  barber: {
    id: 'barber',
    icon: '💈',
    tabLabel: 'מספרות גברים & ברברשופ',
    title: 'מספרות גברים ופיסול זקן (Barber Hub)',
    tagline: 'אפס המתנה על הספה, תיעוד נוסחת תספורת לכל לקוח ויומן מלא 24/7',
    themeColor: '#C9A84C',
    bgGradient: 'from-amber-950/20 via-zinc-900 to-black',
    slug: 'dvir',
    bizName: 'המספרה של דביר',
    city: 'אריאל & רחובות',
    stats: '94% מילוי יומן שבועי',
    statsDesc: 'מערכת אוטונומית שממלאת תורים ומפחיתה שעות של שיחות תיאום',
    ctaLabel: 'צפו באתר הדמו החי (המספרה של דביר) ↗',
    superpowers: [
      {
        icon: '✂️',
        title: 'נוסחת תספורת אישית (Haircut Formula)',
        desc: 'תיעוד מדויק של דירוג Top, סקין פייד ומספר מכונה בכרטיס הלקוח לעקביות מושלמת בכל ביקור.',
      },
      {
        icon: '📅',
        title: 'לוח גרירה אינטראקטיבי (Drag & Drop)',
        desc: 'ניהול לו״ז שבועי מהיר, הזזת תורים בין שעות וכיסאות עבודה בקליק אחד.',
      },
      {
        icon: '🚨',
        title: 'סגירת חירום / מילואים ב-1-Click',
        desc: 'הקפאת תורים מהירה ושליחת הודעות ביטול/הזזה מסודרות בוואטסאפ לכל הלקוחות של אותו יום.',
      },
      {
        icon: '🚗',
        title: 'אישורי הגעה וניווט Waze ב-WhatsApp',
        desc: 'הלקוח מקבל אישור אוטומטי עם קישור ישיר ל-Waze ולסניף שנבחר, ללא צורך בהורדת אפליקציה.',
      },
    ],
    servicePreview: {
      name: 'תספורת גברים פרימיום & פיסול זקן',
      price: '110 ₪',
      duration: '45 דק׳',
    },
    whatsappPreview: {
      client: 'איתי לוי',
      message: 'היי איתי! התור שלך לתספורת ופיסול זקן במספרה של דביר אושר להיום בשעה 17:30 ✂️ לחץ כאן לניווט ב-Waze 🚗',
      status: 'אושר בוואטסאפ ✓',
    },
  },
  beauty: {
    id: 'beauty',
    icon: '💅',
    tabLabel: 'קוסמטיקה & ציפורניים',
    title: 'קוסמטיקה, מבנה אנטומי & טיפוח (Beauty Lounge)',
    tagline: 'שליטה מלאה בביטולים, רשימת המתנה אוטומטית וזמני חיטוי וסטריליזציה',
    themeColor: '#EC4899',
    bgGradient: 'from-pink-950/20 via-zinc-900 to-black',
    slug: 'beauty',
    bizName: 'סטודיו שירן ביוטי & בוטיק',
    city: 'ראשון לציון',
    stats: '0% ביטולים ללא הודעה',
    statsDesc: 'מערכת תזכורות ורשימת המתנה שממלאת חורים פנויים תוך דקות',
    ctaLabel: 'צפו באתר הדמו החי (סטודיו שירן) ↗',
    superpowers: [
      {
        icon: '🔔',
        title: 'רשימת המתנה חכמה (Waitlist)',
        desc: 'לקוחה ביטלה תור? המערכת מקפיצה מידית התראה לממתינות וממלאת את החור ביומן באופן עצמאי.',
      },
      {
        icon: '⏱️',
        title: 'זמני חיץ וסטריליזציה (Buffer Time)',
        desc: 'הגדרת 10-15 דקות חיטוי באוטוקלאב והכנת העמדה בין לקוחה ללקוחה ללא חיכוך.',
      },
      {
        icon: '📸',
        title: 'גלריית אינסטגרם מובנית (Instagram Masonry)',
        desc: 'תצוגת עבודות וציפורניים מרהיבה שגורמת ללקוחות לבחור טיפול ולשריין תור מיד.',
      },
      {
        icon: '📋',
        title: 'טופס הצהרת בריאות ורגישויות',
        desc: 'איסוף מידע רפואי, רגישויות לחומרים והעדפות מריחה עוד לפני ההגעה לקליניקה.',
      },
    ],
    servicePreview: {
      name: 'מבנה אנטומי & לק ג׳ל פרימיום',
      price: '160 ₪',
      duration: '60 דק׳',
    },
    whatsappPreview: {
      client: 'נועה שחר',
      message: 'היי נועה! התור שלך למבנה אנטומי בסטודיו שירן אושר למחר בשעה 10:00 ✨ נשמח לראותך!',
      status: 'אושר בוואטסאפ ✓',
    },
  },
  spa: {
    id: 'spa',
    icon: '🌿',
    tabLabel: 'ספא & טיפולי גוף',
    title: 'ספא, עיסויים והוליסטיקה (Wellness Spa)',
    tagline: 'שקט מוחלט ללא שיחות טלפון בזמן טיפול, קרוסלת אווירה וחבילות זוגיות',
    themeColor: '#14B8A6',
    bgGradient: 'from-teal-950/20 via-zinc-900 to-black',
    slug: 'spa',
    bizName: 'ספא לוטוס – מרגוע לגוף ולנפש',
    city: 'רמת השרון',
    stats: 'חיסכון של 4 שעות שיחות',
    statsDesc: 'הזמנות שקטות 24/7 ללא צורך במענה טלפוני שקוטע את העיסוי',
    ctaLabel: 'צפו באתר הדמו החי (ספא לוטוס) ↗',
    superpowers: [
      {
        icon: '🤫',
        title: 'הזמנות שקטות 24/7 בדיסקרטיות',
        desc: 'הלקוחות משריינים חבילות טיפול באונליין מבלי לקטוע את המטפל/ת באמצע סשן מרגיע.',
      },
      {
        icon: '🕯️',
        title: 'קרוסלת אווירה (Ambient Carousel)',
        desc: 'תצוגה ויזואלית של חדרי הטיפולים, השמנים הארומטיים ואבני הבזלת המשרה רוגע מיידי.',
      },
      {
        icon: '👥',
        title: 'תיאום חבילות זוגיות וזמני שהייה',
        desc: 'שיוך חדרים, מטפלים ומשך טיפולים מותאם (60, 75, 90 דקות) עם ניהול תפוסה חכם.',
      },
      {
        icon: '🍵',
        title: 'הנחיות הגעה מקדימות',
        desc: 'שליחת הוראות הגעה (10 דקות לפני, חלוקי רחצה, שאלון רפואי) אוטומטית לוואטסאפ.',
      },
    ],
    servicePreview: {
      name: 'עיסוי רקמות עמוק & שמנים חמים',
      price: '320 ₪',
      duration: '60 דק׳',
    },
    whatsappPreview: {
      client: 'דניאל כהן',
      message: 'היי דניאל! עיסוי הרקמות העמוק בספא לוטוס שוריין ליום ד׳ ב-16:00 🌿 מומלץ להגיע 10 דק׳ לפני להרפיה ושתיית תה.',
      status: 'אושר בוואטסאפ ✓',
    },
  },
  trainer: {
    id: 'trainer',
    icon: '🏋️',
    tabLabel: 'כושר & אימונים אישיים',
    title: 'מאמני כושר, קליניקות תנועה & סטודיו',
    tagline: 'מעקב כרטיסיות אימונים אוטומטי, סליידר תוצאות גוף וסנכרון יומנים',
    themeColor: '#10B981',
    bgGradient: 'from-emerald-950/20 via-zinc-900 to-black',
    slug: 'trainer',
    bizName: 'סטודיו אופק – אימונים אישיים',
    city: 'הרצליה פיתוח',
    stats: 'הכפלת לקוחות חוזרים',
    statsDesc: 'מערכת כרטיסיות שמחברת את המתאמנים לסדרות אימונים רצופות',
    ctaLabel: 'צפו באתר הדמו החי (סטודיו אופק) ↗',
    superpowers: [
      {
        icon: '🎟️',
        title: 'מעקב כרטיסיות אוטומטי (10 Packs)',
        desc: 'ניכוי אוטומטי של אימונים שבוצעו ועדכון יתרת מפגשים למתאמן בסיום כל אימון.',
      },
      {
        icon: '🔥',
        title: 'סליידר מהפכים ותוצאות (Before/After)',
        desc: 'הוכחה חותכת לירידה באחוזי שומן ועלייה במסת שריר שמוכרת חבילות אימונים באופן עצמאי.',
      },
      {
        icon: '📲',
        title: 'סנכרון דו-כיווני ליומן האישי',
        desc: 'חיבור שקוף ל-Google Calendar ו-Apple Calendar כדי שלעולם לא תפספס אימון.',
      },
      {
        icon: '🛡️',
        title: 'חלון ביטולים קשיח (עד 8 שעות)',
        desc: 'הגנה מלאה על שעות העבודה של המאמן ומניעת הפסדי הכנסה מביטולי רגע אחרון.',
      },
    ],
    servicePreview: {
      name: 'אימון אישי 1-על-1 VIP Session',
      price: '200 ₪',
      duration: '60 דק׳',
    },
    whatsappPreview: {
      client: 'רועי ברק',
      message: 'היי רועי! האימון האישי שלך בסטודיו אופק נקבע למחר ב-08:00 💪 נותרו לך 7 אימונים בכרטיסייה.',
      status: 'אושר ביומן ✓',
    },
  },
  clinic: {
    id: 'clinic',
    icon: '🩺',
    tabLabel: 'קליניקות & אסתטיקה',
    title: 'קליניקות אסתטיקה, רופאים & הזרקות',
    tagline: 'מעקב תיעוד רפואי, זמני שהייה לאלחוש ומיתוג יוקרתי המשרה אמון',
    themeColor: '#0EA5E9',
    bgGradient: 'from-sky-950/20 via-zinc-900 to-black',
    slug: 'clinic',
    bizName: 'קליניקת ד״ר לוי לאסתטיקה רפואית',
    city: 'תל אביב',
    stats: '100% שקיפות ואמון',
    statsDesc: 'סטנדרט רפואי גבוה עם הסכמי טיפול והנחיות מקדימות אוטומטיות',
    ctaLabel: 'צפו באתר הדמו החי (ד״ר לוי קליניקה) ↗',
    superpowers: [
      {
        icon: '📸',
        title: 'תיעוד תוצאות רפואי דיסקרטי',
        desc: 'מעקב תמונות לפני/אחרי והיסטוריית הזרקות אישית ומאובטחת לכל מטופל/ת.',
      },
      {
        icon: '💉',
        title: 'שריון זמני אלחוש מראש (Numbing)',
        desc: 'הגדרת 15-20 דקות מריחת קרם אלחוש בחדר המתנה לפני הכניסה לרופא.',
      },
      {
        icon: '📜',
        title: 'הנחיות רפואיות מקדימות ב-WhatsApp',
        desc: 'שליחת הנחיות אוטומטיות (הימנעות מאלכוהול, מדללי דם) 24 שעות לפני הפרוצדורה.',
      },
      {
        icon: '💎',
        title: 'עיצוב יוקרתי ברמת Luxury Clinic',
        desc: 'ממשק כחול-ספיר יוקרתי המשרה ביטחון, אמינות וסטנדרט בינלאומי גבוה.',
      },
    ],
    servicePreview: {
      name: 'פיסול ועיבוי שפתיים בחומצה היאלורונית',
      price: '1,400 ₪',
      duration: '45 דק׳',
    },
    whatsappPreview: {
      client: 'מיכל אברהם',
      message: 'שלום מיכל, פגישת פיסול השפתיים עם ד״ר לוי נקבעה להיום ב-13:30 🩺 נא להגיע 10 דק׳ לפני למריחת קרם אלחוש.',
      status: 'אושר בוואטסאפ ✓',
    },
  },
  services: {
    id: 'services',
    icon: '🔧',
    tabLabel: 'אינסטלציה & שירותי בית',
    title: 'טכנאי מיזוג, אינסטלציה & חשמל (Home Pro)',
    tagline: 'מנוע חלונות הגעה גמיש, איסוף כתובת מלאה וניווט Waze ישיר לקריאה',
    themeColor: '#F59E0B',
    bgGradient: 'from-amber-950/20 via-zinc-900 to-black',
    slug: 'services',
    bizName: 'שרון שירותי מיזוג וחשמל',
    city: 'מרכז והשרון',
    stats: 'סדר מושלם בקריאות',
    statsDesc: 'חלונות הגעה חכמים שחוסכים עיכובים ומאפשרים עבודה רציפה בשטח',
    ctaLabel: 'צפו באתר הדמו החי (שרון מיזוג) ↗',
    superpowers: [
      {
        icon: '⏰',
        title: 'מנוע חלונות הגעה גמיש (Time Windows)',
        desc: 'הלקוח בוחר טווח הגעה מותאם (לדוגמה 10:00-12:00) שמתאים במדויק לשירות בשטח.',
      },
      {
        icon: '📍',
        title: 'איסוף כתובת מלאה והוראות כניסה',
        desc: 'איסוף אוטומטי של קומה, דירה, קוד כניסה ותיאור התקלה כולל צירוף תמונה.',
      },
      {
        icon: '🚗',
        title: 'כפתור ניווט Waze ישיר לבית הלקוח',
        desc: 'הטכנאי לוחץ על כפתור הניווט בנייד ונוסע ישירות לכתובת הקריאה ללא הקלדה ידנית.',
      },
      {
        icon: '🧾',
        title: 'קיזוז דמי ביקור שקוף מהתיקון',
        desc: 'הצגת מחירון שקוף ללקוח – עלות הביקור מתקזזת מעלות התיקון הסופי.',
      },
    ],
    servicePreview: {
      name: 'ביקור, בדיקת תקלה ואבחון מקצועי',
      price: '250 ₪',
      duration: 'חלון 45 דק׳',
    },
    whatsappPreview: {
      client: 'יוסי כרמי',
      message: 'היי יוסי! קריאת השירות לבדיקת מזגן תואמה להיום לחלון 10:00-12:00 🔧 הטכנאי שרון יעדכן 15 דק׳ לפני ההגעה.',
      status: 'ניווט Waze מוכן ✓',
    },
  },
};

export function SolutionsSection({ onOpenOnboarding }: SolutionsSectionProps) {
  const [activeKey, setActiveKey] = useState<string>('barber');
  const current = INDUSTRY_SOLUTIONS[activeKey] || INDUSTRY_SOLUTIONS.barber;

  return (
    <section id="solutions" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8 select-none" dir="rtl">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>התאמה מלאה לכל תחום עיסוק</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          בנוי בדיוק לפי הצרכים של המקצוע שלכם
        </h2>
        <p className="text-xs sm:text-base text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
          כל ענף עובד אחרת. בחרנו עבורכם את הכלים, המבנה והאוטומציות המדויקות שמייצרות הכנסה ומפנות לכם שקט נפשי.
        </p>
      </div>

      {/* Modern Industry Tabs Pill Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {Object.values(INDUSTRY_SOLUTIONS).map((ind) => {
          const isActive = ind.id === activeKey;
          return (
            <button
              key={ind.id}
              onClick={() => setActiveKey(ind.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-slate-950 text-white shadow-xl scale-105 border-2'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
              }`}
              style={{
                borderColor: isActive ? ind.themeColor : undefined,
              }}
            >
              <span className="text-base">{ind.icon}</span>
              <span>{ind.tabLabel}</span>
              {isActive && (
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: ind.themeColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Feature Spotlight Card */}
      <div className="relative rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Brand Glow */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: current.themeColor }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: current.themeColor }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Right Column: Deep Industry Superpowers */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md font-bold text-slate-950"
                style={{ backgroundColor: current.themeColor }}
              >
                {current.icon}
              </div>
              <div>
                <span
                  className="text-xs font-black uppercase tracking-wider block"
                  style={{ color: current.themeColor }}
                >
                  {current.title}
                </span>
                <span className="text-[11px] text-zinc-400 font-sans">
                  התאמה אוטונומית לעסק · {current.city}
                </span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              {current.tagline}
            </h3>

            {/* 4 Rich Superpower Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {current.superpowers.map((sp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-1.5 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{sp.icon}</span>
                    <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                      {sp.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    {sp.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Dual CTA Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/${current.slug}`}
                target="_blank"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{current.ctaLabel}</span>
              </Link>

              <button
                type="button"
                onClick={() => onOpenOnboarding('pro', current.title)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 cursor-pointer"
                style={{ backgroundColor: current.themeColor }}
              >
                <Sparkles className="w-4 h-4" />
                <span>הקמת אתר ומערכת לעסק ב-60 שניות</span>
              </button>
            </div>
          </div>

          {/* Left Column: Live Realistic Interface Preview */}
          <div className="lg:col-span-5 space-y-4">
            {/* KPI Metric Header Banner */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: `${current.themeColor}20`, color: current.themeColor }}
                >
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-white">{current.stats}</div>
                  <div className="text-[10px] text-zinc-400 font-sans">{current.statsDesc}</div>
                </div>
              </div>
            </div>

            {/* Simulated Live Service Card from Demo */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 border-b border-white/10 pb-2">
                <span className="text-white font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current.themeColor }} />
                  <span>{current.bizName}</span>
                </span>
                <span>📍 {current.city}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-white block">{current.servicePreview.name}</span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5 font-sans">
                    <Clock className="w-3 h-3" />
                    <span>{current.servicePreview.duration}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black font-mono block" style={{ color: current.themeColor }}>
                    {current.servicePreview.price}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-bold">
                    הזמנה מיידית
                  </span>
                </div>
              </div>

              {/* Simulated Automated WhatsApp Confirmation */}
              <div className="p-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 space-y-1 text-right">
                <div className="flex items-center justify-between text-[10px] text-[#25D366] font-bold">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>אישור אוטומטי (WhatsApp)</span>
                  </span>
                  <span>{current.whatsappPreview.status}</span>
                </div>
                <p className="text-[10px] text-zinc-200 font-sans leading-relaxed">
                  "{current.whatsappPreview.message}"
                </p>
              </div>

              {/* Live Feature Checkmarks */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-zinc-400 font-bold">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>קביעת תורים 24/7</span>
                </span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>סנכרון ענן מיידי</span>
                </span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>ללא הורדת אפליקציה</span>
                </span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>תזכורות WhatsApp</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
