'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Phone, Scissors, MessageCircle } from 'lucide-react';
import type { BusinessConfig } from '@/types/business';
import Link from 'next/link';
import { useToast } from '@/components/common/ToastProvider';

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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [justCancelled, setJustCancelled] = useState(false);

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';
  const slug = business?.slug || 'dvir';

  const { showConfirm, success, error } = useToast();

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
              <h3 className="text-lg font-black text-white" style={{ color: '#FFFFFF' }}>
                התורים שלי
              </h3>
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
