'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, MapPin, Clock, Navigation, Calendar } from 'lucide-react';
import { SHOP_INFO, MOCK_BRANCHES } from '@/lib/utils';
import Link from 'next/link';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="3"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

const dayNames = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'שבת'];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 bg-[#1C1C1C]"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">איפה אנחנו נמצאים?</span>
          <h2
            id="contact-heading"
            className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4"
          >
            הסניפים שלנו
          </h2>
          <div className="gold-divider" />
          <p className="text-[#9E9891] mt-4 max-w-md mx-auto text-sm sm:text-base">
            דביר מספר ב-2 מיקומים מרכזיים. בחר את הסניף הקרוב אליך לנווט ולהזמין תור.
          </p>
        </motion.div>

        {/* Dual Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {MOCK_BRANCHES.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-[#2A2A2A] border-2 border-[#3D3D3D] hover:border-gold/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">
                        {branch.city}
                      </span>
                      <h3 className="text-xl font-black text-white">{branch.name}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-[#9E9891] text-sm mb-6 leading-relaxed">
                  {branch.shortDescription}
                </p>

                <div className="bg-[#1C1C1C] rounded-2xl p-4 border border-[#3D3D3D] space-y-3 text-xs sm:text-sm text-[#D5CBB8] mb-6">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>כתובת: <strong>{branch.address}</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>ימי פעילות: <strong>{branch.activeDays.map((d) => dayNames[d]).join(', ')}</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>שעות פעילות: <strong>09:00 – 20:00</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#3D3D3D]">
                <a
                  href={branch.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  נווט עם Waze
                </a>

                <Link
                  href="/booking"
                  className="flex-1 btn-shimmer inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[#1C1C1C] font-bold text-xs hover:scale-105 active:scale-95 transition-transform shadow-sm"
                >
                  הזמן תור לסניף זה ←
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Phone & Instagram footer bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#2A2A2A] border border-[#3D3D3D] rounded-2xl p-4 sm:p-6 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gold" />
            <span className="text-[#9E9891]">טלפון לבירורים והודעות:</span>
            <a href={`tel:${SHOP_INFO.phone}`} className="text-white font-bold hover:text-gold" dir="ltr">
              {SHOP_INFO.phone}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={SHOP_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9E9891] hover:text-gold transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              אינסטגרם: @dvir_barber
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
