'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { INDUSTRY_SOLUTIONS } from '../solutions/solutions-data';
import { SolutionSuperpowers } from '../solutions/SolutionSuperpowers';
import { SolutionIndustryPreview } from '../solutions/SolutionIndustryPreview';

interface SolutionsSectionProps {
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team', industryTitle: string) => void;
}

export function SolutionsSection({ onOpenOnboarding }: SolutionsSectionProps) {
  const [activeKey, setActiveKey] = useState<string>('barber');
  const current = INDUSTRY_SOLUTIONS[activeKey] || INDUSTRY_SOLUTIONS.barber;

  return (
    <section id="solutions" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8 select-none" dir="rtl">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>התאמה מלאה לכל תחום עיסוק</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          בנוי בדיוק לפי הצרכים של המקצוע שלכם
        </h2>
        <p className="text-xs sm:text-base text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
          כל ענף עובד אחרת. בחרנו עבורכם את הכלים, המבנה והאוטומציות המדויקות שמייצרות הכנסה ומפנות לכם שקט נפשי.
        </p>
      </div>

      {/* Modern Industry Tabs Pill Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {Object.values(INDUSTRY_SOLUTIONS).map((ind) => {
          const isActive = ind.id === activeKey;
          return (
            <button
              key={ind.id}
              onClick={() => setActiveKey(ind.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-slate-950 text-white shadow-xl scale-105 border-2'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
              }`}
              style={{
                borderColor: isActive ? ind.themeColor : undefined,
              }}
            >
              <span className="text-base">{ind.icon}</span>
              <span>{ind.tabLabel}</span>
              {isActive && (
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: ind.themeColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Feature Spotlight Card */}
      <div className="relative rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Brand Glow */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: current.themeColor }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: current.themeColor }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Right Column: Deep Industry Superpowers */}
          <SolutionSuperpowers
            current={current}
            onOpenOnboarding={onOpenOnboarding}
          />

          {/* Left Column: Live Realistic Interface Preview */}
          <SolutionIndustryPreview current={current} />
        </div>
      </div>
    </section>
  );
}
