'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/common/ToastProvider';

export function CustomerAppointmentsLookup({
  phone,
  customerName,
  businessName,
}: {
  phone: string;
  customerName: string;
  businessName: string;
}) {
  const { success, error, showConfirm } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomerAppointments() {
      try {
        const res = await fetch(`/api/appointments?phone=${encodeURIComponent(phone)}`);
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.appointments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    findCustomerAppointments();
  }, [phone]);

  const handleCancelAppointment = (aptId: string, aptTime: string) => {
    showConfirm({
      title: 'ביטול תור ופינוי משבצת',
      message: `האם לבטל את התור של ${customerName} בשעה ${aptTime} ולפנות את המשבצת ביומן של ${businessName}?`,
      confirmText: 'בטל תור עכשיו ❌',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/appointments', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: aptId, status: 'cancelled' }),
          });
          if (res.ok) {
            setAppointments((prev) =>
              prev.map((a) => (a.id === aptId ? { ...a, status: 'cancelled' } : a))
            );
            success('התור בוטל בהצלחה! ✓', `המשבצת לשעה ${aptTime} פונתה ביומן`);
          } else {
            error('שגיאה בביטול התור', 'נסה שוב מאוחר יותר');
          }
        } catch {
          error('שגיאת תקשורת בביטול התור');
        }
      },
    });
  };

  const activeAppointments = appointments.filter((a) => a.status !== 'cancelled');

  return (
    <div className="mb-3 p-3 rounded-xl bg-[#171717] border border-[#C9A84C]/25 text-xs text-right font-sans">
      <div className="flex items-center gap-1.5 text-[#C9A84C] font-black mb-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
        <span>איתור תורים אוטומטי למספר {phone}:</span>
      </div>

      {loading ? (
        <span className="text-[11px] text-zinc-500">מחפש תורים רשומים במערכת...</span>
      ) : activeAppointments.length > 0 ? (
        <div className="space-y-2">
          {activeAppointments.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#222222] border border-white/10"
            >
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>
                    📅 תאריך: <strong>{apt.date || 'לא צוין'}</strong>
                  </span>
                  <span>
                    בשעה{' '}
                    <strong className="text-[#C9A84C]" dir="ltr">
                      {apt.time || '16:00'}
                    </strong>
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {apt.serviceName || apt.service || 'תספורת'} · {apt.branchName || 'סניף ראשי'} (
                  {formatPrice(apt.servicePrice || apt.price || 80)})
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCancelAppointment(apt.id, apt.time || '16:00')}
                className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-bold text-[11px] transition-colors self-start sm:self-center cursor-pointer"
              >
                בטל תור זה עכשיו ❌
              </button>
            </div>
          ))}
        </div>
      ) : appointments.length > 0 ? (
        <div className="text-[11px] text-emerald-400 font-bold">
          ✓ נבדק במערכת: כל התורים הקודמים של הלקוח כבר בוטלו / הושלמו (אין תור פעיל כרגע).
        </div>
      ) : (
        <div className="text-[11px] text-zinc-400">
          🔍 לא נמצאו תורים עתידיים רשומים במערכת למספר זה (ייתכן שהתור כבר בוטל או שלא הוזמן).
        </div>
      )}
    </div>
  );
}
