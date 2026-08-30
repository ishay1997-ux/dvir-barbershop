'use client';

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { OnboardingStep1Details } from '@/components/marketing/onboarding/OnboardingStep1Details';
import { OnboardingStep2Plan } from '@/components/marketing/onboarding/OnboardingStep2Plan';
import { OnboardingStep3Success } from '@/components/marketing/onboarding/OnboardingStep3Success';

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

  const [createdWorkspace, setCreatedWorkspace] = useState<{
    slug: string;
    workspaceUrl: string;
    bookingUrl: string;
  } | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);

  if (!isOpen) return null;

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

  const handleStep1Next = () => {
    if (!businessName.trim() || !ownerName.trim() || !phone.trim()) {
      setErrorMsg('נא למלא את כל שדות החובה (שם העסק, איש קשר וטלפון נייד)');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

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

      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || 'שגיאה בחיבור לשרת');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 my-auto text-right overflow-hidden transition-all text-slate-900">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-l from-indigo-50 via-white to-white border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {step === 3
                  ? 'העסק הוקם בהצלחה!'
                  : step === 2
                  ? 'התאמת המערכת והחבילה'
                  : 'הקמת אתר ומערכת תורים'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {step === 3
                  ? 'הדאשבורד ואתר התורים שלך מוכנים לפעילות'
                  : step === 2
                  ? 'שלב 2 מתוך 2 · בחירת ענף ומסלול פתיחה'
                  : 'שלב 1 מתוך 2 · פרטי העסק והתחברות'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-shake">
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <OnboardingStep1Details
              businessName={businessName}
              setBusinessName={setBusinessName}
              ownerName={ownerName}
              setOwnerName={setOwnerName}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
              city={city}
              setCity={setCity}
              googleUser={googleUser}
              googleLoading={googleLoading}
              onGoogleSignIn={handleGoogleSignIn}
              onNext={handleStep1Next}
            />
          )}

          {step === 2 && (
            <OnboardingStep2Plan
              industry={industry}
              setIndustry={setIndustry}
              plan={plan}
              setPlan={setPlan}
              notes={notes}
              setNotes={setNotes}
              isSubmitting={isSubmitting}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
            />
          )}

          {step === 3 && (
            <OnboardingStep3Success
              ownerName={ownerName}
              businessName={businessName}
              phone={phone}
              isExistingUser={isExistingUser}
              createdWorkspace={createdWorkspace}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
