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
  Shield,
  Layers,
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
      className={`sticky top-0 h-screen shrink-0 border-l transition-all duration-300 z-40 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      } ${
        adminTheme === 'light'
          ? 'bg-white border-slate-200/90 text-slate-700'
          : 'bg-[#141414] border-white/10 text-zinc-300'
      }`}
      dir="rtl"
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-18 px-4 flex items-center justify-between border-b border-slate-100 dark:border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black shadow-md shadow-teal-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-base tracking-tight block leading-tight text-slate-900 dark:text-white">
                  Cut<span className="text-teal-600">Web</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Master Admin OS</span>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="w-10 h-10 mx-auto rounded-xl bg-teal-600 flex items-center justify-center text-white font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg border text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer ${
              collapsed ? 'mx-auto mt-2' : ''
            } dark:border-white/10 dark:hover:bg-white/5 dark:hover:text-white`}
            title={collapsed ? 'הרחב סרגל צד' : 'צמצם סרגל צד'}
          >
            {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? adminTheme === 'light'
                      ? 'bg-[#E8F7F3] text-teal-800 font-black shadow-xs'
                      : 'bg-teal-950/60 text-teal-300 font-black border border-teal-500/30'
                    : adminTheme === 'light'
                    ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-zinc-400'
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-300'
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
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5"
          title="אתר שיווק ראשי"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
          {!collapsed && <span>אתר שיווק ראשי</span>}
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors dark:hover:bg-rose-950/30 cursor-pointer"
          title="התנתק"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>התנתקות</span>}
        </button>
      </div>
    </aside>
  );
};
