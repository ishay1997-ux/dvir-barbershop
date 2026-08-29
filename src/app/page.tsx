import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BarbershopHeroHub from '@/components/landing/BarbershopHeroHub';
import PriceListAndGallerySection from '@/components/landing/PriceListAndGallerySection';
import BarberShowcase from '@/components/landing/BarberShowcase';
import BranchNavigationSection from '@/components/landing/BranchNavigationSection';
import BeforeAfterSection from '@/components/landing/BeforeAfterSection';
import ReviewsSection from '@/components/landing/ReviewsSection';
import FaqSection from '@/components/landing/FaqSection';
import ContactSection from '@/components/landing/ContactSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* 1. Reference-Inspired Top Hero Banner, Action Circles & 4 Action Pills */}
        <BarbershopHeroHub />

        {/* 2. Side-by-Side Clean Price List & Haircuts Gallery */}
        <PriceListAndGallerySection />

        {/* 3. Master Barber Spotlight & Story */}
        <div id="about">
          <BarberShowcase />
        </div>

        {/* 4. Interactive Map & Waze Navigation for Ariel & Rehovot */}
        <BranchNavigationSection />

        {/* 5. Before & After Transformation Slider */}
        <BeforeAfterSection />

        {/* 6. Customer Reviews & Testimonials */}
        <ReviewsSection />

        {/* 7. Frequently Asked Questions */}
        <FaqSection />

        {/* 8. Contact & Social Links */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
