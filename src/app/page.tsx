'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Shield,
  Zap,
  ArrowLeft,
  MessageCircle,
  TrendingUp,
  Building2,
  Star,
  ExternalLink,
  ChevronRight,
  PhoneCall,
  Check,
  Smartphone,
  Layers,
  BarChart3,
  Sliders,
  Award,
  CreditCard,
  Send,
  Info,
} from 'lucide-react';

export default function SaaSPlatformLandingPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<
    'barber' | 'salon' | 'beauty' | 'services' | 'trainer'
  >('barber');

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const industryData = {
    barber: {
      icon: '💈',
      title: 'מספרות ועיצוב שיער גברים',
      tagline: 'ניהול זמנים מדויק, תיעוד נוסחת תספורת (פייד, זקן) ויומן מלא 24/7',
      stats: '94% מילוי יומן שבועי',
      isLive: true,
      slug: 'dvir',
      ctaLabel: 'צפו בדמו חי (המספרה של דביר)',
      waMsg: 'היי, ראיתי את מערכת CutWeb ואני מעוניין באתר ומערכת תורים למספרת גברים!',
      features: ['נוסחת תספורת אישית לכל לקוח ב-CRM', 'חסימת ימי מילואים/חירום בקליק', 'סנכרון בין מספר עובדים'],
    },
    salon: {
      icon: '💇‍♀️',
      title: 'מספרות נשים וסלוני יופי',
      tagline: 'שיוך טיפולים לפי משך זמן (צבע, החלקה, גוונים) וניהול עמדות עבודה',
      stats: 'חיסכון של 4 שעות שיחות ביום',
      isLive: false,
      slug: 'salon',
      ctaLabel: 'התאמת אתר ומערכת לסלון יופי 💬',
      waMsg: 'היי, ראיתי את מערכת CutWeb ואשמח להתאים אתר ומערכת תורים לסלון עיצוב שיער נשים!',
      features: ['הגדרת זמני שהייה לטיפולים מורכבים', 'גלריית עבודות וקטלוג תמונות', 'תזכורות אוטומטיות לפני טיפול'],
    },
    beauty: {
      icon: '💅',
      title: 'קוסמטיקה, ציפורניים & טיפוח',
      tagline: 'הזמנת תורים נוחה, אישורי הגעה בוואטסאפ ורשימת המתנה לחורים פנויים',
      stats: '0% ביטולים ללא הודעה מוקדמת',
      isLive: false,
      slug: 'beauty',
      ctaLabel: 'התאמת אתר לקוסמטיקה וציפורניים 💬',
      waMsg: 'היי, ראיתי את מערכת CutWeb ואשמח להתאים אתר ומערכת לקוסמטיקה, לק ג\'ל וטיפוח!',
      features: ['רשימת המתנה אוטומטית (Waitlist)', 'אישורי הגעה ישירים בוואטסאפ', 'שאלון העדפות ורגישויות'],
    },
    services: {
      icon: '🔧',
      title: 'אינסטלציה, טכנאים & שירותי בית',
      tagline: 'תיאום חלונות הגעה (לדוגמה 10:00-12:00), קבלת כתובת מדויקת והערות',
      stats: 'סדר מושלם בקריאות שירות',
      isLive: false,
      slug: 'services',
      ctaLabel: 'התאמת מערכת לשירותי בית וטכנאים 💬',
      waMsg: 'היי, ראיתי את מערכת CutWeb ואשמח להתאים מערכת תורים וחלונות הגעה לשירותי בית!',
      features: ['בחירת חלונות זמן (בוקר / צהריים / ערב)', 'איסוף כתובת והוראות הגעה בטופס', 'ניווט Waze ישיר לבית הלקוח'],
    },
    trainer: {
      icon: '🏋️',
      title: 'מאמנים אישיים, קליניקות & טיפולים',
      tagline: 'לו״ז אימונים פרטיים וסדרות טיפולים עם מעקב התקדמות אישי',
      stats: 'הכפלת לקוחות חוזרים',
      isLive: false,
      slug: 'trainer',
      ctaLabel: 'התאמת מערכת לקליניקה ומאמנים 💬',
      waMsg: 'היי, ראיתי את מערכת CutWeb ואשמח להתאים מערכת זימון תורים לקליניקה ואימונים!',
      features: ['תיאום מפגשים אישיים וסדרות', 'מעקב לקוחות ופרטי קשר מלאים', 'קישור יומן ל-Google / Apple Calendar'],
    },
  };

  const currentInd = industryData[selectedIndustry];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">
      {/* Top Professional Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/85 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight block leading-tight text-slate-900">
                Cut<span className="text-indigo-600">Web</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide">
                Business & Scheduling OS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <Link href="#solutions" className="hover:text-indigo-600 transition-colors">פתרונות לפי ענף</Link>
            <Link href="#features" className="hover:text-indigo-600 transition-colors">יכולות המערכת</Link>
            <Link href="#pricing" className="hover:text-indigo-600 transition-colors">חבילות ומחירים</Link>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/admin/login"
              className="text-xs font-bold px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              כניסת עסקים
            </Link>
            <Link
              href="/dvir"
              target="_blank"
              className="text-xs font-black px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/25 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>דמו חי (מספרת גברים)</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Light Crisp Aesthetic */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]">
        {/* Subtle geometric & light gradient accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-200/40 via-purple-100/30 to-sky-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>הפלטפורמה המתקדמת בישראל לניהול וזימון תורים</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
            הפכו את העסק שלכם למערכת{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
              חכמה ויעילה לזימון תורים
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            אתר נחיתה יוקרתי ומותאם אישית ללקוחות, יומן אדמין חי עם גרירת תורים (Drag & Drop), תזכורות WhatsApp אוטומטיות, וניהול לקוחות מתקדם — הכל בקישור מהיר ללא צורך בהורדת אפליקציה.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dvir"
              target="_blank"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>צפו באתר לדוגמה (פיילוט מספרה)</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/972500000000?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%9E%D7%AA%20%D7%90%D7%AA%D7%A8%20%D7%95%D7%9E%D7%A2%D7%A8%D7%9B%D7%AA%20%D7%AA%D7%95%D7%A8%D7%99%D7%9D%20%D7%9C%D7%A2%D7%A1%D7%A2%20%D7%A9%D7%9C%D7%99"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200/90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>דברו איתנו בוואטסאפ</span>
            </a>
          </div>

          {/* Social Proof Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-8 text-xs text-slate-600 font-bold border-t border-slate-200/70 mt-10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>זימון תורים 24/7 ללא הפסקה</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>הפחתת ביטולים עם WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>עובד ישירות בדפדפן (ללא הורדת אפליקציה)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>סנכרון ענן בזמן אמת</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Industry Solutions Showcase */}
      <section id="solutions" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
            פתרונות מותאמים אישית
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            בנוי בדיוק לפי הצרכים של המקצוע שלכם
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            בחרו את ענף הפעילות שלכם וגלו כיצד CutWeb מותאם אליכם
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {(
            [
              ['barber', '💈 מספרות גברים'],
              ['salon', '💇‍♀️ סלוני יופי'],
              ['beauty', '💅 קוסמטיקה & ציפורניים'],
              ['services', '🔧 אינסטלציה & שירותי בית'],
              ['trainer', '🏋️ מאמנים & קליניקות'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedIndustry(key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                selectedIndustry === key
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Dynamic Industry Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg shadow-slate-200/40 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-black">
              <span>{currentInd.icon}</span>
              <span>{currentInd.title}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {currentInd.tagline}
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 pt-2">
              {currentInd.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-3">
              {currentInd.isLive ? (
                <Link
                  href={`/${currentInd.slug}`}
                  target="_blank"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs hover:scale-105"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{currentInd.ctaLabel}</span>
                </Link>
              ) : (
                <a
                  href={`https://wa.me/972587815071?text=${encodeURIComponent(currentInd.waMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 hover:scale-105"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{currentInd.ctaLabel}</span>
                </a>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 text-center">
            <div className="text-4xl">{currentInd.icon}</div>
            <div className="text-2xl font-black text-indigo-600">{currentInd.stats}</div>
            <p className="text-xs text-slate-500">
              מערכת התורים מפנה לכם שעות יקרות של מענה טלפוני וממלאת את היומן באופן עצמאי.
            </p>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>📱 ממשק נייד ללקוחות</span>
              <span>⚡ סנכרון ענן חי</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Pillars Features Grid */}
      <section id="features" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              יכולות טכנולוגיות
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              כל הכלים שהעסק שלכם צריך במקום אחד
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              חוויית משתמש פרימיום הן עבור הלקוחות שלכם והן עבורכם במערכת הניהול
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">אתר הזמנות ייעודי ללקוח</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                דף נחיתה מעוצב תחת הכתובת שלכם, מותאם מושלם לנייד, עם בחירת שירות, יום ושעה ב-3 קליקים פשוטים.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">יומן Drag & Drop אינטראקטיבי</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                יומן מודרני מבוסס Schedule-X המאפשר לגרור תורים בעכבר בין שעות וימים בסנכרון ענן מיידי.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">תזכורות ואישורים בוואטסאפ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                הלקוחות מקבלים קישור אישור מיידי לוואטסאפ עם כל פרטי התור, ניווט ב-Waze וקובץ תזכורת ליומן.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">ניהול עובדים וסניפים מרובים</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                שיוך שירותים לאנשי צוות שונים, הגדרת הרשאות מדויקות ושליטה בלוחות זמנים של מספר סניפים במקביל.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">רשימת המתנה חכמה (Waitlist)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                מילוי חורים אוטומטי בעת ביטולים – לקוחות ברשימת ההמתנה מקבלים הודעה על תור שהתפנה.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">CRM ואנליטיקה עסקית</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                דוחות הכנסה, ממוצע עסקה, שעות שיא, היסטוריית טיפולים אישית ותיעוד העדפות מדויק לכל לקוח.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern SaaS Pricing Section with Updated 3-Tier Model */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              חבילות מנוי שקופות
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              תמחור שקוף ופשוט לכל שלב בעסק
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ללא התחייבות, אפשרות לביטול בכל עת, תמיכה מלאה בהקמה ובהגדרות
            </p>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              חיוב חודשי
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 rounded-full bg-slate-200 p-1 transition-colors cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-indigo-600 transition-transform ${
                  billingCycle === 'annual' ? '-translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
                חיוב שנתי
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                חודשיים חינם 🎁
              </span>
            </div>
          </div>

          {/* 3 Main Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch mb-14">
            {/* 1. Starter (חינמי) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  חינמי (Starter)
                </div>
                <div className="text-3xl font-black text-slate-900">
                  0 ₪ <span className="text-xs text-slate-400 font-normal">/ חינם לתמיד</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  מיועד לספרים מתחילים, פיילוט והתנסות ללא שום סיכון
                </p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>עד 35 תורים</strong> בחודש</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>איש צוות יחיד</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>סאב-דומיין ייעודי (thecut.co.il/[slug])</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>תזכורות <code>wa.me</code> בלחיצה ישירה</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Info className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>כולל חתימת מיתוג המערכת בתחתית</span>
                  </div>
                </div>
              </div>
              <a
                href="https://wa.me/972500000000?text=%D7%94%D7%99%D7%99%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%94%D7%AA%D7%97%D7%99%D7%9C%20%D7%A2%D7%9D%20%D7%9E%D7%A1%D7%9C%D7%95%D7%9C%20Starter%20%D7%94%D7%97%D7%99%D7%A0%D7%9E%D7%99"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors block cursor-pointer"
              >
                התחל בחינם עכשיו
              </a>
            </div>

            {/* 2. Pro (עצמאי) - FEATURED */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border-2 border-indigo-600 relative flex flex-col justify-between space-y-6 shadow-xl shadow-indigo-600/10 scale-105 z-10">
              <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                הכי פופולרי 🔥
              </div>
              <div className="space-y-4">
                <div className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                  עצמאי (Pro)
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">
                    {billingCycle === 'monthly' ? '59 ₪' : '490 ₪'}
                    <span className="text-xs text-slate-500 font-normal">
                      {billingCycle === 'monthly' ? ' / חודש' : ' / שנה (חיסכון של חודשיים!)'}
                    </span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                      ~ 40.8 ₪ לחודש בלבד
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  למספרה של איש אחד, קוסמטיקאית, וטכנאי עצמאי שרוצים מיתוג מלא
                </p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-800 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span><strong>ללא הגבלת תורים</strong> (תורים חופשיים)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span><strong>הסרת מיתוג המערכת</strong> לחלוטין</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>חיבור דומיין אישי משלכם</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>התאמת עיצוב, תמונות וצבעים מלאה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>יומן Drag & Drop חי (Schedule-X)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>מיני-CRM לקוחות והיסטוריית טיפולים</span>
                  </div>
                </div>
              </div>
              <a
                href={`https://wa.me/972500000000?text=${encodeURIComponent(
                  `היי, אני מעוניין להצטרף למסלול Pro (${billingCycle === 'monthly' ? '59 ₪ לחודש' : '490 ₪ לשנה'})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs text-center transition-all shadow-md shadow-indigo-600/25 block cursor-pointer"
              >
                הצטרף למסלול Pro
              </a>
            </div>

            {/* 3. Team (צוות) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  צוות (Team)
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">
                    {billingCycle === 'monthly' ? '119 ₪' : '990 ₪'}
                    <span className="text-xs text-slate-500 font-normal">
                      {billingCycle === 'monthly' ? ' / חודש' : ' / שנה'}
                    </span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                      ~ 82.5 ₪ לחודש בלבד
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  למספרות וקליניקות עם 2–5 עובדים / כיסאות עבודה
                </p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>כל מה שכלול ב-Pro</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>עד 5 עובדים</strong> עם יומן אישי לכל אחד</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>הרשאות גישה אישיות לכל איש צוות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>רשימת המתנה חכמה (Smart Waitlist)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>דוח פעילות והכנסות לפי איש צוות</span>
                  </div>
                </div>
              </div>
              <a
                href={`https://wa.me/972500000000?text=${encodeURIComponent(
                  `היי, אני מעוניין להצטרף למסלול Team (${billingCycle === 'monthly' ? '119 ₪ לחודש' : '990 ₪ לשנה'})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors block cursor-pointer"
              >
                הצטרף למסלול Team
              </a>
            </div>
          </div>

          {/* Paid Add-ons Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>תוספות ושירותים משלימים (Add-ons)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  התאימו את החבילה במדויק להיקף הפעילות של העסק ללא שחיקת מרווחים
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                זמין לכל המסלולים
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {/* Add-on 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                    <Send className="w-4 h-4 text-indigo-600" />
                    <span>תזכורות WhatsApp/SMS אוטומטיות מהשרת</span>
                  </div>
                  <span className="text-xs font-black text-indigo-600">39 ₪</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  בנק של 500 הודעות תזכורת אוטומטיות הנשלחות ברקע 24 שעות ושעתיים לפני התור. (תזכורות ידניות בלחיצה נשארות חינם לתמיד!).
                </p>
              </div>

              {/* Add-on 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>סליקת אשראי ומקדמות ביטחון</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600">חיבור ישיר</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  חיבור מסוף סליקה ישיר לחשבון הבנק שלכם לגביית מקדמות ומניעת אי-הגעות של לקוחות ללא עמלות תיווך מיותרות.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Clean Footer */}
      <footer className="py-12 bg-white border-t border-slate-200/80 text-center text-xs text-slate-500 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-bold">
          <Link href="/dvir" className="hover:text-indigo-600 transition-colors">אתר לדוגמה (Live Demo)</Link>
          <Link href="/admin/login" className="hover:text-indigo-600 transition-colors">כניסת מנהלי עסק</Link>
          <Link href="/super-admin" className="hover:text-indigo-600 transition-colors">Super Admin</Link>
          <Link href="/accessibility" className="hover:text-indigo-600 transition-colors">הצהרת נגישות</Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">תנאי שימוש</Link>
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">מדיניות פרטיות</Link>
        </div>
        <p>© {new Date().getFullYear()} CutWeb Platform · כל הזכויות שמורות לפלטפורמת CutWeb</p>
      </footer>
    </div>
  );
}
