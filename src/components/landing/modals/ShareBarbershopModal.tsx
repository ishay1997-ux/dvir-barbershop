'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Share2, Copy, Check, MessageCircle } from 'lucide-react';
import type { BusinessConfig } from '@/types/business';

export function ShareBarbershopModal({
  isOpen,
  onClose,
  business,
}: {
  isOpen: boolean;
  onClose: () => void;
  business?: Partial<BusinessConfig>;
}) {
  const [copied, setCopied] = useState(false);
  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';
  const slug = business?.slug || 'dvir';

  const shareUrl =
    typeof window !== 'undefined'
      ? slug === 'dvir' || slug === 'thecut'
        ? window.location.origin
        : `${window.location.origin}/${slug}`
      : `https://thecut-reg-in.vercel.app/${slug}`;

  const shareText = `${bizName} – ${business?.slogan || 'תספורות פרימיום ודירוגים מדויקים'}. לקביעת תור מהיר:`;

  if (!isOpen) return null;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: bizName,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (_) {
        // User cancelled or fallback
      }
    }
    handleCopy();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-[#222222] border rounded-3xl p-6 text-white shadow-2xl z-10 text-center"
        style={{ borderColor: `${themeColor}40`, backgroundColor: '#1E1E1E', color: '#FFFFFF' }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border shadow-xs"
          style={{
            backgroundColor: `${themeColor}15`,
            borderColor: `${themeColor}40`,
            color: themeColor,
          }}
        >
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-white mb-1" style={{ color: '#FFFFFF' }}>
          שתף את {bizName}
        </h3>
        <p className="text-xs text-zinc-400 mb-5">שתף קישור ישיר להזמנת תורים מהירה בכל הרשתות</p>

        <div className="space-y-2.5 mb-4">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
          >
            <MessageCircle className="w-4 h-4" /> שתף ב-WhatsApp
          </button>

          <button
            onClick={handleNativeShare}
            className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-100 text-black font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
          >
            <Share2 className="w-4 h-4" /> שיתוף לכל האפליקציות
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-white/10 cursor-pointer"
            style={{ color: '#FFFFFF' }}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'הקישור הועתק!' : 'העתק קישור להזמנה'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          סגור
        </button>
      </motion.div>
    </div>
  );
}
