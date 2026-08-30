'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  CheckCircle2,
  Building2,
  Phone,
  User,
  MapPin,
  Check,
  Send,
  MessageCircle,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Layers,
  Mail,
} from 'lucide-react';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface SaaSOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: 'starter' | 'pro' | 'team';
  initialIndustry?: string;
}

export const SaaSOnboardingModal: React.FC<SaaSOnboardingModalProps> = ({
  isOpen,
  onClose,
  initialPlan = 'pro',
  initialIndustry = 'מספרות ועיצוב שיער גברים',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [googleUser, setGoogleUser] = useState<{
    name: string;
    email: string;
    photo?: string;
  } | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [industry, setIndustry] = useState(initialIndustry);
  const [plan, setPlan] = useState<'starter' | 'pro' | 'team'>(initialPlan);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const industriesList = [
    { id: 'מספרות ועיצוב שיער גברים', label: 'מספרת גברים', icon: '💈' },
    { id: 'מספרות נשים וסלוני יופי', label: 'סלון יופי ונשים', icon: '💇‍♀️' },
    { id: 'קוסמטיקה, ציפורניים & טיפוח', label: 'קוסמטיקה & ציפורניים', icon: '💅' },
    { id: 'אינסטלציה, טכנאים & שירותי בית', label: 'טכנאים ושירותי בית', icon: '🔧' },
    { id: 'מאמנים אישיים, קליניקות & טיפולים', label: 'קליניקה & מאמנים', icon: '🏋️' },
  ];

  // Wix-Style 1-Click Google Sign-In
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      if (!auth || !isFirebaseConfigured) {
        throw new Error('שירות ההתחברות אינו מוגדר כעת.');
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const u = result.user;

      if (u) {
        const gInfo = {
          name: u.displayName || '',
          email: u.email || '',
          photo: u.photoURL || undefined,
        };
        setGoogleUser(gInfo);
        if (gInfo.name && !ownerName) setOwnerName(gInfo.name);
        if (gInfo.email && !email) setEmail(gInfo.email);
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || 'שגיאה בהתחברות עם Google, אנא נסה שוב או המשך ידנית');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const [createdWorkspace, setCreatedWorkspace] = useState<{
    slug: string;
    workspaceUrl: string;
    bookingUrl: string;
  } | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !ownerName.trim() || !phone.trim()) {
      setErrorMsg('נא למלא את כל שדות החובה (שם העסק, איש קשר וטלפון)');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          ownerName,
          phone,
          email: email || googleUser?.email || '',
          city,
          industry,
          plan,
          notes,
          authProvider: googleUser ? 'google' : 'manual',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'שגיאה בשליחת הבקשה');
      }

      const data = await res.json();
      if (data.alreadyExists) {
        setIsExistingUser(true);
      } else {
        setIsExistingUser(false);
      }

      if (data.slug) {
        setCreatedWorkspace({
          slug: data.slug,
          workspaceUrl: data.workspaceUrl || `/admin?slug=${data.slug}`,
          bookingUrl: data.bookingUrl || `/${data.slug}`,
        });
      }

      setStep(3); // Success Screen
    } catch (err: any) {
      setErrorMsg(err.message || 'שגיאה בחיבור לשרת');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setBusinessName('');
    setOwnerName('');
    setPhone('');
    setCity('');
    setEmail('');
    setNotes('');
    setGoogleUser(null);
    setCreatedWorkspace(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={handleReset} />

      <div className="relative max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 my-auto text-right overflow-hidden transition-all text-slate-900">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-l from-indigo-50/80 via-white to-white border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {step === 3 ? 'הבקשה התקבלה בהצלחה!' : 'הקמת אתר ומערכת תורים לעסק'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {step === 3
                  ? 'הפרטים שלך נקלטו במערכת CutWeb OS'
                  : 'הצטרפו למאות עסקים שמנהלים תורים באופן אוטונומי'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step !== 3 && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                1
              </span>
              <span className={`font-bold ${step === 1 ? 'text-indigo-600' : 'text-slate-500'}`}>
                פרטי העסק ותחום
              </span>
            </div>

            <div className="w-12 h-0.5 bg-slate-200" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </span>
              <span className={`font-bold ${step === 2 ? 'text-indigo-600' : 'text-slate-500'}`}>
                איש קשר ומסלול
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: BUSINESS & INDUSTRY + GOOGLE AUTH OPTION (Wix Style) */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Wix Style Google Fast Sign-In */}
              {googleUser ? (
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {googleUser.photo ? (
                      <img
                        src={googleUser.photo}
                        alt={googleUser.name}
                        className="w-8 h-8 rounded-full border border-indigo-300"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {googleUser.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-indigo-950 block">
                        מחובר באמצעות Google: {googleUser.name}
                      </span>
                      <span className="text-[11px] text-indigo-700">{googleUser.email}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    מאומת ✓
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300/90 transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer hover:border-slate-400"
                  >
                    {googleLoading ? (
                      <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
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
                    <span>התחברו מהר באמצעות Google (מומלץ)</span>
                  </button>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-[11px] text-slate-400 font-medium shrink-0">
                      או מלאו את פרטי העסק ידנית
                    </span>
                    <div className="border-t border-slate-200 w-full" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  שם העסק / המותג *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="לדוגמה: מספרת דביר, סטודיו מיה לקוסמטיקה..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs text-slate-900 bg-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  ענף פעילות ותחום מקצועי *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {industriesList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIndustry(item.id)}
                      className={`p-2.5 rounded-xl border text-right text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        industry === item.id
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  עיר / אזור פעילות
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="לדוגמה: תל אביב, ראשון לציון, שירות בכל הארץ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs text-slate-900 bg-white placeholder:text-slate-400"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!businessName.trim()) {
                      setErrorMsg('נא להזין את שם העסק');
                      return;
                    }
                    setErrorMsg('');
                    setStep(2);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <span>המשך לשלב הבא</span>
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONTACT & PLAN */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    שם איש קשר / מנהל העסק *
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="שם מלא"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs text-slate-900 bg-white placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    טלפון נייד (לוואטסאפ) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="050-0000000"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs text-slate-900 bg-white placeholder:text-slate-400 text-right"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  מסלול מבוקש
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'starter' as const, title: 'Starter', price: '0 ₪' },
                    { id: 'pro' as const, title: 'Pro', price: '59 ₪/חודש', popular: true },
                    { id: 'team' as const, title: 'Team', price: '119 ₪/חודש' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlan(p.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        plan === p.id
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-black">{p.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  אימייל / בקשות מיוחדות (אופציונלי)
                </label>
                <input
                  type="text"
                  value={notes || email}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (e.target.value.includes('@')) setEmail(e.target.value);
                  }}
                  placeholder="אימייל / הערות להקמה מהירה..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs text-slate-900 bg-white placeholder:text-slate-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  חזרה
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/25 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>שליחה והקמת חשבון</span>
                </button>
              </div>

              {/* Wix-Style Terms & Privacy Micro Footer */}
              <p className="text-[10px] text-slate-400 text-center pt-2 leading-relaxed">
                * בהרשמתך הנך מאשר את{' '}
                <Link href="/terms" className="underline hover:text-slate-600" target="_blank">
                  תנאי השימוש
                </Link>{' '}
                ו-
                <Link href="/privacy" className="underline hover:text-slate-600" target="_blank">
                  מדיניות הפרטיות
                </Link>{' '}
                של פלטפורמת CutWeb.
              </p>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION & DIRECT WORKSPACE ACCESS */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  {isExistingUser
                    ? `ברוך שובך ${ownerName}! העסק שלך כבר פעיל במערכת ✨`
                    : `מעולה ${ownerName}! העסק "${businessName}" הוקם בהצלחה! 🚀`}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {isExistingUser
                    ? `זיהינו חשבון עסק קיים תחת הפרטים שלך. העברנו אותך ישירות לניהול המערכת והיומן שלך.`
                    : `המרחב הדיגיטלי ואתר התורים שלך נוצרו במערכת CutWeb OS. כעת באפשרותך לגשת ישירות לדאשבורד הניהול או לצפות באתר הלקוחות שלך.`}
                </p>
              </div>

              {/* Direct Workspace & Live Site Actions */}
              {createdWorkspace && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2.5 text-right">
                  <div className="flex items-center justify-between text-xs font-black text-indigo-950">
                    <span>קישורי המערכת שלך:</span>
                    <span className="text-[11px] font-mono text-indigo-600" dir="ltr">
                      /{createdWorkspace.slug}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <Link
                      href={createdWorkspace.workspaceUrl}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>כניסה לדאשבורד הניהול</span>
                    </Link>

                    <Link
                      href={createdWorkspace.bookingUrl}
                      target="_blank"
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>צפייה באתר הלקוחות ↗</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Fast Track WhatsApp Direct to Ishay 058-7815070 */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">
                  צריך עזרה ראשונית או התאמה אישית?
                </span>
                <a
                  href={`https://wa.me/972587815070?text=${encodeURIComponent(
                    `היי ישי! 👋\nמילאתי עכשיו טופס הצטרפות באתר CutWeb עבור "${businessName}".\nתחום: ${industry}\nמסלול מבוקש: ${plan}\nטלפון: ${phone}\n${
                      email ? `אימייל: ${email}\n` : ''
                    }${createdWorkspace ? `קישור: thecut.co.il/${createdWorkspace.slug}\n` : ''}\nאשמח לקבל הדרכה קצרה והפעלה מלאה!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25D366]/20 hover:scale-[1.01] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>שליחת הודעת וואטסאפ מהירה לישי</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-700 pt-1 block mx-auto underline cursor-pointer"
              >
                סגור חלון
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
