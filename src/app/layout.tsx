import type { Metadata, Viewport } from 'next';
import { Heebo, Playfair_Display } from 'next/font/google';
import SkipToContent from '@/components/accessibility/SkipToContent';
import AccessibilityWidget from '@/components/accessibility/AccessibilityWidget';
import './globals.css';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-heebo',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'The Cut | מספרה פרימיום בתל אביב',
  description: 'מספרה מקצועית בתל אביב – תספורות גברים, עיצוב זקן, גילוח קלאסי. הזמן תור אונליין 24/7.',
  keywords: ['מספרה', 'תל אביב', 'תספורת גברים', 'עיצוב זקן', 'הזמנת תור', 'ברבר שופ', 'מספרה נגישה'],
  authors: [{ name: 'The Cut Barbershop' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'The Cut | מספרה פרימיום',
    description: 'מספרה מקצועית – תספורות, זקן, גילוח קלאסי. הזמן תור עכשיו!',
    locale: 'he_IL',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: 'The Cut',
  description: 'מספרה פרימיום בתל אביב',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'רחוב הרצל 1',
    addressLocality: 'תל אביב',
    addressCountry: 'IL',
  },
  telephone: '052-000-0000',
  url: 'https://thecut.co.il',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Thursday'], opens: '09:00', closes: '21:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '08:00', closes: '14:00' },
  ],
  priceRange: '₪₪',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <SkipToContent />
        {children}
        <AccessibilityWidget />
      </body>
    </html>
  );
}

