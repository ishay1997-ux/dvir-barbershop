'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // If we're on the login page, don't block
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    // 1. Check local admin session storage (Quick access / persistent PIN)
    if (typeof window !== 'undefined') {
      const localAuth = localStorage.getItem('thecut_admin_authenticated');
      if (localAuth === 'true') {
        setIsAuthenticated(true);
        setCheckingAuth(false);
        return;
      }
    }

    // 2. Check Firebase Auth if configured
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          const localAuth = typeof window !== 'undefined' ? localStorage.getItem('thecut_admin_authenticated') : null;
          if (localAuth !== 'true') {
            setIsAuthenticated(false);
            router.replace('/admin/login');
          }
        }
        setCheckingAuth(false);
      });
      return () => unsubscribe();
    } else {
      // If neither, redirect to login
      const localAuth = typeof window !== 'undefined' ? localStorage.getItem('thecut_admin_authenticated') : null;
      if (localAuth === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/admin/login');
      }
      setCheckingAuth(false);
    }
  }, [pathname, router]);

  // If on login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading spinner
  if (checkingAuth) {
    return (
      <div className="flex-1 min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center gap-4 text-white" dir="rtl">
        <div className="w-10 h-10 border-3 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
        <p className="text-xs text-[#9E9891] font-bold">בודק הרשאות כניסה מאובטחות...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
