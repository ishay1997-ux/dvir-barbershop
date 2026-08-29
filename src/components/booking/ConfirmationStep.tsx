'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  Home,
  Download,
  Share2,
  CalendarPlus,
  MapPin,
  Navigation,
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { formatPrice, SHOP_INFO } from '@/lib/utils';
import {
  generateGoogleCalendarUrl,
  downloadIcsFile,
  generateWhatsAppConfirmationUrl,
} from '@/lib/calendar';
import type { BookingState } from '@/lib/types';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function ConfirmationStep({ booking }: { booking: BookingState }) {
  const { selectedBranch, selectedService, selectedBarber, selectedDate, selectedTime, customerName, customerPhone } = booking;
  const googleCalendarUrl = generateGoogleCalendarUrl(booking);
  const whatsappUrl = generateWhatsAppConfirmationUrl(booking);

  return (
    <div className="text-center">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-gold"
      >
        <CheckCircle className="w-10 h-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-black text-[#1C1C1C] mb-1">הזמנה התקבלה! 🎉</h2>
        <p className="text-[#6B6560] text-sm mb-6">
          {customerName}, פרטי ההזמנה נשמרו בהצלחה במספרה של דביר
        </p>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-2xl border border-[#E5DDD0] p-5 text-right shadow-sm mb-5">
          <h3 className="text-sm font-bold text-gold mb-4 tracking-widest uppercase">פרטי ההזמנה</h3>

          <div className="flex flex-col gap-3">
            {selectedBranch && (
              <div className="flex items-start justify-between gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DDD0]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-[#9E9891]">מיקום / סניף</div>
                    <div className="font-bold text-[#1C1C1C] text-sm">{selectedBranch.name}</div>
                    <div className="text-xs text-[#6B6560]">{selectedBranch.address}</div>
                  </div>
                </div>
                <a
                  href={selectedBranch.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 px-2.5 rounded-lg transition-colors flex-shrink-0"
                >
                  <Navigation className="w-3 h-3" />
                  Waze
                </a>
              </div>
            )}

            {selectedService && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-4 h-4 text-gold -rotate-45" />
                </div>
                <div>
                  <div className="text-xs text-[#9E9891]">שירות</div>
                  <div className="font-bold text-[#1C1C1C] text-sm">
                    {selectedService.name} – {formatPrice(selectedService.price)}
                  </div>
                </div>
              </div>
            )}

            {selectedBarber && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="text-xs text-[#9E9891]">ספר</div>
                  <div className="font-bold text-[#1C1C1C] text-sm">{selectedBarber.name}</div>
                </div>
              </div>
            )}

            {selectedDate && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="text-xs text-[#9E9891]">תאריך</div>
                  <div className="font-bold text-[#1C1C1C] text-sm">
                    {format(selectedDate, 'EEEE, d בMMM yyyy', { locale: he })}
                  </div>
                </div>
              </div>
            )}

            {selectedTime && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="text-xs text-[#9E9891]">שעה</div>
                  <div className="font-bold text-[#1C1C1C] text-sm">{selectedTime}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-gold" />
              </div>
              <div>
                <div className="text-xs text-[#9E9891]">טלפון</div>
                <div className="font-bold text-[#1C1C1C] text-sm" dir="ltr">{customerPhone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Arrival Guidelines Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-right">
          {/* Payment Card */}
          <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-4">
            <div className="text-xs font-bold text-[#1C1C1C] mb-2 flex items-center gap-1.5">
              <span className="text-base">💳</span>
              אמצעי תשלום מקובלים:
            </div>
            <p className="text-xs text-[#6B6560] leading-relaxed">
              מזומן, <strong>Bit</strong> או <strong>PayBox</strong>
              <br />
              העברה למספר: <strong className="text-[#1C1C1C]" dir="ltr">052-123-4567</strong>
            </p>
          </div>

          {/* Pre-Arrival Instructions */}
          <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-4">
            <div className="text-xs font-bold text-[#1C1C1C] mb-2 flex items-center gap-1.5">
              <span className="text-base">✂️</span>
              הנחיות לפני הגעה:
            </div>
            <p className="text-xs text-[#6B6560] leading-relaxed">
              • נא להגיע עם שיער נקי וללא חומרים
              <br />
              • הגעה בזמן (איחור של מעל 10 דק׳ מבטל את התור)
            </p>
          </div>
        </div>

        {/* Add to Calendar & WhatsApp Action Grid */}
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-4 mb-6 text-right">
          <div className="text-xs font-bold text-[#1C1C1C] mb-3 flex items-center gap-1.5">
            <CalendarPlus className="w-4 h-4 text-gold" />
            שמור את התור ומנע אי-הגעה:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Google Calendar */}
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#E5DDD0] text-[#1C1C1C] hover:border-gold hover:text-gold text-xs font-bold transition-all shadow-sm active:scale-95"
              id="add-to-gcal-btn"
            >
              <Calendar className="w-4 h-4 text-blue-500" />
              הוסף ל-Google Calendar
            </a>

            {/* Apple / Outlook iCal */}
            <button
              onClick={() => downloadIcsFile(booking)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#E5DDD0] text-[#1C1C1C] hover:border-gold hover:text-gold text-xs font-bold transition-all shadow-sm active:scale-95"
              id="download-ical-btn"
            >
              <Download className="w-4 h-4 text-purple-500" />
              הורד ל-Apple / Outlook (.ics)
            </button>
          </div>

          {/* WhatsApp Direct Confirmation */}
          <div className="mt-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              id="whatsapp-confirm-btn"
            >
              <WhatsAppIcon className="w-4 h-4" />
              שלח הודעת אישור למספרה ב-WhatsApp
            </a>
          </div>
        </div>

        {/* Manage / Cancel link */}
        <div className="mb-6 text-center">
          <Link
            href="/booking/manage?id=dvir-demo"
            className="text-xs text-[#9E9891] hover:text-gold underline transition-colors"
          >
            צריך לבטל או לשנות מועד? לחץ כאן לניהול התור
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${SHOP_INFO.phone}`}
            className="flex-1 py-3 px-5 rounded-xl border-2 border-[#E5DDD0] text-[#3D3D3D] font-medium text-sm hover:border-gold hover:text-gold active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            התקשר למספרה
          </a>
          <Link
            href="/"
            className="flex-1 btn-shimmer py-3 px-5 rounded-xl text-[#1C1C1C] font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform"
            id="confirmation-home-button"
          >
            <Home className="w-4 h-4" />
            חזרה לדף הבית
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

