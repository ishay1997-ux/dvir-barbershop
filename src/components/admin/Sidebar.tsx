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

  const terminology = getIndustryTerminology({ name: settings.shopName });
  const bizName = settings.shopName || (isDemoMode ? 'עסק הדגמה (Demo Hub)' : 'דשבורד העסק');
  const ownerName = settings.ownerName || 'מנהל ראשי';
  const slug = activeSlug || user?.businessSlugs?.[0] || 'dvir';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111215] text-zinc-300 select-none">
      {/* Brand Header */}
      <div className="h-18 px-4 flex items-center justify-between border-b border-white/10 bg-[#16171B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-[1px] shadow-sm">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-lg">
              {terminology.icon || '💈'}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-xs truncate max-w-[130px]">
                {bizName}
              </span>
              {isDemoMode && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded">
                  Demo
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-sans truncate">
              {ownerName} · {terminology.staffTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto no-scrollbar" aria-label="ניווט ניהול">
        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-500">
          תפריט ניהול
        </div>

        {navItems.map(({ href, label, icon: Icon, subItems }) => {
          const isActive = pathname === href;
          const isSettingsActive = pathname.startsWith('/admin/settings');
          const finalHref = slug && slug !== 'dvir'
            ? `${href}?slug=${slug}${isDemoMode ? '&demo=true' : ''}`
            : (isDemoMode ? `${href}?demo=true` : href);

          return (
            <div key={href} className="flex flex-col gap-1">
              <Link
                href={finalHref}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold',
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-slate-950' : 'text-zinc-400')} />
                  <span>{label}</span>
                </div>
              </Link>

              {/* Sub items under settings if active */}
              {subItems && isSettingsActive && (
                <div className="mr-5 pr-2.5 border-r border-white/10 flex flex-col gap-1 my-1">
                  {subItems.map((sub) => (
                    <Link
                      key={sub.tab}
                      href={`/admin/settings?tab=${sub.tab}${slug && slug !== 'dvir' ? `&slug=${slug}` : ''}${isDemoMode ? '&demo=true' : ''}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-zinc-400 hover:text-amber-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <sub.icon className="w-3.5 h-3.5 text-amber-400/80" />
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
      <div className="p-3 border-t border-white/10 bg-[#16171B] space-y-2">
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 transition-all text-xs font-black w-full cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>שתף אתר לקוחות</span>
          </div>
          <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">
            Bio Link
          </span>
        </button>

        <Link
          href={slug === 'dvir' ? '/dvir' : `/${slug}`}
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-colors text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span>צפה באתר החי</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">/{slug}</span>
        </Link>

        <button
          onClick={async () => {
            await logout();
            router.push('/admin/login');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-zinc-400 hover:bg-rose-950/40 hover:text-rose-400 transition-all w-full text-xs font-bold active:scale-95 cursor-pointer"
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
      <aside className="hidden md:flex flex-col w-64 bg-[#111215] min-h-screen shrink-0 border-l border-white/10 z-40 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden bg-[#111215] px-4 py-3 flex items-center justify-between border-b border-white/10 z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-sm font-black">
            ✂️
          </div>
          <div>
            <span className="text-white font-black text-xs block">
              {bizName}
            </span>
            <span className="text-[10px] text-zinc-500">פורטל ניהול</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-1.5 px-2.5 rounded-lg bg-amber-400/20 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-amber-400/30"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>שתף</span>
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 rounded-lg bg-white/5 text-zinc-300 hover:text-white border border-white/10"
            aria-label="פתח תפריט"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fadeIn" dir="rtl">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-[#111215] shadow-2xl z-50 border-l border-white/10">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Share Storefront Modal */}
      <ShareStorefrontModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
}
