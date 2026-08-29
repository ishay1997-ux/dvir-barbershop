'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Scissors, ArrowLeft, ShieldCheck, Eye, EyeOff, KeyRound, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot / Reset Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // If already logged in, redirect straight to admin dashboard
  useEffect(() => {
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.replace('/admin');
        }
      });
      return () => unsubscribe();
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    const cleanPass = password.trim().toLowerCase();

    // Fast-track PIN login
    const validPins = ['1997', 'dvir', 'admin', '1234', 'ishay', 'ishay2025'];
    if (validPins.includes(cleanPass) || validPins.includes(cleanEmail)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('thecut_admin_authenticated', 'true');
      }
      router.push('/admin');
      return;
    }

    if (!cleanEmail) {
      setError('אנא הזן כתובת אימייל');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setError('אנא הזן כתובת אימייל מלאה ותקינה (לדוגמה: dvir@gmail.com)');
      return;
    }

    if (!password) {
      setError('אנא הזן סיסמה');
      return;
    }

    setLoading(true);

    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('thecut_admin_authenticated', 'true');
      }
      router.push('/admin');
    } catch (err: any) {
      console.error('Firebase login error:', err);
      const code = err?.code || '';

      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
      ) {
        setError('כתובת אימייל או סיסמה שגויים. אנא נסה שוב.');
      } else if (code === 'auth/invalid-email') {
        setError('כתובת אימייל אינה תקינה.');
      } else if (code === 'auth/too-many-requests') {
        setError('בוצעו יותר מדי ניסיונות כושלים. החשבון ננעל זמנית להגנה, אנא נסה שוב בעוד מספר דקות.');
      } else if (code === 'auth/network-request-failed') {
        setError('שגיאת תקשורת עם שרת האימות. אנא בדוק את החיבור לרשת.');
      } else {
        setError(err?.message || 'אירעה שגיאה בעת ההתחברות. אנא נסה שוב.');
      }
      setLoading(false);
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
      router.push('/admin');
    } catch (err: any) {
      console.error('Google login error:', err);
      const code = err?.code || '';

      if (code === 'auth/popup-closed-by-user') {
        // User closed the popup
      } else if (code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
        setError(`הדומיין (${currentDomain}) אינו מורשה ב-Firebase. יש להוסיף אותו ב-Firebase Console תחת Authentication -> Settings -> Authorized domains.`);
      } else if (code === 'auth/popup-blocked') {
        setError('חלון ההתחברות של Google נחסם על ידי הדפדפן. אנא אפשר חלונות קופצים בדפדפן ונסה שוב.');
      } else if (code === 'auth/account-exists-with-different-credential') {
        setError('קיים כבר חשבון עם כתובת אימייל זו בשיטת התחברות אחרת.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('התחברות באמצעות Google עדיין לא הופעלה ב-Firebase Console תחת Authentication -> Sign-in method.');
      } else {
        setError(err?.message || 'אירעה שגיאה בעת ההתחברות עם Google. אנא נסה שוב.');
      }
      setGoogleLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    const cleanEmail = resetEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setResetError('אנא הזן כתובת אימייל תקינה');
      return;
    }

    setResetLoading(true);

    try {
      if (!auth || !isFirebaseConfigured) {
        throw new Error('שירות האימות אינו זמין כרגע.');
      }

      await sendPasswordResetEmail(auth, cleanEmail);
      setResetSuccess(true);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 4000);
    } catch (err: any) {
      console.error('Firebase password reset error:', err);
      const code = err?.code || '';

      if (code === 'auth/user-not-found') {
        setResetError('לא נמצא משתמש המשויך לכתובת אימייל זו.');
      } else if (code === 'auth/invalid-email') {
        setResetError('כתובת אימייל אינה תקינה.');
      } else if (code === 'auth/too-many-requests') {
        setResetError('נשלחו בקשות רבות מדי. אנא נסה שוב מאוחר יותר.');
      } else {
        setResetError('שגיאה בשליחת קישור איפוס סיסמה. אנא נסה שוב.');
      }
    } finally {
      setResetLoading(false);
    }
  };

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
          <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
            <Scissors className="w-7 h-7 text-[#1C1C1C] -rotate-45" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">
            המספרה של <span className="text-gold">דביר</span>
          </h1>
          <p className="text-xs text-[#9E9891] mt-1 font-bold">פורטל ניהול ומערכת יומן</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#2A2A2A] border border-[#3D3D3D] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center gap-2 mb-6 text-gold text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            כניסת מנהל מאובטחת
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
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-[#1C1C1C] hover:bg-[#242424] text-white border border-[#3D3D3D] hover:border-gold/50 font-bold text-xs py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-sm cursor-pointer mb-5"
          >
            {googleLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                מתחבר עם Google...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
                התחבר באמצעות Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#3D3D3D] w-full" />
            <span className="bg-[#2A2A2A] px-3 text-[11px] font-bold text-[#9E9891] uppercase tracking-wider">
              או באמצעות אימייל
            </span>
            <div className="border-t border-[#3D3D3D] w-full" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-xs font-bold text-[#D5CBB8]">
                כתובת אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full bg-[#1C1C1C] border border-[#3D3D3D] focus:border-gold rounded-xl py-3 pr-10 pl-4 text-white text-sm outline-none transition-colors placeholder:text-[#555]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="text-xs font-bold text-[#D5CBB8]">
                  סיסמה
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetError('');
                    setResetSuccess(false);
                    setIsForgotModalOpen(true);
                  }}
                  className="text-[11px] text-gold hover:underline font-medium"
                >
                  שכחת סיסמה?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#1C1C1C] border border-[#3D3D3D] focus:border-gold rounded-xl py-3 pr-10 pl-10 text-white text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6560] hover:text-white transition-colors"
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn-shimmer w-full text-[#1C1C1C] font-black text-sm py-3.5 rounded-xl mt-2 hover:scale-[1.02] active:scale-95 transition-all shadow-gold disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              id="admin-login-submit"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#1C1C1C]/30 border-t-[#1C1C1C] rounded-full animate-spin" />
                  מאמת פרטים מול השרת...
                </>
              ) : (
                'התחבר עם אימייל וסיסמה'
              )}
            </button>

            {/* Quick 1-Click Entry for Dvir */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('thecut_admin_authenticated', 'true');
                }
                router.push('/admin');
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
            >
              ⚡ כניסה מהירה לדביר (בעל המספרה)
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#2A2A2A] border border-[#3D3D3D] rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 left-4 text-[#9E9891] hover:text-white p-1 rounded-full bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase mb-2">
              <KeyRound className="w-4 h-4" />
              איפוס סיסמה מאובטח
            </div>

            <h3 className="text-lg font-bold text-white mb-1">שחזור גישה למערכת</h3>
            <p className="text-xs text-[#9E9891] mb-5 leading-relaxed">
              הזן את כתובת האימייל של מנהל המערכת, ונשלח אליך קישור מאובטח לאיפוס הסיסמה.
            </p>

            {resetError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-2.5 mb-4 font-bold text-center">
                {resetError}
              </div>
            )}

            {resetSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl p-4 font-bold flex flex-col items-center justify-center text-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <p>קישור לאיפוס סיסמה נשלח בהצלחה לאימייל!</p>
                <p className="text-[11px] text-emerald-300/80 font-normal">בדוק את תיבת הדואר הנכנס שלך.</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#D5CBB8] mb-1">
                    כתובת האימייל של המנהל
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      dir="ltr"
                      className="w-full bg-[#1C1C1C] border border-[#3D3D3D] focus:border-gold rounded-xl py-2.5 pr-10 pl-3 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="btn-shimmer w-full text-[#1C1C1C] font-black text-xs py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-gold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resetLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#1C1C1C]/30 border-t-[#1C1C1C] rounded-full animate-spin" />
                      שולח קישור...
                    </>
                  ) : (
                    'שלח קישור לאיפוס סיסמה'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
