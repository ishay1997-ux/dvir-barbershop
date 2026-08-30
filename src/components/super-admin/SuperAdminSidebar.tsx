'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Users,
  Bug,
  Calendar,
  Settings,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SuperAdminSidebarProps {
  activeTab: 'overview' | 'businesses' | 'users' | 'reports' | 'settings';
  onSelectTab: (tab: 'overview' | 'businesses' | 'users' | 'reports' | 'settings') => void;
  businessesCount: number;
  reportsCount: number;
  usersCount: number;
  adminTheme: 'dark' | 'light';
  onLogout: () => void;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  businessesCount,
  reportsCount,
  usersCount,
  adminTheme,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      id: 'businesses' as const,
      label: 'ניהול מספרות ועסקים',
      icon: Building2,
      badge: businessesCount,
    },
    {
      id: 'users' as const,
      label: 'משתמשים והרשאות',
      icon: Users,
      badge: usersCount,
    },
    {
      id: 'reports' as const,
      label: 'דיווחי תקלות ופניות',
      icon: Bug,
      badge: reportsCount,
      alert: reportsCount > 0,
    },
    {
      id: 'overview' as const,
      label: 'דוחות ואנליטיקה',
      icon: LayoutDashboard,
    },
    {
      id: 'settings' as const,
      label: 'ניהול מערכת והגדרות',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 border-l transition-all duration-200 z-40 flex flex-col justify-between select-none ${
        collapsed ? 'w-18' : 'w-64'
      } ${
        adminTheme === 'light'
          ? 'bg-[#FCFCFD] border-slate-200/80 text-slate-700'
          : 'bg-[#111215] border-white/10 text-zinc-300'
      }`}
      dir="rtl"
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-white/10">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xs">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  Cut<span className="text-indigo-600 dark:text-indigo-400">Web</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">ניהול-על פלטפורמה</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${
              collapsed ? 'hidden' : ''
            } dark:hover:bg-white/5 dark:hover:text-white`}
            title={collapsed ? 'הרחב סרגל' : 'צמצם סרגל'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasBadge = item.badge !== undefined && item.badge > 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? adminTheme === 'light'
                      ? 'bg-slate-100 text-slate-950 font-bold border-r-3 border-indigo-600'
                      : 'bg-white/10 text-white font-bold border-r-3 border-indigo-400'
                    : adminTheme === 'light'
                    ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && hasBadge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-zinc-300'
                    } ${item.alert ? 'bg-rose-500 text-white animate-pulse' : ''}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-white/10 space-y-1">
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 mb-1 cursor-pointer"
            title="הרחב סרגל צד"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5"
          title="אתר שיווק ראשי"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
          {!collapsed && <span>אתר שיווק ראשי</span>}
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors dark:hover:bg-rose-950/30 cursor-pointer"
          title="התנתק"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>התנתקות</span>}
        </button>
      </div>
    </aside>
  );
};
