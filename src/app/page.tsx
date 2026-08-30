'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scissors,
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
} from 'lucide-react';

export default function SaaSPlatformLandingPage() {
  return (
    <div className="min-h-screen bg-[#0F0F10] text-white font-sans selection:bg-[#C9A84C] selection:text-black" dir="rtl">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0F0F10]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B89230] to-[#E8D490] flex items-center justify-center text-black font-black shadow-lg shadow-[#C9A84C]/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight block leading-tight text-white">
                The Cut <span className="text-[#C9A84C]">· SaaS Platform</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">מערכת זימון תורים וניהול עסקים</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="#pricing"
              className="text-xs font-bold text-zinc-300 hover:text-white transition-colors hidden sm:inline"
            >
              חבילות ומחירים
            </Link>
            <Link
              href="#features"
              className="text-xs font-bold text-zinc-300 hover:text-white transition-colors hidden sm:inline"
            >
              פיצ'רים
            </Link>
            <Link
              href="/admin/login"
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>כניסת עסקים</span>
            </Link>
            <Link
              href="/dvir"
              className="text-xs font-black px-4 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>צפה באתר לדוגמה</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A84C]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-black shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>הפלטפורמה המתקדמת בישראל לניהול וזימון תורים</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight sm:leading-tight tracking-tight">
            הפכו את העסק שלכם לאימפריה של <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#DFCA85] via-[#C9A84C] to-[#E8D490] bg-clip-text text-transparent">
              זימון תורים ולקוחות מרוצים
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            אתר נחיתה ממותג לעסק שלכם, יומן חכם עם גרירת תורים (Drag & Drop), תזכורות וואטסאפ אוטומטיות, וניהול לקוחות מתקדם — הכל בקישור אחד ללא צורך בהתקנת אפליקציה!
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dvir"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-sm transition-all shadow-xl shadow-[#C9A84C]/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>התנסו באתר לדוגמה (Live Demo)</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/972500000000?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A7%D7%9E%D7%AA%20%D7%90%D7%AA%D7%A8%20%D7%95%D7%9E%D7%A2%D7%A8%D7%9B%D7%AA%20%D7%AA%D7%95%D7%A8%D7%99%D7%9D%20%D7%9C%D7%A2%D7%A1%D7%A2%20%D7%A9%D7%9C%D7%99"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>דברו איתנו בוואטסאפ</span>
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-8 text-xs text-zinc-400 font-bold border-t border-white/10 mt-10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>זימון 24/7 ללא הפסקה</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>הפחתת ביטולים עם WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ללא צורך בהתקנת אפליקציה</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>סנכרון ענן בזמן אמת</span>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Industries Bar */}
      <section className="py-8 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-black uppercase tracking-wider text-[#C9A84C] mb-6">
            פלטפורמה אחת מותאמת אישית לכל ענפי השירותים
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-1">
              <div className="text-2xl">💈</div>
              <h4 className="text-xs font-black text-white">מספרות ועיצוב שיער</h4>
              <p className="text-[10px] text-zinc-400">משבצות זמן ונוסחת תספורת</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-1">
              <div className="text-2xl">💅</div>
              <h4 className="text-xs font-black text-white">קוסמטיקה & ציפורניים</h4>
              <p className="text-[10px] text-zinc-400">גלריית עבודות ומחירון טיפולים</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-1">
              <div className="text-2xl">🔧</div>
              <h4 className="text-xs font-black text-white">טכנאים & אינסטלטורים</h4>
              <p className="text-[10px] text-zinc-400">חלונות הגעה וכתובות לקוח</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-1">
              <div className="text-2xl">🌿</div>
              <h4 className="text-xs font-black text-white">קליניקות & טיפולים</h4>
              <p className="text-[10px] text-zinc-400">שאלון העדפות ויומן מסודר</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-1 col-span-2 sm:col-span-1">
              <div className="text-2xl">🏋️</div>
              <h4 className="text-xs font-black text-white">מאמנים & שיעורים</h4>
              <p className="text-[10px] text-zinc-400">תיאום אימונים אישיים</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Pillars Features Grid */}
      <section id="features" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black text-[#C9A84C] uppercase tracking-wider">טכנולוגיה מנצחת</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">כל מה שהעסק שלכם צריך כדי לגדול</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            חוויית משתמש פרימיום הן עבור הלקוחות שלכם והן עבורכם במערכת הניהול
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#C9A84C]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">אתר הזמנות ייעודי ללקוח</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              דף נחיתה מעוצב תחת הכתובת שלכם, מותאם מושלם לנייד, עם בחירת שירות, יום ושעה ב-3 קליקים בלבד.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#C9A84C]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">יומן Drag & Drop אינטראקטיבי</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              יומן מודרני מבוסס Schedule-X המאפשר לגרור תורים בעכבר בין שעות וימים בסנכרון ענן מיידי.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#C9A84C]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">תזכורות ואישורים בוואטסאפ</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              הלקוחות מקבלים קישור אישור מיידי לוואטסאפ עם כל פרטי התור, ניווט ב-Waze וקובץ תזכורת ליומן.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#C9A84C]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">ניהול עובדים וסניפים מרובים</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              שיוך שירותים לאנשי צוות שונים, הגדרת הרשאות מדויקות ושליטה בלוחות זמנים של מספר סניפים במקביל.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#C9A84C]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">רשימת המתנה חכמה (Waitlist)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              מילוי חורים אוטומטי בעת ביטולים – לקוחות ברשימת ההמתנה מקבלים הודעה על תור שהתפנה.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#C9A84C]/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">CRM ואנליטיקה עסקית</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              דוחות הכנסה, ממוצע עסקה, שעות שיא, היסטוריית טיפולים אישית ותיעוד העדפות מדויק לכל לקוח.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#141414] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black text-[#C9A84C] uppercase tracking-wider">חבילות מנוי גמישות</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">תמחור שקוף ופשוט לכל עסק</h2>
            <p className="text-xs sm:text-sm text-zinc-400">ללא התחייבות, ביטול בכל עת, תמיכה מלאה בהקמה</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1A1A1A] border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-black text-zinc-400 uppercase">Starter Plan</div>
                <div className="text-3xl font-black text-white">₪99 <span className="text-xs text-zinc-400 font-normal">/ חודש</span></div>
                <p className="text-xs text-zinc-400">אידיאלי לעצמאיים ולעסקים בתחילת הדרך</p>
                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-zinc-300">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <span>אתר הזמנות מותאם אישית</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <span>עד 300 תורים בחודש</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <span>עובד יחיד / סניף 1</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <span>אישורי הגעה בוואטסאפ</span></div>
                </div>
              </div>
              <a
                href="https://wa.me/972500000000?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%97%D7%91%D7%99%D7%97%D7%AA%20Starter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center transition-colors block"
              >
                בחר בחבילה זו
              </a>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1E1C16] to-[#161512] border-2 border-[#C9A84C] relative flex flex-col justify-between space-y-6 shadow-2xl shadow-[#C9A84C]/10">
              <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-3.5 py-1 rounded-full bg-[#C9A84C] text-black text-[11px] font-black uppercase tracking-wider">
                הכי פופולרי 🔥
              </div>
              <div className="space-y-4">
                <div className="text-xs font-black text-[#C9A84C] uppercase">Pro Business</div>
                <div className="text-3xl font-black text-white">₪179 <span className="text-xs text-zinc-400 font-normal">/ חודש</span></div>
                <p className="text-xs text-zinc-400">למספרות, קליניקות ועסקים עם צוות</p>
                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-zinc-200">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C9A84C]" /> <span>תורים ללא הגבלה</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C9A84C]" /> <span>עד 5 אנשי צוות / עובדים</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C9A84C]" /> <span>יומן Drag & Drop חי (Schedule-X)</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C9A84C]" /> <span>רשימת המתנה חכמה</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C9A84C]" /> <span>אנליטיקה ודוחות הכנסות</span></div>
                </div>
              </div>
              <a
                href="https://wa.me/972500000000?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%97%D7%91%D7%99%D7%97%D7%AA%20Pro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs text-center transition-all shadow-md block cursor-pointer hover:scale-105"
              >
                התחל עכשיו עם Pro
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1A1A1A] border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-black text-zinc-400 uppercase">Enterprise Network</div>
                <div className="text-3xl font-black text-white">₪299 <span className="text-xs text-zinc-400 font-normal">/ חודש</span></div>
                <p className="text-xs text-zinc-400">לרשתות סניפים ולמותגים מובילים</p>
                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-zinc-300">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <span>סניפים ועובדים ללא הגבלה</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <span>חיבור דומיין אישי מלא</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <span>התאמת מיתוג ו-CSS אישית</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <span>מנהל תיק לקוח וליווי VIP</span></div>
                </div>
              </div>
              <a
                href="https://wa.me/972500000000?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%97%D7%91%D7%99%D7%97%D7%AA%20Enterprise"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center transition-colors block"
              >
                צור קשר ל-Enterprise
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-zinc-500 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400 font-bold">
          <Link href="/dvir" className="hover:text-white transition-colors">אתר לדוגמה (Live Demo)</Link>
          <Link href="/admin/login" className="hover:text-white transition-colors">כניסת מנהלי עסק</Link>
          <Link href="/super-admin" className="hover:text-white transition-colors">Super Admin</Link>
          <Link href="/accessibility" className="hover:text-white transition-colors">הצהרת נגישות</Link>
          <Link href="/terms" className="hover:text-white transition-colors">תנאי שימוש</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">מדיניות פרטיות</Link>
        </div>
        <p>© {new Date().getFullYear()} The Cut SaaS Platform · כל הזכויות שמורות לפלטפורמת CutWeb</p>
      </footer>
    </div>
  );
}
