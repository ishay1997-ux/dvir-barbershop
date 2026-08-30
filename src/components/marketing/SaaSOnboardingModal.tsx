'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

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
  initialIndustry = 'מספרות גברים',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
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
          email,
          city,
          industry,
          plan,
          notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'שגיאה בשליחת הבקשה');
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

          {/* STEP 1: BUSINESS & INDUSTRY */}
          {step === 1 && (
            <div className="space-y-4">
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="לדוגמה: מעוניין בחיבור דומיין אישי / עזרה בהזנת מחירון..."
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
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION & WHATSAPP FAST-TRACK */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  מעולה {ownerName}! הבקשה שלך עבור "{businessName}" נקלטה בהצלחה!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  הפרטים נשמרו במערכת CutWeb OS. ישי מצוות הפלטפורמה יצור עמך קשר תוך זמן קצר לסיום הגדרת האתר והיומן.
                </p>
              </div>

              {/* Fast Track WhatsApp Direct to Ishay 058-7815070 */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">
                  רוצים הפעלה מיידית תוך 5 דקות?
                </span>
                <a
                  href={`https://wa.me/972587815070?text=${encodeURIComponent(
                    `היי ישי! 👋\nמילאתי עכשיו טופס הצטרפות באתר CutWeb עבור "${businessName}".\nתחום: ${industry}\nמסלול מבוקש: ${plan}\nטלפון: ${phone}\n\nאשמח להפעיל את המערכת ולקבל את הקישורים לאתר!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/25 hover:scale-[1.02] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>המשך לוואטסאפ לשיחה מהירה עם ישי</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-700 pt-2 block mx-auto underline cursor-pointer"
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
