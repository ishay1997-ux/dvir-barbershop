'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ExternalLink,
  Save,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { useToast } from '@/components/common/ToastProvider';

import SettingsSidebarNav, {
  SettingsTabId,
  SETTINGS_CATEGORIES,
} from '@/components/admin/settings/SettingsSidebarNav';
import ScheduleSettings from '@/components/admin/settings/ScheduleSettings';
import ServicesSettings from '@/components/admin/settings/ServicesSettings';
import DesignStudioSettings from '@/components/admin/settings/DesignStudioSettings';
import MediaGallerySettings from '@/components/admin/settings/MediaGallerySettings';
import ContentFaqReviewsSettings from '@/components/admin/settings/ContentFaqReviewsSettings';
import BranchesContactSettings from '@/components/admin/settings/BranchesContactSettings';
import MarketingBannerSettings from '@/components/admin/settings/MarketingBannerSettings';
import StaffSettings from '@/components/admin/settings/StaffSettings';
import GeneralSecuritySettings from '@/components/admin/settings/GeneralSecuritySettings';
import { BillingSettingsTab } from '@/components/admin/settings/BillingSettingsTab';
import { getIndustryTerminology } from '@/lib/industry-terminology';

import { useAuth } from '@/contexts/AuthContext';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const activeSlug = searchParams.get('slug') || user?.businessSlugs?.[0] || 'dvir';
  const initialTab = (searchParams.get('tab') as SettingsTabId) || 'schedule';

  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const { success, error } = useToast();

  const {
    branches,
    services,
    barbers,
    settings,
    saveBranches,
    saveServices,
    saveBarbers,
    saveSettings,
  } = useShopStore();

  // Sync tab change to URL query param without reload
  const handleSelectTab = (tabId: SettingsTabId) => {
    setActiveTab(tabId);
    const slugParam = activeSlug !== 'dvir' ? `&slug=${activeSlug}` : '';
    router.replace(`/admin/settings?tab=${tabId}${slugParam}`, { scroll: false });
  };

  const notifySave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Sync whole configuration to cloud backend API for the active business tenant
  const handleSyncToCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const payload = {
        slug: activeSlug,
        name: settings.shopName || 'המספרה',
        ownerName: settings.ownerName || 'מאסטר ברבר',
        phone: settings.mainPhone || '058-781-5071',
        city: settings.city || 'ישראל',
        slogan: settings.slogan,
        themeColor: settings.themeColor || '#C9A84C',
        announcement: settings.announcementBanner?.text,
        instagramHandle: settings.instagramHandle,
        instagramUrl: settings.instagramUrl,
        facebookUrl: settings.facebookUrl,
        tiktokUrl: settings.tiktokUrl,
        wazeUrl: settings.wazeUrl,
        whatsappNumber: settings.whatsappNumber,
        avatarUrl: settings.avatarUrl,
        heroImages: settings.heroImage ? [settings.heroImage] : undefined,
        galleryImages: settings.galleryImages,
        services: services.map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
          duration: s.duration,
          description: s.description,
          popular: s.popular,
        })),
        branches: branches.map((b) => ({
          id: b.id,
          name: b.name,
          address: b.address,
          phone: b.phone,
          wazeLink: b.wazeUrl,
          googleMapsLink: b.googleMapsUrl,
          hours: b.hours,
        })),
        testimonials: settings.testimonials,
        faqs: settings.faqs,
        layout: settings.layout,
      };

      const res = await fetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        success('סונכרן לענן בהצלחה', 'כל השינויים זמינים כעת לכל המשתמשים');
      } else {
        notifySave();
      }
    } catch (err) {
      console.warn('Background sync notice:', err);
      notifySave();
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const terminology = getIndustryTerminology({ name: settings.shopName });
  const bizName = settings.shopName || (activeSlug === 'dvir' ? 'המספרה של דביר' : 'העסק שלך');
  const currentCategory = SETTINGS_CATEGORIES.find((c) => c.id === activeTab);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              הגדרות ושליטה · {bizName}
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-sans">
            שליטה מלאה ועצמאית בכל פרטי האתר, היומן, המחירון, העיצוב והסניפים
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {savedNotice && (
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-bold animate-fadeIn shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>נשמר בהצלחה!</span>
            </div>
          )}

          <button
            onClick={handleSyncToCloud}
            disabled={isSyncingCloud}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="סנכרון מיידי עם הענן"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
            <span>סנכרן ענן</span>
          </button>

          <a
            href={activeSlug === 'dvir' || activeSlug === 'thecut' ? '/dvir' : `/${activeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs hover:scale-105 active:scale-95 transition-all"
          >
            <span>צפה באתר הלקוחות</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Master-Detail Layout (Categorized Sidebar + Settings Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Column (3 cols on desktop) */}
        <aside className="lg:col-span-4 w-full sticky top-4 z-20">
          <SettingsSidebarNav
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            badgeCounts={{
              servicesCount: services.length,
              branchesCount: branches.length,
              barbersCount: barbers.length,
              faqsCount: (settings.faqs || []).length,
              reviewsCount: (settings.testimonials || []).length,
              hasActiveBanner: settings.announcementBanner?.isActive,
            }}
          />
        </aside>

        {/* Right Active Content Panel (8 cols on desktop) */}
        <main className="lg:col-span-8 w-full min-w-0">
          {/* Active Category Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                {currentCategory && <currentCategory.icon className="w-5 h-5 text-indigo-600" />}
                <span>{currentCategory?.label}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-sans">{currentCategory?.description}</p>
            </div>
          </div>

          {/* Render Active Category View */}
          {activeTab === 'schedule' && (
            <ScheduleSettings
              settings={settings}
              branches={branches}
              onUpdateSettings={saveSettings}
              onUpdateBranches={saveBranches}
              onNotifySave={notifySave}
            />
          )}

          {activeTab === 'services' && (
            <ServicesSettings
              services={services}
              onUpdateServices={saveServices}
              onNotifySave={notifySave}
            />
          )}

          {activeTab === 'design' && (
            <DesignStudioSettings
              settings={settings}
              onUpdateSettings={saveSettings}
              onNotifySave={notifySave}
            />
          )}

          {activeTab === 'media' && (
            <MediaGallerySettings
              settings={settings}
              onUpdateSettings={saveSettings}
              onNotifySave={notifySave}
            />
          )}

          {activeTab === 'content' && (
            <ContentFaqReviewsSettings
              settings={settings}
              onUpdateSettings={saveSettings}
              onNotifySave={notifySave}
            />
          )}

          {activeTab === 'branches' && (
            <BranchesContactSettings
              settings={settings}
              branches={branches}
              onUpdateSettings={saveSettings}
              onUpdateBranches={saveBranches}
              onNotifySave={notifySave}
            />
          )}

          {activeTab === 'marketing' && (
            <MarketingBannerSettings
              settings={settings}
              onUpdateSettings={saveSettings}
              onNotifySave={notifySave}
            />
          )}

          {activeTab === 'staff' && (
            <StaffSettings
              barbers={barbers}
              branches={branches}
              onUpdateBarbers={saveBarbers}
              onNotifySave={notifySave}
            />
          )}

          {activeTab === 'billing' && (
            <BillingSettingsTab
              business={{
                slug: activeSlug,
                name: settings.shopName || 'העסק שלי',
                plan: (settings as any).plan || 'pro',
              }}
              onUpdateBusiness={async (updated) => {
                saveSettings({
                  ...settings,
                  plan: updated.plan,
                } as any);
                notifySave();
              }}
            />
          )}

          {activeTab === 'security' && (
            <GeneralSecuritySettings
              settings={settings}
              onUpdateSettings={saveSettings}
              onNotifySave={notifySave}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#9E9891] animate-pulse">
          טוען הגדרות ושליטה...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
