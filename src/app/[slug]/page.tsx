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
        <p className="text-xs text-[#9E9891] font-bold">טוען את המספרה...</p>
      </div>
    );
  }

  if (notFound && slug !== 'dvir' && slug !== 'thecut') {
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
          backgroundColor: '#FAF7F2',
          backgroundImage: `
            radial-gradient(ellipse 90% 50% at 50% 0%, ${themeColor}18, transparent 70%),
            radial-gradient(ellipse 70% 50% at 100% 40%, ${themeColor}10, transparent 70%),
            radial-gradient(ellipse 70% 50% at 0% 80%, ${themeColor}10, transparent 70%),
            linear-gradient(to bottom, #FAF7F2, #F4EFE6 100%)
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

  const sectionMap: Record<string, React.ReactNode> = {
    hero: <BarbershopHeroHub business={business || undefined} />,
    services: <PriceListAndGallerySection business={business || undefined} />,
    bio: business?.layout?.showBio !== false ? (
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
    reviews: business?.layout?.showReviews !== false ? (
      <ReviewsSection business={business || undefined} />
    ) : null,
    faqs: business?.layout?.showFaqs !== false ? (
      <div id="faq">
        <FaqSection business={business || undefined} />
      </div>
    ) : null,
  };

  const defaultOrder = ['hero', 'services', 'bio', 'branches', 'gallery', 'reviews', 'faqs'];
  const activeOrder = business?.layout?.sectionsOrder || defaultOrder;
  const borderRadius = business?.layout?.borderRadius || 'modern-rounded';
  const fontStyle = business?.layout?.fontStyle || 'urban-bold';

  return (
    <div
      className={`min-h-screen transition-colors duration-500 theme-${bgTheme} ${bgTheme === 'luxury-light' ? 'theme-luxury-light' : ''} radius-${borderRadius} font-mood-${fontStyle}`}
      style={bgStyles}
    >
      {/* Flagship Demo Top Ribbon */}
      {(isDvir || slug === 'demo') && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-2 px-4 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md sticky top-0 z-50 border-b border-indigo-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span>🎯 אתר הדגמה חי (Flagship Showcase) · התנסו בקביעת תור עצמאית</span>
          </div>
          <Link
            href="/admin?demo=true"
            className="py-1 px-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] transition-transform hover:scale-105 shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>כניסה לדאשבורד הניהול של העסק ↗</span>
          </Link>
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
