import type { Metadata, Viewport } from 'next';
import { Heebo, Playfair_Display } from 'next/font/google';
import SkipToContent from '@/components/accessibility/SkipToContent';
import AccessibilityWidget from '@/components/accessibility/AccessibilityWidget';
import { ToastProvider } from '@/components/common/ToastProvider';
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
  title: 'המספרה של דביר · עיצוב שיער גברים, פיידים וזקן | אריאל & רחובות',
  description: 'המספרה של דביר – מספרת גברים מובילה באריאל וברחובות. תספורות פייד מדויקות, פיסול זקן וטיפולי VIP. הזמנת תור אונליין מהירה 24/7.',
  keywords: ['המספרה של דביר', 'דביר מספרה', 'מספרה באריאל', 'מספרה ברחובות', 'תספורת גברים', 'עיצוב זקן', 'הזמנת תור', 'The Cut'],
  authors: [{ name: 'דביר - מספרה לגברים' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'המספרה של דביר · אריאל & רחובות',
    description: 'תספורות גברים ברמה הגבוהה ביותר בישראל. הזמינו תור אונליין בקלות!',
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
  url: 'https://thecut-reg-in.vercel.app',
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
        <ToastProvider>
          <SkipToContent />
          {children}
          <AccessibilityWidget />
        </ToastProvider>
      </body>
    </html>
  );
}

