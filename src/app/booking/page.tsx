import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingWizard from '@/components/booking/BookingWizard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הזמנת תור | The Cut מספרה',
  description: 'הזמן תור בקלות ובמהירות – בחר שירות, ספר, תאריך ושעה. הזמנה אונליין 24/7.',
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ barber?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[#FAF7F2] pt-20">
        {/* Page header */}
        <div className="bg-[#1C1C1C] py-12 text-center">
          <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">הזמנה אונליין</span>
          <h1 className="text-4xl font-black text-white mt-2">הזמן תור</h1>
          <p className="text-[#9E9891] text-sm mt-2">תהליך פשוט ומהיר – 30 שניות בלבד</p>
        </div>

        <BookingWizard initialBarber={params?.barber} />
      </main>
      <Footer />
    </>
  );
}

