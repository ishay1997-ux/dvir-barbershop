'use client';

import React, { useState } from 'react';
import { Check, Info, Sparkles, Send, CreditCard } from 'lucide-react';

interface PricingSectionProps {
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team') => void;
}

export function PricingSection({ onOpenOnboarding }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-[#FAFAFC] border-t border-slate-200/80">
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
          <span
            className={`text-xs font-bold ${
              billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
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
            <span
              className={`text-xs font-bold ${
                billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
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
                  <span>
                    <strong>עד 35 תורים</strong> בחודש
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>איש צוות יחיד</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>סאב-דומיין ייעודי (thecut.co.il/[slug])</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    תזכורות <code>wa.me</code> בלחיצה ישירה
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>כולל חתימת מיתוג המערכת בתחתית</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenOnboarding('starter')}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-all shadow-xs block cursor-pointer"
            >
              התחל בחינם עכשיו (Starter)
            </button>
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
                  <span>
                    <strong>ללא הגבלת תורים</strong> (תורים חופשיים)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>הסרת מיתוג המערכת</strong> לחלוטין
                  </span>
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
            <button
              type="button"
              onClick={() => onOpenOnboarding('pro')}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs text-center transition-all shadow-md shadow-indigo-600/25 block cursor-pointer hover:scale-[1.02]"
            >
              הצטרף למסלול Pro (הכי פופולרי)
            </button>
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
                  <span>
                    <strong>כל מה שכלול ב-Pro</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>עד 5 עובדים</strong> עם יומן אישי לכל אחד
                  </span>
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
            <button
              type="button"
              onClick={() => onOpenOnboarding('team')}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-all shadow-xs block cursor-pointer"
            >
              הצטרף למסלול Team
            </button>
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
  );
}
