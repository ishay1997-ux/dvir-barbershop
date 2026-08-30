import { BusinessConfig } from '@/types/business';
import { DVIR_FLAGSHIP_CONFIG } from '@/config/dvir.config';
import { generateTailoredBusinessConfig } from '@/lib/archetypes';
import { INDUSTRY_PRESETS, IndustryPreset } from '@/lib/industry-presets';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export function presetToBusinessConfig(preset: IndustryPreset, slug: string): BusinessConfig {
  return {
    id: `biz-${preset.id}`,
    name: preset.shopName,
    slug: slug,
    ownerName: preset.ownerName,
    phone: '054-888-9999',
    city:
      preset.id === 'barbershop'
        ? 'אריאל & רחובות'
        : preset.id === 'nails-beauty'
        ? 'ראשון לציון'
        : preset.id === 'home-technician'
        ? 'מרכז והשרון'
        : preset.id === 'fitness-trainer'
        ? 'הרצליה פיתוח'
        : preset.id === 'spa-massage'
        ? 'רמת השרון'
        : preset.id === 'clinics-aesthetics'
        ? 'תל אביב'
        : 'תל אביב',
    slogan: preset.slogan,
    announcement: preset.announcement,
    themeColor: preset.themeColor,
    branchesCount: preset.showBranches ? 2 : 1,
    status: 'active',
    plan: 'pro',
    experienceYears: 7,
    instagramHandle: preset.id,
    whatsappNumber: '0548889999',
    category: (preset.id === 'barbershop' ? 'barber' : preset.id === 'nails-beauty' ? 'beauty_salon' : preset.id === 'spa-massage' ? 'clinic_therapist' : preset.id === 'fitness-trainer' ? 'private_instructor' : preset.id === 'home-technician' ? 'home_technician' : 'barber') as any,
    services: preset.services,
    transformations: preset.transformations,
    branches: [
      {
        id: 'branch-1',
        name: 'סניף מרכזי',
        address: 'רחוב הרצל 45, מרכז העיר',
        phone: '054-888-9999',
        wazeLink: 'https://waze.com/ul?q=herzel+45',
        hours: 'א׳-ה׳: 09:00-20:00, ו׳: 08:30-14:30',
      },
    ],
    testimonials: [
      {
        id: 't-1',
        name: 'עומר לוי',
        comment: 'שירות מדהים, מקצועיות ללא פשרות וזמינות תורים מושלמת!',
        rating: 5,
        timeAgo: 'לפני 3 ימים',
        serviceUsed: preset.services[0]?.name,
      },
      {
        id: 't-2',
        name: 'מאיה דניאל',
        comment: 'האתר והחוויה כולה ברמה בינלאומית, פשוט תענוג להזמין תור.',
        rating: 5,
        timeAgo: 'לפני שבוע',
        serviceUsed: preset.services[1]?.name || preset.services[0]?.name,
      },
      {
        id: 't-3',
        name: 'יוסי כהן',
        comment: 'מדויק על הדקה, בלי לחכות בתור. ממליץ בחום לכולם!',
        rating: 5,
        timeAgo: 'לפני שבועיים',
        serviceUsed: preset.services[0]?.name,
      },
    ],
    faqs: preset.faqs,
    layout: {
      bgTheme: preset.bgTheme,
      heroStyle: preset.heroStyle,
      servicesStyle: preset.servicesStyle,
      cardStyle: 'glass',
      cardRadius: preset.cardRadius || 'smooth',
      galleryStyle: preset.galleryStyle,
      typographyMood: preset.typographyMood || 'modern-clean',
      borderRadius: preset.borderRadius || 'modern-rounded',
      fontStyle: preset.fontStyle || 'urban-bold',
      showBeforeAfter: preset.showBeforeAfter !== false,
      showReviews: true,
      showFaqs: true,
      showBranches: preset.showBranches !== false,
      showBio: preset.showBio !== false,
      showTrustBadges: true,
      showPolicies: true,
      sectionsOrder: preset.sectionsOrder || [
        'hero',
        'announcement',
        'trust-badges',
        'services',
        'gallery',
        'bio',
        'policies',
        'branches',
        'reviews',
        'faqs',
      ],
      trustBadges: preset.trustBadges,
      sectionTitles: preset.sectionTitles,
    },
  };
}

/**
 * Resolves a full, rich business configuration for any slug.
 * Always ensures the tenant has complete pricing, branches, FAQs, and reviews.
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessConfig> {
  const cleanSlug = (slug || 'dvir').trim().toLowerCase();

  // 0. Check for Known Flagship Demos and Industry Presets
  if (cleanSlug === 'dvir' || cleanSlug === 'thecut') {
    let localStoreOverlay: any = null;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('thecut_settings');
        if (stored) {
          localStoreOverlay = JSON.parse(stored);
        }
      } catch (_) {}
    }
    return localStoreOverlay ? mergeWithDefaults(localStoreOverlay, DVIR_FLAGSHIP_CONFIG) : DVIR_FLAGSHIP_CONFIG;
  }

  // Check Niche Aliases
  const presetMap: Record<string, string> = {
    beauty: 'nails-beauty',
    nails: 'nails-beauty',
    cosmetics: 'nails-beauty',
    'nails-beauty': 'nails-beauty',
    spa: 'spa-massage',
    massage: 'spa-massage',
    'spa-massage': 'spa-massage',
    trainer: 'fitness-trainer',
    fitness: 'fitness-trainer',
    'fitness-trainer': 'fitness-trainer',
    clinic: 'clinics-aesthetics',
    aesthetics: 'clinics-aesthetics',
    'clinics-aesthetics': 'clinics-aesthetics',
    services: 'home-technician',
    tech: 'home-technician',
    'home-technician': 'home-technician',
    plumber: 'home-technician',
    ac: 'home-technician',
    tattoo: 'tattoo-piercing',
    'tattoo-piercing': 'tattoo-piercing',
    barber: 'barbershop',
    barbershop: 'barbershop',
  };

  if (presetMap[cleanSlug]) {
    const targetPresetId = presetMap[cleanSlug];
    const foundPreset = INDUSTRY_PRESETS.find((p) => p.id === targetPresetId);
    if (foundPreset) {
      return presetToBusinessConfig(foundPreset, cleanSlug);
    }
  }

  // 1. Direct Firestore fetch on Client (Zero-delay, bypasses serverless cache/network blips)
  if (typeof window !== 'undefined' && isFirebaseConfigured && db) {
    try {
      // Check direct document ID (biz-dvir or biz-[slug])
      const directDocRef = doc(db, 'businesses', `biz-${cleanSlug}`);
      const directSnap = await getDoc(directDocRef);
      if (directSnap.exists()) {
        return mergeWithDefaults(directSnap.data() as Partial<BusinessConfig>);
      }

      // Query by slug field
      const q = query(collection(db, 'businesses'), where('slug', '==', cleanSlug));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        return mergeWithDefaults(qSnap.docs[0].data() as Partial<BusinessConfig>);
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
        return mergeWithDefaults(data.business);
      }
    }
  } catch (err) {
    console.error('Failed to fetch business by slug via API:', err);
  }

  // 3. Default fallback if not found
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

