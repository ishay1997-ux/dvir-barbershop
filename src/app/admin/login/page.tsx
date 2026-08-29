'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Scissors, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@thecut.co.il');
  const [password, setPassword] = useState('cut1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation (can be replaced with Supabase Auth)
    setTimeout(() => {
      if ((email === 'admin@thecut.co.il' || email === 'admin') && (password === 'cut1234' || password === '1234')) {
        // Save session flag in sessionStorage / cookie
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('thecut_admin_auth', 'true');
        }
        router.push('/admin');
      } else {
        setError('אימייל או סיסמה שגויים. אנא נסה שוב.');
        setLoading(false);
      }
    }, 600);
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
          className="flex items-center gap-2 text-sm text-[#9E9891] hover:text-gold transition-colors py-2 px-4 rounded-full border border-white/10 hover:border-gold/30 bg-white/5"
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
          <p className="text-xs text-[#9E9891] mt-1 uppercase tracking-widest">פורטל ניהול ומערכת יומן</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#2A2A2A] border border-[#3D3D3D] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center gap-2 mb-6 text-gold text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            כניסת מורשים בלבד
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3 mb-5 font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email / Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-xs font-bold text-[#D5CBB8]">
                אימייל / שם משתמש
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
                <input
                  id="admin-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="admin@thecut.co.il"
                  className="w-full bg-[#1C1C1C] border border-[#3D3D3D] focus:border-gold rounded-xl py-3 pr-10 pl-4 text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" className="text-xs font-bold text-[#D5CBB8]">
                סיסמה
              </label>
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

            {/* Demo credentials hint */}
            <div className="bg-[#1C1C1C]/60 border border-[#3D3D3D] rounded-xl p-3 text-[11px] text-[#9E9891] leading-relaxed">
              🔑 <strong>פרטי כניסה לבדיקה:</strong><br />
              אימייל: <span className="text-white font-mono">admin@thecut.co.il</span> | סיסמה: <span className="text-white font-mono">cut1234</span>
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
    </div>
  );
}
