'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login page, render standalone login screen without admin sidebar/wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#1C1C1C] md:bg-[#F5F0E8] w-full overflow-x-hidden" dir="rtl">
        <AdminSidebar />
        <main id="main-content" className="flex-1 w-full overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
