'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, MessageCircle, Download } from 'lucide-react';
import { createAppointmentConfirmationUrl } from '@/lib/whatsapp';
import type { BusinessConfig } from '@/types/business';

interface BookingConfirmationCardProps {
  slug: string;
  business: BusinessConfig;
  bookedAppointment: {
    customerName: string;
    customerPhone: string;
    service: string;
    date: string;
    time: string;
    branchName: string;
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
  return (
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
          <strong className="text-white" dir="ltr">
            {bookedAppointment.date} | {bookedAppointment.time}
          </strong>
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
          onClick={onDownloadIcs}
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
  );
};
