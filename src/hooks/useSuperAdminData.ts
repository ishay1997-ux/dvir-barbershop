'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import type { Business, BugReport } from '@/components/super-admin/types';

export const defaultBusinessesList: Business[] = [
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

export function useSuperAdminData() {
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
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState<'reports' | 'businesses' | 'users' | 'overview' | 'settings'>('businesses');

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

  // Google Sign-In Handler
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

  // Clone Business
  const handleCloneBusiness = async (biz: Business) => {
    try {
      const clonedSlug = `${biz.slug}-copy`;
      const clonedName = `${biz.name} (עותק)`;
      const newBizData = {
        ...biz,
        id: `biz-${clonedSlug}`,
        slug: clonedSlug,
        name: clonedName,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const res = await authFetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBizData),
      });

      if (res.ok) {
        success('העסק שוכפל בהצלחה! 📋', `נוצר עותק חדש תחת הכתובת /${clonedSlug}`);
        fetchBusinesses();
      } else {
        const data = await res.json();
        error(data.error || 'שגיאה בשכפול העסק');
      }
    } catch {
      error('שגיאה בשכפול העסק');
    }
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
    // Businesses
    businesses,
    businessesLoading,
    fetchBusinesses,
    isNewBizModalOpen,
    setIsNewBizModalOpen,
    editingBiz,
    setEditingBiz,
    isSavingBiz,
    saveNotice,
    handleCloneBusiness,
    handleSaveEditedBusiness,
    handleDeleteBusiness,
    // Reports
    reports,
    reportsLoading,
    statusFilter,
    setStatusFilter,
    fetchReports,
    handleStatusChange,
    handleDeleteReport,
    // Users
    managedUsers,
    usersLoading,
    newUserEmail,
    setNewUserEmail,
    newUserRole,
    setNewUserRole,
    newUserDisplayName,
    setNewUserDisplayName,
    newUserBusinessSlugs,
    setNewUserBusinessSlugs,
    isAddingUser,
    fetchUsers,
    handleAddUser,
    handleDeleteUser,
  };
}
