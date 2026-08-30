'use client';

import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Bell, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WaitlistRange = 'morning' | 'afternoon' | 'evening' | 'any';

interface BookingWaitlistModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  waitlistName: string;
  waitlistPhone: string;
  waitlistRange: WaitlistRange;
  waitlistSuccess: boolean;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onRangeChange: (range: WaitlistRange) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TIME_RANGES: { id: WaitlistRange; label: string }[] = [
  { id: 'any', label: 'כל שעה שתתפנה' },
  { id: 'morning', label: 'בוקר (09:00 - 12:00)' },
  { id: 'afternoon', label: 'צהריים (12:00 - 16:30)' },
  { id: 'evening', label: 'ערב (16:30 - 20:00)' },
];

export const BookingWaitlistModal: React.FC<BookingWaitlistModalProps> = ({
  isOpen,
  selectedDate,
  waitlistName,
  waitlistPhone,
  waitlistRange,
  waitlistSuccess,
  onClose,
  onNameChange,
  onPhoneChange,
  onRangeChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E5DDD0] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold/20 text-[#856514] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#1C1C1C]">רשימת המתנה חכמה לתור</h3>
              <p className="text-[11px] text-[#6B6560]">
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy (EEEE)', { locale: he }) : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs font-bold text-[#6B6560] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {waitlistSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-black text-base text-[#1C1C1C]">נוספת לרשימת ההמתנה בהצלחה!</h4>
            <p className="text-xs text-[#6B6560]">
              ברגע שיתפנה תור לתאריך זה, תקבל התראה אישית ישירות ל-WhatsApp.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">שם מלא</label>
              <input
                type="text"
                required
                placeholder="ישראל ישראלי"
                value={waitlistName}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                מספר טלפון לקבלת וואטסאפ
              </label>
              <input
                type="tel"
                required
                placeholder="050-1234567"
                value={waitlistPhone}
                onChange={(e) => onPhoneChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                טווח שעות מועדף עליך
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_RANGES.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => onRangeChange(opt.id)}
                    className={cn(
                      'p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer',
                      waitlistRange === opt.id
                        ? 'bg-[#1C1C1C] text-gold border-gold'
                        : 'bg-white text-[#6B6560] border-[#E5DDD0] hover:border-gold/50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white border border-[#E5DDD0] text-xs font-bold text-[#6B6560] cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gold text-[#1C1C1C] text-xs font-black hover:bg-[#DFCA85] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>שמור אותי ברשימה</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
