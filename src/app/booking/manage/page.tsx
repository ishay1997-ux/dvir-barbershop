'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Scissors,
  XCircle,
  CheckCircle,
  Phone,
  ArrowRight,
  AlertTriangle,
  Search,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { formatPrice, SHOP_INFO } from '@/lib/utils';
import Link from 'next/link';

interface AppointmentData {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName?: string;
  servicePrice?: number;
  service?: string;
  price?: number;
  barberName?: string;
  barber?: string;
  branchName?: string;
  branch?: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled';
}

function ManageBookingContent() {
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get('phone') || '';
  const initialId = searchParams.get('id') || '';

  const { settings } = useShopStore();

  const [phone, setPhone] = useState(initialPhone);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelledSuccessMap, setCancelledSuccessMap] = useState<Record<string, boolean>>({});

  // Fetch appointments by phone or ID
  const fetchAppointments = async (searchPhone: string, searchId?: string) => {
    setIsLoading(true);
    const results: AppointmentData[] = [];

    // 1. Check local storage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('thecut_customer_appointments_v3');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const cleanSearch = searchPhone.replace(/\D/g, '');
            parsed.forEach((item) => {
              const itemClean = (item.customerPhone || '').replace(/\D/g, '');
              if (
                (cleanSearch && itemClean.includes(cleanSearch)) ||
                (searchId && item.id === searchId)
              ) {
                results.push(item);
              }
            });
          }
        }
      } catch {
        // Storage error
      }
    }

    // 2. Fetch from API
    try {
      let url = '/api/appointments';
      if (searchId) {
        url = `/api/appointments?id=${encodeURIComponent(searchId)}`;
      } else if (searchPhone) {
        url = `/api/appointments?phone=${encodeURIComponent(searchPhone)}`;
      }

      const res = await fetch(url);
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
    } catch (err) {
      console.error('Fetch error:', err);
    }

    setAppointments(results);
    setIsLoading(false);
    setHasSearched(true);
  };

  // Auto load on mount if params exist
  useEffect(() => {
    if (initialPhone || initialId) {
      fetchAppointments(initialPhone, initialId);
    }
  }, [initialPhone, initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 9) return;
    fetchAppointments(phone.trim());
  };

  // Cancel Appointment Handler
  const handleCancel = async (apt: AppointmentData) => {
    const confirmCancel = window.confirm(`האם אתה בטוח שברצונך לבטל את התור לתאריך ${apt.date} בשעה ${apt.time}?`);
    if (!confirmCancel) return;

    setCancellingId(apt.id);

    try {
      // 1. Call API PATCH
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: apt.id, status: 'cancelled' }),
      });

      // 2. Update local storage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('thecut_customer_appointments_v3');
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.map((item: any) =>
            item.id === apt.id ? { ...item, status: 'cancelled' } : item
          );
          localStorage.setItem('thecut_customer_appointments_v3', JSON.stringify(updated));
        }
      }

      // 3. Update component state
      setAppointments((prev) =>
        prev.map((a) => (a.id === apt.id ? { ...a, status: 'cancelled' } : a))
      );
      setCancelledSuccessMap((prev) => ({ ...prev, [apt.id]: true }));
    } catch (err) {
      alert('אירעה שגיאה בביטול התור. אנא צור קשר טלפוני עם המספרה.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white py-12 px-4" dir="rtl">
      <div className="max-w-lg mx-auto">
        {/* Top Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#C9A84C] hover:opacity-80 transition-opacity mb-3">
            <Scissors className="w-6 h-6 -rotate-45" />
            <span className="font-black tracking-wider text-xl">המספרה של דביר</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black">איתור וניהול התורים שלי</h1>
          <p className="text-xs sm:text-sm text-[#9E9891] mt-1.5">
            צפה בפרטי התור, שנה מועד או בטל תור קיים
          </p>
        </div>

        {/* Search By Phone Card */}
        <div className="bg-[#1C1C1C] border border-[#C9A84C]/30 rounded-3xl p-6 shadow-xl mb-6">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <label className="block text-xs font-bold text-[#E0E0E0]">
              הזן מספר טלפון לאיתור התורים שלך:
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-1234567"
                required
                className="flex-1 bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || phone.length < 9}
                className="px-6 py-3 rounded-2xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs sm:text-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>חפש</span>
              </button>
            </div>
          </form>
        </div>

        {/* Search Results List */}
        {hasSearched && (
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((apt) => {
                const isItemCancelled = apt.status === 'cancelled' || cancelledSuccessMap[apt.id];
                const serviceTitle = apt.serviceName || apt.service || 'תספורת גברים';
                const serviceCost = apt.servicePrice || apt.price || 80;
                const branchTitle = apt.branchName || apt.branch || 'סניף המספרה';
                const barberTitle = apt.barberName || apt.barber || 'דביר';

                return (
                  <div
                    key={apt.id}
                    className={`bg-[#1C1C1C] border-2 rounded-3xl p-6 shadow-xl transition-all ${
                      isItemCancelled
                        ? 'border-red-500/30 bg-red-950/10'
                        : 'border-[#C9A84C]/40 bg-[#1C1C1C]'
                    }`}
                  >
                    {/* Status badge */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2">
                        {isItemCancelled ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="text-xs font-bold text-red-400">תור מבוטל</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-400">תור מאושר ופעיל</span>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500" dir="ltr">#{apt.id.slice(-6)}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm text-[#D5CBB8]">
                      <div className="flex items-center gap-3">
                        <Scissors className="w-4 h-4 text-[#C9A84C]" />
                        <span className="font-bold text-white text-base">{serviceTitle}</span>
                        <span className="mr-auto text-xs text-[#C9A84C] font-black bg-[#C9A84C]/15 px-2.5 py-1 rounded-full">
                          ₪{serviceCost}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-[#C9A84C]" />
                        <span>תאריך: <strong className="text-white">{apt.date}</strong></span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#C9A84C]" />
                        <span>שעה: <strong className="text-white" dir="ltr">{apt.time}</strong></span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#C9A84C]" />
                        <span>מיקום: <strong>{branchTitle}</strong></span>
                      </div>
                    </div>

                    {/* Cancel Success Notice */}
                    {isItemCancelled ? (
                      <div className="mt-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
                        <p className="text-xs font-bold text-red-300 mb-2">
                          התור בוטל בהצלחה והמשבצת פונתה במערכת.
                        </p>
                        <a
                          href={`https://wa.me/972521234567?text=${encodeURIComponent(`היי דביר, ביטלתי את התור שלי לתאריך ${apt.date} בשעה ${apt.time}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-bold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> עדכן את דביר בוואטסאפ
                        </a>
                      </div>
                    ) : (
                      /* Cancel Action Button */
                      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleCancel(apt)}
                          disabled={cancellingId === apt.id}
                          className="flex-1 py-3 px-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          {cancellingId === apt.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          <span>בטל תור זה</span>
                        </button>

                        <Link
                          href="/booking"
                          className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors text-center"
                        >
                          קבע תור נוסף
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-[#1C1C1C] border border-white/10 rounded-3xl p-8 text-center">
                <p className="text-sm font-bold text-white mb-2">לא נמצאו תורים עבור מספר טלפון זה</p>
                <p className="text-xs text-zinc-400 mb-5">וודא שהזנת את מספר הטלפון המדויק איתו ביצעת את ההזמנה.</p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-[#C9A84C] text-[#1C1C1C] text-xs font-black"
                >
                  קבע תור חדש עכשיו ←
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Cancellation Notice Policy */}
        <div className="mt-8 bg-[#1C1C1C] rounded-2xl p-4 border border-white/10 flex items-start gap-2.5 text-xs text-zinc-400">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <span>
            <strong>מדיניות ביטולים:</strong> ניתן לבטל תור ללא עלות עד {settings.cancellationNoticeHours || 2} שעות לפני המועד שנקבע.
          </span>
        </div>

        {/* Back Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1">
            <ArrowRight className="w-3.5 h-3.5" /> חזרה לעמוד הבית
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ManageBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">טוען נתונים...</div>}>
      <ManageBookingContent />
    </Suspense>
  );
}
