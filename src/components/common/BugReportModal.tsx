'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  ChevronDown,
  Pencil,
  CheckCircle,
  Scissors,
  X,
  Send,
  MessageCircle,
} from 'lucide-react';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'בעיה במחיקת / עדכון תור',
  'תקלה (באג)',
  'רעיון לשיפור',
  'פידבק',
  'אחר',
] as const;

export default function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('נא למלא את כל שדות החובה המסומנים');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/bug-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          category,
          message,
          businessName: 'המספרה של דביר',
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'אירעה שגיאה בשליחת הטופס');
      }
    } catch {
      setErrorMsg('אירעה שגיאת תקשורת. נא לנסות שנית.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setCategory(CATEGORIES[0]);
    setMessage('');
    setIsSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={handleReset} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[360px] sm:max-w-[400px] bg-[#FFFFFF] text-[#2C2C2C] rounded-[28px] shadow-2xl z-10 overflow-hidden border border-gray-200 my-auto"
      >
        {/* ============================================================ */}
        {/* 1. TOP HEADER BANNER (Matching Reference Design)             */}
        {/* ============================================================ */}
        <div
          className="relative h-[110px] bg-cover bg-center flex flex-col items-center justify-center text-center p-4 border-b border-gray-200"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(20,20,20,0.65), rgba(15,15,15,0.85)), url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80')`,
          }}
        >
          {/* Close Button X */}
          <button
            onClick={handleReset}
            className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
            aria-label="סגור חלון"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Salon Monogram Badge */}
          <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center text-[#1C1C1C] font-black text-xs mb-1">
            <Scissors className="w-6 h-6 text-[#C9A84C] -rotate-45" />
          </div>

          <h3 className="text-sm font-black text-white tracking-wide drop-shadow-md">
            המספרה של דביר
          </h3>
        </div>

        {/* ============================================================ */}
        {/* 2. FORM BODY (Strict RTL Layout & Typography)                */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 bg-[#FAFAFC]">
          <h2 className="text-center text-lg font-black text-[#1C1C1C] mb-4">
            דווחו לנו על תקלה
          </h2>

          {isSubmitted ? (
            /* Success State */
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-emerald-800">
                הדיווח התקבל בהצלחה!
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed px-2">
                תודה על העדכון, הפרטים הועברו ישירות לצוות הפיתוח ומנהל המערכת לטיפול מהיר.
              </p>
              <div className="pt-3 space-y-2">
                <a
                  href={`https://wa.me/972521234567?text=${encodeURIComponent(`היי, דיווחתי על: ${category} - ${message}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> עדכן גם בוואטסאפ
                </a>
                <button
                  onClick={handleReset}
                  className="w-full py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition-colors"
                >
                  סגור
                </button>
              </div>
            </div>
          ) : (
            /* Active Report Form */
            <form onSubmit={handleSubmit} className="space-y-3 text-right">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {/* 1. שם מלא */}
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="שם מלא *"
                  required
                  className="w-full bg-white border border-gray-300 focus:border-[#00C48C] focus:ring-1 focus:ring-[#00C48C] rounded-xl py-2.5 pr-10 pl-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all text-right shadow-2xs"
                />
                <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* 2. טלפון */}
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="טלפון *"
                  required
                  className="w-full bg-white border border-gray-300 focus:border-[#00C48C] focus:ring-1 focus:ring-[#00C48C] rounded-xl py-2.5 pr-10 pl-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all text-right shadow-2xs"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* 3. אימייל (אופציונלי) */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="אימייל (אופציונלי)"
                  className="w-full bg-white border border-gray-300 focus:border-[#00C48C] focus:ring-1 focus:ring-[#00C48C] rounded-xl py-2.5 pr-10 pl-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all text-right shadow-2xs"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* 4. קטגוריית תקלה (דרופדאון בסגנון הרפרנס) */}
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-[#00C48C] hover:bg-[#00B07D] text-white font-bold rounded-xl py-2.5 pr-4 pl-10 text-sm outline-none transition-colors cursor-pointer text-right shadow-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-gray-900 font-semibold py-1">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 5. תוכן ההודעה */}
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="תוכן ההודעה *"
                  rows={3}
                  required
                  className="w-full bg-white border border-gray-300 focus:border-[#00C48C] focus:ring-1 focus:ring-[#00C48C] rounded-xl py-2.5 pr-10 pl-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all text-right resize-none shadow-2xs"
                />
                <Pencil className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>

              {/* Buttons: שלח/י + ביטול */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#00C48C] hover:bg-[#00B07D] active:scale-98 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>שלח/י</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-98 text-gray-700 font-bold text-sm transition-colors text-center"
                >
                  ביטול
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
