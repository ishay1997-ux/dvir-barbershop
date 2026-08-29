'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Calendar, Phone, MapPin, Share2, Copy, Check, ExternalLink, Scissors, MessageCircle } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import { INITIAL_BRANCHES } from '@/lib/store';
import { BusinessConfig } from '@/types/business';
import Link from 'next/link';

// ============================================================
// 1. OPENING HOURS MODAL (שעות פתיחה)
// ============================================================
export function OpeningHoursModal({
  isOpen,
  onClose,
  business,
}: {
  isOpen: boolean;
  onClose: () => void;
  business?: Partial<BusinessConfig>;
}) {
  const currentDayIdx = new Date().getDay();
  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';
  const slug = business?.slug || 'dvir';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#222222] border rounded-3xl p-6 text-white shadow-2xl z-10"
        style={{ borderColor: `${themeColor}40` }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`,
                color: themeColor,
              }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">שעות פתיחה ופעילות</h3>
              <p className="text-xs text-[#9E9891]">{bizName} · {business?.city || 'ישראל'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#9E9891] hover:text-white transition-colors cursor-pointer"
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
                    ? 'border-white/40 shadow-md text-white'
                    : 'bg-white/5 border-white/5 text-[#E0E0E0]'
                }`}
                style={{
                  backgroundColor: isToday ? `${themeColor}20` : undefined,
                  borderColor: isToday ? themeColor : undefined,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{schedule.day}</span>
                  {isToday && (
                    <span
                      className="text-[#1C1C1C] text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    >
                      היום
                    </span>
                  )}
                  {schedule.branch && !business?.branches?.length && (
                    <span className="text-xs text-[#9E9891] mr-1">({schedule.branch})</span>
                  )}
                </div>

                <div className="text-sm font-bold">
                  {schedule.closed ? (
                    <span className="text-red-400">סגור</span>
                  ) : (
                    <span dir="ltr">
                      {schedule.open} – {schedule.close}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Branches Info Quick Tip */}
        {business?.branches && business.branches.length > 0 ? (
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 text-xs text-[#9E9891] space-y-1.5 mb-5">
            {business.branches.map((b, i) => (
              <p key={i} className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <strong className="text-white">{b.name}:</strong> <span>{b.address}</span>
              </p>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 text-xs text-[#9E9891] space-y-1 mb-5">
            <p>📍 <strong className="text-white">סניף אריאל:</strong> ימים א׳, ב׳, ג׳ (מעונות הסטודנטים)</p>
            <p>📍 <strong className="text-white">סניף רחובות:</strong> ימים ד׳, ה׳, ו׳ (קליניקה פרטית)</p>
          </div>
        )}

        <Link
          href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl text-[#1C1C1C] font-black text-center flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg cursor-pointer"
          style={{ backgroundColor: themeColor }}
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
  business,
}: {
  isOpen: boolean;
  onClose: () => void;
  business?: Partial<BusinessConfig>;
}) {
  const [phone, setPhone] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [justCancelled, setJustCancelled] = useState(false);

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';
  const slug = business?.slug || 'dvir';

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) return;

    setJustCancelled(false);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#222222] border rounded-3xl p-6 text-white shadow-2xl z-10"
        style={{ borderColor: `${themeColor}40` }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`,
                color: themeColor,
              }}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">התורים שלי</h3>
              <p className="text-xs text-[#9E9891]">{bizName} · איתור וניהול תור מהיר</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#9E9891] hover:text-white transition-colors cursor-pointer"
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
                className="w-full bg-[#1A1A1A] border border-white/15 focus:border-white rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
              />
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || phone.length < 9}
            className="w-full py-3 rounded-2xl text-[#1C1C1C] font-black text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-md"
            style={{ backgroundColor: themeColor }}
          >
            {isLoading ? 'מחפש תורים...' : 'חפש את התורים שלי 🔍'}
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3 max-h-64 overflow-y-auto pr-1">
            {appointments.filter((a) => a.status !== 'cancelled').length > 0 ? (
              appointments
                .filter((a) => a.status !== 'cancelled')
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-[#1A1A1A] border-2 space-y-2.5 shadow-md text-right"
                    style={{ borderColor: `${themeColor}60` }}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-black text-sm" style={{ color: themeColor }}>
                        {apt.serviceName || apt.service || 'תספורת גברים'}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        מאושר ופעיל ✓
                      </span>
                    </div>

                    <div className="text-xs text-zinc-200 flex items-center justify-between">
                      <span className="font-semibold">📅 {apt.date}</span>
                      <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md" dir="ltr">
                        ⏰ {apt.time}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400">
                      📍 {apt.branchName || apt.branch || 'סניף המספרה'}
                    </div>

                    {/* Action buttons inside modal */}
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={async () => {
                          const confirmCancel = window.confirm(
                            `האם אתה בטוח שברצונך לבטל את התור לתאריך ${apt.date} בשעה ${apt.time}?`
                          );
                          if (!confirmCancel) return;

                          try {
                            await fetch(`/api/appointments?id=${encodeURIComponent(apt.id)}`, {
                              method: 'DELETE',
                            });

                            if (typeof window !== 'undefined') {
                              const stored = localStorage.getItem('thecut_customer_appointments_v3');
                              if (stored) {
                                const parsed = JSON.parse(stored);
                                const updated = parsed.filter((item: any) => item.id !== apt.id);
                                localStorage.setItem('thecut_customer_appointments_v3', JSON.stringify(updated));
                              }
                            }

                            setAppointments((prev) => prev.filter((a) => a.id !== apt.id));
                            setJustCancelled(true);
                          } catch (err) {
                            alert('אירעה שגיאה בביטול התור.');
                          }
                        }}
                        className="flex-1 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 text-center text-xs font-bold transition-colors cursor-pointer"
                      >
                        בטל ומחק תור זה ❌
                      </button>

                      <Link
                        href={`/booking/manage?phone=${phone}`}
                        onClick={onClose}
                        className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-center text-xs font-bold transition-colors"
                      >
                        פרטים מלאים
                      </Link>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2" style={{ color: themeColor }}>
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  {justCancelled
                    ? 'התור בוטל בהצלחה! המשבצת פונתה במערכת'
                    : 'לא נמצאו תורים עתידיים למספר זה'}
                </p>
                <p className="text-xs text-zinc-400 mb-4">
                  {justCancelled
                    ? 'נשמח לראותך במועד אחר. מעוניין לשריין תור חדש?'
                    : `מעוניין לשריין מועד לתספורת אצל ${business?.ownerName || 'הספר'}?`}
                </p>
                <Link
                  href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[#1C1C1C] text-xs font-black shadow-md transition-colors"
                  style={{ backgroundColor: themeColor }}
                >
                  <Scissors className="w-3.5 h-3.5" /> קבע תור חדש עכשיו
                </Link>
              </div>
            )}
          </div>
        )}
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

  const shareUrl = typeof window !== 'undefined'
    ? (slug === 'dvir' || slug === 'thecut' ? window.location.origin : `${window.location.origin}/${slug}`)
    : `https://thecut-reg-in.vercel.app/${slug}`;

  const shareText = `${bizName} – ${business?.slogan || 'תספורות פרימיום ודירוגים מדויקים'}. לקביעת תור מהיר:`;

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-[#222222] border rounded-3xl p-6 text-white shadow-2xl z-10 text-center"
        style={{ borderColor: `${themeColor}40` }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border"
          style={{
            backgroundColor: `${themeColor}15`,
            borderColor: `${themeColor}40`,
            color: themeColor,
          }}
        >
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-white mb-1">שתף את {bizName}</h3>
        <p className="text-xs text-[#9E9891] mb-5">שתף קישור מהיר לקביעת תורים עם חברים</p>

        <div className="space-y-2.5 mb-4">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 rounded-2xl bg-[#25D366] text-white font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-md"
          >
            <MessageCircle className="w-4 h-4" /> שתף ב-WhatsApp
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-white/10 cursor-pointer"
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
