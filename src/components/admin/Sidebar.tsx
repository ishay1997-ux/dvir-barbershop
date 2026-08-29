'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Calendar, Settings, Users, 
  Scissors, LogOut, Menu, X 
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'תורים', icon: Calendar },
  { href: '/admin/customers', label: 'לקוחות', icon: Users },
  { href: '/admin/settings', label: 'הגדרות', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
            <Scissors className="w-5 h-5 text-[#1C1C1C] -rotate-45" />
          </div>
          <div>
            <div className="text-white font-black text-base">THE CUT</div>
            <div className="text-[#6B6560] text-[10px]">מערכת ניהול</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1" aria-label="ניווט ניהול">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium',
                isActive
                  ? 'bg-gold text-[#1C1C1C] font-bold shadow-md'
                  : 'text-[#9E9891] hover:bg-[#2A2A2A] hover:text-white'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#2A2A2A]">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('thecut_admin_auth');
              window.location.href = '/admin/login';
            }
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9E9891] hover:bg-red-900/20 hover:text-red-400 transition-all w-full text-sm font-medium active:scale-95"
          aria-label="התנתק מהמערכת"
        >
          <LogOut className="w-4 h-4" />
          התנתק
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-[#1C1C1C] min-h-screen flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden bg-[#1C1C1C] px-4 py-3 flex items-center justify-between border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
            <Scissors className="w-4 h-4 text-[#1C1C1C] -rotate-45" />
          </div>
          <span className="text-white font-black">THE CUT</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-[#9E9891]"
          aria-label="פתח תפריט"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-[#1C1C1C]">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
