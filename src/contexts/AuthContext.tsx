'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

// ============================================================
// Auth Context — Client-Side Authentication State
// ============================================================

export type UserRole = 'super_admin' | 'business_admin';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  businessSlugs: string[];
}

interface AuthContextType {
  /** Firebase Auth user (raw) */
  firebaseUser: User | null;
  /** App user with role from Firestore */
  user: AuthUser | null;
  /** True while checking auth state */
  loading: boolean;
  /** True if user is authenticated with a valid role */
  isAuthenticated: boolean;
  /** True if user is a super admin */
  isSuperAdmin: boolean;
  /** True if user is a business admin */
  isBusinessAdmin: boolean;
  /** Get Authorization headers for API calls */
  getAuthHeaders: () => Promise<Record<string, string>>;
  /** Authenticated fetch wrapper */
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  /** Sign out */
  logout: () => Promise<void>;
  /** Re-check the user's role (e.g., after role changes) */
  refreshUser: () => Promise<void>;
  /** Direct Phone / Barber login */
  loginWithPhone: (phone: string, pin?: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
  isAuthenticated: false,
  isSuperAdmin: false,
  isBusinessAdmin: false,
  getAuthHeaders: async () => ({}),
  authFetch: async () => new Response(),
  logout: async () => {},
  refreshUser: async () => {},
  loginWithPhone: async () => ({ success: false }),
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from /api/auth/me (with guaranteed fallback for master super admin)
  const fetchUserRole = useCallback(async (fbUser: User): Promise<AuthUser | null> => {
    const userEmail = (fbUser.email || '').toLowerCase().trim();

    try {
      const idToken = await fbUser.getIdToken();
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          return data.user as AuthUser;
        }
      }
    } catch (error) {
      console.error('[AuthContext] Failed to fetch user role from server:', error);
    }

    // Guaranteed fallback for bootstrap Super Admin (ishay1997@gmail.com)
    if (userEmail === 'ishay1997@gmail.com') {
      return {
        uid: fbUser.uid,
        email: fbUser.email || 'ishay1997@gmail.com',
        displayName: fbUser.displayName || 'ישי',
        photoURL: fbUser.photoURL || '',
        role: 'super_admin',
        businessSlugs: [],
      };
    }

    // Guaranteed fallback for Dvir Barbershop Admin (dvirattias10@gmail.com)
    if (userEmail === 'dvirattias10@gmail.com') {
      return {
        uid: fbUser.uid,
        email: fbUser.email || 'dvirattias10@gmail.com',
        displayName: fbUser.displayName || 'דביר אטיאס',
        photoURL: fbUser.photoURL || '',
        role: 'business_admin',
        businessSlugs: ['dvir', 'thecut'],
      };
    }

    return null;
  }, []);

  // Check for saved phone / offline barber session on load
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('thecut_phone_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.role && parsed.businessSlugs) {
          setUser(parsed);
          setLoading(false);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        const appUser = await fetchUserRole(fbUser);
        if (appUser) {
          setUser(appUser);
          try {
            localStorage.removeItem('thecut_phone_session');
          } catch (_) {}
        }
      } else {
        // If not logged in via Firebase, check if there is a phone session
        try {
          const savedSession = localStorage.getItem('thecut_phone_session');
          if (savedSession) {
            setUser(JSON.parse(savedSession));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserRole]);

  // Direct Phone login for Barbers (e.g. Dvir: 058-781-5071)
  const loginWithPhone = useCallback(async (phone: string, pin?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanPhone = (phone || '').replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 9) {
      return { success: false, error: 'מספר טלפון לא תקין' };
    }

    // 1. Dvir's Flagship Barbershop Phone Access
    if (cleanPhone === '0587815071' || cleanPhone === '587815071') {
      const barberUser: AuthUser = {
        uid: `barber-dvir-${cleanPhone}`,
        email: 'dvir.barber@thecut.co.il',
        displayName: 'דביר (המספרה של דביר)',
        photoURL: '',
        role: 'business_admin',
        businessSlugs: ['dvir', 'thecut'],
      };

      setUser(barberUser);
      try {
        localStorage.setItem('thecut_phone_session', JSON.stringify(barberUser));
      } catch (_) {}

      return { success: true };
    }

    // 2. Check registered users in local/server registry
    try {
      const res = await fetch(`/api/admin/businesses`);
      if (res.ok) {
        const data = await res.json();
        const foundBiz = data.businesses?.find((b: any) => (b.phone || '').replace(/\D/g, '') === cleanPhone);
        if (foundBiz) {
          const tenantUser: AuthUser = {
            uid: `barber-${foundBiz.slug}-${cleanPhone}`,
            email: `${foundBiz.slug}@thecut.co.il`,
            displayName: `${foundBiz.ownerName || foundBiz.name}`,
            photoURL: '',
            role: 'business_admin',
            businessSlugs: [foundBiz.slug],
          };
          setUser(tenantUser);
          try {
            localStorage.setItem('thecut_phone_session', JSON.stringify(tenantUser));
          } catch (_) {}
          return { success: true };
        }
      }
    } catch (err) {
      console.warn('Phone check fallback:', err);
    }

    return {
      success: false,
      error: 'מספר הטלפון אינו רשום כמנהל עסק. אנא פנה למנהל המערכת להרשאה.',
    };
  }, []);

  // Get auth headers for API calls
  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    if (!firebaseUser) return {};
    try {
      const idToken = await firebaseUser.getIdToken();
      return { Authorization: `Bearer ${idToken}` };
    } catch {
      return {};
    }
  }, [firebaseUser]);

  // Authenticated fetch wrapper
  const authFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = await getAuthHeaders();
    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
  }, [getAuthHeaders]);

  // Sign out
  const logout = useCallback(async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
    }
    try {
      localStorage.removeItem('thecut_phone_session');
    } catch (_) {}
    setUser(null);
    setFirebaseUser(null);
  }, []);

  // Refresh user role
  const refreshUser = useCallback(async () => {
    if (firebaseUser) {
      const appUser = await fetchUserRole(firebaseUser);
      setUser(appUser);
    }
  }, [firebaseUser, fetchUserRole]);

  const value: AuthContextType = {
    firebaseUser,
    user,
    loading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isBusinessAdmin: user?.role === 'business_admin',
    getAuthHeaders,
    authFetch,
    logout,
    refreshUser,
    loginWithPhone,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
