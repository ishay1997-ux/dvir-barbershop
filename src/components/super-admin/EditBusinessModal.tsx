'use client';

import React, { useState } from 'react';
import { Settings2, CheckCircle, Save } from 'lucide-react';
import type { Business } from './types';
import { EditGeneralTab } from './edit-modal/EditGeneralTab';
import { EditLayoutTab } from './edit-modal/EditLayoutTab';
import { EditSocialTab } from './edit-modal/EditSocialTab';
import { EditGalleryTab } from './edit-modal/EditGalleryTab';
import { EditServicesTab } from './edit-modal/EditServicesTab';
import { EditBranchesTab } from './edit-modal/EditBranchesTab';
import { EditBannerTab } from './edit-modal/EditBannerTab';

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

  const setEditingBiz = onUpdateEditingBiz;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative max-w-2xl w-full border rounded-3xl p-6 shadow-2xl z-10 my-auto text-right transition-colors ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50'
            : 'bg-[#1C1C1C] border-white/10 text-white shadow-black/60'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-4 ${
            adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
          }`}
        >
          <div className="flex items-center gap-2.5 text-indigo-600">
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
            type="button"
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
                    ? 'border-indigo-600 text-indigo-600 font-black'
                    : 'border-indigo-500 text-indigo-400 font-black'
                  : adminTheme === 'light'
                  ? 'border-transparent text-slate-500 hover:text-slate-900'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {editTab === 'branding' && (
          <EditGeneralTab
            editingBiz={editingBiz}
            adminTheme={adminTheme}
            setEditingBiz={setEditingBiz}
          />
        )}

        {editTab === 'layout' && (
          <EditLayoutTab
            editingBiz={editingBiz}
            adminTheme={adminTheme}
            setEditingBiz={setEditingBiz}
          />
        )}

        {editTab === 'social' && (
          <EditSocialTab
            editingBiz={editingBiz}
            adminTheme={adminTheme}
            setEditingBiz={setEditingBiz}
          />
        )}

        {editTab === 'gallery' && (
          <EditGalleryTab
            editingBiz={editingBiz}
            adminTheme={adminTheme}
            setEditingBiz={setEditingBiz}
          />
        )}

        {editTab === 'services' && (
          <EditServicesTab
            editingBiz={editingBiz}
            adminTheme={adminTheme}
            setEditingBiz={setEditingBiz}
          />
        )}

        {editTab === 'branches' && (
          <EditBranchesTab
            editingBiz={editingBiz}
            adminTheme={adminTheme}
            setEditingBiz={setEditingBiz}
          />
        )}

        {editTab === 'banner' && (
          <EditBannerTab
            editingBiz={editingBiz}
            adminTheme={adminTheme}
            setEditingBiz={setEditingBiz}
          />
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
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingBiz ? 'שומר שינויים...' : 'שמור שינויים באתר'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
