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
  Search,
  Phone,
  MessageCircle,
  ExternalLink,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Scissors,
  Lock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Zap,
  Eye,
  EyeOff,
  Sparkles,
  Settings2,
  Edit,
  Megaphone,
  MapPin,
  Palette,
  Layers,
  Key,
  Check,
  Award,
  Crown,
  Share2,
  Users,
  UserPlus,
  Mail,
  Sun,
  Moon,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/common/ToastProvider';
import { BUSINESS_ARCHETYPES, THEME_PALETTES, generateTailoredBusinessConfig } from '@/lib/archetypes';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessLayoutConfig } from '@/types/business';

interface BugReport {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  category: string;
  message: string;
  businessName: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

interface ServiceItem {
  name: string;
  price: number;
  duration: number;
  description?: string;
  popular?: boolean;
}

interface BranchItem {
  name: string;
  address: string;
  wazeLink?: string;
  phone?: string;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  slogan?: string;
  announcement?: string;
  themeColor?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  wazeUrl?: string;
  whatsappNumber?: string;
  websiteUrl?: string;
  avatarUrl?: string;
  galleryImages?: string[];
  branchesCount: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'pro' | 'starter' | 'enterprise';
  createdAt: string;
  services?: ServiceItem[];
  branches?: BranchItem[];
  layout?: BusinessLayoutConfig;
}

// Intelligent Appointment Auto-Finder for Support Tickets
function ReportAppointmentHelper({
  phone,
  customerName,
  businessName,
}: {
  phone: string;
  customerName: string;
  businessName: string;
}) {
  const { success, error, showConfirm } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomerAppointments() {
      try {
        const res = await fetch(`/api/appointments?phone=${encodeURIComponent(phone)}`);
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.appointments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    findCustomerAppointments();
  }, [phone]);

  const handleCancelAppointment = (aptId: string, aptTime: string) => {
    showConfirm({
      title: 'ביטול תור ופינוי משבצת',
      message: `האם לבטל את התור של ${customerName} בשעה ${aptTime} ולפנות את המשבצת ביומן של ${businessName}?`,
      confirmText: 'בטל תור עכשיו ❌',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/appointments', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: aptId, status: 'cancelled' }),
          });
          if (res.ok) {
            setAppointments((prev) =>
              prev.map((a) => (a.id === aptId ? { ...a, status: 'cancelled' } : a))
            );
            success('התור בוטל בהצלחה! ✓', `המשבצת לשעה ${aptTime} פונתה ביומן`);
          } else {
            error('שגיאה בביטול התור', 'נסה שוב מאוחר יותר');
          }
        } catch (err) {
          error('שגיאת תקשורת בביטול התור');
        }
      },
    });
  };

  const activeAppointments = appointments.filter((a) => a.status !== 'cancelled');

  return (
    <div className="mb-3 p-3 rounded-xl bg-[#171717] border border-[#C9A84C]/25 text-xs text-right font-sans">
      <div className="flex items-center gap-1.5 text-[#C9A84C] font-black mb-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
        <span>איתור תורים אוטומטי למספר {phone}:</span>
      </div>

      {loading ? (
        <span className="text-[11px] text-zinc-500">מחפש תורים רשומים במערכת...</span>
      ) : activeAppointments.length > 0 ? (
        <div className="space-y-2">
          {activeAppointments.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#222222] border border-white/10"
            >
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>📅 תאריך: <strong>{apt.date || 'לא צוין'}</strong></span>
                  <span>בשעה <strong className="text-[#C9A84C]" dir="ltr">{apt.time || '16:00'}</strong></span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {apt.serviceName || apt.service || 'תספורת'} · {apt.branchName || 'סניף ראשי'} ({formatPrice(apt.servicePrice || apt.price || 80)})
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCancelAppointment(apt.id, apt.time || '16:00')}
                className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-bold text-[11px] transition-colors self-start sm:self-center cursor-pointer"
              >
                בטל תור זה עכשיו ❌
              </button>
            </div>
          ))}
        </div>
      ) : appointments.length > 0 ? (
        <div className="text-[11px] text-emerald-400 font-bold">
          ✓ נבדק במערכת: כל התורים הקודמים של הלקוח כבר בוטלו / הושלמו (אין תור פעיל כרגע).
        </div>
      ) : (
        <div className="text-[11px] text-zinc-400">
          🔍 לא נמצאו תורים עתידיים רשומים במערכת למספר זה (ייתכן שהתור כבר בוטל או שלא הוזמן).
        </div>
      )}
    </div>
  );
}

export default function SuperAdminPage() {
  const router = useRouter();
  const { success, error, info, showConfirm } = useToast();
  const { user: authUser, loading: authLoading, isSuperAdmin, authFetch, logout, firebaseUser } = useAuth();

  // Auth state
  const isAuthenticated = isSuperAdmin;
  const adminUser = authUser ? {
    email: authUser.email,
    displayName: authUser.displayName,
    photoURL: authUser.photoURL,
  } : null;
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
      { name: 'סניף אריאל (אוניברסיטת אריאל)', address: 'קמפוס אוניברסיטת אריאל (מרכז הסטודנט)', wazeLink: 'https://waze.com/ul?q=Ariel%20University' },
      { name: 'סניף רחובות (מרכז העיר)', address: 'הרצל 180, רחובות (ליד מכון ויצמן)', wazeLink: 'https://waze.com/ul?q=Herzl%20180%20Rehovot' },
    ],
    services: [
      { name: 'תספורת גברים פרימיום', price: 80, duration: 30 },
      { name: 'עיצוב ופיסול זקן Master', price: 40, duration: 20 },
      { name: 'חבילת VIP משולבת (תספורת + זקן)', price: 110, duration: 45 },
      { name: 'תספורת ילדים ונוער', price: 70, duration: 30 },
    ],
  },
];

  // Businesses state
  const [businesses, setBusinesses] = useState<Business[]>(defaultBusinessesList);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [isNewBizModalOpen, setIsNewBizModalOpen] = useState(false);

  // Smart 3-Step Wizard for New Business Creation
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [newBizName, setNewBizName] = useState('');
  const [newBizSlug, setNewBizSlug] = useState('');
  const [newBizOwner, setNewBizOwner] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizCity, setNewBizCity] = useState('');
  const [newBizInstagram, setNewBizInstagram] = useState('');
  const [newBizPlan, setNewBizPlan] = useState<'pro' | 'starter' | 'enterprise'>('pro');
  const [newBizArchetype, setNewBizArchetype] = useState<string>('mens-barbershop');
  const [newBizThemeColor, setNewBizThemeColor] = useState<string>('#C9A84C');
  const [newBizSlogan, setNewBizSlogan] = useState('');
  const [newBizAnnouncement, setNewBizAnnouncement] = useState('');
  const [newBizServices, setNewBizServices] = useState<ServiceItem[]>([]);
  const [newBizBranches, setNewBizBranches] = useState<BranchItem[]>([]);
  const [isCreatingBiz, setIsCreatingBiz] = useState(false);
  const [createdBusinessResult, setCreatedBusinessResult] = useState<Business | null>(null);

  // Edit Business Customization State
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [editTab, setEditTab] = useState<'branding' | 'layout' | 'social' | 'gallery' | 'services' | 'branches' | 'banner'>('branding');
  const [isSavingBiz, setIsSavingBiz] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');

  // New service inside edit modal
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(80);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(30);

  // New branch inside edit modal
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');

  // User Management State
  const [managedUsers, setManagedUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'super_admin' | 'business_admin'>('business_admin');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserBusinessSlugs, setNewUserBusinessSlugs] = useState('');
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
      // AuthContext handles the rest — verifies role via /api/auth/me
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      const code = err?.code || '';

      if (code === 'auth/popup-closed-by-user') {
        // User closed the popup, do nothing
      } else if (code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
        error('דומיין לא מורשה ב-Firebase', `יש להוסיף את הדומיין ${currentDomain} ב-Firebase Console -> Authentication -> Authorized domains`);
      } else if (code === 'auth/popup-blocked') {
        error('חלון קופץ נחסם', 'אנא אפשר חלונות קופצים בדפדפן כדי להתחבר עם Google');
      } else if (code === 'auth/operation-not-allowed') {
        error('שירות Google Sign-In כבוי', 'יש להפעיל את Google Provider ב-Firebase Console תחת Sign-in method');
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
      // 1. Direct Firestore client read (zero-cache, reflects deletes instantly)
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

      // 2. Fetch from /api/admin/businesses
      const res = await authFetch('/api/admin/businesses');
      if (res.ok) {
        const data = await res.json();
        if (data.businesses && data.businesses.length > 0) {
          setBusinesses(data.businesses);
          return;
        }
      }

      // 3. Fallback: fetch flagship business
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

  // Initial Data Fetch Effect upon login
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
    const parsedSlugs = newUserBusinessSlugs.split(',').map(s => s.trim()).filter(Boolean);
    const finalSlugs = parsedSlugs.length > 0 ? parsedSlugs : (newUserRole === 'business_admin' ? ['dvir'] : []);

    try {
      const res = await authFetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail.trim(),
          role: newUserRole,
          displayName: newUserDisplayName.trim() || newUserEmail.split('@')[0],
          businessSlugs: finalSlugs,
        }),
      });
      if (res.ok) {
        success('משתמש נוסף בהצלחה! ✓', `${newUserEmail} נרשם כ-${newUserRole === 'super_admin' ? 'מנהל-על' : 'מנהל עסק'} עבור ${finalSlugs.join(', ') || 'המספרה של דביר'}`);
        setNewUserEmail('');
        setNewUserDisplayName('');
        setNewUserBusinessSlugs('dvir');
        fetchUsers();
      } else {
        const data = await res.json();
        error('שגיאה בהוספת משתמש', data.error || 'נסה שוב');
      }
    } catch (err) {
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
        } catch (err) {
          error('שגיאת תקשורת');
        }
      },
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
      fetchBusinesses();
      fetchUsers();
    }
  }, [isAuthenticated]);

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
      const statusLabel = newStatus === 'new' ? 'חדש 🟢' : newStatus === 'in_progress' ? 'בטיפול 🟡' : 'טופל ונסגר ⚪';
      success('סטטוס הפנייה עודכן בהצלחה', `הסטטוס שונה ל-${statusLabel}`);
    } catch (err) {
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
        } catch (err) {
          error('שגיאת תקשורת במחיקת הדיווח');
        }
      },
    });
  };

  // When Archetype is chosen, auto-fill Step 3 with tailored services, slogan, announcement & branch
  const syncArchetypeDefaults = (archetypeKey: string, colorHex?: string) => {
    const arch = BUSINESS_ARCHETYPES[archetypeKey] || BUSINESS_ARCHETYPES['mens-barbershop'];
    const color = colorHex || arch.defaultColor;
    const owner = newBizOwner || newBizName || 'מאסטר ברבר';
    const city = newBizCity || 'ישראל';

    setNewBizThemeColor(color);
    setNewBizSlogan(arch.slogan(owner, city, newBizName || 'המספרה'));
    setNewBizAnnouncement(arch.announcement(owner, city, newBizName || 'המספרה'));
    setNewBizServices(arch.services);
    setNewBizBranches([
      {
        name: `סניף ראשי – ${city}`,
        address: `${city} (מרכז העיר)`,
        wazeLink: `https://waze.com/ul?q=${encodeURIComponent(city)}`,
        phone: newBizPhone,
      },
    ]);
  };

  // Create New Business Handler (Smart Generator)
  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newBizSlug || !newBizPhone) {
      error('נא למלא את כל שדות החובה');
      return;
    }

    setIsCreatingBiz(true);
    try {
      const res = await authFetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBizName,
          slug: newBizSlug,
          ownerName: newBizOwner || newBizName,
          phone: newBizPhone,
          city: newBizCity || 'ישראל',
          plan: newBizPlan,
          archetypeId: newBizArchetype,
          themeColor: newBizThemeColor,
          instagramHandle: newBizInstagram,
          slogan: newBizSlogan,
          announcement: newBizAnnouncement,
          services: newBizServices,
          branches: newBizBranches,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBusinesses((prev) => {
          const filtered = prev.filter((b) => b.slug !== data.business.slug);
          // Keep Dvir at top, put new biz at index 1
          const dvir = filtered.find((b) => b.slug === 'dvir');
          const others = filtered.filter((b) => b.slug !== 'dvir');
          return dvir ? [dvir, data.business, ...others] : [data.business, ...others];
        });
        setCreatedBusinessResult(data.business);
        success(`האתר של "${newBizName}" הוקם בהצלחה באוויר! 🎉`, `thecut.co.il/${newBizSlug} זמין כעת לצפייה`);
      } else {
        error('שגיאה בהקמת העסק', 'בדוק את השדות ונסה שנית');
      }
    } catch (err) {
      error('שגיאת תקשורת בהקמת העסק');
    } finally {
      setIsCreatingBiz(false);
    }
  };

  // Save Edited Business (PATCH)
  const handleSaveEditedBusiness = async () => {
    if (!editingBiz) return;
    setIsSavingBiz(true);
    try {
      // 1. Direct Client Firestore Write (using authenticated Google user credentials)
      if (isFirebaseConfigured && db) {
        try {
          const docId = editingBiz.id || (editingBiz.slug ? `biz-${editingBiz.slug}` : `biz-${Date.now()}`);
          const cleanDoc: Record<string, any> = {};
          for (const [k, v] of Object.entries(editingBiz)) {
            if (v !== undefined) cleanDoc[k] = v;
          }
          await setDoc(doc(db, 'businesses', docId), cleanDoc, { merge: true });
        } catch (dbErr) {
          console.warn('Client Firestore save fallback:', dbErr);
        }
      }

      // 2. Server API PATCH
      const res = await authFetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBiz),
      });

      // Update local state in Super Admin
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

  // Delete Business Handler
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
        } catch (err) {
          error('שגיאת תקשורת במחיקת המספרה');
        }
      },
    });
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });
  // ============================================================
  // LOADING STATE
  // ============================================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white flex items-center justify-center p-4" dir="rtl">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-bold">בודק הרשאות גישה...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // UNAUTHORIZED (Logged in to Firebase but no super_admin role)
  // ============================================================
  if (firebaseUser && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,_rgba(201,168,76,0.12)_0%,_transparent_65%)] pointer-events-none" />
        <div className="relative max-w-md w-full bg-[#18181B]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">אין הרשאת Super Admin</h2>
          <p className="text-sm text-zinc-400 mb-2">
            החשבון <span className="text-white font-bold">{firebaseUser.email}</span> אינו מורשה לגשת לפאנל ניהול-על.
          </p>
          <p className="text-xs text-zinc-500 mb-6">
            רק חשבונות שהוגדרו כמנהלי-על רשאים לגשת למסך זה.
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#DFCA85] text-[#18181B] font-black text-sm cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all"
          >
            התנתק ונסה עם חשבון אחר
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // LOGIN SCREEN (Not authenticated) - Professional Enterprise SaaS
  // ============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
        {/* Background Ambient Glow & Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,_rgba(201,168,76,0.12)_0%,_transparent_65%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-md w-full bg-[#18181B]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-center">
          {/* Top Subtle Luxury Accent Line */}
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />

          {/* Central Security Badge */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-[#2A2A2E] to-[#161618] border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-5 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />
            <div className="absolute -inset-1 rounded-2xl border border-[#C9A84C]/20 animate-pulse pointer-events-none" />
          </div>

          {/* Header & Product Identity */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-zinc-400 mb-2.5">
              <Lock className="w-3 h-3 text-[#C9A84C]" />
              <span>The Cut Platform · Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              פורטל ניהול על
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              כניסה מאובטחת למערכת השליטה המרכזית
            </p>
          </div>

          <div className="space-y-4">
            {/* Primary Google Workspace SSO Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-[#18181B] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 hover:shadow-lg active:scale-[0.99]"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              )}
              <span>{googleLoading ? 'מתחבר למערכת...' : 'המשך עם חשבון Google'}</span>
            </button>

            {authError && (
              <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-medium text-right flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>שגיאה באימות. נסה שוב.</span>
              </div>
            )}

            {/* Info text */}
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              כניסה מאובטחת באמצעות חשבון Google מורשה בלבד.
              <br />
              רק חשבונות שהוגדרו ע&quot;י מנהל-על רשאים לגשת.
            </p>
          </div>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>The Cut Multi-Tenant SaaS · אימות Google SSO מאובטח</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // AUTHENTICATED SUPER-ADMIN DASHBOARD
  // ============================================================
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      adminTheme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#121212] text-white'
    }`} dir="rtl">
      {/* Top Navbar */}
      <header className={`border-b sticky top-0 z-40 transition-colors ${
        adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#1C1C1C] border-white/10'
      }`}>
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {adminUser?.photoURL ? (
              <img
                src={adminUser.photoURL}
                alt={adminUser.displayName || 'ישי'}
                className="w-10 h-10 rounded-2xl border border-[#C9A84C] shadow-md object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#C9A84C] flex items-center justify-center text-[#1C1C1C] font-black text-base shadow-md">
                <ShieldCheck className="w-5 h-5 text-[#1C1C1C]" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-base sm:text-lg font-black ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  The Cut · פאנל מנהל מערכת ({adminUser?.displayName || 'ישי'})
                </h1>
                <span className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {adminUser?.email ? `מחובר כ-${adminUser.email}` : 'מחובר ✓'}
                </span>
              </div>
              <p className={`text-[11px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                ניהול מרובה מספרות, התאמה אישית ותמיכה טכנית
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleAdminTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                adminTheme === 'light'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-xs'
                  : 'bg-white/10 border-white/15 text-zinc-200 hover:text-white'
              }`}
              title={adminTheme === 'light' ? 'החלף למצב כהה' : 'החלף למצב בהיר'}
            >
              {adminTheme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>מצב כהה 🌙</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>מצב בהיר ☀️</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-xl transition-colors border border-red-500/30 font-bold cursor-pointer"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className={`rounded-2xl p-4 sm:p-5 transition-all ${
            adminTheme === 'light'
              ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
              : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                עסקים רשומים
              </span>
              <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-amber-50' : 'bg-white/5'}`}>
                <Building2 className="w-4 h-4 text-[#C9A84C]" />
              </div>
            </div>
            <div className={`text-2xl font-black ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              {businesses.length}
            </div>
            <span className={`text-[10px] ${adminTheme === 'light' ? 'text-emerald-600 font-semibold' : 'text-emerald-400'}`}>
              {businesses.length > 0 ? `${businesses.filter(b => b.status === 'active').length} מספרות פעילות באוויר` : 'סנכרון ענן פעיל'}
            </span>
          </div>

          <div className={`rounded-2xl p-4 sm:p-5 transition-all ${
            adminTheme === 'light'
              ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
              : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                דיווחי תקלות חדשים
              </span>
              <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-rose-50' : 'bg-white/5'}`}>
                <Bug className="w-4 h-4 text-rose-500" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-500">
              {reports.filter((r) => r.status === 'new').length}
            </div>
            <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-400'}`}>
              מתוך {reports.length} סך הכל
            </span>
          </div>

          <div className={`rounded-2xl p-4 sm:p-5 transition-all ${
            adminTheme === 'light'
              ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
              : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                תורים בפלטפורמה
              </span>
              <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-amber-50' : 'bg-white/5'}`}>
                <Calendar className="w-4 h-4 text-[#C9A84C]" />
              </div>
            </div>
            <div className={`text-2xl font-black ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              פעיל
            </div>
            <span className={`text-[10px] ${adminTheme === 'light' ? 'text-emerald-600 font-semibold' : 'text-emerald-400'}`}>
              סנכרון ענן בזמן אמת
            </span>
          </div>

          <div className={`rounded-2xl p-4 sm:p-5 transition-all ${
            adminTheme === 'light'
              ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
              : 'bg-[#1C1C1C] border border-white/10 text-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                התאמה אישית
              </span>
              <div className={`p-1.5 rounded-xl ${adminTheme === 'light' ? 'bg-emerald-50' : 'bg-white/5'}`}>
                <Settings2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className={`text-2xl font-black ${adminTheme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
              100%
            </div>
            <span className={`text-[10px] ${adminTheme === 'light' ? 'text-emerald-600 font-semibold' : 'text-emerald-400'}`}>
              מיתוג & מחירון דינמי
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b mb-6 gap-2 sm:gap-3 transition-colors ${
          adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
        }`}>
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

        {/* ============================================================ */}
        {/* TAB 1: BUSINESSES & TENANTS MANAGEMENT                        */}
        {/* ============================================================ */}
        {activeTab === 'businesses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className={`text-base font-black ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  רשימת מספרות ועסקים פעילים
                </h2>
                <p className={`text-xs ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                  כל עסק מקבל אתר אישי יוקרתי ומערכת זימון תורים מותאמת ב-thecut.co.il/[slug]
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchBusinesses}
                  disabled={businessesLoading}
                  className={`text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
                    adminTheme === 'light'
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${businessesLoading ? 'animate-spin text-[#C9A84C]' : ''}`} />
                  <span>רענן מספרות</span>
                </button>

                <button
                  onClick={() => {
                    setWizardStep(1);
                    setCreatedBusinessResult(null);
                    setNewBizName('');
                    setNewBizSlug('');
                    setNewBizOwner('');
                    setNewBizPhone('');
                    setNewBizCity('');
                    setNewBizInstagram('');
                    setNewBizArchetype('mens-barbershop');
                    syncArchetypeDefaults('mens-barbershop');
                    setIsNewBizModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs transition-colors shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>הקמת עסק / מספרה חדשה ✨</span>
                </button>
              </div>
            </div>

            {/* Businesses Loading Skeleton */}
            {businessesLoading && businesses.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className={`rounded-2xl p-5 space-y-4 animate-pulse ${
                    adminTheme === 'light' ? 'bg-white border border-slate-200 shadow-xs' : 'bg-[#1C1C1C] border border-white/10 shadow-lg'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-200" />
                        <div className="space-y-1.5">
                          <div className="w-32 h-4 bg-slate-200 rounded" />
                          <div className="w-24 h-3 bg-slate-200 rounded" />
                        </div>
                      </div>
                      <div className="w-20 h-5 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-12 bg-slate-200 rounded-xl" />
                    <div className="grid grid-cols-2 gap-2 h-16 bg-slate-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : businesses.length > 0 ? (
              /* Businesses Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businesses.map((biz) => {
                  const isDvir = biz.slug === 'dvir';
                  const bizColor = biz.themeColor || '#C9A84C';

                  return (
                    <div
                      key={biz.id}
                      className={`rounded-2xl p-5 space-y-4 relative group transition-all ${
                        adminTheme === 'light'
                          ? 'bg-white border border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-xs hover:shadow-md'
                          : 'bg-[#1C1C1C] border border-white/10 hover:border-white/20 text-white shadow-lg'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-xs"
                            style={{
                              backgroundColor: adminTheme === 'light' ? `${bizColor}18` : 'rgba(255,255,255,0.08)',
                              color: bizColor,
                              border: `1.5px solid ${bizColor}`,
                            }}
                          >
                            {biz.name.trim().charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base font-black ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                {biz.name}
                              </h3>
                            </div>
                            <span className="text-xs font-bold" style={{ color: bizColor }} dir="ltr">
                              {`thecut.co.il/${biz.slug}`}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          adminTheme === 'light'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {biz.status === 'active' ? 'פעיל באוויר ✓' : biz.status}
                        </span>
                      </div>

                      {biz.slogan && (
                        <p className={`text-xs italic p-2.5 rounded-xl font-sans border ${
                          adminTheme === 'light'
                            ? 'bg-slate-50 border-slate-200/80 text-slate-700'
                            : 'bg-[#141414] border-white/5 text-zinc-300'
                        }`}>
                          "{biz.slogan}"
                        </p>
                      )}

                      <div className={`grid grid-cols-2 gap-2 text-xs p-3 rounded-xl border ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200/80 text-slate-800'
                          : 'bg-[#141414] border-white/5 text-zinc-300'
                      }`}>
                        <div>
                          <span className={`block text-[10px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
                            מנהל עסק:
                          </span>
                          <strong className={adminTheme === 'light' ? 'text-slate-900 font-bold' : 'text-white'}>
                            {biz.ownerName}
                          </strong>
                        </div>
                        <div>
                          <span className={`block text-[10px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
                            טלפון:
                          </span>
                          <strong className={adminTheme === 'light' ? 'text-slate-900 font-bold' : 'text-white'} dir="ltr">
                            {biz.phone}
                          </strong>
                        </div>
                        <div>
                          <span className={`block text-[10px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
                            סניפים ושירותים:
                          </span>
                          <strong className={adminTheme === 'light' ? 'text-slate-900 font-bold' : 'text-white'}>
                            {biz.branches?.length || biz.branchesCount || 1} סניפים · {biz.services?.length || 3} שירותים
                          </strong>
                        </div>
                        <div>
                          <span className={`block text-[10px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
                            חבילה:
                          </span>
                          <strong className="uppercase" style={{ color: bizColor }}>
                            {biz.plan} Plan
                          </strong>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingBiz({
                              ...biz,
                              services: biz.services || [
                                { name: 'תספורת גברים / פייד', price: 80, duration: 30 },
                                { name: 'עיצוב זקן', price: 40, duration: 15 },
                              ],
                              branches: biz.branches || [{ name: `סניף ${biz.city}`, address: biz.city }],
                            });
                            setEditTab('branding');
                          }}
                          className="flex-1 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black text-center text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> ערוך והתאם אישית
                        </button>

                        <Link
                          href={`/${biz.slug}`}
                          target="_blank"
                          className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-colors flex items-center gap-1 border ${
                            adminTheme === 'light'
                              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                              : 'bg-white/10 hover:bg-white/15 border-transparent text-white'
                          }`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> צפה באתר
                        </Link>

                        <button
                          onClick={() => {
                            router.push('/admin');
                          }}
                          className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                            adminTheme === 'light'
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border-emerald-500/30'
                          }`}
                          title="התחבר כבעל מספרה זו"
                        >
                          <Key className="w-3.5 h-3.5" /> כניסה כמנהל
                        </button>

                        <button
                          onClick={() => handleDeleteBusiness(biz.slug, biz.name)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            adminTheme === 'light'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                              : 'bg-red-950/30 hover:bg-red-900/50 text-red-400 border-red-500/30'
                          }`}
                          title="מחק מספרה זו"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`rounded-2xl p-10 text-center space-y-3 border ${
                adminTheme === 'light'
                  ? 'bg-white border-slate-200 text-slate-600 shadow-xs'
                  : 'bg-[#1C1C1C] border-white/10 text-zinc-400'
              }`}>
                <Building2 className="w-10 h-10 text-[#C9A84C] mx-auto opacity-70" />
                <p className={`text-sm font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  לא נמצאו עסקים רשומים
                </p>
                <p className="text-xs">לחץ על רענן או הקם עסק חדש</p>
                <button
                  onClick={fetchBusinesses}
                  className="px-4 py-2 bg-[#C9A84C] text-black font-bold text-xs rounded-xl hover:bg-[#DFCA85] cursor-pointer"
                >
                  טען מחדש
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: BUG REPORTS & SUPPORT CENTER                           */}
        {/* ============================================================ */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {/* Header & Filter Controls */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-colors ${
              adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#1C1C1C] border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                  סנן לפי סטטוס:
                </span>
                <div className="flex gap-1.5">
                  {(['all', 'new', 'in_progress', 'resolved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-[#C9A84C] text-[#1C1C1C]'
                          : adminTheme === 'light'
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st === 'all' && 'הכל'}
                      {st === 'new' && 'חדש 🟢'}
                      {st === 'in_progress' && 'בטיפול 🟡'}
                      {st === 'resolved' && 'טופל ⚪'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={fetchReports}
                disabled={reportsLoading}
                className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl border cursor-pointer transition-colors ${
                  adminTheme === 'light'
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${reportsLoading ? 'animate-spin' : ''}`} />
                <span>רענן פניות</span>
              </button>
            </div>

            {/* Reports List */}
            {filteredReports.length > 0 ? (
              <div className="space-y-3">
                {filteredReports.map((r) => (
                  <div
                    key={r.id}
                    className={`border rounded-2xl p-5 shadow-xs transition-all ${
                      adminTheme === 'light'
                        ? r.status === 'new'
                          ? 'border-emerald-300 bg-emerald-50/40 text-slate-900'
                          : r.status === 'in_progress'
                          ? 'border-amber-300 bg-amber-50/40 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-900 opacity-80'
                        : r.status === 'new'
                        ? 'border-emerald-500/40 bg-emerald-950/5'
                        : r.status === 'in_progress'
                        ? 'border-amber-500/40 bg-amber-950/5'
                        : 'border-white/10 opacity-75'
                    }`}
                  >
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b mb-3 ${
                      adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`font-black text-sm ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                          {r.fullName}
                        </span>
                        <span className="text-xs text-[#B89230] bg-[#C9A84C]/15 px-2 py-0.5 rounded-md font-bold">
                          {r.category}
                        </span>
                        <span className={`text-[11px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
                          📍 {r.businessName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status dropdown */}
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value as any)}
                          className={`border rounded-xl px-2.5 py-1 text-xs font-bold outline-none cursor-pointer ${
                            adminTheme === 'light'
                              ? 'bg-white border-slate-300 text-slate-900'
                              : 'bg-[#141414] border-white/15 text-white'
                          }`}
                        >
                          <option value="new">חדש 🟢</option>
                          <option value="in_progress">בטיפול 🟡</option>
                          <option value="resolved">טופל ונסגר ⚪</option>
                        </select>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteReport(r.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="מחק דיווח"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Message Body */}
                    <p className={`text-sm leading-relaxed p-3.5 rounded-xl border mb-3 font-sans ${
                      adminTheme === 'light'
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-[#141414] border-white/5 text-zinc-200'
                    }`}>
                      {r.message}
                    </p>

                    {/* Intelligent Appointment Helper for this Customer */}
                    <ReportAppointmentHelper
                      phone={r.phone}
                      customerName={r.fullName}
                      businessName={r.businessName}
                    />

                    {/* Contact Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <a
                          href={`tel:${r.phone}`}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                            adminTheme === 'light'
                              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C9A84C]" /> {r.phone}
                        </a>
                        <a
                          href={`https://wa.me/972${r.phone.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(`היי ${r.fullName}, קיבלנו את פנייתך במערכת בנושא "${r.category}". נשמח לסייע:`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> מענה בוואטסאפ ללקוח
                        </a>
                        <Link
                          href="/admin/appointments"
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[#967425] hover:text-[#7A5D1C] bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 font-bold transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" /> יומן תורים של {r.businessName} ↗
                        </Link>
                      </div>

                      <span className={`text-[11px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`} dir="ltr">
                        {new Date(r.createdAt).toLocaleString('he-IL')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-2xl p-10 text-center border ${
                adminTheme === 'light' ? 'bg-white border-slate-200 text-slate-600 shadow-xs' : 'bg-[#1C1C1C] border-white/10 text-zinc-400'
              }`}>
                <CheckCircle className="w-10 h-10 text-emerald-500/50 mx-auto mb-2" />
                <p className={`text-sm font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  אין פניות או תקלות בסטטוס זה
                </p>
                <p className="text-xs">כל הדיווחים מטופס "דווחו לנו על תקלה" יופיעו כאן בזמן אמת.</p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: USER MANAGEMENT & PERMISSIONS                          */}
        {/* ============================================================ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className={`text-base font-black ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  ניהול משתמשים והרשאות במערכת
                </h2>
                <p className={`text-xs ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                  הוסף משתמשים לפי כתובת אימייל, הגדר תפקידים (מנהל-על / מנהל עסק) ושייך לעסקים ספציפיים
                </p>
              </div>

              <button
                onClick={fetchUsers}
                disabled={usersLoading}
                className={`text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
                  adminTheme === 'light'
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin text-[#C9A84C]' : ''}`} />
                <span>רענן משתמשים</span>
              </button>
            </div>

            {/* Quick Provision & WhatsApp Invite Card for Dvir */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              adminTheme === 'light' ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-gold/10 border-gold/30 text-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold text-black flex items-center justify-center font-black shrink-0">
                  ✂️
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm">גישה ישירה ומאובטחת לדביר (dvirattias10@gmail.com)</h4>
                  <p className="text-[11px] opacity-80">
                    דביר מוגדר מראש ומורשה להתחבר עם חשבון Google שלו בדף <code className="font-mono font-bold">/admin/login</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setNewUserEmail('dvirattias10@gmail.com');
                    setNewUserDisplayName('דביר אטיאס');
                    setNewUserRole('business_admin');
                    setNewUserBusinessSlugs('dvir');
                  }}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  מלא בטופס
                </button>
                <a
                  href={`https://wa.me/972587815071?text=${encodeURIComponent(
                    `היי דביר אח יקר! 🔥\nהאתר של המספרה שלך באוויר בקישור:\nhttps://thecut-reg-in.vercel.app/dvir\n\nוכדי לנהל את היומן, התורים והמחירון שלך, היכנס מכאן באמצעות חשבון ה-Google שלך:\nhttps://thecut-reg-in.vercel.app/admin/login\n(חשבון Google שלך כבר מוגדר כמנהל!)`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>שלח הזמנה לדביר ב-WhatsApp 💬</span>
                </a>
              </div>
            </div>

            {/* Add User Card */}
            <div className={`rounded-2xl p-5 transition-all border ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'bg-[#1C1C1C] border-white/10 text-white shadow-lg'
            }`}>
              <h3 className={`text-sm font-black flex items-center gap-2 mb-3 ${
                adminTheme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                <UserPlus className="w-4 h-4 text-[#C9A84C]" />
                <span>הוספת משתמש חדש</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-400'}`}>
                    כתובת אימייל (Google / Gmail):
                  </label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    dir="ltr"
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-400'}`}>
                    שם מלא:
                  </label>
                  <input
                    type="text"
                    value={newUserDisplayName}
                    onChange={(e) => setNewUserDisplayName(e.target.value)}
                    placeholder="למשל: דביר / מנהל סניף"
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-400'}`}>
                    תפקיד במערכת:
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors cursor-pointer ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  >
                    <option value="business_admin">מנהל עסק (Business Admin)</option>
                    <option value="super_admin">מנהל-על (Super Admin)</option>
                  </select>
                </div>

                {newUserRole === 'business_admin' && (
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-400'}`}>
                      שיוך למספרה / עסק:
                    </label>
                    <select
                      value={newUserBusinessSlugs || 'dvir'}
                      onChange={(e) => setNewUserBusinessSlugs(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors cursor-pointer font-bold ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    >
                      {businesses.map((b) => (
                        <option key={b.slug} value={b.slug}>
                          {b.name} ({b.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddUser}
                  disabled={isAddingUser || !newUserEmail}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingUser ? 'מוסיף...' : 'הוסף משתמש למערכת'}</span>
                </button>
              </div>
            </div>

            {/* Users List Table */}
            <div className={`rounded-2xl overflow-hidden border transition-all ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'bg-[#1C1C1C] border-white/10 text-white shadow-lg'
            }`}>
              <div className={`p-4 border-b flex items-center justify-between ${
                adminTheme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-white/10'
              }`}>
                <h3 className={`text-sm font-black flex items-center gap-2 ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  <Users className="w-4 h-4 text-[#C9A84C]" />
                  <span>משתמשים רשומים ({managedUsers.length})</span>
                </h3>
              </div>

              {usersLoading ? (
                <div className="p-10 text-center text-zinc-400">
                  <div className="w-8 h-8 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs">טוען משתמשים...</p>
                </div>
              ) : managedUsers.length > 0 ? (
                <div className={`divide-y ${adminTheme === 'light' ? 'divide-slate-100' : 'divide-white/5'}`}>
                  {managedUsers.map((u) => (
                    <div
                      key={u.uid}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        adminTheme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt={u.displayName || u.email}
                            className="w-9 h-9 rounded-full object-cover border border-slate-300"
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            adminTheme === 'light' ? 'bg-slate-200 text-slate-800' : 'bg-white/10 text-white'
                          }`}>
                            {(u.displayName || u.email || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-xs ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                              {u.displayName || u.email.split('@')[0]}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                u.role === 'super_admin'
                                  ? adminTheme === 'light'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : adminTheme === 'light'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30'
                              }`}
                            >
                              {u.role === 'super_admin' ? '👑 מנהל-על (Super Admin)' : '💼 מנהל עסק (Business Admin)'}
                            </span>
                            {u.preRegistered && (
                              <span className="bg-amber-500/20 text-amber-600 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                                ממתין לכניסה ראשונה
                              </span>
                            )}
                          </div>
                          <div className={`text-[11px] mt-0.5 flex items-center gap-2 ${
                            adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                          }`}>
                            <span dir="ltr">{u.email}</span>
                            {u.businessSlugs && u.businessSlugs.length > 0 && (
                              <span className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}>
                                · עסקים מורשים: <strong className={adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}>{u.businessSlugs.join(', ')}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`} dir="ltr">
                          נוצר: {new Date(u.createdAt).toLocaleDateString('he-IL')}
                        </span>

                        {u.email !== 'ishay1997@gmail.com' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.uid, u.email)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                              adminTheme === 'light'
                                ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600'
                                : 'bg-red-950/40 hover:bg-red-900/60 border-red-500/30 text-red-400'
                            }`}
                            title="מחק משתמש"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-400 text-xs">
                  לא נמצאו משתמשים רשומים. הוסף את המשתמש הראשון למעלה!
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL: EDIT BUSINESS & CUSTOMIZATION SUITE                   */}
      {/* ============================================================ */}
      {editingBiz && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" dir="rtl">
          <div className="absolute inset-0" onClick={() => setEditingBiz(null)} />
          <div className={`relative max-w-2xl w-full border-2 rounded-3xl p-6 shadow-2xl z-10 my-auto text-right transition-colors ${
            adminTheme === 'light'
              ? 'bg-white border-[#C9A84C] text-slate-900'
              : 'bg-[#1C1C1C] border-[#C9A84C]/50 text-white'
          }`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
              adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2 text-[#C9A84C]">
                <Settings2 className="w-6 h-6" />
                <div>
                  <h3 className={`text-base font-black ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    התאמה אישית ועריכת אתר: {editingBiz.name}
                  </h3>
                  <span className={`text-[11px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`} dir="ltr">
                    thecut.co.il/{editingBiz.slug}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingBiz(null)}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  adminTheme === 'light' ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                ✕
              </button>
            </div>

            {saveNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> השינויים נשמרו בהצלחה והאתר עודכן באוויר!
              </div>
            )}

            {/* Inner Sub-Tabs */}
            <div className={`flex border-b mb-4 gap-1 sm:gap-2 text-xs font-bold overflow-x-auto pb-1 ${
              adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
            }`}>
              {[
                { id: 'branding', label: '🏷️ פרטי עסק והגדרות' },
                { id: 'layout', label: '🎨 עיצוב, מיתוג ולייאוט' },
                { id: 'social', label: '🔗 רשתות וקישורים' },
                { id: 'gallery', label: '🖼️ תמונות וגלריה' },
                { id: 'services', label: `✂️ מחירון (${editingBiz.services?.length || 0})` },
                { id: 'branches', label: `📍 סניפים (${editingBiz.branches?.length || 0})` },
                { id: 'banner', label: '📢 באנר הודעות' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditTab(tab.id as any)}
                  className={`pb-2 px-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    editTab === tab.id
                      ? adminTheme === 'light'
                        ? 'border-[#C9A84C] text-[#B89230] font-black'
                        : 'border-[#C9A84C] text-[#C9A84C]'
                      : adminTheme === 'light'
                      ? 'border-transparent text-slate-500 hover:text-slate-900'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: LAYOUT & SITE STRUCTURE */}
            {editTab === 'layout' && (
              <div className="space-y-4 text-xs">
                <div className={`p-3 rounded-xl border ${
                  adminTheme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#141414] border-white/10 text-zinc-300'
                }`}>
                  <span className={`font-bold block mb-1 ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    📐 התאמה אישית של מבנה האתר (Layout & Structure):
                  </span>
                  באפשרותך לקבוע את סגנון ההירו העליון, עיצוב הכרטיסים ולהפעיל או לכבות סקשנים לפי העדפת הספר.
                </div>

                {/* Website Background Theme Selector */}
                <div>
                  <label className={`block font-bold mb-2 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                    ערכת רקע ואווירה כללית לאתר (Website Theme):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'dark-obsidian', name: 'שחור אובסידיאן', sub: 'Dark Obsidian', icon: '🌑', bg: 'bg-[#121212]', border: 'border-white/20' },
                      { id: 'brand-midnight', name: 'כהה גוון מותג', sub: 'Brand Midnight', icon: '🌌', bg: 'bg-[#080c10]', border: 'border-emerald-500/40' },
                      { id: 'luxury-light', name: 'בהיר פרימיום', sub: 'Luxury Light', icon: '☀️', bg: 'bg-slate-100 text-slate-900', border: 'border-slate-300' },
                      { id: 'cyber-carbon', name: 'קרבון וניאון', sub: 'Cyber Carbon', icon: '⚡', bg: 'bg-[#09090B]', border: 'border-purple-500/40' },
                    ].map((th) => {
                      const currentBg = editingBiz.layout?.bgTheme || 'dark-obsidian';
                      const isSelected = currentBg === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => {
                            setEditingBiz({
                              ...editingBiz,
                              layout: {
                                ...(editingBiz.layout || {}),
                                bgTheme: th.id as any,
                              },
                            });
                          }}
                          className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                              : adminTheme === 'light'
                              ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                              : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
                          }`}
                        >
                          <span className="text-xl mb-1">{th.icon}</span>
                          <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {th.name}
                          </span>
                          <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                            {th.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Theme Palette Picker & Custom Color (Brand & Ambient Aura) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`block font-bold ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      🎨 פלטת צבעי מיתוג והילת תאורה לאתר (Brand Color & Aura):
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                        דוגם צבע חופשי:
                      </span>
                      <input
                        type="color"
                        value={editingBiz.themeColor || '#C9A84C'}
                        onChange={(e) => setEditingBiz({ ...editingBiz, themeColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-slate-300 bg-transparent cursor-pointer"
                        title="בחר צבע חופשי"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {THEME_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setEditingBiz({ ...editingBiz, themeColor: pal.color })}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          editingBiz.themeColor === pal.color
                            ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                            : adminTheme === 'light'
                            ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                            : 'border-white/10 bg-[#141414] hover:bg-white/5'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full shadow-xs flex-shrink-0" style={{ backgroundColor: pal.color }} />
                        <span className={`text-[11px] font-bold truncate ${adminTheme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                          {pal.name.split('·')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section Visibility Toggles */}
                <div>
                  <label className={`block font-bold mb-2 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                    מודולים וסקשנים פעילים בעמוד הבית:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { key: 'showBio', label: '✂️ אודות הספר והניסיון (Barber Bio & Philosophy)', desc: 'הצגת פסקת האודות, שנות הניסיון והסטנדרטים' },
                      { key: 'showBranches', label: '📍 סניפים וניווט Waze (Branches & Hours)', desc: 'הצגת שעות פעילות, כתובת וניווט ישיר' },
                      { key: 'showBeforeAfter', label: '🌓 סליידר לפני / אחרי (Before & After Slider)', desc: 'סליידר אינטראקטיבי למהפכי תספורת וזקן' },
                      { key: 'showReviews', label: '⭐ ביקורות והמלצות (Google Reviews 5.0★)', desc: 'הצגת פידבק לקוחות מרוצים וציון ממוצע' },
                      { key: 'showFaqs', label: '❓ שאלות נפוצות (FAQ Section)', desc: 'אקורדיון שאלות ותשובות לקוחות' },
                    ].map((sec) => {
                      const isEnabled = (editingBiz.layout as any)?.[sec.key] !== false;
                      return (
                        <div
                          key={sec.key}
                          onClick={() => {
                            setEditingBiz({
                              ...editingBiz,
                              layout: {
                                ...(editingBiz.layout || {}),
                                [sec.key]: !isEnabled,
                              },
                            });
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isEnabled
                              ? adminTheme === 'light'
                                ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                                : 'bg-emerald-950/20 border-emerald-500/40 text-white'
                              : adminTheme === 'light'
                              ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                              : 'bg-white/5 border-white/10 text-zinc-500 opacity-60'
                          }`}
                        >
                          <div>
                            <div className={`font-bold text-xs ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                              {sec.label}
                            </div>
                            <div className={`text-[10px] mt-0.5 ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                              {sec.desc}
                            </div>
                          </div>
                          <div className={`w-8 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                            isEnabled ? 'bg-emerald-500 justify-end' : 'bg-zinc-400 justify-start'
                          }`}>
                            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: BUSINESS DETAILS & GENERAL */}
            {editTab === 'branding' && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                    שם המספרה / העסק:
                  </label>
                  <input
                    type="text"
                    value={editingBiz.name}
                    onChange={(e) => setEditingBiz({ ...editingBiz, name: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                    סלוגן / תיאור קצר לעמוד הבית:
                  </label>
                  <input
                    type="text"
                    value={editingBiz.slogan || ''}
                    onChange={(e) => setEditingBiz({ ...editingBiz, slogan: e.target.value })}
                    placeholder="למשל: מרכז החלקות אורגניות, בלונד ועיצוב שיער מקצועי"
                    className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      טלפון ראשי (לוואטסאפ של הלקוחות):
                    </label>
                    <input
                      type="tel"
                      value={editingBiz.phone}
                      onChange={(e) => setEditingBiz({ ...editingBiz, phone: e.target.value })}
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      שם בעל המספרה:
                    </label>
                    <input
                      type="text"
                      value={editingBiz.ownerName}
                      onChange={(e) => setEditingBiz({ ...editingBiz, ownerName: e.target.value })}
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      עיר / אזור פעילות:
                    </label>
                    <input
                      type="text"
                      value={editingBiz.city}
                      onChange={(e) => setEditingBiz({ ...editingBiz, city: e.target.value })}
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      סטטוס פעילות:
                    </label>
                    <select
                      value={editingBiz.status}
                      onChange={(e) => setEditingBiz({ ...editingBiz, status: e.target.value as any })}
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors cursor-pointer ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    >
                      <option value="active">פעיל באוויר 🟢</option>
                      <option value="pending">בהקמה / טיוטה 🟡</option>
                      <option value="suspended">מושהה זמנית 🔴</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SOCIAL & EXTERNAL LINKS */}
            {editTab === 'social' && (
              <div className="space-y-3.5 text-xs">
                <p className={`text-[11px] mb-2 leading-relaxed p-3 rounded-xl border ${
                  adminTheme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#141414] border-white/10 text-zinc-400'
                }`}>
                  💡 <strong>התאמת רשתות וקישורים לאתר:</strong> קישורים שיוזנו יוצגו ככפתורי פעולה זוהרים בדף הבית. קישורים שיישארו ריקים יוצגו אוטומטית באפור (לא פעיל).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-bold mb-1 flex items-center gap-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      <span>📸 אינסטגרם (Instagram):</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.instagramUrl || editingBiz.instagramHandle || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, instagramUrl: e.target.value, instagramHandle: e.target.value })}
                      placeholder="https://instagram.com/username או @username"
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 flex items-center gap-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      <span>👤 פייסבוק (Facebook):</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.facebookUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/page_name"
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-bold mb-1 flex items-center gap-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      <span>🎵 טיקטוק (TikTok):</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.tiktokUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, tiktokUrl: e.target.value })}
                      placeholder="https://tiktok.com/@username או @username"
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 flex items-center gap-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      <span>💬 וואטסאפ (WhatsApp להודעות):</span>
                    </label>
                    <input
                      type="tel"
                      value={editingBiz.whatsappNumber || editingBiz.phone || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, whatsappNumber: e.target.value })}
                      placeholder="050-1234567"
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-bold mb-1 flex items-center gap-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      <span>🚗 קישור Waze לניווט:</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.wazeUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, wazeUrl: e.target.value })}
                      placeholder="https://waze.com/ul?q=..."
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 flex items-center gap-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                      <span>🌐 אתר אינטרנט / דומיין מותאם:</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.websiteUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, websiteUrl: e.target.value })}
                      placeholder="https://my-barbershop.co.il"
                      className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PHOTOS & GALLERY MANAGEMENT */}
            {editTab === 'gallery' && (
              <div className="space-y-4 text-xs">
                {/* 1. Barber Avatar Photo */}
                <div className={`p-3.5 rounded-2xl space-y-3 border ${
                  adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#141414] border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-black text-xs flex items-center gap-1.5 ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        <span>👤 תמונת פרופיל / תמונת הספר:</span>
                      </h4>
                      <p className={`text-[11px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                        מופיעה בכרטיס המאסטר "הכירו את הספר"
                      </p>
                    </div>
                    {editingBiz.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingBiz({ ...editingBiz, avatarUrl: '' })}
                        className="text-[10px] text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        הסר תמונה (חזור לאות ראשונה) 🗑️
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-full border-2 overflow-hidden flex items-center justify-center shrink-0 font-black text-lg shadow-xs"
                      style={{
                        borderColor: editingBiz.themeColor || '#C9A84C',
                        color: editingBiz.themeColor || '#C9A84C',
                        backgroundColor: adminTheme === 'light' ? '#E2E8F0' : 'rgba(0,0,0,0.6)',
                      }}
                    >
                      {editingBiz.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={editingBiz.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{editingBiz.ownerName?.charAt(0) || 'ד'}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={editingBiz.avatarUrl || ''}
                        onChange={(e) => setEditingBiz({ ...editingBiz, avatarUrl: e.target.value })}
                        placeholder="הדבק קישור ישיר לתמונה (URL)..."
                        dir="ltr"
                        className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                          adminTheme === 'light'
                            ? 'bg-white border-slate-200 text-slate-900 focus:border-[#C9A84C]'
                            : 'bg-[#1C1C1C] border-white/15 text-white focus:border-[#C9A84C]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Haircut Gallery Photos Grid */}
                <div className={`p-3.5 rounded-2xl space-y-3 border ${
                  adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#141414] border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-black text-xs flex items-center gap-1.5 ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        <span>⭐ גלריית עבודות ותספורות:</span>
                      </h4>
                      <p className={`text-[11px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
                        מופיעה לצד המחירון בעמוד הראשי (לחץ על 🗑️ למחיקה)
                      </p>
                    </div>
                    <span className="text-[10px] text-[#B89230] font-bold">
                      {Array.isArray(editingBiz.galleryImages) ? editingBiz.galleryImages.length : 0} תמונות בגלריה
                    </span>
                  </div>

                  {/* Current Photos Grid */}
                  {Array.isArray(editingBiz.galleryImages) && editingBiz.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {editingBiz.galleryImages.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-300 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt={`עבודה ${imgIdx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const current = [...(editingBiz.galleryImages || [])];
                              current.splice(imgIdx, 1);
                              setEditingBiz({ ...editingBiz, galleryImages: current });
                            }}
                            className="absolute inset-0 bg-rose-950/80 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs cursor-pointer"
                            title="מחק תמונה זו"
                          >
                            <span>🗑️</span>
                            <span className="text-[10px] mt-0.5">מחק</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-6 text-center rounded-xl border border-dashed text-xs ${
                      adminTheme === 'light' ? 'bg-white border-slate-300 text-slate-500' : 'bg-[#1C1C1C] border-white/10 text-zinc-500'
                    }`}>
                      📷 אין כרגע תמונות בגלריה. הדבק קישור (URL) למטה להוספת תמונות ראשונות!
                    </div>
                  )}

                  {/* Add Image Input */}
                  <div className={`flex gap-2 pt-2 border-t ${adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                    <input
                      type="url"
                      value={newGalleryImageUrl}
                      onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                      placeholder="הדבק קישור ישיר לתמונת עבודה חדשה (URL)..."
                      dir="ltr"
                      className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-white border-slate-200 text-slate-900 focus:border-[#C9A84C]'
                          : 'bg-[#1C1C1C] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newGalleryImageUrl.trim()) return;
                        const current = Array.isArray(editingBiz.galleryImages) ? [...editingBiz.galleryImages] : [];
                        current.push(newGalleryImageUrl.trim());
                        setEditingBiz({ ...editingBiz, galleryImages: current });
                        setNewGalleryImageUrl('');
                      }}
                      className="px-4 py-2 bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
                    >
                      + הוסף לגלריה
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES & PRICING */}
            {editTab === 'services' && (
              <div className="space-y-3.5 text-xs">
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {editingBiz.services?.map((srv, idx) => (
                    <div key={idx} className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border ${
                      adminTheme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
                    }`}>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={srv.name}
                          onChange={(e) => {
                            const updated = [...(editingBiz.services || [])];
                            updated[idx].name = e.target.value;
                            setEditingBiz({ ...editingBiz, services: updated });
                          }}
                          className={`w-full bg-transparent font-bold text-xs outline-none ${
                            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={srv.price}
                          onChange={(e) => {
                            const updated = [...(editingBiz.services || [])];
                            updated[idx].price = Number(e.target.value);
                            setEditingBiz({ ...editingBiz, services: updated });
                          }}
                          className={`w-16 rounded-lg px-2 py-1 text-center font-bold text-xs outline-none border ${
                            adminTheme === 'light'
                              ? 'bg-white border-slate-300 text-[#967425]'
                              : 'bg-[#222] border-white/15 text-[#C9A84C]'
                          }`}
                        />
                        <span className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}>₪</span>
                        <input
                          type="number"
                          value={srv.duration}
                          onChange={(e) => {
                            const updated = [...(editingBiz.services || [])];
                            updated[idx].duration = Number(e.target.value);
                            setEditingBiz({ ...editingBiz, services: updated });
                          }}
                          className={`w-14 rounded-lg px-1.5 py-1 text-center text-xs outline-none border ${
                            adminTheme === 'light'
                              ? 'bg-white border-slate-300 text-slate-800'
                              : 'bg-[#222] border-white/15 text-white'
                          }`}
                        />
                        <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>דק׳</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBiz.services?.filter((_, i) => i !== idx);
                            setEditingBiz({ ...editingBiz, services: updated });
                          }}
                          className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new service row */}
                <div className={`pt-2 border-t flex items-center gap-2 ${adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="שם שירות חדש (למשל: צבע / פן)..."
                    className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  />
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    placeholder="מחיר"
                    className={`w-16 rounded-xl px-2 py-2 text-center text-xs outline-none border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  />
                  <span className={`text-xs ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>₪</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newServiceName) return;
                      const updated = [...(editingBiz.services || []), { name: newServiceName, price: newServicePrice, duration: newServiceDuration }];
                      setEditingBiz({ ...editingBiz, services: updated });
                      setNewServiceName('');
                    }}
                    className="px-3 py-2 bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> הוסף
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: BRANCHES & LOCATIONS */}
            {editTab === 'branches' && (
              <div className="space-y-3.5 text-xs">
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {editingBiz.branches?.map((br, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border space-y-2 ${
                      adminTheme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#141414] border-white/10 text-white'
                    }`}>
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={br.name}
                          onChange={(e) => {
                            const updated = [...(editingBiz.branches || [])];
                            updated[idx].name = e.target.value;
                            setEditingBiz({ ...editingBiz, branches: updated });
                          }}
                          placeholder="שם הסניף"
                          className={`bg-transparent font-bold text-xs outline-none flex-1 ${
                            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBiz.branches?.filter((_, i) => i !== idx);
                            setEditingBiz({ ...editingBiz, branches: updated });
                          }}
                          className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={br.address}
                        onChange={(e) => {
                          const updated = [...(editingBiz.branches || [])];
                          updated[idx].address = e.target.value;
                          setEditingBiz({ ...editingBiz, branches: updated });
                        }}
                        placeholder="כתובת הסניף"
                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs outline-none border ${
                          adminTheme === 'light'
                            ? 'bg-white border-slate-200 text-slate-800'
                            : 'bg-[#202020] border-white/10 text-zinc-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Add new branch */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      placeholder="שם סניף חדש (למשל: סניף מרכז)..."
                      className="flex-1 bg-[#141414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <input
                      type="text"
                      value={newBranchAddress}
                      onChange={(e) => setNewBranchAddress(e.target.value)}
                      placeholder="כתובת הסניף..."
                      className="flex-1 bg-[#141414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBranchName) return;
                        const updated = [...(editingBiz.branches || []), { name: newBranchName, address: newBranchAddress || 'כתובת העסק' }];
                        setEditingBiz({ ...editingBiz, branches: updated });
                        setNewBranchName('');
                        setNewBranchAddress('');
                      }}
                      className="px-3 py-2 bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> הוסף
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ANNOUNCEMENT BANNER */}
            {editTab === 'banner' && (
              <div className="space-y-3 text-xs">
                <p className="text-zinc-400 text-xs">
                  באנר הודעה מיוחד שיוצג בראש דף הנחיתה של {editingBiz.name} (למשל הנחות, חגים, הודעות חשובות):
                </p>
                <textarea
                  value={editingBiz.announcement || ''}
                  onChange={(e) => setEditingBiz({ ...editingBiz, announcement: e.target.value })}
                  placeholder="למשל: ✨ מבצע מיוחד לשבוע הקרוב: 15% הנחה על כל הטיפולים!"
                  rows={3}
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href={`/${editingBiz.slug}`}
                target="_blank"
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> תצוגה מקדימה לאתר החי
              </Link>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBiz(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold text-xs cursor-pointer"
                >
                  סגור
                </button>
                <button
                  type="button"
                  disabled={isSavingBiz}
                  onClick={handleSaveEditedBusiness}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingBiz ? 'שומר שינויים...' : 'שמור שינויים בשרת ✓'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: SMART 3-STEP WIZARD TO CREATE NEW BUSINESS SITE        */}
      {/* ============================================================ */}
      {isNewBizModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" dir="rtl">
          <div className="absolute inset-0" onClick={() => setIsNewBizModalOpen(false)} />
          <div className={`relative max-w-xl w-full border-2 rounded-3xl p-6 shadow-2xl z-10 my-auto text-right transition-colors ${
            adminTheme === 'light'
              ? 'bg-white border-[#C9A84C] text-slate-900'
              : 'bg-[#1C1C1C] border-[#C9A84C]/50 text-white'
          }`}>
            
            {/* SUCCESS CELEBRATION MODAL */}
            {createdBusinessResult ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-500 mx-auto shadow-xl animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-black ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  האתר של {createdBusinessResult.name} באוויר! 🎉
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${adminTheme === 'light' ? 'text-slate-600' : 'text-zinc-300'}`}>
                  הוקם אתר פרימיום מלא ומותאם אישית הכולל מחירון, גלריה, Waze, ביקורות ומערכת זימון תורים חכמה בכתובת:
                </p>

                <div className={`border rounded-2xl p-4 text-center ${
                  adminTheme === 'light' ? 'bg-slate-50 border-[#C9A84C]/60 text-slate-900' : 'bg-[#141414] border-[#C9A84C]/40'
                }`}>
                  <span className={`text-sm font-black ${adminTheme === 'light' ? 'text-[#967425]' : 'text-[#DFCA85]'}`} dir="ltr">
                    thecut.co.il/{createdBusinessResult.slug}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Link
                    href={`/${createdBusinessResult.slug}`}
                    target="_blank"
                    className="flex-1 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" /> צפה באתר החדש עכשיו
                  </Link>

                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('thecut_admin_authenticated', 'true');
                      }
                      router.push('/admin');
                    }}
                    className={`flex-1 py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    <Key className="w-4 h-4" /> כניסה לפאנל הניהול
                  </button>

                  <button
                    onClick={() => setIsNewBizModalOpen(false)}
                    className={`px-4 py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                      adminTheme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/15 text-zinc-300'
                    }`}
                  >
                    סגור
                  </button>
                </div>
              </div>
            ) : (
              /* WIZARD FORM */
              <form onSubmit={handleCreateBusiness} className="space-y-4">
                {/* Modal Header */}
                <div className={`flex items-center justify-between pb-3 border-b ${
                  adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
                }`}>
                  <div className="flex items-center gap-2 text-[#C9A84C]">
                    <Sparkles className="w-5 h-5" />
                    <div>
                      <h3 className={`text-base font-black ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        הקמת אתר מספרה מותאם אישית
                      </h3>
                      <span className={`text-[11px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                        אשף הקמה חכם ב-3 שלבים
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNewBizModalOpen(false)}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      adminTheme === 'light' ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    ✕
                  </button>
                </div>

                {/* Wizard Steps Indicator */}
                <div className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs font-bold ${
                  adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#141414] border-white/10'
                }`}>
                  <div className={`flex items-center gap-1.5 ${wizardStep === 1 ? 'text-[#B89230]' : adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      wizardStep === 1
                        ? 'bg-[#C9A84C] text-black font-black'
                        : adminTheme === 'light'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-white/10 text-white'
                    }`}>1</span>
                    <span>פרטי עסק</span>
                  </div>
                  <span className={adminTheme === 'light' ? 'text-slate-300' : 'text-zinc-600'}>←</span>
                  <div className={`flex items-center gap-1.5 ${wizardStep === 2 ? 'text-[#B89230]' : adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      wizardStep === 2
                        ? 'bg-[#C9A84C] text-black font-black'
                        : adminTheme === 'light'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-white/10 text-white'
                    }`}>2</span>
                    <span>סגנון ומיתוג</span>
                  </div>
                  <span className={adminTheme === 'light' ? 'text-slate-300' : 'text-zinc-600'}>←</span>
                  <div className={`flex items-center gap-1.5 ${wizardStep === 3 ? 'text-[#B89230]' : adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      wizardStep === 3
                        ? 'bg-[#C9A84C] text-black font-black'
                        : adminTheme === 'light'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-white/10 text-white'
                    }`}>3</span>
                    <span>מחירון וסיום</span>
                  </div>
                </div>

                {/* ==================================================== */}
                {/* STEP 1: BASIC BUSINESS & OWNER DETAILS               */}
                {/* ==================================================== */}
                {wizardStep === 1 && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                        שם העסק / המספרה *
                      </label>
                      <input
                        type="text"
                        value={newBizName}
                        onChange={(e) => {
                          setNewBizName(e.target.value);
                          if (!newBizSlug || newBizSlug === newBizName.toLowerCase().replace(/\s+/g, '-')) {
                            setNewBizSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-'));
                          }
                        }}
                        placeholder="למשל: אלון קוצץ עיצוב שיער"
                        required
                        className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-colors ${
                          adminTheme === 'light'
                            ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                            : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                        מזהה קישור ייחודי (Slug) *
                      </label>
                      <div className={`flex items-center rounded-xl px-3 py-2 text-sm border transition-colors ${
                        adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#141414] border-white/15'
                      }`} dir="ltr">
                        <span className={`text-xs mr-1 ${adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>thecut.co.il/</span>
                        <input
                          type="text"
                          value={newBizSlug}
                          onChange={(e) => setNewBizSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                          placeholder="alon-cut"
                          required
                          className={`flex-1 bg-transparent outline-none text-xs font-bold text-right ${
                            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                          שם בעל העסק *
                        </label>
                        <input
                          type="text"
                          value={newBizOwner}
                          onChange={(e) => setNewBizOwner(e.target.value)}
                          placeholder="למשל: אלון"
                          required
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
                            adminTheme === 'light'
                              ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                              : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                          טלפון ראשי (לוואטסאפ) *
                        </label>
                        <input
                          type="tel"
                          value={newBizPhone}
                          onChange={(e) => setNewBizPhone(e.target.value)}
                          placeholder="050-1234567"
                          required
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
                            adminTheme === 'light'
                              ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                              : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                          עיר / כתובת ראשי *
                        </label>
                        <input
                          type="text"
                          value={newBizCity}
                          onChange={(e) => setNewBizCity(e.target.value)}
                          placeholder="למשל: ראשון לציון"
                          required
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
                            adminTheme === 'light'
                              ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                              : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                          אינסטגרם (אופציונלי)
                        </label>
                        <input
                          type="text"
                          value={newBizInstagram}
                          onChange={(e) => setNewBizInstagram(e.target.value)}
                          placeholder="@barber_alon"
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
                            adminTheme === 'light'
                              ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                              : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newBizName || !newBizSlug || !newBizPhone) {
                            error('נא למלא שם עסק, מזהה קישור וטלפון');
                            return;
                          }
                          syncArchetypeDefaults(newBizArchetype);
                          setWizardStep(2);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        <span>המשך לבחירת סגנון ומיתוג</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* STEP 2: ARCHETYPE STYLE & COLOR PALETTE             */}
                {/* ==================================================== */}
                {wizardStep === 2 && (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className={`block font-bold mb-1.5 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                        בחר את אופי וסגנון המספרה:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.values(BUSINESS_ARCHETYPES).map((arch) => (
                          <div
                            key={arch.id}
                            onClick={() => {
                              setNewBizArchetype(arch.id);
                              syncArchetypeDefaults(arch.id);
                            }}
                            className={`p-3 rounded-2xl border text-right cursor-pointer transition-all ${
                              newBizArchetype === arch.id
                                ? 'bg-amber-500/10 border-[#C9A84C] shadow-xs ring-1 ring-[#C9A84C]'
                                : adminTheme === 'light'
                                ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                                : 'bg-[#141414] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{arch.icon}</span>
                              {newBizArchetype === arch.id && (
                                <span className="text-emerald-600 font-bold text-[10px]">נבחר ✓</span>
                              )}
                            </div>
                            <h4 className={`font-black text-xs mb-0.5 ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                              {arch.name}
                            </h4>
                            <p className={`text-[11px] leading-tight ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                              {arch.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block font-bold mb-1.5 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                        בחר פלטת צבעי יוקרה לאתר:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {THEME_PALETTES.map((pal) => (
                          <div
                            key={pal.id}
                            onClick={() => setNewBizThemeColor(pal.color)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                              newBizThemeColor === pal.color
                                ? 'bg-amber-500/10 border-[#C9A84C] shadow-xs'
                                : adminTheme === 'light'
                                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                : 'bg-[#141414] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="w-5 h-5 rounded-full shadow-xs" style={{ backgroundColor: pal.color }} />
                            <span className={`text-[11px] font-bold truncate ${adminTheme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                              {pal.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setWizardStep(1)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors ${
                          adminTheme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/15 text-zinc-300'
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> חזרה
                      </button>

                      <button
                        type="button"
                        onClick={() => setWizardStep(3)}
                        className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        <span>המשך לסקירת מחירון וסיום</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* STEP 3: SMART SERVICES, SLOGAN & CONFIRMATION       */}
                {/* ==================================================== */}
                {wizardStep === 3 && (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                        סלוגן לעמוד הבית:
                      </label>
                      <input
                        type="text"
                        value={newBizSlogan}
                        onChange={(e) => setNewBizSlogan(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                          adminTheme === 'light'
                            ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                            : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                        מחירון שירותים שנוצר אוטומטית (ניתן לעריכה):
                      </label>
                      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                        {newBizServices.map((srv, idx) => (
                          <div key={idx} className={`flex items-center justify-between gap-2 p-2 rounded-xl border ${
                            adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#141414] border-white/10'
                          }`}>
                            <input
                              type="text"
                              value={srv.name}
                              onChange={(e) => {
                                const updated = [...newBizServices];
                                updated[idx].name = e.target.value;
                                setNewBizServices(updated);
                              }}
                              className={`flex-1 bg-transparent font-bold text-xs outline-none ${
                                adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                              }`}
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={srv.price}
                                onChange={(e) => {
                                  const updated = [...newBizServices];
                                  updated[idx].price = Number(e.target.value);
                                  setNewBizServices(updated);
                                }}
                                className={`w-14 rounded-lg px-1.5 py-1 text-center font-bold text-xs outline-none border ${
                                  adminTheme === 'light'
                                    ? 'bg-white border-slate-300 text-[#967425]'
                                    : 'bg-[#222] border-white/15 text-[#C9A84C]'
                                }`}
                              />
                              <span className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}>₪</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`p-3 rounded-2xl border space-y-1 ${
                      adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#141414] border-white/10'
                    }`}>
                      <div className="flex justify-between">
                        <span className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}>סניף ראשי:</span>
                        <strong className={adminTheme === 'light' ? 'text-slate-900' : 'text-white'}>{newBizCity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}>צבע מיתוג:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: newBizThemeColor }} />
                          <span className={`font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{newBizThemeColor}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}>כתובת אתר חי:</span>
                        <strong className={adminTheme === 'light' ? 'text-[#967425]' : 'text-[#C9A84C]'} dir="ltr">
                          thecut.co.il/{newBizSlug}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setWizardStep(2)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors ${
                          adminTheme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/15 text-zinc-300'
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> חזרה
                      </button>

                      <button
                        type="submit"
                        disabled={isCreatingBiz}
                        className="px-6 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isCreatingBiz ? 'מקים אתר...' : 'הקם אתר מספרה מושלם באוויר 🎉'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
