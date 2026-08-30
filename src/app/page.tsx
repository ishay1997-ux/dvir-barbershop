'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SaaSOnboardingModal } from '@/components/marketing/SaaSOnboardingModal';
import { WixStyleHeroShowcase } from '@/components/marketing/WixStyleHeroShowcase';
import { MarketingNavbar } from '@/components/marketing/sections/MarketingNavbar';
import { SolutionsSection } from '@/components/marketing/sections/SolutionsSection';
import { FeaturesBentoSection } from '@/components/marketing/sections/FeaturesBentoSection';
import { PricingSection } from '@/components/marketing/sections/PricingSection';
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
      className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white"
      dir="rtl"
    >
      {/* 1. Header & Navigation */}
      <MarketingNavbar onOpenOnboarding={() => openOnboarding('starter')} />

      {/* 2. Wix-Style Hero & 3D Interactive Showcase */}
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-200/35 via-purple-100/25 to-sky-100/35 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 leading-[1.12] tracking-tight">
            העתיד של העסק שלכם מתחיל{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
              במערכת התורים המובילה בישראל
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            CutWeb היא המערכת שבה עסקים מקימים אתר לקוחות מותאם, יומן חכם לגרירת תורים (Drag & Drop) ואישורי WhatsApp – תוך 60 שניות.
          </p>

          <div className="pt-2 flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => openOnboarding('starter')}
              className="px-9 py-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-black text-sm sm:text-base transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>התחילו עכשיו בחינם</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 font-medium">
              התחלה מיידית בחינם · ללא צורך בכרטיס אשראי
            </span>
          </div>
        </div>

        {/* 3D Multi-Site Interactive Showcase Carousel */}
        <WixStyleHeroShowcase onOpenOnboarding={(plan, ind) => openOnboarding(plan, ind)} />
      </section>

      {/* 3. Industry Solutions Grid */}
      <SolutionsSection onOpenOnboarding={(plan, ind) => openOnboarding(plan, ind)} />

      {/* 4. Features Bento Grid */}
      <FeaturesBentoSection />

      {/* 5. Pricing Plans Table */}
      <PricingSection onOpenOnboarding={(plan) => openOnboarding(plan)} />

      {/* 6. Footer */}
      <MarketingFooter />

      {/* 7. SaaS Onboarding Wizard Modal */}
      <SaaSOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlan={onboardingPlan}
        initialIndustry={onboardingIndustry}
      />
    </div>
  );
}
