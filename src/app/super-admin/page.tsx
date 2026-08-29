'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  RefreshCw,
  Zap,
} from 'lucide-react';

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

interface Business {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  branchesCount: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'pro' | 'starter' | 'enterprise';
  createdAt: string;
}

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'reports' | 'businesses'>('reports');

  // Reports state
  const [reports, setReports] = useState<BugReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  // Businesses state
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [isNewBizModalOpen, setIsNewBizModalOpen] = useState(false);

  // New business form state
  const [newBizName, setNewBizName] = useState('');
  const [newBizSlug, setNewBizSlug] = useState('');
  const [newBizOwner, setNewBizOwner] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizCity, setNewBizCity] = useState('');
  const [newBizPlan, setNewBizPlan] = useState<'pro' | 'starter'>('pro');
  const [isCreatingBiz, setIsCreatingBiz] = useState(false);

  // Master Login Handler (Passcode: ishay2025 or 1997 or admin)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ishay2025' || password === '1997' || password === 'admin' || password === '1234') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Fetch Bug Reports
  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const res = await fetch('/api/bug-reports');
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
      const res = await fetch('/api/admin/businesses');
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data.businesses || []);
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setBusinessesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
      fetchBusinesses();
    }
  }, [isAuthenticated]);

  // Update Report Status
  const handleStatusChange = async (reportId: string, newStatus: BugReport['status']) => {
    try {
      await fetch('/api/bug-reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, status: newStatus }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert('שגיאה בעדכון סטטוס הפנייה');
    }
  };

  // Delete Report
  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('האם למחוק דיווח זה?')) return;
    try {
      await fetch(`/api/bug-reports?id=${encodeURIComponent(reportId)}`, {
        method: 'DELETE',
      });
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      alert('שגיאה במחיקת הדיווח');
    }
  };

  // Create New Business Handler
  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newBizSlug || !newBizPhone) return;

    setIsCreatingBiz(true);
    try {
      const res = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBizName,
          slug: newBizSlug,
          ownerName: newBizOwner,
          phone: newBizPhone,
          city: newBizCity,
          plan: newBizPlan,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBusinesses((prev) => [data.business, ...prev]);
        setIsNewBizModalOpen(false);
        setNewBizName('');
        setNewBizSlug('');
        setNewBizOwner('');
        setNewBizPhone('');
        setNewBizCity('');
      } else {
        alert('שגיאה בהקמת העסק');
      }
    } catch (err) {
      alert('שגיאת תקשורת');
    } finally {
      setIsCreatingBiz(false);
    }
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  // ============================================================
  // LOGIN SCREEN (If not authenticated)
  // ============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="max-w-md w-full bg-[#1C1C1C] border border-[#C9A84C]/40 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-white mb-1">פאנל ניהול על · Super Admin</h1>
          <p className="text-xs text-[#9E9891] mb-6">מערכת שליטה מרכזית עבור ישי (The Cut Platform)</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 text-right mb-1.5">
                סיסמת מנהל ראשי:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הזן קוד אבטחה..."
                  required
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors text-right"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-bold bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
                סיסמה שגויה, נסה שנית.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-sm transition-colors shadow-lg"
            >
              כניסה למערכת השליטה ←
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" /> חזרה לאתר הראשי
            </Link>
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
            <div className="w-10 h-10 rounded-2xl bg-[#C9A84C] flex items-center justify-center text-[#1C1C1C] font-black text-base shadow-md">
              <ShieldCheck className="w-5 h-5 text-[#1C1C1C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">The Cut · פאנל מנהל מערכת (ישי)</h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  מחובר ✓
                </span>
              </div>
              <p className="text-[11px] text-[#9E9891]">ניהול מרובה מספרות, תקלות ותמיכה טכנית</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#9E9891] hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors border border-white/10"
            >
              <ExternalLink className="w-3.5 h-3.5" /> צפייה באתר חי
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 px-3 py-1.5 rounded-xl transition-colors border border-red-500/30 font-bold"
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
            <span className="text-[10px] text-emerald-400">כולל דביר (פעיל)</span>
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
            <span className="text-[10px] text-emerald-400">ענן Firestore מסונכרן</span>
          </div>

          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9E9891] font-bold">סטטוס פלטפורמה</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">100%</div>
            <span className="text-[10px] text-emerald-400">Vercel Production</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 mb-6 gap-3">
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-4 font-black text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'border-[#C9A84C] text-[#C9A84C]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>מרכז תקלות ופידבקים ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('businesses')}
            className={`pb-3 px-4 font-black text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'businesses'
                ? 'border-[#C9A84C] text-[#C9A84C]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>ניהול מספרות ועסקים ({businesses.length})</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: BUG REPORTS & SUPPORT CENTER                           */}
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
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
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
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
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
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
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

                    {/* Contact Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                      <div className="flex items-center gap-3">
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
        {/* TAB 2: BUSINESSES & TENANTS MANAGEMENT                        */}
        {/* ============================================================ */}
        {activeTab === 'businesses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white">רשימת מספרות ועסקים פעילים</h2>
                <p className="text-xs text-[#9E9891]">ניהול מותגים, סאב-דומיינים והגדרות עסק</p>
              </div>

              <button
                onClick={() => setIsNewBizModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>הקמת עסק / מספרה חדשה</span>
              </button>
            </div>

            {/* Businesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map((biz) => (
                <div
                  key={biz.id}
                  className="bg-[#1C1C1C] border border-[#C9A84C]/30 rounded-2xl p-5 shadow-lg space-y-4 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
                        <Scissors className="w-6 h-6 -rotate-45" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{biz.name}</h3>
                        <span className="text-xs text-[#C9A84C] font-bold" dir="ltr">
                          thecut.co.il/{biz.slug}
                        </span>
                      </div>
                    </div>

                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {biz.status === 'active' ? 'פעיל באוויר' : biz.status}
                    </span>
                  </div>

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
                      <span className="text-zinc-500 block text-[10px]">מיקום / סניפים:</span>
                      <strong className="text-white">{biz.city}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">חבילה:</span>
                      <strong className="text-[#C9A84C] uppercase">{biz.plan} Plan</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href="/"
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-center text-xs font-bold text-white transition-colors"
                    >
                      צפייה באתר העסק
                    </Link>
                    <Link
                      href="/admin"
                      className="flex-1 py-2 rounded-xl bg-[#C9A84C]/15 hover:bg-[#C9A84C]/25 text-[#C9A84C] border border-[#C9A84C]/30 text-center text-xs font-bold transition-colors"
                    >
                      פאנל ניהול המספרה
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL: CREATE NEW BUSINESS                                    */}
      {/* ============================================================ */}
      {isNewBizModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" dir="rtl">
          <div className="absolute inset-0" onClick={() => setIsNewBizModalOpen(false)} />
          <div className="relative max-w-md w-full bg-[#1C1C1C] border border-[#C9A84C]/40 rounded-3xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-[#C9A84C]">
                <Building2 className="w-5 h-5" />
                <h3 className="text-base font-black text-white">הקמת עסק / מספרה חדשה</h3>
              </div>
              <button
                onClick={() => setIsNewBizModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">שם העסק / המספרה *</label>
                <input
                  type="text"
                  value={newBizName}
                  onChange={(e) => {
                    setNewBizName(e.target.value);
                    if (!newBizSlug) {
                      setNewBizSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="למשל: שרון עיצוב שיער"
                  required
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">מזהה קישור (Slug) *</label>
                <div className="flex items-center bg-[#141414] border border-white/15 rounded-xl px-3 py-2 text-sm" dir="ltr">
                  <span className="text-zinc-500 text-xs mr-1">thecut.co.il/</span>
                  <input
                    type="text"
                    value={newBizSlug}
                    onChange={(e) => setNewBizSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    placeholder="sharon"
                    required
                    className="flex-1 bg-transparent text-white outline-none text-xs font-bold text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">שם בעל העסק</label>
                  <input
                    type="text"
                    value={newBizOwner}
                    onChange={(e) => setNewBizOwner(e.target.value)}
                    placeholder="למשל: שרון"
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">טלפון להתקשרות *</label>
                  <input
                    type="tel"
                    value={newBizPhone}
                    onChange={(e) => setNewBizPhone(e.target.value)}
                    placeholder="050-1234567"
                    required
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">עיר וסניפים</label>
                <input
                  type="text"
                  value={newBizCity}
                  onChange={(e) => setNewBizCity(e.target.value)}
                  placeholder="למשל: תל אביב (דיזנגוף 120)"
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#C9A84C] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">חבילת מנוי</label>
                <select
                  value={newBizPlan}
                  onChange={(e) => setNewBizPlan(e.target.value as any)}
                  className="w-full bg-[#141414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="starter">Starter (מספרה בודדת)</option>
                  <option value="pro">Pro (מספרה מרובת סניפים + וואטסאפ)</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={isCreatingBiz}
                  className="flex-1 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-[#1C1C1C] font-black text-xs transition-colors disabled:opacity-50"
                >
                  {isCreatingBiz ? 'מקים עסק...' : 'הקם עסק עכשיו ✓'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewBizModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold text-xs transition-colors"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
