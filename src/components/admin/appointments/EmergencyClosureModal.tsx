'use client';

import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { AlertTriangle, MessageCircle } from 'lucide-react';
import { createEmergencyRescheduleUrl } from '@/lib/whatsapp';
import { useShopStore } from '@/lib/store';
import type { AdminAppointment } from './types';

interface EmergencyClosureModalProps {
  isOpen: boolean;
  currentDate: Date;
  emergencyReason: string;
  dayAppointments: AdminAppointment[];
  onChangeReason: (reason: string) => void;
  onExecute: () => void;
  onClose: () => void;
}

export const EmergencyClosureModal: React.FC<EmergencyClosureModalProps> = ({
  isOpen,
  currentDate,
  emergencyReason,
  dayAppointments,
  onChangeReason,
  onExecute,
  onClose,
}) => {
  const { settings } = useShopStore();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#FAF7F2] border border-red-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E5DDD0] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-red-700">סגירת חירום / מילואים להיום</h3>
              <p className="text-xs text-[#6B6560]">
                {format(currentDate, 'EEEE, d בMMMM yyyy', { locale: he })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs font-bold text-[#6B6560]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              סיבת הסגירה (תוצג ללקוחות)
            </label>
            <input
              type="text"
              value={emergencyReason}
              onChange={(e) => onChangeReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C]"
            />
          </div>

          <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs text-red-800">
            ⚠️ סגירת היום תחסום את כל השעות ביומן ותאפשר לשלוח בוואטסאפ הודעת התנצלות + קישור לקביעת תור חלופי ל-
            <strong> {dayAppointments.length} </strong>
            לקוחות שקבעו להיום.
          </div>

          {dayAppointments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#1C1C1C] mb-2">
                לקוחות שקבעו להיום ({dayAppointments.length}):
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {dayAppointments.map((app) => {
                  const url = createEmergencyRescheduleUrl({
                    customerPhone: app.phone,
                    customerName: app.customerName,
                    dateStr: 'היום',
                    time: app.time,
                    businessName: settings.shopName || 'המספרה',
                    reason: emergencyReason,
                  });

                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-2 bg-white rounded-xl border text-xs"
                    >
                      <div className="font-bold text-[#1C1C1C]">
                        {app.time} - {app.customerName}
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>שלח הודעה</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#E5DDD0] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#E5DDD0] text-xs font-bold text-[#6B6560]"
          >
            ביטול
          </button>
          <button
            onClick={() => {
              onExecute();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>חסום יום זה עכשיו</span>
          </button>
        </div>
      </div>
    </div>
  );
};
