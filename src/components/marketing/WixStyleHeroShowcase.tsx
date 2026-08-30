'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Calendar,
  Phone,
  Star,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface WixStyleHeroShowcaseProps {
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team', industry: string) => void;
}

export const WixStyleHeroShowcase: React.FC<WixStyleHeroShowcaseProps> = ({
  onOpenOnboarding,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const showcaseSites = [
    {
      id: 'barber',
      category: 'מספרת גברים & ברברשופ',
      businessName: 'המספרה של דביר',
      city: 'אריאל & רחובות',
      slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן',
      themeColor: '#C9A84C',
      bgGradient: 'from-amber-950/20 via-zinc-900 to-black',
      textColor: 'text-amber-400',
      badge: 'פיילוט חי באוויר 🚀',
      slug: 'dvir',
      isLive: true,
      services: [
        { name: 'תספורת גברים פרימיום', price: '80 ₪', time: '30 דק׳' },
        { name: 'עיצוב ופיסול זקן Master', price: '40 ₪', time: '20 דק׳' },
        { name: 'חבילת VIP (תספורת + זקן)', price: '110 ₪', time: '45 דק׳' },
      ],
      recentBooking: {
        client: 'איתי לוי',
        service: 'תספורת + פיסול זקן',
        time: 'היום בשעה 17:30',
        status: 'אושר בוואטסאפ ✓',
      },
    },
    {
      id: 'beauty',
      category: 'קוסמטיקה, לק ג׳ל & טיפוח',
      businessName: 'סטודיו מיה לקוסמטיקה',
      city: 'ראשון לציון',
      slogan: 'טיפולי פנים מתקדמים, מניקור לק ג׳ל ועיצוב גבות',
      themeColor: '#EC4899',
      bgGradient: 'from-pink-950/20 via-zinc-900 to-black',
      textColor: 'text-pink-400',
      badge: 'עיצוב מותאם קוסמטיקה ✨',
      slug: 'beauty',
      isLive: false,
      services: [
        { name: 'מניקור לק ג׳ל משולב', price: '130 ₪', time: '50 דק׳' },
        { name: 'טיפול פנים קלאסי עמוק', price: '280 ₪', time: '60 דק׳' },
        { name: 'עיצוב והרמת גבות', price: '90 ₪', time: '30 דק׳' },
      ],
      recentBooking: {
        client: 'נועה שחר',
        service: 'מניקור לק ג׳ל',
        time: 'מחר בשעה 10:00',
        status: 'אושר בוואטסאפ ✓',
      },
    },
    {
      id: 'salon',
      category: 'מספרת נשים & סלון יופי',
      businessName: 'סלון אלונה לעיצוב שיער',
      city: 'תל אביב - יפו',
      slogan: 'גוונים, בליאז׳, החלקות אורגניות ותסרוקות ערב',
      themeColor: '#A855F7',
      bgGradient: 'from-purple-950/20 via-zinc-900 to-black',
      textColor: 'text-purple-400',
      badge: 'ניהול זמני שהייה 💇‍♀️',
      slug: 'salon',
      isLive: false,
      services: [
        { name: 'גוונים / בליאז׳ פרימיום', price: '450 ₪', time: '120 דק׳' },
        { name: 'החלקה אורגנית משקמת', price: '600 ₪', time: '150 דק׳' },
        { name: 'תספורת ופאן מעוצב', price: '160 ₪', time: '45 דק׳' },
      ],
      recentBooking: {
        client: 'מאיה רוזן',
        service: 'בליאז׳ + תספורת',
        time: 'יום ג׳ בשעה 14:00',
        status: 'אושר בוואטסאפ ✓',
      },
    },
    {
      id: 'services',
      category: 'אינסטלציה & שירותי בית',
      businessName: 'דניאל מערכות מיזוג ואינסטלציה',
      city: 'מרכז והשרון',
      slogan: 'תיקון מזגנים, איתור נזילות וקריאות שירות מהירות',
      themeColor: '#0EA5E9',
      bgGradient: 'from-sky-950/20 via-zinc-900 to-black',
      textColor: 'text-sky-400',
      badge: 'חלונות הגעה ו-Waze 🔧',
      slug: 'services',
      isLive: false,
      services: [
        { name: 'בדיקת ותיקון מזגן', price: '250 ₪', time: 'חלון שעתיים' },
        { name: 'פתיחת סתימה ואיתור נזילה', price: '350 ₪', time: 'חלון שעתיים' },
        { name: 'התקנת נקודת מים / סיפון', price: '280 ₪', time: 'חלון שעה' },
      ],
      recentBooking: {
        client: 'יוסי כרמי',
        service: 'תיקון מזגן (חלון 10:00-12:00)',
        time: 'היום • שדרות רוטשילד',
        status: 'ניווט Waze מוכן ✓',
      },
    },
    {
      id: 'trainer',
      category: 'אימונים אישיים & קליניקה',
      businessName: 'Peak Performance קליניקה',
      city: 'הרצליה פיתוח',
      slogan: 'אימונים פונקציונליים 1-על-1 ושיקום תנועתי',
      themeColor: '#10B981',
      bgGradient: 'from-emerald-950/20 via-zinc-900 to-black',
      textColor: 'text-emerald-400',
      badge: 'לו״ז אימונים אישי 🏋️',
      slug: 'trainer',
      isLive: false,
      services: [
        { name: 'אימון אישי 1-על-1', price: '220 ₪', time: '50 דק׳' },
        { name: 'אבחון יציבה ותנועה ראשוני', price: '300 ₪', time: '60 דק׳' },
        { name: 'כרטיסיית 10 אימונים', price: '1,900 ₪', time: 'חבילה' },
      ],
      recentBooking: {
        client: 'רועי ברק',
        service: 'אימון אישי 1-על-1',
        time: 'מחר ב-08:00',
        status: 'אושר ביומן ✓',
      },
    },
  ];

  const current = showcaseSites[activeIndex];

  // Auto cycle showcase every 5 seconds if not hovered
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseSites.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, showcaseSites.length]);

  return (
    <div
      className="relative max-w-5xl mx-auto pt-6 pb-12 select-none"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      dir="rtl"
    >
      {/* Industry Archetype Selector Tabs */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-4 px-2 no-scrollbar">
        {showcaseSites.map((site, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={site.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${isActive
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 shadow-xs'
                }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: site.themeColor }}
              />
              <span>{site.category.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Showcase Container */}
      <div className="relative mt-2">
        {/* Subtle Background Glow Accent */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl opacity-25 transition-all duration-700 pointer-events-none -z-10"
          style={{ backgroundColor: current.themeColor }}
        />

        {/* Main Central Browser Mockup */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-500">
          {/* Top Browser Bar */}
          <div className="h-11 bg-slate-900/90 px-4 border-b border-slate-800 flex items-center justify-between">
            {/* Window Controls */}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            {/* URL Pill Bar */}
            <div
              className="px-4 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5"
              dir="ltr"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-200 font-bold">thecut.co.il</span>
              <span>/{current.slug}</span>
            </div>

            {/* Badge */}
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${current.themeColor}20`,
                color: current.themeColor,
                border: `1px solid ${current.themeColor}40`,
              }}
            >
              {current.badge}
            </span>
          </div>

          {/* Website Canvas Body */}
          <div className={`p-6 sm:p-8 bg-gradient-to-b ${current.bgGradient} text-white space-y-6`}>
            {/* Top Navigation Mock */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-black shadow-sm"
                  style={{ backgroundColor: current.themeColor }}
                >
                  {current.businessName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight">{current.businessName}</h4>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    📍 {current.city}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-300 font-medium">
                <span>מחירון</span>
                <span>מיקום והגעה</span>
                <span>ביקורות</span>
              </div>

              <button
                type="button"
                onClick={() => onOpenOnboarding('pro', current.category)}
                className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-black transition-transform hover:scale-105 cursor-pointer shadow-md"
                style={{ backgroundColor: current.themeColor }}
              >
                הזמנת תור אונליין
              </button>
            </div>

            {/* Hero & Services Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Headline & Services List */}
              <div className="md:col-span-7 space-y-4 text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200 text-xs font-bold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>קביעת תורים 24/7 ללא צורך בהורדת אפליקציה</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {current.slogan}
                </h3>

                {/* Service Items Cards */}
                <div className="space-y-2 pt-1">
                  {current.services.map((srv, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: current.themeColor }}
                        />
                        <div>
                          <span className="font-bold text-xs block text-zinc-100">{srv.name}</span>
                          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {srv.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono font-black text-sm"
                          style={{ color: current.themeColor }}
                        >
                          {srv.price}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-bold text-zinc-300">
                          בחר
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Floating Live Booking & WhatsApp Preview Cards */}
              <div className="md:col-span-5 space-y-3">
                {/* Live Simulated Booking Card */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2.5 shadow-xl">
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>תור חדש נקבע כעת!</span>
                    </span>
                    <span>לפני 2 דקות</span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-zinc-200">
                      {current.recentBooking.client.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-xs text-white block">
                        {current.recentBooking.client}
                      </strong>
                      <span className="text-[11px] text-zinc-300">
                        {current.recentBooking.service}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="text-zinc-400">מועד:</span>
                    <span className="font-bold text-white">{current.recentBooking.time}</span>
                  </div>
                </div>

                {/* Simulated WhatsApp Confirmation Message */}
                <div className="p-3.5 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 space-y-1.5 text-right">
                  <div className="flex items-center justify-between text-[10px] text-[#25D366] font-bold">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>הודעת אישור אוטומטית (WhatsApp)</span>
                    </span>
                    <span>{current.recentBooking.status}</span>
                  </div>
                  <p className="text-[11px] text-zinc-200 leading-tight">
                    "היי {current.recentBooking.client}! התור שלך ל{current.businessName} אושר בהצלחה. לחץ כאן לניווט ב-Waze 🚗"
                  </p>
                </div>

                {/* Action CTA for this archetype */}
                <div className="pt-2 flex items-center gap-2">
                  {current.isLive ? (
                    <Link
                      href={`/${current.slug}`}
                      target="_blank"
                      className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>צפה באתר לדוגמה החי</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenOnboarding('pro', current.category)}
                      className="flex-1 py-2.5 rounded-xl text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                      style={{ backgroundColor: current.themeColor }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>הקמת אתר כזה לעסק שלך</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={() =>
            setActiveIndex((prev) => (prev === 0 ? showcaseSites.length - 1 : prev - 1))
          }
          className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
          title="הקודם"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev + 1) % showcaseSites.length)}
          className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
          title="הבא"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Wix Style Floating Key Metrics Box */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
          <span className="text-[11px] text-slate-500 font-bold block">סנכרון ענן בזמן אמת</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-indigo-600">0 ₪</div>
          <span className="text-[11px] text-slate-500 font-bold block">התחלה מיידית בחינם</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-emerald-600">3 קליקים</div>
          <span className="text-[11px] text-slate-500 font-bold block">לקביעת תור ללקוח</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-slate-900">80%</div>
          <span className="text-[11px] text-slate-500 font-bold block">הפחתת ביטולים ב-WhatsApp</span>
        </div>
      </div>
    </div>
  );
};
