'use client';

import { use, useEffect, useState } from 'react';
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
import { Scissors, Phone, MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { getBusinessBySlug } from '@/lib/business-service';

export default function DynamicBusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase().trim();

  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      // Dvir flagship bypass
      if (slug === 'dvir' || slug === 'thecut') {
        setLoading(false);
        return;
      }

      try {
        const data = await getBusinessBySlug(slug);
        if (data) {
          setBusiness(data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadBusiness();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-12 h-12 border-3 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin mb-3" />
        <p className="text-xs text-[#9E9891] font-bold">טוען את המספרה...</p>
      </div>
    );
  }

  if (notFound && slug !== 'dvir' && slug !== 'thecut') {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="max-w-md w-full bg-[#1C1C1C] border border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#C9A84C]">
            <Scissors className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">המספרה לא נמצאה</h1>
          <p className="text-xs text-[#9E9891] leading-relaxed">
            לא נמצא עסק פעיל תחת הכתובת <code className="text-[#C9A84C] font-mono">/{slug}</code>.
            ייתכן שהקישור שגוי או שהאתר הועבר לכתובת אחרת.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link
              href="/"
              className="flex-1 py-3 rounded-2xl bg-[#C9A84C] text-[#1C1C1C] font-black text-xs hover:bg-[#DFCA85] transition-colors"
            >
              למספרת הדגל הראשית
            </Link>
            <Link
              href="/super-admin"
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              לוח סופר אדמין
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const themeColor = business?.themeColor || '#C9A84C';
  const cleanPhone = (business?.phone || '052-1234567').replace(/\D/g, '').replace(/^0/, '972');

  return (
    <>
      <Header business={business || undefined} />
      <main id="main-content">
        {/* 1. Sleek Hero Banner Hub: Cover Image, Monogram Logo, Waze, WhatsApp & 4 Action Pills */}
        <BarbershopHeroHub business={business || undefined} />

        {/* 2. Side-by-Side Clean Price List & Recent Haircuts Gallery */}
        <PriceListAndGallerySection business={business || undefined} />

        {/* 3. About Master Barber (Bio, Experience, Philosophy) */}
        <div id="about">
          <BarberShowcase business={business || undefined} />
        </div>

        {/* 4. Interactive Branch Maps & One-Tap Waze Navigation */}
        <BranchNavigationSection business={business || undefined} />

        {/* 5. Interactive Before & After Transformation Slider */}
        <BeforeAfterSection business={business || undefined} />

        {/* 6. Customer Testimonials & 5.0★ Google Reviews */}
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
            href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
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
