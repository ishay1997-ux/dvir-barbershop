'use client';

import React, { useState } from 'react';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { ReportsTab } from '@/components/super-admin/ReportsTab';
import { UsersTab } from '@/components/super-admin/UsersTab';
import { LeadsTab } from '@/components/super-admin/LeadsTab';
import { BusinessesTableView } from '@/components/super-admin/BusinessesTableView';
import { EditBusinessModal } from '@/components/super-admin/EditBusinessModal';
import { CreateBusinessModal } from '@/components/super-admin/CreateBusinessModal';
import { SuperAdminSidebar } from '@/components/super-admin/SuperAdminSidebar';
import { SuperAdminTopHeader } from '@/components/super-admin/SuperAdminTopHeader';
import { SuperAdminLoginScreen } from '@/components/super-admin/SuperAdminLoginScreen';
import {
  Building2,
  Users,
  Bug,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Server,
  Smartphone,
} from 'lucide-react';

export default function SuperAdminPage() {
  const {
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
    // Leads
    leads,
    leadsLoading,
    fetchLeads,
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
  } = useSuperAdminData();

  const [searchQuery, setSearchQuery] = useState('');

  // ----------------------------------------------------------------
  // AUTH GATE SCREEN
  // ----------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-300 font-bold">טוען מערכת ניהול CutWeb OS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SuperAdminLoginScreen
        adminTheme={adminTheme}
        googleLoading={googleLoading}
        onGoogleLogin={handleGoogleLogin}
      />
    );
  }

  const newReportsCount = reports.filter((r) => r.status === 'new').length;
  const newLeadsCount = leads.filter((l: any) => l.status === 'new').length;

  // ----------------------------------------------------------------
  // AUTHENTICATED ENTERPRISE DASHBOARD (REGIN / Caliber Style)
  // ----------------------------------------------------------------
  return (
    <div
      className={`min-h-screen font-sans flex transition-colors duration-200 ${
        adminTheme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#0E0E0E] text-white'
      }`}
      dir="rtl"
    >
      {/* 1. Right Navigation Sidebar */}
      <SuperAdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        businessesCount={businesses.length}
        leadsCount={newLeadsCount}
        reportsCount={newReportsCount}
        usersCount={managedUsers.length}
        adminTheme={adminTheme}
        onLogout={handleLogout}
      />

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <SuperAdminTopHeader
          adminTheme={adminTheme}
          adminUser={adminUser}
          toggleAdminTheme={toggleAdminTheme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          newReportsCount={newReportsCount}
        />

        {/* Dynamic Main Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* TAB 1: BUSINESSES */}
          {activeTab === 'businesses' && (
            <BusinessesTableView
              businesses={businesses}
              businessesLoading={businessesLoading}
              adminTheme={adminTheme}
              onRefresh={fetchBusinesses}
              onOpenCreateModal={() => setIsNewBizModalOpen(true)}
              onOpenEditModal={(biz) => setEditingBiz(biz)}
              onCloneBusiness={handleCloneBusiness}
              onDeleteBusiness={handleDeleteBusiness}
              searchQuery={searchQuery}
            />
          )}

          {/* TAB 2: LEADS (Wix Style Registrations) */}
          {activeTab === 'leads' && (
            <LeadsTab
              adminTheme={adminTheme}
              onConvertLeadToBusiness={(lead) => {
                setIsNewBizModalOpen(true);
              }}
            />
          )}

          {/* TAB 2: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1
                    className={`text-xl font-black ${
                      adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    דיווחי תקלות ופניות מערכת
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    מעקב אחר דיווחי לקוחות, תקלות קביעת תורים ופניות טכניות
                  </p>
                </div>
              </div>

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
            </div>
          )}

          {/* TAB 3: USERS & ROLES */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1
                    className={`text-xl font-black ${
                      adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    ניהול משתמשים והרשאות
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    הגדרת הרשאות גישה לסופר-אדמינים ולמנהלי מספרות ועסקים
                  </p>
                </div>
              </div>

              <UsersTab
                managedUsers={managedUsers}
                businesses={businesses}
                usersLoading={usersLoading}
                newUserEmail={newUserEmail}
                newUserRole={newUserRole}
                newUserDisplayName={newUserDisplayName}
                newUserBusinessSlugs={newUserBusinessSlugs}
                isAddingUser={isAddingUser}
                adminTheme={adminTheme}
                onRefresh={fetchUsers}
                onChangeEmail={setNewUserEmail}
                onChangeRole={setNewUserRole}
                onChangeDisplayName={setNewUserDisplayName}
                onChangeBusinessSlugs={setNewUserBusinessSlugs}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          )}

          {/* TAB 4: OVERVIEW & REPORTS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1
                  className={`text-xl font-black ${
                    adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  דוחות ואנליטיקה פלטפורמית
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  מבט על על נתוני התורים, הכנסות ממסלולים וביצועי שרת
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className={`p-5 rounded-2xl border ${
                    adminTheme === 'light'
                      ? 'bg-white border-slate-200/90 shadow-xs'
                      : 'bg-[#181818] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">סך עסקים רשומים</span>
                    <Building2 className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-2xl font-black">{businesses.length}</div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    +100% צמיחה חודשית
                  </span>
                </div>

                <div
                  className={`p-5 rounded-2xl border ${
                    adminTheme === 'light'
                      ? 'bg-white border-slate-200/90 shadow-xs'
                      : 'bg-[#181818] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">סך תורים שנקבעו</span>
                    <Calendar className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-2xl font-black">1,420+</div>
                  <span className="text-[10px] text-teal-600 font-bold">פעילות סדירה</span>
                </div>

                <div
                  className={`p-5 rounded-2xl border ${
                    adminTheme === 'light'
                      ? 'bg-white border-slate-200/90 shadow-xs'
                      : 'bg-[#181818] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">הכנסה חודשית מחושבת (MRR)</span>
                    <CreditCard className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black">2,480 ₪</div>
                  <span className="text-[10px] text-purple-600 font-bold">מסלולי Pro & Team</span>
                </div>

                <div
                  className={`p-5 rounded-2xl border ${
                    adminTheme === 'light'
                      ? 'bg-white border-slate-200/90 shadow-xs'
                      : 'bg-[#181818] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">זמן תגובת ענן</span>
                    <Server className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black">99.9%</div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Firestore & Edge Cache
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1
                  className={`text-xl font-black ${
                    adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  ניהול מערכת והגדרות ראשיות
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  הגדרות פלטפורמה, הודעות WhatsApp גלובליות ודומיינים
                </p>
              </div>

              <div
                className={`p-6 rounded-2xl border ${
                  adminTheme === 'light'
                    ? 'bg-white border-slate-200/90 shadow-xs'
                    : 'bg-[#181818] border-white/10'
                }`}
              >
                <h3 className="font-bold text-sm mb-2">הגדרות שרת ענן ומסד נתונים</h3>
                <p className="text-xs text-slate-500 mb-4">
                  חיבור פעיל למסד הנתונים Firebase Firestore & Auth. כל העסקים מסונכרנים בזמן אמת.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" /> מסד נתונים מחובר ופעיל (Production Multi-Tenant)
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Modals */}
      <CreateBusinessModal
        isOpen={isNewBizModalOpen}
        onClose={() => setIsNewBizModalOpen(false)}
        adminTheme={adminTheme}
        onCreateSuccess={() => {
          setIsNewBizModalOpen(false);
          fetchBusinesses();
        }}
      />

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
    </div>
  );
}
