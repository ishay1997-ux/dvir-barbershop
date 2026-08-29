'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Calendar, Phone, MapPin, Share2, Copy, Check, ExternalLink, Scissors, MessageCircle } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import { BusinessConfig } from '@/types/business';
import Link from 'next/link';
import { useToast } from '@/components/common/ToastProvider';

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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#222222] border rounded-3xl p-6 shadow-2xl z-10"
        style={{ borderColor: `${themeColor}40`, backgroundColor: '#1E1E1E', color: '#FFFFFF' }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`,
                color: themeColor,
              }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white" style={{ color: '#FFFFFF' }}>שעות פתיחה ופעילות</h3>
              <p className="text-xs text-zinc-400">{bizName} · {business?.city || 'ישראל'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
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
                    : 'bg-white/5 border-white/5 text-zinc-200'
                }`}
                style={{
                  backgroundColor: isToday ? `${themeColor}20` : undefined,
                  borderColor: isToday ? themeColor : undefined,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: isToday ? '#FFFFFF' : '#E2E8F0' }}>{schedule.day}</span>
                  {isToday && (
                    <span
                      className="text-[#1C1C1C] text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    >
                      היום
                    </span>
                  )}
                  {schedule.branch && !business?.branches?.length && (
                    <span className="text-xs text-zinc-400 mr-1">({schedule.branch})</span>
                  )}
                </div>

                <div className="text-sm font-bold">
                  {schedule.closed ? (
                    <span className="text-red-400">סגור</span>
                  ) : (
                    <span style={{ color: isToday ? '#FFFFFF' : '#E2E8F0' }}>{schedule.open} – {schedule.close}</span>
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
                <strong className="text-white" style={{ color: '#FFFFFF' }}>{b.name}:</strong> <span>{b.address}</span>
              </p>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 text-xs text-[#9E9891] space-y-1 mb-5">
            <p>📍 <strong className="text-white" style={{ color: '#FFFFFF' }}>סניף אריאל:</strong> ימים א׳, ב׳, ג׳ (מעונות הסטודנטים)</p>
            <p>📍 <strong className="text-white" style={{ color: '#FFFFFF' }}>סניף רחובות:</strong> ימים ד׳, ה׳, ו׳ (קליניקה פרטית)</p>
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
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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

  const { showConfirm, success, error } = useToast();

  const handleCancelAppointment = (aptId: string) => {
    showConfirm({
      title: 'ביטול תור',
      message: 'האם אתה בטוח שברצונך לבטל את התור שנקבע? ביטול התור יפנה את השעה ביומן.',
      confirmText: 'כן, בטל תור',
      cancelText: 'חזור',
      type: 'danger',
      onConfirm: async () => {
        setCancellingId(aptId);
        try {
          await fetch(`/api/appointments?id=${encodeURIComponent(aptId)}`, {
            method: 'DELETE',
          });
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('thecut_customer_appointments_v3');
            if (stored) {
              const parsed = JSON.parse(stored);
              const updated = parsed.filter((item: any) => item.id !== aptId);
              localStorage.setItem('thecut_customer_appointments_v3', JSON.stringify(updated));
            }
          }
          setAppointments((prev) => prev.filter((a) => a.id !== aptId));
          setJustCancelled(true);
          success('התור בוטל בהצלחה', 'השעה פונתה ביומן');
        } catch {
          error('שגיאה בביטול התור', 'אירעה שגיאה בביטול התור, אנא נסה שוב.');
        } finally {
          setCancellingId(null);
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#222222] border rounded-3xl p-6 text-white shadow-2xl z-10"
        style={{ borderColor: `${themeColor}40`, backgroundColor: '#1E1E1E', color: '#FFFFFF' }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`,
                color: themeColor,
              }}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white" style={{ color: '#FFFFFF' }}>התורים שלי</h3>
              <p className="text-xs text-zinc-400">{bizName} · איתור וניהול תור מהיר</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Phone Input Form */}
        <form onSubmit={handleSearch} className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-zinc-200 mb-1.5">הזן מספר טלפון נייד:</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-1234567"
                required
                className="w-full bg-[#141414] border border-white/15 focus:border-white rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
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
                    className="p-4 rounded-2xl bg-[#141414] border-2 space-y-2.5 shadow-md text-right"
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
                      <span className="font-semibold">⏰ {apt.time}</span>
                    </div>

                    <div className="text-xs text-zinc-400">
                      📍 {apt.branchName || 'סניף מרכזי'}
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        disabled={cancellingId === apt.id}
                        className="text-xs text-red-400 hover:text-red-300 font-bold underline transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingId === apt.id ? 'מבטל תור...' : 'בטל תור זה'}
                      </button>

                      <a
                        href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `היי ${business?.ownerName || 'דביר'}, לגבי התור שלי בתאריך ${apt.date} בשעה ${apt.time}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> הודעה לספר
                      </a>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">{justCancelled ? '✓' : '🔍'}</div>
                <p className="text-sm font-bold text-white mb-1" style={{ color: '#FFFFFF' }}>
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

        <h3 className="text-lg font-black text-white mb-1" style={{ color: '#FFFFFF' }}>שתף את {bizName}</h3>
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

// ============================================================
// 4. BUSINESS LEAD MODAL ("רוצה מערכת כזו גם אצלך בעסק?")
// ============================================================
export function BusinessLeadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    // Simulate sending lead or WhatsApp
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 25 }}
        className="relative w-full max-w-[360px] sm:max-w-[400px] bg-white rounded-[2.5rem] shadow-2xl z-10 overflow-hidden border border-slate-200 text-slate-900 font-sans"
      >
        {/* Top Header Mockup Image Banner */}
        <div className="relative h-44 bg-slate-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80"
            alt="Business Workspace"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/95" />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Form */}
        <div className="p-6 pt-2 text-center">
          <h3 className="text-xl font-black text-slate-900 mb-1">
            רוצה The Cut גם אצלך בעסק?
          </h3>
          <p className="text-xs text-slate-600 font-medium mb-6">
            מלא/י את הטופס ונציג יחזור אליכם בהקדם
          </p>

          {isSubmitted ? (
            <div className="py-8 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-base font-black text-slate-900">הפרטים נשלחו בהצלחה!</h4>
              <p className="text-xs text-slate-600">נציג יחזור אליך בהקדם האפשרי.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-right">
              {/* Name input */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="שם מלא"
                  className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C288] focus:border-transparent transition-all shadow-xs"
                />
              </div>

              {/* Phone input */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="טלפון"
                  dir="rtl"
                  className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C288] focus:border-transparent transition-all shadow-xs"
                />
              </div>

              {/* Email input (optional) */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="אימייל (אופציונלי)"
                  className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C288] focus:border-transparent transition-all shadow-xs"
                />
              </div>

              {/* Message input */}
              <div className="relative">
                <div className="absolute top-3.5 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="תוכן ההודעה"
                  className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C288] focus:border-transparent transition-all shadow-xs resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#00C288] hover:bg-[#00ab78] active:scale-98 text-white font-black text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'שולח...' : 'שלח/י'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-sm transition-all border border-slate-300 cursor-pointer"
                >
                  ביטול
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

