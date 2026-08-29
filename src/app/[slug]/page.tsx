'use client';

import { use, useEffect, useState, useMemo } from 'react';
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
  X,
  Share2,
  ThumbsUp,
  Maximize2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { BusinessConfig } from '@/types/business';
import { getBusinessBySlug } from '@/lib/business-service';

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

  const [business, setBusiness] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ src: string; label: string } | null>(null);

  // Before/After slider position
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Greeting by time of day
  const [greeting, setGreeting] = useState('ברוכים הבאים');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('בוקר טוב');
    else if (hour >= 12 && hour < 17) setGreeting('צהריים טובים');
    else if (hour >= 17 && hour < 21) setGreeting('ערב טוב');
    else setGreeting('לילה טוב');
  }, []);

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

  const branches = useMemo(() => {
    if (!business?.branches || business.branches.length === 0) {
      return [{ name: `סניף ראשי – ${business?.city || 'מרכז'}`, address: business?.city || 'ישראל', hours: 'א׳-ה׳: 09:00-20:00 | ו׳: 08:30-14:00' }];
    }
    return business.branches;
  }, [business]);

  const services = useMemo(() => {
    if (!business?.services || business.services.length === 0) {
      return [
        { id: '1', name: 'תספורת גברים פרימיום', price: 80, duration: 30, description: 'כולל חפיפה מפנקת ועיצוב', popular: true },
        { id: '2', name: 'עיצוב ופיסול זקן Master', price: 40, duration: 20, description: 'תיחום קווים בתער ומגבת חמה', popular: false },
        { id: '3', name: 'חבילת VIP משולבת', price: 110, duration: 45, description: 'תספורת פייד, זקן ומגבת חמה', popular: true },
      ];
    }
    return business.services;
  }, [business]);

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

  const themeColor = business.themeColor || '#C9A84C';
  const cleanPhone = business.phone ? business.phone.replace(/\D/g, '').replace(/^0/, '972') : '972500000000';
  const activeBranch = branches[selectedBranchIndex] || branches[0];

  const galleryImages = [
    { src: '/images/haircuts/haircut_1.png', label: 'פייד קלאסי מדויק' },
    { src: '/images/haircuts/haircut_2.png', label: 'סקין פייד גבוה & טקסטורה' },
    { src: '/images/haircuts/haircut_3.png', label: 'עיצוב ופיסול זקן Master' },
    { src: '/images/haircuts/haircut_4.png', label: 'קרופ מודרני מעוצב' },
    { src: '/images/haircuts/haircut_5.png', label: 'טייפר פייד נקי' },
    { src: '/images/haircuts/haircut_6.png', label: 'תספורת VIP + טיפוח' },
  ];

  const testimonials = business.testimonials && business.testimonials.length > 0 ? business.testimonials : [
    { id: '1', name: 'יונתן כהן', comment: `הספר הכי מדויק שיצא לי להסתפר אצלו! פייד מושלם כל פעם מחדש אצל ${business.ownerName}.`, rating: 5, timeAgo: 'לפני 3 ימים', serviceUsed: 'תספורת גברים פרימיום' },
    { id: '2', name: 'עומר לוי', comment: 'חבילת ה-VIP שווה כל שקל! פיסול הזקן והמגבת החמה זו חוויה של מספרת יוקרה מהשורה הראשונה.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'חבילת VIP משולבת' },
    { id: '3', name: 'רועי ששון', comment: 'שירות מעל המצופה, עמידה מדויקת בזמנים, אווירה טובה ומקצוענות שיא!', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'תספורת גברים פרימיום' },
  ];

  const faqs = business.faqs && business.faqs.length > 0 ? business.faqs : [
    { question: 'האם חובה לקבוע תור מראש?', answer: 'כן, כדי להבטיח שלא תמתינו אפילו דקה אחת, אנו עובדים במתכונת תורים מוזמנים מראש דרך המערכת.' },
    { question: 'האם ניתן לבטל או להזיז תור?', answer: 'בהחלט! ניתן לבטל תור בקלות דרך האתר עד שעתיים לפני מועד התור ללא עלות.' },
    { question: 'אילו אמצעי תשלום מתקבלים במספרה?', answer: 'אנו מקבלים מזומן, כרטיסי אשראי, Bit, PayBox ו-Apple Pay.' },
    { question: 'האם יש חניה צמודה בסניף?', answer: `כן, בקרבת הסניף ב${business.city} קיימת חניה מסודרת וגישה נוחה ללקוחותינו.` },
  ];

  return (
    <div
      className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#C9A84C] selection:text-black pb-16 sm:pb-0"
      dir="rtl"
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      {/* Top Announcement Banner */}
      <div
        className="text-[#1C1C1C] py-2 px-4 text-center font-black text-xs flex items-center justify-center gap-2 shadow-md"
        style={{
          background: `linear-gradient(90deg, ${themeColor}, #ffffff, ${themeColor})`,
        }}
      >
        <Megaphone className="w-3.5 h-3.5" />
        <span>{business.announcement || '🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7 – שריינו מראש!'}</span>
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
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1C1C1C] shadow-md font-black text-sm"
                style={{ backgroundColor: themeColor }}
              >
                {business.name.trim().charAt(0)}
              </div>
              <div className="leading-tight">
                <h1 className="text-sm sm:text-base font-black text-white">{business.name}</h1>
                <span className="text-[10px] text-[#9E9891]">{business.city}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${business.ownerName}, אני מעוניין לקבוע תור אצלך ב-${business.name}:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>וואטסאפ</span>
            </a>

            <Link
              href={`/${slug}/booking`}
              className="px-4 py-1.5 rounded-xl text-[#1C1C1C] font-black text-xs transition-all shadow-md hover:scale-105"
              style={{ backgroundColor: themeColor }}
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
        {/* Subtle background dynamic glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: themeColor }}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Circular Gold Monogram Logo */}
          <div
            className="w-24 h-24 rounded-full p-1 mx-auto mb-4 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${themeColor}, #ffffff, ${themeColor})` }}
          >
            <div className="w-full h-full rounded-full bg-[#1C1C1C] flex flex-col items-center justify-center" style={{ color: themeColor }}>
              <span className="text-3xl font-black">{business.name.trim().charAt(0)}</span>
              <Scissors className="w-4 h-4 -rotate-45 mt-0.5 opacity-80" />
            </div>
          </div>

          {/* Greeting & 5-Star verified badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3.5 py-1 text-xs font-bold mb-3 backdrop-blur-xs" style={{ color: themeColor }}>
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{greeting} · דירוג 5.0 כוכבים · {business.city}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            ברוכים הבאים ל<span style={{ color: themeColor }}>{business.name}</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 mb-8 max-w-lg mx-auto leading-relaxed font-sans">
            {business.slogan || 'עיצוב שיער גברים, פיידים מדויקים, פיסול זקן ברמה הגבוהה ביותר וזימון תורים אולטרה-מהיר.'}
          </p>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${slug}/booking`}
              className="px-7 py-3.5 rounded-2xl text-[#1C1C1C] font-black text-sm transition-all shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: themeColor }}
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>קביעת תור מהירה עכשיו</span>
            </Link>

            <a
              href={activeBranch.wazeLink || `https://waze.com/ul?q=${encodeURIComponent(activeBranch.address || activeBranch.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center gap-2 border border-white/15 transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" style={{ color: themeColor }} />
              <span>נווט ב-Waze</span>
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${business.ownerName}, אני מעוניין במידע נוסף אודות ${business.name}:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-400 font-bold text-xs inline-flex items-center gap-2 border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>וואטסאפ ישיר</span>
            </a>

            <a
              href={`tel:${business.phone}`}
              className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs inline-flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>התקשר</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SIDE-BY-SIDE PRICE LIST & HAIRCUTS GALLERY                 */}
      {/* ============================================================ */}
      <section className="py-14 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block text-[11px] font-black tracking-widest uppercase mb-1" style={{ color: themeColor }}>
            PREMIUM SERVICES & PORTFOLIO
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">מחירון שירותים וגלריית עבודות</h3>
          <p className="text-xs text-[#9E9891]">בחר את הטיפול המושלם עבורך אצל {business.name} וקבע תור בשניות</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Price List Column */}
          <div className="space-y-3.5">
            {services.map((srv, idx) => (
              <div
                key={idx}
                className="bg-[#1C1C1C] border border-white/10 hover:border-white/25 rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-all group shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-black text-white group-hover:text-[#DFCA85] transition-colors">
                      {srv.name}
                    </h4>
                    {srv.popular && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        מומלץ ⭐
                      </span>
                    )}
                  </div>
                  {srv.description && (
                    <p className="text-xs text-zinc-400 mt-1 font-sans">{srv.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" style={{ color: themeColor }} /> {srv.duration} דקות
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400">כולל חפיפה ועיצוב</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl font-black" style={{ color: themeColor }}>
                    {formatPrice(srv.price)}
                  </span>
                  <Link
                    href={`/${slug}/booking`}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-black hover:scale-105 shadow-sm"
                    style={{ backgroundColor: themeColor }}
                  >
                    הזמן
                  </Link>
                </div>
              </div>
            ))}

            <div
              className="p-4 rounded-2xl text-center text-xs text-zinc-300 border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              ⚡ <strong>חוויית פרימיום:</strong> כל טיפול אצל {business.ownerName} כולל ייעוץ אישי, התאמת קווי פנים וחומרי טיפוח מובחרים.
            </div>
          </div>

          {/* Haircuts Gallery Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveLightboxImg(img)}
                  className="relative rounded-2xl overflow-hidden aspect-square border border-white/10 group bg-[#222] cursor-pointer shadow-md"
                >
                  <Image
                    src={img.src}
                    alt={img.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white drop-shadow-md">
                      {img.label}
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 text-white/80" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 text-center">לחץ על תמונה להגדלה בתצוגה מלאה 🔍</p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div className="relative max-w-xl w-full aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <Image
              src={activeLightboxImg.src}
              alt={activeLightboxImg.label}
              fill
              className="object-contain"
            />
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 inset-x-4 bg-black/75 backdrop-blur-xs p-3 rounded-2xl text-center text-sm font-bold text-white">
              {activeLightboxImg.label} · {business.name}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MASTER STYLIST SHOWCASE (ABOUT)                           */}
      {/* ============================================================ */}
      <section className="py-14 px-4 bg-[#181818] border-y border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div
            className="relative rounded-3xl overflow-hidden aspect-square border-2 shadow-2xl bg-gradient-to-br from-[#2A2A2A] to-[#161616] flex flex-col items-center justify-center text-center p-6"
            style={{ borderColor: themeColor }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-lg border-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: themeColor,
                color: themeColor,
              }}
            >
              <span className="text-3xl font-black">{business.ownerName.charAt(0)}</span>
            </div>
            <h4 className="text-base font-black text-white">{business.ownerName}</h4>
            <span className="text-xs font-bold mt-0.5" style={{ color: themeColor }}>
              מאסטר מעצב שיער מוסמך
            </span>
          </div>

          <div className="md:col-span-2 space-y-3.5 text-right">
            <div
              className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full border"
              style={{
                color: themeColor,
                borderColor: themeColor,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Award className="w-3.5 h-3.5" /> מעל {business.experienceYears || 5} שנות מקצוענות ודיוק
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              הפילוסופיה והדיוק של {business.name}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              ב-{business.name} אנחנו מאמינים שתספורת מושלמת היא שילוב של יחס אישי, הקשבה לרצון הלקוח וטכניקת עבודה מדויקת. {business.ownerName} מעניק חוויית טיפוח ללא פשרות, שימוש בחומרים המובחרים ביותר וחיטוי יסודי.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#1C1C1C] p-3 rounded-xl border border-white/10 text-center">
                <span className="block text-base font-black" style={{ color: themeColor }}>100%</span>
                <span className="text-[10px] text-zinc-400">שביעות רצון</span>
              </div>
              <div className="bg-[#1C1C1C] p-3 rounded-xl border border-white/10 text-center">
                <span className="block text-base font-black" style={{ color: themeColor }}>סטריליות</span>
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
          <p className="text-xs text-[#9E9891]">זמינים עבורכם במיקומים המובילים ב{business.city}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches.map((b, i) => (
            <div
              key={i}
              className="bg-[#1C1C1C] border border-white/10 hover:border-white/20 rounded-3xl p-6 shadow-xl space-y-4 text-right relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: themeColor }}
                  >
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
                  <span>ראשון - חמישי:</span>
                  <strong className="text-white">09:00 - 20:00</strong>
                </div>
                <div className="flex justify-between">
                  <span>שישי וערבי חג:</span>
                  <strong style={{ color: themeColor }}>08:30 - 14:00</strong>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={b.wazeLink || `https://waze.com/ul?q=${encodeURIComponent(b.address || b.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl text-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                  style={{ backgroundColor: themeColor }}
                >
                  <Navigation className="w-3.5 h-3.5" /> נווט ב-Waze
                </a>

                <a
                  href={`tel:${b.phone || business.phone}`}
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
              אחרי טיפול ✓
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
                  לפני טיפול
                </div>
              </div>
            </div>

            {/* Drag Handle Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 shadow-lg flex items-center justify-center -translate-x-1/2"
              style={{ left: `${sliderPos}%`, backgroundColor: themeColor }}
            >
              <div
                className="w-8 h-8 rounded-full text-black flex items-center justify-center text-xs font-black shadow-xl"
                style={{ backgroundColor: themeColor }}
              >
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
          <div
            className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-1 text-xs font-black mb-2"
            style={{ color: themeColor }}
          >
            <Star className="w-4 h-4 fill-current" /> 4.9 כוכבים בביקורות לקוחות מאומתות
          </div>
          <h3 className="text-2xl font-black text-white">מה הלקוחות מספרים עלינו</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
          {testimonials.map((rev, idx) => (
            <div key={idx} className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-white text-sm">{rev.name}</span>
                <div className="flex" style={{ color: themeColor }}>
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                "{rev.comment}"
              </p>
              <span className="text-[10px] text-zinc-500 block">{rev.timeAgo || 'לאחרונה'} · לקוח מאומת ✓</span>
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
                className="w-full p-4 text-right flex items-center justify-between text-xs sm:text-sm font-black text-white hover:text-white/90 cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                  style={{ color: themeColor }}
                />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-white/5 font-sans">
                  {faq.answer}
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
          <span style={{ color: themeColor }}>מופעל ע״י The Cut Platform</span>
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

      {/* ============================================================ */}
      {/* 9. STICKY MOBILE BOTTOM BAR                                  */}
      {/* ============================================================ */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#1C1C1C]/95 backdrop-blur-md border-t border-white/10 p-3 flex items-center gap-2 shadow-2xl">
        <Link
          href={`/${slug}/booking`}
          className="flex-1 py-3 rounded-xl text-[#1C1C1C] font-black text-xs flex items-center justify-center gap-1.5 shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          <Calendar className="w-4 h-4" />
          <span>קביעת תור מהירה אונליין</span>
        </Link>
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`היי ${business.ownerName}, אני מעוניין לקבוע תור אצלך ב-${business.name}:`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg"
          aria-label="וואטסאפ"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
