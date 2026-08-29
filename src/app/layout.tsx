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
  title: 'The Cut · פלטפורמת זימון תורים חכמה למספרות ועסקים',
  description: 'The Cut – מערכת זימון תורים אולטרה-מהירה, ניהול יומן מתקדם וסנכרון ענן מלא למספרות, ברברשופים ומעצבי שיער בישראל.',
  keywords: ['The Cut', 'זימון תורים', 'מערכת תורים למספרה', 'ברבר שופ', 'תספורת גברים', 'עיצוב שיער', 'הזמנת תור אונליין', 'ניהול יומן'],
  authors: [{ name: 'The Cut Technologies' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'The Cut · פלטפורמת זימון תורים חכמה למספרות',
    description: 'מערכת זימון תורים אולטרה-מהירה וניהול יומן חכם למספרות המובילות בישראל.',
    locale: 'he_IL',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'The Cut Platform',
  applicationCategory: 'BusinessApplication',
  description: 'פלטפורמת זימון תורים חכמה וניהול יומן למספרות ועסקים בישראל',
  url: 'https://dvir-barbershop-reg-in.vercel.app',
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

