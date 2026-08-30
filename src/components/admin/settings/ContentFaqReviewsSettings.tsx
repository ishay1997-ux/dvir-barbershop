'use client';

import React from 'react';
import type { ShopSettings } from '@/lib/types';
import { AboutBioSection } from './content/AboutBioSection';
import { FaqSectionManager } from './content/FaqSectionManager';
import { ReviewsSectionManager } from './content/ReviewsSectionManager';

interface ContentFaqReviewsSettingsProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export default function ContentFaqReviewsSettings({
  settings,
  onUpdateSettings,
  onNotifySave,
}: ContentFaqReviewsSettingsProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. About & Bio Section */}
      <AboutBioSection
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onNotifySave={onNotifySave}
      />

      {/* 2. FAQs Section Builder */}
      <FaqSectionManager
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onNotifySave={onNotifySave}
      />

      {/* 3. Customer Testimonials & Reviews */}
      <ReviewsSectionManager
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onNotifySave={onNotifySave}
      />
    </div>
  );
}
