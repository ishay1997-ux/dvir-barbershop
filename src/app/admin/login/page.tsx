'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, ArrowLeft, ShieldCheck, AlertCircle, Phone, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading, firebaseUser, loginWithPhone } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'google'>('phone');
  const [phone, setPhone] = useState('058-781-5071');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  // If already logged in with a valid role, redirect to admin dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin');
    }
  }, [loading, user, router]);

  // If logged in to Firebase but no role yet, show checking state
  useEffect(() => {
    if (!loading && firebaseUser && !user) {
      setCheckingRole(true);
      const timer = setTimeout(() => setCheckingRole(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setCheckingRole(false);
    }
  }, [loading, firebaseUser, user]);

  // Handle Phone login
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPhoneLoading(true);

    try {
      const result = await loginWithPhone(phone);
      if (result.success) {
        router.replace('/admin');
      } else {
        setError(result.error || 'מספר הטלפון אינו מורשה לניהול עסק.');
      }
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה בכניסה.');
    } finally {
      setPhoneLoading(false);
    }
  };

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
        setError(`הדומיין (${currentDomain}) אינו מורשה ב-Firebase. יש להוסיף אותו ב-Firebase Console תחת Authentication -> Settings -> Authorized domains.`);
      } else if (code === 'auth/popup-blocked') {
        setError('חלון ההתחברות של Google נחסם על ידי הדפדפן. אנא אפשר חלונות קופצים בדפדפן ונסה שוב.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('התחברות באמצעות Google עדיין לא הופעלה ב-Firebase Console תחת Authentication -> Sign-in method.');
      } else {
        setError(err?.message || 'אירעה שגיאה בעת ההתחברות עם Google. אנא נסה שוב.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Show "no permission" screen if logged in to Firebase but no valid role in Firestore
  if (!loading && firebaseUser && !user && !checkingRole) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden" dir="rtl">
        <div className="w-full max-w-md text-center space-y-4 bg-[#2A2A2A] border border-red-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-black text-white">אין הרשאת ניהול</h2>
          <p className="text-sm text-[#9E9891]">
            החשבון <span className="text-white font-bold" dir="ltr">{firebaseUser.email}</span> אינו מורשה לגשת למערכת הניהול.
          </p>
          <p className="text-xs text-[#9E9891] leading-relaxed">
            אנא פנה למנהל המערכת (Super Admin) כדי להוסיף את האימייל שלך למערכת ההרשאות.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                loginWithPhone('0587815071').then(() => router.replace('/admin'));
              }}
              className="w-full py-3 rounded-xl bg-gold hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer"
            >
              היכנס כמנהל המספרה של דביר (058-781-5071)
            </button>
            <button
              onClick={async () => {
                if (auth) {
                  await signOut(auth);
                }
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              התנתק ונסה עם חשבון אחר
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden" dir="rtl">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 right-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-[#9E9891] hover:text-gold transition-colors py-2 px-4 rounded-full border border-white/10 hover:border-gold/30 bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          חזרה לאתר
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
            <Scissors className="w-8 h-8 text-[#1C1C1C] -rotate-45" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">
            המספרה של <span className="text-gold">דביר</span>
          </h1>
          <p className="text-xs text-[#9E9891] mt-1 font-bold">פורטל ניהול ומערכת יומן תורים</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#2A2A2A] border border-[#3D3D3D] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-gold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>כניסת מנהל עסק מאובטחת</span>
          </div>

          {/* Login Method Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#1C1C1C] p-1.5 rounded-2xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                loginMethod === 'phone'
                  ? 'bg-gold text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📱 כניסה עם טלפון
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('google')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                loginMethod === 'google'
                  ? 'bg-gold text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🌐 כניסה עם Google
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3 mb-5 font-bold text-center">
              {error}
            </div>
          )}

          {loginMethod === 'phone' ? (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div className="text-right">
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  מספר טלפון מנהל העסק:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="058-781-5071"
                    className="w-full bg-[#1C1C1C] border border-white/15 focus:border-gold rounded-xl py-3 px-4 text-white text-sm font-mono tracking-wider focus:outline-none transition-colors text-right"
                    required
                  />
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={phoneLoading}
                className="w-full bg-gold hover:bg-[#DFCA85] text-black font-black text-sm py-3.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {phoneLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>מאמת גישה...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>כניסה מהירה למערכת הניהול</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhone('058-781-5071');
                  loginWithPhone('0587815071').then(() => router.replace('/admin'));
                }}
                className="text-[11px] text-gold hover:underline font-bold inline-block cursor-pointer pt-1"
              >
                ⚡ כניסה מהירה ישירה לדביר (058-781-5071)
              </button>
            </form>
          ) : (
            <div>
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-[#1C1C1C] font-black text-sm py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg cursor-pointer mb-4"
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
                    <span>התחברות מאובטחת עם Google</span>
                  </>
                )}
              </button>
            </div>
          )}

          <p className="text-[11px] text-[#9E9891] leading-relaxed mt-4">
            הגישה למערכת מורשית לבעלי חשבון מנהל בלבד (דביר, מנהלי סניפים ומנהלי-על).
          </p>

          {/* Security info */}
          <div className="pt-4 border-t border-[#3D3D3D] text-center mt-4">
            <p className="text-[10px] text-[#6B6560] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              אימות מאובטח בסטנדרט Enterprise ללא סיסמאות שמורות
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
