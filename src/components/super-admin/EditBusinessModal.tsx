'use client';

import React, { useState } from 'react';
import {
  Settings2,
  CheckCircle,
  Trash2,
  Save,
  Plus,
} from 'lucide-react';
import { THEME_PALETTES } from '@/lib/archetypes';
import type { Business, ServiceItem, BranchItem } from './types';

interface EditBusinessModalProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  isSavingBiz: boolean;
  saveNotice: boolean;
  onClose: () => void;
  onUpdateEditingBiz: (biz: Business) => void;
  onSave: () => void;
}

export const EditBusinessModal: React.FC<EditBusinessModalProps> = ({
  editingBiz,
  adminTheme,
  isSavingBiz,
  saveNotice,
  onClose,
  onUpdateEditingBiz,
  onSave,
}) => {
  const [editTab, setEditTab] = useState<
    'branding' | 'layout' | 'social' | 'gallery' | 'services' | 'branches' | 'banner'
  >('branding');
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(80);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(30);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');

  const setEditingBiz = onUpdateEditingBiz;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative max-w-2xl w-full border-2 rounded-3xl p-6 shadow-2xl z-10 my-auto text-right transition-colors ${
          adminTheme === 'light'
            ? 'bg-white border-[#C9A84C] text-slate-900'
            : 'bg-[#1C1C1C] border-[#C9A84C]/50 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-4 ${
            adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
          }`}
        >
          <div className="flex items-center gap-2 text-[#C9A84C]">
            <Settings2 className="w-6 h-6" />
            <div>
              <h3
                className={`text-base font-black ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                התאמה אישית ועריכת אתר: {editingBiz.name}
              </h3>
              <span
                className={`text-[11px] ${
                  adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
                }`}
                dir="ltr"
              >
                thecut.co.il/{editingBiz.slug}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              adminTheme === 'light'
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            ✕
          </button>
        </div>

        {saveNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> השינויים נשמרו בהצלחה והאתר עודכן
            באוויר!
          </div>
        )}

        {/* Inner Sub-Tabs */}
        <div
          className={`flex border-b mb-4 gap-1 sm:gap-2 text-xs font-bold overflow-x-auto pb-1 ${
            adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
          }`}
        >
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

        {/* TAB: BRANDING */}
        {editTab === 'branding' && (
          <div className="space-y-3.5 text-xs">
            <div>
              <label
                className={`block font-bold mb-1 ${
                  adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
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
              <label
                className={`block font-bold mb-1 ${
                  adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
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
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
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
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
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
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
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
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
                  סטטוס פעילות:
                </label>
                <select
                  value={editingBiz.status}
                  onChange={(e) =>
                    setEditingBiz({ ...editingBiz, status: e.target.value as any })
                  }
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

        {/* TAB: LAYOUT */}
        {editTab === 'layout' && (
          <div className="space-y-4 text-xs">
            <div
              className={`p-3 rounded-xl border ${
                adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-[#141414] border-white/10 text-zinc-300'
              }`}
            >
              <span
                className={`font-bold block mb-1 ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                📐 התאמה אישית של מבנה האתר (Layout & Structure):
              </span>
              באפשרותך לקבוע את ערכת הרקע, צבע המיתוג ולהפעיל או לכבות סקשנים לפי העדפת הספר.
            </div>

            {/* Website Background Theme Selector */}
            <div>
              <label
                className={`block font-bold mb-2 ${
                  adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
                ערכת רקע ואווירה כללית לאתר (Website Theme):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    id: 'dark-obsidian',
                    name: 'שחור אובסידיאן',
                    sub: 'Dark Obsidian',
                    icon: '🌑',
                  },
                  {
                    id: 'brand-midnight',
                    name: 'כהה גוון מותג',
                    sub: 'Brand Midnight',
                    icon: '🌌',
                  },
                  {
                    id: 'luxury-light',
                    name: 'בהיר פרימיום',
                    sub: 'Luxury Light',
                    icon: '☀️',
                  },
                  {
                    id: 'cyber-carbon',
                    name: 'קרבון וניאון',
                    sub: 'Cyber Carbon',
                    icon: '⚡',
                  },
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
                      <span
                        className={`text-xs font-bold ${
                          adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {th.name}
                      </span>
                      <span
                        className={`text-[10px] ${
                          adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                        }`}
                      >
                        {th.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Palette Picker & Custom Color */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className={`block font-bold ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
                  🎨 פלטת צבעי מיתוג והילת תאורה לאתר (Brand Color & Aura):
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] ${
                      adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                    }`}
                  >
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
                    <div
                      className="w-4 h-4 rounded-full shadow-xs flex-shrink-0"
                      style={{ backgroundColor: pal.color }}
                    />
                    <span
                      className={`text-[11px] font-bold truncate ${
                        adminTheme === 'light' ? 'text-slate-800' : 'text-white'
                      }`}
                    >
                      {pal.name.split('·')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Visibility Toggles */}
            <div>
              <label
                className={`block font-bold mb-2 ${
                  adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
                מודולים וסקשנים פעילים בעמוד הבית:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    key: 'showBio',
                    label: '✂️ אודות הספר והניסיון (Barber Bio & Philosophy)',
                    desc: 'הצגת פסקת האודות, שנות הניסיון והסטנדרטים',
                  },
                  {
                    key: 'showBranches',
                    label: '📍 סניפים וניווט Waze (Branches & Hours)',
                    desc: 'הצגת שעות פעילות, כתובת וניווט ישיר',
                  },
                  {
                    key: 'showBeforeAfter',
                    label: '🌓 סליידר לפני / אחרי (Before & After Slider)',
                    desc: 'סליידר אינטראקטיבי למהפכי תספורת וזקן',
                  },
                  {
                    key: 'showReviews',
                    label: '⭐ ביקורות והמלצות (Google Reviews 5.0★)',
                    desc: 'הצגת פידבק לקוחות מרוצים וציון ממוצע',
                  },
                  {
                    key: 'showFaqs',
                    label: '❓ שאלות נפוצות (FAQ Section)',
                    desc: 'אקורדיון שאלות ותשובות לקוחות',
                  },
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
                        <div
                          className={`font-bold text-xs ${
                            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {sec.label}
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                          }`}
                        >
                          {sec.desc}
                        </div>
                      </div>
                      <div
                        className={`w-8 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                          isEnabled ? 'bg-emerald-500 justify-end' : 'bg-zinc-400 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SOCIAL */}
        {editTab === 'social' && (
          <div className="space-y-3.5 text-xs">
            <p
              className={`text-[11px] mb-2 leading-relaxed p-3 rounded-xl border ${
                adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-[#141414] border-white/10 text-zinc-400'
              }`}
            >
              💡 <strong>התאמת רשתות וקישורים לאתר:</strong> קישורים שיוזנו יוצגו ככפתורי פעולה
              זוהרים בדף הבית.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
                  📸 אינסטגרם (Instagram):
                </label>
                <input
                  type="text"
                  value={editingBiz.instagramUrl || editingBiz.instagramHandle || ''}
                  onChange={(e) =>
                    setEditingBiz({
                      ...editingBiz,
                      instagramUrl: e.target.value,
                      instagramHandle: e.target.value,
                    })
                  }
                  placeholder="https://instagram.com/username"
                  className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                    adminTheme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                      : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
                  👤 פייסבוק (Facebook):
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
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
                  🎵 טיקטוק (TikTok):
                </label>
                <input
                  type="text"
                  value={editingBiz.tiktokUrl || ''}
                  onChange={(e) => setEditingBiz({ ...editingBiz, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@username"
                  className={`w-full rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                    adminTheme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                      : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
                  💬 וואטסאפ (WhatsApp):
                </label>
                <input
                  type="tel"
                  value={editingBiz.whatsappNumber || editingBiz.phone || ''}
                  onChange={(e) =>
                    setEditingBiz({ ...editingBiz, whatsappNumber: e.target.value })
                  }
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
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
                  🚗 קישור Waze לניווט:
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
                <label
                  className={`block font-bold mb-1 ${
                    adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                  }`}
                >
                  🌐 אתר אינטרנט / דומיין:
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

        {/* TAB: GALLERY */}
        {editTab === 'gallery' && (
          <div className="space-y-4 text-xs">
            {/* Barber Avatar Photo */}
            <div
              className={`p-3.5 rounded-2xl space-y-3 border ${
                adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#141414] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4
                    className={`font-black text-xs flex items-center gap-1.5 ${
                      adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    <span>👤 תמונת פרופיל / תמונת הספר:</span>
                  </h4>
                  <p
                    className={`text-[11px] ${
                      adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
                    }`}
                  >
                    מופיעה בכרטיס המאסטר "הכירו את הספר"
                  </p>
                </div>
                {editingBiz.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingBiz({ ...editingBiz, avatarUrl: '' })}
                    className="text-[10px] text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    הסר תמונה 🗑️
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
                    <img
                      src={editingBiz.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
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

            {/* Haircut Gallery Photos */}
            <div
              className={`p-3.5 rounded-2xl space-y-3 border ${
                adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#141414] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4
                    className={`font-black text-xs flex items-center gap-1.5 ${
                      adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    <span>⭐ גלריית עבודות ותספורות:</span>
                  </h4>
                  <p
                    className={`text-[11px] ${
                      adminTheme === 'light' ? 'text-slate-500' : 'text-[#9E9891]'
                    }`}
                  >
                    מופיעה לצד המחירון בעמוד הראשי (לחץ על 🗑️ למחיקה)
                  </p>
                </div>
                <span className="text-[10px] text-[#B89230] font-bold">
                  {Array.isArray(editingBiz.galleryImages) ? editingBiz.galleryImages.length : 0}{' '}
                  תמונות בגלריה
                </span>
              </div>

              {Array.isArray(editingBiz.galleryImages) && editingBiz.galleryImages.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {editingBiz.galleryImages.map((imgUrl, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-300 group"
                    >
                      <img
                        src={imgUrl}
                        alt={`עבודה ${imgIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
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
                <div
                  className={`p-6 text-center rounded-xl border border-dashed text-xs ${
                    adminTheme === 'light'
                      ? 'bg-white border-slate-300 text-slate-500'
                      : 'bg-[#1C1C1C] border-white/10 text-zinc-500'
                  }`}
                >
                  📷 אין כרגע תמונות בגלריה. הדבק קישור (URL) למטה להוספת תמונות ראשונות!
                </div>
              )}

              {/* Add Image Input */}
              <div
                className={`flex gap-2 pt-2 border-t ${
                  adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
                }`}
              >
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
                    const current = Array.isArray(editingBiz.galleryImages)
                      ? [...editingBiz.galleryImages]
                      : [];
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

        {/* TAB: SERVICES */}
        {editTab === 'services' && (
          <div className="space-y-3.5 text-xs">
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {editingBiz.services?.map((srv, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border ${
                    adminTheme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-[#141414] border-white/10 text-white'
                  }`}
                >
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
                    <span className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}>
                      ₪
                    </span>
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
                    <span
                      className={`text-[10px] ${
                        adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                      }`}
                    >
                      דק׳
                    </span>
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
            <div
              className={`pt-2 border-t flex items-center gap-2 ${
                adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
              }`}
            >
              <input
                type="text"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="שם שירות חדש..."
                className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                  adminTheme === 'light'
                    ? 'bg-white border-slate-200 text-slate-900 focus:border-[#C9A84C]'
                    : 'bg-[#1C1C1C] border-white/15 text-white focus:border-[#C9A84C]'
                }`}
              />
              <input
                type="number"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(Number(e.target.value))}
                placeholder="מחיר"
                className={`w-16 rounded-xl px-2 py-2 text-center text-xs outline-none border ${
                  adminTheme === 'light'
                    ? 'bg-white border-slate-200 text-slate-900'
                    : 'bg-[#1C1C1C] border-white/15 text-white'
                }`}
              />
              <span className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}>
                ₪
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!newServiceName.trim()) return;
                  const current = editingBiz.services ? [...editingBiz.services] : [];
                  current.push({
                    name: newServiceName.trim(),
                    price: newServicePrice,
                    duration: newServiceDuration,
                  });
                  setEditingBiz({ ...editingBiz, services: current });
                  setNewServiceName('');
                }}
                className="px-3 py-2 bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                + הוסף
              </button>
            </div>
          </div>
        )}

        {/* TAB: BRANCHES */}
        {editTab === 'branches' && (
          <div className="space-y-3.5 text-xs">
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {editingBiz.branches?.map((br, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                    adminTheme === 'light'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#141414] border-white/10'
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={br.name}
                      onChange={(e) => {
                        const updated = [...(editingBiz.branches || [])];
                        updated[idx].name = e.target.value;
                        setEditingBiz({ ...editingBiz, branches: updated });
                      }}
                      placeholder="שם הסניף"
                      className={`w-full font-bold text-xs bg-transparent outline-none ${
                        adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    />
                    <input
                      type="text"
                      value={br.address}
                      onChange={(e) => {
                        const updated = [...(editingBiz.branches || [])];
                        updated[idx].address = e.target.value;
                        setEditingBiz({ ...editingBiz, branches: updated });
                      }}
                      placeholder="כתובת הסניף"
                      className={`w-full text-[11px] bg-transparent outline-none ${
                        adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                      }`}
                    />
                  </div>
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
              ))}
            </div>

            {/* Add new branch */}
            <div
              className={`pt-2 border-t space-y-2 ${
                adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
              }`}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="שם סניף חדש..."
                  className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border ${
                    adminTheme === 'light'
                      ? 'bg-white border-slate-200 text-slate-900'
                      : 'bg-[#1C1C1C] border-white/15 text-white'
                  }`}
                />
                <input
                  type="text"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="כתובת..."
                  className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border ${
                    adminTheme === 'light'
                      ? 'bg-white border-slate-200 text-slate-900'
                      : 'bg-[#1C1C1C] border-white/15 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newBranchName.trim()) return;
                    const current = editingBiz.branches ? [...editingBiz.branches] : [];
                    current.push({
                      name: newBranchName.trim(),
                      address: newBranchAddress.trim(),
                    });
                    setEditingBiz({ ...editingBiz, branches: current });
                    setNewBranchName('');
                    setNewBranchAddress('');
                  }}
                  className="px-3 py-2 bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  + הוסף
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BANNER */}
        {editTab === 'banner' && (
          <div className="space-y-3.5 text-xs">
            <div>
              <label
                className={`block font-bold mb-1 ${
                  adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
                טקסט באנר עליון בדף הבית:
              </label>
              <textarea
                value={editingBiz.announcement || ''}
                onChange={(e) => setEditingBiz({ ...editingBiz, announcement: e.target.value })}
                rows={3}
                placeholder="למשל: 🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7 – שריינו מראש!"
                className={`w-full rounded-xl p-3 outline-none border transition-colors ${
                  adminTheme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                    : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                }`}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div
          className={`flex items-center justify-between pt-4 border-t mt-5 ${
            adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              adminTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-white/10 hover:bg-white/15 text-zinc-300'
            }`}
          >
            ביטול
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSavingBiz}
            className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingBiz ? 'שומר שינויים...' : 'שמור שינויים באתר'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
