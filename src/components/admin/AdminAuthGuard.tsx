'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // If we're on the login page, don't block
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setCheckingAuth(false);
      router.replace('/admin/login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        router.replace('/admin/login');
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // If on login page, render children directly without admin layout wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading spinner while checking auth session with Firebase
  if (checkingAuth) {
    return (
      <div className="flex-1 min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center gap-4 text-white" dir="rtl">
        <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-xs text-[#9E9891] font-bold">בודק הרשאות כניסה מאובטחות...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}
