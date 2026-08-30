import React from 'react';
import { Flame, Clock, MessageCircle, Check } from 'lucide-react';
import { IndustrySolution } from './solutions-data';

interface SolutionIndustryPreviewProps {
  current: IndustrySolution;
}

export function SolutionIndustryPreview({ current }: SolutionIndustryPreviewProps) {
  return (
    <div className="lg:col-span-5 space-y-4">
      {/* KPI Metric Header Banner */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: `${current.themeColor}20`, color: current.themeColor }}
          >
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-white">{current.stats}</div>
            <div className="text-[10px] text-zinc-400 font-sans">{current.statsDesc}</div>
          </div>
        </div>
      </div>

      {/* Simulated Live Service Card from Demo */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 border-b border-white/10 pb-2">
          <span className="text-white font-black flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current.themeColor }} />
            <span>{current.bizName}</span>
          </span>
          <span>📍 {current.city}</span>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-white block">{current.servicePreview.name}</span>
            <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5 font-sans">
              <Clock className="w-3 h-3" />
              <span>{current.servicePreview.duration}</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-black font-mono block" style={{ color: current.themeColor }}>
              {current.servicePreview.price}
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-bold">
              הזמנה מיידית
            </span>
          </div>
        </div>

        {/* Simulated Automated WhatsApp Confirmation */}
        <div className="p-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 space-y-1 text-right">
          <div className="flex items-center justify-between text-[10px] text-[#25D366] font-bold">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>אישור אוטומטי (WhatsApp)</span>
            </span>
            <span>{current.whatsappPreview.status}</span>
          </div>
          <p className="text-[10px] text-zinc-200 font-sans leading-relaxed">
            "{current.whatsappPreview.message}"
          </p>
        </div>

        {/* Live Feature Checkmarks */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-zinc-400 font-bold">
          <span className="flex items-center gap-1 text-zinc-300">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>קביעת תורים 24/7</span>
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>סנכרון ענן מיידי</span>
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>ללא הורדת אפליקציה</span>
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>תזכורות WhatsApp</span>
          </span>
        </div>
      </div>
    </div>
  );
}
