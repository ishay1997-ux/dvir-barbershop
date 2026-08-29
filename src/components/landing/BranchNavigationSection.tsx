'use client';

import { useState } from 'react';
import { MapPin, Navigation, Phone, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { INITIAL_BRANCHES } from '@/lib/store';

export default function BranchNavigationSection() {
  const currentDay = new Date().getDay();
  // Ariel: Sun, Mon, Tue (0, 1, 2). Rehovot: Wed, Thu, Fri (3, 4, 5)
  const isArielToday = currentDay <= 2;
  const [selectedBranchId, setSelectedBranchId] = useState<'ariel' | 'rehovot'>(
    isArielToday ? 'ariel' : 'rehovot'
  );

  const branch = INITIAL_BRANCHES.find((b) => b.id === selectedBranchId) || INITIAL_BRANCHES[0];

  return (
    <section id="locations" className="py-12 sm:py-16 bg-[#141414] text-white" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#33CCFF]/10 border border-[#33CCFF]/30 text-[#33CCFF] text-xs font-bold mb-2.5">
            <Navigation className="w-3.5 h-3.5" />
            <span>סניפים ודרכי הגעה</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            איפה אנחנו נמצאים?
          </h2>
          <p className="text-xs sm:text-sm text-[#9E9891] mt-1.5">
            דביר פועל בשני סניפים נוחים עם חניה צמודה וגישה נוחה
          </p>
        </div>

        {/* Branch Toggle Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#222222] p-1.5 rounded-2xl border border-white/10 flex gap-1 shadow-lg">
            <button
              onClick={() => setSelectedBranchId('ariel')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                selectedBranchId === 'ariel'
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#DFCA85] text-[#1C1C1C] shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📍 סניף אריאל (ימים א׳-ג׳)
              {isArielToday && (
                <span className="mr-1.5 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  פתוח היום
                </span>
              )}
            </button>

            <button
              onClick={() => setSelectedBranchId('rehovot')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                selectedBranchId === 'rehovot'
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#DFCA85] text-[#1C1C1C] shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📍 סניף רחובות (ימים ד׳-ו׳)
              {!isArielToday && currentDay !== 6 && (
                <span className="mr-1.5 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  פתוח היום
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Map & Navigation Card (Matching Screenshot 2) */}
        <div className="max-w-4xl mx-auto bg-[#202020] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Map Preview Graphic Frame */}
          <div className="relative h-64 sm:h-72 w-full bg-[#18232c] overflow-hidden flex items-center justify-center">
            {/* Styled Map Background Grid */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, rgba(51, 204, 255, 0.15) 0%, transparent 60%),
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
              <div className="w-12 h-12 rounded-full bg-red-600 border-3 border-white shadow-2xl flex items-center justify-center text-white">
                <MapPin className="w-6 h-6 fill-current" />
              </div>
              <div className="mt-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-white shadow-md">
                {branch.name}
              </div>
            </div>

            {/* Map UI Controls Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/15 text-xs text-zinc-300">
              <span className="px-2 py-0.5 font-bold">🚗 רכב / חניה צמודה</span>
            </div>
          </div>

          {/* Location Details & Navigation Buttons */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-lg sm:text-xl font-black text-white">{branch.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C9A84C]" />
                  <span>{branch.address}</span>
                </p>
              </div>

              <div className="text-xs sm:text-sm font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1.5 rounded-xl border border-[#C9A84C]/30 self-start sm:self-auto">
                {branch.shortDescription}
              </div>
            </div>

            {/* Direct Navigation Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* 1. Waze Button */}
              <a
                href={branch.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-2xl bg-[#33CCFF] hover:bg-[#28b8e6] text-[#003344] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
              >
                <Navigation className="w-4 h-4 fill-current" /> נווט ב-Waze
              </a>

              {/* 2. Google Maps Button */}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/15 shadow-md transition-colors"
              >
                <MapPin className="w-4 h-4 text-emerald-400" /> Google Maps
              </a>

              {/* 3. Call Branch Button */}
              <a
                href={`tel:${branch.phone}`}
                className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/15 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C9A84C]" /> התקשר לדביר
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
