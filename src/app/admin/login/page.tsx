'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Scissors,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Wrench,
  Dumbbell,
  Building2,
  Zap,
  BarChart3,
  Lock,
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
        // User closed popup
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
      return <Scissors className="w-8 h-8 text-white -rotate-45" />;
    }
    if (cat === 'beauty_salon' || name.includes('ציפורנ') || name.includes('יופי') || name.includes('קוסמטיק')) {
      return <Sparkles className="w-8 h-8 text-white" />;
    }
    if (cat === 'home_technician' || name.includes('טכנאי') || name.includes('אינסטלצ')) {
      return <Wrench className="w-8 h-8 text-white" />;
    }
    if (cat === 'private_instructor' || cat === 'clinic_therapist' || name.includes('מאמן') || name.includes('קליניק')) {
      return <Dumbbell className="w-8 h-8 text-white" />;
    }
    return <Sparkles className="w-8 h-8 text-white" />;
  };

  // Show "no permission" screen (Light & Friendly)
  if (!loading && firebaseUser && !user && !checkingRole) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans" dir="rtl">
        <div className="w-full max-w-md text-center space-y-4 bg-white border border-rose-200/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-rose-100/50">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">אין הרשאת ניהול לחשבון זה</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
            החשבון <span className="text-slate-900 font-bold" dir="ltr">{firebaseUser.email}</span> אינו מורשה לגשת למערכת הניהול של <span className="text-indigo-600 font-bold">{brandName}</span>.
          </p>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            הגישה למערכת מוגבלת למנהלי העסק הרשומים בלבד ולמנהלי-על.
          </p>
          <div className="pt-3 flex flex-col gap-2.5">
            <button
              onClick={async () => {
                if (auth) await signOut(auth);
              }}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
            >
              התנתק והתחבר עם חשבון Google מורשה
            </button>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>רוצה להקים מערכת לעסק שלך? הקם בחינם</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white"
      dir="rtl"
    >
      {/* Ambient background glows matching tenant's themeColor in light mode */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30 transition-all duration-700"
        style={{ backgroundColor: themeColor }}
      />
      <div
        className="absolute top-1/2 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none"
      />
      <div
        className="absolute -bottom-32 right-1/3 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"
      />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link
          href={backUrl}
          className="flex items-center gap-2.5 group transition-transform hover:scale-102"
        >
          <div
            className="w-10 h-10 rounded-2xl text-white flex items-center justify-center font-black shadow-md text-lg"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 4px 12px ${themeColor}40`,
            }}
          >
            {brandName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-slate-900 tracking-tight">{brandName}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                פורטל ניהול
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">מערכת יומן ושליטה</p>
          </div>
        </Link>

        <Link
          href={backUrl}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-sm text-xs font-bold transition-all"
        >
          <span>{backLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </Link>
      </header>

      {/* Main Center Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-100/60 border border-slate-200/90 text-center relative transition-all">
          
          {/* Top Pill */}
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold mb-6 shadow-xs"
            style={{
              backgroundColor: `${themeColor}12`,
              borderColor: `${themeColor}40`,
              color: themeColor,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>כניסת מנהל עסק מאובטחת</span>
          </div>

          {/* Brand Icon */}
          <div
            className="w-18 h-18 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl ring-8 ring-slate-100 transform hover:scale-105 transition-transform"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 10px 25px -5px ${themeColor}60`,
            }}
          >
            {renderBrandIcon()}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            {brandName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 font-sans leading-relaxed">
            {brandSubtitle}
          </p>

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
            <div className="flex flex-col items-center text-center p-1.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center mb-1 shadow-xs">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-tight">יומן חכם</span>
            </div>

            <div className="flex flex-col items-center text-center p-1.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-1 shadow-xs">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-tight">וואטסאפ</span>
            </div>

            <div className="flex flex-col items-center text-center p-1.5">
              <div className="w-7 h-7 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center mb-1 shadow-xs">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-tight">דוחות CRM</span>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 mb-5 font-bold text-center">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-4 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-indigo-400 shadow-md shadow-slate-200/60 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 group transform active:scale-98 mb-4"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
            )}
            <span>התחברות מהירה עם חשבון Google מורשה</span>
          </button>

          {/* 1-Click Interactive Demo Sandbox Access */}
          <div className="pt-2 pb-2">
            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[11px] text-slate-400 font-bold">מעוניין רק להתרשם?</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <button
              type="button"
              onClick={() => {
                loginAsDemo();
                router.push(cleanSlug ? `/admin?slug=${cleanSlug}&demo=true` : '/admin?demo=true');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>כניסה למצב הדגמה חופשי (Demo Sandbox) 🚀</span>
            </button>
          </div>

          {/* Security Guarantee Note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-sans">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>חיבור מאובטח בתקן SSL/TLS · גישה מוגבלת למנהלים</span>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 py-4 border-t border-slate-200/60 text-xs text-slate-400 text-center sm:text-right font-sans">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>מערכת הענן פעילה ומאובטחת</span>
        </div>
        <div>
          CutWeb Platform v2.2 · כל הזכויות שמורות
        </div>
      </footer>

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
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-600 text-xs font-bold font-sans" dir="rtl">
          טוען ממשק התחברות מאובטח...
        </div>
      }
    >
      <AdminLoginPageContent />
    </Suspense>
  );
}
