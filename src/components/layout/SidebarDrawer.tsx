'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Zap,
  Bug,
  Smartphone,
  FileText,
  ShieldCheck,
  Accessibility,
  User,
  ExternalLink,
  MessageCircle,
  Scissors,
  Check,
  Download,
} from 'lucide-react';
import { ShareBarbershopModal } from '@/components/landing/QuickModals';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarDrawer({ isOpen, onClose }: SidebarDrawerProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  // Close drawer on Escape
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
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

            {/* Drawer Body (Sliding in from Right in RTL) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[320px] sm:max-w-[360px] h-full bg-[#1C1C1C] text-white flex flex-col shadow-2xl z-10 overflow-y-auto border-l border-white/10 font-sans"
            >
              {/* ============================================================ */}
              {/* 1. TOP AVATAR HEADER (Matching Screenshot)                   */}
              {/* ============================================================ */}
              <div
                className="relative p-6 pt-8 pb-6 flex flex-col items-center justify-center text-center bg-cover bg-center border-b border-white/10"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(20,20,20,0.85), rgba(28,28,28,0.95)), url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80')`,
                }}
              >
                {/* Close Button X */}
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="סגור תפריט"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Avatar Icon */}
                <div className="w-20 h-20 rounded-full bg-[#2A2A2A] border-2 border-[#C9A84C] flex items-center justify-center text-white shadow-xl mb-2">
                  <User className="w-10 h-10 text-[#DFCA85]" />
                </div>

                <h3 className="text-lg font-black text-white">אורח</h3>
                <p className="text-xs text-[#9E9891]">ברוכים הבאים למספרה של דביר</p>
              </div>

              {/* ============================================================ */}
              {/* 2. MENU ITEMS LIST (Matching Screenshot)                     */}
              {/* ============================================================ */}
              <div className="p-3 divide-y divide-white/5 space-y-1 flex-1">
                {/* 1. Share with friend */}
                <button
                  onClick={() => {
                    setIsShareOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#DFCA85] group-hover:scale-110 transition-transform">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#E0E0E0] group-hover:text-white">שתפו עם חבר</span>
                  </div>
                </button>

                {/* 2. Want this app for your business? */}
                <button
                  onClick={() => setIsBusinessModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#33CCFF] group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#E0E0E0] group-hover:text-white">רוצה מערכת כזו לעסק שלך?</span>
                  </div>
                </button>

                {/* 3. Report a bug / issue */}
                <button
                  onClick={() => setIsBugModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                      <Bug className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#E0E0E0] group-hover:text-white">דווחו לנו על תקלה</span>
                  </div>
                </button>

                {/* 4. Add to home screen shortcut */}
                <button
                  onClick={() => setIsPwaModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#E0E0E0] group-hover:text-white">הוסף קיצור למסך הבית</span>
                  </div>
                </button>

                {/* 5. Terms of Use */}
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#E0E0E0] group-hover:text-white">תנאי שימוש</span>
                  </div>
                </Link>

                {/* 6. Privacy Policy */}
                <Link
                  href="/privacy"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#E0E0E0] group-hover:text-white">מדיניות פרטיות</span>
                  </div>
                </Link>

                {/* 7. Accessibility Statement */}
                <Link
                  href="/accessibility"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#33CCFF] group-hover:scale-110 transition-transform">
                      <Accessibility className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#E0E0E0] group-hover:text-white">הצהרת נגישות (תקן 5568)</span>
                  </div>
                </Link>
              </div>

              {/* ============================================================ */}
              {/* 3. FOOTER BRANDING (Matching Reference)                      */}
              {/* ============================================================ */}
              <div className="p-4 bg-[#141414] border-t border-white/10 text-center mt-auto">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#DFCA85]">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>The Cut · המספרה של דביר</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  גרסה W2.1.0 · מותאם לתקן ישראלי 5568
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareBarbershopModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

      {/* Bug Report Modal */}
      {isBugModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" dir="rtl">
          <div className="absolute inset-0" onClick={() => setIsBugModalOpen(false)} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-sm bg-[#222222] border border-white/15 rounded-3xl p-6 text-white shadow-2xl z-10 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-3">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white mb-1">דיווח על תקלה</h3>
            <p className="text-xs text-zinc-400 mb-5">
              נתקלת בבעיה באתר? שלח לנו הודעה ישירה בוואטסאפ ונטפל בכך באופן מיידי.
            </p>
            <a
              href={`https://wa.me/972521234567?text=${encodeURIComponent('היי דביר, נתקלתי בבעיה/תקלה באתר זימון התורים:')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsBugModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#25D366] text-white font-black text-sm flex items-center justify-center gap-2 mb-3 hover:opacity-95"
            >
              <MessageCircle className="w-4 h-4" /> דווח בוואטסאפ לדביר
            </a>
            <button
              onClick={() => setIsBugModalOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              סגור
            </button>
          </motion.div>
        </div>
      )}

      {/* Add To Home Screen (PWA) Modal */}
      {isPwaModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" dir="rtl">
          <div className="absolute inset-0" onClick={() => setIsPwaModalOpen(false)} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-[#222222] border border-[#C9A84C]/30 rounded-3xl p-6 text-white shadow-2xl z-10 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white mb-1">הוסף קיצור למסך הבית</h3>
            <p className="text-xs text-zinc-400 mb-5">
              התקן את המספרה של דביר כאפליקציה בטלפון שלך לזימון תורים מהיר בלחיצה אחת:
            </p>

            <div className="space-y-3 text-right bg-white/5 rounded-2xl p-4 text-xs mb-5">
              <div>
                <strong className="text-[#DFCA85] block mb-1">📱 באייפון (iPhone / Safari):</strong>
                <p className="text-zinc-300">לחץ על כפתור השיתוף (מרובע עם חץ למעלה) בתחתית הדפדפן ➔ בחר &quot;הוסף למסך הבית&quot; (Add to Home Screen).</p>
              </div>
              <div className="pt-2 border-t border-white/10">
                <strong className="text-[#33CCFF] block mb-1">🤖 באנדרואיד (Android / Chrome):</strong>
                <p className="text-zinc-300">לחץ על 3 הנקודות בפינה העליונה ➔ בחר &quot;התקן אפליקציה&quot; או &quot;הוסף למסך הבית&quot;.</p>
              </div>
            </div>

            <button
              onClick={() => setIsPwaModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#C9A84C] text-[#1C1C1C] font-black text-sm hover:bg-[#DFCA85]"
            >
              הבנתי, תודה! ✓
            </button>
          </motion.div>
        </div>
      )}

      {/* Business Inquiry Modal */}
      {isBusinessModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" dir="rtl">
          <div className="absolute inset-0" onClick={() => setIsBusinessModalOpen(false)} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-sm bg-[#222222] border border-[#33CCFF]/30 rounded-3xl p-6 text-white shadow-2xl z-10 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#33CCFF]/15 border border-[#33CCFF]/30 flex items-center justify-center text-[#33CCFF] mx-auto mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white mb-1">רוצה מערכת כזו לעסק שלך?</h3>
            <p className="text-xs text-zinc-400 mb-5">
              מערכת זימון תורים, ניהול לקוחות (CRM), תזכורות WhatsApp ולוח זמנים חכם לעסקים ומספרות.
            </p>
            <a
              href={`https://wa.me/972521234567?text=${encodeURIComponent('היי, אשמח לפרטים על מערכת זימון התורים של The Cut עבור העסק שלי:')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsBusinessModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#33CCFF] text-[#003344] font-black text-sm flex items-center justify-center gap-2 mb-3"
            >
              <MessageCircle className="w-4 h-4" /> צור קשר בוואטסאפ
            </a>
            <button
              onClick={() => setIsBusinessModalOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              סגור
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
