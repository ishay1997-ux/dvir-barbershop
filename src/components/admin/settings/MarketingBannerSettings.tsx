'use client';

import React from 'react';
import {
  Megaphone,
  MessageCircle,
  Sparkles,
  Save,
  Send,
  Bell,
  AlertCircle,
  Gift,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { ShopSettings } from '@/lib/types';

interface MarketingBannerSettingsProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export default function MarketingBannerSettings({
  settings,
  onUpdateSettings,
  onNotifySave,
}: MarketingBannerSettingsProps) {
  const { success } = useToast();

  const banner = settings.announcementBanner || {
    text: '',
    isActive: true,
    style: 'gold',
  };

  const handleToggleBanner = () => {
    const updated = {
      ...settings,
      announcementBanner: {
        ...banner,
        isActive: !banner.isActive,
      },
    };
    onUpdateSettings(updated);
    onNotifySave();
  };

  const handleUpdateBannerText = (text: string) => {
    const updated = {
      ...settings,
      announcementBanner: {
        ...banner,
        text,
      },
    };
    onUpdateSettings(updated);
    onNotifySave();
  };

  const handleUpdateBannerStyle = (style: 'gold' | 'urgent' | 'promo') => {
    const updated = {
      ...settings,
      announcementBanner: {
        ...banner,
        style,
      },
    };
    onUpdateSettings(updated);
    onNotifySave();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Top Announcement Banner */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-gold" />
              <h2 className="text-base font-black text-[#1C1C1C]">באנר הודעה דחופה / עונתית (Top Announcement)</h2>
            </div>
            <p className="text-xs text-[#6B6560] mt-1">
              הודעה מעוצבת שתוצג בראש עמוד הבית (למשל: עדכון ימי פעילות, פתיחת סניף, מבצע או ברכת חג)
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleBanner}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all self-start sm:self-auto ${
              banner.isActive
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-zinc-200 text-zinc-600'
            }`}
          >
            {banner.isActive ? '✓ באנר פעיל באתר' : 'באנר כבוי'}
          </button>
        </div>

        {/* Banner Style Presets */}
        <div>
          <label className="block text-xs font-bold text-[#1C1C1C] mb-2">סגנון עיצובי של הבאנר:</label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleUpdateBannerStyle('gold')}
              className={`p-3 rounded-2xl border text-right transition-all ${
                (banner.style || 'gold') === 'gold'
                  ? 'border-gold bg-amber-500/10 ring-2 ring-gold/20 font-black'
                  : 'border-[#E5DDD0] bg-[#FAF7F2] text-[#6B6560]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#856514] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                זהב יוקרתי (רגיל)
              </div>
              <span className="text-[10px] text-[#9E9891] block">הודעות כלליות ועדכוני לו"ז</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdateBannerStyle('urgent')}
              className={`p-3 rounded-2xl border text-right transition-all ${
                banner.style === 'urgent'
                  ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500/20 font-black'
                  : 'border-[#E5DDD0] bg-[#FAF7F2] text-[#6B6560]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                אדום חירום (דחוף)
              </div>
              <span className="text-[10px] text-[#9E9891] block">שינויים דחופים והתראות</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdateBannerStyle('promo')}
              className={`p-3 rounded-2xl border text-right transition-all ${
                banner.style === 'promo'
                  ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20 font-black'
                  : 'border-[#E5DDD0] bg-[#FAF7F2] text-[#6B6560]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                <Gift className="w-3.5 h-3.5" />
                ירוק מבצע / חג
              </div>
              <span className="text-[10px] text-[#9E9891] block">ברכות חג והטבות</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1C1C1C] mb-1">תוכן ההודעה:</label>
          <textarea
            rows={3}
            value={banner.text || ''}
            onChange={(e) => handleUpdateBannerText(e.target.value)}
            placeholder="למשל: 📢 שים לב: בשבוע הקרוב אני באריאל רק ביום שני. מהרו לשריין תורים מראש!"
            className="w-full px-3.5 py-2.5 border rounded-2xl text-xs outline-none focus:border-gold bg-[#FAF7F2] leading-relaxed"
          />
        </div>

        {/* Live Preview */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-[#9E9891] block mb-1">תצוגה מקדימה באתר:</span>
          <div
            className={`py-2.5 px-4 rounded-xl text-xs font-bold text-center shadow-xs transition-all ${
              banner.style === 'urgent'
                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 text-white'
                : banner.style === 'promo'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-600 via-gold to-amber-500 text-[#1C1C1C]'
            }`}
          >
            {banner.text || 'הזן טקסט כדי לראות תצוגה מקדימה...'}
          </div>
        </div>
      </div>

      {/* 2. Automated WhatsApp Templates */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-black text-[#1C1C1C]">תבניות הודעות WhatsApp אוטומטיות (Marketing & CRM)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            נוסח ההודעות הנשלחות ללקוחות בעת קביעת תור או בתזכורת חודשית
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
            💬 הודעת WhatsApp ראשונית (כשלקוח לוחץ על כפתור הוואטסאפ באתר)
          </label>
          <input
            type="text"
            value={settings.whatsappGreeting || ''}
            onChange={(e) => {
              const updated = { ...settings, whatsappGreeting: e.target.value };
              onUpdateSettings(updated);
              onNotifySave();
            }}
            className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
            🔄 תבנית הודעת שימור לקוחות (תזכורת חודשית בוואטסאפ)
          </label>
          <p className="text-[11px] text-[#9E9891] mb-1.5">
            השתמש ב-<code>{'{name}'}</code> כדי לשתול את שם הלקוח באופן אוטומטי
          </p>
          <textarea
            rows={3}
            value={settings.retentionMessageTemplate || ''}
            onChange={(e) => {
              const updated = { ...settings, retentionMessageTemplate: e.target.value };
              onUpdateSettings(updated);
              onNotifySave();
            }}
            className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
