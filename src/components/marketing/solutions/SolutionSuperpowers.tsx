import React from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles } from 'lucide-react';
import { IndustrySolution } from './solutions-data';

interface SolutionSuperpowersProps {
  current: IndustrySolution;
  onOpenOnboarding: (plan: 'starter' | 'pro' | 'team', industryTitle: string) => void;
}

export function SolutionSuperpowers({
  current,
  onOpenOnboarding,
}: SolutionSuperpowersProps) {
  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="flex items-center gap-2.5">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md font-bold text-slate-950"
          style={{ backgroundColor: current.themeColor }}
        >
          {current.icon}
        </div>
        <div>
          <span
            className="text-xs font-black uppercase tracking-wider block"
            style={{ color: current.themeColor }}
          >
            {current.title}
          </span>
          <span className="text-[11px] text-zinc-400 font-sans">
            התאמה אוטונומית לעסק · {current.city}
          </span>
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
        {current.tagline}
      </h3>

      {/* 4 Rich Superpower Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {current.superpowers.map((sp, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-1.5 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{sp.icon}</span>
              <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                {sp.title}
              </h4>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              {sp.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Dual CTA Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href={`/${current.slug}`}
          target="_blank"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105"
        >
          <ExternalLink className="w-4 h-4" />
          <span>{current.ctaLabel}</span>
        </Link>

        <button
          type="button"
          onClick={() => onOpenOnboarding('pro', current.title)}
          className="w-full sm:w-auto px-5 py-3 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 cursor-pointer"
          style={{ backgroundColor: current.themeColor }}
        >
          <Sparkles className="w-4 h-4" />
          <span>הקמת אתר ומערכת לעסק ב-60 שניות</span>
        </button>
      </div>
    </div>
  );
}
