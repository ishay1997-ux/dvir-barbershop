'use client';

import React from 'react';
import { Building2, Bug, Users } from 'lucide-react';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { ReportsTab } from '@/components/super-admin/ReportsTab';
import { UsersTab } from '@/components/super-admin/UsersTab';
import { BusinessesTab } from '@/components/super-admin/BusinessesTab';
import { EditBusinessModal } from '@/components/super-admin/EditBusinessModal';
import { CreateBusinessModal } from '@/components/super-admin/CreateBusinessModal';
import { SuperAdminHeader } from '@/components/super-admin/SuperAdminHeader';
import { SuperAdminStatsBar } from '@/components/super-admin/SuperAdminStatsBar';
import { SuperAdminLoginScreen } from '@/components/super-admin/SuperAdminLoginScreen';

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
      <SuperAdminLoginScreen
        adminTheme={adminTheme}
        googleLoading={googleLoading}
        onGoogleLogin={handleGoogleLogin}
      />
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
      <SuperAdminHeader
        adminTheme={adminTheme}
        adminUser={adminUser}
        toggleAdminTheme={toggleAdminTheme}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* KPI Stats Bar */}
        <SuperAdminStatsBar
          adminTheme={adminTheme}
          businesses={businesses}
          reports={reports}
        />

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
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/70 rounded-t-xl'
                  : 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
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
            className={`pb-3 px-4 font-black text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'reports'
                ? adminTheme === 'light'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/70 rounded-t-xl'
                  : 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
                : adminTheme === 'light'
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>דיווחי תקלות ({reports.length})</span>
            {reports.filter((r) => r.status === 'new').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-black text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? adminTheme === 'light'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/70 rounded-t-xl'
                  : 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
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
            onCloneBusiness={handleCloneBusiness}
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

      {/* Edit Business Modal */}
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

      {/* Create New Business Modal */}
      <CreateBusinessModal
        isOpen={isNewBizModalOpen}
        adminTheme={adminTheme}
        onClose={() => setIsNewBizModalOpen(false)}
        onCreateSuccess={() => {
          setIsNewBizModalOpen(false);
          fetchBusinesses();
        }}
      />
    </div>
  );
}
