import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, MessageCircle, ExternalLink, Zap } from 'lucide-react';
import { ShowcaseSite } from './showcase-data';

interface DeviceMockupDesktopProps {
  current: ShowcaseSite;
  selectedServiceIndex: number;
  hasSimulatedBooking: boolean;
  onSelectService: (idx: number) => void;
  onSimulateBooking: () => void;
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team', industry: string) => void;
}

export function DeviceMockupDesktop({
  current,
  selectedServiceIndex,
  hasSimulatedBooking,
  onSelectService,
  onSimulateBooking,
  onOpenOnboarding,
}: DeviceMockupDesktopProps) {
  const activeService = current.services[selectedServiceIndex] || current.services[0];

  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-500">
      {/* Top Browser Bar */}
      <div className="h-11 bg-slate-900/90 px-4 border-b border-slate-800 flex items-center justify-between">
        {/* Window Controls */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>

        {/* URL Pill Bar */}
        <div
          className="px-4 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5"
          dir="ltr"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-200 font-bold">cutweb.app</span>
          <span>/{current.slug}</span>
        </div>

        {/* Badge */}
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: `${current.themeColor}20`,
            color: current.themeColor,
            border: `1px solid ${current.themeColor}40`,
          }}
        >
          {current.badge}
        </span>
      </div>

      {/* Website Canvas Body */}
      <div className={`p-6 sm:p-8 bg-gradient-to-b ${current.bgGradient} text-white space-y-6`}>
        {/* Top Navigation Mock */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-black shadow-sm"
              style={{ backgroundColor: current.themeColor }}
            >
              {current.businessName.charAt(0)}
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight">{current.businessName}</h4>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                📍 {current.city}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-300 font-medium">
            <span>מחירון</span>
            <span>מיקום והגעה</span>
            <span>ביקורות</span>
          </div>

          <button
            type="button"
            onClick={onSimulateBooking}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-black transition-transform hover:scale-105 cursor-pointer shadow-md"
            style={{ backgroundColor: current.themeColor }}
          >
            הזמנת תור אונליין
          </button>
        </div>

        {/* Hero & Services Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Headline & Interactive Services List */}
          <div className="md:col-span-7 space-y-4 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>קביעת תורים 24/7 ללא צורך בהורדת אפליקציה</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {current.slogan}
            </h3>

            {/* Service Items Cards (Interactive selection) */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] text-slate-400 font-bold">
                לחצו על שירות כדי לדמות את חוויית הלקוח:
              </div>
              {current.services.map((srv, i) => {
                const isSelected = selectedServiceIndex === i;
                return (
                  <div
                    key={i}
                    onClick={() => onSelectService(i)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 border-white/40 shadow-md'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: current.themeColor }}
                      />
                      <div>
                        <span className="font-bold text-xs block text-zinc-100">{srv.name}</span>
                        <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {srv.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono font-black text-sm"
                        style={{ color: current.themeColor }}
                      >
                        {srv.price} ₪
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          isSelected
                            ? 'bg-white text-slate-950 font-black'
                            : 'bg-white/10 text-zinc-300'
                        }`}
                      >
                        {isSelected ? 'נבחר ✓' : 'בחר'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Floating Simulated Booking Card */}
          <div className="md:col-span-5 space-y-3">
            {/* Selected Booking Preview Summary Card */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300 border-b border-white/10 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>יומן פתוח לתורים</span>
                </span>
                <span>היום פנוי</span>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[11px] text-zinc-400">שירות שנבחר כעת:</span>
                <div className="font-black text-sm text-white flex items-center justify-between">
                  <span>{activeService.name}</span>
                  <span style={{ color: current.themeColor }} className="font-mono">
                    {activeService.price} ₪
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onSimulateBooking}
                className="w-full py-2.5 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                style={{ backgroundColor: current.themeColor }}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{hasSimulatedBooking ? '✓ תור שוריין בהצלחה!' : 'שריון תור ב-1 קליק (הדמיה)'}</span>
              </button>
            </div>

            {/* Simulated WhatsApp Confirmation Message */}
            <div
              className={`p-3.5 rounded-2xl border transition-all duration-500 space-y-1.5 text-right ${
                hasSimulatedBooking
                  ? 'bg-[#25D366]/25 border-[#25D366] shadow-lg scale-105'
                  : 'bg-[#25D366]/15 border-[#25D366]/30'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-[#25D366] font-bold">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>הודעת אישור אוטומטית (WhatsApp)</span>
                </span>
                <span className="font-mono">{hasSimulatedBooking ? 'נשלח עכשיו ✓' : current.recentBooking.status}</span>
              </div>
              <p className="text-[11px] text-zinc-100 leading-tight font-sans">
                "היי {current.recentBooking.client}! התור שלך ל{activeService.name} ב{current.businessName} אושר בהצלחה ✂️ לחץ כאן לניווט ב-Waze 🚗"
              </p>
            </div>

            {/* Action CTA for this archetype */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
              <Link
                href={`/${current.slug}`}
                target="_blank"
                className="flex-1 w-full py-2 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>צפה באתר לדוגמה ↗</span>
              </Link>

              <button
                type="button"
                onClick={() => onOpenOnboarding('pro', current.category)}
                className="flex-1 w-full py-2 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: current.themeColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>פתח אתר כזה בחינם</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
