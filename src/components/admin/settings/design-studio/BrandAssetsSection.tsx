'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageUploadPicker from '@/components/common/ImageUploadPicker';

interface BrandAssetsSectionProps {
  logoUrl?: string;
  avatarUrl?: string;
  ownerName: string;
  onLogoChange: (url: string) => void;
  onAvatarChange: (url: string) => void;
}

export function BrandAssetsSection({
  logoUrl,
  avatarUrl,
  ownerName,
  onLogoChange,
  onAvatarChange,
}: BrandAssetsSectionProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#C9A84C]" />
          <h2 className="text-base font-black text-[#1C1C1C]">נכסי מיתוג ולוגו העסק (Brand Assets)</h2>
        </div>
        <p className="text-xs text-[#6B6560] mt-1">
          העלה לוגו רשמי שיופיע ב-Header, במרכז הפתיח וב-Footer, ותמונת פרופיל של המנהל/ת לאזור האודות
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Logo Picker */}
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E5DDD0] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#1C1C1C]">לוגו העסק (Header & Footer Logo)</span>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
              מומלץ PNG שקוף
            </span>
          </div>
          <ImageUploadPicker
            value={logoUrl || ''}
            onChange={onLogoChange}
            placeholder="גרור לוגו PNG שקוף או הדבק כתובת URL..."
            label="לוגו העסק"
          />
        </div>

        {/* Master Avatar Picker */}
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E5DDD0] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#1C1C1C]">תמונת פרופיל מנהל/ת (Master Avatar)</span>
            <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
              אזור 'אודות' וכרטיס ראשי
            </span>
          </div>
          <ImageUploadPicker
            value={avatarUrl || ''}
            onChange={onAvatarChange}
            placeholder="העלה תמונת פורטרט מקצועית או הדבק URL..."
            label={`תמונת ${ownerName || 'המנהל/ת'}`}
          />
        </div>
      </div>
    </div>
  );
}
