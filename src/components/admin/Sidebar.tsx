'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, Calendar, Settings, Users, 
  Sparkles, LogOut, Menu, X, ExternalLink, Share2, Palette, CreditCard, ShieldCheck 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useShopStore } from '@/lib/store';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import { cn } from '@/lib/utils';
import ShareStorefrontModal from '@/components/admin/ShareStorefrontModal';

const navItems = [
  { href: '/admin', label: 'לוח בקרה ראשי (Dashboard)', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'יומן תורים ושיבוצים', icon: Calendar },
  { href: '/admin/customers', label: 'ספר לקוחות (CRM)', icon: Users },
  {
    href: '/admin/settings',
    label: 'הגדרות ושליטה',
    icon: Settings,
    subItems: [
      { tab: 'design', label: 'סטודיו עיצוב ומודולריות', icon: Palette },
      { tab: 'services', label: 'מחירון ושירותים', icon: Sparkles },
      { tab: 'schedule', label: 'שיבוץ ושעות פעילות', icon: Calendar },
      { tab: 'billing', label: 'מנוי וחיובים (SaaS)', icon: CreditCard },
      { tab: 'content', label: 'תוכן, ביקורות ושאלות', icon: Users },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSlug = searchParams.get('slug');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { logout, isDemoMode, user } = useAuth();
  const { settings } = useShopStore();

  const [activeSlug, setActiveSlug] = useState<string>(paramSlug || 'dvir');

  useEffect(() => {
    if (paramSlug) {
      setActiveSlug(paramSlug);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('thecut_active_slug');
      if (stored) setActiveSlug(stored);
    }
  }, [paramSlug]);

  const terminology = getIndustryTerminology({
    name: settings.shopName,
    shopName: settings.shopName,
    slogan: settings.heroSubtitle,
    category: settings.category,
    themeColor: settings.themeColor,
    slug: activeSlug,
  });
  const bizName = settings.shopName || (isDemoMode ? 'עסק הדגמה (Demo Hub)' : 'דשבורד העסק');
  const ownerName = settings.ownerName || 'מנהל ראשי';
  const finalSlug = activeSlug || user?.businessSlugs?.[0] || 'dvir';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111420] text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-18 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#141827]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/70 p-0.5 shadow-sm shrink-0 flex items-center justify-center text-xl">
            {terminology.icon || '💈'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-xs truncate max-w-[130px]">
                {bizName}
              </span>
              {isDemoMode && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                  Demo
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-sans truncate">
              {ownerName} · {terminology.staffTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto no-scrollbar" aria-label="ניווט ניהול">
        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
          תפריט ניהול
        </div>

        {navItems.map(({ href, label, icon: Icon, subItems }) => {
          const isActive = pathname === href;
          const isSettingsActive = pathname.startsWith('/admin/settings');
          const finalHref = finalSlug && finalSlug !== 'dvir'
            ? `${href}?slug=${finalSlug}${isDemoMode ? '&demo=true' : ''}`
            : (isDemoMode ? `${href}?demo=true` : href);

          return (
            <div key={href} className="flex flex-col gap-1">
              <Link
                href={finalHref}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold',
                  isActive
                    ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                  <span>{label}</span>
                </div>
              </Link>

              {/* Sub items under settings if active */}
              {subItems && isSettingsActive && (
                <div className="mr-5 pr-2.5 border-r border-slate-800 flex flex-col gap-1 my-1">
                  {subItems.map((sub) => (
                    <Link
                      key={sub.tab}
                      href={`/admin/settings?tab=${sub.tab}${finalSlug && finalSlug !== 'dvir' ? `&slug=${finalSlug}` : ''}${isDemoMode ? '&demo=true' : ''}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition-colors flex items-center gap-2"
                    >
                      <sub.icon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Quick Actions */}
      <div className="p-3 border-t border-slate-800/80 bg-[#141827] space-y-2">
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 transition-all text-xs font-bold w-full cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>שתף אתר לקוחות</span>
          </div>
          <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-black">
            Bio Link
          </span>
        </button>

        <Link
          href={finalSlug === 'dvir' ? '/dvir' : `/${finalSlug}`}
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span>צפה באתר החי</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">/{finalSlug}</span>
        </Link>

        <button
          onClick={async () => {
            await logout();
            router.push('/admin/login');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-400 hover:bg-rose-950/30 hover:text-rose-400 transition-all w-full text-xs font-bold active:scale-95 cursor-pointer"
          aria-label="התנתק מהמערכת"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>התנתק מהמערכת</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#111420] min-h-screen shrink-0 border-l border-slate-800/80 z-40 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden bg-[#111420] px-4 py-3 flex items-center justify-between border-b border-slate-800/80 z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center justify-center text-sm font-black">
            {terminology.icon || '💈'}
          </div>
          <div>
            <span className="text-white font-black text-xs block">
              {bizName}
            </span>
            <span className="text-[10px] text-slate-400">פורטל ניהול</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-1.5 px-2.5 rounded-lg bg-indigo-950/60 text-indigo-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-indigo-500/30"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>שתף</span>
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700"
            aria-label="פתח תפריט"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fadeIn" dir="rtl">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-[#111420] shadow-2xl z-50 border-l border-slate-800/80">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Share Storefront Modal */}
      <ShareStorefrontModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
}
