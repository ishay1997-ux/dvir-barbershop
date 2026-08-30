'use client';

import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  QrCode,
  ExternalLink,
  X,
  Sparkles,
  Smartphone,
  Camera,
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { useToast } from '@/components/common/ToastProvider';

interface ShareStorefrontModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessSlug?: string;
}

export default function ShareStorefrontModal({
  isOpen,
  onClose,
  businessSlug = 'dvir',
}: ShareStorefrontModalProps) {
  const { settings } = useShopStore();
  const { success } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWaText, setCopiedWaText] = useState(false);

  if (!isOpen) return null;

  const siteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${businessSlug}`
      : `https://cutweb.co.il/${businessSlug}`;

  const businessName = settings.shopName || 'המספרה של דביר';

  const waMessage = `היי חברים! 🌟 מעכשיו קובעים אלינו תור בקלות ובמהירות 24/7 בלי להמתין למענה בהודעות:
🔗 ${siteUrl}

מחכים לכם ב${businessName}! ✂️`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopiedLink(true);
    success('הקישור הועתק!', 'כעת באפשרותך להדביק אותו באינסטגרם, פייסבוק או וואטסאפ.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(waMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyWaText = () => {
    navigator.clipboard.writeText(waMessage);
    setCopiedWaText(true);
    success('נוסח ההודעה הועתק!', 'הנוסח המלא מוכן להדבקה בקבוצות או שיחות וואטסאפ.');
    setTimeout(() => setCopiedWaText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden z-10 border border-slate-100 animate-scaleUp">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>שיתוף אתר התורים שלך</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  ללקוחות
                </span>
              </h3>
              <p className="text-xs text-slate-300">הפץ את הקישור ללקוחות כדי שיתחילו לקבוע תורים</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* 1. Direct Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block">
              כתובת האתר שלך (Link in Bio):
            </label>
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200">
              <input
                type="text"
                readOnly
                value={siteUrl}
                className="flex-1 bg-transparent text-xs font-mono text-slate-800 outline-none px-2 select-all"
                dir="ltr"
              />
              <button
                onClick={handleCopyLink}
                className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'הועתק!' : 'העתק'}</span>
              </button>
            </div>
          </div>

          {/* 2. Fast Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 flex items-center gap-3 transition-all text-right group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-emerald-950">שליחה בוואטסאפ</div>
                <div className="text-[10px] text-emerald-700">שתף ישירות ללקוחות או לקבוצה</div>
              </div>
            </button>

            {/* Instagram Bio */}
            <button
              onClick={handleCopyLink}
              className="p-3.5 rounded-2xl bg-pink-50 hover:bg-pink-100/80 border border-pink-200 text-pink-900 flex items-center gap-3 transition-all text-right group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-black text-pink-950">העתק לביו באינסטגרם</div>
                <div className="text-[10px] text-pink-700">הדבק ב-Profile Link בסטורי</div>
              </div>
            </button>
          </div>

          {/* 3. Pre-made WhatsApp Message Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>נוסח מומלץ לשליחה ללקוחות:</span>
              </span>
              <button
                onClick={handleCopyWaText}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedWaText ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedWaText ? 'הועתק!' : 'העתק נוסח'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed font-sans whitespace-pre-line">
              {waMessage}
            </p>
          </div>

          {/* 4. Live Site Preview Link */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 transition-colors"
            >
              <span>פתיחת האתר בחלון חדש</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
