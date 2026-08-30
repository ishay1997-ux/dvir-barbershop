'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { createAppointmentConfirmationUrl } from '@/lib/whatsapp';
import { format, addDays, startOfToday } from 'date-fns';
import { he } from 'date-fns/locale';
import { useToast } from '@/components/common/ToastProvider';
import { getBusinessBySlug } from '@/lib/business-service';
import { BusinessConfig } from '@/types/business';

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
  const slug = resolvedParams.slug.toLowerCase().trim();
  const searchParams = useSearchParams();
  const preSelectedServiceName = searchParams.get('service');
  const { success, error } = useToast();

  const [business, setBusiness] = useState<BusinessConfig | null>(null);
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
        const data = await getBusinessBySlug(slug);
        if (data) {
          setBusiness(data);
          if (data.services?.length) {
            const matched = preSelectedServiceName
              ? data.services.find((s) => s.name.toLowerCase().includes(preSelectedServiceName.toLowerCase()))
              : null;
            setSelectedService(matched || data.services[0]);
          }
          if (data.branches?.length) {
            setSelectedBranch(data.branches[0].name);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBusiness();
  }, [slug, preSelectedServiceName]);

  const today = startOfToday();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const themeColor = business?.themeColor || '#C9A84C';
  const cleanPhone = business?.phone ? business.phone.replace(/\D/g, '').replace(/^0/, '972') : '972500000000';

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      error('נא למלא שם ומספר טלפון');
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
        success('התור נקבע בהצלחה! 🎉', `נקבע ל-${selectedService?.name || 'טיפול'} בשעה ${selectedTime}`);
      } else {
        error('שגיאה בשמירת התור', 'נסה שוב בעוד מספר רגעים');
      }
    } catch (err) {
      error('שגיאת תקשורת', 'בדוק את החיבור לרשת');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!bookedAppointment) return;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//The Cut//Appointment Calendar//HE',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:תור ל-${bookedAppointment.service} אצל ${business?.name}`,
      `DESCRIPTION:תור שנקבע אצל ${business?.name} (${bookedAppointment.branchName}) עבור ${bookedAppointment.customerName}. טלפון: ${business?.phone}`,
      `LOCATION:${bookedAppointment.branchName}, ${business?.city}`,
      `DTSTART:${bookedAppointment.date.replace(/-/g, '')}T${bookedAppointment.time.replace(':', '')}00`,
      `DTEND:${bookedAppointment.date.replace(/-/g, '')}T${bookedAppointment.time.replace(':', '')}00`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `appointment-${slug}-${bookedAppointment.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4" dir="rtl">
        <div className="w-10 h-10 border-3 border-t-white rounded-full animate-spin mb-2" style={{ borderColor: `${themeColor}40`, borderTopColor: themeColor }} />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-400 mb-4">מספרה לא נמצאה</p>
          <Link href="/" className="px-4 py-2 text-black font-bold rounded-xl text-xs" style={{ backgroundColor: themeColor }}>
            חזרה לדף הראשי
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#C9A84C] selection:text-black py-8 px-4"
      dir="rtl"
    >
      <div className="max-w-lg mx-auto">
        {/* Top bar back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
          >
            <ArrowRight className="w-4 h-4" /> חזרה לדף המספרה
          </Link>
          <span className="text-xs font-bold" style={{ color: themeColor }}>{business.name}</span>
        </div>

        {/* Card */}
        <div className="bg-[#1C1C1C] border rounded-3xl p-6 sm:p-8 shadow-2xl" style={{ borderColor: `${themeColor}40` }}>
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border font-black text-lg"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`,
                color: themeColor,
              }}
            >
              {business.name.trim().charAt(0)}
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
                  <strong style={{ color: themeColor }}>{bookedAppointment.service}</strong>
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
                  href={createAppointmentConfirmationUrl({
                    targetPhone: business.whatsappNumber || business.phone,
                    ownerName: business.ownerName,
                    businessName: business.name,
                    serviceName: bookedAppointment.service,
                    dateStr: bookedAppointment.date,
                    time: bookedAppointment.time,
                    customerName: bookedAppointment.customerName,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> שלח הודעת אישור בוואטסאפ
                </a>

                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-zinc-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> שמור תזכורת ביומן (Apple / Google)
                </button>

                <Link
                  href={`/${slug}`}
                  className="block w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-400 font-bold transition-colors"
                >
                  סיום וחזרה לדף הבית
                </Link>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Branch Selector (if multiple) */}
              {business.branches && business.branches.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">בחר סניף:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {business.branches.map((b, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedBranch(b.name)}
                        className={`p-2.5 rounded-xl border text-right text-xs font-bold transition-all cursor-pointer ${
                          selectedBranch === b.name
                            ? 'bg-white/15 border-white text-white'
                            : 'bg-[#141414] border-white/10 text-zinc-400'
                        }`}
                      >
                        <div className="truncate">{b.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 1. Choose Service */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">1. בחר טיפול / שירות:</label>
                <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                  {business.services?.map((srv, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedService(srv)}
                      className={`p-3 rounded-xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                        selectedService?.name === srv.name
                          ? 'border-white text-white shadow-xs'
                          : 'bg-[#141414] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: selectedService?.name === srv.name ? `${themeColor}20` : '#141414',
                        borderColor: selectedService?.name === srv.name ? themeColor : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <div>
                        <div className="text-xs font-black text-white">{srv.name}</div>
                        <span className="text-[10px] text-zinc-500">{srv.duration} דקות</span>
                      </div>
                      <span className="text-xs font-black" style={{ color: themeColor }}>{formatPrice(srv.price)}</span>
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
                        className={`shrink-0 w-16 py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'text-black font-black'
                            : 'bg-[#141414] border-white/10 text-zinc-400 hover:text-white'
                        }`}
                        style={{
                          backgroundColor: isSelected ? themeColor : '#141414',
                          borderColor: isSelected ? themeColor : 'rgba(255,255,255,0.1)',
                        }}
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
                  {AVAILABLE_HOURS.map((t) => {
                    const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');
                    const isPast = isToday && t <= format(new Date(), 'HH:mm');

                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={isPast}
                        onClick={() => !isPast && setSelectedTime(t)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          isPast
                            ? 'opacity-25 bg-white/5 border-transparent text-zinc-600 cursor-not-allowed line-through'
                            : selectedTime === t
                            ? 'text-black cursor-pointer shadow-md'
                            : 'bg-[#141414] border-white/10 text-zinc-300 hover:text-white cursor-pointer'
                        }`}
                        style={{
                          backgroundColor: !isPast && selectedTime === t ? themeColor : '#141414',
                          borderColor: !isPast && selectedTime === t ? themeColor : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
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
                    className="w-full bg-[#141414] border border-white/15 focus:border-white rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none"
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
                    className="w-full bg-[#141414] border border-white/15 focus:border-white rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                  <Phone className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl text-[#1C1C1C] font-black text-sm transition-all shadow-xl disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
                style={{ backgroundColor: themeColor }}
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
