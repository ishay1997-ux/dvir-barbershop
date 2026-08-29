'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Phone } from 'lucide-react';

export function BusinessLeadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 25 }}
        className="relative w-full max-w-[360px] sm:max-w-[400px] bg-white rounded-[2.5rem] shadow-2xl z-10 overflow-hidden border border-slate-200 text-slate-900 font-sans"
      >
        {/* Top Header Mockup Image Banner */}
        <div className="relative h-44 bg-slate-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80"
            alt="Business Workspace"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/95" />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Form */}
        <div className="p-6 pt-2 text-center">
          <h3 className="text-xl font-black text-slate-900 mb-1">
            רוצה The Cut גם אצלך בעסק?
          </h3>
          <p className="text-xs text-slate-600 font-medium mb-6">
            מלא/י את הטופס ונציג יחזור אליכם בהקדם
          </p>

          {isSubmitted ? (
            <div className="py-8 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-base font-black text-slate-900">הפרטים נשלחו בהצלחה!</h4>
              <p className="text-xs text-slate-600">נציג יחזור אליך בהקדם האפשרי.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-right">
              {/* Name input */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="שם מלא"
                  className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C288] focus:border-transparent transition-all shadow-xs"
                />
              </div>

              {/* Phone input */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="טלפון"
                  dir="rtl"
                  className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C288] focus:border-transparent transition-all shadow-xs"
                />
              </div>

              {/* Email input (optional) */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="אימייל (אופציונלי)"
                  className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C288] focus:border-transparent transition-all shadow-xs"
                />
              </div>

              {/* Message input */}
              <div className="relative">
                <div className="absolute top-3.5 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="תוכן ההודעה"
                  className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C288] focus:border-transparent transition-all shadow-xs resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#00C288] hover:bg-[#00ab78] active:scale-98 text-white font-black text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'שולח...' : 'שלח/י'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-sm transition-all border border-slate-300 cursor-pointer"
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
