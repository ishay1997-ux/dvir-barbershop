'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  MoveHorizontal,
  X,
  Upload,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { ShopSettings, TransformationItem } from '@/lib/types';

interface MediaGallerySettingsProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

const GALLERY_PRESETS = [
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517832606589-7629c339590a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
];

export default function MediaGallerySettings({
  settings,
  onUpdateSettings,
  onNotifySave,
}: MediaGallerySettingsProps) {
  const { success, showConfirm } = useToast();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingTransformation, setIsAddingTransformation] = useState(false);
  const [newTrans, setNewTrans] = useState<Partial<TransformationItem>>({
    title: '',
    category: 'תספורת פרימיום',
    description: '',
    beforeImage: '',
    afterImage: '',
  });

  const galleryImages = settings.galleryImages || GALLERY_PRESETS;
  const transformations = settings.transformations || [];

  // Add Gallery Image
  const handleAddGalleryImage = (urlToAdd?: string) => {
    const url = (urlToAdd || newImageUrl).trim();
    if (!url) return;
    const updated = {
      ...settings,
      galleryImages: [...galleryImages, url],
    };
    onUpdateSettings(updated);
    setNewImageUrl('');
    onNotifySave();
    success('תמונה נוספה לגלריה', 'התמונה החדשה מוצגת כעת באתר');
  };

  // Remove Gallery Image
  const handleRemoveGalleryImage = (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    const updated = {
      ...settings,
      galleryImages: updatedImages,
    };
    onUpdateSettings(updated);
    onNotifySave();
  };

  // Add Transformation
  const handleAddTransformation = () => {
    if (!newTrans.title) return;
    const created: TransformationItem = {
      id: Date.now().toString(),
      title: newTrans.title,
      category: newTrans.category || 'תספורת פרימיום',
      description: newTrans.description || '',
      beforeImage: newTrans.beforeImage || undefined,
      afterImage: newTrans.afterImage || undefined,
      beforeGradient: 'from-stone-900 via-stone-800 to-zinc-900',
      afterGradient: 'from-amber-900 via-amber-800 to-yellow-700',
    };

    const updated = {
      ...settings,
      transformations: [...transformations, created],
    };
    onUpdateSettings(updated);
    setIsAddingTransformation(false);
    setNewTrans({ title: '', category: 'תספורת פרימיום', description: '', beforeImage: '', afterImage: '' });
    onNotifySave();
    success('כרטיסיית טרנספורמציה נוספה', 'סליידר לפני/אחרי עודכן');
  };

  // Remove Transformation
  const handleRemoveTransformation = (id: string) => {
    showConfirm({
      title: 'מחיקת טרנספורמציה',
      message: 'האם אתה בטוח שברצונך למחוק כרטיסייה זו מסליידר לפני/אחרי?',
      confirmText: 'כן, מחק',
      cancelText: 'ביטול',
      type: 'danger',
      onConfirm: () => {
        const updated = {
          ...settings,
          transformations: transformations.filter((t) => t.id !== id),
        };
        onUpdateSettings(updated);
        onNotifySave();
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Logo / Monogram & Cover Banner */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">תמונת פרופיל ובאנר ראשי (Brand Assets)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הגדר קישורים לתמונת הלוגו/מונוגרם ולתמונת הקאבר העליונה של המספרה
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              קישור לתמונת פרופיל / לוגו מספרה (Avatar / Logo URL)
            </label>
            <input
              type="text"
              placeholder="https://... (השאר ריק למונוגרם אותיות מעוצב)"
              value={settings.avatarUrl || ''}
              onChange={(e) => {
                const updated = { ...settings, avatarUrl: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-gold bg-[#FAF7F2]"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              קישור לתמונת קאבר ראשית (Hero Cover Banner URL)
            </label>
            <input
              type="text"
              placeholder="https://... (תמונת רקע לראש עמוד הבית)"
              value={settings.heroImage || ''}
              onChange={(e) => {
                const updated = { ...settings, heroImage: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-gold bg-[#FAF7F2]"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* 2. Recent Haircuts Gallery */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="text-base font-black text-[#1C1C1C]">
                גלריית עבודות ותספורות אחרונות ({galleryImages.length})
              </h2>
            </div>
            <p className="text-xs text-[#6B6560] mt-1">
              תמונות אלו מוצגות בסקשן הגלריה לצד המחירון בעמוד הבית
            </p>
          </div>
        </div>

        {/* Add image bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
          <input
            type="text"
            placeholder="הדבק קישור לתמונה חדשה (URL מ-Unsplash / אינסטגרם / שרת תמונות)..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1 px-3.5 py-2.5 border rounded-xl text-xs outline-none focus:border-gold bg-[#FAF7F2]"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => handleAddGalleryImage()}
            className="btn-shimmer px-5 py-2.5 rounded-xl text-xs font-bold text-[#1C1C1C] flex items-center justify-center gap-1.5 shadow-gold hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            הוסף לגלריה
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {galleryImages.map((imgUrl, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden aspect-square border border-[#E5DDD0] bg-zinc-900 shadow-xs"
            >
              <img
                src={imgUrl}
                alt={`עבודה ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(index)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-transform hover:scale-110 active:scale-95"
                  title="הסר תמונה"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                #{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Before & After Transformation Slider Manager */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <MoveHorizontal className="w-5 h-5 text-gold" />
              <h2 className="text-base font-black text-[#1C1C1C]">
                סליידר טרנספורמציה "לפני ואחרי" ({transformations.length})
              </h2>
            </div>
            <p className="text-xs text-[#6B6560] mt-1">
              כרטיסיות אינטראקטיביות המאפשרות ללקוח לגרור את הסליידר ולראות את ההבדל בתספורת
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingTransformation(true)}
            className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C] shadow-sm hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            הוסף כרטיסיית שינוי
          </button>
        </div>

        {/* Add Transformation Form */}
        {isAddingTransformation && (
          <div className="bg-[#FAF7F2] border-2 border-gold rounded-2xl p-5 mb-5 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#1C1C1C]">הוספת טרנספורמציה חדשה לסליידר</h3>
              <button
                onClick={() => setIsAddingTransformation(false)}
                className="text-[#9E9891] hover:text-[#1C1C1C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">כותרת הטרנספורמציה *</label>
                <input
                  type="text"
                  placeholder="למשל: סקין פייד קלאסי ועיצוב קווי מתאר"
                  value={newTrans.title}
                  onChange={(e) => setNewTrans({ ...newTrans, title: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">קטגוריה</label>
                <input
                  type="text"
                  placeholder="למשל: תספורת פרימיום / עיצוב זקן"
                  value={newTrans.category}
                  onChange={(e) => setNewTrans({ ...newTrans, category: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">תיאור קצר</label>
              <input
                type="text"
                placeholder="למשל: מעבר משיער פרוע לדירוג מדויק וטקסטורה עליונה"
                value={newTrans.description}
                onChange={(e) => setNewTrans({ ...newTrans, description: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">תמונת 'לפני' (URL אופציונלי)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newTrans.beforeImage}
                  onChange={(e) => setNewTrans({ ...newTrans, beforeImage: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">תמונת 'אחרי' (URL אופציונלי)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newTrans.afterImage}
                  onChange={(e) => setNewTrans({ ...newTrans, afterImage: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddingTransformation(false)}
                className="px-3 py-1.5 text-xs text-[#6B6560] font-bold"
              >
                ביטול
              </button>
              <button
                onClick={handleAddTransformation}
                className="btn-shimmer px-4 py-1.5 rounded-xl text-xs font-black text-[#1C1C1C]"
              >
                שמור לסליידר
              </button>
            </div>
          </div>
        )}

        {/* Transformations List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {transformations.map((trans) => (
            <div
              key={trans.id}
              className="p-4 rounded-2xl border border-[#E5DDD0] bg-[#FAF7F2] flex flex-col justify-between gap-3 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-[#856514] border border-gold/30">
                    {trans.category}
                  </span>
                  <button
                    onClick={() => handleRemoveTransformation(trans.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-black text-xs text-[#1C1C1C] mt-1">{trans.title}</h4>
                {trans.description && (
                  <p className="text-[11px] text-[#6B6560] mt-0.5 line-clamp-2">{trans.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#9E9891] pt-2 border-t border-black/5 font-mono">
                <span>סליידר אינטראקטיבי</span>
                <span>פעיל באתר ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
