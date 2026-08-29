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
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';

  // Dynamic Background Theme Styles
  const bgStyles = (() => {
    switch (bgTheme) {
      case 'brand-midnight':
        return {
          backgroundColor: '#080c10',
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 50% 0%, ${themeColor}38, transparent 75%),
            radial-gradient(ellipse 70% 50% at 100% 40%, ${themeColor}22, transparent 70%),
            radial-gradient(ellipse 70% 50% at 0% 80%, ${themeColor}22, transparent 70%),
            linear-gradient(to bottom, transparent, #05070a 95%)
          `,
        };
      case 'luxury-light':
        return {
          backgroundColor: '#F8FAFC',
          backgroundImage: `
            radial-gradient(ellipse 90% 50% at 50% 0%, ${themeColor}25, transparent 70%),
            radial-gradient(ellipse 70% 50% at 100% 40%, ${themeColor}15, transparent 70%),
            radial-gradient(ellipse 70% 50% at 0% 80%, ${themeColor}15, transparent 70%)
          `,
        };
      case 'cyber-carbon':
        return {
          backgroundColor: '#09090B',
          backgroundImage: `
            radial-gradient(circle at 50% 20%, ${themeColor}30, transparent 65%),
            radial-gradient(circle at 100% 80%, ${themeColor}18, transparent 50%),
            radial-gradient(circle at 0% 50%, ${themeColor}18, transparent 50%)
          `,
        };
      case 'dark-obsidian':
      default:
        return {
          backgroundColor: '#121212',
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 0%, ${themeColor}1A, transparent 70%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${themeColor}10, transparent 70%),
            radial-gradient(ellipse 60% 40% at 0% 70%, ${themeColor}10, transparent 70%)
          `,
        };
    }
  })();

  return (
    <div className={`min-h-screen transition-colors duration-500 theme-${bgTheme} ${bgTheme === 'luxury-light' ? 'theme-luxury-light' : ''}`} style={bgStyles}>
      <Header business={business || undefined} />
      <main
        id="main-content"
        className="relative overflow-hidden transition-colors duration-500"
      >
        {/* 1. Sleek Hero Banner Hub: Cover Image, Monogram Logo, Waze, WhatsApp & 4 Action Pills */}
        <BarbershopHeroHub business={business || undefined} />

        {/* 2. Side-by-Side Clean Price List & Recent Haircuts Gallery */}
        <PriceListAndGallerySection business={business || undefined} />

        {/* 3. About Master Barber (Bio, Experience, Philosophy) */}
        {business?.layout?.showBio !== false && (
          <div id="about">
            <BarberShowcase business={business || undefined} />
          </div>
        )}

        {/* 4. Interactive Branch Maps & One-Tap Waze Navigation */}
        {business?.layout?.showBranches !== false && (
          <BranchNavigationSection business={business || undefined} />
        )}

        {/* 5. Interactive Before & After Transformation Slider */}
        {business?.layout?.showBeforeAfter !== false && (
          <BeforeAfterSection business={business || undefined} />
        )}

        {/* 6. Customer Testimonials & 5.0★ Google Reviews */}
        {business?.layout?.showReviews !== false && (
          <ReviewsSection business={business || undefined} />
        )}

        {/* 7. Frequently Asked Questions (FAQ) */}
        {business?.layout?.showFaqs !== false && (
          <div id="faq">
            <FaqSection business={business || undefined} />
          </div>
        )}
      </main>
      <Footer business={business || undefined} />

      {/* Sticky Mobile Floating Booking Bar */}
      <div className={`fixed bottom-0 inset-x-0 z-40 md:hidden backdrop-blur-md border-t p-3 px-4 flex items-center justify-between gap-3 shadow-2xl transition-colors ${
        bgTheme === 'luxury-light'
          ? 'bg-white/95 border-slate-200 text-slate-900'
          : 'bg-[#181818]/95 border-white/10 text-white'
      }`} dir="rtl">
        <div className="text-right">
          <div className={`text-[11px] font-bold ${bgTheme === 'luxury-light' ? 'text-slate-500' : 'text-zinc-400'}`}>מוכנים למהפך?</div>
          <div className={`text-xs font-black ${bgTheme === 'luxury-light' ? 'text-slate-900' : 'text-white'}`}>{business?.name || 'המספרה של דביר'}</div>
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
    </div>
  );
}
