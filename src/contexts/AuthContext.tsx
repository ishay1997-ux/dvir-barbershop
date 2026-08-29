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
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from /api/auth/me
  const fetchUserRole = useCallback(async (fbUser: User): Promise<AuthUser | null> => {
    try {
      const idToken = await fbUser.getIdToken();
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (data.authenticated && data.user) {
        return data.user as AuthUser;
      }
      return null;
    } catch (error) {
      console.error('[AuthContext] Failed to fetch user role:', error);
      return null;
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
        setUser(appUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserRole]);

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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
