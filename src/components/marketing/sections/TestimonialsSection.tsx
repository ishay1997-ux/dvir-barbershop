'use client';

import React, { useState } from 'react';
import { Star, Sparkles, Quote, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [filterNiche, setFilterNiche] = useState<string>('all');

  const testimonials = [
    {
      name: 'דביר מלכה',
      role: 'בעלים, המספרה של דביר (אריאל & רחובות)',
      category: 'barber',
      nicheLabel: 'מספרות גברים',
      avatar: '💈',
      rating: 5,
      metric: '+94% תפוסה שבועית',
      text: 'לפני CutWeb הייתי מבלה שעתיים כל ערב רק בתיאומי וואטסאפ וביטולים של הרגע האחרון. היום 100% מהתורים נקבעים אוטונומית מהאינסטגרם שלי, וההודעות האוטומטיות בוואטסאפ חסכו לי אלפי שקלים על ביטולים.',
      highlight: 'אפס שיחות טלפון בזמן עבודה',
    },
    {
      name: 'שירן אברהם',
      role: 'סטודיו שירן ביוטי & ניילס (ראשל״צ)',
      category: 'beauty',
      nicheLabel: 'קוסמטיקה וציפורניים',
      avatar: '💅',
      rating: 5,
      metric: '3 שבועות מראש מלאים',
      text: 'הלקוחות שלי בהלם מאיך שהאתר נראה – הוא משדר יוקרה אמיתית ולא אפליקציה זולה. תיעוד הגוונים והמבנה האנטומי בכרטיס הלקוח גורם לכל אחת להרגיש VIP. ממליצה בחום לכל קוסמטיקאית!',
      highlight: 'מיתוג פרימיום שהעלה את המחירים',
    },
    {
      name: 'אופק כהן',
      role: 'מאמן כושר אישי ו-CrossFit (תל אביב)',
      category: 'fitness',
      nicheLabel: 'אימוני כושר',
      avatar: '🏋️',
      rating: 5,
      metric: 'חיסכון של 6 שעות שבועיות',
      text: 'לוח ה-Drag & Drop מאפשר לי לנהל מתאמנים אישיים וקבוצות קטנות בשיא הקלות. אם מתאמן מבקש להזיז אימון, אני גורר את המשבצת והוא מקבל מיד עדכון בוואטסאפ עם השעה החדשה.',
      highlight: 'לו״ז Drag & Drop מדהים',
    },
    {
      name: 'ד״ר שרה לוין',
      role: 'קליניקת בוטיק לאסתטיקה רפואית (הרצליה)',
      category: 'clinic',
      nicheLabel: 'קליניקות ואסתטיקה',
      avatar: '🩺',
      rating: 5,
      metric: '99% הגעה בזמן',
      text: 'הפרטיות, העיצוב הנקי ואוטומציית אישורי ההגעה לוואטסאפ עם כפתור Waze יצרו חוויית שירות מושלמת למטופלים שלנו. המערכת הכי מקצועית שיצא לי לעבוד איתה.',
      highlight: 'חוויית מטופל יוקרתית',
    },
  ];

  const filtered = filterNiche === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === filterNiche);

  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>הוכחה חברתית ומספרים</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            העסקים שכבר שדרגו את היומן וההכנסות
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-sans leading-relaxed">
            מאות בעלי מקצוע עצמאיים בישראל סומכים על CutWeb לניהול שוטף, הגדלת הכנסות וחיסכון בשעות עבודה.
          </p>
        </div>

        {/* Niche Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setFilterNiche('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterNiche === 'all'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            כל הענפים
          </button>
          <button
            onClick={() => setFilterNiche('barber')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterNiche === 'barber'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>💈</span>
            <span>מספרות</span>
          </button>
          <button
            onClick={() => setFilterNiche('beauty')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterNiche === 'beauty'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>💅</span>
            <span>ביוטי וציפורניים</span>
          </button>
          <button
            onClick={() => setFilterNiche('fitness')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterNiche === 'fitness'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>🏋️</span>
            <span>מאמני כושר</span>
          </button>
          <button
            onClick={() => setFilterNiche('clinic')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterNiche === 'clinic'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>🩺</span>
            <span>קליניקות</span>
          </button>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col justify-between space-y-6 relative group"
            >
              <div className="space-y-4">
                {/* Top Row: Stars + Metric Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-black font-mono">
                    {item.metric}
                  </span>
                </div>

                {/* Highlight Quote Pill */}
                <div className="text-xs font-black text-indigo-600 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-100/60 w-fit">
                  ״{item.highlight}״
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  {item.text}
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                  {item.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans block">
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
