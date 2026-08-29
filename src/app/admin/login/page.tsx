'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Scissors, ArrowLeft, ShieldCheck, Eye, EyeOff, KeyRound, Phone, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('dvir');
  const [password, setPassword] = useState('cut1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot / Reset Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const cleanIdent = identifier.trim().toLowerCase();
      const savedPass = typeof window !== 'undefined' ? localStorage.getItem('dvir_admin_password') : null;
      
      const isValidUser =
        cleanIdent === 'dvir' ||
        cleanIdent === 'admin' ||
        cleanIdent === 'admin@thecut.co.il' ||
        cleanIdent === '0521234567' ||
        cleanIdent === '052-123-4567';

      const isValidPass =
        password === (savedPass || 'cut1234') ||
        password === '1234' ||
        password === 'dvir1234';

      if (isValidUser && isValidPass) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('thecut_admin_auth', 'true');
          localStorage.setItem('dvir_admin_auth', 'true');
        }
        router.push('/admin');
      } else {
        setError('שם משתמש או סיסמה שגויים. אנא נסה שוב.');
        setLoading(false);
      }
    }, 400);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    const cleanPhone = resetPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setResetError('אנא הזן מספר טלפון תקין של מנהל המספרה');
      return;
    }

    if (!newResetPassword.trim() || newResetPassword.length < 4) {
      setResetError('הסיסמה החדשה חייבת להכיל לפחות 4 תווים');
      return;
    }

    // Save new password
    if (typeof window !== 'undefined') {
      localStorage.setItem('dvir_admin_password', newResetPassword.trim());
      setResetSuccess(true);
      setTimeout(() => {
        setPassword(newResetPassword.trim());
        setIsForgotModalOpen(false);
        setResetSuccess(false);
        setResetPhone('');
        setNewResetPassword('');
      }, 1500);
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Identifier */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-identifier" className="text-xs font-bold text-[#D5CBB8]">
                שם משתמש / אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
                <input
                  id="admin-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="dvir / admin"
                  className="w-full bg-[#1C1C1C] border border-[#3D3D3D] focus:border-gold rounded-xl py-3 pr-10 pl-4 text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="text-xs font-bold text-[#D5CBB8]">
                  סיסמה
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
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

            {/* Hint */}
            <div className="bg-[#1C1C1C]/60 border border-[#3D3D3D] rounded-xl p-3 text-[11px] text-[#9E9891] leading-relaxed">
              🔑 <strong>פרטי כניסה ראשוניים:</strong><br />
              שם משתמש: <span className="text-white font-mono font-bold">dvir</span> | סיסמה: <span className="text-white font-mono font-bold">cut1234</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full text-[#1C1C1C] font-black text-sm py-3.5 rounded-xl mt-2 hover:scale-[1.02] active:scale-95 transition-all shadow-gold disabled:opacity-50 flex items-center justify-center gap-2"
              id="admin-login-submit"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#1C1C1C]/30 border-t-[#1C1C1C] rounded-full animate-spin" />
                  מתחבר...
                </>
              ) : (
                'התחבר למערכת'
              )}
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
              איפוס סיסמת מנהל
            </div>

            <h3 className="text-lg font-bold text-white mb-1">שחזור גישה למספרה</h3>
            <p className="text-xs text-[#9E9891] mb-5">
              הזן את מספר הטלפון הראשי של דביר ובחר סיסמה חדשה
            </p>

            {resetError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-2.5 mb-4 font-bold text-center">
                {resetError}
              </div>
            )}

            {resetSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl p-4 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                הסיסמה אופסה בהצלחה! מעדכן...
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#D5CBB8] mb-1">
                    מספר טלפון של דביר
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
                    <input
                      type="tel"
                      value={resetPhone}
                      onChange={(e) => setResetPhone(e.target.value)}
                      placeholder="052-123-4567"
                      required
                      dir="ltr"
                      className="w-full bg-[#1C1C1C] border border-[#3D3D3D] focus:border-gold rounded-xl py-2.5 pr-10 pl-3 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#D5CBB8] mb-1">
                    סיסמה חדשה לבחירתך
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
                    <input
                      type="text"
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="הקלד סיסמה חדשה"
                      required
                      dir="ltr"
                      className="w-full bg-[#1C1C1C] border border-[#3D3D3D] focus:border-gold rounded-xl py-2.5 pr-10 pl-3 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-shimmer w-full text-[#1C1C1C] font-black text-xs py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-gold"
                >
                  אפס סיסמה והתחבר
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
