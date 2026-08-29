'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BarbershopHeroHub from '@/components/landing/BarbershopHeroHub';
import PriceListAndGallerySection from '@/components/landing/PriceListAndGallerySection';
import BarberShowcase from '@/components/landing/BarberShowcase';
import BranchNavigationSection from '@/components/landing/BranchNavigationSection';
import BeforeAfterSection from '@/components/landing/BeforeAfterSection';
import ReviewsSection from '@/components/landing/ReviewsSection';
import FaqSection from '@/components/landing/FaqSection';
import SidebarDrawer from '@/components/layout/SidebarDrawer';
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
  Navigation,
  Check,
  ChevronDown,
  Menu,
  Heart,
  Award,
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
  branches?: Array<{ name: string; address: string; wazeLink?: string }>;
  services?: Array<{ name: string; price: number; duration: number }>;
}

export default function DynamicBusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase().trim();

  // If this is Dvir's barbershop, render the flagship site
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);

  // Before/After slider position
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-12 h-12 border-3 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin mb-3" />
        <p className="text-xs text-[#9E9891] font-bold">טוען את המספרה...</p>
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

  const branches = business.branches && business.branches.length > 0
    ? business.branches
    : [{ name: `סניף ראשי ${business.city}`, address: business.city }];

  const services = business.services && business.services.length > 0
    ? business.services
    : [
        { name: 'תספורת גברים / עיצוב שיער', price: 80, duration: 30 },
        { name: 'עיצוב וסידור זקן', price: 40, duration: 15 },
        { name: 'תספורת + זקן VIP', price: 110, duration: 45 },
      ];

  const cleanPhone = business.phone.replace(/\D/g, '').replace(/^0/, '972');
  const activeBranch = branches[selectedBranchIndex] || branches[0];

  const galleryImages = [
    { src: '/images/haircuts/haircut_1.png', label: 'פייד קלאסי מדויק' },
    { src: '/images/haircuts/haircut_2.png', label: 'סקין פייד גבוה' },
    { src: '/images/haircuts/haircut_3.png', label: 'עיצוב ופיסול זקן' },
    { src: '/images/haircuts/haircut_4.png', label: 'קרופ מודרני מעוצב' },
    { src: '/images/haircuts/haircut_5.png', label: 'טייפר פייד נקי' },
    { src: '/images/haircuts/haircut_6.png', label: 'תספורת VIP + זקן' },
  ];

  const faqs = [
    {
      q: 'האם חייבים לקבוע תור מראש?',
      a: `מומלץ מאוד להזמין תור מראש דרך האתר כדי להבטיח שלא תמתינו בתור והשעה תישמר עבורכם במדויק.`,
    },
    {
      q: 'איך מבטלים או משנים תור?',
      a: `ניתן לבטל או לשנות תור בקלות עד שעתיים לפני המועד דרך קישור ניהול התור שנשלח אליכם בוואטסאפ או בכניסה לעמוד 'ניהול תורים' באתר.`,
    },
    {
      q: 'אילו אמצעי תשלום מתקבלים במספרה?',
      a: `מזומן, כרטיסי אשראי, Bit, Apple Pay ו-Google Pay.`,
    },
    {
      q: 'האם יש חניה מסודרת ליד הסניף?',
      a: `כן, ישנה חניה זמינה בקרבת הסניף וגישה נוחה ומהירה.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#C9A84C] selection:text-black" dir="rtl">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-[#C9A84C] via-[#DFCA85] to-[#C9A84C] text-[#1C1C1C] py-2 px-4 text-center font-black text-xs flex items-center justify-center gap-2 shadow-md">
        <Megaphone className="w-3.5 h-3.5" />
        <span>{business.announcement || '🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7'}</span>
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#1C1C1C]/95 backdrop-blur-md border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-zinc-300 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              aria-label="פתח תפריט"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1C1C1C] shadow-md font-bold">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div className="leading-tight">
                <h1 className="text-sm sm:text-base font-black text-white">{business.name}</h1>
                <span className="text-[10px] text-[#9E9891]">{business.city}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${business.ownerName}, אני מעוניין לקבוע תור אצלך:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>וואטסאפ</span>
            </a>

            <Link
              href={`/${slug}/booking`}
              className="px-4 py-1.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs transition-all shadow-md hover:scale-105"
            >
              קבע תור עכשיו
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <SidebarDrawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* ============================================================ */}
      {/* 1. LUXURY HERO BANNER HUB                                    */}
      {/* ============================================================ */}
      <section className="relative pt-12 pb-16 px-4 bg-gradient-to-b from-[#222222] via-[#1A1A1A] to-[#141414] border-b border-white/10 text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Circular Gold Monogram Logo */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#DFCA85] via-[#C9A84C] to-[#9A7B2C] p-1 mx-auto mb-4 shadow-2xl">
            <div className="w-full h-full rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#C9A84C]">
              <Scissors className="w-10 h-10 -rotate-45" />
            </div>
          </div>

          {/* 5-Star verified badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3.5 py-1 text-xs font-bold text-[#C9A84C] mb-3 backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 fill-[#C9A84C]" />
            <span>דירוג 5.0 כוכבים · {business.city}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            ברוכים הבאים ל<span className="text-[#C9A84C]">{business.name}</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 mb-8 max-w-lg mx-auto leading-relaxed font-sans">
            {business.slogan || 'עיצוב שיער גברים, פיידים מדויקים, פיסול זקן ברמה הגבוהה ביותר וזימון תורים אולטרה-מהיר.'}
          </p>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${slug}/booking`}
              className="px-7 py-3.5 rounded-2xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-sm transition-all shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>קביעת תור מהירה עכשיו</span>
            </Link>

            <a
              href={`https://waze.com/ul?q=${encodeURIComponent(activeBranch.address || activeBranch.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center gap-2 border border-white/15 transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#C9A84C]" />
              <span>נווט ב-Waze</span>
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${business.ownerName}, אני מעוניין במידע נוסף:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-400 font-bold text-xs inline-flex items-center gap-2 border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>וואטסאפ ישיר</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SIDE-BY-SIDE PRICE LIST & HAIRCUTS GALLERY                 */}
      {/* ============================================================ */}
      <section className="py-14 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block text-[11px] font-black text-[#C9A84C] tracking-widest uppercase mb-1">
            PREMIUM SERVICES & GALLERY
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">מחירון שירותים וגלריית עבודות</h3>
          <p className="text-xs text-[#9E9891]">בחר את הטיפול המושלם עבורך וקבע תור בשניות</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Price List Column */}
          <div className="space-y-3.5">
            {services.map((srv, idx) => (
              <div
                key={idx}
                className="bg-[#1C1C1C] border border-white/10 hover:border-[#C9A84C]/60 rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-all group shadow-md"
              >
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white group-hover:text-[#C9A84C] transition-colors">
                    {srv.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C9A84C]" /> {srv.duration} דקות
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400">כולל חפיפה ועיצוב</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl font-black text-[#C9A84C]">
                    {formatPrice(srv.price)}
                  </span>
                  <Link
                    href={`/${slug}/booking`}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#C9A84C] hover:text-black text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    הזמן
                  </Link>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-center text-xs text-zinc-300">
              ⚡ <strong>חוויית VIP:</strong> כל תספורת כוללת ייעוץ אישי, התאמת קווי פנים וחומרי טיפוח מהמובילים בעולם.
            </div>
          </div>

          {/* Haircuts Gallery Column */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
            {galleryImages.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden aspect-square border border-white/10 group bg-[#222]"
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white drop-shadow-md">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. MASTER BARBER SHOWCASE (ABOUT)                            */}
      {/* ============================================================ */}
      <section className="py-12 px-4 bg-[#181818] border-y border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-square border-2 border-[#C9A84C]/40 shadow-2xl bg-[#222]">
            <Image
              src="/images/barber_profile.png"
              alt={business.ownerName}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 right-3 left-3 bg-black/75 backdrop-blur-xs rounded-xl p-2 text-center text-xs font-bold text-white border border-white/10">
              מאסטר ברבר {business.ownerName}
            </div>
          </div>

          <div className="md:col-span-2 space-y-3.5 text-right">
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1 rounded-full border border-[#C9A84C]/30">
              <Award className="w-3.5 h-3.5" /> מאסטר בעיצוב שיער גברים
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              הפילוסופיה והדיוק של {business.name}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              ב-{business.name} אנחנו מאמינים שתספורת היא כרטיס הביקור של כל גבר. כל לקוח מקבל יחס אישי, התאמה מדויקת למבנה הפנים, ושימוש במכשור החדשני והסטרילי ביותר.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#1C1C1C] p-3 rounded-xl border border-white/10 text-center">
                <span className="block text-base font-black text-[#C9A84C]">100%</span>
                <span className="text-[10px] text-zinc-400">שביעות רצון</span>
              </div>
              <div className="bg-[#1C1C1C] p-3 rounded-xl border border-white/10 text-center">
                <span className="block text-base font-black text-[#C9A84C]">סטריליות</span>
                <span className="text-[10px] text-zinc-400">חיטוי מלא</span>
              </div>
              <div className="bg-[#1C1C1C] p-3 rounded-xl border border-white/10 text-center col-span-2 sm:col-span-1">
                <span className="block text-base font-black text-emerald-400">24/7</span>
                <span className="text-[10px] text-zinc-400">זימון אונליין</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. INTERACTIVE BRANCHES & 1-TAP WAZE NAVIGATION               */}
      {/* ============================================================ */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-white mb-1">הסניפים ודרכי ההגעה</h3>
          <p className="text-xs text-[#9E9891]">זמינים עבורכם במיקומים המובילים</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches.map((b, i) => (
            <div
              key={i}
              className="bg-[#1C1C1C] border border-[#C9A84C]/30 rounded-3xl p-6 shadow-xl space-y-4 text-right relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">{b.name}</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">{b.address}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  פתוח לקבלת קהל ✓
                </span>
              </div>

              <div className="text-xs text-zinc-400 bg-[#141414] p-3 rounded-xl border border-white/5 space-y-1">
                <div className="flex justify-between">
                  <span>ראשון - רביעי:</span>
                  <strong className="text-white">09:00 - 20:00</strong>
                </div>
                <div className="flex justify-between">
                  <span>חמישי:</span>
                  <strong className="text-white">09:00 - 21:00</strong>
                </div>
                <div className="flex justify-between">
                  <span>שישי וערבי חג:</span>
                  <strong className="text-[#C9A84C]">08:00 - 14:00</strong>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(b.address || b.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" /> נווט ב-Waze
                </a>

                <a
                  href={`tel:${business.phone}`}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  <Phone className="w-3.5 h-3.5" /> חייג
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. INTERACTIVE BEFORE & AFTER TRANSFORMATION SLIDER          */}
      {/* ============================================================ */}
      <section className="py-14 px-4 bg-[#181818] border-t border-white/10 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-white mb-1">תוצאות מדברות בעד עצמן</h3>
            <p className="text-xs text-[#9E9891]">גררו את הסליידר כדי לראות את הדיוק לפני ואחרי</p>
          </div>

          <div
            className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden select-none border-2 border-white/10 shadow-2xl mx-auto cursor-ew-resize"
            onMouseMove={(e) => {
              if (!isDragging) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
              setSliderPos((x / rect.width) * 100);
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0];
              const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
              setSliderPos((x / rect.width) * 100);
            }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            {/* After Image (Full width background) */}
            <Image
              src="/images/haircuts/haircut_1.png"
              alt="אחרי תספורת"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-emerald-500/90 backdrop-blur-xs text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
              אחרי תספורת ✓
            </div>

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/haircuts/haircut_2.png"
                  alt="לפני תספורת"
                  fill
                  className="object-cover filter grayscale"
                />
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xs text-white text-xs font-black px-3 py-1 rounded-full border border-white/15">
                  לפני תספורת
                </div>
              </div>
            </div>

            {/* Drag Handle Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#C9A84C] shadow-lg flex items-center justify-center -translate-x-1/2"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#C9A84C] text-black flex items-center justify-center text-xs font-black shadow-xl">
                ⇄
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. VERIFIED GOOGLE REVIEWS (5.0★)                             */}
      {/* ============================================================ */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-1 text-xs font-black text-[#C9A84C] mb-2">
            <Star className="w-4 h-4 fill-[#C9A84C]" /> 4.9 כוכבים בביקורות מאומתות
          </div>
          <h3 className="text-2xl font-black text-white">מה הלקוחות מספרים עלינו</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
          {[
            {
              name: 'יונתן א.',
              text: 'הספר הכי מדויק שיצא לי להסתפר אצלו! פייד נקי וחלק בלי שום פשרות. ממליץ בחום!',
              date: 'לפני 3 ימים',
            },
            {
              name: 'עידו ש.',
              text: 'חוויית שירות נדירה! הזמנתי תור מהאתר והתקבלתי בדיוק על הדקה בלי לחכות שנייה.',
              date: 'לפני שבוע',
            },
            {
              name: 'מתן ל.',
              text: 'פיסול זקן ברמה הכי גבוהה בארץ. מקום נקי, סטרילי וצוות מקצועי ביותר.',
              date: 'לפני שבועיים',
            },
          ].map((rev, idx) => (
            <div key={idx} className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-white text-sm">{rev.name}</span>
                <div className="flex text-[#C9A84C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C9A84C]" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                "{rev.text}"
              </p>
              <span className="text-[10px] text-zinc-500 block">{rev.date} · לקוח מאומת ✓</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ)                          */}
      {/* ============================================================ */}
      <section className="py-12 px-4 max-w-3xl mx-auto border-t border-white/10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-white mb-1">שאלות נפוצות</h3>
          <p className="text-xs text-[#9E9891]">כל מה שחשוב לדעת לפני שמגיעים</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#1C1C1C] border border-white/10 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-right flex items-center justify-between text-xs sm:text-sm font-black text-white hover:text-[#C9A84C] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C9A84C] transition-transform duration-300 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-white/5 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. LUXURY FOOTER                                             */}
      {/* ============================================================ */}
      <footer className="py-10 px-4 text-center border-t border-white/10 text-xs text-[#9E9891] bg-[#101010]">
        <div className="flex items-center justify-center gap-2 font-black text-white text-sm mb-1.5">
          <span>{business.name}</span>
          <span>·</span>
          <span className="text-[#C9A84C]">מופעל ע״י The Cut Platform</span>
        </div>
        <p className="text-[11px] text-zinc-500 mb-4">
          מערכת זימון תורים חכמה לעסקים ומספרות בישראל · כל הזכויות שמורות
        </p>

        <div className="flex items-center justify-center gap-4 text-xs">
          <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">תנאי שימוש</Link>
          <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">מדיניות פרטיות</Link>
          <Link href="/accessibility" className="text-zinc-500 hover:text-white transition-colors">הצהרת נגישות</Link>
        </div>
      </footer>
    </div>
  );
}
