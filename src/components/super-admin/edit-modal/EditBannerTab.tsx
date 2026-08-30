'use client';

import React from 'react';
import type { Business } from '../types';

interface EditBannerTabProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export const EditBannerTab: React.FC<EditBannerTabProps> = ({
  editingBiz,
  adminTheme,
  setEditingBiz,
}) => {
  return (
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
  );
};
