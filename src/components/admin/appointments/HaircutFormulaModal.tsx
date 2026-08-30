'use client';

import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  Wrench,
  HeartPulse,
  Plus,
  Trash2,
  Check,
  Tag,
  Layers,
} from 'lucide-react';
import type { HaircutFormula } from '@/lib/types';
import type { AdminAppointment } from './types';
import { getIndustryTerminology } from '@/lib/industry-terminology';

interface HaircutFormulaModalProps {
  appointment: AdminAppointment | null;
  formula: HaircutFormula;
  category?: string;
  onChangeFormula: (formula: HaircutFormula) => void;
  onSave: () => void;
  onClose: () => void;
}

type IndustryPreset = 'barber' | 'beauty' | 'technician' | 'clinic' | 'custom';

export const ClientFormulaModal: React.FC<HaircutFormulaModalProps> = ({
  appointment,
  formula,
  category,
  onChangeFormula,
  onSave,
  onClose,
}) => {
  const terminology = getIndustryTerminology(category);

  const defaultPreset: IndustryPreset = (() => {
    const cat = category || '';
    if (cat === 'beauty_salon') return 'beauty';
    if (cat === 'home_technician') return 'technician';
    if (cat === 'clinics_aesthetics' || cat === 'clinic_therapist' || cat === 'private_instructor') return 'clinic';
    return 'barber';
  })();

  const [activePreset, setActivePreset] = useState<IndustryPreset>(defaultPreset);
  const [customKey, setCustomKey] = useState('');
  const [customVal, setCustomVal] = useState('');

  if (!appointment) return null;

  // Custom attributes parsing from formula
  const customAttrs: Record<string, string> = (() => {
    try {
      if ((formula as any).customAttributes) {
        return (formula as any).customAttributes;
      }
      if (formula.notes && formula.notes.startsWith('{') && formula.notes.endsWith('}')) {
        return JSON.parse(formula.notes);
      }
    } catch {}
    return {};
  })();

  const handleAddCustomAttr = () => {
    if (!customKey.trim() || !customVal.trim()) return;
    const updated = { ...customAttrs, [customKey.trim()]: customVal.trim() };
    onChangeFormula({
      ...formula,
      notes: JSON.stringify(updated),
      ...(formula as any),
      customAttributes: updated,
    });
    setCustomKey('');
    setCustomVal('');
  };

  const handleRemoveCustomAttr = (keyToRemove: string) => {
    const updated = { ...customAttrs };
    delete updated[keyToRemove];
    onChangeFormula({
      ...formula,
      notes: Object.keys(updated).length > 0 ? JSON.stringify(updated) : '',
      ...(formula as any),
      customAttributes: updated,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-teal-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                כרטיס לקוח ומאפיינים מותאמים אישית (CRM)
              </h3>
              <p className="text-xs text-slate-500">
                {appointment.customerName} · {appointment.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Industry Preset Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
            📋 בחר תבנית מקצועית לכרטיס הלקוח:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'barber' as const, label: 'מספרה', icon: Scissors },
              { id: 'beauty' as const, label: 'קוסמטיקה', icon: Sparkles },
              { id: 'technician' as const, label: 'טכנאי', icon: Wrench },
              { id: 'clinic' as const, label: 'קליניקה', icon: HeartPulse },
            ].map((p) => {
              const Icon = p.icon;
              const isSel = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePreset(p.id)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                    isSel
                      ? 'bg-teal-50 border-teal-500 text-teal-800 font-black shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Fields */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          {/* BARBER PRESET */}
          {activePreset === 'barber' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ✂️ מספר מכונה בצדדים וסגנון פייד
                </label>
                <input
                  type="text"
                  placeholder="למשל: 0.5 סקין פייד נמוך, טייפר עדין"
                  value={formula.sides || ''}
                  onChange={(e) => onChangeFormula({ ...formula, sides: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  💈 חלק עליון ומספריים
                </label>
                <input
                  type="text"
                  placeholder="למשל: קיצור חצי אורך, טקסטורה, פוני ישר"
                  value={formula.top || ''}
                  onChange={(e) => onChangeFormula({ ...formula, top: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🪒 זקן וקווי מתאר
                </label>
                <input
                  type="text"
                  placeholder="למשל: קווים חדים בתער בלחיים, קיצור סנטר, שמן ארגן"
                  value={formula.beard || ''}
                  onChange={(e) => onChangeFormula({ ...formula, beard: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ☕ שתייה והעדפה אישית
                </label>
                <input
                  type="text"
                  placeholder="למשל: אספרסו קצר בלי סוכר"
                  value={formula.beverage || ''}
                  onChange={(e) => onChangeFormula({ ...formula, beverage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>
            </>
          )}

          {/* BEAUTY PRESET */}
          {activePreset === 'beauty' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ✨ סוג עור ורגישויות
                </label>
                <input
                  type="text"
                  placeholder="למשל: עור מעורב/שמן, רגישות לרטינול"
                  value={formula.sides || ''}
                  onChange={(e) => onChangeFormula({ ...formula, sides: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  💅 צורת ציפורן וגוון לק מועדף
                </label>
                <input
                  type="text"
                  placeholder="למשל: שקד קצר, לק ג'ל פנינה / פרנץ'"
                  value={formula.top || ''}
                  onChange={(e) => onChangeFormula({ ...formula, top: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🧴 סרום וחומרים פעילים
                </label>
                <input
                  type="text"
                  placeholder="למשל: חומצה היאלורונית + ויטמין C"
                  value={formula.beard || ''}
                  onChange={(e) => onChangeFormula({ ...formula, beard: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>
            </>
          )}

          {/* TECHNICIAN PRESET */}
          {activePreset === 'technician' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🏢 קוד כניסה לבניין וקומה
                </label>
                <input
                  type="text"
                  placeholder="למשל: קוד אינטרקום 1423#, קומה 4 דירה 12"
                  value={formula.sides || ''}
                  onChange={(e) => onChangeFormula({ ...formula, sides: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🔧 דגם מכשיר / סוג צנרת
                </label>
                <input
                  type="text"
                  placeholder="למשל: מזגן תדיראן אינוורטר 3.5 כ״ס / צנרת SP"
                  value={formula.top || ''}
                  onChange={(e) => onChangeFormula({ ...formula, top: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ⚡ גישה ללוח חשמל / מים ראשי
                </label>
                <input
                  type="text"
                  placeholder="למשל: שיבר מים בחדר מדרגות ליד מעלית"
                  value={formula.beard || ''}
                  onChange={(e) => onChangeFormula({ ...formula, beard: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>
            </>
          )}

          {/* CLINIC PRESET */}
          {activePreset === 'clinic' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🩺 דגשים רפואיים ומגבלות
                </label>
                <input
                  type="text"
                  placeholder="למשל: רגישות בגב תחתון, ללא עומס על ברך ימין"
                  value={formula.sides || ''}
                  onChange={(e) => onChangeFormula({ ...formula, sides: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🎯 מטרת הטיפול / אימון
                </label>
                <input
                  type="text"
                  placeholder="למשל: שיקום תנועה, חיזוק שרירי ליבה"
                  value={formula.top || ''}
                  onChange={(e) => onChangeFormula({ ...formula, top: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>
            </>
          )}
        </div>

        {/* Universal Dynamic Key-Value Attributes Builder */}
        <div className="border border-slate-200 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              שדות מותאמים אישית חופשיים (Universal Custom Fields):
            </span>
          </div>

          {/* Existing Dynamic Attributes List */}
          {Object.keys(customAttrs).length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {Object.entries(customAttrs).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{k}: </span>
                    <span className="text-slate-600">{v}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomAttr(k)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="הסר שדה"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Key-Value */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="שם השדה (למשל: תאריך לידה)"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-teal-600"
            />
            <input
              type="text"
              placeholder="ערך השדה"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value)}
              className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={handleAddCustomAttr}
              disabled={!customKey.trim() || !customVal.trim()}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>הוסף</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            ביטול
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>שמור נתוני לקוח</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const HaircutFormulaModal = ClientFormulaModal;
