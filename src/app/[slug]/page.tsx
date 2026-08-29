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
import {
  Scissors,
  Calendar,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  ExternalLink,
  Megaphone,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface BusinessProfile {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  slogan?: string;
  announcement?: string;
  themeColor?: string;
  branchesCount: number;
  status: string;
  branches?: Array<{ name: string; address: string }>;
  services?: Array<{ name: string; price: number; duration: number }>;
}

export default function DynamicBusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase().trim();

  // If this is Dvir's barbershop, render the full rich flagship experience
  if (slug === 'dvir' || slug === 'thecut') {
    return (
      <>
        <Header />
        <main id="main-content">
          <BarbershopHeroHub />
          <PriceListAndGallerySection />
          <div id="about">
            <BarberShowcase />
          </div>
          <BranchNavigationSection />
          <BeforeAfterSection />
          <ReviewsSection />
          <div id="faq">
            <FaqSection />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const res = await fetch(`/api/admin/businesses?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.business) {
            setBusiness(data.business);
          } else {
            setNotFound(true);
          }
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
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="w-12 h-12 border-3 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin mb-3" />
        <p className="text-xs text-[#9E9891] font-bold">טוען את דף המספרה...</p>
      </div>
    );
  }

  if (notFound || !business) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="max-w-md w-full bg-[#1C1C1C] border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Scissors className="w-7 h-7 -rotate-45" />
          </div>
          <h1 className="text-xl font-black text-white mb-2">דף מספרה בהקמה</h1>
          <p className="text-xs text-[#9E9891] mb-6 leading-relaxed">
            המספרה בכתובת <strong className="text-white">thecut.co.il/{slug}</strong> עדיין בהקמה במערכת The Cut.
          </p>
          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            חזרה לדף הראשי
          </Link>
        </div>
      </div>
    );
  }

  const branches = business.branches || [
    { name: `סניף ראשי ${business.city}`, address: business.city },
  ];

  const services = business.services || [
    { name: 'תספורת גברים / עיצוב שיער', price: 80, duration: 30 },
    { name: 'עיצוב וסידור זקן', price: 40, duration: 15 },
    { name: 'תספורת + זקן VIP', price: 110, duration: 45 },
  ];

  const cleanPhone = business.phone.replace(/\D/g, '').replace(/^0/, '972');

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#C9A84C] selection:text-black" dir="rtl">
      {/* Announcement Banner if present */}
      {business.announcement && (
        <div className="bg-gradient-to-r from-[#C9A84C] via-[#DFCA85] to-[#C9A84C] text-[#1C1C1C] py-2.5 px-4 text-center font-black text-xs flex items-center justify-center gap-2 shadow-md">
          <Megaphone className="w-3.5 h-3.5" />
          <span>{business.announcement}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1C1C1C] shadow-md font-bold">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-white">{business.name}</h1>
              <span className="text-[10px] text-[#C9A84C] font-bold">מערכת זימון תורים The Cut</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${business.ownerName}, אני מעוניין במידע על תספורת אצלך:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">וואטסאפ</span>
            </a>

            <Link
              href={`/${slug}/booking`}
              className="px-4 py-1.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs transition-colors shadow-md"
            >
              קבע תור
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Hub */}
      <section className="relative py-12 px-4 bg-gradient-to-b from-[#1E1E1E] to-[#141414] border-b border-white/10 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-20 h-20 rounded-full bg-[#C9A84C]/15 border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-4 text-[#C9A84C] shadow-2xl">
            <Scissors className="w-10 h-10 -rotate-45" />
          </div>

          <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] font-bold text-[#C9A84C] mb-3">
            <Star className="w-3.5 h-3.5 fill-[#C9A84C]" />
            <span>דירוג 5.0 כוכבים · {business.city}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            ברוכים הבאים ל<span className="text-[#C9A84C]">{business.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9E9891] mb-6 max-w-lg mx-auto leading-relaxed">
            {business.slogan || 'עיצוב שיער מקצועי, דיוק בלתי מתפשר, חוויית שירות יוקרתית וזימון תורים אולטרה-מהיר.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${slug}/booking`}
              className="px-6 py-3.5 rounded-2xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-sm transition-all shadow-xl hover:scale-105"
            >
              📅 קביעת תור מהירה עכשיו
            </Link>
            <a
              href={`tel:${business.phone}`}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center gap-2 border border-white/10 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C9A84C]" /> {business.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Services and Price List */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-black text-white mb-1">מחירון השירותים</h3>
          <p className="text-xs text-[#9E9891]">בחר שירות וקבע תור בלחיצה אחת</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-[#C9A84C]/50 transition-colors"
            >
              <div>
                <h4 className="text-sm font-black text-white">{srv.name}</h4>
                <span className="text-[11px] text-[#9E9891] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-[#C9A84C]" /> {srv.duration} דקות
                </span>
              </div>
              <div className="text-left">
                <span className="text-base font-black text-[#C9A84C]">
                  {formatPrice(srv.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Branches Locations */}
      <section className="py-10 px-4 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-6">
          <h3 className="text-lg font-black text-white mb-1">הסניפים שלנו</h3>
          <p className="text-xs text-[#9E9891]">זמינים עבורכם במיקומים הנוחים ביותר</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches.map((b, i) => (
            <div key={i} className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">{b.name}</h4>
                <p className="text-xs text-[#9E9891] mt-0.5">{b.address}</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  פתוח לקבלת קהל ✓
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-white/10 text-xs text-[#9E9891]">
        <div className="flex items-center justify-center gap-1.5 font-bold text-white mb-1">
          <span>{business.name}</span>
          <span>·</span>
          <span className="text-[#C9A84C]">מופעל ע״י The Cut Platform</span>
        </div>
        <p className="text-[11px] text-zinc-600">מערכת זימון תורים חכמה לעסקים ומספרות</p>
      </footer>
    </div>
  );
}
