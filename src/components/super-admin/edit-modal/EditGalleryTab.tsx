'use client';

import React, { useState } from 'react';
import type { Business } from '../types';

interface EditGalleryTabProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export const EditGalleryTab: React.FC<EditGalleryTabProps> = ({
  editingBiz,
  adminTheme,
  setEditingBiz,
}) => {
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');

  return (
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
  );
};
