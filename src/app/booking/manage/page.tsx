'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Scissors, XCircle, CheckCircle, Phone, ArrowRight, AlertTriangle } from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

function ManageBookingContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id') || 'demo-1';
  const { settings } = useShopStore();

  const [isCancelled, setIsCancelled] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Simulated appointment data
  const appointment = {
    id: appointmentId,
    customerName: 'ישראל ישראלי',
    customerPhone: '052-123-4567',
    service: 'תספורת גברים פרימיום',
    price: 80,
    barber: 'דביר',
    branch: 'סניף אריאל (אוניברסיטה)',
    date: 'יום ראשון, 2 במרץ 2025',
    time: '14:30',
  };

  const handleCancelAppointment = () => {
    setIsCancelled(true);
    setShowConfirmCancel(false);
  };

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] text-white flex items-center justify-center p-4" dir="rtl">
        <div className="bg-[#2A2A2A] border border-[#3D3D3D] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black mb-2">התור בוטל בהצלחה</h1>
          <p className="text-[#9E9891] text-sm mb-6">
            התור שלך לתאריך {appointment.date} בוטל והמשבצת פונתה. נשמח לראותך בפעם הבאה!
          </p>

          <Link
            href="/booking"
            className="btn-shimmer block w-full py-3 px-6 rounded-xl font-bold text-[#1C1C1C] text-sm mb-3"
          >
            קבע תור חדש במועד אחר ←
          </Link>

          <Link
            href="/"
            className="block text-xs text-[#9E9891] hover:text-white transition-colors"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white py-12 px-4" dir="rtl">
      <div className="max-w-md mx-auto">
        {/* Top brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gold hover:opacity-80 transition-opacity mb-3">
            <Scissors className="w-5 h-5 -rotate-45" />
            <span className="font-black tracking-wider text-lg">המספרה של דביר</span>
          </Link>
          <h1 className="text-2xl font-black">ניהול ופרטי התור שלך</h1>
          <p className="text-xs text-[#9E9891] mt-1">בדוק את פרטי התור או בטל במידת הצורך</p>
        </div>

        {/* Appointment Card */}
        <div className="bg-[#2A2A2A] border-2 border-[#3D3D3D] rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#3D3D3D] mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">תור מאושר</span>
            </div>
            <span className="text-xs text-[#9E9891]" dir="ltr">#{appointment.id}</span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-center gap-3">
              <Scissors className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="font-bold text-white">{appointment.service}</span>
              <span className="mr-auto text-xs text-gold font-black bg-gold/10 px-2 py-0.5 rounded-full">
                {formatPrice(appointment.price)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-[#D5CBB8]">{appointment.date}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-white font-bold" dir="ltr">{appointment.time}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-[#D5CBB8]">{appointment.branch}</span>
            </div>
          </div>

          {/* Cancellation Policy Notice */}
          <div className="mt-6 bg-[#1C1C1C] rounded-2xl p-3.5 border border-[#3D3D3D] flex items-start gap-2.5 text-xs text-[#9E9891]">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong>מדיניות ביטולים:</strong> ניתן לבטל או לשנות מועד ללא עלות עד {settings.cancellationNoticeHours || 2} שעות לפני התור.
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-[#3D3D3D] flex flex-col gap-3">
            <a
              href={`https://wa.me/972521234567?text=${encodeURIComponent(`היי דביר, בקשר לתור שלי ב-${appointment.date} ב-${appointment.time}:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              שאל את דביר בוואטסאפ
            </a>

            {!showConfirmCancel ? (
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors"
              >
                בטל תור זה
              </button>
            ) : (
              <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-4 animate-fadeIn">
                <p className="text-xs text-red-200 font-bold mb-3 text-center">
                  בטוח שברצונך לבטל את התור?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmCancel(false)}
                    className="flex-1 py-2 rounded-lg bg-[#3D3D3D] text-xs font-bold hover:bg-[#4D4D4D]"
                  >
                    חזור
                  </button>
                  <button
                    onClick={handleCancelAppointment}
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                  >
                    כן, בטל תור
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#9E9891] hover:text-gold transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ManageBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center text-white">טוען...</div>}>
      <ManageBookingContent />
    </Suspense>
  );
}
