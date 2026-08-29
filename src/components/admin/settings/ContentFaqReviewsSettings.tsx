'use client';

import React, { useState } from 'react';
import {
  MessageSquareQuote,
  HelpCircle,
  Star,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  X,
  User,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { ShopSettings, FaqItem, TestimonialItem } from '@/lib/types';

interface ContentFaqReviewsSettingsProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onNotifySave: () => void;
}

export default function ContentFaqReviewsSettings({
  settings,
  onUpdateSettings,
  onNotifySave,
}: ContentFaqReviewsSettingsProps) {
  const { success, showConfirm } = useToast();

  // FAQ states
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Testimonials states
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    comment: '',
    rating: 5,
    serviceUsed: 'תספורת גברים פרימיום',
    timeAgo: 'השבוע',
  });

  const faqs = settings.faqs || [];
  const testimonials = settings.testimonials || [];

  // ==========================================
  // FAQ HANDLERS
  // ==========================================
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

  // ==========================================
  // TESTIMONIALS HANDLERS
  // ==========================================
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
    setNewReview({ name: '', comment: '', rating: 5, serviceUsed: 'תספורת גברים פרימיום', timeAgo: 'השבוע' });
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
    <div className="space-y-8 animate-fadeIn">
      {/* 1. About & Bio Section */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gold" />
            <h2 className="text-base font-black text-[#1C1C1C]">אודות מאסטר ברבר והפילוסופיה (About & Bio)</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            הטקסט והפרטים המוצגים בכרטיסיית המאסטר ברבר בעמוד הבית
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">שם בעל העסק / הספר</label>
              <input
                type="text"
                value={settings.ownerName || ''}
                onChange={(e) => {
                  const updated = { ...settings, ownerName: e.target.value };
                  onUpdateSettings(updated);
                  onNotifySave();
                }}
                className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">שנות ניסיון במקצוע</label>
              <input
                type="number"
                value={settings.experienceYears || 7}
                onChange={(e) => {
                  const updated = { ...settings, experienceYears: Number(e.target.value) };
                  onUpdateSettings(updated);
                  onNotifySave();
                }}
                className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">שם העסק המלא</label>
              <input
                type="text"
                value={settings.shopName || ''}
                onChange={(e) => {
                  const updated = { ...settings, shopName: e.target.value };
                  onUpdateSettings(updated);
                  onNotifySave();
                }}
                className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">סלוגן ראשי (כותרת משנה בראש האתר)</label>
            <input
              type="text"
              value={settings.slogan || ''}
              onChange={(e) => {
                const updated = { ...settings, slogan: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">פסקת אודות ופילוסופיית שירות</label>
            <textarea
              rows={3}
              value={settings.bio || ''}
              onChange={(e) => {
                const updated = { ...settings, bio: e.target.value };
                onUpdateSettings(updated);
                onNotifySave();
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs bg-[#FAF7F2] outline-none focus:border-gold leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 2. FAQs Section Builder */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gold" />
              <h2 className="text-base font-black text-[#1C1C1C]">שאלות ותשובות נפוצות ({faqs.length})</h2>
            </div>
            <p className="text-xs text-[#6B6560] mt-1">
              מענה על שאלות בנושא ביטולים, איחורים, חניה ואמצעי תשלום
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingFaq(true)}
            className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C] shadow-sm hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
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
              <button onClick={() => setIsAddingFaq(false)} className="text-[#9E9891] hover:text-[#1C1C1C]">
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
                onClick={() => setIsAddingFaq(false)}
                className="px-3 py-1.5 text-xs text-[#6B6560] font-bold"
              >
                ביטול
              </button>
              <button
                onClick={handleAddFaq}
                className="btn-shimmer px-4 py-1.5 rounded-xl text-xs font-black text-[#1C1C1C]"
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
                        onClick={() => setEditingFaq(null)}
                        className="px-3 py-1 text-xs text-[#6B6560]"
                      >
                        ביטול
                      </button>
                      <button
                        onClick={() => editingFaq && handleSaveFaq(editingFaq)}
                        className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold"
                      >
                        שמור
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenFaqIndex(isOpen ? null : index)}>
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
                          className="p-1.5 text-[#9E9891] hover:text-gold rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFaq(faq.id);
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[#9E9891] p-1">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

      {/* 3. Customer Testimonials & Reviews */}
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
            className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C] shadow-sm hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
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
              <button onClick={() => setIsAddingReview(false)} className="text-[#9E9891] hover:text-[#1C1C1C]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">שם הלקוח *</label>
                <input
                  type="text"
                  placeholder="למשל: יונתן כהן"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">שירות שבוצע</label>
                <input
                  type="text"
                  placeholder="למשל: תספורת פרימיום + זקן"
                  value={newReview.serviceUsed}
                  onChange={(e) => setNewReview({ ...newReview, serviceUsed: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">דירוג כוכבים</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 כוכבים</option>
                  <option value={4}>⭐⭐⭐⭐ 4 כוכבים</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">תוכן הביקורת / חוות הדעת *</label>
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
                onClick={() => setIsAddingReview(false)}
                className="px-3 py-1.5 text-xs text-[#6B6560] font-bold"
              >
                ביטול
              </button>
              <button
                onClick={handleAddReview}
                className="btn-shimmer px-4 py-1.5 rounded-xl text-xs font-black text-[#1C1C1C]"
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
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-400 hover:text-red-600 p-1"
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
    </div>
  );
}
