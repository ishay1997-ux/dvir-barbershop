'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SaaSOnboardingModal } from '@/components/marketing/SaaSOnboardingModal';

export function LegalNavbar() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-slate-200/80 shadow-xs" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900">
                CutWeb <span className="text-indigo-600">OS</span>
              </span>
              <span className="hidden sm:inline-block mr-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                SaaS Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>חזרה לדף הבית</span>
            </Link>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">
              תנאי שימוש
            </Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
              מדיניות פרטיות
            </Link>
            <Link href="/accessibility" className="hover:text-indigo-600 text-indigo-600 transition-colors flex items-center gap-1 font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
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
              onClick={() => setIsOnboardingOpen(true)}
              className="text-xs font-black bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>הקמת עסק בחינם</span>
            </button>
          </div>
        </div>
      </header>

      <SaaSOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlan="pro"
      />
    </>
  );
}
