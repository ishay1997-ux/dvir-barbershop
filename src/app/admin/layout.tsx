'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDemoMode } = useAuth();

  // If on login page, render standalone login screen without admin sidebar/wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <div className="flex flex-col min-h-screen bg-[#1C1C1C] md:bg-[#F5F0E8] w-full overflow-x-hidden" dir="rtl">
        {/* Interactive Demo Mode Top Banner */}
        {isDemoMode && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white px-4 py-2.5 border-b border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs z-50 sticky top-0 shadow-md">
            <div className="flex items-center gap-2 text-center sm:text-right">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="font-bold">
                🎯 מצב הדגמה אינטראקטיבי (CutWeb Demo Sandbox) · הנתונים הם לצורכי התנסות
              </span>
            </div>
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-[11px] flex items-center gap-1.5 transition-all shadow-xs hover:scale-105"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>רוצה מערכת כזו לעסק שלך? הקם בחינם</span>
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 w-full overflow-x-hidden">
          <AdminSidebar />
          <main id="main-content" className="flex-1 w-full overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
