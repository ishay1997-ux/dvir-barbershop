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
  Smartphone,
  Monitor,
  Star,
  Zap,
  Check,
} from 'lucide-react';

interface WixStyleHeroShowcaseProps {
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team', industry: string) => void;
}

export const WixStyleHeroShowcase: React.FC<WixStyleHeroShowcaseProps> = ({
  onOpenOnboarding,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  const [hasSimulatedBooking, setHasSimulatedBooking] = useState(false);

  const showcaseSites = [
    {
      id: 'barber',
      category: 'מספרות גברים וזקן',
      tabLabel: '💈 מספרות',
      businessName: 'המספרה של דביר',
      city: 'אריאל & רחובות',
      slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן פרימיום',
      themeColor: '#C9A84C',
      bgGradient: 'from-amber-950/30 via-slate-900 to-black',
      textColor: 'text-amber-400',
      badge: 'פיילוט חי באוויר 🚀',
      slug: 'dvir',
      isLive: true,
      services: [
        { name: 'תספורת גברים פרימיום', price: 80, time: '30 דק׳' },
        { name: 'עיצוב ופיסול זקן Master', price: 40, time: '20 דק׳' },
        { name: 'חבילת VIP (תספורת + זקן)', price: 110, time: '45 דק׳' },
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
      category: 'קוסמטיקה וציפורניים',
      tabLabel: '💅 ביוטי וציפורניים',
      businessName: 'סטודיו שירן ביוטי & בוטיק',
      city: 'ראשון לציון',
      slogan: 'עיצוב ציפורניים במבנה אנטומי, הרמת ריסים וטיפולי פנים',
      themeColor: '#EC4899',
      bgGradient: 'from-pink-950/30 via-slate-900 to-black',
      textColor: 'text-pink-400',
      badge: 'אתר הדגמה חי ✨',
      slug: 'beauty',
      isLive: true,
      services: [
        { name: 'מבנה אנטומי & לק ג׳ל פרימיום', price: 160, time: '60 דק׳' },
        { name: 'הארכת ציפורניים בפוליג׳ל', price: 250, time: '90 דק׳' },
        { name: 'הרמת ריסים & בוטוקס', price: 220, time: '50 דק׳' },
      ],
      recentBooking: {
        client: 'נועה שחר',
        service: 'מבנה אנטומי & לק ג׳ל',
        time: 'מחר בשעה 10:00',
        status: 'אושר בוואטסאפ ✓',
      },
    },
    {
      id: 'spa',
      category: 'ספא ועיסויים',
      tabLabel: '🌿 ספא ועיסויים',
      businessName: 'ספא לוטוס – בית למנוחה ומרגוע',
      city: 'רמת השרון',
      slogan: 'עיסויים מקצועיים, שחרור שרירים עמוק ופינוק הוליסטי',
      themeColor: '#14B8A6',
      bgGradient: 'from-teal-950/30 via-slate-900 to-black',
      textColor: 'text-teal-400',
      badge: 'אתר הדגמה חי 🌿',
      slug: 'spa',
      isLive: true,
      services: [
        { name: 'עיסוי שוודי קלאסי משחרר', price: 280, time: '60 דק׳' },
        { name: 'עיסוי רקמות עמוק לספורטאים', price: 320, time: '60 דק׳' },
        { name: 'טיפול אבנים חמות הוליסטי', price: 360, time: '75 דק׳' },
      ],
      recentBooking: {
        client: 'דניאל כהן',
        service: 'עיסוי רקמות עמוק',
        time: 'יום ד׳ בשעה 16:00',
        status: 'אושר בוואטסאפ ✓',
      },
    },
    {
      id: 'trainer',
      category: 'אימוני כושר אישיים',
      tabLabel: '🏋️ מאמני כושר',
      businessName: 'סטודיו אופק – אימונים אישיים',
      city: 'הרצליה פיתוח',
      slogan: 'אימוני כושר אישיים, חיטוב והעלאת מסת שריר',
      themeColor: '#10B981',
      bgGradient: 'from-emerald-950/30 via-slate-900 to-black',
      textColor: 'text-emerald-400',
      badge: 'אתר הדגמה חי 🏋️',
      slug: 'trainer',
      isLive: true,
      services: [
        { name: 'אימון אישי 1-על-1 VIP', price: 200, time: '60 דק׳' },
        { name: 'כרטיסיית 10 אימונים אישיים', price: 1800, time: '10 מפגשים' },
        { name: 'אימון זוגי / חברים', price: 280, time: '60 דק׳' },
      ],
      recentBooking: {
        client: 'רועי ברק',
        service: 'אימון אישי 1-על-1',
        time: 'מחר ב-08:00',
        status: 'אושר ביומן ✓',
      },
    },
    {
      id: 'clinic',
      category: 'קליניקות אסתטיקה',
      tabLabel: '🩺 קליניקות',
      businessName: 'קליניקת ד״ר לוי לאסתטיקה רפואית',
      city: 'תל אביב',
      slogan: 'רפואה אסתטית מתקדמת, פיסול פנים, בוטוקס וחומצה היאלורונית',
      themeColor: '#0EA5E9',
      bgGradient: 'from-sky-950/30 via-slate-900 to-black',
      textColor: 'text-sky-400',
      badge: 'אתר הדגמה חי 🩺',
      slug: 'clinic',
      isLive: true,
      services: [
        { name: 'פגישת אבחון ותכנון טיפול', price: 200, time: '30 דק׳' },
        { name: 'הזרקת בוטוקס רפואי מדויק', price: 750, time: '30 דק׳' },
        { name: 'פיסול שפתיים חומצה היאלורונית', price: 1400, time: '45 דק׳' },
      ],
      recentBooking: {
        client: 'מיכל אברהם',
        service: 'פיסול שפתיים פרימיום',
        time: 'היום ב-13:30',
        status: 'אושר בוואטסאפ ✓',
      },
    },
    {
      id: 'services',
      category: 'טכנאים ושירותי בית',
      tabLabel: '🔧 טכנאים ושירות',
      businessName: 'שרון שירותי מיזוג וחשמל',
      city: 'מרכז והשרון',
      slogan: 'התקנה ותיקון מזגנים, פתרונות חשמל מתקדמים ושירות מהיר',
      themeColor: '#F59E0B',
      bgGradient: 'from-amber-950/30 via-slate-900 to-black',
      textColor: 'text-amber-400',
      badge: 'חלונות הגעה ו-Waze 🔧',
      slug: 'services',
      isLive: true,
      services: [
        { name: 'ביקור ובדיקת תקלה מקיפה', price: 250, time: 'חלון 45 דק׳' },
        { name: 'מילוי גז ותיקון דליפות', price: 450, time: 'חלון שעה' },
        { name: 'ניקוי עמוק וחיטוי בקטריאלי', price: 380, time: 'חלון שעה' },
      ],
      recentBooking: {
        client: 'יוסי כרמי',
        service: 'בדיקת תקלה במזגן',
        time: 'היום • חלון 10:00-12:00',
        status: 'ניווט Waze מוכן ✓',
      },
    },
  ];

  const current = showcaseSites[activeIndex];
  const activeService = current.services[selectedServiceIndex] || current.services[0];

  // Auto cycle showcase every 6 seconds if not hovered or clicked
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseSites.length);
      setSelectedServiceIndex(0);
      setHasSimulatedBooking(false);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, showcaseSites.length]);

  const handleSelectNiche = (idx: number) => {
    setActiveIndex(idx);
    setSelectedServiceIndex(0);
    setHasSimulatedBooking(false);
  };

  const triggerSimulateBooking = () => {
    setHasSimulatedBooking(true);
    setTimeout(() => {
      // Keep it active
    }, 500);
  };

  return (
    <div
      className="relative max-w-5xl mx-auto pt-6 pb-12 select-none"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      dir="rtl"
    >
      {/* Top Controls: Niche Selector + Device Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
        {/* Industry Archetype Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 px-1 w-full sm:w-auto no-scrollbar">
          {showcaseSites.map((site, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={site.id}
                onClick={() => handleSelectNiche(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-md scale-105'
                    : 'bg-white/90 hover:bg-white text-slate-600 border border-slate-200 shadow-xs'
                }`}
              >
                <span>{site.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop vs Mobile Toggle */}
        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-slate-200 shadow-xs shrink-0">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>דסקטופ</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>מובייל (PWA)</span>
          </button>
        </div>
      </div>

      {/* 3D Showcase Container */}
      <div className="relative mt-2">
        {/* Subtle Background Glow Accent */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 transition-all duration-700 pointer-events-none -z-10"
          style={{ backgroundColor: current.themeColor }}
        />

        {/* Device View Render: Desktop Browser vs Mobile Phone */}
        {deviceMode === 'desktop' ? (
          /* Desktop Browser Mockup */
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
                <span className="text-slate-200 font-bold">cutweb.app</span>
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
                  onClick={triggerSimulateBooking}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-black transition-transform hover:scale-105 cursor-pointer shadow-md"
                  style={{ backgroundColor: current.themeColor }}
                >
                  הזמנת תור אונליין
                </button>
              </div>

              {/* Hero & Services Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Column: Headline & Interactive Services List */}
                <div className="md:col-span-7 space-y-4 text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200 text-xs font-bold backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>קביעת תורים 24/7 ללא צורך בהורדת אפליקציה</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {current.slogan}
                  </h3>

                  {/* Service Items Cards (Interactive selection) */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] text-slate-400 font-bold">
                      לחצו על שירות כדי לדמות את חוויית הלקוח:
                    </div>
                    {current.services.map((srv, i) => {
                      const isSelected = selectedServiceIndex === i;
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedServiceIndex(i);
                            setHasSimulatedBooking(false);
                          }}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-white/15 border-white/40 shadow-md'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
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
                              {srv.price} ₪
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                isSelected
                                  ? 'bg-white text-slate-950 font-black'
                                  : 'bg-white/10 text-zinc-300'
                              }`}
                            >
                              {isSelected ? 'נבחר ✓' : 'בחר'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Floating Simulated Booking Card */}
                <div className="md:col-span-5 space-y-3">
                  {/* Selected Booking Preview Summary Card */}
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300 border-b border-white/10 pb-2">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>יומן פתוח לתורים</span>
                      </span>
                      <span>היום פנוי</span>
                    </div>

                    <div className="space-y-1 text-right">
                      <span className="text-[11px] text-zinc-400">שירות שנבחר כעת:</span>
                      <div className="font-black text-sm text-white flex items-center justify-between">
                        <span>{activeService.name}</span>
                        <span style={{ color: current.themeColor }} className="font-mono">
                          {activeService.price} ₪
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={triggerSimulateBooking}
                      className="w-full py-2.5 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                      style={{ backgroundColor: current.themeColor }}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{hasSimulatedBooking ? '✓ תור שוריין בהצלחה!' : 'שריון תור ב-1 קליק (הדמיה)'}</span>
                    </button>
                  </div>

                  {/* Simulated WhatsApp Confirmation Message */}
                  <div
                    className={`p-3.5 rounded-2xl border transition-all duration-500 space-y-1.5 text-right ${
                      hasSimulatedBooking
                        ? 'bg-[#25D366]/25 border-[#25D366] shadow-lg scale-105'
                        : 'bg-[#25D366]/15 border-[#25D366]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#25D366] font-bold">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>הודעת אישור אוטומטית (WhatsApp)</span>
                      </span>
                      <span className="font-mono">{hasSimulatedBooking ? 'נשלח עכשיו ✓' : current.recentBooking.status}</span>
                    </div>
                    <p className="text-[11px] text-zinc-100 leading-tight font-sans">
                      "היי {current.recentBooking.client}! התור שלך ל{activeService.name} ב{current.businessName} אושר בהצלחה ✂️ לחץ כאן לניווט ב-Waze 🚗"
                    </p>
                  </div>

                  {/* Action CTA for this archetype */}
                  <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
                    <Link
                      href={`/${current.slug}`}
                      target="_blank"
                      className="flex-1 w-full py-2 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>צפה באתר לדוגמה ↗</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => onOpenOnboarding('pro', current.category)}
                      className="flex-1 w-full py-2 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                      style={{ backgroundColor: current.themeColor }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>פתח אתר כזה בחינם</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Phone Mockup View (iPhone Frame) */
          <div className="max-w-[340px] mx-auto bg-slate-950 rounded-[44px] border-[6px] border-slate-800 shadow-2xl p-4 overflow-hidden relative text-white space-y-4">
            {/* Dynamic Island / Speaker Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800 ml-2" />
            </div>

            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-black"
                  style={{ backgroundColor: current.themeColor }}
                >
                  {current.businessName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black truncate max-w-[150px]">{current.businessName}</h4>
                  <span className="text-[9px] text-zinc-400">📍 {current.city}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">פתוח לתורים</span>
            </div>

            {/* Mobile Hero & Slogan */}
            <div className="space-y-1.5 text-right">
              <span className="text-[10px] text-zinc-400 font-sans">הזמנת תור אונליין:</span>
              <h3 className="text-sm font-black leading-snug">{current.slogan}</h3>
            </div>

            {/* Mobile Services Selection List */}
            <div className="space-y-2">
              {current.services.map((srv, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedServiceIndex(i)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                    selectedServiceIndex === i
                      ? 'bg-white/15 border-white/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-white text-[11px]">{srv.name}</span>
                    <span className="text-[9px] text-zinc-400">{srv.time}</span>
                  </div>
                  <span className="font-mono font-black" style={{ color: current.themeColor }}>
                    {srv.price} ₪
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile Bottom Booking Bar */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={triggerSimulateBooking}
                className="w-full py-2.5 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1 shadow-md cursor-pointer"
                style={{ backgroundColor: current.themeColor }}
              >
                <span>{hasSimulatedBooking ? '✓ נשלח לוואטסאפ!' : `קבע תור · ${activeService.price} ₪`}</span>
              </button>
              <span className="text-[9px] text-zinc-400 block text-center">
                ללא צורך בהורדת אפליקציה · אישור מיידי
              </span>
            </div>
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={() =>
            setActiveIndex((prev) => (prev === 0 ? showcaseSites.length - 1 : prev - 1))
          }
          className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
          title="הקודם"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev + 1) % showcaseSites.length)}
          className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
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
