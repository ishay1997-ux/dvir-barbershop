'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, ArrowLeft } from 'lucide-react';

interface MarketingNavbarProps {
  onOpenOnboarding: () => void;
}

export function MarketingNavbar({ onOpenOnboarding }: MarketingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/85 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              CutWeb <span className="text-indigo-600">OS</span>
            </span>
            <span className="hidden sm:inline-block mr-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              SaaS v2.4
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
          <a href="#solutions" className="hover:text-indigo-600 transition-colors">
            ענפים ופתרונות
          </a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">
            יכולות הפלטפורמה
          </a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">
            חבילות ומחירים
          </a>
          <Link
            href="/accessibility"
            className="hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>הצהרת נגישות</span>
          </Link>
        </nav>

        {/* Auth & CTA Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/login"
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 py-2.5 px-4 rounded-xl hover:bg-slate-100/80 transition-all"
          >
            כניסה למערכת
          </Link>
          <button
            onClick={onOpenOnboarding}
            className="text-xs font-black bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
          >
            <span>התחל בחינם</span>
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
