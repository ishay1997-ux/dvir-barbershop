import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'המספרה של דביר – אריאל & רחובות',
    short_name: 'דביר מספרה',
    description: 'מערכת הזמנת תורים מהירה וניהול תספורות גברים במספרה של דביר',
    start_url: '/',
    display: 'standalone',
    background_color: '#1C1C1C',
    theme_color: '#C9A84C',
    lang: 'he',
    dir: 'rtl',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
