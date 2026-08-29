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

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const business = await getBusinessBySlug('dvir');

  return (
    <>
      <Header business={business} />
      <main id="main-content">
        {/* 1. Sleek Hero Banner Hub: Cover Image, Monogram Logo, Waze, WhatsApp & 4 Action Pills */}
        <BarbershopHeroHub business={business} />

        {/* 2. Side-by-Side Clean Price List & Recent Haircuts Gallery */}
        <PriceListAndGallerySection business={business} />

        {/* 3. About Master Barber Dvir (Bio, Experience, Philosophy) */}
        <div id="about">
          <BarberShowcase business={business} />
        </div>

        {/* 4. Interactive Branch Maps & One-Tap Waze Navigation (Ariel & Rehovot) */}
        <BranchNavigationSection business={business} />

        {/* 5. Interactive Before & After Transformation Slider */}
        <BeforeAfterSection business={business} />

        {/* 6. Customer Testimonials & 4.9★ Google Reviews */}
        <ReviewsSection business={business} />

        {/* 7. Frequently Asked Questions (FAQ) */}
        <div id="faq">
          <FaqSection business={business} />
        </div>
      </main>
      <Footer business={business} />
    </>
  );
}
