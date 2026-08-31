'use client';

import React, { useState } from 'react';
import { User, Phone, MapPin, Wrench, AlertCircle, FileText, Sparkles, Building } from 'lucide-react';
import type { BusinessService } from '@/types/business';

interface BookingCustomerFormProps {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  faultDescription?: string;
  urgency?: 'normal' | 'urgent';
  selectedService: BusinessService | null;
  themeColor: string;
  isSubmitting: boolean;
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
  onChangeAddress: (address: string) => void;
  onChangeFaultDescription?: (fault: string) => void;
  onChangeUrgency?: (urgency: 'normal' | 'urgent') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingCustomerForm: React.FC<BookingCustomerFormProps> = ({
  customerName,
  customerPhone,
  customerAddress,
  faultDescription = '',
  urgency = 'normal',
  selectedService,
  themeColor,
  isSubmitting,
  onChangeName,
  onChangePhone,
  onChangeAddress,
  onChangeFaultDescription,
  onChangeUrgency,
  onSubmit,
}) => {
  const isHomeService = selectedService?.locationType === 'CLIENT_ADDRESS';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-3 pt-3 border-t border-white/10">
        <label className="block text-xs font-bold text-zinc-300">
          4. פרטים אישיים ופרטי {isHomeService ? 'קריאת השירות' : 'ההזמנה'}:
        </label>

        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            value={customerName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="שם מלא *"
            required
            className="w-full bg-[#141414] border border-white/15 focus:border-white rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
          />
          <User className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* WhatsApp Phone */}
        <div className="relative">
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="מספר טלפון לקבלת אישור בוואטסאפ *"
            required
            className="w-full bg-[#141414] border border-white/15 focus:border-white rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
          />
          <Phone className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Home Technician / On-Site Client Address */}
        {isHomeService && (
          <div className="space-y-2.5 p-3 rounded-2xl bg-zinc-900/90 border border-amber-500/30 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>כתובת מדויקת להגעת איש המקצוע:</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => onChangeAddress(e.target.value)}
                placeholder="עיר, רחוב, מספר בית, קומה, דירה, קוד כניסה *"
                required
                className="w-full bg-[#141414] border border-white/15 focus:border-amber-400 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-400 outline-none shadow-xs"
              />
              <Building className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Fault description */}
            <div className="relative">
              <textarea
                value={faultDescription}
                onChange={(e) => onChangeFaultDescription?.(e.target.value)}
                placeholder="תיאור התקלה או מהות השירות המבוקש (למשל: מזגן מרעיש ולא מקרר / קצר בלוח חשמל)"
                rows={2}
                className="w-full bg-[#141414] border border-white/15 focus:border-amber-400 rounded-xl py-2 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none resize-none"
              />
              <Wrench className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
            </div>

            {/* Urgency Picker */}
            {onChangeUrgency && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-zinc-400">רמת דחיפות:</span>
                <button
                  type="button"
                  onClick={() => onChangeUrgency('normal')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    urgency === 'normal'
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-[#141414] text-zinc-400 border border-transparent'
                  }`}
                >
                  רגיל (במועד שתואם)
                </button>
                <button
                  type="button"
                  onClick={() => onChangeUrgency('urgent')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    urgency === 'urgent'
                      ? 'bg-rose-600 text-white border border-rose-400 shadow-sm shadow-rose-600/30 font-black'
                      : 'bg-[#141414] text-rose-400 border border-rose-900/40'
                  }`}
                >
                  ⚡ דחוף SOS (הקדם בהקדם)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-2xl text-[#1C1C1C] font-black text-sm transition-all shadow-xl disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-98"
        style={{ backgroundColor: themeColor }}
      >
        {isSubmitting
          ? 'שומר נתונים...'
          : isHomeService
          ? 'הזמן קריאת שירות לביתך ✓'
          : 'אשר וקבע תור עכשיו ✓'}
      </button>
    </form>
  );
};
