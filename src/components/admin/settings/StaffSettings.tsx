'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Phone,
  Scissors,
  Check,
  X,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import type { Barber, Branch } from '@/lib/types';

interface StaffSettingsProps {
  barbers: Barber[];
  branches: Branch[];
  onUpdateBarbers: (newBarbers: Barber[]) => void;
  onNotifySave: () => void;
}

export default function StaffSettings({
  barbers,
  branches,
  onUpdateBarbers,
  onNotifySave,
}: StaffSettingsProps) {
  const { success, showConfirm } = useToast();
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [newBarber, setNewBarber] = useState<Partial<Barber>>({
    name: '',
    role: 'ספר בכיר',
    phone: '',
    specialties: ['סקין פייד', 'פיסול זקן'],
    color: '#C9A84C',
    branchIds: ['ariel', 'rehovot'],
    is_active: true,
  });

  const handleAddBarber = () => {
    if (!newBarber.name?.trim()) return;
    const created: Barber = {
      id: `b-${Date.now()}`,
      name: newBarber.name.trim(),
      role: newBarber.role || 'ספר',
      bio: newBarber.bio || '',
      photo_url: null,
      phone: newBarber.phone?.trim() || '',
      specialties: newBarber.specialties || ['תספורות'],
      color: newBarber.color || '#C9A84C',
      branchIds: newBarber.branchIds || ['ariel'],
      is_active: true,
    };

    const updated = [...barbers, created];
    onUpdateBarbers(updated);
    setIsAddingBarber(false);
    setNewBarber({
      name: '',
      role: 'ספר בכיר',
      phone: '',
      specialties: ['סקין פייד', 'פיסול זקן'],
      color: '#C9A84C',
      branchIds: ['ariel', 'rehovot'],
    });
    onNotifySave();
    success('איש צוות נוסף בהצלחה', `${created.name} נוסף לצוות המספרה`);
  };

  const handleToggleBarberActive = (id: string) => {
    const updated = barbers.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b));
    onUpdateBarbers(updated);
    onNotifySave();
  };

  const handleDeleteBarber = (id: string) => {
    if (id === 'dvir') return;
    const barber = barbers.find((b) => b.id === id);
    const barberName = barber ? barber.name : 'איש הצוות';
    showConfirm({
      title: 'הסרת איש צוות',
      message: `האם אתה בטוח שברצונך להסיר את "${barberName}" מרשימת הספרים?`,
      confirmText: 'כן, הסר ספר',
      cancelText: 'ביטול',
      type: 'danger',
      onConfirm: () => {
        const updated = barbers.filter((b) => b.id !== id);
        onUpdateBarbers(updated);
        onNotifySave();
        success('איש הצוות הוסר בהצלחה', `${barberName} הוסר מהמערכת`);
      },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-black text-[#1C1C1C]">ניהול ספרים וצוות ({barbers.length})</h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            דביר מוגדר כספר הראשי. בעתיד תוכל להוסיף ספרים נוספים, להגדיר התמחויות ושיוך סניפים בקליק
          </p>
        </div>

        <button
          onClick={() => setIsAddingBarber(true)}
          className="btn-shimmer flex items-center gap-2 text-xs sm:text-sm font-black text-[#1C1C1C] py-2.5 px-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-gold self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          הוסף ספר נוסף לצוות
        </button>
      </div>

      {/* Add Barber Form */}
      {isAddingBarber && (
        <div className="bg-white border-2 border-gold rounded-3xl p-6 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base text-[#1C1C1C] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              הוספת ספר חדש לצוות המספרה
            </h3>
            <button
              onClick={() => setIsAddingBarber(false)}
              className="text-[#9E9891] hover:text-[#1C1C1C]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">שם הספר *</label>
              <input
                type="text"
                placeholder="למשל: איתי לוי"
                value={newBarber.name}
                onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-xl text-xs font-bold outline-none focus:border-gold bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">תפקיד</label>
              <input
                type="text"
                placeholder="למשל: ספר בכיר / אמן פיידים"
                value={newBarber.role}
                onChange={(e) => setNewBarber({ ...newBarber, role: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-gold bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B6560] mb-1">טלפון ישיר</label>
              <input
                type="text"
                placeholder="050-000-0000"
                value={newBarber.phone}
                onChange={(e) => setNewBarber({ ...newBarber, phone: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-gold bg-[#FAF7F2] font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DDD0]">
            <button
              onClick={() => setIsAddingBarber(false)}
              className="px-4 py-2 text-xs font-bold text-[#6B6560]"
            >
              ביטול
            </button>
            <button
              onClick={handleAddBarber}
              className="btn-shimmer px-5 py-2 rounded-xl text-xs font-black text-[#1C1C1C] shadow-gold"
            >
              שמור ספר
            </button>
          </div>
        </div>
      )}

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-md"
                  style={{ backgroundColor: barber.color || '#C9A84C' }}
                >
                  {barber.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-[#1C1C1C]">{barber.name}</h3>
                    {barber.id === 'dvir' && (
                      <span className="bg-gold text-[#1C1C1C] text-[10px] font-black px-2 py-0.5 rounded-full">
                        ראשי
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gold font-bold">{barber.role}</p>
                  {barber.phone && (
                    <p className="text-[11px] text-[#9E9891] font-mono mt-0.5" dir="ltr">
                      {barber.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleBarberActive(barber.id)}
                  className={`text-xs px-3 py-1 rounded-xl font-bold transition-colors ${
                    barber.is_active
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  {barber.is_active ? 'פעיל' : 'מושהה'}
                </button>
                {barber.id !== 'dvir' && (
                  <button
                    onClick={() => handleDeleteBarber(barber.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="הסר ספר"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Specialties & Branches */}
            <div className="pt-3 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                {(barber.specialties || []).map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FAF7F2] text-[#6B6560] border border-[#E5DDD0]"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[#9E9891]">
                <MapPin className="w-3 h-3 text-gold" />
                <span>אריאל & רחובות</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
