import Link from 'next/link';
import { ArrowLeft, Sparkles, Calendar, Clock, MapPin, CheckCircle, Scissors, Wrench, Sparkle, Heart, Flame, Shield, Stethoscope } from 'lucide-react';
import type { Metadata } from 'next';
import { INDUSTRY_PRESETS } from '@/lib/industry-presets';
import DynamicBusinessBookingPage from '@/app/[slug]/booking/page';

export const metadata: Metadata = {
  title: 'פורטל זימון תורים והזמנת שירותים | CutWeb',
  description: 'מערכת זימון תורים והזמנת שירותים אונליין לכל עסק ונישה בישראל – מספרות, קוסמטיקה, טכנאים, ספא, כושר וקליניקות.',
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; business?: string; barber?: string; service?: string }>;
}) {
  const params = await searchParams;
  const targetSlug = params?.slug || params?.business;

  // If a specific business slug is requested (e.g. /booking?slug=tech), delegate directly to dynamic booking
  if (targetSlug) {
    return <DynamicBusinessBookingPage params={Promise.resolve({ slug: targetSlug })} />;
  }

  const NICHE_CARDS = [
    {
      slug: 'tech',
      title: 'טכנאים ושירותי בית',
      subtitle: 'מיזוג, חשמל, אינסטלציה ומכשירי חשמל',
      icon: '🔧',
      badge: 'הגעה לבית הלקוח',
      accentColor: '#0284C7',
      bgGradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
      borderColor: 'border-sky-500/30',
      textColor: 'text-sky-400',
      sampleServices: ['קריאת שירות לבית הלקוח (180 ₪)', 'טיפול ותחזוקת מזגנים (250 ₪)', 'איתור קצר חשמלי (220 ₪)'],
      timeModel: 'חלונות הגעה (בוקר/צהריים/ערב)',
    },
    {
      slug: 'dvir',
      title: 'מספרות גברים וברברשופ',
      subtitle: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן',
      icon: '💈',
      badge: 'סניפים וכיסאות ספר',
      accentColor: '#C9A84C',
      bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      sampleServices: ['תספורת גברים פרימיום (80 ₪)', 'פיסול ועיצוב זקן (40 ₪)', 'חבילת VIP משולבת (110 ₪)'],
      timeModel: 'סלוטים מדויקים (20-30 דקות)',
    },
    {
      slug: 'beauty',
      title: 'קוסמטיקה, ציפורניים ויופי',
      subtitle: 'מבנה אנטומי, לק ג׳ל, פדיקור רפואי והרמת ריסים',
      icon: '💅',
      badge: 'טיפולי בוטיק',
      accentColor: '#EC4899',
      bgGradient: 'from-pink-500/10 via-pink-500/5 to-transparent',
      borderColor: 'border-pink-500/30',
      textColor: 'text-pink-400',
      sampleServices: ['מבנה אנטומי + לק ג׳ל (160 ₪)', 'מניקור ג׳ל משולב (140 ₪)', 'פדיקור ספא מפנק (180 ₪)'],
      timeModel: 'סלוטים של 45-60 דקות',
    },
    {
      slug: 'spa',
      title: 'ספא, עיסויים ורפואה משלימה',
      subtitle: 'עיסוי שוודי, רקמות עמוקות, אבנים חמות ורפלקסולוגיה',
      icon: '🌿',
      badge: 'מרחב טיפולים הוליסטי',
      accentColor: '#10B981',
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      sampleServices: ['עיסוי שוודי הוליסטי 60 דק׳ (280 ₪)', 'עיסוי רקמות עמוקות (320 ₪)', 'טיפול ספא משולב (360 ₪)'],
      timeModel: 'משך טיפול (45/60/90 דקות)',
    },
    {
      slug: 'fitness',
      title: 'מאמני כושר וסטודיו אימונים',
      subtitle: 'אימונים אישיים 1-על-1, אימונים פונקציונליים ו-HIIT',
      icon: '🏋️',
      badge: 'אימונים אישיים וקבוצות',
      accentColor: '#F59E0B',
      bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      sampleServices: ['אימון כושר אישי 1-על-1 (180 ₪)', 'אימון זוגי ממוקד (250 ₪)', 'כרטיסיית 10 אימונים (1,500 ₪)'],
      timeModel: 'שריון מועד אימון (45-60 דקות)',
    },
    {
      slug: 'clinic',
      title: 'מרפאות אסתטיקה רפואית',
      subtitle: 'הזרקות, בוטוקס, חומצה היאלורונית ופילינג רפואי',
      icon: '🩺',
      badge: 'רופאים מומחים מוסמכים',
      accentColor: '#6366F1',
      bgGradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
      sampleServices: ['פגישת ייעוץ והתאמה רפואית (חינם)', 'טיפול בוטוקס 3 אזורים (1,200 ₪)', 'עיצוב ומילוי שפתיים (1,100 ₪)'],
      timeModel: 'פגישות ייעוץ וטיפול',
    },
    {
      slug: 'tattoo',
      title: 'סטודיו לקעקועים ופירסינג',
      subtitle: 'קעקועים בהתאמה אישית, סקיצות מקוריות ופירסינג מקצועי',
      icon: '⚡',
      badge: 'סשנים מותאמים אישית',
      accentColor: '#8B5CF6',
      bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      sampleServices: ['פגישת ייעוץ וסקיצה אישית (חינם)', 'סשן קעקוע קטן עד 7 ס״מ (350 ₪)', 'סשן חצי יום מורכב (1,800 ₪)'],
      timeModel: 'סשנים מותאמים',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0E0F14] text-white font-sans selection:bg-indigo-600 selection:text-white" dir="rtl">
      {/* Top Universal Navbar */}
      <header className="border-b border-white/10 bg-[#14151C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm text-white tracking-tight">פורטל זימון תורים</span>
              <span className="text-[10px] text-indigo-300 font-sans">CutWeb Universal Booking</span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <span>חזרה לאתר הראשי</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Hub Content */}
      <main className="container mx-auto px-4 py-10 sm:py-16 max-w-6xl">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>מערכת תורים מותאמת לפי ענף וסוג השירות</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            בחרו את תחום העסק כדי{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-amber-300 bg-clip-text text-transparent">
              להתנסות בזימון תור מותאם
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            כל ענף בפלטפורמה פועל לפי לוגיקה עסקית אמיתית: חלונות זמנים וכתובת מלאה לטכנאים, סלוטים מדויקים למספרות, התאמת מטפלות לביוטי ועוד.
          </p>
        </div>

        {/* Niche Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NICHE_CARDS.map((card) => (
            <div
              key={card.slug}
              className={`rounded-3xl p-6 border ${card.borderColor} bg-gradient-to-b ${card.bgGradient} bg-[#161720] shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all group relative overflow-hidden`}
            >
              {/* Background ambient corner glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: card.accentColor }}
              />

              <div className="space-y-4 relative z-10">
                {/* Header Badge + Icon */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-md"
                    style={{
                      backgroundColor: `${card.accentColor}20`,
                      borderColor: `${card.accentColor}40`,
                    }}
                  >
                    <span>{card.icon}</span>
                  </div>

                  <span
                    className="text-[10px] font-black px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${card.accentColor}15`,
                      borderColor: `${card.accentColor}30`,
                      color: card.accentColor,
                    }}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Titles */}
                <div>
                  <h2 className="text-xl font-black text-white">{card.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                {/* Sample Services */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[11px] font-bold text-zinc-500 block">דוגמאות לשירותים:</span>
                  {card.sampleServices.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.accentColor }} />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>

                {/* Time Model Badge */}
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>מודל זימון: {card.timeModel}</span>
                </div>
              </div>

              {/* Action Link to Industry Dynamic Booking */}
              <div className="pt-6 relative z-10">
                <Link
                  href={`/${card.slug}/booking`}
                  className="w-full py-3 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 active:scale-98 cursor-pointer"
                  style={{ backgroundColor: card.accentColor }}
                >
                  <span>התנסה בזימון תור ל-{card.title}</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-950" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA for business owners */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 text-center space-y-4 shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            רוצים אתר הזמנות חכם ומותאם כזה גם לעסק שלכם?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            הקימו אתר לקוחות מותאם, יומן חכם עם גרירה וסנכרון מלא ל-WhatsApp תוך 60 שניות בלבד.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>הקמת עסק בחינם ב-CutWeb</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
