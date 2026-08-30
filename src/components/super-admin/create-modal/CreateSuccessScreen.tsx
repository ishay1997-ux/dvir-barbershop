'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Key, MessageCircle, Copy } from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
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
  const { success } = useToast();

  const cleanPhone = (createdBusinessResult.phone || '').replace(/\D/g, '').replace(/^0/, '972');
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://thecut.co.il';
  const clientUrl = `${origin}/${createdBusinessResult.slug}`;
  const adminUrl = `${origin}/admin/login`;

  const whatsappMessage = `היי ${createdBusinessResult.ownerName || 'יקר/ה'}! 🎉
האתר והמערכת שלך עבור "${createdBusinessResult.name}" מוכנים באוויר!

🌐 קישור לאתר הלקוחות ולהזמנת תורים:
${clientUrl}

🔐 קישור לפאנל הניהול והיומן שלך (כניסה עם Google):
${adminUrl}

שיהיה המון בהצלחה! 🚀`;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(whatsappMessage);
    success('הודעת ההזמנה הועתקה ללוח! 📋', 'ניתן להדביק ולשלוח לבעל העסק');
  };

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

      {/* Direct Links Card */}
      <div
        className={`p-4 rounded-2xl border text-right space-y-2 text-xs font-mono ${
          adminTheme === 'light'
            ? 'bg-slate-50 border-slate-200 text-slate-800'
            : 'bg-[#141414] border-white/10 text-zinc-300'
        }`}
      >
        <div className="flex justify-between items-center">
          <span>🌐 אתר לקוחות (Booking):</span>
          <a
            href={`/${createdBusinessResult.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#C9A84C] hover:underline"
            dir="ltr"
          >
            /{createdBusinessResult.slug}
          </a>
        </div>
        <div className="flex justify-between items-center">
          <span>🔐 פאנל ניהול (Admin):</span>
          <span className="font-bold text-emerald-400" dir="ltr">
            /admin/login
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>📱 טלפון בעל העסק:</span>
          <span>{createdBusinessResult.phone || 'לא הוגדר'}</span>
        </div>
      </div>

      {/* WhatsApp Dispatch Button */}
      <div className="space-y-2 pt-1">
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>שלח קישורים ופרטי כניסה לבעל העסק בוואטסאפ 💬</span>
        </a>

        <button
          type="button"
          onClick={handleCopyInvite}
          className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            adminTheme === 'light'
              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
          }`}
        >
          <Copy className="w-3.5 h-3.5" />
          <span>העתק את טקסט ההזמנה ללוח</span>
        </button>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/10">
        <Link
          href={`/${createdBusinessResult.slug}`}
          target="_blank"
          className="flex-1 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
        >
          <ExternalLink className="w-4 h-4" /> צפה באתר החדש
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
