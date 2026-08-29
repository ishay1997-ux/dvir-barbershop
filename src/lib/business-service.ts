import { BusinessConfig } from '@/types/business';
import { DVIR_FLAGSHIP_CONFIG } from '@/config/dvir.config';
import { generateTailoredBusinessConfig } from '@/lib/archetypes';

/**
 * Resolves a full, rich business configuration for any slug.
 * Always ensures the tenant has complete pricing, branches, FAQs, and reviews.
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessConfig> {
  const cleanSlug = (slug || 'dvir').trim().toLowerCase();

  // 1. Fetch from backend /api/admin/businesses (includes custom saved colors, pricing, branches)
  try {
    const res = await fetch(`/api/admin/businesses?slug=${encodeURIComponent(cleanSlug)}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.business) {
        return mergeWithDefaults(data.business, cleanSlug === 'dvir' || cleanSlug === 'thecut' ? DVIR_FLAGSHIP_CONFIG : undefined);
      }
    }
  } catch (err) {
    console.error('Failed to fetch business by slug:', err);
  }

  // 2. Default fallbacks if network fails
  if (cleanSlug === 'dvir' || cleanSlug === 'thecut') {
    return DVIR_FLAGSHIP_CONFIG;
  }

  return generateTailoredBusinessConfig({
    name: cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1),
    slug: cleanSlug,
    ownerName: cleanSlug,
    phone: '052-000-0000',
    city: 'ישראל',
  });
}

function mergeWithDefaults(raw: Partial<BusinessConfig>, fallbackBase?: BusinessConfig): BusinessConfig {
  const base = fallbackBase || generateTailoredBusinessConfig({
    name: raw.name || 'המספרה',
    slug: raw.slug || 'tenant',
    ownerName: raw.ownerName || 'מאסטר ברבר',
    phone: raw.phone || '052-123-4567',
    city: raw.city || 'ישראל',
    themeColor: raw.themeColor,
    plan: raw.plan as any,
    instagramHandle: raw.instagramHandle,
  });

  return {
    ...base,
    ...raw,
    id: raw.id || base.id,
    name: raw.name || base.name,
    slug: raw.slug || base.slug,
    ownerName: raw.ownerName || base.ownerName,
    phone: raw.phone || base.phone,
    city: raw.city || base.city,
    slogan: raw.slogan || base.slogan,
    announcement: raw.announcement || base.announcement,
    themeColor: raw.themeColor || base.themeColor,
    branchesCount: raw.branches?.length || raw.branchesCount || base.branchesCount,
    status: (raw.status as any) || 'active',
    plan: (raw.plan as any) || base.plan,
    experienceYears: raw.experienceYears || base.experienceYears || 5,
    instagramHandle: raw.instagramHandle || base.instagramHandle,
    services: raw.services && raw.services.length > 0 ? raw.services : base.services,
    branches: raw.branches && raw.branches.length > 0 ? raw.branches : base.branches,
    testimonials: raw.testimonials && raw.testimonials.length > 0 ? raw.testimonials : base.testimonials,
    faqs: raw.faqs && raw.faqs.length > 0 ? raw.faqs : base.faqs,
  };
}

