'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Scissors, Sparkles, Check } from 'lucide-react';
import { ServiceItem } from '@/types/business';

interface CardsGridServicesProps {
  services: ServiceItem[];
  themeColor?: string;
  slug?: string;
}

export default function CardsGridServices({
  services,
  themeColor = '#C9A84C',
  slug = 'dvir',
}: CardsGridServicesProps) {
  const bookingUrl = slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {services.map((service, index) => (
        <motion.div
          key={service.id || index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="bg-[#202020] rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02] group relative overflow-hidden text-right"
        >
          {/* Subtle Glow corner */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ backgroundColor: themeColor }}
          />

          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-lg font-black text-white group-hover:text-amber-200 transition-colors">
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

            <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px] mb-5">
              {service.description || 'טיפול מקצועי ברמה הגבוהה ביותר עם חומרי פרימיום'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{service.duration} דקות</span>
            </div>

            <Link
              href={`${bookingUrl}?serviceId=${service.id || index}`}
              className="px-4 py-2 rounded-xl text-xs font-black text-white shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              style={{
                backgroundColor: themeColor === '#C9A84C' ? '#10B981' : themeColor,
              }}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>קבע תור</span>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
