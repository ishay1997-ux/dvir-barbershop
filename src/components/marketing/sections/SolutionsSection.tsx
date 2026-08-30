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
    ctaLabel: 'צפו בדמו חי (המספרה של דביר)',
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
    features: ['תיאום מפגשים אישיים וסדרות', 'מעקב לקוחות ופרטי קשר מלאים', 'קישור יומן ל-Google / Apple Calendar'],
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
              <button
                type="button"
                onClick={() => onOpenOnboarding('pro', currentInd.title)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentInd.ctaLabel}</span>
              </button>
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
  );
}
