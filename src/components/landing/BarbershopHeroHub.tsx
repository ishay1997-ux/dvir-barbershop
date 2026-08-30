'use client';

import { useState } from 'react';
import { SHOP_INFO } from '@/lib/utils';
import { createCustomerInquiryUrl } from '@/lib/whatsapp';
import { INITIAL_BRANCHES } from '@/lib/store';
import { BusinessConfig } from '@/types/business';
import { OpeningHoursModal, MyAppointmentsModal, ShareBarbershopModal } from './QuickModals';
import { HubMonogramHero } from './hero/HubMonogramHero';
import { SplitCinemaHero } from './hero/SplitCinemaHero';
import { MinimalistVipHero } from './hero/MinimalistVipHero';
import { HeroSharedProps } from './hero/hero-types';
import { getIndustryMeta } from '@/lib/industry-terminology';

export default function BarbershopHeroHub({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isWazeBranchOpen, setIsWazeBranchOpen] = useState(false);

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'דביר עיצוב שיער לגברים וזקן';
  const ownerName = business?.ownerName || 'דביר';
  const phone = business?.phone || SHOP_INFO.phone;
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '972');
  const slug = business?.slug || 'dvir';

  // Social & Web Links (Active vs Disabled)
  const instagram = business?.instagramUrl || (business?.instagramHandle
    ? (business.instagramHandle.startsWith('http') ? business.instagramHandle : `https://instagram.com/${business.instagramHandle.replace('@', '')}`)
    : (slug === 'dvir' ? SHOP_INFO.instagram : ''));

  const facebook = business?.facebookUrl || '';
  const tiktok = business?.tiktokUrl || '';
  const website = business?.websiteUrl || (slug === 'dvir' || slug === 'thecut' ? '/' : `/${slug}`);
  const whatsapp = createCustomerInquiryUrl({
    ownerPhone: business?.whatsappNumber || cleanPhone,
    ownerName,
    businessName: bizName,
  });

  const defaultWaze = business?.wazeUrl || (business?.branches && business.branches[0]?.wazeLink) || '';

  const branches = business?.branches && business.branches.length > 0
    ? business.branches
    : INITIAL_BRANCHES.map((b) => ({
        name: b.name,
        address: b.address,
        wazeLink: b.wazeUrl,
        phone: b.phone,
      }));

  const handleShareClick = () => {
    const shareUrl = typeof window !== 'undefined'
      ? (slug === 'dvir' || slug === 'thecut' ? window.location.origin : `${window.location.origin}/${slug}`)
      : `https://thecut-reg-in.vercel.app/${slug}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: bizName,
          text: `${bizName} – ${business?.slogan || 'תספורות פרימיום ודירוגים מדויקים'}. קבע תור מהיר:`,
          url: shareUrl,
        })
        .catch(() => setIsShareOpen(true));
    } else {
      setIsShareOpen(true);
    }
  };

  const heroStyle = business?.layout?.heroStyle || 'hub-monogram';
  const industryMeta = getIndustryMeta(business);

  const heroProps: HeroSharedProps = {
    business,
    themeColor,
    bizName,
    ownerName,
    phone,
    cleanPhone,
    slug,
    instagram,
    facebook,
    tiktok,
    website,
    whatsapp,
    defaultWaze,
    branches,
    industryMeta,
    onOpenHours: () => setIsHoursOpen(true),
    onOpenMyAppointments: () => setIsMyAppointmentsOpen(true),
    onOpenShare: handleShareClick,
    onOpenWaze: () => setIsWazeBranchOpen(true),
  };

  return (
    <>
      {heroStyle === 'split-cinema' && <SplitCinemaHero {...heroProps} />}
      {heroStyle === 'minimalist-vip' && <MinimalistVipHero {...heroProps} />}
      {(heroStyle === 'hub-monogram' || (heroStyle !== 'split-cinema' && heroStyle !== 'minimalist-vip')) && (
        <HubMonogramHero {...heroProps} />
      )}

      <OpeningHoursModal isOpen={isHoursOpen} onClose={() => setIsHoursOpen(false)} business={business} />
      <MyAppointmentsModal isOpen={isMyAppointmentsOpen} onClose={() => setIsMyAppointmentsOpen(false)} business={business} />
      <ShareBarbershopModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} business={business} />
    </>
  );
}
