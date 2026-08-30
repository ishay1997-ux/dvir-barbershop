'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdminBusinesses, defaultBusinessesList } from './super-admin/useSuperAdminBusinesses';
import { useSuperAdminUsers } from './super-admin/useSuperAdminUsers';
import { useSuperAdminReportsLeads } from './super-admin/useSuperAdminReportsLeads';

export { defaultBusinessesList };

export function useSuperAdminData() {
  const { error, info } = useToast();
  const {
    user: authUser,
    loading: authLoading,
    isSuperAdmin,
    authFetch,
    logout,
  } = useAuth();

  const isAuthenticated = isSuperAdmin;
  const adminUser = authUser
    ? {
        email: authUser.email,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
      }
    : null;

  const [googleLoading, setGoogleLoading] = useState(false);
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState<'reports' | 'businesses' | 'leads' | 'users' | 'overview' | 'settings'>('businesses');

  // Sub-Hooks
  const bizHook = useSuperAdminBusinesses(authFetch);
  const userHook = useSuperAdminUsers(authFetch);
  const reportsLeadsHook = useSuperAdminReportsLeads(authFetch);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cutweb_admin_theme_v2');
      if (saved === 'light' || saved === 'dark') {
        setAdminTheme(saved);
      } else {
        setAdminTheme('light');
        localStorage.setItem('cutweb_admin_theme_v2', 'light');
      }
    } catch (_) {}
  }, []);

  const toggleAdminTheme = () => {
    const next = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(next);
    try {
      localStorage.setItem('cutweb_admin_theme_v2', next);
    } catch (_) {}
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      if (!auth || !isFirebaseConfigured) {
        throw new Error('שירות Firebase Auth אינו מוגדר כראוי');
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        // Closed by user
      } else if (code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
        error(
          'דומיין לא מורשה ב-Firebase',
          `יש להוסיף את הדומיין ${currentDomain} ב-Firebase Console -> Authentication`
        );
      } else if (code === 'auth/popup-blocked') {
        error('חלון קופץ נחסם', 'אנא אפשר חלונות קופצים בדפדפן כדי להתחבר עם Google');
      } else if (code === 'auth/operation-not-allowed') {
        error(
          'שירות Google Sign-In כבוי',
          'יש להפעיל את Google Provider ב-Firebase Console תחת Sign-in method'
        );
      } else {
        error('שגיאה בהתחברות עם Google', err?.message || 'נסה שוב');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    info('התנתקת בהצלחה', 'להתראות!');
  };

  useEffect(() => {
    if (isAuthenticated) {
      bizHook.fetchBusinesses();
      reportsLeadsHook.fetchReports();
      userHook.fetchUsers();
      reportsLeadsHook.fetchLeads();
    }
  }, [isAuthenticated]);

  return {
    authLoading,
    isAuthenticated,
    adminUser,
    googleLoading,
    adminTheme,
    toggleAdminTheme,
    handleGoogleLogin,
    handleLogout,
    activeTab,
    setActiveTab,
    // Businesses Slice
    ...bizHook,
    // Reports & Leads Slice
    ...reportsLeadsHook,
    // Users Slice
    ...userHook,
  };
}
