'use client';

import React, { useState } from 'react';
import { Clock, TrendingUp, Sparkles, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

interface RoiCalculatorSectionProps {
  onOpenOnboarding: () => void;
}

export const RoiCalculatorSection: React.FC<RoiCalculatorSectionProps> = ({ onOpenOnboarding }) => {
  const [dailyAppointments, setDailyAppointments] = useState(14);
  const [avgPrice, setAvgPrice] = useState(90);
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState(24);

  // Calculations
  const monthlyAppointments = dailyAppointments * workDaysPerMonth;
  // Estimated 5 mins saved per appointment on phone calls / WhatsApp coordination
  const hoursSavedPerMonth = Math.round((monthlyAppointments * 5) / 60);
  // Estimated 8% reduction in no-shows / cancellations via instant WhatsApp reminders
  const recoveredNoShowsMonthly = Math.round(monthlyAppointments * 0.08);
  const recoveredRevenueMonthly = recoveredNoShowsMonthly * avgPrice;
  const recoveredRevenueYearly = recoveredRevenueMonthly * 12;

  return (
    <section id="roi-calculator" className="py-20 sm:py-28 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] relative overflow-hidden border-t border-slate-200/80">
      {/* Background Decorative Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-100/40 via-violet-100/30 to-amber-100/30 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>מחשבון חיסכון וצמיחה עסקית</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            כמה זמן וכסף CutWeb תחזיר לעסק שלכם?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-sans leading-relaxed">
            הזיזו את הסליידרים כדי לגלות כמה שעות עבודה והכנסות נוספות תרוויחו בכל חודש הודות לקביעת תורים אוטונומית ואפס ביטולים.
          </p>
        </div>

        {/* Main Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Input Panel (Left on desktop RTL) */}
          <div className="lg:col-span-6 bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6">
            {/* Slider 1: Daily Appointments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>מספר תורים בממוצע ליום:</span>
                </label>
                <span className="text-lg font-black text-indigo-600 font-mono bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                  {dailyAppointments} תורים
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                step="1"
                value={dailyAppointments}
                onChange={(e) => setDailyAppointments(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-sans">
                <span>4 תורים</span>
                <span>20 תורים</span>
                <span>40 תורים</span>
              </div>
            </div>

            {/* Slider 2: Average Service Price */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>מחיר ממוצע לטיפול / שירות:</span>
                </label>
                <span className="text-lg font-black text-indigo-600 font-mono bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                  {avgPrice} ₪
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="450"
                step="5"
                value={avgPrice}
                onChange={(e) => setAvgPrice(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-sans">
                <span>40 ₪ (בסיסי)</span>
                <span>200 ₪ (ממוצע)</span>
                <span>450 ₪ (פרימיום)</span>
              </div>
            </div>

            {/* Slider 3: Work Days Per Month */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>ימי עבודה בחודש:</span>
                </label>
                <span className="text-lg font-black text-indigo-600 font-mono bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                  {workDaysPerMonth} ימים
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="28"
                step="1"
                value={workDaysPerMonth}
                onChange={(e) => setWorkDaysPerMonth(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-sans">
                <span>12 ימים</span>
                <span>22 ימים (סטנדרט)</span>
                <span>28 ימים</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>הנתונים מבוססים על חיסכון ממוצע של מעל 150 עסקים פעילים במערכת.</span>
            </div>
          </div>

          {/* Real-time Results Cards Panel (Right on desktop RTL) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Big Metric 1: Extra Annual Revenue */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-950 via-[#111420] to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  תוספת הכנסה מוערכת משחזור ביטולים
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black">
                  +8% תפוסה
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  +{recoveredRevenueYearly.toLocaleString()} ₪
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-sans">/ בשנה</span>
              </div>

              <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                מערכת אישורי ה-WhatsApp של CutWeb מפחיתה אי-הגעה ב-80%, מה שמחזיר לכם כ-{recoveredRevenueMonthly.toLocaleString()} ₪ בכל חודש ישירות לקופה.
              </p>
            </div>

            {/* Dual Sub-Metrics: Hours Saved & Booking Autonomy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Metric 2: Hours Saved */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {hoursSavedPerMonth} שעות
                </div>
                <div className="text-xs font-bold text-slate-700">זמן שנחסך בכל חודש</div>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                  פחות זמן בטלפון ובוואטסאפ בתיאומי שעות – יותר זמן פנוי ללקוחות ולחיים האישיים.
                </p>
              </div>

              {/* Metric 3: Total Monthly Bookings */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {monthlyAppointments} תורים
                </div>
                <div className="text-xs font-bold text-slate-700">תורים אוטונומיים בחודש</div>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                  נקבעים ישירות ע״י הלקוחות שלכם 24/7 דרך קישור ה-Bio באינסטגרם וב-Google.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>התחילו לחסוך זמן ולהרוויח יותר – פתחו אתר חינם</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
