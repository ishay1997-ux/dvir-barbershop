'use client';

import React from 'react';
import { Sliders, ArrowUp, ArrowDown, Eye, EyeOff, ShieldCheck, Plus, X } from 'lucide-react';
import type { SectionId } from '@/types/business';

interface SectionsManagerSectionProps {
  sectionsOrder: SectionId[];
  sectionTitles: Record<string, string>;
  trustBadges: string[];
  onToggleSection: (id: SectionId) => void;
  onMoveSection: (id: SectionId, direction: 'up' | 'down') => void;
  onUpdateTitle: (key: string, val: string) => void;
  onAddTrustBadge: (badge: string) => void;
  onRemoveTrustBadge: (idx: number) => void;
}

const ALL_POSSIBLE_SECTIONS: { id: SectionId; name: string; desc: string }[] = [
  { id: 'hero', name: 'פתיח האתר (Hero Banner)', desc: 'החלק העליון והתמונה הראשית' },
  { id: 'booking-action-cards', name: 'כרטיסי פעולה מהירים (Action Pills)', desc: 'קביעת תור, שעות פתיחה, ניווט' },
  { id: 'services', name: 'מחירון ושירותים (Price List)', desc: 'קטלוג השירותים עם מחירים ומשך זמן' },
  { id: 'before-after', name: 'גלריית עבודות / לפני ואחרי (Showcase)', desc: 'תמונות עבודה, גריד או סליידר' },
  { id: 'about', name: 'אודות והיכרות (Bio / Story)', desc: 'כרטיס המנהל/ת ופילוסופיית העסק' },
  { id: 'reviews', name: 'המלצות וביקורות Google (Social Proof)', desc: 'חוות דעת של לקוחות מרוצים' },
  { id: 'policies', name: 'מדיניות ותנאי הגעה (Policies)', desc: 'ביטולים, איחורים ודרכי הגעה' },
  { id: 'branches', name: 'סניפים ומיקומים (Branches)', desc: 'כתובות סניפים וניווט מהיר' },
  { id: 'faq', name: 'שאלות ותשובות נפוצות (FAQ)', desc: 'מענה מהיר לשאלות של לקוחות חדשים' },
];

export function SectionsManagerSection({
  sectionsOrder,
  sectionTitles,
  trustBadges,
  onToggleSection,
  onMoveSection,
  onUpdateTitle,
  onAddTrustBadge,
  onRemoveTrustBadge,
}: SectionsManagerSectionProps) {
  const [newBadgeText, setNewBadgeText] = React.useState('');

  const handleAddBadgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeText.trim()) return;
    onAddTrustBadge(newBadgeText.trim());
    setNewBadgeText('');
  };

  return (
    <div className="space-y-6">
      {/* Sections Reordering */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C9A84C]" />
            <h2 className="text-base font-black text-[#1C1C1C]">סדר והצגת הסקשנים בעמוד הבית (Page Sections Builder)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            שלוט על איזה סקשנים יוצגו ללקוחות ושנה את סדר הופעתם בעמוד
          </p>
        </div>

        <div className="space-y-3">
          {sectionsOrder.map((sectionId, idx) => {
            const secInfo = ALL_POSSIBLE_SECTIONS.find((s) => s.id === sectionId) || {
              id: sectionId,
              name: sectionId,
              desc: '',
            };

            return (
              <div
                key={sectionId}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E5DDD0] bg-[#FAF7F2] hover:border-[#C9A84C]/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-[#1C1C1C]">{secInfo.name}</h3>
                    <p className="text-[10px] text-[#6B6560]">{secInfo.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => onMoveSection(sectionId, 'up')}
                    className="p-1.5 rounded-lg border border-[#E5DDD0] bg-white text-[#6B6560] hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                    title="הזז למעלה"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === sectionsOrder.length - 1}
                    onClick={() => onMoveSection(sectionId, 'down')}
                    className="p-1.5 rounded-lg border border-[#E5DDD0] bg-white text-[#6B6560] hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                    title="הזז למטה"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSection(sectionId)}
                    className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer ml-1"
                    title="הסתר סקשן זה"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hidden Sections */}
        {ALL_POSSIBLE_SECTIONS.filter((s) => !sectionsOrder.includes(s.id)).length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#E5DDD0]">
            <span className="text-xs font-black text-[#6B6560] block mb-2">סקשנים מוסתרים (לחץ להחזרה):</span>
            <div className="flex flex-wrap gap-2">
              {ALL_POSSIBLE_SECTIONS.filter((s) => !sectionsOrder.includes(s.id)).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onToggleSection(s.id)}
                  className="px-3 py-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-xs text-slate-600 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Section Titles */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-black text-[#1C1C1C]">כותרות סקשנים מותאמות אישית</h2>
          <p className="text-xs text-[#6B6560] mt-1">ערוך את הטקסט המוצג בכותרת של כל חלק בעמוד הבית</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#1C1C1C] block mb-1">כותרת מחירון ושירותים:</label>
            <input
              type="text"
              value={sectionTitles?.services || ''}
              placeholder="שירותים ומחירון פרימיום"
              onChange={(e) => onUpdateTitle('services', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5DDD0] text-xs font-sans focus:border-[#C9A84C] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#1C1C1C] block mb-1">כותרת גלריה ותוצאות:</label>
            <input
              type="text"
              value={sectionTitles?.gallery || ''}
              placeholder="עבודות נבחרות ותוצאות"
              onChange={(e) => onUpdateTitle('gallery', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5DDD0] text-xs font-sans focus:border-[#C9A84C] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#1C1C1C] block mb-1">כותרת אודות והיכרות:</label>
            <input
              type="text"
              value={sectionTitles?.bio || ''}
              placeholder="הכירו את הצוות"
              onChange={(e) => onUpdateTitle('bio', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5DDD0] text-xs font-sans focus:border-[#C9A84C] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#1C1C1C] block mb-1">כותרת המלצות לקוחות:</label>
            <input
              type="text"
              value={sectionTitles?.reviews || ''}
              placeholder="מה הלקוחות אומרים עלינו"
              onChange={(e) => onUpdateTitle('reviews', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5DDD0] text-xs font-sans focus:border-[#C9A84C] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-[#1C1C1C]">תווי אמון ואיכות (Trust Badges)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הצהרות איכות שיוצגו בפתיח ובאשף ההזמנות (למשל: סטריליזציה קפדנית, חומרים מובחרים, חניה חינם)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {trustBadges.map((badge, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5"
            >
              <span>{badge}</span>
              <button
                type="button"
                onClick={() => onRemoveTrustBadge(idx)}
                className="w-4 h-4 rounded-full bg-emerald-200/60 hover:bg-emerald-300 text-emerald-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddBadgeSubmit} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newBadgeText}
            onChange={(e) => setNewBadgeText(e.target.value)}
            placeholder="הוסף תג חדש (לדוגמה: מוצרי פרימיום מאיטליה)..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-[#E5DDD0] text-xs font-sans focus:border-emerald-500 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            הוסף תג
          </button>
        </form>
      </div>
    </div>
  );
}
