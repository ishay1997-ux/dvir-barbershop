'use client';

import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Eye,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  X,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { SaaSOnboardingModal } from '@/components/marketing/SaaSOnboardingModal';

interface LiveCustomizerDrawerProps {
  business: BusinessConfig;
  onChangeBusiness: (updated: BusinessConfig) => void;
}

const colorPresets = [
  { name: 'Gold Obsidian', color: '#C9A84C', icon: '💈', label: 'מספרות גברים פרימיום' },
  { name: 'Rose Blush', color: '#EC4899', icon: '💅', label: 'קוסמטיקה & ציפורניים' },
  { name: 'Royal Violet', color: '#A855F7', icon: '💇‍♀️', label: 'סלוני יופי ונשים' },
  { name: 'Cyber Emerald', color: '#10B981', icon: '🏋️', label: 'קליניקות ומאמנים' },
  { name: 'Electric Ocean', color: '#0EA5E9', icon: '🔧', label: 'טכנאים ושירותי בית' },
  { name: 'Monochrome Luxury', color: '#E2E8F0', icon: '🖤', label: 'שחור-לבן מינימליסטי' },
];

const bgThemePresets = [
  { id: 'dark-obsidian', label: 'Dark Obsidian', icon: '🌌', desc: 'שחור גרפיט יוקרתי' },
  { id: 'luxury-light', label: 'Luxury Light', icon: '💎', desc: 'לבן נקי בסטנדרט ווג' },
  { id: 'cyber-carbon', label: 'Cyber Carbon', icon: '🛸', desc: 'קרבון היי-טק עם ניאון' },
  { id: 'brand-midnight', label: 'Brand Midnight', icon: '✨', desc: 'אווירת לילה עמוקה' },
];

export function LiveCustomizerDrawer({
  business,
  onChangeBusiness,
}: LiveCustomizerDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'theme' | 'sections'>('colors');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const initialColor = business.themeColor || '#C9A84C';
  const initialBg = business.layout?.bgTheme || 'dark-obsidian';

  const handleColorChange = (newColor: string) => {
    onChangeBusiness({
      ...business,
      themeColor: newColor,
    });
  };

  const handleBgThemeChange = (newBg: any) => {
    onChangeBusiness({
      ...business,
      layout: {
        ...(business.layout || {}),
        bgTheme: newBg,
      },
    });
  };

  const handleToggleSection = (sectionKey: string, currentVal: boolean = true) => {
    onChangeBusiness({
      ...business,
      layout: {
        ...(business.layout || {}),
        [sectionKey]: !currentVal,
      },
    });
  };

  const handleReset = () => {
    onChangeBusiness({
      ...business,
      themeColor: '#C9A84C',
      layout: {
        ...(business.layout || {}),
        bgTheme: 'dark-obsidian',
        showBio: true,
        showBranches: true,
        showBeforeAfter: true,
        showReviews: true,
        showFaqs: true,
      },
    });
  };

  return (
    <>
      {/* Floating Trigger Button on the RIGHT side to avoid overlapping accessibility widget on the left */}
      <div className="fixed bottom-6 right-6 z-40" dir="rtl">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="py-3 px-5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white font-black text-xs flex items-center gap-2.5 shadow-2xl border border-white/20 backdrop-blur-lg hover:scale-105 transition-all cursor-pointer group"
          style={{
            boxShadow: `0 10px 30px -5px ${business.themeColor || '#C9A84C'}40`,
          }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 group-hover:rotate-45 transition-transform"
            style={{ backgroundColor: business.themeColor || '#C9A84C' }}
          >
            <Palette className="w-3 h-3 text-slate-950" />
          </div>
          <span>סטודיו עיצוב חי</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-indigo-300 font-bold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Live
          </span>
        </button>
      </div>

      {/* Slide-Up / Floating Studio Panel on the RIGHT side */}
      {isOpen && (
        <div
          className="fixed bottom-22 right-6 z-40 w-full max-w-sm sm:max-w-md bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-white space-y-4 text-right animate-in slide-in-from-bottom-5 duration-200"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-950 font-black text-xs shadow-xs"
                style={{ backgroundColor: business.themeColor || '#C9A84C' }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">התאמה אישית בזמן אמת</h4>
                <p className="text-[10px] text-slate-400">כל שינוי משתקף מיידית באתר הלקוחות</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                title="איפוס להגדרות ברירת מחדל"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-tabs Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800/80 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('colors')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'colors' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              צבעי מיתוג
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'theme' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              אווירה ורקע
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'sections' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              מודולריות
            </button>
          </div>

          {/* Tab 1: Color Presets */}
          {activeTab === 'colors' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map((p) => {
                  const isSelected = business.themeColor === p.color;
                  return (
                    <button
                      key={p.color}
                      onClick={() => handleColorChange(p.color)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-right cursor-pointer ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-950/60 shadow-xs'
                          : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-slate-950 font-black shadow-xs"
                        style={{ backgroundColor: p.color }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-slate-950" />}
                      </div>
                      <div className="truncate">
                        <div className="text-[11px] font-bold text-white truncate">{p.name}</div>
                        <div className="text-[9px] text-slate-400 truncate">{p.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Color Picker */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-bold">צבע מותאם אישית:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={business.themeColor || '#C9A84C'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-7 h-7 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                  />
                  <span className="font-mono text-[11px] text-slate-300 uppercase" dir="ltr">
                    {business.themeColor}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Background Themes */}
          {activeTab === 'theme' && (
            <div className="space-y-2">
              {bgThemePresets.map((t) => {
                const isSelected = (business.layout?.bgTheme || 'dark-obsidian') === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleBgThemeChange(t.id)}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all text-right cursor-pointer ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-950/60 shadow-xs'
                        : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <div className="text-xs font-black text-white">{t.label}</div>
                        <div className="text-[10px] text-slate-400">{t.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 3: Modular Layout Toggles */}
          {activeTab === 'sections' && (
            <div className="space-y-2">
              {[
                { key: 'showBeforeAfter', label: 'גלריית לפני / אחרי (Slider)', icon: '✂️' },
                { key: 'showBio', label: 'פרופיל אודות הצוות (Bio)', icon: '👤' },
                { key: 'showBranches', label: 'סניפים ומפות ניווט Waze', icon: '🗺️' },
                { key: 'showReviews', label: 'ביקורות ודירוגי לקוחות', icon: '⭐' },
                { key: 'showFaqs', label: 'שאלות ותשובות נפוצות (FAQ)', icon: '❓' },
              ].map((item) => {
                const isVisible = (business.layout as any)?.[item.key] !== false;
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggleSection(item.key, isVisible)}
                    className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="font-bold text-slate-200">{item.label}</span>
                    </div>

                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        isVisible ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          isVisible ? '-translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Conversion CTA: Create site with this design */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>אהבת את העיצוב? הקם אתר כזה בחינם 🚀</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              האתר יוקם עם פלטת הצבעים וההגדרות שבחרת הרגע
            </p>
          </div>
        </div>
      )}

      {/* Onboarding Modal with pre-selected industry/colors */}
      <SaaSOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlan="pro"
      />
    </>
  );
}
