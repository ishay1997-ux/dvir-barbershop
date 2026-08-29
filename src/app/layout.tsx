import type { Metadata, Viewport } from 'next';
import { Heebo, Playfair_Display } from 'next/font/google';
import SkipToContent from '@/components/accessibility/SkipToContent';
import AccessibilityWidget from '@/components/accessibility/AccessibilityWidget';
import { ToastProvider } from '@/components/common/ToastProvider';
import { AuthProvider } from '@/contexts/AuthContext';
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
  metadataBase: new URL('https://thecut-reg-in.vercel.app'),
  title: {
    default: 'המספרה של דביר · עיצוב שיער גברים, פיידים וזקן | אריאל & רחובות',
    template: '%s | המספרה של דביר',
  },
  description: 'המספרה של דביר – מספרת גברים מובילה באריאל וברחובות. תספורות פייד מדויקות, פיסול זקן וטיפולי VIP. הזמנת תור אונליין מהירה 24/7.',
  keywords: ['המספרה של דביר', 'דביר מספרה', 'מספרה באריאל', 'מספרה ברחובות', 'תספורת גברים', 'עיצוב זקן', 'הזמנת תור', 'The Cut'],
  authors: [{ name: 'דביר - מספרה לגברים' }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'המספרה של דביר · אריאל & רחובות',
    description: 'תספורות גברים ברמה הגבוהה ביותר בישראל. שריינו תור אונליין בקלות 24/7!',
    url: 'https://thecut-reg-in.vercel.app',
    siteName: 'The Cut · המספרה של דביר',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'המספרה של דביר – אריאל ורחובות',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'המספרה של דביר · אריאל & רחובות',
    description: 'תספורות גברים ברמה הגבוהה ביותר בישראל. שריינו תור אונליין בקלות 24/7!',
    images: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&h=630&fit=crop&q=80'],
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
        <AuthProvider>
          <ToastProvider>
            <SkipToContent />
            {children}
            <AccessibilityWidget />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
