'use client';

import React from 'react';
import { Smartphone, Calendar, MessageCircle, Users, Layers, Zap } from 'lucide-react';

export function FeaturesBentoSection() {
  const features = [
    {
      icon: Smartphone,
      title: 'אתר אישי מהיר וממותג',
      description:
        'אתר לקוחות מותאם לסלולר הפועל ללא צורך בהורדת אפליקציה מחנות האפליקציות, עם כתובת ייעודית (thecut.co.il/[slug]).',
    },
    {
      icon: Calendar,
      title: 'יומן Drag & Drop מתקדם',
      description:
        'ממשק ניהול יומן מודרני מבוסס Schedule-X המאפשר גרירת תורים בזמן אמת, חסימת ימים וסנכרון תורים חי.',
    },
    {
      icon: MessageCircle,
      title: 'תזכורות WhatsApp חכמות',
      description:
        'אישורי הגעה ישירים, שליחת הודעות wa.me מותאמות אישית בלחיצה, והפחתת ביטולים ב-80% ללא עלות נוספת.',
    },
    {
      icon: Users,
      title: 'מיני-CRM ונוסחת טיפול',
      description:
        'שמירת היסטוריית תורים לכל לקוח, תיעוד נוסחת תספורת (פייד, זקן) או שדות מותאמים אישית לפי מקצוע.',
    },
    {
      icon: Layers,
      title: 'תמיכה בריבוי עובדים וסניפים',
      description:
        'ניהול מספר אנשי צוות, יומן נפרד לכל עובד, שיוך שירותים וניהול סניפים שונים תחת פאנל אחד.',
    },
    {
      icon: Zap,
      title: 'ענן מסונכרן 24/7 (Firestore)',
      description:
        'סנכרון תורים מיידי ללא התנגשויות (Double Booking), עבודה ללא הפסקה גם בשעות העומס וגיבוי מלא.',
    },
  ];

  return (
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
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-7 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all space-y-3.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
