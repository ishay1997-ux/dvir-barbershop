'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Scissors,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Phone,
  CheckCircle,
  MessageCircle,
  MapPin,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { format, addDays, startOfToday } from 'date-fns';
import { he } from 'date-fns/locale';

interface BusinessProfile {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  branches?: Array<{ name: string; address: string }>;
  services?: Array<{ name: string; price: number; duration: number }>;
}

const AVAILABLE_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
];

export default function DynamicBusinessBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(startOfToday(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const res = await fetch(`/api/admin/businesses?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.business) {
            setBusiness(data.business);
            if (data.business.services?.length) {
              setSelectedService(data.business.services[0]);
            }
            if (data.business.branches?.length) {
              setSelectedBranch(data.business.branches[0].name);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBusiness();
  }, [slug]);

  const today = startOfToday();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('נא למלא שם וטלפון');
      return;
    }

    setIsSubmitting(true);
    try {
      const apptData = {
        customerName,
        customerPhone,
        service: selectedService?.name || 'תספורת',
        price: selectedService?.price || 80,
        date: selectedDate,
        time: selectedTime,
        branchName: selectedBranch || business?.city || 'סניף ראשי',
        businessSlug: slug,
        businessName: business?.name || 'The Cut',
        status: 'confirmed',
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apptData),
      });

      if (res.ok) {
        setBookedAppointment(apptData);
        setIsConfirmed(true);
      } else {
        alert('שגיאה בשמירת התור');
      }
    } catch (err) {
      alert('שגיאת תקשורת');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4" dir="rtl">
        <div className="w-10 h-10 border-3 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin mb-2" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-400 mb-4">מספרה לא נמצאה</p>
          <Link href="/" className="px-4 py-2 bg-[#C9A84C] text-black font-bold rounded-xl text-xs">
            חזרה לדף הראשי
          </Link>
        </div>
      </div>
    );
  }

  const cleanPhone = business.phone.replace(/\D/g, '').replace(/^0/, '972');

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#C9A84C] selection:text-black py-8 px-4" dir="rtl">
      <div className="max-w-lg mx-auto">
        {/* Top bar back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
          >
            <ArrowRight className="w-4 h-4" /> חזרה לדף המספרה
          </Link>
          <span className="text-xs text-[#C9A84C] font-bold">{business.name}</span>
        </div>

        {/* Card */}
        <div className="bg-[#1C1C1C] border border-[#C9A84C]/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-3 text-[#C9A84C]">
              <Scissors className="w-7 h-7 -rotate-45" />
            </div>
            <h1 className="text-xl font-black text-white">זימון תור מהיר</h1>
            <p className="text-xs text-[#9E9891] mt-0.5">{business.name} · {business.city}</p>
          </div>

          {isConfirmed && bookedAppointment ? (
            /* Confirmation State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h2 className="text-lg font-black text-emerald-400">התור שלך נקבע בהצלחה!</h2>
              <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 text-xs text-right space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">לקוח:</span>
                  <strong className="text-white">{bookedAppointment.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">שירות:</span>
                  <strong className="text-[#C9A84C]">{bookedAppointment.service}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">תאריך ושעה:</span>
                  <strong className="text-white" dir="ltr">{bookedAppointment.date} | {bookedAppointment.time}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">מיקום:</span>
                  <strong className="text-white">{bookedAppointment.branchName}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${business.ownerName}, קבעתי תור ל-${bookedAppointment.service} בתאריך ${bookedAppointment.date} בשעה ${bookedAppointment.time}. שם: ${bookedAppointment.customerName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> שלח הודעת אישור בוואטסאפ
                </a>
                <Link
                  href={`/${slug}`}
                  className="block w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-zinc-300 font-bold transition-colors"
                >
                  סיום וחזרה לדף הבית
                </Link>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* 1. Choose Service */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">1. בחר שירות:</label>
                <div className="grid grid-cols-1 gap-2">
                  {business.services?.map((srv, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedService(srv)}
                      className={`p-3 rounded-xl border text-right flex items-center justify-between transition-all ${
                        selectedService?.name === srv.name
                          ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-white shadow-xs'
                          : 'bg-[#141414] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black text-white">{srv.name}</div>
                        <span className="text-[10px] text-zinc-500">{srv.duration} דקות</span>
                      </div>
                      <span className="text-xs font-black text-[#C9A84C]">{formatPrice(srv.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Choose Date */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">2. בחר יום:</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {next7Days.map((d) => {
                    const dStr = format(d, 'yyyy-MM-dd');
                    const isSelected = selectedDate === dStr;
                    return (
                      <button
                        key={dStr}
                        type="button"
                        onClick={() => setSelectedDate(dStr)}
                        className={`flex-shrink-0 w-16 py-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#C9A84C] text-black font-black border-[#C9A84C]'
                            : 'bg-[#141414] border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[10px] uppercase">{format(d, 'EEE', { locale: he })}</div>
                        <div className="text-sm font-black">{format(d, 'd')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Choose Time */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">3. בחר שעה פנויה:</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5" dir="ltr">
                  {AVAILABLE_HOURS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedTime === t
                          ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                          : 'bg-[#141414] border-white/10 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Customer Details */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <label className="block text-xs font-bold text-zinc-300">4. פרטים אישיים:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="שם מלא *"
                    required
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                  <User className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="מספר טלפון לקבלת אישור בוואטסאפ *"
                    required
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                  <Phone className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-sm transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? 'קובע תור...' : 'אשר וקבע תור עכשיו ✓'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
