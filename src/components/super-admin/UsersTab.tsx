'use client';

import React from 'react';
import {
  Users,
  UserPlus,
  RefreshCw,
  Trash2,
  Plus,
  MessageCircle,
} from 'lucide-react';
import type { Business } from './types';

interface UsersTabProps {
  managedUsers: any[];
  usersLoading: boolean;
  businesses: Business[];
  adminTheme: 'dark' | 'light';
  newUserEmail: string;
  newUserDisplayName: string;
  newUserRole: 'super_admin' | 'business_admin';
  newUserBusinessSlugs: string;
  isAddingUser: boolean;
  onRefresh: () => void;
  onChangeEmail: (email: string) => void;
  onChangeDisplayName: (name: string) => void;
  onChangeRole: (role: 'super_admin' | 'business_admin') => void;
  onChangeBusinessSlugs: (slugs: string) => void;
  onAddUser: () => void;
  onDeleteUser: (uid: string, email: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  managedUsers,
  usersLoading,
  businesses,
  adminTheme,
  newUserEmail,
  newUserDisplayName,
  newUserRole,
  newUserBusinessSlugs,
  isAddingUser,
  onRefresh,
  onChangeEmail,
  onChangeDisplayName,
  onChangeRole,
  onChangeBusinessSlugs,
  onAddUser,
  onDeleteUser,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2
            className={`text-base font-black ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            ניהול משתמשים והרשאות במערכת
          </h2>
          <p className={`text-xs ${adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'}`}>
            הוסף משתמשים לפי כתובת אימייל, הגדר תפקידים (מנהל-על / מנהל עסק) ושייך לעסקים ספציפיים
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={usersLoading}
          className={`text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
            adminTheme === 'light'
              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin text-[#C9A84C]' : ''}`}
          />
          <span>רענן משתמשים</span>
        </button>
      </div>

      {/* Quick Provision & WhatsApp Invite Card for Dvir */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          adminTheme === 'light'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-gold/10 border-gold/30 text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold text-black flex items-center justify-center font-black shrink-0">
            ✂️
          </div>
          <div>
            <h4 className="font-black text-xs sm:text-sm">
              גישה ישירה ומאובטחת לדביר (dvirattias10@gmail.com)
            </h4>
            <p className="text-[11px] opacity-80">
              דביר מוגדר מראש ומורשה להתחבר עם חשבון Google שלו בדף{' '}
              <code className="font-mono font-bold">/admin/login</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              onChangeEmail('dvirattias10@gmail.com');
              onChangeDisplayName('דביר אטיאס');
              onChangeRole('business_admin');
              onChangeBusinessSlugs('dvir');
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
      <div
        className={`rounded-2xl p-5 transition-all border ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
            : 'bg-[#1C1C1C] border-white/10 text-white shadow-lg'
        }`}
      >
        <h3
          className={`text-sm font-black flex items-center gap-2 mb-3 ${
            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
          }`}
        >
          <UserPlus className="w-4 h-4 text-[#C9A84C]" />
          <span>הוספת משתמש חדש</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label
              className={`block text-[11px] font-bold mb-1 ${
                adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-400'
              }`}
            >
              כתובת אימייל (Google / Gmail):
            </label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => onChangeEmail(e.target.value)}
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
            <label
              className={`block text-[11px] font-bold mb-1 ${
                adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-400'
              }`}
            >
              שם מלא:
            </label>
            <input
              type="text"
              value={newUserDisplayName}
              onChange={(e) => onChangeDisplayName(e.target.value)}
              placeholder="למשל: דביר / מנהל סניף"
              className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                  : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-[11px] font-bold mb-1 ${
                adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-400'
              }`}
            >
              תפקיד במערכת:
            </label>
            <select
              value={newUserRole}
              onChange={(e) => onChangeRole(e.target.value as any)}
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
              <label
                className={`block text-[11px] font-bold mb-1 ${
                  adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-400'
                }`}
              >
                שיוך למספרה / עסק:
              </label>
              <select
                value={newUserBusinessSlugs || 'dvir'}
                onChange={(e) => onChangeBusinessSlugs(e.target.value)}
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
            onClick={onAddUser}
            disabled={isAddingUser || !newUserEmail}
            className="px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingUser ? 'מוסיף...' : 'הוסף משתמש למערכת'}</span>
          </button>
        </div>
      </div>

      {/* Users List Table */}
      <div
        className={`rounded-2xl overflow-hidden border transition-all ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
            : 'bg-[#1C1C1C] border-white/10 text-white shadow-lg'
        }`}
      >
        <div
          className={`p-4 border-b flex items-center justify-between ${
            adminTheme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-white/10'
          }`}
        >
          <h3
            className={`text-sm font-black flex items-center gap-2 ${
              adminTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
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
          <div
            className={`divide-y ${adminTheme === 'light' ? 'divide-slate-100' : 'divide-white/5'}`}
          >
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
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        adminTheme === 'light'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {(u.displayName || u.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-xs ${
                          adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
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
                        {u.role === 'super_admin'
                          ? '👑 מנהל-על (Super Admin)'
                          : '💼 מנהל עסק (Business Admin)'}
                      </span>
                      {u.preRegistered && (
                        <span className="bg-amber-500/20 text-amber-600 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          ממתין לכניסה ראשונה
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 flex items-center gap-2 ${
                        adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                      }`}
                    >
                      <span dir="ltr">{u.email}</span>
                      {u.businessSlugs && u.businessSlugs.length > 0 && (
                        <span
                          className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}
                        >
                          · עסקים מורשים:{' '}
                          <strong
                            className={adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}
                          >
                            {u.businessSlugs.join(', ')}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`text-[10px] ${
                      adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                    }`}
                    dir="ltr"
                  >
                    נוצר: {new Date(u.createdAt).toLocaleDateString('he-IL')}
                  </span>

                  {u.email !== 'ishay1997@gmail.com' && (
                    <button
                      type="button"
                      onClick={() => onDeleteUser(u.uid, u.email)}
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
  );
};
