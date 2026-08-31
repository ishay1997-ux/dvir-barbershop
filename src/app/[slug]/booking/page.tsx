'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Sparkles, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { useToast } from '@/components/common/ToastProvider';
import { getBusinessBySlug } from '@/lib/business-service';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import type { BusinessConfig, BusinessService } from '@/types/business';
import { getAvailableSlots, getAvailableTimeWindows } from '@/lib/slot-engine';
import { BookingConfirmationCard } from '@/components/booking/wizard/BookingConfirmationCard';
import { BookingServicePicker } from '@/components/booking/wizard/BookingServicePicker';
import { BookingSlotPicker } from '@/components/booking/wizard/BookingSlotPicker';
import { BookingCustomerForm } from '@/components/booking/wizard/BookingCustomerForm';

export default function DynamicBusinessBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  let rawSlug = resolvedParams.slug || '';
  let slug = rawSlug.toLowerCase().trim();
  try {
    slug = decodeURIComponent(rawSlug).toLowerCase().trim();
  } catch {}
  const searchParams = useSearchParams();
  const preSelectedServiceName = searchParams.get('service');
  const { success, error } = useToast();

  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedService, setSelectedService] = useState<BusinessService | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(startOfToday(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [faultDescription, setFaultDescription] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  const dynamicSlots = useMemo(() => {
    return getAvailableSlots({
      date: selectedDate,
      workingHours: { open: '09:00', close: '20:00', closed: false },
      serviceDurationMinutes: selectedService?.duration || 30,
      bufferMinutes: selectedService?.bufferAfterMinutes || 0,
      filterPastIfToday: true,
    });
  }, [selectedDate, selectedService]);

  const timeWindows = useMemo(() => {
    return getAvailableTimeWindows({
      date: selectedDate,
      workingHours: { open: '08:30', close: '20:00', closed: false },
      filterPastIfToday: true,
    });
  }, [selectedDate]);

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
  const terminology = getIndustryTerminology(business || undefined);
  const isHomeService =
    business?.category === 'home_technician' ||
    selectedService?.locationType === 'CLIENT_ADDRESS';

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      error('נא למלא שם ומספר טלפון לקבלת אישור');
      return;
    }
    if (isHomeService && !customerAddress.trim()) {
      error('שירות זה מתבצע בבית הלקוח – נא להזין כתובת מלאה להגעת איש המקצוע');
      return;
    }

    setIsSubmitting(true);
    try {
      const apptData = {
        customerName,
        customerPhone,
        customerAddress: customerAddress || undefined,
        faultDescription: faultDescription || undefined,
        urgency: isHomeService ? urgency : undefined,
        service: selectedService?.name || terminology.serviceTitle || 'שירות',
        price: selectedService?.price || 80,
        date: selectedDate,
        time: selectedTime,
        branchName: selectedBranch || business?.city || 'סניף מרכזי',
        businessSlug: slug,
        businessName: business?.name || 'The Cut',
        status: 'confirmed',
        locationType: selectedService?.locationType || (isHomeService ? 'CLIENT_ADDRESS' : 'BUSINESS_LOCATION'),
        bookingType: selectedService?.bookingType || (isHomeService ? 'TIME_WINDOW' : 'FIXED_SLOT'),
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apptData),
      });

      if (res.ok) {
        setBookedAppointment(apptData);
        setIsConfirmed(true);
        success(
          isHomeService ? 'קריאת השירות נרשמה בהצלחה! 🔧' : 'התור נקבע בהצלחה! 🎉',
          `נקבע ל-${selectedService?.name || 'טיפול'} (${selectedTime})`
        );
      } else {
        error('שגיאה בשמירת התור', 'נסה שוב בעוד מספר רגעים');
      }
    } catch {
      error('שגיאת תקשורת', 'בדוק את החיבור לרשת');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!bookedAppointment) return;
    const locationStr = bookedAppointment.customerAddress || `${bookedAppointment.branchName}, ${business?.city || ''}`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CutWeb//Industry Booking System//HE',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${bookedAppointment.service} - ${business?.name}`,
      `DESCRIPTION:הזמנה עבור ${bookedAppointment.customerName}. טלפון לבירורים: ${business?.phone}`,
      `LOCATION:${locationStr}`,
      `DTSTART:${bookedAppointment.date.replace(/-/g, '')}T${bookedAppointment.time.replace(/[^0-9]/g, '').slice(0, 4) || '1000'}00`,
      `DTEND:${bookedAppointment.date.replace(/-/g, '')}T${bookedAppointment.time.replace(/[^0-9]/g, '').slice(0, 4) || '1100'}00`,
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
        <div
          className="w-10 h-10 border-3 border-t-white rounded-full animate-spin mb-2"
          style={{ borderColor: `${themeColor}40`, borderTopColor: themeColor }}
        />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-400 mb-4">בית העסק אינו קיים במערכת</p>
          <Link
            href="/"
            className="px-5 py-2.5 text-black font-black rounded-xl text-xs cursor-pointer shadow-lg inline-flex items-center gap-1.5"
            style={{ backgroundColor: themeColor }}
          >
            חזרה לדף הראשי של CutWeb
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#111216] text-white font-sans selection:bg-[#C9A84C] selection:text-black py-8 px-4"
      dir="rtl"
    >
      <div className="max-w-lg mx-auto">
        {/* Top bar back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> חזרה לדף העסק של {business.name}
          </Link>
          <span className="text-xs font-black flex items-center gap-1.5" style={{ color: themeColor }}>
            <span>{terminology.icon}</span>
            <span>{business.name}</span>
          </span>
        </div>

        {/* Card */}
        <div
          className="bg-[#181920] border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          style={{ borderColor: `${themeColor}35` }}
        >
          {/* Top Decorative Glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-15"
            style={{ backgroundColor: themeColor }}
          />

          <div className="text-center mb-6 relative z-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 border font-black text-xl shadow-lg"
              style={{
                backgroundColor: `${themeColor}20`,
                borderColor: `${themeColor}50`,
                color: themeColor,
              }}
            >
              {business.logoUrl || business.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={business.logoUrl || business.avatarUrl}
                  alt={business.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span>{terminology.icon}</span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isHomeService ? 'הזמנת קריאת שירות אונליין' : `זימון תור ל-${business.name}`}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 flex items-center justify-center gap-2">
              <span>{business.name}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-zinc-500" />
                {business.city || 'ישראל'}
              </span>
            </p>
          </div>

          {isConfirmed && bookedAppointment ? (
            <BookingConfirmationCard
              slug={slug}
              business={business}
              bookedAppointment={bookedAppointment}
              themeColor={themeColor}
              onDownloadIcs={handleDownloadIcs}
            />
          ) : (
            <div className="space-y-5 relative z-10">
              <BookingServicePicker
                business={business}
                selectedBranch={selectedBranch}
                selectedService={selectedService}
                themeColor={themeColor}
                onSelectBranch={setSelectedBranch}
                onSelectService={setSelectedService}
              />

              <BookingSlotPicker
                next7Days={next7Days}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedService={selectedService}
                themeColor={themeColor}
                dynamicSlots={dynamicSlots}
                timeWindows={timeWindows}
                onSelectDate={setSelectedDate}
                onSelectTime={setSelectedTime}
              />

              <BookingCustomerForm
                customerName={customerName}
                customerPhone={customerPhone}
                customerAddress={customerAddress}
                faultDescription={faultDescription}
                urgency={urgency}
                selectedService={selectedService}
                themeColor={themeColor}
                isSubmitting={isSubmitting}
                onChangeName={setCustomerName}
                onChangePhone={setCustomerPhone}
                onChangeAddress={setCustomerAddress}
                onChangeFaultDescription={setFaultDescription}
                onChangeUrgency={setUrgency}
                onSubmit={handleBookingSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
