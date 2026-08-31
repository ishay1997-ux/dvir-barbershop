'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, MessageCircle, Download, MapPin, Home, ArrowLeft } from 'lucide-react';
import { createAppointmentConfirmationUrl } from '@/lib/whatsapp';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import type { BusinessConfig } from '@/types/business';

interface BookingConfirmationCardProps {
  slug: string;
  business: BusinessConfig;
  bookedAppointment: {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    faultDescription?: string;
    service: string;
    date: string;
    time: string;
    branchName: string;
    locationType?: string;
  };
  themeColor: string;
  onDownloadIcs: () => void;
}

export const BookingConfirmationCard: React.FC<BookingConfirmationCardProps> = ({
  slug,
  business,
  bookedAppointment,
  themeColor,
  onDownloadIcs,
}) => {
  const terminology = getIndustryTerminology(business);
  const isHomeService =
    business.category === 'home_technician' ||
    bookedAppointment.locationType === 'CLIENT_ADDRESS' ||
    !!bookedAppointment.customerAddress;

  const headerTitle = isHomeService
    ? 'קריאת השירות נרשמה בהצלחה! 🔧'
    : 'התור שלך נקבע בהצלחה! 🎉';

  const subHeader = isHomeService
    ? `איש מקצוע מוסמך מטעם ${business.name} יגיע במועד שתואם`
    : `הזמנתך עודכנה ביומן של ${business.name}`;

  return (
    <div className="text-center py-4 space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
        <CheckCircle className="w-9 h-9" />
      </div>
      <div>
        <h2 className="text-lg font-black text-emerald-400">{headerTitle}</h2>
        <p className="text-xs text-zinc-400 mt-0.5">{subHeader}</p>
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 text-xs text-right space-y-2.5 shadow-inner">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">{terminology.clientTitle || 'לקוח'}:</span>
          <strong className="text-white font-bold">{bookedAppointment.customerName}</strong>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-400">{terminology.serviceTitle || 'שירות'}:</span>
          <strong style={{ color: themeColor }}>{bookedAppointment.service}</strong>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-400">מועד {isHomeService ? 'הגעה' : 'התור'}:</span>
          <strong className="text-white font-mono" dir="ltr">
            {bookedAppointment.date} | {bookedAppointment.time}
          </strong>
        </div>

        {isHomeService && bookedAppointment.customerAddress ? (
          <div className="flex justify-between items-start pt-1 border-t border-white/5">
            <span className="text-zinc-400 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>כתובת להגעה:</span>
            </span>
            <strong className="text-amber-300 font-bold max-w-[200px] text-left">
              {bookedAppointment.customerAddress}
            </strong>
          </div>
        ) : (
          <div className="flex justify-between items-center pt-1 border-t border-white/5">
            <span className="text-zinc-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>מיקום:</span>
            </span>
            <strong className="text-white">{bookedAppointment.branchName}</strong>
          </div>
        )}

        {bookedAppointment.faultDescription && (
          <div className="pt-1.5 border-t border-white/5 text-[11px] text-zinc-400">
            <span className="font-bold text-zinc-300 block mb-0.5">מהות הפנייה:</span>
            <p className="bg-white/5 p-2 rounded-lg text-zinc-300 leading-relaxed">
              {bookedAppointment.faultDescription}
            </p>
          </div>
        )}
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
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-md shadow-emerald-600/20"
        >
          <MessageCircle className="w-4 h-4" /> שלח אישור ישיר בוואטסאפ
        </a>

        <button
          type="button"
          onClick={onDownloadIcs}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-zinc-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" /> שמור תזכורת ביומן (Apple / Google)
        </button>

        <Link
          href={`/${slug}`}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-400 font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>חזרה לדף הבית של {business.name}</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
