import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/Sidebar';

export const metadata: Metadata = {
  title: 'ניהול | The Cut',
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F0E8]" dir="rtl">
      <AdminSidebar />
      <main id="main-content" className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
