'use client';

import React from 'react';
import {
  MapPin,
  Phone,
  Navigation,
  ExternalLink,
  Share2,
  Globe,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { ShopSettings, Branch } from '@/lib/types';

interface BranchesContactSettingsProps {
  settings: ShopSettings;
  branches: Branch[];
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onUpdateBranches: (newBranches: Branch[]) => void;
  onNotifySave: () => void;
}

export default function BranchesContactSettings({
  settings,
  branches,
  onUpdateSettings,
  onUpdateBranches,
  onNotifySave,
}: BranchesContactSettingsProps) {
  const { success } = useToast();

  const handleBranchChange = (branchId: string, updates: Partial<Branch>) => {
    const updatedBranches = branches.map((b) =>
      b.id === branchId ? { ...b, ...updates } : b
    );
    onUpdateBranches(updatedBranches);
    onNotifySave();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Branches Details (Ariel & Rehovot) */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">פרטי סניפים ודרכי הגעה (Branch Details)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הגדרות כתובת מדויקת, שעות פעילות וקישורי Waze ו-Google Maps לכל סניף
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="p-5 rounded-2xl border border-[#E5DDD0] bg-[#FAF7F2] space-y-3.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-[#1C1C1C] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold" />
                  {branch.id === 'ariel' ? '📍 סניף אריאל' : '📍 סניף רחובות'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-[#856514] border border-gold/30">
                  {branch.city}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">שם הסניף המלא</label>
                <input
                  type="text"
                  value={branch.name}
                  onChange={(e) => handleBranchChange(branch.id, { name: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white font-bold outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">כתובת ומיקום מדויק</label>
                <input
                  type="text"
                  value={branch.address}
                  onChange={(e) => handleBranchChange(branch.id, { address: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">טלפון ישיר לסניף</label>
                <input
                  type="text"
                  value={branch.phone}
                  onChange={(e) => handleBranchChange(branch.id, { phone: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">קישור ישיר לניווט Waze</label>
                <input
                  type="text"
                  value={branch.wazeUrl}
                  onChange={(e) => handleBranchChange(branch.id, { wazeUrl: e.target.value })}
                  placeholder="https://waze.com/ul?q=..."
                  className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">קישור ל-Google Maps</label>
                <input
                  type="text"
                  value={branch.googleMapsUrl || ''}
                  onChange={(e) => handleBranchChange(branch.id, { googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Social Media & Direct Contact Channels */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">רשתות חברתיות וערוצי תקשורת (Social & Channels)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הקישורים שיופיעו בכפתורי המדיה החברתית ובפוטר האתר
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              📱 חשבון אינסטגרם (Handle)
            </label>
            <input
              type="text"
              placeholder="@dvir_barber"
              value={settings.instagramHandle || ''}
              onChange={(e) => {
                const updated = { ...settings, instagramHandle: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              🔗 קישור ישיר לאינסטגרם (URL)
            </label>
            <input
              type="text"
              placeholder="https://instagram.com/dvir_barber"
              value={settings.instagramUrl || ''}
              onChange={(e) => {
                const updated = { ...settings, instagramUrl: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              🎵 קישור לטיקטוק (TikTok URL)
            </label>
            <input
              type="text"
              placeholder="https://tiktok.com/@dvir_barber"
              value={settings.tiktokUrl || ''}
              onChange={(e) => {
                const updated = { ...settings, tiktokUrl: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              📘 קישור לפייסבוק (Facebook URL)
            </label>
            <input
              type="text"
              placeholder="https://facebook.com/dvirbarber"
              value={settings.facebookUrl || ''}
              onChange={(e) => {
                const updated = { ...settings, facebookUrl: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              💬 מספר WhatsApp לקבלת הודעות
            </label>
            <input
              type="text"
              placeholder="0587815071"
              value={settings.whatsappNumber || settings.mainPhone || ''}
              onChange={(e) => {
                const updated = { ...settings, whatsappNumber: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              📞 טלפון ראשי לשיחות
            </label>
            <input
              type="text"
              placeholder="058-781-5071"
              value={settings.mainPhone || ''}
              onChange={(e) => {
                const updated = { ...settings, mainPhone: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold font-mono"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
