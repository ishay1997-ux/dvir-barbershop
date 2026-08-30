'use client';

import React from 'react';
import { Check, X, Sparkles, Smartphone, Download, Zap, Globe, MessageSquareCheck, Palette, Bell } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'הורדת אפליקציה מחנות האפליקציות',
      oldWay: 'חובה לכל לקוח (חסימה שגורמת לנטישת לקוחות)',
      cutwebWay: '0 הורדות! קישור מהיר וישיר בספארי/כרום',
      isPositive: true,
    },
    {
      feature: 'אתר מותג אישי ומיתוג ייחודי',
      oldWay: 'דף גנרי באפליקציה לצד מתחרים מהאזור',
      cutwebWay: 'אתר בוטיק עצמאי מלא עם הלוגו, התמונות והצבעים שלכם',
      isPositive: true,
    },
    {
      feature: 'אישורי תור ותזכורות WhatsApp',
      oldWay: 'הודעות SMS יקרות או Push שלרוב מושתקות',
      cutwebWay: 'הודעת וואטסאפ אישית עם קישור ישיר ל-Waze',
      isPositive: true,
    },
    {
      feature: 'יומן Drag & Drop לניהול הלו״ז',
      oldWay: 'ממשק מיושן ומסורבל מרובה קליקים',
      cutwebWay: 'גרירת תורים מהירה, חסימת ימים וסגירת חירום בקליק',
      isPositive: true,
    },
    {
      feature: 'תיעוד נוסחת טיפול ו-CRM',
      oldWay: 'פתקים או זיכרון בלבד',
      cutwebWay: 'תיק לקוח חכם (פייד, גוון לק, אזורי עיסוי, משקלים)',
      isPositive: true,
    },
    {
      feature: 'זמן הקמת המערכת והאתר',
      oldWay: 'ימים עד שבועות של המתנה לנציגים',
      cutwebWay: '60 שניות – האתר באוויר מיד בסיום ההרשמה',
      isPositive: true,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-200/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>השוואת פתרונות</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            למה עסקים מובילים בישראל עוברים ל-CutWeb?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-sans leading-relaxed">
            ההבדל בין אפליקציות תורים ישנות שמאלצות לקוחות להוריד קבצים, לבין אתר לקוחות מודרני שממיר כל מבקר לתור משוריין.
          </p>
        </div>

        {/* Desktop Comparison Table */}
        <div className="hidden md:block bg-[#F8FAFC] rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-slate-950 text-white p-5 border-b border-slate-800 text-xs font-black">
            <div className="col-span-4 text-slate-400">מאפיין ויכולת</div>
            <div className="col-span-4 text-rose-300 flex items-center gap-1.5">
              <X className="w-4 h-4 text-rose-400" />
              <span>אפליקציות תורים ישנות וגנריות</span>
            </div>
            <div className="col-span-4 text-emerald-300 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-white">CutWeb (מערכת פרימיום עצמאית)</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-200/80 font-sans">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-12 p-5 items-center text-xs transition-colors ${
                  idx % 2 === 0 ? 'bg-white/60' : 'bg-white'
                } hover:bg-indigo-50/40`}
              >
                <div className="col-span-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span>{row.feature}</span>
                </div>
                <div className="col-span-4 text-slate-500 flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{row.oldWay}</span>
                </div>
                <div className="col-span-4 font-bold text-slate-900 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-900">{row.cutwebWay}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Comparison Cards */}
        <div className="md:hidden space-y-4">
          {comparisonRows.map((row, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-slate-900">{row.feature}</h4>
              <div className="space-y-2 text-xs font-sans">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] text-rose-600">אפליקציות ישנות:</span>
                    <span>{row.oldWay}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] text-emerald-700">ב-CutWeb:</span>
                    <span>{row.cutwebWay}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
