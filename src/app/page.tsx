import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BarbershopHeroHub from '@/components/landing/BarbershopHeroHub';
import PriceListAndGallerySection from '@/components/landing/PriceListAndGallerySection';
import BarberShowcase from '@/components/landing/BarberShowcase';
import BranchNavigationSection from '@/components/landing/BranchNavigationSection';
import BeforeAfterSection from '@/components/landing/BeforeAfterSection';
import ReviewsSection from '@/components/landing/ReviewsSection';
import FaqSection from '@/components/landing/FaqSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* 1. Sleek Hero Banner Hub: Cover Image, Monogram Logo, Waze, WhatsApp & 4 Action Pills */}
        <BarbershopHeroHub />

        {/* 2. Side-by-Side Clean Price List & Recent Haircuts Gallery */}
        <PriceListAndGallerySection />

        {/* 3. About Master Barber Dvir (Bio, Experience, Philosophy) */}
        <div id="about">
          <BarberShowcase />
        </div>

        {/* 4. Interactive Branch Maps & One-Tap Waze Navigation (Ariel & Rehovot) */}
        <BranchNavigationSection />

        {/* 5. Interactive Before & After Transformation Slider */}
        <BeforeAfterSection />

        {/* 6. Customer Testimonials & 4.9★ Google Reviews */}
        <ReviewsSection />

        {/* 7. Frequently Asked Questions (FAQ) */}
        <div id="faq">
          <FaqSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
