'use client';

import React from 'react';
import type { Business } from '../types';

interface EditSocialTabProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export const EditSocialTab: React.FC<EditSocialTabProps> = ({
  editingBiz,
  adminTheme,
  setEditingBiz,
}) => {
  return (
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
  );
};
