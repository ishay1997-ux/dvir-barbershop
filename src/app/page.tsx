'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BarbershopHeroHub from '@/components/landing/BarbershopHeroHub';
import PriceListAndGallerySection from '@/components/landing/PriceListAndGallerySection';
import BarberShowcase from '@/components/landing/BarberShowcase';
import BranchNavigationSection from '@/components/landing/BranchNavigationSection';
import BeforeAfterSection from '@/components/landing/BeforeAfterSection';
import ReviewsSection from '@/components/landing/ReviewsSection';
import FaqSection from '@/components/landing/FaqSection';
import { getBusinessBySlug } from '@/lib/business-service';
import { BusinessConfig } from '@/types/business';
import { MessageCircle, Calendar } from 'lucide-react';

export default function HomePage() {
  const [business, setBusiness] = useState<BusinessConfig | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBusinessBySlug('dvir');
        if (data) setBusiness(data);
      } catch (err) {
        console.error('Error loading default business:', err);
      }
    }
    load();
  }, []);

  const themeColor = business?.themeColor || '#C9A84C';
  const cleanPhone = (business?.phone || '052-1234567').replace(/\D/g, '').replace(/^0/, '972');

  return (
    <>
      <Header business={business || undefined} />
      <main
        id="main-content"
        className="relative overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: '#121212',
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 0%, ${themeColor}1A, transparent 70%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${themeColor}10, transparent 70%),
            radial-gradient(ellipse 60% 40% at 0% 70%, ${themeColor}10, transparent 70%)
          `,
        }}
      >
        {/* 1. Sleek Hero Banner Hub: Cover Image, Monogram Logo, Waze, WhatsApp & 4 Action Pills */}
        <BarbershopHeroHub business={business || undefined} />

        {/* 2. Side-by-Side Clean Price List & Recent Haircuts Gallery */}
        <PriceListAndGallerySection business={business || undefined} />

        {/* 3. About Master Barber Dvir (Bio, Experience, Philosophy) */}
        <div id="about">
          <BarberShowcase business={business || undefined} />
        </div>

        {/* 4. Interactive Branch Maps & One-Tap Waze Navigation (Ariel & Rehovot) */}
        <BranchNavigationSection business={business || undefined} />

        {/* 5. Interactive Before & After Transformation Slider */}
        <BeforeAfterSection business={business || undefined} />

        {/* 6. Customer Testimonials & 4.9★ Google Reviews */}
        <ReviewsSection business={business || undefined} />

        {/* 7. Frequently Asked Questions (FAQ) */}
        <div id="faq">
          <FaqSection business={business || undefined} />
        </div>
      </main>
      <Footer business={business || undefined} />

      {/* Sticky Mobile Floating Booking Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#181818]/95 backdrop-blur-md border-t border-white/10 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl" dir="rtl">
        <div className="text-right">
          <div className="text-[11px] font-bold text-zinc-400">מוכנים למהפך?</div>
          <div className="text-xs font-black text-white">{business?.name || 'המספרה של דביר'}</div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${business?.ownerName || 'דביר'}, רציתי לקבוע תור`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shadow-md active:scale-95 transition-transform"
            aria-label="וואטסאפ מהיר"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <Link
            href="/booking"
            className="py-2.5 px-5 rounded-2xl text-[#1C1C1C] font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            style={{ backgroundColor: themeColor }}
          >
            <Calendar className="w-4 h-4" />
            <span>קבע תור מהיר</span>
          </Link>
        </div>
      </div>
    </>
  );
}
