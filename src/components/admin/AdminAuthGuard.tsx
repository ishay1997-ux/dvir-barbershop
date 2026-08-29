'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If we're on the login page itself, don't block
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('thecut_admin_auth') || localStorage.getItem('dvir_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/admin/login');
      }
    }
  }, [pathname, router]);

  // If on login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading spinner while checking auth session
  if (isAuthenticated === null) {
    return (
      <div className="flex-1 min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-xs text-[#9E9891] font-bold">בודק הרשאות כניסה...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
