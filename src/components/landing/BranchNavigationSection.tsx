'use client';

import { useState } from 'react';
import { MapPin, Navigation, Phone, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { INITIAL_BRANCHES } from '@/lib/store';
import { BusinessConfig } from '@/types/business';
import { getThemeTokens } from '@/lib/theme-tokens';

export default function BranchNavigationSection({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const branches = business?.branches && business.branches.length > 0
    ? business.branches.map((b, i) => ({
        id: `branch-${i}`,
        name: b.name,
        address: b.address,
        wazeUrl: b.wazeLink || `https://waze.com/ul?q=${encodeURIComponent(b.address || b.name)}`,
        phone: b.phone || business?.phone || '052-1234567',
        hours: b.hours || '09:00 - 19:00',
      }))
    : INITIAL_BRANCHES.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        wazeUrl: b.wazeUrl,
        phone: b.phone,
        hours: b.id === 'ariel' ? 'א׳-ג׳: 09:00 - 20:00' : 'ד׳-ו׳: 09:00 - 20:00',
      }));

  const [selectedBranchIndex, setSelectedBranchIndex] = useState<number>(0);
  const activeBranch = branches[selectedBranchIndex] || branches[0];

  return (
    <section id="locations" className={`py-12 sm:py-16 transition-colors ${t.sectionBg}`} dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2.5 border"
            style={{
              backgroundColor: `${themeColor}15`,
              borderColor: `${themeColor}40`,
              color: themeColor,
            }}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>סניפים ודרכי הגעה</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${t.textPrimary}`}>
            {business?.layout?.sectionTitles?.branches || 'איפה אנחנו נמצאים?'}
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 font-sans ${t.textSecondary}`}>
            {bizName} – הגעה נוחה, חניה צמודה ומיקום מרכזי
          </p>
        </div>

        {/* Branch Toggle Tabs */}
        {branches.length > 1 && (
          <div className="flex justify-center mb-6">
            <div className={`p-1.5 rounded-2xl border flex gap-1 shadow-lg flex-wrap justify-center ${t.isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#222222] border-white/10'}`}>
              {branches.map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedBranchIndex(idx)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    selectedBranchIndex === idx
                      ? 'text-[#1C1C1C] shadow-md font-black'
                      : `${t.textMuted} hover:${t.textPrimary}`
                  }`}
                  style={{
                    backgroundColor: selectedBranchIndex === idx ? themeColor : undefined,
                  }}
                >
                  📍 {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Map & Navigation Card */}
        <div className={`max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl transition-colors ${t.cardBg}`}>
          {/* Map Preview Graphic Frame */}
          <div className="relative h-64 sm:h-72 w-full bg-[#18232c] overflow-hidden flex items-center justify-center">
            {/* Styled Map Background Grid */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, ${themeColor}20 0%, transparent 60%),
                  linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 30px 30px, 30px 30px',
              }}
            />

            {/* Map Roads Vector Graphic */}
            <svg className="absolute inset-0 w-full h-full stroke-white/10 stroke-[2] fill-none">
              <path d="M0,100 Q300,180 600,120 T1200,200" />
              <path d="M100,0 Q200,250 400,300" />
              <path d="M500,0 L400,300" />
              <path d="M0,220 Q400,180 800,240" stroke="#FBBF24" strokeWidth="3" strokeDasharray="6 6" />
            </svg>

            {/* Central Animated Location Pin */}
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div
                className="w-12 h-12 rounded-full border-3 border-white shadow-2xl flex items-center justify-center text-white"
                style={{ backgroundColor: themeColor }}
              >
                <MapPin className="w-6 h-6 fill-current" />
              </div>
              <div
                className="mt-2 px-3 py-1 rounded-full text-white text-[11px] font-black shadow-lg border border-white/20 whitespace-nowrap bg-black/80"
              >
                {activeBranch.name}
              </div>
            </div>

            {/* Live Navigation CTA Overlay */}
            <a
              href={activeBranch.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 z-20 px-4 py-2 rounded-xl bg-[#33CCFF] hover:bg-[#33CCFF]/90 text-[#1C1C1C] text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform cursor-pointer"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>פתח ניווט ישיר ב-Waze</span>
            </a>
          </div>

          {/* Branch Details Row */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Address */}
            <div className="flex items-start gap-3.5 text-right">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${themeColor}15`,
                  borderColor: `${themeColor}40`,
                  color: themeColor,
                }}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-[11px] font-bold block ${t.textMuted}`}>כתובת הסניף</span>
                <p className={`font-black text-sm mt-0.5 ${t.textPrimary}`}>{activeBranch.address}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3.5 text-right">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${t.isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-zinc-300'}`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-[11px] font-bold block ${t.textMuted}`}>שעות פעילות</span>
                <p className={`font-bold text-xs sm:text-sm mt-0.5 ${t.textPrimary}`} dir="ltr">
                  {activeBranch.hours || '09:00 - 19:00'}
                </p>
              </div>
            </div>

            {/* Direct Call CTA */}
            <div className="flex gap-2">
              <a
                href={`tel:${activeBranch.phone}`}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors cursor-pointer border ${t.buttonSecondaryBg}`}
              >
                <Phone className="w-4 h-4" style={{ color: themeColor }} />
                <span>חייג לסניף</span>
              </a>

              <a
                href={activeBranch.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl text-[#1C1C1C] font-black text-xs text-center flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-md cursor-pointer"
                style={{ backgroundColor: themeColor }}
              >
                <Navigation className="w-4 h-4" />
                <span>Waze</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
