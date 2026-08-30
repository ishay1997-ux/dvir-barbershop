'use client';

import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import type { BusinessService } from '@/types/business';

interface BookingCustomerFormProps {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  selectedService: BusinessService | null;
  themeColor: string;
  isSubmitting: boolean;
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
  onChangeAddress: (address: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingCustomerForm: React.FC<BookingCustomerFormProps> = ({
  customerName,
  customerPhone,
  customerAddress,
  selectedService,
  themeColor,
  isSubmitting,
  onChangeName,
  onChangePhone,
  onChangeAddress,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* 4. Customer Details */}
      <div className="space-y-2.5 pt-2 border-t border-white/10">
        <label className="block text-xs font-bold text-zinc-300">4. פרטים אישיים:</label>
        <div className="relative">
          <input
            type="text"
            value={customerName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="שם מלא *"
            required
            className="w-full bg-[#141414] border border-white/15 focus:border-white rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none"
          />
          <User className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="relative">
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="מספר טלפון לקבלת אישור בוואטסאפ *"
            required
            className="w-full bg-[#141414] border border-white/15 focus:border-white rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-500 outline-none"
          />
          <Phone className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {selectedService?.locationType === 'CLIENT_ADDRESS' && (
          <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => onChangeAddress(e.target.value)}
              placeholder="כתובת להגעת איש השירות (עיר, רחוב, מספר בית) *"
              required
              className="w-full bg-[#141414] border border-amber-500/40 focus:border-amber-400 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-zinc-400 outline-none shadow-xs"
            />
            <MapPin className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-2xl text-[#1C1C1C] font-black text-sm transition-all shadow-xl disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
        style={{ backgroundColor: themeColor }}
      >
        {isSubmitting ? 'קובע תור...' : 'אשר וקבע תור עכשיו ✓'}
      </button>
    </form>
  );
};
