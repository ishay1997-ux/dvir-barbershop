'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SHOWCASE_SITES } from './showcase/showcase-data';
import { ShowcaseControls } from './showcase/ShowcaseControls';
import { DeviceMockupDesktop } from './showcase/DeviceMockupDesktop';
import { DeviceMockupMobile } from './showcase/DeviceMockupMobile';

interface WixStyleHeroShowcaseProps {
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team', industry: string) => void;
}

export const WixStyleHeroShowcase: React.FC<WixStyleHeroShowcaseProps> = ({
  onOpenOnboarding,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  const [hasSimulatedBooking, setHasSimulatedBooking] = useState(false);

  const current = SHOWCASE_SITES[activeIndex];

  // Auto cycle showcase every 6 seconds if not hovered or clicked
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_SITES.length);
      setSelectedServiceIndex(0);
      setHasSimulatedBooking(false);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handleSelectNiche = (idx: number) => {
    setActiveIndex(idx);
    setSelectedServiceIndex(0);
    setHasSimulatedBooking(false);
  };

  const triggerSimulateBooking = () => {
    setHasSimulatedBooking(true);
  };

  return (
    <div
      className="relative max-w-5xl mx-auto pt-6 pb-12 select-none"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      dir="rtl"
    >
      {/* Top Controls: Niche Selector + Device Mode Switcher */}
      <ShowcaseControls
        sites={SHOWCASE_SITES}
        activeIndex={activeIndex}
        deviceMode={deviceMode}
        onSelectNiche={handleSelectNiche}
        onSelectDeviceMode={setDeviceMode}
      />

      {/* 3D Showcase Container */}
      <div className="relative mt-2">
        {/* Subtle Background Glow Accent */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 transition-all duration-700 pointer-events-none -z-10"
          style={{ backgroundColor: current.themeColor }}
        />

        {/* Device View Render: Desktop Browser vs Mobile Phone */}
        {deviceMode === 'desktop' ? (
          <DeviceMockupDesktop
            current={current}
            selectedServiceIndex={selectedServiceIndex}
            hasSimulatedBooking={hasSimulatedBooking}
            onSelectService={(i) => {
              setSelectedServiceIndex(i);
              setHasSimulatedBooking(false);
            }}
            onSimulateBooking={triggerSimulateBooking}
            onOpenOnboarding={onOpenOnboarding}
          />
        ) : (
          <DeviceMockupMobile
            current={current}
            selectedServiceIndex={selectedServiceIndex}
            hasSimulatedBooking={hasSimulatedBooking}
            onSelectService={setSelectedServiceIndex}
            onSimulateBooking={triggerSimulateBooking}
          />
        )}

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={() =>
            setActiveIndex((prev) => (prev === 0 ? SHOWCASE_SITES.length - 1 : prev - 1))
          }
          className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
          title="הקודם"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev + 1) % SHOWCASE_SITES.length)}
          className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
          title="הבא"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Wix Style Floating Key Metrics Box */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
          <span className="text-[11px] text-slate-500 font-bold block">סנכרון ענן בזמן אמת</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-indigo-600">0 ₪</div>
          <span className="text-[11px] text-slate-500 font-bold block">התחלה מיידית בחינם</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-emerald-600">3 קליקים</div>
          <span className="text-[11px] text-slate-500 font-bold block">לקביעת תור ללקוח</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-slate-900">80%</div>
          <span className="text-[11px] text-slate-500 font-bold block">הפחתת ביטולים ב-WhatsApp</span>
        </div>
      </div>
    </div>
  );
};
