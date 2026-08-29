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
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/common/ToastProvider';
import { BUSINESS_ARCHETYPES, THEME_PALETTES, generateTailoredBusinessConfig } from '@/lib/archetypes';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';

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
  branchesCount: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'pro' | 'starter' | 'enterprise';
  createdAt: string;
  services?: ServiceItem[];
  branches?: BranchItem[];
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
    phone: '052-123-4567',
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
  const [editTab, setEditTab] = useState<'branding' | 'social' | 'services' | 'branches' | 'banner'>('branding');
  const [isSavingBiz, setIsSavingBiz] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

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
      const res = await authFetch('/api/admin/businesses');
      if (res.ok) {
        const data = await res.json();
        if (data.businesses && data.businesses.length > 0) {
          setBusinesses(data.businesses);
          return;
        }
      }

      // Fallback: fetch flagship business
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
    try {
      const res = await authFetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail.trim(),
          role: newUserRole,
          displayName: newUserDisplayName.trim() || newUserEmail.split('@')[0],
          businessSlugs: newUserBusinessSlugs.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        success('משתמש נוסף בהצלחה! ✓', `${newUserEmail} נרשם כ-${newUserRole === 'super_admin' ? 'מנהל-על' : 'מנהל עסק'}`);
        setNewUserEmail('');
        setNewUserDisplayName('');
        setNewUserBusinessSlugs('');
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
    <div className="min-h-screen bg-[#121212] text-white font-sans" dir="rtl">
      {/* Top Navbar */}
      <header className="bg-[#1C1C1C] border-b border-white/10 sticky top-0 z-40">
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
                <h1 className="text-base sm:text-lg font-black text-white">
                  The Cut · פאנל מנהל מערכת ({adminUser?.displayName || 'ישי'})
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {adminUser?.email ? `מחובר כ-${adminUser.email}` : 'מחובר ✓'}
                </span>
              </div>
              <p className="text-[11px] text-[#9E9891]">ניהול מרובה מספרות, התאמה אישית ותמיכה טכנית</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 px-3 py-1.5 rounded-xl transition-colors border border-red-500/30 font-bold cursor-pointer"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9E9891] font-bold">עסקים רשומים</span>
              <Building2 className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <div className="text-2xl font-black text-white">{businesses.length}</div>
            <span className="text-[10px] text-emerald-400">
              {businesses.length > 0 ? `${businesses.filter(b => b.status === 'active').length} מספרות פעילות באוויר` : 'סנכרון ענן פעיל'}
            </span>
          </div>

          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9E9891] font-bold">דיווחי תקלות חדשים</span>
              <Bug className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400">
              {reports.filter((r) => r.status === 'new').length}
            </div>
            <span className="text-[10px] text-zinc-400">מתוך {reports.length} סך הכל</span>
          </div>

          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9E9891] font-bold">תורים בפלטפורמה</span>
              <Calendar className="w-4 h-4 text-[#DFCA85]" />
            </div>
            <div className="text-2xl font-black text-white">פעיל</div>
            <span className="text-[10px] text-emerald-400">סנכרון ענן בזמן אמת</span>
          </div>

          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9E9891] font-bold">התאמה אישית</span>
              <Settings2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">100%</div>
            <span className="text-[10px] text-emerald-400">מיתוג & מחירון דינמי</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 mb-6 gap-3">
          <button
            onClick={() => setActiveTab('businesses')}
            className={`pb-3 px-4 font-black text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'businesses'
                ? 'border-[#C9A84C] text-[#C9A84C]'
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
                ? 'border-[#C9A84C] text-[#C9A84C]'
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
                ? 'border-[#C9A84C] text-[#C9A84C]'
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
                <h2 className="text-base font-black text-white">רשימת מספרות ועסקים פעילים</h2>
                <p className="text-xs text-[#9E9891]">כל עסק מקבל אתר אישי יוקרתי ומערכת זימון תורים מותאמת ב-thecut.co.il/[slug]</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchBusinesses}
                  disabled={businessesLoading}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 cursor-pointer transition-colors"
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
                  <div key={i} className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-lg space-y-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/5" />
                        <div className="space-y-1.5">
                          <div className="w-32 h-4 bg-white/10 rounded" />
                          <div className="w-24 h-3 bg-white/5 rounded" />
                        </div>
                      </div>
                      <div className="w-20 h-5 bg-white/5 rounded-full" />
                    </div>
                    <div className="h-12 bg-white/5 rounded-xl" />
                    <div className="grid grid-cols-2 gap-2 h-16 bg-white/5 rounded-xl" />
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
                      className="bg-[#1C1C1C] border border-white/10 hover:border-white/20 rounded-2xl p-5 shadow-lg space-y-4 relative group transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-md"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.08)',
                              color: bizColor,
                              border: `1px solid ${bizColor}`,
                            }}
                          >
                            {biz.name.trim().charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-white">{biz.name}</h3>
                            </div>
                            <span className="text-xs font-bold" style={{ color: bizColor }} dir="ltr">
                              {`thecut.co.il/${biz.slug}`}
                            </span>
                          </div>
                        </div>

                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {biz.status === 'active' ? 'פעיל באוויר ✓' : biz.status}
                        </span>
                      </div>

                      {biz.slogan && (
                        <p className="text-xs text-zinc-300 italic bg-[#141414] p-2.5 rounded-xl border border-white/5 font-sans">
                          "{biz.slogan}"
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 bg-[#141414] p-3 rounded-xl border border-white/5">
                        <div>
                          <span className="text-zinc-500 block text-[10px]">מנהל עסק:</span>
                          <strong className="text-white">{biz.ownerName}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">טלפון:</span>
                          <strong className="text-white" dir="ltr">{biz.phone}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">סניפים ושירותים:</span>
                          <strong className="text-white">{biz.branches?.length || biz.branchesCount || 1} סניפים · {biz.services?.length || 3} שירותים</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">חבילה:</span>
                          <strong className="uppercase" style={{ color: bizColor }}>{biz.plan} Plan</strong>
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
                          className="flex-1 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black text-center text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> ערוך והתאם אישית
                        </button>

                        <Link
                          href={`/${biz.slug}`}
                          target="_blank"
                          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-center text-xs font-bold text-white transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> צפה באתר
                        </Link>

                        <button
                          onClick={() => {
                            router.push('/admin');
                          }}
                          className="py-2 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 text-center text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="התחבר כבעל מספרה זו"
                        >
                          <Key className="w-3.5 h-3.5" /> כניסה כמנהל
                        </button>

                        <button
                          onClick={() => handleDeleteBusiness(biz.slug, biz.name)}
                          className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
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
              <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-10 text-center text-zinc-400 space-y-3">
                <Building2 className="w-10 h-10 text-[#C9A84C] mx-auto opacity-70" />
                <p className="text-sm font-bold text-white">לא נמצאו עסקים רשומים</p>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1C1C1C] p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400">סנן לפי סטטוס:</span>
                <div className="flex gap-1.5">
                  {(['all', 'new', 'in_progress', 'resolved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-[#C9A84C] text-[#1C1C1C]'
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
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 cursor-pointer"
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
                    className={`bg-[#1C1C1C] border-2 rounded-2xl p-5 shadow-lg transition-all ${
                      r.status === 'new'
                        ? 'border-emerald-500/40 bg-emerald-950/5'
                        : r.status === 'in_progress'
                        ? 'border-amber-500/40 bg-amber-950/5'
                        : 'border-white/10 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-white text-sm">{r.fullName}</span>
                        <span className="text-xs text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-md font-bold">
                          {r.category}
                        </span>
                        <span className="text-[11px] text-zinc-500">📍 {r.businessName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status dropdown */}
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value as any)}
                          className="bg-[#141414] border border-white/15 rounded-xl px-2.5 py-1 text-xs font-bold text-white outline-none cursor-pointer"
                        >
                          <option value="new">חדש 🟢</option>
                          <option value="in_progress">בטיפול 🟡</option>
                          <option value="resolved">טופל ונסגר ⚪</option>
                        </select>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteReport(r.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="מחק דיווח"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Message Body */}
                    <p className="text-sm text-zinc-200 leading-relaxed bg-[#141414] p-3.5 rounded-xl border border-white/5 mb-3 font-sans">
                      {r.message}
                    </p>

                    {/* Intelligent Appointment Helper for this Customer */}
                    <ReportAppointmentHelper
                      phone={r.phone}
                      customerName={r.fullName}
                      businessName={r.businessName}
                    />

                    {/* Contact Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 pt-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <a
                          href={`tel:${r.phone}`}
                          className="inline-flex items-center gap-1 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C9A84C]" /> {r.phone}
                        </a>
                        <a
                          href={`https://wa.me/972${r.phone.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(`היי ${r.fullName}, קיבלנו את פנייתך במערכת בנושא "${r.category}". נשמח לסייע:`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> מענה בוואטסאפ ללקוח
                        </a>
                        <Link
                          href="/admin/appointments"
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[#C9A84C] hover:text-[#DFCA85] bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 px-2.5 py-1 rounded-lg border border-[#C9A84C]/30 font-bold transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" /> יומן תורים של {r.businessName} ↗
                        </Link>
                      </div>

                      <span className="text-[11px] text-zinc-500" dir="ltr">
                        {new Date(r.createdAt).toLocaleString('he-IL')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-10 text-center text-zinc-400">
                <CheckCircle className="w-10 h-10 text-emerald-500/50 mx-auto mb-2" />
                <p className="text-sm font-bold text-white mb-1">אין פניות או תקלות בסטטוס זה</p>
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
                <h2 className="text-base font-black text-white">ניהול משתמשים והרשאות במערכת</h2>
                <p className="text-xs text-[#9E9891]">
                  הוסף משתמשים לפי כתובת אימייל, הגדר תפקידים (מנהל-על / מנהל עסק) ושייך לעסקים ספציפיים
                </p>
              </div>

              <button
                onClick={fetchUsers}
                disabled={usersLoading}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin text-[#C9A84C]' : ''}`} />
                <span>רענן משתמשים</span>
              </button>
            </div>

            {/* Add User Card */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-black text-white flex items-center gap-2 mb-3">
                <UserPlus className="w-4 h-4 text-[#C9A84C]" />
                <span>הוספת משתמש חדש</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 font-bold mb-1">כתובת אימייל (Google / Gmail):</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    dir="ltr"
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 font-bold mb-1">שם מלא:</label>
                  <input
                    type="text"
                    value={newUserDisplayName}
                    onChange={(e) => setNewUserDisplayName(e.target.value)}
                    placeholder="למשל: דביר / מנהל סניף"
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 font-bold mb-1">תפקיד במערכת:</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="business_admin">מנהל עסק (Business Admin)</option>
                    <option value="super_admin">מנהל-על (Super Admin)</option>
                  </select>
                </div>

                {newUserRole === 'business_admin' && (
                  <div>
                    <label className="block text-[11px] text-zinc-400 font-bold mb-1">מזהה עסק (Slugs מופרדים בפסיק):</label>
                    <input
                      type="text"
                      value={newUserBusinessSlugs}
                      onChange={(e) => setNewUserBusinessSlugs(e.target.value)}
                      placeholder="dvir, sharon"
                      dir="ltr"
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
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
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
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
                <div className="divide-y divide-white/5">
                  {managedUsers.map((u) => (
                    <div
                      key={u.uid}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt={u.displayName || u.email}
                            className="w-9 h-9 rounded-full object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                            {(u.displayName || u.email || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{u.displayName || u.email.split('@')[0]}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                u.role === 'super_admin'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30'
                              }`}
                            >
                              {u.role === 'super_admin' ? '👑 מנהל-על (Super Admin)' : '💼 מנהל עסק (Business Admin)'}
                            </span>
                            {u.preRegistered && (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                                ממתין לכניסה ראשונה
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                            <span dir="ltr">{u.email}</span>
                            {u.businessSlugs && u.businessSlugs.length > 0 && (
                              <span className="text-zinc-500">
                                · עסקים מורשים: <strong className="text-zinc-300">{u.businessSlugs.join(', ')}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[10px] text-zinc-500" dir="ltr">
                          נוצר: {new Date(u.createdAt).toLocaleDateString('he-IL')}
                        </span>

                        {u.email !== 'ishay1997@gmail.com' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.uid, u.email)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs font-bold transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto" dir="rtl">
          <div className="absolute inset-0" onClick={() => setEditingBiz(null)} />
          <div className="relative max-w-2xl w-full bg-[#1C1C1C] border-2 border-[#C9A84C]/50 rounded-3xl p-6 shadow-2xl z-10 my-auto text-right">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-[#C9A84C]">
                <Settings2 className="w-6 h-6" />
                <div>
                  <h3 className="text-base font-black text-white">התאמה אישית ועריכת אתר: {editingBiz.name}</h3>
                  <span className="text-[11px] text-[#9E9891]" dir="ltr">thecut.co.il/{editingBiz.slug}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingBiz(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {saveNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> השינויים נשמרו בהצלחה והאתר עודכן באוויר!
              </div>
            )}

            {/* Inner Sub-Tabs */}
            <div className="flex border-b border-white/10 mb-4 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditTab('branding')}
                className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  editTab === 'branding' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                🏷️ מיתוג ופרטים
              </button>
              <button
                type="button"
                onClick={() => setEditTab('social')}
                className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  editTab === 'social' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                🔗 רשתות וקישורים
              </button>
              <button
                type="button"
                onClick={() => setEditTab('services')}
                className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  editTab === 'services' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                ✂️ מחירון ושירותים ({editingBiz.services?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setEditTab('branches')}
                className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  editTab === 'branches' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                📍 סניפים ומיקומים ({editingBiz.branches?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setEditTab('banner')}
                className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  editTab === 'banner' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                📢 באנר הודעות
              </button>
            </div>

            {/* TAB 1: BRANDING & GENERAL */}
            {editTab === 'branding' && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">שם המספרה / העסק:</label>
                  <input
                    type="text"
                    value={editingBiz.name}
                    onChange={(e) => setEditingBiz({ ...editingBiz, name: e.target.value })}
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                {/* Theme Palette Picker */}
                <div>
                  <label className="block text-zinc-300 font-bold mb-1.5">פלטת צבעי מיתוג לאתר:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {THEME_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setEditingBiz({ ...editingBiz, themeColor: pal.color })}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          editingBiz.themeColor === pal.color
                            ? 'border-[#C9A84C] bg-white/10'
                            : 'border-white/10 bg-[#141414] hover:bg-white/5'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: pal.color }} />
                        <span className="text-[11px] font-bold text-white truncate">{pal.name.split('·')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">סלוגן / תיאור קצר לעמוד הבית:</label>
                  <input
                    type="text"
                    value={editingBiz.slogan || ''}
                    onChange={(e) => setEditingBiz({ ...editingBiz, slogan: e.target.value })}
                    placeholder="למשל: מרכז החלקות אורגניות, בלונד ועיצוב שיער מקצועי"
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">טלפון ראשי (לוואטסאפ של הלקוחות):</label>
                    <input
                      type="tel"
                      value={editingBiz.phone}
                      onChange={(e) => setEditingBiz({ ...editingBiz, phone: e.target.value })}
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">שם בעל המספרה:</label>
                    <input
                      type="text"
                      value={editingBiz.ownerName}
                      onChange={(e) => setEditingBiz({ ...editingBiz, ownerName: e.target.value })}
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">עיר / אזור פעילות:</label>
                    <input
                      type="text"
                      value={editingBiz.city}
                      onChange={(e) => setEditingBiz({ ...editingBiz, city: e.target.value })}
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">סטטוס פעילות:</label>
                    <select
                      value={editingBiz.status}
                      onChange={(e) => setEditingBiz({ ...editingBiz, status: e.target.value as any })}
                      className="w-full bg-[#141414] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none cursor-pointer"
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
                <p className="text-zinc-400 text-[11px] mb-2 leading-relaxed bg-[#141414] p-3 rounded-xl border border-white/10">
                  💡 <strong>התאמת רשתות וקישורים לאתר:</strong> קישורים שיוזנו יוצגו ככפתורי פעולה זוהרים בדף הבית. קישורים שיישארו ריקים יוצגו אוטומטית באפור (לא פעיל) – בדיוק כמו בתבנית המקורית.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1 flex items-center gap-1">
                      <span>📸 אינסטגרם (Instagram):</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.instagramUrl || editingBiz.instagramHandle || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, instagramUrl: e.target.value, instagramHandle: e.target.value })}
                      placeholder="https://instagram.com/username או @username"
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1 flex items-center gap-1">
                      <span>👤 פייסבוק (Facebook):</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.facebookUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/page_name"
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1 flex items-center gap-1">
                      <span>🎵 טיקטוק (TikTok):</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.tiktokUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, tiktokUrl: e.target.value })}
                      placeholder="https://tiktok.com/@username או @username"
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1 flex items-center gap-1">
                      <span>💬 וואטסאפ (WhatsApp להודעות):</span>
                    </label>
                    <input
                      type="tel"
                      value={editingBiz.whatsappNumber || editingBiz.phone || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, whatsappNumber: e.target.value })}
                      placeholder="050-1234567"
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1 flex items-center gap-1">
                      <span>🚗 קישור Waze לניווט:</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.wazeUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, wazeUrl: e.target.value })}
                      placeholder="https://waze.com/ul?q=..."
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1 flex items-center gap-1">
                      <span>🌐 אתר אינטרנט / דומיין מותאם:</span>
                    </label>
                    <input
                      type="text"
                      value={editingBiz.websiteUrl || ''}
                      onChange={(e) => setEditingBiz({ ...editingBiz, websiteUrl: e.target.value })}
                      placeholder="https://my-barbershop.co.il"
                      className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES & PRICING */}
            {editTab === 'services' && (
              <div className="space-y-3.5 text-xs">
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {editingBiz.services?.map((srv, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#141414] border border-white/10">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={srv.name}
                          onChange={(e) => {
                            const updated = [...(editingBiz.services || [])];
                            updated[idx].name = e.target.value;
                            setEditingBiz({ ...editingBiz, services: updated });
                          }}
                          className="w-full bg-transparent text-white font-bold text-xs outline-none"
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
                          className="w-16 bg-[#222] border border-white/15 rounded-lg px-2 py-1 text-center font-bold text-[#C9A84C] text-xs outline-none"
                        />
                        <span className="text-zinc-500">₪</span>
                        <input
                          type="number"
                          value={srv.duration}
                          onChange={(e) => {
                            const updated = [...(editingBiz.services || [])];
                            updated[idx].duration = Number(e.target.value);
                            setEditingBiz({ ...editingBiz, services: updated });
                          }}
                          className="w-14 bg-[#222] border border-white/15 rounded-lg px-1.5 py-1 text-center text-xs text-white outline-none"
                        />
                        <span className="text-zinc-500 text-[10px]">דק׳</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBiz.services?.filter((_, i) => i !== idx);
                            setEditingBiz({ ...editingBiz, services: updated });
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new service row */}
                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="שם שירות חדש (למשל: צבע / פן)..."
                    className="flex-1 bg-[#141414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    placeholder="מחיר"
                    className="w-16 bg-[#141414] border border-white/15 rounded-xl px-2 py-2 text-center text-xs text-white outline-none"
                  />
                  <span className="text-zinc-500 text-xs">₪</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newServiceName) return;
                      const updated = [...(editingBiz.services || []), { name: newServiceName, price: newServicePrice, duration: newServiceDuration }];
                      setEditingBiz({ ...editingBiz, services: updated });
                      setNewServiceName('');
                    }}
                    className="px-3 py-2 bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
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
                    <div key={idx} className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-2">
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
                          className="bg-transparent text-white font-bold text-xs outline-none flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBiz.branches?.filter((_, i) => i !== idx);
                            setEditingBiz({ ...editingBiz, branches: updated });
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
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
                        className="w-full bg-[#202020] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 outline-none"
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto" dir="rtl">
          <div className="absolute inset-0" onClick={() => setIsNewBizModalOpen(false)} />
          <div className="relative max-w-xl w-full bg-[#1C1C1C] border-2 border-[#C9A84C]/50 rounded-3xl p-6 shadow-2xl z-10 my-auto text-right">
            
            {/* SUCCESS CELEBRATION MODAL */}
            {createdBusinessResult ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-xl animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">האתר של {createdBusinessResult.name} באוויר! 🎉</h3>
                <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                  הוקם אתר פרימיום מלא ומותאם אישית הכולל מחירון, גלריה, Waze, ביקורות ומערכת זימון תורים חכמה בכתובת:
                </p>

                <div className="bg-[#141414] border border-[#C9A84C]/40 rounded-2xl p-4 text-center">
                  <span className="text-sm font-black text-[#DFCA85]" dir="ltr">
                    thecut.co.il/{createdBusinessResult.slug}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Link
                    href={`/${createdBusinessResult.slug}`}
                    target="_blank"
                    className="flex-1 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg"
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
                    className="flex-1 py-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Key className="w-4 h-4" /> כניסה לפאנל הניהול
                  </button>

                  <button
                    onClick={() => setIsNewBizModalOpen(false)}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold text-xs cursor-pointer"
                  >
                    סגור
                  </button>
                </div>
              </div>
            ) : (
              /* WIZARD FORM */
              <form onSubmit={handleCreateBusiness} className="space-y-4">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-[#C9A84C]">
                    <Sparkles className="w-5 h-5" />
                    <div>
                      <h3 className="text-base font-black text-white">הקמת אתר מספרה מותאם אישית</h3>
                      <span className="text-[11px] text-zinc-400">אשף הקמה חכם ב-3 שלבים</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNewBizModalOpen(false)}
                    className="text-zinc-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Wizard Steps Indicator */}
                <div className="flex items-center justify-between bg-[#141414] p-2.5 rounded-2xl border border-white/10 text-xs font-bold">
                  <div className={`flex items-center gap-1.5 ${wizardStep === 1 ? 'text-[#C9A84C]' : 'text-zinc-500'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep === 1 ? 'bg-[#C9A84C] text-black font-black' : 'bg-white/10 text-white'}`}>1</span>
                    <span>פרטי עסק</span>
                  </div>
                  <span className="text-zinc-600">←</span>
                  <div className={`flex items-center gap-1.5 ${wizardStep === 2 ? 'text-[#C9A84C]' : 'text-zinc-500'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep === 2 ? 'bg-[#C9A84C] text-black font-black' : 'bg-white/10 text-white'}`}>2</span>
                    <span>סגנון ומיתוג</span>
                  </div>
                  <span className="text-zinc-600">←</span>
                  <div className={`flex items-center gap-1.5 ${wizardStep === 3 ? 'text-[#C9A84C]' : 'text-zinc-500'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${wizardStep === 3 ? 'bg-[#C9A84C] text-black font-black' : 'bg-white/10 text-white'}`}>3</span>
                    <span>מחירון וסיום</span>
                  </div>
                </div>

                {/* ==================================================== */}
                {/* STEP 1: BASIC BUSINESS & OWNER DETAILS               */}
                {/* ==================================================== */}
                {wizardStep === 1 && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-300 mb-1">שם העסק / המספרה *</label>
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
                        className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-300 mb-1">מזהה קישור ייחודי (Slug) *</label>
                      <div className="flex items-center bg-[#141414] border border-white/15 rounded-xl px-3 py-2 text-sm" dir="ltr">
                        <span className="text-zinc-500 text-xs mr-1">thecut.co.il/</span>
                        <input
                          type="text"
                          value={newBizSlug}
                          onChange={(e) => setNewBizSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                          placeholder="alon-cut"
                          required
                          className="flex-1 bg-transparent text-white outline-none text-xs font-bold text-right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">שם בעל העסק *</label>
                        <input
                          type="text"
                          value={newBizOwner}
                          onChange={(e) => setNewBizOwner(e.target.value)}
                          placeholder="למשל: אלון"
                          required
                          className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">טלפון ראשי (לוואטסאפ) *</label>
                        <input
                          type="tel"
                          value={newBizPhone}
                          onChange={(e) => setNewBizPhone(e.target.value)}
                          placeholder="050-1234567"
                          required
                          className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">עיר / כתובת ראשי *</label>
                        <input
                          type="text"
                          value={newBizCity}
                          onChange={(e) => setNewBizCity(e.target.value)}
                          placeholder="למשל: ראשון לציון"
                          required
                          className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">אינסטגרם (אופציונלי)</label>
                        <input
                          type="text"
                          value={newBizInstagram}
                          onChange={(e) => setNewBizInstagram(e.target.value)}
                          placeholder="@barber_alon"
                          className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
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
                        className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5"
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
                      <label className="block font-bold text-gray-300 mb-1.5">בחר את אופי וסגנון המספרה:</label>
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
                                ? 'bg-white/10 border-[#C9A84C] shadow-md ring-1 ring-[#C9A84C]/50'
                                : 'bg-[#141414] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">{arch.icon}</span>
                              {newBizArchetype === arch.id && (
                                <span className="text-emerald-400 font-bold text-[10px]">נבחר ✓</span>
                              )}
                            </div>
                            <h4 className="font-black text-white text-xs mb-0.5">{arch.name}</h4>
                            <p className="text-[11px] text-zinc-400 leading-tight">{arch.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-300 mb-1.5">בחר פלטת צבעי יוקרה לאתר:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {THEME_PALETTES.map((pal) => (
                          <div
                            key={pal.id}
                            onClick={() => setNewBizThemeColor(pal.color)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                              newBizThemeColor === pal.color
                                ? 'bg-white/10 border-white'
                                : 'bg-[#141414] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="w-5 h-5 rounded-full shadow-md" style={{ backgroundColor: pal.color }} />
                            <span className="text-[11px] font-bold text-white truncate">{pal.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setWizardStep(1)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold text-xs cursor-pointer flex items-center gap-1"
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> חזרה
                      </button>

                      <button
                        type="button"
                        onClick={() => setWizardStep(3)}
                        className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5"
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
                      <label className="block font-bold text-gray-300 mb-1">סלוגן לעמוד הבית:</label>
                      <input
                        type="text"
                        value={newBizSlogan}
                        onChange={(e) => setNewBizSlogan(e.target.value)}
                        className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-300 mb-1">מחירון שירותים שנוצר אוטומטית (ניתן לעריכה):</label>
                      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                        {newBizServices.map((srv, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#141414] border border-white/10">
                            <input
                              type="text"
                              value={srv.name}
                              onChange={(e) => {
                                const updated = [...newBizServices];
                                updated[idx].name = e.target.value;
                                setNewBizServices(updated);
                              }}
                              className="flex-1 bg-transparent text-white font-bold text-xs outline-none"
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
                                className="w-14 bg-[#222] border border-white/15 rounded-lg px-1.5 py-1 text-center text-[#C9A84C] font-bold text-xs outline-none"
                              />
                              <span className="text-zinc-500">₪</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">סניף ראשי:</span>
                        <strong className="text-white">{newBizCity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">צבע מיתוג:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: newBizThemeColor }} />
                          <span className="text-white font-bold">{newBizThemeColor}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">כתובת אתר חי:</span>
                        <strong className="text-[#C9A84C]" dir="ltr">thecut.co.il/{newBizSlug}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setWizardStep(2)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold text-xs cursor-pointer flex items-center gap-1"
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> חזרה
                      </button>

                      <button
                        type="submit"
                        disabled={isCreatingBiz}
                        className="px-6 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
