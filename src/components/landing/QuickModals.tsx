'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Phone, MapPin, Share2, Copy, Check, ExternalLink, Scissors, MessageCircle } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import { INITIAL_BRANCHES } from '@/lib/store';
import Link from 'next/link';

// ============================================================
// 1. OPENING HOURS MODAL (שעות פתיחה)
// ============================================================
export function OpeningHoursModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const currentDayIdx = new Date().getDay();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#222222] border border-[#C9A84C]/30 rounded-3xl p-6 text-white shadow-2xl z-10"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">שעות פתיחה ופעילות</h3>
              <p className="text-xs text-[#9E9891]">המספרה של דביר · סניפי אריאל ורחובות</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#9E9891] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule List */}
        <div className="space-y-2 mb-6">
          {SHOP_INFO.workingHours.map((schedule, idx) => {
            const isToday = currentDayIdx === idx;
            return (
              <div
                key={schedule.day}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isToday
                    ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-white shadow-md'
                    : 'bg-white/5 border-white/5 text-[#E0E0E0]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{schedule.day}</span>
                  {isToday && (
                    <span className="bg-[#C9A84C] text-[#1C1C1C] text-[10px] font-black px-2 py-0.5 rounded-full">
                      היום
                    </span>
                  )}
                  {schedule.branch && (
                    <span className="text-xs text-[#9E9891] mr-1">({schedule.branch})</span>
                  )}
                </div>

                <div className="text-sm font-bold">
                  {schedule.closed ? (
                    <span className="text-red-400">סגור</span>
                  ) : (
                    <span>
                      {schedule.open} – {schedule.close}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Branch Info Quick Tip */}
        <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 text-xs text-[#9E9891] space-y-1 mb-5">
          <p>
            📍 <strong className="text-white">סניף אריאל:</strong> ימים א׳, ב׳, ג׳ (מעונות הסטודנטים)
          </p>
          <p>
            📍 <strong className="text-white">סניף רחובות:</strong> ימים ד׳, ה׳, ו׳ (קליניקה פרטית)
          </p>
        </div>

        <Link
          href="/booking"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#DFCA85] text-[#1C1C1C] font-black text-center flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg"
        >
          <Scissors className="w-4 h-4" /> קבע תור עכשיו
        </Link>
      </motion.div>
    </div>
  );
}

// ============================================================
// 2. MY APPOINTMENTS MODAL (התורים שלי)
// ============================================================
export function MyAppointmentsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) return;

    setIsLoading(true);
    const results: any[] = [];
    const cleanPhone = phone.replace(/\D/g, '');

    // 1. Local storage check
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('thecut_customer_appointments_v3');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              const itemClean = (item.customerPhone || '').replace(/\D/g, '');
              if (itemClean.includes(cleanPhone) || cleanPhone.includes(itemClean)) {
                results.push(item);
              }
            });
          }
        }
      } catch (e) {
        console.error('Storage error:', e);
      }
    }

    // 2. Server API check
    try {
      const res = await fetch(`/api/appointments?phone=${cleanPhone}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.appointments)) {
          data.appointments.forEach((apt: any) => {
            if (!results.some((r) => r.id === apt.id)) {
              results.push(apt);
            }
          });
        }
      }
    } catch {
      // Ignore network errors
    } finally {
      setAppointments(results);
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#222222] border border-[#C9A84C]/30 rounded-3xl p-6 text-white shadow-2xl z-10"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">התורים שלי</h3>
              <p className="text-xs text-[#9E9891]">איתור וניהול תור מהיר לפי מספר נייד</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#9E9891] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Phone Input Form */}
        <form onSubmit={handleSearch} className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-[#E0E0E0] mb-1.5">הזן מספר טלפון נייד:</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-1234567"
                required
                className="w-full bg-[#1A1A1A] border border-white/15 focus:border-[#C9A84C] rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
              />
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || phone.length < 9}
            className="w-full py-3 rounded-2xl bg-[#C9A84C] text-[#1C1C1C] font-black text-sm hover:bg-[#DFCA85] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'מחפש תורים...' : 'חפש את התורים שלי 🔍'}
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#C9A84C]">{apt.serviceName || 'תספורת גברים'}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
                      {apt.status === 'confirmed' ? 'מאושר ✓' : apt.status}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 flex items-center justify-between">
                    <span>📅 {apt.date}</span>
                    <span>⏰ {apt.time}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    📍 {apt.branchName || 'סניף המספרה'}
                  </div>
                  <div className="pt-2 flex gap-2">
                    <Link
                      href={`/booking/manage?phone=${phone}`}
                      onClick={onClose}
                      className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-center text-xs font-bold transition-colors"
                    >
                      ניהול / ביטול תור
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-sm font-bold text-white mb-1">לא נמצאו תורים עתידיים לטלפון זה</p>
                <p className="text-xs text-zinc-400 mb-3">מעוניין לקבוע תור חדש?</p>
                <Link
                  href="/booking"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A84C] text-[#1C1C1C] text-xs font-black"
                >
                  קבע תור חדש ←
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-center">
          <Link
            href="/booking/manage"
            onClick={onClose}
            className="text-xs text-[#9E9891] hover:text-[#C9A84C] transition-colors inline-flex items-center gap-1"
          >
            מעבר לעמוד ניהול תורים המלא <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 3. SHARE MODAL (שיתוף המספרה)
// ============================================================
export function ShareBarbershopModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dvir-barbershop-reg-in.vercel.app';
  const shareText = 'המספרה של דביר – תספורות גברים פרימיום ודירוגים באריאל וברחובות. לקביעת תור מהיר:';

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-[#222222] border border-[#C9A84C]/30 rounded-3xl p-6 text-white shadow-2xl z-10 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] mx-auto mb-3">
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-white mb-1">שתף את המספרה של דביר</h3>
        <p className="text-xs text-[#9E9891] mb-5">שתף קישור מהיר לקביעת תורים עם חברים</p>

        <div className="space-y-2.5 mb-4">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 rounded-2xl bg-[#25D366] text-white font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
          >
            <MessageCircle className="w-4 h-4" /> שתף ב-WhatsApp
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'הקישור הועתק!' : 'העתק קישור להזמנה'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          סגור
        </button>
      </motion.div>
    </div>
  );
}
