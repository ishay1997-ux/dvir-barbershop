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
import TrustBadgesSection from '@/components/landing/TrustBadgesSection';
import BookingPoliciesSection from '@/components/landing/BookingPoliciesSection';
import TopAnnouncementBanner from '@/components/common/TopAnnouncementBanner';
import MobileStickyBar from '@/components/layout/MobileStickyBar';
import { Scissors, Phone, MessageCircle, Calendar, Sparkles, Globe } from 'lucide-react';
import { BusinessConfig } from '@/types/business';
import { getBusinessBySlug } from '@/lib/business-service';
import { DVIR_FLAGSHIP_CONFIG } from '@/config/dvir.config';
import { LiveCustomizerDrawer } from '@/components/landing/LiveCustomizerDrawer';

export default function DynamicBusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase().trim();

  const isDvir = slug === 'dvir' || slug === 'thecut';
  const isFlagshipDemo = isDvir || slug === 'demo' || [
    'beauty',
    'nails',
    'cosmetics',
    'cosmetics-aesthetician',
    'glow',
    'skin',
    'nails-beauty',
    'spa',
    'massage',
    'spa-massage',
    'trainer',
    'fitness',
    'fitness-trainer',
    'clinic',
    'aesthetics',
    'clinics-aesthetics',
    'services',
    'tech',
    'home-technician',
    'plumber',
    'ac',
    'tattoo',
    'tattoo-piercing',
    'barber',
    'barbershop',
  ].includes(slug);

  const [business, setBusiness] = useState<BusinessConfig | null>(isDvir ? DVIR_FLAGSHIP_CONFIG : null);
  const [loading, setLoading] = useState(!isDvir);
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
        <p className="text-xs text-zinc-400 font-bold">טוען את אתר ההדגמה...</p>
      </div>
    );
  }

  if (notFound && !isFlagshipDemo) {
    return (
      <div className="min-h-screen bg-[#0E131F] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-indigo-500/20 shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
              <span>כתובת פנויה ב-CutWeb</span>
              <span className="font-mono text-white" dir="ltr">/{slug}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              עסק זה עדיין לא קיים במערכת
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              הכתובת שחיפשת פנויה. רוצה להקים אתר יוקרתי, יומן חכם ומערכת תורים אוטונומית לעסק שלך תוך 60 שניות?
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-right space-y-2">
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>מה מקבלים בחינם במסלול Starter?</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 pr-3 list-disc">
              <li>אתר הזמנות מעוצב ומותאם אישית לנייד</li>
              <li>יומן ניהול תורים חכם עם גרירה (Drag & Drop)</li>
              <li>אישורי הגעה ותזכורות WhatsApp בלחיצה</li>
              <li>כרטיס לקוח ומיני-CRM ללא תשלום</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>הקמת עסק בחינם ב-CutWeb</span>
            </Link>
            <Link
              href="/dvir"
              className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <span>צפייה בדמו לדוגמה</span>
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
      case 'lavender-mist':
        return {
          backgroundColor: '#FAF7FD',
          backgroundImage: `
            radial-gradient(ellipse 90% 50% at 50% 0%, ${themeColor}25, transparent 70%),
            radial-gradient(ellipse 70% 50% at 100% 40%, #DDD6FE35, transparent 70%),
            radial-gradient(ellipse 70% 50% at 0% 80%, #C4B5FD30, transparent 70%),
            linear-gradient(to bottom, #FAF7FD, #F3ECFA 100%)
          `,
        };
      case 'botanical-sage':
        return {
          backgroundColor: '#F4FAF6',
          backgroundImage: `
            radial-gradient(ellipse 90% 50% at 50% 0%, ${themeColor}25, transparent 70%),
            radial-gradient(ellipse 70% 50% at 100% 40%, #A7F3D035, transparent 70%),
            radial-gradient(ellipse 70% 50% at 0% 80%, #6EE7B728, transparent 70%),
            linear-gradient(to bottom, #F4FAF6, #EBF5EF 100%)
          `,
        };
      case 'brand-midnight':
        return {
          backgroundColor: '#070D1A',
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 50% 0%, ${themeColor}40, transparent 75%),
            radial-gradient(ellipse 70% 50% at 100% 40%, #1E3A8A30, transparent 70%),
            radial-gradient(ellipse 70% 50% at 0% 80%, #1E3A8A25, transparent 70%),
            linear-gradient(to bottom, #070D1A, #04070E 100%)
          `,
        };
      case 'luxury-light':
        return {
          backgroundColor: '#FAF7F2',
          backgroundImage: `
            radial-gradient(ellipse 90% 50% at 50% 0%, ${themeColor}22, transparent 70%),
            radial-gradient(ellipse 70% 50% at 100% 40%, #FDE68A20, transparent 70%),
            radial-gradient(ellipse 70% 50% at 0% 80%, #FCD34D15, transparent 70%),
            linear-gradient(to bottom, #FAF7F2, #F3EDE2 100%)
          `,
        };
      case 'cyber-carbon':
        return {
          backgroundColor: '#060709',
          backgroundImage: `
            radial-gradient(circle at 50% 15%, ${themeColor}35, transparent 65%),
            radial-gradient(circle at 100% 80%, ${themeColor}20, transparent 50%),
            radial-gradient(circle at 0% 50%, ${themeColor}20, transparent 50%),
            linear-gradient(to bottom, #060709, #0A0D12 100%)
          `,
        };
      case 'dark-obsidian':
      default:
        return {
          backgroundColor: '#0D0D11',
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 0%, ${themeColor}22, transparent 70%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${themeColor}15, transparent 70%),
            radial-gradient(ellipse 60% 40% at 0% 70%, ${themeColor}15, transparent 70%),
            linear-gradient(to bottom, #0D0D11, #131318 100%)
          `,
        };
    }
  })();

  const sectionMap: Record<string, React.ReactNode> = {
    hero: <BarbershopHeroHub business={business || undefined} />,
    services: <PriceListAndGallerySection business={business || undefined} />,
    'booking-action-cards': null,
    'trust-badges': business?.layout?.showTrustBadges !== false ? (
      <TrustBadgesSection business={business || undefined} />
    ) : null,
    policies: business?.layout?.showPolicies !== false ? (
      <BookingPoliciesSection business={business || undefined} />
    ) : null,
    bio: business?.layout?.showBio !== false ? (
      <div id="about">
        <BarberShowcase business={business || undefined} />
      </div>
    ) : null,
    about: business?.layout?.showBio !== false ? (
      <div id="about">
        <BarberShowcase business={business || undefined} />
      </div>
    ) : null,
    branches: business?.layout?.showBranches !== false ? (
      <BranchNavigationSection business={business || undefined} />
    ) : null,
    gallery: business?.layout?.showBeforeAfter !== false ? (
      <BeforeAfterSection business={business || undefined} />
    ) : null,
    'before-after': business?.layout?.showBeforeAfter !== false ? (
      <BeforeAfterSection business={business || undefined} />
    ) : null,
    reviews: business?.layout?.showReviews !== false ? (
      <ReviewsSection business={business || undefined} />
    ) : null,
    faqs: business?.layout?.showFaqs !== false ? (
      <div id="faq">
        <FaqSection business={business || undefined} />
      </div>
    ) : null,
    faq: business?.layout?.showFaqs !== false ? (
      <div id="faq">
        <FaqSection business={business || undefined} />
      </div>
    ) : null,
    announcement: business?.layout?.showAnnouncement !== false && business?.announcement ? (
      <TopAnnouncementBanner
        announcement={business.announcement}
        themeColor={themeColor}
        link={business.layout?.announcementLink}
      />
    ) : null,
  };

  const defaultOrder = ['hero', 'trust-badges', 'services', 'bio', 'policies', 'branches', 'gallery', 'reviews', 'faqs'];
  const activeOrder = (business?.layout?.sectionsOrder && business.layout.sectionsOrder.length > 0)
    ? business.layout.sectionsOrder
    : defaultOrder;

  const borderRadius =
    business?.layout?.borderRadius ||
    (business?.layout?.cardRadius === 'sharp'
      ? 'sharp-luxury'
      : business?.layout?.cardRadius === 'pill'
      ? 'classic-soft'
      : 'modern-rounded');

  const fontStyle =
    business?.layout?.fontStyle ||
    (business?.layout?.typographyMood === 'luxury-serif'
      ? 'luxury-serif'
      : business?.layout?.typographyMood === 'urban-bold'
      ? 'urban-bold'
      : 'modern-sans');

  return (
    <div
      className={`min-h-screen transition-colors duration-500 theme-${bgTheme} ${bgTheme === 'luxury-light' ? 'theme-luxury-light' : ''} radius-${borderRadius} font-mood-${fontStyle}`}
      style={bgStyles}
    >
      {/* Top Announcement Banner (Rendered at top if not explicitly ordered in activeOrder) */}
      {business?.layout?.showAnnouncement !== false && business?.announcement && !activeOrder.includes('announcement') && (
        <TopAnnouncementBanner
          announcement={business.announcement}
          themeColor={themeColor}
          link={business.layout?.announcementLink}
        />
      )}

      {/* Flagship Demo Top Ribbon */}
      {isFlagshipDemo && (
        <div
          id="flagship-demo-topbar"
          className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-2 px-4 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-lg sticky top-0 z-50 border-b border-indigo-500/30 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0 shadow-xs" />
            <span className="text-zinc-200">
              <strong className="text-white font-black">אתר הדגמה חי (Showcase)</strong> · התנסו בקביעת תור והתאמה אישית
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/"
              id="back-to-marketing-site"
              className="py-1 px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 text-white font-bold text-[11px] transition-all hover:scale-105 shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="מעבר לאתר הראשי ולמידע על פלטפורמת TheCut"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-300" />
              <span>לאתר המערכת הראשי</span>
            </Link>

            <Link
              href={`/admin?slug=${slug}&demo=true`}
              id="open-demo-admin-dashboard"
              className="py-1 px-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] transition-transform hover:scale-105 shadow-md flex items-center gap-1.5 cursor-pointer border border-indigo-400/40"
              title="כניסה לדאשבורד הניהול לדוגמה"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>דאשבורד ניהול לעסק ↗</span>
            </Link>
          </div>
        </div>
      )}
      <Header business={business || undefined} />
      <main
        id="main-content"
        className="relative overflow-hidden transition-colors duration-500"
      >
        {activeOrder.map((sectionKey) => (
          <div key={sectionKey}>
            {sectionMap[sectionKey]}
          </div>
        ))}
      </main>
      <Footer business={business || undefined} />

      {/* Sticky Mobile Floating Booking Bar */}
      <MobileStickyBar business={business || undefined} />

      {/* Real-time Interactive Customizer Studio for Live Demo & Preview */}
      {business && (
        <LiveCustomizerDrawer
          business={business}
          onChangeBusiness={(updated) => setBusiness(updated)}
        />
      )}
    </div>
  );
}
