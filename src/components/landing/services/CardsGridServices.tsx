'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Scissors, Sparkles, Check } from 'lucide-react';
import { ServiceItem } from '@/types/business';
import { getThemeTokens } from '@/lib/theme-tokens';

interface CardsGridServicesProps {
  services: ServiceItem[];
  themeColor?: string;
  slug?: string;
  bgTheme?: string;
}

export default function CardsGridServices({
  services,
  themeColor = '#C9A84C',
  slug = 'dvir',
  bgTheme,
}: CardsGridServicesProps) {
  const bookingUrl = `/${slug}/booking`;
  const t = getThemeTokens(bgTheme);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {services.map((service, index) => (
        <motion.div
          key={service.id || index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden text-right ${t.cardBg}`}
        >
          {/* Subtle Glow corner */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ backgroundColor: themeColor }}
          />

          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className={`text-lg font-black transition-colors ${t.textPrimary}`}>
                {service.name}
              </h3>
              <div
                className="px-3.5 py-1.5 rounded-2xl font-black text-sm border shadow-xs shrink-0"
                style={{
                  backgroundColor: `${themeColor}20`,
                  borderColor: `${themeColor}60`,
                  color: themeColor,
                }}
              >
                ₪{service.price}
              </div>
            </div>

            <p className={`text-xs leading-relaxed min-h-[36px] mb-5 ${t.textSecondary}`}>
              {service.description || 'טיפול מקצועי ברמה הגבוהה ביותר עם חומרי פרימיום'}
            </p>
          </div>

          <div className={`pt-4 border-t flex items-center justify-between gap-3 mt-auto ${t.borderColor}`}>
            <div className={`flex items-center gap-1.5 text-xs font-bold ${t.textMuted}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{service.duration} דקות</span>
            </div>

            <Link
              href={`${bookingUrl}?serviceId=${service.id || index}`}
              className="px-4 py-2 rounded-xl text-xs font-black text-white shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer hover:opacity-95"
              style={{
                backgroundColor: themeColor === '#C9A84C' ? '#10B981' : themeColor,
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white/90" />
              <span>הזמן עכשיו</span>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
