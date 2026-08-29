'use client';

import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Clock,
  Star,
  Tag,
} from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/utils';
import { useToast } from '@/components/common/ToastProvider';
import type { Service, ServiceCategory } from '@/lib/types';

interface ServicesSettingsProps {
  services: Service[];
  onUpdateServices: (newServices: Service[]) => void;
  onNotifySave: () => void;
}

const CATEGORY_NAMES: Record<ServiceCategory, string> = {
  haircut: 'תספורות ועיצוב',
  beard: 'זקן וגילוח',
  treatment: 'טיפוח וספא',
  color: 'צבע וכיסוי שיבה',
};

const CATEGORY_ICONS: Record<ServiceCategory, string> = {
  haircut: '✂️',
  beard: '🪒',
  treatment: '🧖',
  color: '🎨',
};

export default function ServicesSettings({
  services,
  onUpdateServices,
  onNotifySave,
}: ServicesSettingsProps) {
  const { showConfirm, success } = useToast();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 80,
    duration: 30,
    category: 'haircut',
    icon: '✂️',
    popular: false,
    isActive: true,
  });

  const handleSaveService = (serviceToSave: Service) => {
    const updated = services.map((s) => (s.id === serviceToSave.id ? serviceToSave : s));
    onUpdateServices(updated);
    setEditingService(null);
    onNotifySave();
    success('השירות עודכן בהצלחה', `השירות "${serviceToSave.name}" נשמר`);
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price) return;
    const cat = (newService.category as ServiceCategory) || 'haircut';
    const created: Service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description || '',
      price: Number(newService.price),
      duration: Number(newService.duration || 30),
      category: cat,
      icon: newService.icon || CATEGORY_ICONS[cat] || '✂️',
      popular: newService.popular ?? false,
      isActive: true,
    };
    const updated = [...services, created];
    onUpdateServices(updated);
    setIsAddingService(false);
    setNewService({
      name: '',
      description: '',
      price: 80,
      duration: 30,
      category: 'haircut',
      icon: '✂️',
      popular: false,
    });
    onNotifySave();
    success('שירות חדש נוסף', `"${created.name}" נוסף בהצלחה למחירון`);
  };

  const handleDeleteService = (id: string) => {
    const service = services.find((s) => s.id === id);
    const serviceName = service ? service.name : 'השירות';
    showConfirm({
      title: 'מחיקת שירות מהמחירון',
      message: `האם אתה בטוח שברצונך למחוק את "${serviceName}"? השירות יוסר מתפריט ההזמנות ומהאתר.`,
      confirmText: 'כן, מחק שירות',
      cancelText: 'ביטול',
      type: 'danger',
      onConfirm: () => {
        const updated = services.filter((s) => s.id !== id);
        onUpdateServices(updated);
        onNotifySave();
        success('השירות נמחק בהצלחה', `השירות "${serviceName}" הוסר מהתפריט`);
      },
    });
  };

  const handleToggleServiceActive = (id: string) => {
    const updated = services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    onUpdateServices(updated);
    onNotifySave();
  };

  const handleTogglePopular = (id: string) => {
    const updated = services.map((s) => (s.id === id ? { ...s, popular: !s.popular } : s));
    onUpdateServices(updated);
    onNotifySave();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-black text-[#1C1C1C]">ניהול שירותים ומחירון ({services.length})</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            כל שינוי במחיר, זמן או הוספת טיפול חדש מתעדכן מיידית בדף הבית ובאשף הזמנת התורים
          </p>
        </div>

        <button
          onClick={() => setIsAddingService(true)}
          className="btn-shimmer flex items-center gap-2 text-xs sm:text-sm font-black text-[#1C1C1C] py-2.5 px-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-gold self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          הוסף שירות חדש
        </button>
      </div>

      {/* Add Service Box */}
      {isAddingService && (
        <div className="bg-white border-2 border-gold rounded-3xl p-6 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base text-[#1C1C1C] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              הוספת שירות חדש למחירון
            </h3>
            <button
              onClick={() => setIsAddingService(false)}
              className="text-[#9E9891] hover:text-[#1C1C1C] p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">שם השירות *</label>
              <input
                type="text"
                placeholder="למשל: תספורת גברים פרימיום"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-bold outline-none focus:border-gold bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">מחיר בש״ח *</label>
              <input
                type="number"
                placeholder="80"
                value={newService.price || ''}
                onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-bold outline-none focus:border-gold bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">משך זמן (דקות) *</label>
              <input
                type="number"
                placeholder="30"
                value={newService.duration || ''}
                onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-bold outline-none focus:border-gold bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">קטגוריה</label>
              <select
                value={newService.category}
                onChange={(e) => {
                  const cat = e.target.value as ServiceCategory;
                  setNewService({
                    ...newService,
                    category: cat,
                    icon: CATEGORY_ICONS[cat] || '✂️',
                  });
                }}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-bold outline-none focus:border-gold bg-[#FAF7F2]"
              >
                <option value="haircut">✂️ תספורת</option>
                <option value="beard">🪒 זקן</option>
                <option value="treatment">🧖 טיפוח וספא</option>
                <option value="color">🎨 צבע</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[11px] font-bold text-[#6B6560] mb-1">תיאור קצר של השירות (מוצג ללקוח)</label>
            <input
              type="text"
              placeholder="למשל: כולל חפיפה מפנקת, דירוג Fade מדויק ועיצוב עם ווקס/חימר יוקרתי"
              value={newService.description || ''}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-gold bg-[#FAF7F2]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5DDD0]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1C1C1C]">
              <input
                type="checkbox"
                checked={newService.popular ?? false}
                onChange={(e) => setNewService({ ...newService, popular: e.target.checked })}
                className="w-4 h-4 rounded text-gold focus:ring-gold"
              />
              <span>⭐ סמן כשירות פופולרי / מומלץ (VIP Tag)</span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingService(false)}
                className="px-4 py-2 text-xs font-bold text-[#6B6560] hover:text-[#1C1C1C]"
              >
                ביטול
              </button>
              <button
                onClick={handleAddService}
                className="btn-shimmer px-5 py-2 rounded-xl text-xs font-black text-[#1C1C1C] shadow-gold"
              >
                שמור שירות למחירון
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-3xl border border-[#E5DDD0] shadow-sm overflow-hidden divide-y divide-[#F0EBE1]">
        {services.map((service) => {
          const isEditing = editingService?.id === service.id;

          return (
            <div
              key={service.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 transition-colors"
            >
              {isEditing ? (
                <div className="w-full space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-gold">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#6B6560] font-bold mb-1">שם השירות</label>
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded-xl text-xs font-bold bg-white outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#6B6560] font-bold mb-1">מחיר (₪)</label>
                      <input
                        type="number"
                        value={editingService.price}
                        onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 border rounded-xl text-xs font-bold bg-white outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#6B6560] font-bold mb-1">משך זמן (דקות)</label>
                      <input
                        type="number"
                        value={editingService.duration}
                        onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 border rounded-xl text-xs font-bold bg-white outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#6B6560] font-bold mb-1">תיאור השירות</label>
                    <input
                      type="text"
                      value={editingService.description || ''}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white outline-none focus:border-gold"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.popular ?? false}
                        onChange={(e) => setEditingService({ ...editingService, popular: e.target.checked })}
                        className="w-3.5 h-3.5 rounded text-gold"
                      />
                      <span>שירות מומלץ (VIP)</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingService(null)}
                        className="px-3 py-1.5 text-xs text-[#6B6560] font-bold"
                      >
                        ביטול
                      </button>
                      <button
                        onClick={() => handleSaveService(editingService)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        שמור שינויים
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD0] flex items-center justify-center text-xl flex-shrink-0">
                      {service.icon || CATEGORY_ICONS[service.category] || '✂️'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-sm text-[#1C1C1C]">{service.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/10 text-[#856514] border border-gold/30">
                          {CATEGORY_NAMES[service.category] || service.category}
                        </span>
                        {service.popular && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-black" />
                            פופולרי
                          </span>
                        )}
                        {!service.isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600">
                            מושהה
                          </span>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-xs text-[#6B6560] mt-1 line-clamp-1">{service.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 mr-auto sm:mr-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                    <div className="text-right">
                      <div className="text-base font-black text-[#1C1C1C] font-mono">{formatPrice(service.price)}</div>
                      <div className="text-[11px] text-[#9E9891] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-gold" />
                        {formatDuration(service.duration)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTogglePopular(service.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          service.popular
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-[#9E9891] hover:text-amber-500 hover:bg-amber-50'
                        }`}
                        title={service.popular ? 'בטל סימון פופולרי' : 'סמן כשירות פופולרי'}
                      >
                        <Star className={`w-4 h-4 ${service.popular ? 'fill-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => setEditingService(service)}
                        className="p-2 text-[#6B6560] hover:text-gold hover:bg-gold/10 rounded-xl transition-colors"
                        title="ערוך שירות ומחיר"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleServiceActive(service.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-colors ${
                          service.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {service.isActive ? 'פעיל' : 'מושהה'}
                      </button>

                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="מחק שירות"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
