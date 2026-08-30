'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { SaaSOnboardingModal } from '@/components/marketing/SaaSOnboardingModal';
import { WixStyleHeroShowcase } from '@/components/marketing/WixStyleHeroShowcase';
import { MarketingNavbar } from '@/components/marketing/sections/MarketingNavbar';
import { SolutionsSection } from '@/components/marketing/sections/SolutionsSection';
import { RoiCalculatorSection } from '@/components/marketing/sections/RoiCalculatorSection';
import { ComparisonSection } from '@/components/marketing/sections/ComparisonSection';
import { FeaturesBentoSection } from '@/components/marketing/sections/FeaturesBentoSection';
import { TestimonialsSection } from '@/components/marketing/sections/TestimonialsSection';
import { PricingSection } from '@/components/marketing/sections/PricingSection';
import { FaqSection } from '@/components/marketing/sections/FaqSection';
import { MarketingFooter } from '@/components/marketing/sections/MarketingFooter';

export default function SaaSPlatformLandingPage() {
  // Onboarding Wizard Modal State (Wix / Fresha Style)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingPlan, setOnboardingPlan] = useState<'starter' | 'pro' | 'team'>('pro');
  const [onboardingIndustry, setOnboardingIndustry] = useState<string>('מספרות ועיצוב שיער גברים');

  const openOnboarding = (
    plan: 'starter' | 'pro' | 'team' = 'pro',
    ind: string = 'מספרות ועיצוב שיער גברים'
  ) => {
    setOnboardingPlan(plan);
    setOnboardingIndustry(ind);
    setIsOnboardingOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-[#FAFAFD] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white"
      dir="rtl"
    >
      {/* 1. Header & Navigation (Glass Pill Style) */}
      <MarketingNavbar onOpenOnboarding={() => openOnboarding('starter')} />

      {/* 2. Wix-Style Hero & 3D Interactive Showcase */}
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]">
        {/* Subtle Multi-Color Ambient Mesh Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[420px] bg-gradient-to-r from-indigo-200/40 via-purple-100/30 to-sky-100/40 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/70 text-indigo-700 text-xs font-black shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>⚡ הפלטפורמה המובילה בישראל לניהול תורים ועסקים</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 leading-[1.12] tracking-tight">
            העתיד של העסק שלכם מתחיל{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
              באתר לקוחות יוקרתי ואוטונומי
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
            CutWeb היא המערכת שבה עסקים מקימים אתר לקוחות מותאם, יומן חכם לגרירת תורים (Drag & Drop) ואישורי WhatsApp – תוך 60 שניות, ללא צורך בהורדת אפליקציה.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openOnboarding('starter')}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-black text-sm sm:text-base transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>התחילו עכשיו בחינם</span>
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
            </button>

            <a
              href="#roi-calculator"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 hover:scale-105"
            >
              <span>חשבו כמה תחסכו 📊</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>התחלה מיידית בחינם · ללא צורך בכרטיס אשראי · הקמה ב-60 שניות</span>
          </div>
        </div>

        {/* 3D Multi-Site Interactive Showcase Carousel */}
        <WixStyleHeroShowcase onOpenOnboarding={(plan, ind) => openOnboarding(plan, ind)} />
      </section>

      {/* 3. Industry Solutions Grid */}
      <SolutionsSection onOpenOnboarding={(plan, ind) => openOnboarding(plan, ind)} />

      {/* 4. Interactive ROI & Time Saved Calculator */}
      <RoiCalculatorSection onOpenOnboarding={() => openOnboarding('pro')} />

      {/* 5. Head-to-Head Comparison: Why CutWeb? */}
      <ComparisonSection />

      {/* 6. Features Bento Grid */}
      <FeaturesBentoSection />

      {/* 7. Social Proof & Verified Testimonials */}
      <TestimonialsSection />

      {/* 8. Pricing Plans Table */}
      <PricingSection onOpenOnboarding={(plan) => openOnboarding(plan)} />

      {/* 9. Interactive FAQ Accordion */}
      <FaqSection />

      {/* 10. Footer with Pre-footer Grand CTA Banner */}
      <MarketingFooter onOpenOnboarding={() => openOnboarding('starter')} />

      {/* 11. SaaS Onboarding Wizard Modal */}
      <SaaSOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlan={onboardingPlan}
        initialIndustry={onboardingIndustry}
      />
    </div>
  );
}
