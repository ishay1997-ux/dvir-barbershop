'use client';

import React, { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useShopStore } from '@/lib/store';

function BusinessSync() {
  const searchParams = useSearchParams();
  const { loadBusinessPreset } = useShopStore();
  const slug = searchParams.get('slug');

  useEffect(() => {
    if (slug) {
      loadBusinessPreset(slug);
    } else if (typeof window !== 'undefined') {
      const storedSlug = localStorage.getItem('thecut_active_slug');
      if (storedSlug) {
        loadBusinessPreset(storedSlug);
      }
    }
  }, [slug]);

  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDemoMode } = useAuth();

  // If on login page, render standalone login screen without admin sidebar/wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <Suspense fallback={null}>
        <BusinessSync />
      </Suspense>
      <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 w-full overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">
        {/* Interactive Demo Mode Top Banner */}
        {isDemoMode && (
          <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs z-50 sticky top-0 shadow-xs">
            <div className="flex items-center gap-2 text-center sm:text-right">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-bold text-slate-200">
                🎯 סביבת הדגמה פעילה (CutWeb OS) · הנתונים הם לצורכי התנסות ומערכת הניהול מסונכרנת בזמן אמת
              </span>
            </div>
            <Link
              href="/"
              className="px-3.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs hover:scale-105"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>רוצה מערכת כזו לעסק שלך? הקם בחינם</span>
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 w-full overflow-x-hidden">
          <AdminSidebar />
          <main id="main-content" className="flex-1 w-full overflow-x-hidden overflow-y-auto min-w-0">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
