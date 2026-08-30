'use client';

import React from 'react';
import { Sparkles, Building2, User, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';

interface OnboardingStep1DetailsProps {
  businessName: string;
  setBusinessName: (val: string) => void;
  ownerName: string;
  setOwnerName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  googleUser: { name: string; email: string; photo?: string } | null;
  googleLoading: boolean;
  onGoogleSignIn: () => void;
  onNext: () => void;
}

export function OnboardingStep1Details({
  businessName,
  setBusinessName,
  ownerName,
  setOwnerName,
  phone,
  setPhone,
  email,
  setEmail,
  city,
  setCity,
  googleUser,
  googleLoading,
  onGoogleSignIn,
  onNext,
}: OnboardingStep1DetailsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1-Click Google Sign-In Button */}
      <div className="space-y-2">
        {googleUser ? (
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {googleUser.name.charAt(0) || 'G'}
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>{googleUser.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">
                    מחובר עם Google ✓
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono" dir="ltr">
                  {googleUser.email}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-indigo-600 font-bold">חשבון מאומת</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs hover:border-slate-300 disabled:opacity-50 cursor-pointer"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>הרשמה מהירה בלחיצה אחת עם Google</span>
          </button>
        )}

        <div className="flex items-center gap-3 py-1">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[11px] text-slate-400 font-bold">או מילוי פרטי העסק</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">שם העסק / המותג *</label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="למשל: סטודיו מיה, ברברשופ דני"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
            />
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">שם בעל/ת העסק *</label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="השם הפרטי שלך"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">טלפון נייד (לוואטסאפ) *</label>
          <div className="relative">
            <input
              type="tel"
              required
              placeholder="050-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
              dir="ltr"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">אימייל (לדוחות וניהול)</label>
          <div className="relative">
            <input
              type="email"
              placeholder="name@business.co.il"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
              dir="ltr"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 block">עיר / יישוב</label>
        <div className="relative">
          <input
            type="text"
            placeholder="למשל: תל אביב, אריאל, ראשון לציון"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer mt-2"
      >
        <span>המשך לבחירת ענף וחבילה</span>
        <ArrowLeft className="w-4 h-4 text-indigo-400" />
      </button>
    </form>
  );
}
