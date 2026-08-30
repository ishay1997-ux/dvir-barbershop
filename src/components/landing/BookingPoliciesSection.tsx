'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CreditCard, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { getThemeTokens } from '@/lib/theme-tokens';

export default function BookingPoliciesSection({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const themeColor = business?.themeColor || '#C9A84C';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const policies = business?.layout?.policies || {
    cancellationNotice: 'ביטול או שינוי תור ללא עלות עד שעתיים לפני המועד שנקבע',
    arrivalTime: 'נא להגיע כ-5 דקות לפני שעת התור ששוריינה',
    paymentMethods: 'תשלום באשראי, Bit, Apple Pay או מזומן במקום',
    customNote: 'במידה ואתם מאחרים מעל 10 דקות, נא לעדכן אותנו מראש בוואטסאפ',
  };

  const title = business?.layout?.sectionTitles?.policies || 'מדיניות קביעת תורים והגעה';

  return (
    <section className={`py-10 ${t.sectionBg}`} dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`rounded-3xl p-6 sm:p-8 ${t.cardBg}`}>
          <div className={`flex items-center gap-2.5 mb-6 pb-4 border-b ${t.borderColor}`}>
            <HeartHandshake className="w-5 h-5" style={{ color: themeColor }} />
            <h3 className={`text-lg sm:text-xl font-black ${t.textPrimary}`}>{title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.cancellationNotice && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 transition-colors ${t.cardSubtleBg}`}>
                <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div>
                  <h4 className={`text-xs font-black mb-1 ${t.textPrimary}`}>ביטולים ושינויים</h4>
                  <p className={`text-xs leading-relaxed ${t.textSecondary}`}>{policies.cancellationNotice}</p>
                </div>
              </div>
            )}

            {policies.arrivalTime && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 transition-colors ${t.cardSubtleBg}`}>
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div>
                  <h4 className={`text-xs font-black mb-1 ${t.textPrimary}`}>זמני הגעה</h4>
                  <p className={`text-xs leading-relaxed ${t.textSecondary}`}>{policies.arrivalTime}</p>
                </div>
              </div>
            )}

            {policies.paymentMethods && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 transition-colors ${t.cardSubtleBg}`}>
                <CreditCard className="w-4 h-4 shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div>
                  <h4 className={`text-xs font-black mb-1 ${t.textPrimary}`}>אמצעי תשלום</h4>
                  <p className={`text-xs leading-relaxed ${t.textSecondary}`}>{policies.paymentMethods}</p>
                </div>
              </div>
            )}

            {policies.customNote && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 transition-colors ${t.cardSubtleBg}`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div>
                  <h4 className={`text-xs font-black mb-1 ${t.textPrimary}`}>דגשים חשובים</h4>
                  <p className={`text-xs leading-relaxed ${t.textSecondary}`}>{policies.customNote}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
