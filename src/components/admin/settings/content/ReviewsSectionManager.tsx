'use client';

import React, { useState } from 'react';
import { Star, Plus, Trash2, X } from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { ShopSettings, TestimonialItem } from '@/lib/types';

interface ReviewsSectionManagerProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export const ReviewsSectionManager: React.FC<ReviewsSectionManagerProps> = ({
  settings,
  onUpdateSettings,
  onNotifySave,
}) => {
  const { success, showConfirm } = useToast();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    comment: '',
    rating: 5,
    serviceUsed: 'תספורת גברים פרימיום',
    timeAgo: 'השבוע',
  });

  const testimonials = settings.testimonials || [];

  const handleAddReview = () => {
    if (!newReview.name.trim() || !newReview.comment.trim()) return;
    const created: TestimonialItem = {
      id: `t-${Date.now()}`,
      name: newReview.name.trim(),
      comment: newReview.comment.trim(),
      rating: Number(newReview.rating || 5),
      serviceUsed: newReview.serviceUsed || 'תספורת גברים פרימיום',
      timeAgo: newReview.timeAgo || 'השבוע',
    };
    const updated = { ...settings, testimonials: [...testimonials, created] };
    onUpdateSettings(updated);
    setIsAddingReview(false);
    setNewReview({
      name: '',
      comment: '',
      rating: 5,
      serviceUsed: 'תספורת גברים פרימיום',
      timeAgo: 'השבוע',
    });
    onNotifySave();
    success('ביקורת לקוח נוספה', 'הביקורת החדשה מוצגת בסקשן ההמלצות');
  };

  const handleDeleteReview = (id: string) => {
    showConfirm({
      title: 'מחיקת ביקורת לקוח',
      message: 'האם אתה בטוח שברצונך להסיר ביקורת זו?',
      confirmText: 'כן, מחק ביקורת',
      cancelText: 'ביטול',
      type: 'danger',
      onConfirm: () => {
        const updated = {
          ...settings,
          testimonials: testimonials.filter((t) => t.id !== id),
        };
        onUpdateSettings(updated);
        onNotifySave();
      },
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-base font-black text-[#1C1C1C]">
              המלצות וביקורות לקוחות Google ({testimonials.length})
            </h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            ביקורות של לקוחות אמיתיים המופיעות בסקשן ההמלצות בעמוד הבית
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingReview(true)}
          className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C] shadow-sm hover:scale-105 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          הוסף ביקורת לקוח
        </button>
      </div>

      {/* Add Review Form */}
      {isAddingReview && (
        <div className="bg-[#FAF7F2] border-2 border-gold rounded-2xl p-5 mb-5 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#1C1C1C]">הוספת ביקורת לקוח חדשה</h3>
            <button
              type="button"
              onClick={() => setIsAddingReview(false)}
              className="text-[#9E9891] hover:text-[#1C1C1C] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                שם הלקוח *
              </label>
              <input
                type="text"
                placeholder="למשל: יונתן כהן"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                שירות שבוצע
              </label>
              <input
                type="text"
                placeholder="למשל: תספורת פרימיום + זקן"
                value={newReview.serviceUsed}
                onChange={(e) => setNewReview({ ...newReview, serviceUsed: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                דירוג כוכבים
              </label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white font-bold cursor-pointer"
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 כוכבים</option>
                <option value={4}>⭐⭐⭐⭐ 4 כוכבים</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
              תוכן הביקורת / חוות הדעת *
            </label>
            <textarea
              rows={2}
              placeholder="למשל: הספר הכי מדויק שיש! פייד מושלם כל פעם מחדש..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingReview(false)}
              className="px-3 py-1.5 text-xs text-[#6B6560] font-bold cursor-pointer"
            >
              ביטול
            </button>
            <button
              type="button"
              onClick={handleAddReview}
              className="btn-shimmer px-4 py-1.5 rounded-xl text-xs font-black text-[#1C1C1C] cursor-pointer"
            >
              שמור ביקורת
            </button>
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {testimonials.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-2xl border border-[#E5DDD0] bg-[#FAF7F2] flex flex-col justify-between gap-3 shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-[#1C1C1C] leading-relaxed italic line-clamp-3">
                "{review.comment}"
              </p>
            </div>

            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
              <span className="font-black text-[#1C1C1C]">{review.name}</span>
              <span className="text-[#9E9891]">{review.serviceUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
