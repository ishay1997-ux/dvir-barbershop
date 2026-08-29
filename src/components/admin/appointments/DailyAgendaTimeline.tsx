'use client';

import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar, Scissors, Phone } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { AdminAppointment } from './types';

interface DailyAgendaTimelineProps {
  currentDate: Date;
  dayAppointments: AdminAppointment[];
  onOpenFormula: (appointment: AdminAppointment) => void;
  onStatusChange: (id: string, newStatus: AdminAppointment['status']) => void;
}

export const DailyAgendaTimeline: React.FC<DailyAgendaTimelineProps> = ({
  currentDate,
  dayAppointments,
  onOpenFormula,
  onStatusChange,
}) => {
  const totalRevenue = dayAppointments.reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] shadow-sm p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1] mb-6">
        <h2 className="font-black text-lg text-[#1C1C1C]">
          לוח תורים ל{format(currentDate, 'EEEE, d בMMMM', { locale: he })}
        </h2>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {dayAppointments.length} תורים סה״כ · {formatPrice(totalRevenue)}
        </span>
      </div>

      {dayAppointments.length === 0 ? (
        <div className="text-center py-12 text-[#9E9891]">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-gold" />
          <p className="text-base font-bold text-[#1C1C1C]">אין תורים מתוזמנים ליום זה</p>
          <p className="text-xs mt-1">כל השעות פנויות להזמנה</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayAppointments.map((app) => {
            const cleanPhone = app.phone.replace(/\D/g, '').replace(/^0/, '972');
            const whatsappMsg = `היי ${app.customerName}, מדבר דביר מהמספרה. מזכיר לך את התור שלך ב-${app.time}:`;
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

            return (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[#E5DDD0] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl bg-[#1C1C1C] text-gold font-black text-sm flex items-center justify-center shadow-sm"
                    dir="ltr"
                  >
                    {app.time}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-[#1C1C1C]">{app.customerName}</h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-[#1C1C1C] border border-gold/30">
                        {app.service}
                      </span>
                      <span className="text-[10px] text-[#6B6560] bg-white px-2 py-0.5 rounded-full border">
                        {app.branchName}
                      </span>
                    </div>
                    <div className="text-xs text-[#6B6560] mt-1 flex items-center gap-3">
                      <span dir="ltr">{app.phone}</span>
                      <span>•</span>
                      <span className="font-bold text-[#1C1C1C]">{formatPrice(app.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Status, Formula & WhatsApp Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onOpenFormula(app)}
                    className="px-2.5 py-2 bg-gold/15 hover:bg-gold/25 text-[#856514] font-bold text-xs rounded-xl border border-gold/30 flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                    title="נוסחת תספורת והעדפות לקוח"
                  >
                    <Scissors className="w-3.5 h-3.5 -rotate-45" />
                    <span className="hidden sm:inline">נוסחה</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                    title="שלח WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <select
                    value={app.status}
                    onChange={(e) => onStatusChange(app.id, e.target.value as AdminAppointment['status'])}
                    className="px-3 py-2 border rounded-xl text-xs font-bold outline-none bg-white focus:border-gold"
                  >
                    <option value="confirmed">מאושר ✓</option>
                    <option value="completed">בוצע ושולם ✓</option>
                    <option value="pending">ממתין לאישור</option>
                    <option value="cancelled">בוטל ✗</option>
                    <option value="no_show">לא הגיע (No-Show)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
