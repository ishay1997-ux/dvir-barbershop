'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CreditCard, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BusinessConfig } from '@/types/business';

export default function BookingPoliciesSection({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const themeColor = business?.themeColor || '#C9A84C';
  const policies = business?.layout?.policies || {
    cancellationNotice: 'ביטול או שינוי תור ללא עלות עד שעתיים לפני המועד שנקבע',
    arrivalTime: 'נא להגיע כ-5 דקות לפני שעת התור ששוריינה',
    paymentMethods: 'תשלום באשראי, Bit, Apple Pay או מזומן במקום',
    customNote: 'במידה ואתם מאחרים מעל 10 דקות, נא לעדכן אותנו מראש בוואטסאפ',
  };

  const title = business?.layout?.sectionTitles?.policies || 'מדיניות קביעת תורים והגעה';

  return (
    <section className="py-10 bg-[#161618] text-white border-t border-white/5" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-[#1F1F23] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/10">
            <HeartHandshake className="w-5 h-5" style={{ color: themeColor }} />
            <h3 className="text-lg sm:text-xl font-black text-white">{title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.cancellationNotice && (
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div>
                  <h4 className="text-xs font-black text-white mb-1">ביטולים ושינויים</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{policies.cancellationNotice}</p>
                </div>
              </div>
            )}

            {policies.arrivalTime && (
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div>
                  <h4 className="text-xs font-black text-white mb-1">זמני הגעה</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{policies.arrivalTime}</p>
                </div>
              </div>
            )}

            {policies.paymentMethods && (
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
                <CreditCard className="w-4 h-4 shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div>
                  <h4 className="text-xs font-black text-white mb-1">אמצעי תשלום</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{policies.paymentMethods}</p>
                </div>
              </div>
            )}

            {policies.customNote && (
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div>
                  <h4 className="text-xs font-black text-white mb-1">דגשים חשובים</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{policies.customNote}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
