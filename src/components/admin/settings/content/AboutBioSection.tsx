'use client';

import React from 'react';
import { User } from 'lucide-react';
import type { ShopSettings } from '@/lib/types';

interface AboutBioSectionProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export const AboutBioSection: React.FC<AboutBioSectionProps> = ({
  settings,
  onUpdateSettings,
  onNotifySave,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gold" />
          <h2 className="text-base font-black text-[#1C1C1C]">
            אודות מאסטר ברבר והפילוסופיה (About & Bio)
          </h2>
        </div>
        <p className="text-xs text-[#6B6560] mt-1">
          הטקסט והפרטים המוצגים בכרטיסיית המאסטר ברבר בעמוד הבית
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              שם בעל העסק / הספר
            </label>
            <input
              type="text"
              value={settings.ownerName || ''}
              onChange={(e) => {
                const updated = { ...settings, ownerName: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              שנות ניסיון במקצוע
            </label>
            <input
              type="number"
              value={settings.experienceYears || 7}
              onChange={(e) => {
                const updated = { ...settings, experienceYears: Number(e.target.value) };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold font-bold font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              שם העסק המלא
            </label>
            <input
              type="text"
              value={settings.shopName || ''}
              onChange={(e) => {
                const updated = { ...settings, shopName: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
            סלוגן ראשי (כותרת משנה בראש האתר)
          </label>
          <input
            type="text"
            value={settings.slogan || ''}
            onChange={(e) => {
              const updated = { ...settings, slogan: e.target.value };
              onUpdateSettings(updated);
              onNotifySave();
            }}
            className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
            פסקת אודות ופילוסופיית שירות
          </label>
          <textarea
            rows={3}
            value={settings.bio || ''}
            onChange={(e) => {
              const updated = { ...settings, bio: e.target.value };
              onUpdateSettings(updated);
              onNotifySave();
            }}
            className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
