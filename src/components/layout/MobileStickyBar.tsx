'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MessageCircle, Phone, Navigation, Sparkles } from 'lucide-react';
import { BusinessConfig } from '@/types/business';

interface MobileStickyBarProps {
  business?: Partial<BusinessConfig>;
}

export default function MobileStickyBar({ business }: MobileStickyBarProps) {
  const slug = business?.slug || 'dvir';
  const themeColor = business?.themeColor || '#C9A84C';
  const cleanPhone = (business?.phone || '052-1234567').replace(/\D/g, '').replace(/^0/, '972');
  const bookingUrl = `/${slug}/booking`;
  const wazeUrl = business?.branches?.[0]?.wazeUrl || (business?.branches?.[0] as any)?.wazeLink || business?.wazeUrl || `https://waze.com/ul?q=${encodeURIComponent(business?.address || business?.city || 'ישראל')}`;
  const stickyStyle = business?.layout?.mobileStickyStyle || 'dual-action';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0D0E12]/95 border-t border-white/10 p-2.5 backdrop-blur-xl shadow-2xl" dir="rtl">
      {stickyStyle === 'triple-action' ? (
        <div className="flex items-center gap-2">
          {/* Main Booking Button */}
          <Link
            href={bookingUrl}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-xs text-white shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            style={{ backgroundColor: themeColor === '#C9A84C' ? '#10B981' : themeColor }}
          >
            <Calendar className="w-4 h-4" />
            <span>קבע תור</span>
          </Link>

          {/* Call Button */}
          <a
            href={`tel:${business?.phone || '052-1234567'}`}
            className="py-3 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/10 active:scale-95 transition-all"
            title="חייג עכשיו"
          >
            <Phone className="w-4 h-4 text-sky-400" />
            <span className="text-[11px]">חייג</span>
          </a>

          {/* Waze Button */}
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/10 active:scale-95 transition-all"
            title="נווט ב-Waze"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px]">Waze</span>
          </a>
        </div>
      ) : stickyStyle === 'minimal-pill' ? (
        <div className="flex justify-center">
          <Link
            href={bookingUrl}
            className="w-full py-3.5 px-6 rounded-full font-black text-xs text-white shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
            style={{ backgroundColor: themeColor }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide">קביעת תור מהירה אונליין ←</span>
          </Link>
        </div>
      ) : (
        /* Default: Dual Action (Book + WhatsApp) */
        <div className="flex items-center gap-2">
          <Link
            href={bookingUrl}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-xs text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ backgroundColor: themeColor === '#C9A84C' ? '#10B981' : themeColor }}
          >
            <Calendar className="w-4 h-4" />
            <span>קביעת תור מהירה</span>
          </Link>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('היי, אשמח לקבל פרטים לגבי תור')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>וואטסאפ</span>
          </a>
        </div>
      )}
    </div>
  );
}
