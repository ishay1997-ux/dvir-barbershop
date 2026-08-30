'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';
import { ServiceItem } from '@/types/business';

interface CompactMenuServicesProps {
  services: ServiceItem[];
  themeColor?: string;
  slug?: string;
}

export default function CompactMenuServices({
  services,
  themeColor = '#C9A84C',
  slug = 'dvir',
}: CompactMenuServicesProps) {
  const bookingUrl = slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`;

  return (
    <div className="bg-[#18181B] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto">
      <div className="divide-y divide-white/10">
        {services.map((service, index) => (
          <motion.div
            key={service.id || index}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            className="py-4 first:pt-2 last:pb-2 flex items-center justify-between gap-4 hover:bg-white/5 px-3 rounded-2xl transition-colors group"
          >
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                  {service.name}
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {service.duration} דק׳
                </span>
              </div>
              {service.description && (
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                  {service.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span
                className="text-lg font-black tracking-tight"
                style={{ color: themeColor }}
              >
                ₪{service.price}
              </span>

              <Link
                href={`${bookingUrl}?serviceId=${service.id || index}`}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white shadow-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                style={{
                  backgroundColor: themeColor === '#C9A84C' ? '#10B981' : themeColor,
                }}
              >
                <span>הזמן</span>
                <ArrowLeft className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
