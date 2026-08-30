'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Calendar, Settings, Users, 
  Scissors, LogOut, Menu, X, ExternalLink, Share2, Palette, CreditCard 
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import ShareStorefrontModal from '@/components/admin/ShareStorefrontModal';

const navItems = [
  { href: '/admin', label: 'לוח בקרה ראשי', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'יומן תורים', icon: Calendar },
  { href: '/admin/customers', label: 'ספר לקוחות (CRM)', icon: Users },
  {
    href: '/admin/settings',
    label: 'הגדרות ושליטה',
    icon: Settings,
    subItems: [
      { tab: 'schedule', label: 'שיבוץ ושעות', icon: Calendar },
      { tab: 'services', label: 'מחירון ושירותים', icon: Scissors },
      { tab: 'design', label: 'סטודיו עיצוב ומודולריות', icon: Palette },
      { tab: 'billing', label: 'מנוי וחיובים', icon: CreditCard },
      { tab: 'content', label: 'תוכן וביקורות', icon: Users },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { logout } = useAuth();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center shadow-gold">
            <Scissors className="w-5 h-5 text-[#1C1C1C] -rotate-45" />
          </div>
          <div>
            <div className="text-white font-black text-sm">
              המספרה של <span className="text-gold">דביר</span>
            </div>
            <div className="text-[#6B6560] text-[10px]">פורטל ניהול ועצמאות מלאה</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto no-scrollbar" aria-label="ניווט ניהול">
        {navItems.map(({ href, label, icon: Icon, subItems }) => {
          const isActive = pathname === href;
          const isSettingsActive = pathname.startsWith('/admin/settings');

          return (
            <div key={href} className="flex flex-col gap-1">
              <Link
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-xs font-bold',
                  isActive
                    ? 'bg-gold text-[#1C1C1C] shadow-md'
                    : 'text-[#9E9891] hover:bg-[#2A2A2A] hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </div>
              </Link>

              {/* Sub items under settings if active */}
              {subItems && isSettingsActive && (
                <div className="mr-5 pr-3 border-r border-[#2A2A2A] flex flex-col gap-1 my-1 animate-fadeIn">
                  {subItems.map((sub) => (
                    <Link
                      key={sub.tab}
                      href={`/admin/settings?tab=${sub.tab}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#8C847A] hover:text-gold hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <sub.icon className="w-3 h-3 text-gold/70" />
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom actions: Share Site, View Site & Logout */}
      <div className="p-4 border-t border-[#2A2A2A] space-y-2">
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold border border-gold/30 transition-all text-xs font-black w-full cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>שתף אתר לקוחות</span>
          </div>
          <span className="text-[10px] bg-gold text-[#1C1C1C] px-1.5 py-0.5 rounded font-black">
            Bio
          </span>
        </button>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2 rounded-xl text-[#9E9891] hover:bg-white/5 hover:text-gold transition-colors text-xs font-bold"
        >
          <span>צפה באתר הלקוחות</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={async () => {
            await logout();
            router.push('/admin/login');
          }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-[#9E9891] hover:bg-red-900/20 hover:text-red-400 transition-all w-full text-xs font-bold active:scale-95 cursor-pointer"
          aria-label="התנתק מהמערכת"
        >
          <LogOut className="w-4 h-4" />
          התנתק מהמערכת
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1C1C1C] min-h-screen flex-shrink-0 border-l border-[#2A2A2A]">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden bg-[#1C1C1C] px-4 py-3.5 flex items-center justify-between border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
            <Scissors className="w-4 h-4 text-[#1C1C1C] -rotate-45" />
          </div>
          <span className="text-white font-black text-sm">
            המספרה של <span className="text-gold">דביר</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 rounded-lg bg-gold/20 text-gold text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden xs:inline">שתף</span>
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-[#9E9891] hover:text-white"
            aria-label="פתח תפריט"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-gold" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fadeIn">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-[#1C1C1C] shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Share Storefront Modal */}
      <ShareStorefrontModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
}
