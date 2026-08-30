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
  Sparkle,
} from 'lucide-react';

export default function SaaSPlatformLandingPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<
    'barber' | 'salon' | 'beauty' | 'services' | 'trainer'
  >('barber');

  const industryData = {
    barber: {
      icon: '💈',
      title: 'מספרות ועיצוב שיער גברים',
      tagline: 'ניהול זמנים מדויק, תיעוד נוסחת תספורת (פייד, זקן) ויומן מלא 24/7',
      stats: '94% מילוי יומן שבועי',
      slug: 'dvir',
      features: ['נוסחת תספורת אישית לכל לקוח ב-CRM', 'חסימת ימי מילואים/חירום בקליק', 'סנכרון בין מספר עובדים'],
    },
    salon: {
      icon: '💇‍♀️',
      title: 'מספרות נשים וסלוני יופי',
      tagline: 'שיוך טיפולים לפי משך זמן (צבע, החלקה, גוונים) וניהול עמדות עבודה',
      stats: 'חיסכון של 4 שעות שיחות ביום',
      slug: 'dvir',
      features: ['הגדרת זמני שהייה לטיפולים מורכבים', 'גלריית עבודות וקטלוג תמונות', 'תזכורות אוטומטיות לפני טיפול'],
    },
    beauty: {
      icon: '💅',
      title: 'קוסמטיקה, ציפורניים & טיפוח',
      tagline: 'הזמנת תורים נוחה, אישורי הגעה בוואטסאפ ורשימת המתנה לחורים פנויים',
      stats: '0% ביטולים ללא הודעה מוקדמת',
      slug: 'dvir',
      features: ['רשימת המתנה אוטומטית (Waitlist)', 'אישורי הגעה ישירים בוואטסאפ', 'שאלון העדפות ורגישויות'],
    },
    services: {
      icon: '🔧',
      title: 'אינסטלציה, טכנאים & שירותי בית',
      tagline: 'תיאום חלונות הגעה (לדוגמה 10:00-12:00), קבלת כתובת מדויקת והערות',
      stats: 'סדר מושלם בקריאות שירות',
      slug: 'dvir',
      features: ['בחירת חלונות זמן (בוקר / צהריים / ערב)', 'איסוף כתובת והוראות הגעה בטופס', 'ניווט Waze ישיר לבית הלקוח'],
    },
    trainer: {
      icon: '🏋️',
      title: 'מאמנים אישיים, קליניקות & טיפולים',
      tagline: 'לו״ז אימונים פרטיים וסדרות טיפולים עם מעקב התקדמות אישי',
      stats: 'הכפלת לקוחות חוזרים',
      slug: 'dvir',
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
              className="text-xs font-black px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/25 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>צפה באתר לדוגמה</span>
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
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>התנסו באתר לדוגמה (Live Demo)</span>
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
              <Link
                href={`/${currentInd.slug}`}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>צפה באתר לדוגמה</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              חבילות מנוי שקופות
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              תמחור שקוף ופשוט שמתאים לכל שלב
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ללא התחייבות, אפשרות לביטול בכל עת, ליווי ותמיכה מלאה בהקמה
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Starter Plan */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Starter Plan</div>
                <div className="text-3xl font-black text-slate-900">₪99 <span className="text-xs text-slate-400 font-normal">/ חודש</span></div>
                <p className="text-xs text-slate-500">אידיאלי לעצמאיים ולעסקים בתחילת הדרך</p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <span>אתר הזמנות מותאם אישית</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <span>עד 300 תורים בחודש</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <span>עובד יחיד / סניף 1</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <span>אישורי הגעה בוואטסאפ</span></div>
                </div>
              </div>
              <a
                href="https://wa.me/972500000000?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%97%D7%91%D7%99%D7%97%D7%AA%20Starter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors block"
              >
                בחר בחבילה זו
              </a>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border-2 border-indigo-600 relative flex flex-col justify-between space-y-6 shadow-xl shadow-indigo-600/10 scale-105 z-10">
              <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                הכי פופולרי 🔥
              </div>
              <div className="space-y-4">
                <div className="text-xs font-black text-indigo-600 uppercase tracking-wider">Pro Business</div>
                <div className="text-3xl font-black text-slate-900">₪179 <span className="text-xs text-slate-400 font-normal">/ חודש</span></div>
                <p className="text-xs text-slate-500">למספרות, קליניקות ועסקים עם צוות</p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-800 font-medium">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> <span>תורים ללא הגבלה</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> <span>עד 5 אנשי צוות / עובדים</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> <span>יומן Drag & Drop חי (Schedule-X)</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> <span>רשימת המתנה חכמה</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> <span>אנליטיקה ודוחות הכנסות</span></div>
                </div>
              </div>
              <a
                href="https://wa.me/972500000000?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%97%D7%91%D7%99%D7%97%D7%AA%20Pro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs text-center transition-all shadow-md shadow-indigo-600/25 block cursor-pointer"
              >
                התחל עכשיו עם Pro
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Enterprise Network</div>
                <div className="text-3xl font-black text-slate-900">₪299 <span className="text-xs text-slate-400 font-normal">/ חודש</span></div>
                <p className="text-xs text-slate-500">לרשתות סניפים ולמותגים מובילים</p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <span>סניפים ועובדים ללא הגבלה</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <span>חיבור דומיין אישי מלא</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <span>התאמת מיתוג ועיצוב אישית</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <span>מנהל תיק לקוח וליווי VIP</span></div>
                </div>
              </div>
              <a
                href="https://wa.me/972500000000?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%97%D7%91%D7%99%D7%97%D7%AA%20Enterprise"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors block"
              >
                צור קשר ל-Enterprise
              </a>
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
