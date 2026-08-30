'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { useToast } from '@/components/common/ToastProvider';
import { getBusinessBySlug } from '@/lib/business-service';
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
  const slug = resolvedParams.slug.toLowerCase().trim();
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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      error('נא למלא שם ומספר טלפון');
      return;
    }
    if (selectedService?.locationType === 'CLIENT_ADDRESS' && !customerAddress.trim()) {
      error('שירות זה מתבצע בבית הלקוח – נא להזין כתובת להגעת הטכנאי/נותן השירות');
      return;
    }

    setIsSubmitting(true);
    try {
      const apptData = {
        customerName,
        customerPhone,
        customerAddress: customerAddress || undefined,
        service: selectedService?.name || 'תספורת',
        price: selectedService?.price || 80,
        date: selectedDate,
        time: selectedTime,
        branchName: selectedBranch || business?.city || 'סניף ראשי',
        businessSlug: slug,
        businessName: business?.name || 'The Cut',
        status: 'confirmed',
        locationType: selectedService?.locationType || 'BUSINESS_LOCATION',
        bookingType: selectedService?.bookingType || 'FIXED_SLOT',
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
    } catch {
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
          <p className="text-sm font-bold text-zinc-400 mb-4">עסק לא נמצא</p>
          <Link
            href="/"
            className="px-4 py-2 text-black font-bold rounded-xl text-xs cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
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
            <ArrowRight className="w-4 h-4" /> חזרה לדף העסק
          </Link>
          <span className="text-xs font-bold" style={{ color: themeColor }}>
            {business.name}
          </span>
        </div>

        {/* Card */}
        <div
          className="bg-[#1C1C1C] border rounded-3xl p-6 sm:p-8 shadow-2xl"
          style={{ borderColor: `${themeColor}40` }}
        >
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
            <p className="text-xs text-[#9E9891] mt-0.5">
              {business.name} · {business.city}
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
            <div className="space-y-5">
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
                selectedService={selectedService}
                themeColor={themeColor}
                isSubmitting={isSubmitting}
                onChangeName={setCustomerName}
                onChangePhone={setCustomerPhone}
                onChangeAddress={setCustomerAddress}
                onSubmit={handleBookingSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
