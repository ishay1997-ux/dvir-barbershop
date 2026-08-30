'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated, isSuperAdmin, isBusinessAdmin, isDemoMode, firebaseUser } = useAuth();

  // If we're on the login page, don't block
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Allow access in Demo Sandbox Mode
  if (isDemoMode) {
    return <>{children}</>;
  }

  // Loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center gap-4 text-white" dir="rtl">
        <div className="w-10 h-10 border-3 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
        <p className="text-xs text-[#9E9891] font-bold">בודק הרשאות כניסה מאובטחות...</p>
      </div>
    );
  }

  // Not logged in to Firebase at all (and not in demo mode)
  if (!firebaseUser && !isDemoMode) {
    router.replace('/admin/login');
    return null;
  }

  // Logged in to Firebase but no valid role
  if (!isAuthenticated) {
    return (
      <div className="flex-1 min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center gap-4 text-white p-4" dir="rtl">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-black text-white">אין הרשאה</h2>
          <p className="text-sm text-[#9E9891]">
            החשבון <span className="text-white font-bold">{firebaseUser?.email || ''}</span> אינו מורשה לגשת למערכת הניהול.
          </p>
          <p className="text-xs text-[#9E9891]">
            אנא פנה למנהל המערכת כדי לקבל הרשאת גישה.
          </p>
          <button
            onClick={() => router.replace('/admin/login')}
            className="mt-4 px-6 py-2.5 rounded-xl bg-[#C9A84C] text-black font-black text-sm hover:bg-[#DFCA85] transition-colors cursor-pointer"
          >
            חזרה למסך ההתחברות
          </button>
        </div>
      </div>
    );
  }

  // User has valid role (super_admin or business_admin)
  return <>{children}</>;
}
