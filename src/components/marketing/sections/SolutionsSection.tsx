'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ExternalLink, Sparkles } from 'lucide-react';

interface SolutionsSectionProps {
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team', industryTitle: string) => void;
}

const industryData = {
  barber: {
    icon: '💈',
    title: 'מספרות ועיצוב שיער גברים',
    tagline: 'ניהול זמנים מדויק, תיעוד נוסחת תספורת (פייד, זקן) ויומן מלא 24/7',
    stats: '94% מילוי יומן שבועי',
    isLive: true,
    slug: 'dvir',
    ctaLabel: 'צפו באתר דמו חי (המספרה של דביר) ↗',
    features: ['נוסחת תספורת אישית לכל לקוח ב-CRM', 'חסימת ימי מילואים/חירום בקליק', 'סנכרון בין מספר עובדים'],
  },
  beauty: {
    icon: '💅',
    title: 'קוסמטיקה, ציפורניים & טיפוח',
    tagline: 'הזמנת תורים נוחה, אישורי הגעה בוואטסאפ ורשימת המתנה לחורים פנויים',
    stats: '0% ביטולים ללא הודעה מוקדמת',
    isLive: true,
    slug: 'beauty',
    ctaLabel: 'צפו באתר דמו חי (סטודיו שירן ביוטי) ↗',
    features: ['רשימת המתנה אוטומטית (Waitlist)', 'אישורי הגעה ישירים בוואטסאפ', 'שאלון העדפות ורגישויות'],
  },
  spa: {
    icon: '🌿',
    title: 'ספא, טיפולי גוף ומסאז׳',
    tagline: 'קרוסלת אווירה מרגיעה, שחרור שרירים עמוק ופינוק הוליסטי מושלם',
    stats: 'חיסכון של 4 שעות שיחות ביום',
    isLive: true,
    slug: 'spa',
    ctaLabel: 'צפו באתר דמו חי (ספא לוטוס) ↗',
    features: ['קרוסלת חדרים ואווירה מרגיעה', 'מחירון טיפולים וזמני שהייה', 'תיאום חבילות זוגיות ופינוק'],
  },
  trainer: {
    icon: '🏋️',
    title: 'מאמנים אישיים & כושר',
    tagline: 'לו״ז אימונים פרטיים וסדרות טיפולים עם מעקב התקדמות אישי',
    stats: 'הכפלת לקוחות חוזרים',
    isLive: true,
    slug: 'trainer',
    ctaLabel: 'צפו באתר דמו חי (סטודיו אופק כושר) ↗',
    features: ['תיאום מפגשים אישיים וסדרות', 'מעקב לקוחות ופרטי קשר מלאים', 'קישור יומן ל-Google / Apple Calendar'],
  },
  clinic: {
    icon: '🩺',
    title: 'קליניקות אסתטיקה & רופאים',
    tagline: 'מראה כחול-ספיר יוקרתי, תוצאות הזרקות וטיפולי פנים רפואיים',
    stats: '100% שקיפות ודיסקרטיות',
    isLive: true,
    slug: 'clinic',
    ctaLabel: 'צפו באתר דמו חי (ד״ר לוי קליניקה) ↗',
    features: ['הסכמי טיפול והנחיות מראש', 'סליידר מהפכים לפני/אחרי רפואי', 'ניהול יומן מרובה חדרים'],
  },
  services: {
    icon: '🔧',
    title: 'אינסטלציה, טכנאים & שירותי בית',
    tagline: 'תיאום חלונות הגעה (לדוגמה 10:00-12:00), קבלת כתובת מדויקת והערות',
    stats: 'סדר מושלם בקריאות שירות',
    isLive: true,
    slug: 'services',
    ctaLabel: 'צפו באתר דמו חי (שרון מיזוג וחשמל) ↗',
    features: ['בחירת חלונות זמן (בוקר / צהריים / ערב)', 'איסוף כתובת והוראות הגעה בטופס', 'ניווט Waze ישיר לבית הלקוח'],
  },
};

type IndustryKey = keyof typeof industryData;

export function SolutionsSection({ onOpenOnboarding }: SolutionsSectionProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey>('barber');
  const currentInd = industryData[selectedIndustry];

  return (
    <section id="solutions" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
          פתרונות מותאמים אישית
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
          בנוי בדיוק לפי הצרכים של המקצוע שלכם
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          בחרו את ענף הפעילות שלכם וגלו כיצד CutWeb מותאם אליכם עם אתרי הדגמה חיים
        </p>
      </div>

      {/* Industry Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {(
          [
            ['barber', '💈 מספרות גברים'],
            ['beauty', '💅 קוסמטיקה & ציפורניים'],
            ['spa', '🌿 ספא ומסאז׳ים'],
            ['trainer', '🏋️ מאמנים & כושר'],
            ['clinic', '🩺 קליניקות אסתטיקה'],
            ['services', '🔧 אינסטלציה & מיזוג'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedIndustry(key as IndustryKey)}
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

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/${currentInd.slug}`}
              target="_blank"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{currentInd.ctaLabel}</span>
            </Link>

            <button
              type="button"
              onClick={() => onOpenOnboarding('pro', currentInd.title)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>התחלת התאמה ב-60 שניות</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 text-center">
          <div className="text-4xl">{currentInd.icon}</div>
          <div className="text-2xl font-black text-indigo-600">{currentInd.stats}</div>
          <p className="text-xs text-slate-500 font-sans">
            מערכת התורים מפנה לכם שעות יקרות של מענה טלפוני וממלאת את היומן באופן עצמאי.
          </p>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>📱 אתר לקוחות מותאם נייד</span>
            <span>⚡ יומן ניהול אוטונומי</span>
          </div>
        </div>
      </div>
    </section>
  );
}
