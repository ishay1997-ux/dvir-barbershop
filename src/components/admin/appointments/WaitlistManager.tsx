'use client';

import React from 'react';
import { Bell, MessageCircle, Trash2 } from 'lucide-react';
import { createWaitlistAlertUrl } from '@/lib/whatsapp';
import { useShopStore } from '@/lib/store';
import type { WaitlistEntry } from '@/lib/types';

interface WaitlistManagerProps {
  waitlist: WaitlistEntry[];
  onUpdateStatus: (id: string, status: WaitlistEntry['status']) => void;
  onRemove: (id: string) => void;
}

export const WaitlistManager: React.FC<WaitlistManagerProps> = ({
  waitlist,
  onUpdateStatus,
  onRemove,
}) => {
  const { settings } = useShopStore();
  const waitingCount = waitlist.filter((w) => w.status === 'waiting').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-5 rounded-3xl border border-[#E5DDD0]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1C1C1C]">
              רשימת המתנה חכמה לתורים (Smart Waitlist)
            </h2>
            <p className="text-xs text-[#6B6560]">
              לקוחות שממתינים שיתפנה תור בימים מלאים – שריין להם תור בלחיצת וואטסאפ מהירה
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30">
          {waitingCount} ממתינים כרגע
        </span>
      </div>

      {waitlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5DDD0] p-12 text-center shadow-sm">
          <Bell className="w-12 h-12 text-[#9E9891]/40 mx-auto mb-3" />
          <h3 className="font-bold text-base text-[#1C1C1C]">רשימת ההמתנה ריקה כרגע</h3>
          <p className="text-xs text-[#6B6560] mt-1 max-w-sm mx-auto">
            כאשר לקוחות ייכנסו לאתר בימים מלאים וירשמו להמתנה, הם יופיעו כאן מיידית.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {waitlist.map((item) => {
            const rangeLabel =
              item.preferredTimeRange === 'morning'
                ? 'בוקר (09:00 - 13:00)'
                : item.preferredTimeRange === 'afternoon'
                ? 'צהריים (13:00 - 16:30)'
                : item.preferredTimeRange === 'evening'
                ? 'ערב (16:30 - 20:00)'
                : 'כל שעה שתתפנה';

            const whatsappUrl = createWaitlistAlertUrl({
              customerPhone: item.customerPhone,
              customerName: item.customerName,
              dateStr: item.date,
              timeSlot: rangeLabel,
              serviceName: item.serviceName || 'תספורת גברים',
              businessName: settings.shopName || item.branchName || 'המספרה',
            });

            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border border-[#E5DDD0] shadow-sm hover:border-gold transition-all space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gold/20 text-[#856514] font-black flex items-center justify-center text-sm">
                      {item.customerName.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#1C1C1C]">{item.customerName}</h4>
                      <div className="text-xs text-[#6B6560] font-mono" dir="ltr">
                        {item.customerPhone}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.status === 'waiting'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'notified'
                        ? 'bg-blue-100 text-blue-800'
                        : item.status === 'booked'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {item.status === 'waiting'
                      ? 'ממתין לתור ⏳'
                      : item.status === 'notified'
                      ? 'נשלחה התראה 📲'
                      : item.status === 'booked'
                      ? 'נקבע תור ✓'
                      : 'בוטל'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF7F2] p-3 rounded-2xl border border-[#E5DDD0]">
                  <div>
                    <span className="text-[#9E9891] text-[10px] block">תאריך מבוקש</span>
                    <span className="font-bold text-[#1C1C1C]">{item.date}</span>
                  </div>
                  <div>
                    <span className="text-[#9E9891] text-[10px] block">שעות מועדפות</span>
                    <span className="font-bold text-[#1C1C1C]">{rangeLabel}</span>
                  </div>
                  <div>
                    <span className="text-[#9E9891] text-[10px] block">סניף</span>
                    <span className="font-bold text-[#1C1C1C]">{item.branchName}</span>
                  </div>
                  <div>
                    <span className="text-[#9E9891] text-[10px] block">שירות</span>
                    <span className="font-bold text-[#1C1C1C]">{item.serviceName || 'תספורת גברים'}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-[11px] text-[#6B6560] bg-zinc-50 p-2 rounded-xl">
                    💬 {item.notes}
                  </p>
                )}

                <div className="pt-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onUpdateStatus(item.id, 'notified')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>שלח התראה בוואטסאפ</span>
                    </a>

                    <button
                      onClick={() => onUpdateStatus(item.id, 'booked')}
                      className="px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-gold/20 border border-[#E5DDD0] text-xs font-bold text-[#1C1C1C] transition-all"
                    >
                      סמן כנקבע ✓
                    </button>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                    title="מחק מרשימת המתנה"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
