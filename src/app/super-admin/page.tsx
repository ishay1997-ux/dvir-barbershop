'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Calendar,
  Bug,
  Plus,
  Trash2,
  CheckCircle,
  Scissors,
  Lock,
  RefreshCw,
  Zap,
  Sparkles,
  Settings2,
  Users,
  Sun,
  Moon,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import type { Business, BugReport } from '@/components/super-admin/types';
import { ReportsTab } from '@/components/super-admin/ReportsTab';
import { UsersTab } from '@/components/super-admin/UsersTab';
import { BusinessesTab } from '@/components/super-admin/BusinessesTab';
import { EditBusinessModal } from '@/components/super-admin/EditBusinessModal';
import { CreateBusinessModal } from '@/components/super-admin/CreateBusinessModal';

const defaultBusinessesList: Business[] = [
  {
    id: 'biz-dvir',
    name: 'המספרה של דביר',
    slug: 'dvir',
    ownerName: 'דביר',
    phone: '058-781-5071',
    city: 'אריאל & רחובות',
    slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר בישראל',
    announcement: '🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7 – שריינו מראש!',
    themeColor: '#C9A84C',
    branchesCount: 2,
    status: 'active',
    plan: 'enterprise',
    createdAt: '2025-01-01',
    branches: [
      {
        name: 'סניף אריאל (אוניברסיטת אריאל)',
        address: 'קמפוס אוניברסיטת אריאל (מרכז הסטודנט)',
        wazeLink: 'https://waze.com/ul?q=Ariel%20University',
      },
      {
        name: 'סניף רחובות (מרכז העיר)',
        address: 'הרצל 180, רחובות (ליד מכון ויצמן)',
        wazeLink: 'https://waze.com/ul?q=Herzl%20180%20Rehovot',
      },
    ],
    services: [
      { name: 'תספורת גברים פרימיום', price: 80, duration: 30 },
      { name: 'עיצוב ופיסול זקן Master', price: 40, duration: 20 },
      { name: 'חבילת VIP משולבת (תספורת + זקן)', price: 110, duration: 45 },
      { name: 'תספורת ילדים ונוער', price: 70, duration: 30 },
    ],
  },
];

export default function SuperAdminPage() {
  const router = useRouter();
  const { success, error, info, showConfirm } = useToast();
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
  const [authError, setAuthError] = useState(false);

  // Light / Dark Theme Mode for Super Admin
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cutweb_admin_theme');
      if (saved === 'light' || saved === 'dark') {
        setAdminTheme(saved);
      }
    } catch (_) {}
  }, []);

  const toggleAdminTheme = () => {
    const next = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(next);
    try {
      localStorage.setItem('cutweb_admin_theme', next);
    } catch (_) {}
  };

  const [activeTab, setActiveTab] = useState<'reports' | 'businesses' | 'users'>('businesses');

  // Reports state
  const [reports, setReports] = useState<BugReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  // Businesses state
  const [businesses, setBusinesses] = useState<Business[]>(defaultBusinessesList);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [isNewBizModalOpen, setIsNewBizModalOpen] = useState(false);

  // Edit Business State
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [isSavingBiz, setIsSavingBiz] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  // User Management State
  const [managedUsers, setManagedUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'super_admin' | 'business_admin'>('business_admin');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserBusinessSlugs, setNewUserBusinessSlugs] = useState('dvir');
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Google Sign-In Handler
  const handleGoogleLogin = async () => {
    setAuthError(false);
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

  // Fetch Bug Reports
  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const res = await authFetch('/api/bug-reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setReportsLoading(false);
    }
  };

  // Fetch Businesses
  const fetchBusinesses = async () => {
    setBusinessesLoading(true);
    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured && db) {
        try {
          const snapshot = await getDocs(collection(db, 'businesses'));
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as Business);
            setBusinesses(list);
            return;
          }
        } catch (dbErr) {
          console.warn('Direct Firestore fetch businesses fallback:', dbErr);
        }
      }

      const res = await authFetch('/api/admin/businesses');
      if (res.ok) {
        const data = await res.json();
        if (data.businesses && data.businesses.length > 0) {
          setBusinesses(data.businesses);
          return;
        }
      }

      const fallbackRes = await fetch('/api/admin/businesses?slug=dvir');
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (fallbackData.business) {
          setBusinesses([fallbackData.business]);
        }
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setBusinessesLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured && db) {
        try {
          const snapshot = await getDocs(collection(db, 'users'));
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
            setManagedUsers(list);
            return;
          }
        } catch (clientErr) {
          console.warn('Direct client firestore fetch users fallback:', clientErr);
        }
      }

      const res = await authFetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        setManagedUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinesses();
      fetchReports();
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Add User
  const handleAddUser = async () => {
    if (!newUserEmail.trim() || !newUserEmail.includes('@')) {
      error('אימייל לא תקין', 'אנא הזן כתובת אימייל חוקית');
      return;
    }
    setIsAddingUser(true);
    const parsedSlugs = newUserBusinessSlugs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalSlugs =
      parsedSlugs.length > 0
        ? parsedSlugs
        : newUserRole === 'business_admin'
        ? ['dvir']
        : [];

    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured && db) {
        try {
          const preRegId = `pre_${newUserEmail.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;
          await setDoc(doc(db, 'users', preRegId), {
            email: newUserEmail.toLowerCase().trim(),
            role: newUserRole,
            displayName: newUserDisplayName.trim() || newUserEmail.split('@')[0],
            businessSlugs: finalSlugs,
            createdAt: new Date().toISOString(),
            preRegistered: true,
          });
        } catch (clientDbErr) {
          console.warn('Direct client firestore user write:', clientDbErr);
        }
      }

      await authFetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail.trim(),
          role: newUserRole,
          displayName: newUserDisplayName.trim() || newUserEmail.split('@')[0],
          businessSlugs: finalSlugs,
        }),
      });

      success(
        'משתמש נוסף בהצלחה! ✓',
        `${newUserEmail} נרשם כ-${
          newUserRole === 'super_admin' ? 'מנהל-על' : 'מנהל עסק'
        } עבור ${finalSlugs.join(', ') || 'המספרה של דביר'}`
      );
      setNewUserEmail('');
      setNewUserDisplayName('');
      setNewUserBusinessSlugs('dvir');
      fetchUsers();
    } catch {
      error('שגיאת תקשורת');
    } finally {
      setIsAddingUser(false);
    }
  };

  // Delete User
  const handleDeleteUser = (uid: string, email: string) => {
    showConfirm({
      title: 'מחיקת משתמש',
      message: `האם למחוק את המשתמש ${email}? לא יוכל להתחבר יותר למערכת.`,
      confirmText: 'מחק משתמש',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await authFetch(`/api/auth/users?uid=${uid}`, { method: 'DELETE' });
          if (res.ok) {
            success('משתמש נמחק בהצלחה');
            fetchUsers();
          } else {
            const data = await res.json();
            error('שגיאה במחיקה', data.error);
          }
        } catch {
          error('שגיאת תקשורת');
        }
      },
    });
  };

  // Update Report Status
  const handleStatusChange = async (reportId: string, newStatus: BugReport['status']) => {
    try {
      await authFetch('/api/bug-reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, status: newStatus }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      const statusLabel =
        newStatus === 'new' ? 'חדש 🟢' : newStatus === 'in_progress' ? 'בטיפול 🟡' : 'טופל ונסגר ⚪';
      success('סטטוס הפנייה עודכן בהצלחה', `הסטטוס שונה ל-${statusLabel}`);
    } catch {
      error('שגיאה בעדכון סטטוס הפנייה');
    }
  };

  // Delete Report
  const handleDeleteReport = (reportId: string) => {
    showConfirm({
      title: 'מחיקת דיווח תקלה',
      message: 'האם למחוק דיווח זה לצמיתות מרשימת הפניות?',
      confirmText: 'מחק דיווח 🗑️',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await authFetch(`/api/bug-reports?id=${encodeURIComponent(reportId)}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            setReports((prev) => prev.filter((r) => r.id !== reportId));
            success('הדיווח נמחק בהצלחה ✓');
          } else {
            error('שגיאה במחיקת הדיווח');
          }
        } catch {
          error('שגיאת תקשורת במחיקת הדיווח');
        }
      },
    });
  };

  // Save Edited Business
  const handleSaveEditedBusiness = async () => {
    if (!editingBiz) return;
    setIsSavingBiz(true);
    try {
      if (isFirebaseConfigured && db) {
        try {
          const docId =
            editingBiz.id || (editingBiz.slug ? `biz-${editingBiz.slug}` : `biz-${Date.now()}`);
          const cleanDoc: Record<string, any> = {};
          for (const [k, v] of Object.entries(editingBiz)) {
            if (v !== undefined) cleanDoc[k] = v;
          }
          await setDoc(doc(db, 'businesses', docId), cleanDoc, { merge: true });
        } catch (dbErr) {
          console.warn('Client Firestore save fallback:', dbErr);
        }
      }

      await authFetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBiz),
      });

      setBusinesses((prev) =>
        prev.map((b) => (b.slug === editingBiz.slug ? { ...b, ...editingBiz } : b))
      );
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
      success('ההגדרות נשמרו בהצלחה! ✓', `האתר של ${editingBiz.name} עודכן בזמן אמת`);
    } catch (err: any) {
      console.error('Error saving business edits:', err);
      setBusinesses((prev) =>
        prev.map((b) => (b.slug === editingBiz.slug ? { ...b, ...editingBiz } : b))
      );
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
      success('השינויים נשמרו ועודכנו במסך! ✓');
    } finally {
      setIsSavingBiz(false);
    }
  };

  // Delete Business
  const handleDeleteBusiness = (slug: string, name: string) => {
    showConfirm({
      title: `מחיקת ${name}`,
      message: `האם אתה בטוח שברצונך למחוק לצמיתות את המספרה "${name}" (thecut.co.il/${slug})?`,
      confirmText: 'מחק מספרה 🗑️',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await authFetch(`/api/admin/businesses?slug=${encodeURIComponent(slug)}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            setBusinesses((prev) => prev.filter((b) => b.slug !== slug));
            success(`המספרה "${name}" נמחקה בהצלחה מהמערכת ✓`);
          } else {
            error('שגיאה במחיקת המספרה');
          }
        } catch {
          error('שגיאת תקשורת במחיקת המספרה');
        }
      },
    });
  };

  // ----------------------------------------------------------------
  // AUTH GATE SCREEN
  // ----------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-bold">טוען מערכת ניהול-על...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
          adminTheme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#121212] text-white'
        }`}
        dir="rtl"
      >
        <div
          className={`max-w-md w-full rounded-3xl p-8 shadow-2xl border transition-all text-center ${
            adminTheme === 'light'
              ? 'bg-white border-slate-200 shadow-slate-200/50'
              : 'bg-[#1C1C1C] border-[#C9A84C]/30 shadow-black/60'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />
          </div>

          <h1
            className={`text-xl font-black mb-1 ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            The Cut · Super Admin
          </h1>
          <p
            className={`text-xs mb-6 ${
              adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
            }`}
          >
            פורטל ניהול-על רב-עסקי (Multi-Tenant Master Panel)
          </p>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md border ${
                adminTheme === 'light'
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-slate-200'
                  : 'bg-white hover:bg-gray-100 text-black border-transparent shadow-lg'
              } disabled:opacity-50`}
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>התחברות מהירה באמצעות Google</span>
            </button>

            {authUser && !isSuperAdmin && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-right space-y-1">
                <div>⚠️ גישה נדחתה לחשבון {authUser.email}</div>
                <div className="text-[11px] text-rose-300 font-normal">
                  חשבון זה אינו מוגדר כמנהל-על (Super Admin).
                </div>
              </div>
            )}
          </div>

          <div
            className={`mt-6 pt-4 border-t text-[11px] ${
              adminTheme === 'light' ? 'border-slate-200 text-slate-400' : 'border-white/10 text-zinc-500'
            }`}
          >
            The Cut SaaS Platform · v2.1 Pro
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // AUTHENTICATED SUPER ADMIN DASHBOARD
  // ----------------------------------------------------------------
  return (
    <div
      className={`min-h-screen pb-20 font-sans transition-colors duration-200 ${
        adminTheme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#121212] text-white'
      }`}
      dir="rtl"
    >
      {/* Top Navbar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          adminTheme === 'light'
            ? 'bg-white/90 border-slate-200 shadow-xs'
            : 'bg-[#181818]/90 border-white/10 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A84C] flex items-center justify-center text-black font-black shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`font-black text-sm block leading-tight ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                The Cut · Super Admin
              </span>
              <span className="text-[10px] text-[#B89230] font-bold">Multi-Tenant Master Panel</span>
            </div>
          </div>

          {/* Theme & User Profile Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleAdminTheme}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                adminTheme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-400'
              }`}
              title={adminTheme === 'light' ? 'עבור למצב כהה' : 'עבור למצב בהיר'}
            >
              {adminTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {adminUser && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                  adminTheme === 'light'
                    ? 'bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-white/5 border-white/10 text-zinc-300'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold truncate max-w-[120px] sm:max-w-[200px]">
                  {adminUser.displayName || adminUser.email}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                adminTheme === 'light'
                  ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600'
                  : 'bg-red-950/40 hover:bg-red-900/60 border-red-500/30 text-red-400'
              }`}
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div
            className={`rounded-2xl p-4 sm:p-5 transition-all ${
              adminTheme === 'light'
                ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
                : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-bold ${
                  adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
                }`}
              >
                מספרות פעילות
              </span>
              <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-amber-50' : 'bg-white/5'}`}>
                <Building2 className="w-4 h-4 text-[#C9A84C]" />
              </div>
            </div>
            <div
              className={`text-2xl font-black ${
                adminTheme === 'light' ? 'text-slate-900' : 'text-white'
              }`}
            >
              {businesses.length}
            </div>
            <span className="text-[10px] text-[#B89230] font-bold">The Cut Multi-Tenant</span>
          </div>

          <div
            className={`rounded-2xl p-4 sm:p-5 transition-all ${
              adminTheme === 'light'
                ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
                : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-bold ${
                  adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
                }`}
              >
                דיווחי תקלות חדשים
              </span>
              <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-rose-50' : 'bg-white/5'}`}>
                <Bug className="w-4 h-4 text-rose-500" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-500">
              {reports.filter((r) => r.status === 'new').length}
            </div>
            <span
              className={`text-[10px] ${
                adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-400'
              }`}
            >
              מתוך {reports.length} סך הכל
            </span>
          </div>

          <div
            className={`rounded-2xl p-4 sm:p-5 transition-all ${
              adminTheme === 'light'
                ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
                : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-bold ${
                  adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
                }`}
              >
                תורים בפלטפורמה
              </span>
              <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-amber-50' : 'bg-white/5'}`}>
                <Calendar className="w-4 h-4 text-[#C9A84C]" />
              </div>
            </div>
            <div
              className={`text-2xl font-black ${
                adminTheme === 'light' ? 'text-slate-900' : 'text-white'
              }`}
            >
              פעיל
            </div>
            <span
              className={`text-[10px] ${
                adminTheme === 'light' ? 'text-emerald-600 font-semibold' : 'text-emerald-400'
              }`}
            >
              סנכרון ענן בזמן אמת
            </span>
          </div>

          <div
            className={`rounded-2xl p-4 sm:p-5 transition-all ${
              adminTheme === 'light'
                ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
                : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-bold ${
                  adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
                }`}
              >
                התאמה אישית
              </span>
              <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-emerald-50' : 'bg-white/5'}`}>
                <Settings2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div
              className={`text-2xl font-black ${
                adminTheme === 'light' ? 'text-emerald-600' : 'text-emerald-400'
              }`}
            >
              100%
            </div>
            <span
              className={`text-[10px] ${
                adminTheme === 'light' ? 'text-emerald-600 font-semibold' : 'text-emerald-400'
              }`}
            >
              מיתוג & מחירון דינמי
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex border-b mb-6 gap-2 sm:gap-3 overflow-x-auto no-scrollbar whitespace-nowrap pb-1 transition-colors ${
            adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
          }`}
        >
          <button
            onClick={() => setActiveTab('businesses')}
            className={`pb-3 px-4 font-black text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'businesses'
                ? adminTheme === 'light'
                  ? 'border-[#C9A84C] text-[#B89230] bg-amber-50/60 rounded-t-xl'
                  : 'border-[#C9A84C] text-[#C9A84C]'
                : adminTheme === 'light'
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>ניהול מספרות ועסקים ({businesses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-4 font-black text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'reports'
                ? adminTheme === 'light'
                  ? 'border-[#C9A84C] text-[#B89230] bg-amber-50/60 rounded-t-xl'
                  : 'border-[#C9A84C] text-[#C9A84C]'
                : adminTheme === 'light'
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>מרכז תקלות ופידבקים ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-black text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? adminTheme === 'light'
                  ? 'border-[#C9A84C] text-[#B89230] bg-amber-50/60 rounded-t-xl'
                  : 'border-[#C9A84C] text-[#C9A84C]'
                : adminTheme === 'light'
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ניהול משתמשים והרשאות ({managedUsers.length})</span>
          </button>
        </div>

        {/* TAB 1: BUSINESSES */}
        {activeTab === 'businesses' && (
          <BusinessesTab
            businesses={businesses}
            businessesLoading={businessesLoading}
            adminTheme={adminTheme}
            onRefresh={fetchBusinesses}
            onOpenCreateModal={() => setIsNewBizModalOpen(true)}
            onOpenEditModal={(biz) => setEditingBiz(biz)}
            onDeleteBusiness={handleDeleteBusiness}
          />
        )}

        {/* TAB 2: REPORTS */}
        {activeTab === 'reports' && (
          <ReportsTab
            reports={reports}
            statusFilter={statusFilter}
            reportsLoading={reportsLoading}
            adminTheme={adminTheme}
            onFilterChange={setStatusFilter}
            onRefresh={fetchReports}
            onStatusChange={handleStatusChange}
            onDeleteReport={handleDeleteReport}
          />
        )}

        {/* TAB 3: USERS */}
        {activeTab === 'users' && (
          <UsersTab
            managedUsers={managedUsers}
            usersLoading={usersLoading}
            businesses={businesses}
            adminTheme={adminTheme}
            newUserEmail={newUserEmail}
            newUserDisplayName={newUserDisplayName}
            newUserRole={newUserRole}
            newUserBusinessSlugs={newUserBusinessSlugs}
            isAddingUser={isAddingUser}
            onRefresh={fetchUsers}
            onChangeEmail={setNewUserEmail}
            onChangeDisplayName={setNewUserDisplayName}
            onChangeRole={setNewUserRole}
            onChangeBusinessSlugs={setNewUserBusinessSlugs}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </main>

      {/* MODAL: EDIT BUSINESS */}
      {editingBiz && (
        <EditBusinessModal
          editingBiz={editingBiz}
          adminTheme={adminTheme}
          isSavingBiz={isSavingBiz}
          saveNotice={saveNotice}
          onClose={() => setEditingBiz(null)}
          onUpdateEditingBiz={setEditingBiz}
          onSave={handleSaveEditedBusiness}
        />
      )}

      {/* MODAL: CREATE BUSINESS */}
      <CreateBusinessModal
        adminTheme={adminTheme}
        isOpen={isNewBizModalOpen}
        onClose={() => setIsNewBizModalOpen(false)}
        onCreateSuccess={(newBiz) => {
          setBusinesses((prev) => {
            const filtered = prev.filter((b) => b.slug !== newBiz.slug);
            const dvir = filtered.find((b) => b.slug === 'dvir');
            const others = filtered.filter((b) => b.slug !== 'dvir');
            return dvir ? [dvir, newBiz, ...others] : [newBiz, ...others];
          });
        }}
      />
    </div>
  );
}
