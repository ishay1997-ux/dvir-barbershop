'use client';

import React from 'react';
import { THEME_PALETTES } from '@/lib/archetypes';
import { VisualPuckPageBuilder } from '@/components/admin/settings/VisualPuckPageBuilder';
import type { Business } from '../types';

interface EditLayoutTabProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export const EditLayoutTab: React.FC<EditLayoutTabProps> = ({
  editingBiz,
  adminTheme,
  setEditingBiz,
}) => {
  return (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: 'lavender-mist',
              name: 'לילך ולבנדר בוטיק',
              sub: 'Lavender Mist',
              icon: '🌸',
            },
            {
              id: 'botanical-sage',
              name: 'מרווה ומנטה בוטנית',
              sub: 'Botanical Sage',
              icon: '🌿',
            },
            {
              id: 'luxury-light',
              name: 'קרם אלבסטר ושמפניה',
              sub: 'Luxury Alabaster',
              icon: '✨',
            },
            {
              id: 'dark-obsidian',
              name: 'שחור פחם מט',
              sub: 'Dark Obsidian',
              icon: '🌑',
            },
            {
              id: 'brand-midnight',
              name: 'כחול נייבי-ספיר',
              sub: 'Brand Midnight',
              icon: '🌌',
            },
            {
              id: 'cyber-carbon',
              name: 'קרבון שחור מוחלט',
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

      {/* Hero Layout Style Selector */}
      <div>
        <label
          className={`block font-bold mb-2 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          סגנון פתיח עמוד הבית (Hero Archetype):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'hub-monogram', name: 'Panoramic Hero Hub', sub: 'פנורמי + לוגו עגול', icon: '💈' },
            { id: 'split-cinema', name: 'Split Cinema Showcase', sub: 'תמונה + כרטיס זימון', icon: '🎬' },
            { id: 'minimalist-vip', name: 'Minimalist VIP', sub: 'יוקרתי ממורכז + כפתור ענק', icon: '👑' },
          ].map((h) => {
            const currentHero = editingBiz.layout?.heroStyle || 'hub-monogram';
            const isSelected = currentHero === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  setEditingBiz({
                    ...editingBiz,
                    layout: {
                      ...(editingBiz.layout || {}),
                      heroStyle: h.id as any,
                    },
                  });
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                    : adminTheme === 'light'
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
                }`}
              >
                <span className="text-xl mb-1">{h.icon}</span>
                <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {h.name}
                </span>
                <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {h.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Layout Selector */}
      <div>
        <label
          className={`block font-bold mb-2 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          📋 סגנון תצוגת מחירון ושירותים (Services Layout):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'split-gallery', name: 'Split Visuals', sub: 'תמונות + מחירון', icon: '📋' },
            { id: 'cards-grid', name: 'Cards Grid', sub: 'כרטיסים רחבים', icon: '🗂️' },
            { id: 'compact-menu', name: 'Digital Menu', sub: 'תפריט מהיר', icon: '📑' },
          ].map((s) => {
            const isSelected = (editingBiz.layout?.servicesStyle || 'split-gallery') === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setEditingBiz({
                    ...editingBiz,
                    layout: {
                      ...(editingBiz.layout || {}),
                      servicesStyle: s.id as any,
                    },
                  });
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                    : adminTheme === 'light'
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
                }`}
              >
                <span className="text-xl mb-1">{s.icon}</span>
                <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {s.name}
                </span>
                <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {s.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Archetype Selector */}
      <div>
        <label
          className={`block font-bold mb-2 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          📸 סגנון הגלריה והעבודות (Gallery Archetype):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'before-after-slider', name: 'סליידר לפני/אחרי', sub: 'השוואת עבודות', icon: '✂️' },
            { id: 'instagram-masonry', name: 'Insta Grid', sub: 'רשת תמונות וזום', icon: '📸' },
            { id: 'ambient-carousel', name: 'Ambient Slider', sub: 'קרוסלת אווירה', icon: '🌿' },
          ].map((g) => {
            const isSelected = (editingBiz.layout?.galleryStyle || 'before-after-slider') === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setEditingBiz({
                    ...editingBiz,
                    layout: {
                      ...(editingBiz.layout || {}),
                      galleryStyle: g.id as any,
                    },
                  });
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                    : adminTheme === 'light'
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
                }`}
              >
                <span className="text-xl mb-1">{g.icon}</span>
                <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {g.name}
                </span>
                <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {g.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Sticky Bar Selector */}
      <div>
        <label
          className={`block font-bold mb-2 ${
            adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'
          }`}
        >
          📱 סרגל צף תחתון במובייל (Mobile Sticky Bar):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'dual-action', name: 'Dual Action', sub: 'תור + וואטסאפ', icon: '📱' },
            { id: 'triple-action', name: 'Triple Action', sub: 'תור + חיוג + Waze', icon: '⚡' },
            { id: 'minimal-pill', name: 'Minimal Pill', sub: 'גלולה זוהרת', icon: '👑' },
          ].map((m) => {
            const isSelected = (editingBiz.layout?.mobileStickyStyle || 'dual-action') === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setEditingBiz({
                    ...editingBiz,
                    layout: {
                      ...(editingBiz.layout || {}),
                      mobileStickyStyle: m.id as any,
                    },
                  });
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C9A84C] bg-amber-500/10 shadow-xs ring-1 ring-[#C9A84C]'
                    : adminTheme === 'light'
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'border-white/10 bg-[#141414] hover:bg-white/5 opacity-80'
                }`}
              >
                <span className="text-xl mb-1">{m.icon}</span>
                <span className={`text-xs font-bold ${adminTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {m.name}
                </span>
                <span className={`text-[10px] ${adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {m.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Radius & Typography Moods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Radius */}
        <div>
          <label className={`block font-bold mb-1.5 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
            פינות וכרטיסיות:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'modern-rounded', name: 'עגול 24px', icon: '📱' },
              { id: 'sharp-luxury', name: 'חד 8px', icon: '💎' },
              { id: 'classic-soft', name: 'קלאסי 16px', icon: '⚖️' },
            ].map((r) => {
              const isSelected = (editingBiz.layout?.borderRadius || 'modern-rounded') === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setEditingBiz({
                      ...editingBiz,
                      layout: {
                        ...(editingBiz.layout || {}),
                        borderRadius: r.id as any,
                      },
                    });
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#C9A84C] bg-amber-500/10 font-bold'
                      : adminTheme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#141414]'
                  }`}
                >
                  <span className="block text-sm">{r.icon}</span>
                  <span className="text-[10px]">{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Mood */}
        <div>
          <label className={`block font-bold mb-1.5 ${adminTheme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
            אופי גופנים:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'urban-bold', name: 'Urban Bold', icon: '🦁' },
              { id: 'modern-sans', name: 'Modern Sans', icon: '⚡' },
              { id: 'luxury-serif', name: 'Luxury Serif', icon: '👑' },
            ].map((f) => {
              const isSelected = (editingBiz.layout?.fontStyle || 'urban-bold') === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setEditingBiz({
                      ...editingBiz,
                      layout: {
                        ...(editingBiz.layout || {}),
                        fontStyle: f.id as any,
                      },
                    });
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#C9A84C] bg-amber-500/10 font-bold'
                      : adminTheme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#141414]'
                  }`}
                >
                  <span className="block text-sm">{f.icon}</span>
                  <span className="text-[10px]">{f.name}</span>
                </button>
              );
            })}
          </div>
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

      {/* Visual Puck Page Builder Module */}
      <div className="pt-4 border-t border-slate-200 dark:border-white/10">
        <VisualPuckPageBuilder
          layout={editingBiz.layout || {}}
          themeColor={editingBiz.themeColor || '#C9A84C'}
          businessName={editingBiz.name}
          adminTheme={adminTheme}
          onChangeLayout={(newLayout) => {
            setEditingBiz({
              ...editingBiz,
              layout: newLayout,
            });
          }}
        />
      </div>
    </div>
  );
};
