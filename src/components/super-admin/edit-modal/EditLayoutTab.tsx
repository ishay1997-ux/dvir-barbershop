'use client';

import React from 'react';
import { VisualPuckPageBuilder } from '@/components/admin/settings/VisualPuckPageBuilder';
import { BackgroundThemeSelector } from './layout-tab/BackgroundThemeSelector';
import { BrandThemeSelector } from './layout-tab/BrandThemeSelector';
import { ComponentStyleSelectors } from './layout-tab/ComponentStyleSelectors';
import { SectionVisibilityToggles } from './layout-tab/SectionVisibilityToggles';
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
      <BackgroundThemeSelector
        editingBiz={editingBiz}
        adminTheme={adminTheme}
        setEditingBiz={setEditingBiz}
      />

      {/* Theme Palette Picker & Custom Color */}
      <BrandThemeSelector
        editingBiz={editingBiz}
        adminTheme={adminTheme}
        setEditingBiz={setEditingBiz}
      />

      {/* Hero, Services, Gallery, Radius & Font Selectors */}
      <ComponentStyleSelectors
        editingBiz={editingBiz}
        adminTheme={adminTheme}
        setEditingBiz={setEditingBiz}
      />

      {/* Section Visibility Toggles */}
      <SectionVisibilityToggles
        editingBiz={editingBiz}
        adminTheme={adminTheme}
        setEditingBiz={setEditingBiz}
      />

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
