import { BusinessConfig } from '@/types/business';
import { DVIR_FLAGSHIP_CONFIG } from '@/config/dvir.config';

/**
 * Resolves a full, rich business configuration for any slug.
 * Always ensures the tenant has complete pricing, branches, FAQs, and reviews.
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessConfig> {
  const cleanSlug = (slug || 'dvir').trim().toLowerCase();

  // 1. Flagship Dvir
  if (cleanSlug === 'dvir' || cleanSlug === '') {
    return DVIR_FLAGSHIP_CONFIG;
  }

  // 2. Fetch from backend /api/admin/businesses
  try {
    const res = await fetch(`/api/admin/businesses?slug=${encodeURIComponent(cleanSlug)}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.business) {
        return mergeWithDefaults(data.business);
      }
    }
  } catch (err) {
    console.error('Failed to fetch business by slug:', err);
  }

  // Fallback if not found yet (e.g. freshly created)
  return mergeWithDefaults({
    id: `biz-${cleanSlug}`,
    name: cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1),
    slug: cleanSlug,
    ownerName: cleanSlug,
    phone: '052-000-0000',
    city: 'ישראל',
    slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן פרימיום',
    branchesCount: 1,
    status: 'active',
    plan: 'pro',
    services: [
      { name: 'תספורת גברים פרימיום', price: 80, duration: 30 },
      { name: 'עיצוב ופיסול זקן', price: 40, duration: 20 },
      { name: 'חבילת VIP משולבת', price: 110, duration: 45 },
    ],
    branches: [
      { name: 'סניף מרכזי', address: 'רחוב ראשי, ישראל' },
    ],
  });
}

function mergeWithDefaults(raw: Partial<BusinessConfig>): BusinessConfig {
  return {
    id: raw.id || `biz-${raw.slug || 'tenant'}`,
    name: raw.name || 'המספרה',
    slug: raw.slug || 'tenant',
    ownerName: raw.ownerName || 'מאסטר ברבר',
    phone: raw.phone || '052-123-4567',
    city: raw.city || 'ישראל',
    slogan: raw.slogan || 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר',
    announcement: raw.announcement || '🌟 קביעת תורים מהירה אונליין 24/7 – שריינו מראש!',
    themeColor: raw.themeColor || '#C9A84C',
    branchesCount: raw.branches?.length || raw.branchesCount || 1,
    status: (raw.status as any) || 'active',
    plan: (raw.plan as any) || 'pro',
    experienceYears: raw.experienceYears || 5,
    instagramHandle: raw.instagramHandle || `@${raw.slug || 'barber'}`,
    services: raw.services && raw.services.length > 0 ? raw.services : DVIR_FLAGSHIP_CONFIG.services,
    branches: raw.branches && raw.branches.length > 0 ? raw.branches : [
      {
        id: 'main',
        name: `סניף ראשי – ${raw.city || 'מרכז'}`,
        address: `${raw.city || 'ישראל'} (כתובת מלאה באפליקציית Waze)`,
        phone: raw.phone || '052-123-4567',
        hours: 'א׳-ה׳: 09:00-20:00 | ו׳: 08:30-14:00',
        wazeLink: `https://waze.com/ul?q=${encodeURIComponent(raw.city || 'ישראל')}`,
      },
    ],
    testimonials: raw.testimonials || DVIR_FLAGSHIP_CONFIG.testimonials,
    faqs: raw.faqs || DVIR_FLAGSHIP_CONFIG.faqs,
  };
}
