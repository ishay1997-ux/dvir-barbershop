'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Scissors,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Layers,
  Wrench,
  Dumbbell,
  HeartHandshake,
} from 'lucide-react';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { getBusinessBySlug } from '@/lib/business-service';
import { BusinessConfig } from '@/types/business';
import { SaaSOnboardingModal } from '@/components/marketing/SaaSOnboardingModal';

function AdminLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawSlug = searchParams.get('slug') || '';
  const cleanSlug = rawSlug.trim().toLowerCase();

  const { user, loading, firebaseUser, loginAsDemo } = useAuth();
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);
  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [isLoadingBiz, setIsLoadingBiz] = useState(!!cleanSlug);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // 1. Fetch business details if slug query parameter is provided
  useEffect(() => {
    if (!cleanSlug) {
      setBusiness(null);
      setIsLoadingBiz(false);
      return;
    }

    let isMounted = true;
    getBusinessBySlug(cleanSlug)
      .then((b) => {
        if (isMounted) {
          setBusiness(b);
          setIsLoadingBiz(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load business branding for login:', err);
        if (isMounted) setIsLoadingBiz(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cleanSlug]);

  // 2. Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      if (cleanSlug) {
        router.replace(`/admin?slug=${cleanSlug}`);
      } else {
        router.replace('/admin');
      }
    }
  }, [loading, user, cleanSlug, router]);

  // 3. Checking role timer state
  useEffect(() => {
    if (!loading && firebaseUser && !user) {
      setCheckingRole(true);
      const timer = setTimeout(() => setCheckingRole(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setCheckingRole(false);
    }
  }, [loading, firebaseUser, user]);

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      if (!auth || !isFirebaseConfigured) {
        throw new Error('שירות האימות אינו מוגדר.');
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google login error:', err);
      const code = err?.code || '';

      if (code === 'auth/popup-closed-by-user') {
        // Closed popup
      } else if (code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
        setError(`הדומיין (${currentDomain}) אינו מורשה ב-Firebase. יש להוסיף אותו ב-Firebase Console.`);
      } else if (code === 'auth/popup-blocked') {
        setError('חלון ההתחברות של Google נחסם על ידי הדפדפן. אנא אפשר חלונות קופצים ונסה שוב.');
      } else {
        setError(err?.message || 'אירעה שגיאה בעת ההתחברות עם Google. אנא נסה שוב.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Dynamic Theme & Brand Extraction
  const themeColor = business?.themeColor || '#6366F1';
  const brandName = business?.name || (cleanSlug ? cleanSlug : 'CutWeb OS');
  const brandSubtitle = business?.ownerName
    ? `פורטל ניהול ומערכת יומן תורים · ${business.ownerName}`
    : cleanSlug
    ? 'פורטל ניהול ומערכת יומן תורים'
    : 'פורטל ניהול עסקים, יומנים וסנכרון תורים בענן';

  const backUrl = business ? (business.slug === 'dvir' || business.slug === 'thecut' ? '/dvir' : `/${business.slug}`) : '/';
  const backLabel = business ? `חזרה לאתר ${business.name}` : 'חזרה לאתר הראשי';

  // Industry Icon Selector
  const renderBrandIcon = () => {
    if (!business) {
      return <Sparkles className="w-8 h-8 text-white" />;
    }
    const cat = business.category;
    const name = (business.name || '').toLowerCase();
    if (cat === 'barber' || name.includes('מספר') || name.includes('barber')) {
      return <Scissors className="w-8 h-8 text-slate-950 -rotate-45" />;
    }
    if (cat === 'beauty_salon' || name.includes('ציפורנ') || name.includes('יופי') || name.includes('קוסמטיק')) {
      return <Sparkles className="w-8 h-8 text-slate-950" />;
    }
    if (cat === 'home_technician' || name.includes('טכנאי') || name.includes('אינסטלצ')) {
      return <Wrench className="w-8 h-8 text-slate-950" />;
    }
    if (cat === 'private_instructor' || cat === 'clinic_therapist' || name.includes('מאמן') || name.includes('קליניק')) {
      return <Dumbbell className="w-8 h-8 text-slate-950" />;
    }
    return <Sparkles className="w-8 h-8 text-slate-950" />;
  };

  // Show "no permission" screen
  if (!loading && firebaseUser && !user && !checkingRole) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden" dir="rtl">
        <div className="w-full max-w-md text-center space-y-4 bg-[#2A2A2A] border border-red-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-black text-white">אין הרשאת ניהול לחשבון זה</h2>
          <p className="text-sm text-[#9E9891]">
            החשבון <span className="text-white font-bold" dir="ltr">{firebaseUser.email}</span> אינו מורשה לגשת למערכת הניהול של <span className="text-white font-bold">{brandName}</span>.
          </p>
          <p className="text-xs text-[#9E9891] leading-relaxed">
            הגישה למערכת מוגבלת למנהלי העסק הרשומים בלבד ולמנהלי-על.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={async () => {
                if (auth) await signOut(auth);
              }}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs transition-colors cursor-pointer"
            >
              התנתק והתחבר עם חשבון Google מורשה
            </button>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs border border-indigo-500/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>רוצה להקים מערכת לעסק שלך? הקם בחינם</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141416] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden" dir="rtl">
      {/* Ambient background glows matching tenant's themeColor */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: themeColor }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15 transition-all duration-700"
        style={{ backgroundColor: themeColor }}
      />

      {/* Back Link */}
      <div className="absolute top-6 right-6 z-10">
        <Link
          href={backUrl}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full border border-white/10 hover:border-white/25 bg-white/5 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel}</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl transition-all duration-500 transform hover:scale-105"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 10px 30px -5px ${themeColor}60`,
            }}
          >
            {renderBrandIcon()}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {brandName}
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-bold leading-relaxed">{brandSubtitle}</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1C1D21] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center backdrop-blur-xl">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border text-[11px] font-bold mb-6"
            style={{
              borderColor: `${themeColor}40`,
              color: themeColor,
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>כניסת מנהל מאובטחת</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3 mb-5 font-bold text-center">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-slate-900 font-black text-sm py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg cursor-pointer mb-3"
          >
            {googleLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-900 rounded-full animate-spin" />
                <span>מתחבר לחשבון Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 15.24 0 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>התחברות מאובטחת עם חשבון Google</span>
              </>
            )}
          </button>

          {/* 1-Click Interactive Demo Sandbox Access */}
          <div className="pt-1 pb-3">
            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[11px] text-slate-400 font-bold">מעוניין להתרשם?</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button
              type="button"
              onClick={() => {
                loginAsDemo();
                router.push(cleanSlug ? `/admin?slug=${cleanSlug}&demo=true` : '/admin?demo=true');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>כניסה למצב הדגמה חופשי (Demo Sandbox) 🚀</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            הגישה למערכת פעילה מותרת למנהלי העסק הרשומים בלבד.
          </p>

          {/* Security info */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              אימות מאובטח בסטנדרט Enterprise באמצעות אימות Google וטוקן מוצפן
            </p>
          </div>
        </div>
      </div>

      <SaaSOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlan="pro"
      />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#141416] flex items-center justify-center text-white text-xs font-bold" dir="rtl">
          טוען ממשק התחברות מאובטח...
        </div>
      }
    >
      <AdminLoginPageContent />
    </Suspense>
  );
}
