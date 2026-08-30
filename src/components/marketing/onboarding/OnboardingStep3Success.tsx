'use client';

import React from 'react';
import { CheckCircle2, Sparkles, ExternalLink, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface OnboardingStep3SuccessProps {
  ownerName: string;
  businessName: string;
  phone: string;
  isExistingUser: boolean;
  createdWorkspace: {
    slug: string;
    workspaceUrl: string;
    bookingUrl: string;
  } | null;
  onClose: () => void;
}

export function OnboardingStep3Success({
  ownerName,
  businessName,
  phone,
  isExistingUser,
  createdWorkspace,
  onClose,
}: OnboardingStep3SuccessProps) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waContactMessage = encodeURIComponent(
    `היי איתי! הרגע נרשמתי ל-CutWeb עבור העסק "${businessName}" (טלפון: ${phone}) ואשמח לליווי וחיבור מהיר!`
  );
  const waDirectUrl = `https://wa.me/972587815070?text=${waContactMessage}`;

  return (
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
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>צפייה באתר הלקוחות</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>
      )}

      {/* Fast Track WhatsApp Support */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-right flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black">רוצה שנעזור בהגדרות הראשונות?</div>
            <div className="text-[11px] text-emerald-800">
              צוות התמיכה וההקמה זמין בוואטסאפ לכל שאלה
            </div>
          </div>
        </div>
        <a
          href={waDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-colors"
        >
          פתיחת וואטסאפ
        </a>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
      >
        סגור חלון
      </button>
    </div>
  );
}
