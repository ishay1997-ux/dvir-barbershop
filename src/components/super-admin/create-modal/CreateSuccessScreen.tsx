'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Key } from 'lucide-react';
import type { Business } from '../types';

interface CreateSuccessScreenProps {
  adminTheme: 'dark' | 'light';
  createdBusinessResult: Business;
  onClose: () => void;
}

export const CreateSuccessScreen: React.FC<CreateSuccessScreenProps> = ({
  adminTheme,
  createdBusinessResult,
  onClose,
}) => {
  const router = useRouter();

  return (
    <div className="text-center py-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl font-black shadow-lg animate-bounce">
        ✓
      </div>

      <div>
        <h3
          className={`text-xl font-black ${
            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
          }`}
        >
          האתר של {createdBusinessResult.name} מוכן באוויר! 🎉
        </h3>
        <p
          className={`text-xs mt-1 ${
            adminTheme === 'light' ? 'text-slate-600' : 'text-[#9E9891]'
          }`}
        >
          כל הסקשנים, המחירון המותאם, גלריית העבודות וטפסי הזמנת התורים נוצרו באופן מלא.
        </p>
      </div>

      <div
        className={`p-4 rounded-2xl border text-right space-y-2 text-xs font-mono ${
          adminTheme === 'light'
            ? 'bg-slate-50 border-slate-200 text-slate-800'
            : 'bg-[#141414] border-white/10 text-zinc-300'
        }`}
      >
        <div className="flex justify-between items-center">
          <span>🌐 כתובת דף הבית:</span>
          <span className="font-bold text-[#C9A84C]" dir="ltr">
            thecut.co.il/{createdBusinessResult.slug}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>📱 טלפון לזימונים:</span>
          <span>{createdBusinessResult.phone}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>🎨 סגנון נבחר:</span>
          <span>{createdBusinessResult.ownerName}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Link
          href={`/${createdBusinessResult.slug}`}
          target="_blank"
          className="flex-1 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
        >
          <ExternalLink className="w-4 h-4" /> צפה באתר החדש עכשיו
        </Link>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('thecut_admin_authenticated', 'true');
            }
            router.push('/admin');
          }}
          className={`flex-1 py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            adminTheme === 'light'
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-400 border-emerald-500/40'
          }`}
        >
          <Key className="w-4 h-4" /> כניסה לפאנל הניהול
        </button>

        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
            adminTheme === 'light'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-white/10 hover:bg-white/15 text-zinc-300'
          }`}
        >
          סגור
        </button>
      </div>
    </div>
  );
};
