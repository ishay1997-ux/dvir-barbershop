'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Zap,
  Bug,
  Laptop,
  MessageCircle,
  Scissors,
  Clock,
} from 'lucide-react';
import { ShareBarbershopModal } from '@/components/landing/QuickModals';
import BugReportModal from '@/components/common/BugReportModal';
import { SHORT_VERSION_LABEL } from '@/config/version';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Detective / Spy icon for Privacy Policy (Matching Reference)
function SpyPrivacyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || 'w-5 h-5 text-gray-700'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 10h20" />
      <path d="M4 10l3-6h10l3 6" />
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="16" r="3" />
      <path d="M11 16h2" />
    </svg>
  );
}

// Wheelchair International Accessibility Icon (Matching Reference)
function WheelchairA11yIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || 'w-5 h-5 text-gray-700'}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="4" r="2" />
      <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.45.69 3.09 1.05 5 1.05v-2c-1.2 0-2.34-.34-3.32-.95l.89-.99c.39.43.91.76 1.43.89zM8 18c-2.21 0-4-1.79-4-4s1.79-4 4-4c.48 0 .93.09 1.36.24l1.52-1.52C9.88 8.27 8.97 8 8 8c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.66 0 3.14-.69 4.22-1.78l-1.44-1.44C10.14 17.56 9.13 18 8 18z" />
    </svg>
  );
}

// Illustrated Vector Avatar (Matching Reference)
function IllustratedGuestAvatar() {
  return (
    <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Skin */}
        <circle cx="50" cy="48" r="28" fill="#FCE5CD" />
        {/* Hair */}
        <path
          d="M26,42 Q28,14 50,14 Q72,14 74,42 Q68,26 50,26 Q32,26 26,42 Z"
          fill="#2C3437"
        />
        {/* Eyebrows */}
        <path d="M36,38 Q41,36 46,38" stroke="#2C3437" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M54,38 Q59,36 64,38" stroke="#2C3437" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Eyes */}
        <ellipse cx="41" cy="45" rx="2.5" ry="3.5" fill="#2C3437" />
        <ellipse cx="59" cy="45" rx="2.5" ry="3.5" fill="#2C3437" />
        {/* Smile */}
        <path
          d="M44,58 Q50,63 56,58"
          stroke="#C0392B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Black T-Shirt */}
        <path
          d="M20,86 Q50,70 80,86 L80,100 L20,100 Z"
          fill="#2C3437"
        />
        <path
          d="M42,75 Q50,82 58,75"
          stroke="#FCE5CD"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default function SidebarDrawer({ isOpen, onClose }: SidebarDrawerProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex justify-start bg-black/60 backdrop-blur-xs" dir="rtl">
            {/* Backdrop Overlay */}
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

            {/* Sliding Drawer Container (Right side of the screen) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="relative w-[280px] sm:w-[310px] h-full bg-[#F4F4F6] text-[#2C2C2C] flex flex-col shadow-2xl z-10 font-sans border-l border-gray-300 select-none"
            >
              {/* ============================================================ */}
              {/* 1. TOP HEADER (Wood desk + Calendar + Avatar + 'אורח')         */}
              {/* ============================================================ */}
              <div
                className="relative h-[150px] flex flex-col items-center justify-center text-center bg-cover bg-center border-b border-gray-300"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(30,25,20,0.5), rgba(20,15,10,0.7)), url('https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80')`,
                }}
              >
                {/* Close Button X */}
                <button
                  onClick={onClose}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black/20 transition-all"
                  aria-label="סגור תפריט"
                >
                  <X className="w-5 h-5 drop-shadow-md" />
                </button>

                {/* Avatar */}
                <div className="mt-2">
                  <IllustratedGuestAvatar />
                </div>

                {/* 'אורח' label */}
                <span
                  className="text-lg font-black text-white mt-1.5 tracking-wide"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.85)' }}
                >
                  אורח
                </span>
              </div>

              {/* ============================================================ */}
              {/* 2. MENU ITEMS LIST (Exact Order and Icons from Screenshot)    */}
              {/* ============================================================ */}
              <div className="flex-1 overflow-y-auto py-2 bg-[#F4F4F6]">
                {/* 1. שתפו עם חבר */}
                <button
                  onClick={() => {
                    setIsShareOpen(true);
                  }}
                  className="w-full flex items-center justify-between py-3.5 px-5 hover:bg-black/5 active:bg-black/10 transition-colors text-right group"
                >
                  <span className="font-semibold text-sm text-[#2C2C2C] group-hover:text-black">
                    שתפו עם חבר
                  </span>
                  <Share2 className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors flex-shrink-0" />
                </button>

                {/* 2. רוצה The Cut גם אצלך בעסק? */}
                <button
                  onClick={() => setIsBusinessModalOpen(true)}
                  className="w-full flex items-center justify-between py-3.5 px-5 hover:bg-black/5 active:bg-black/10 transition-colors text-right group"
                >
                  <span className="font-semibold text-sm text-[#2C2C2C] group-hover:text-black">
                    רוצה The Cut גם אצלך בעסק?
                  </span>
                  <Zap className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors flex-shrink-0" />
                </button>

                {/* 3. דווחו לנו על תקלה */}
                <button
                  onClick={() => setIsBugModalOpen(true)}
                  className="w-full flex items-center justify-between py-3.5 px-5 hover:bg-black/5 active:bg-black/10 transition-colors text-right group"
                >
                  <span className="font-semibold text-sm text-[#2C2C2C] group-hover:text-black">
                    דווחו לנו על תקלה
                  </span>
                  <Bug className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors flex-shrink-0" />
                </button>

                {/* Horizontal Divider */}
                <div className="my-1 border-t border-gray-300/80 mx-2" />

                {/* 4. תנאי שימוש */}
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="w-full flex items-center justify-between py-3.5 px-5 hover:bg-black/5 active:bg-black/10 transition-colors text-right group"
                >
                  <span className="font-semibold text-sm text-[#2C2C2C] group-hover:text-black">
                    תנאי שימוש
                  </span>
                  <Laptop className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors flex-shrink-0" />
                </Link>

                {/* 5. מדיניות פרטיות */}
                <Link
                  href="/privacy"
                  onClick={onClose}
                  className="w-full flex items-center justify-between py-3.5 px-5 hover:bg-black/5 active:bg-black/10 transition-colors text-right group"
                >
                  <span className="font-semibold text-sm text-[#2C2C2C] group-hover:text-black">
                    מדיניות פרטיות
                  </span>
                  <SpyPrivacyIcon className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors flex-shrink-0" />
                </Link>

                {/* 6. הצהרת נגישות */}
                <Link
                  href="/accessibility"
                  onClick={onClose}
                  className="w-full flex items-center justify-between py-3.5 px-5 hover:bg-black/5 active:bg-black/10 transition-colors text-right group"
                >
                  <span className="font-semibold text-sm text-[#2C2C2C] group-hover:text-black">
                    הצהרת נגישות
                  </span>
                  <WheelchairA11yIcon className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors flex-shrink-0" />
                </Link>
              </div>

              {/* ============================================================ */}
              {/* 3. BOTTOM FOOTER (Dark #2E2E2E + Logo + Orange Version)       */}
              {/* ============================================================ */}
              <div className="bg-[#2E2E2E] py-3 px-4 flex flex-col items-center justify-center text-center border-t border-gray-700">
                <div className="flex items-center gap-1.5 text-white font-black text-lg tracking-wider" dir="ltr">
                  <span>the</span>
                  <div className="w-5 h-5 rounded-full bg-[#E5832E] flex items-center justify-center text-[#2E2E2E] font-bold text-xs">
                    ✂️
                  </div>
                  <span>cut</span>
                </div>
                <div className="text-[11px] font-bold text-[#E5832E] mt-0.5 tracking-wider">
                  {SHORT_VERSION_LABEL}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareBarbershopModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Bug Report Modal */}
      <BugReportModal
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
      />

      {/* Business Inquiry Modal */}
      {isBusinessModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" dir="rtl">
          <div className="absolute inset-0" onClick={() => setIsBusinessModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-sm w-full bg-[#222222] border border-[#C9A84C]/30 rounded-3xl p-6 text-white shadow-2xl z-10 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-3 text-[#C9A84C]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black mb-1">רוצה מערכת זימון תורים חכמה לעסק שלך?</h3>
            <p className="text-xs text-[#9E9891] mb-5">
              מערכת The Cut מעניקה אתר זימון תורים אולטרה-מהיר, ניהול סניפים, וואטסאפ אוטומטי ופאנל ניהול מתקדם.
            </p>
            <a
              href={`https://wa.me/972521234567?text=${encodeURIComponent('היי, מעוניין לשמוע פרטים על מערכת זימון תורים The Cut עבור העסק שלי')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs flex items-center justify-center gap-2 transition-colors mb-2"
            >
              <MessageCircle className="w-4 h-4" /> דבר איתנו בוואטסאפ
            </a>
            <button
              onClick={() => setIsBusinessModalOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs text-zinc-300 transition-colors"
            >
              סגור
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
