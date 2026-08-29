import { BusinessConfig } from '@/types/business';
import { DVIR_FLAGSHIP_CONFIG } from '@/config/dvir.config';
import { generateTailoredBusinessConfig } from '@/lib/archetypes';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Resolves a full, rich business configuration for any slug.
 * Always ensures the tenant has complete pricing, branches, FAQs, and reviews.
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessConfig> {
  const cleanSlug = (slug || 'dvir').trim().toLowerCase();

  // 1. Direct Firestore fetch on Client (Zero-delay, bypasses serverless cache/network blips)
  if (typeof window !== 'undefined' && isFirebaseConfigured && db) {
    try {
      // Check direct document ID (biz-dvir or biz-[slug])
      const directDocRef = doc(db, 'businesses', `biz-${cleanSlug}`);
      const directSnap = await getDoc(directDocRef);
      if (directSnap.exists()) {
        return mergeWithDefaults(directSnap.data() as Partial<BusinessConfig>, cleanSlug === 'dvir' || cleanSlug === 'thecut' ? DVIR_FLAGSHIP_CONFIG : undefined);
      }

      // Query by slug field
      const q = query(collection(db, 'businesses'), where('slug', '==', cleanSlug));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        return mergeWithDefaults(qSnap.docs[0].data() as Partial<BusinessConfig>, cleanSlug === 'dvir' || cleanSlug === 'thecut' ? DVIR_FLAGSHIP_CONFIG : undefined);
      }
    } catch (dbErr) {
      console.warn('Direct Firestore client read fallback:', dbErr);
    }
  }

  // 2. Fetch from backend /api/admin/businesses
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
    console.error('Failed to fetch business by slug via API:', err);
  }

  // 3. Default fallbacks if network fails
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
    announcement: raw.announcement !== undefined ? raw.announcement : base.announcement,
    themeColor: raw.themeColor || base.themeColor,
    branchesCount: raw.branches?.length || raw.branchesCount || base.branchesCount,
    status: (raw.status as any) || 'active',
    plan: (raw.plan as any) || base.plan,
    experienceYears: raw.experienceYears || base.experienceYears || 5,
    instagramHandle: raw.instagramHandle || base.instagramHandle,
    instagramUrl: raw.instagramUrl || base.instagramUrl,
    facebookUrl: raw.facebookUrl || base.facebookUrl,
    tiktokUrl: raw.tiktokUrl || base.tiktokUrl,
    wazeUrl: raw.wazeUrl || base.wazeUrl,
    whatsappNumber: raw.whatsappNumber || base.whatsappNumber,
    websiteUrl: raw.websiteUrl || base.websiteUrl,
    avatarUrl: raw.avatarUrl !== undefined ? raw.avatarUrl : base.avatarUrl,
    galleryImages: Array.isArray(raw.galleryImages) ? raw.galleryImages : base.galleryImages,
    heroImages: Array.isArray(raw.heroImages) ? raw.heroImages : base.heroImages,
    services: raw.services && raw.services.length > 0 ? raw.services : base.services,
    branches: raw.branches && raw.branches.length > 0 ? raw.branches : base.branches,
    testimonials: raw.testimonials && raw.testimonials.length > 0 ? raw.testimonials : base.testimonials,
    faqs: raw.faqs && raw.faqs.length > 0 ? raw.faqs : base.faqs,
    layout: {
      bgTheme: raw.layout?.bgTheme || base.layout?.bgTheme || 'dark-obsidian',
      heroStyle: raw.layout?.heroStyle || base.layout?.heroStyle || 'hub-monogram',
      servicesStyle: raw.layout?.servicesStyle || base.layout?.servicesStyle || 'split-gallery',
      cardStyle: raw.layout?.cardStyle || base.layout?.cardStyle || 'glass',
      showBeforeAfter: raw.layout?.showBeforeAfter !== undefined ? raw.layout.showBeforeAfter : true,
      showReviews: raw.layout?.showReviews !== undefined ? raw.layout.showReviews : true,
      showFaqs: raw.layout?.showFaqs !== undefined ? raw.layout.showFaqs : true,
      showBranches: raw.layout?.showBranches !== undefined ? raw.layout.showBranches : true,
      showBio: raw.layout?.showBio !== undefined ? raw.layout.showBio : true,
    },
  };
}

