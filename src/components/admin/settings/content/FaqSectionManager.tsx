'use client';

import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, Edit2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { ShopSettings, FaqItem } from '@/lib/types';

interface FaqSectionManagerProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export const FaqSectionManager: React.FC<FaqSectionManagerProps> = ({
  settings,
  onUpdateSettings,
  onNotifySave,
}) => {
  const { success, showConfirm } = useToast();
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = settings.faqs || [];

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    const created: FaqItem = {
      id: `f-${Date.now()}`,
      question: newFaq.question.trim(),
      answer: newFaq.answer.trim(),
    };
    const updated = { ...settings, faqs: [...faqs, created] };
    onUpdateSettings(updated);
    setIsAddingFaq(false);
    setNewFaq({ question: '', answer: '' });
    onNotifySave();
    success('שאלה נפוצה נוספה', 'השאלה עודכנה ומוצגת באתר');
  };

  const handleSaveFaq = (faqToSave: FaqItem) => {
    const updated = {
      ...settings,
      faqs: faqs.map((f) => (f.id === faqToSave.id ? faqToSave : f)),
    };
    onUpdateSettings(updated);
    setEditingFaq(null);
    onNotifySave();
    success('שאלה נפוצה עודכנה', 'השינויים נשמרו בהצלחה');
  };

  const handleDeleteFaq = (id?: string) => {
    if (!id) return;
    showConfirm({
      title: 'מחיקת שאלה נפוצה',
      message: 'האם אתה בטוח שברצונך למחוק שאלה זו מהאתר?',
      confirmText: 'כן, מחק שאלה',
      cancelText: 'ביטול',
      type: 'danger',
      onConfirm: () => {
        const updated = {
          ...settings,
          faqs: faqs.filter((f) => f.id !== id),
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
            <HelpCircle className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">
              שאלות ותשובות נפוצות ({faqs.length})
            </h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            מענה על שאלות בנושא ביטולים, איחורים, חניה ואמצעי תשלום
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingFaq(true)}
          className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C] shadow-sm hover:scale-105 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          הוסף שאלה חדשה
        </button>
      </div>

      {/* Add FAQ form */}
      {isAddingFaq && (
        <div className="bg-[#FAF7F2] border-2 border-gold rounded-2xl p-5 mb-5 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#1C1C1C]">הוספת שאלה ותשובה ל-FAQ</h3>
            <button
              type="button"
              onClick={() => setIsAddingFaq(false)}
              className="text-[#9E9891] hover:text-[#1C1C1C] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            placeholder="הזן שאלה (למשל: האם ניתן להגיע ללא תור?)"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white outline-none focus:border-gold font-bold"
          />
          <textarea
            rows={2}
            placeholder="הזן את התשובה שתוצג ללקוח..."
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white outline-none focus:border-gold leading-relaxed"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingFaq(false)}
              className="px-3 py-1.5 text-xs text-[#6B6560] font-bold cursor-pointer"
            >
              ביטול
            </button>
            <button
              type="button"
              onClick={handleAddFaq}
              className="btn-shimmer px-4 py-1.5 rounded-xl text-xs font-black text-[#1C1C1C] cursor-pointer"
            >
              שמור שאלה
            </button>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-2.5">
        {faqs.map((faq, index) => {
          const isEditing = editingFaq?.id === faq.id;
          const isOpen = openFaqIndex === index;

          return (
            <div
              key={faq.id || index}
              className="rounded-2xl border border-[#E5DDD0] bg-[#FAF7F2] p-4 transition-all"
            >
              {isEditing && editingFaq ? (
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={editingFaq.question}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        question: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl text-xs font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={editingFaq.answer}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        answer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingFaq(null)}
                      className="px-3 py-1 text-xs text-[#6B6560] cursor-pointer"
                    >
                      ביטול
                    </button>
                    <button
                      type="button"
                      onClick={() => editingFaq && handleSaveFaq(editingFaq)}
                      className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      שמור
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  >
                    <span className="font-black text-xs sm:text-sm text-[#1C1C1C] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold/20 text-[#856514] font-mono text-[11px] flex items-center justify-center">
                        {index + 1}
                      </span>
                      {faq.question}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFaq(faq);
                        }}
                        className="p-1.5 text-[#9E9891] hover:text-gold rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFaq(faq.id);
                        }}
                        className="p-1.5 text-red-400 hover:text-red-600 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[#9E9891] p-1">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <p className="text-xs text-[#6B6560] mt-2.5 pt-2.5 border-t border-black/5 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
