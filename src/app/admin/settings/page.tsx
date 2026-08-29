'use client';

import { useState } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Clock,
  Scissors,
  Users,
  MapPin,
  Settings as SettingsIcon,
  Megaphone,
  Coffee,
  CheckCircle2,
  Edit2,
  Navigation,
  Calendar,
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { formatPrice, formatDuration } from '@/lib/utils';
import type { Branch, Service, Barber, ServiceCategory, ShopSettings } from '@/lib/types';

const DAYS_META = [
  { dayIndex: 0, name: 'ראשון' },
  { dayIndex: 1, name: 'שני' },
  { dayIndex: 2, name: 'שלישי' },
  { dayIndex: 3, name: 'רביעי' },
  { dayIndex: 4, name: 'חמישי' },
  { dayIndex: 5, name: 'שישי' },
  { dayIndex: 6, name: 'שבת' },
];

export default function SettingsPage() {
  const {
    branches,
    services,
    barbers,
    settings,
    saveBranches,
    saveServices,
    saveBarbers,
    saveSettings,
  } = useShopStore();

  const [activeTab, setActiveTab] = useState<'schedule' | 'services' | 'banner' | 'barbers' | 'general'>('schedule');
  const [savedNotice, setSavedNotice] = useState(false);

  // Local editable states
  const [localSettings, setLocalSettings] = useState<ShopSettings>(settings);
  const [localServices, setLocalServices] = useState<Service[]>(services);
  const [localBarbers, setLocalBarbers] = useState<Barber[]>(barbers);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordChangedNotice, setPasswordChangedNotice] = useState(false);

  // Modals / Add states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 80,
    duration: 30,
    category: 'haircut',
    isActive: true,
  });

  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [newBarber, setNewBarber] = useState<Partial<Barber>>({
    name: '',
    role: 'ספר בכיר',
    phone: '',
    specialties: ['פייד', 'זקן'],
    color: '#C9A84C',
    branchIds: ['ariel', 'rehovot'],
    is_active: true,
  });

  const [blockedDates, setBlockedDates] = useState([
    { id: '1', date: '2025-03-10', reason: 'מילואים – דביר' },
    { id: '2', date: '2025-04-15', reason: 'חג פסח' },
  ]);
  const [newBlock, setNewBlock] = useState({ date: '', reason: '' });

  const notifySave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // 1. Save Weekly Branch Schedule
  const handleScheduleChange = (dayIndex: number, location: 'ariel' | 'rehovot' | 'closed') => {
    const updatedSchedule = {
      ...localSettings.branchSchedule,
      [dayIndex]: location,
    };
    const updated = { ...localSettings, branchSchedule: updatedSchedule };
    setLocalSettings(updated);
    saveSettings(updated);

    // Also sync activeDays on branches
    const arielDays = Object.entries(updatedSchedule)
      .filter(([_, loc]) => loc === 'ariel')
      .map(([d]) => Number(d));
    const rehovotDays = Object.entries(updatedSchedule)
      .filter(([_, loc]) => loc === 'rehovot')
      .map(([d]) => Number(d));

    const updatedBranches = branches.map((b) => {
      if (b.id === 'ariel') return { ...b, activeDays: arielDays };
      if (b.id === 'rehovot') return { ...b, activeDays: rehovotDays };
      return b;
    });
    saveBranches(updatedBranches);
    notifySave();
  };

  // 2. Services Handlers
  const handleSaveService = (serviceToSave: Service) => {
    const updated = localServices.map((s) => (s.id === serviceToSave.id ? serviceToSave : s));
    setLocalServices(updated);
    saveServices(updated);
    setEditingService(null);
    notifySave();
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price) return;
    const created: Service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description || '',
      price: Number(newService.price),
      duration: Number(newService.duration || 30),
      category: (newService.category as ServiceCategory) || 'haircut',
      isActive: true,
    };
    const updated = [...localServices, created];
    setLocalServices(updated);
    saveServices(updated);
    setIsAddingService(false);
    setNewService({ name: '', description: '', price: 80, duration: 30, category: 'haircut' });
    notifySave();
  };

  const handleDeleteService = (id: string) => {
    const updated = localServices.filter((s) => s.id !== id);
    setLocalServices(updated);
    saveServices(updated);
    notifySave();
  };

  const handleToggleServiceActive = (id: string) => {
    const updated = localServices.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setLocalServices(updated);
    saveServices(updated);
    notifySave();
  };

  // 3. Barbers Handlers
  const handleAddBarber = () => {
    if (!newBarber.name) return;
    const created: Barber = {
      id: Date.now().toString(),
      name: newBarber.name,
      role: newBarber.role || 'ספר',
      bio: newBarber.bio || '',
      photo_url: null,
      phone: newBarber.phone || '',
      specialties: newBarber.specialties || ['תספורות'],
      color: newBarber.color || '#C9A84C',
      branchIds: newBarber.branchIds || ['ariel'],
      is_active: true,
    };
    const updated = [...localBarbers, created];
    setLocalBarbers(updated);
    saveBarbers(updated);
    setIsAddingBarber(false);
    setNewBarber({ name: '', role: 'ספר בכיר', phone: '', specialties: ['פייד'] });
    notifySave();
  };

  const handleToggleBarberActive = (id: string) => {
    const updated = localBarbers.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b));
    setLocalBarbers(updated);
    saveBarbers(updated);
    notifySave();
  };

  // 4. General Settings
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(localSettings);
    notifySave();
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C]">הגדרות ושליטה במספרה של דביר</h1>
          <p className="text-[#6B6560] text-sm mt-1">
            שיבוץ ימי עבודה (אריאל/רחובות), מחירון שירותים, הודעות באנר דחופות והפסקות
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            נשמר בהצלחה!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DDD0] pb-2 mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'schedule'
              ? 'bg-gold text-[#1C1C1C] shadow-md'
              : 'text-[#6B6560] hover:bg-[#FAF7F2] hover:text-[#1C1C1C]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          שיבוץ שבועי (אריאל & רחובות)
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'services'
              ? 'bg-gold text-[#1C1C1C] shadow-md'
              : 'text-[#6B6560] hover:bg-[#FAF7F2] hover:text-[#1C1C1C]'
          }`}
        >
          <Scissors className="w-4 h-4" />
          מחירון ושירותים ({localServices.length})
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'banner'
              ? 'bg-gold text-[#1C1C1C] shadow-md'
              : 'text-[#6B6560] hover:bg-[#FAF7F2] hover:text-[#1C1C1C]'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          באנר הודעה דחופה ללקוחות
        </button>

        <button
          onClick={() => setActiveTab('barbers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'barbers'
              ? 'bg-gold text-[#1C1C1C] shadow-md'
              : 'text-[#6B6560] hover:bg-[#FAF7F2] hover:text-[#1C1C1C]'
          }`}
        >
          <Users className="w-4 h-4" />
          ניהול ספרים (דביר & עתידיים)
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'general'
              ? 'bg-gold text-[#1C1C1C] shadow-md'
              : 'text-[#6B6560] hover:bg-[#FAF7F2] hover:text-[#1C1C1C]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          הפסקות, טלפון ומדיניות
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: WEEKLY BRANCH PLANNER                                 */}
      {/* ============================================================ */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5DDD0] p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-black text-[#1C1C1C]">לוח שיבוץ שבועי של דביר (באיזה סניף אני כל יום?)</h2>
              <p className="text-xs text-[#6B6560] mt-1">
                בלחיצה אחת תוכל לקבוע באיזה סניף תספר בכל יום בשבוע. לוח השנה ללקוחות מתעדכן מיד ומונע בלבול ושאלות מיותרות!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {DAYS_META.map((day) => {
                const currentLoc = localSettings.branchSchedule?.[day.dayIndex] || (day.dayIndex < 3 ? 'ariel' : day.dayIndex < 6 ? 'rehovot' : 'closed');

                return (
                  <div
                    key={day.dayIndex}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-gold font-black text-xs flex items-center justify-center flex-shrink-0">
                        {day.name.slice(0, 1)}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-[#1C1C1C]">יום {day.name}</span>
                        <div className="text-xs text-[#6B6560]">
                          {currentLoc === 'ariel' && '📍 באוניברסיטת אריאל'}
                          {currentLoc === 'rehovot' && '📍 ברחובות (בית ההורים)'}
                          {currentLoc === 'closed' && '⚪ יום חופש / סגור'}
                        </div>
                      </div>
                    </div>

                    {/* Location Selector Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleScheduleChange(day.dayIndex, 'ariel')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentLoc === 'ariel'
                            ? 'bg-gold text-[#1C1C1C] shadow-sm font-black'
                            : 'bg-white text-[#6B6560] border hover:border-gold'
                        }`}
                      >
                        סניף אריאל
                      </button>

                      <button
                        onClick={() => handleScheduleChange(day.dayIndex, 'rehovot')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentLoc === 'rehovot'
                            ? 'bg-amber-800 text-white shadow-sm font-black'
                            : 'bg-white text-[#6B6560] border hover:border-amber-800'
                        }`}
                      >
                        סניף רחובות
                      </button>

                      <button
                        onClick={() => handleScheduleChange(day.dayIndex, 'closed')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentLoc === 'closed'
                            ? 'bg-zinc-700 text-white shadow-sm'
                            : 'bg-white text-[#9E9891] border hover:bg-zinc-100'
                        }`}
                      >
                        סגור / חופש
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blocked Dates (Vacation / Military) */}
          <div className="bg-white rounded-2xl border border-[#E5DDD0] p-6 shadow-sm">
            <h2 className="font-black text-base text-[#1C1C1C] mb-1">חסימת ימי מילואים או חופשות ספציפיות</h2>
            <p className="text-xs text-[#6B6560] mb-4">תאריך שנחסם כאן ייסגר להזמנות אוטומטית</p>

            <div className="flex flex-col gap-2 mb-4">
              {blockedDates.map((block) => (
                <div key={block.id} className="flex items-center justify-between bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                  <div className="text-xs">
                    <span className="font-bold text-red-700 ml-2" dir="ltr">{block.date}</span>
                    <span className="text-red-600">({block.reason})</span>
                  </div>
                  <button
                    onClick={() => setBlockedDates(blockedDates.filter((b) => b.id !== block.id))}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add block form */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={newBlock.date}
                onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
                className="px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
              />
              <input
                type="text"
                placeholder="סיבת החסימה (למשל: מילואים שבוע / חופשה)"
                value={newBlock.reason}
                onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
              />
              <button
                onClick={() => {
                  if (!newBlock.date) return;
                  setBlockedDates([...blockedDates, { id: Date.now().toString(), ...newBlock }]);
                  setNewBlock({ date: '', reason: '' });
                  notifySave();
                }}
                className="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C]"
              >
                הוסף חסימה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: SERVICES & PRICING                                     */}
      {/* ============================================================ */}
      {activeTab === 'services' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-[#1C1C1C]">ניהול שירותים ומחירון</h2>
              <p className="text-xs text-[#6B6560]">כל שינוי במחיר או בשירות מתעדכן מיידית בדף הבית ובאשף ההזמנות</p>
            </div>
            <button
              onClick={() => setIsAddingService(true)}
              className="btn-shimmer flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1C1C1C] py-2 px-4 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-sm"
            >
              <Plus className="w-4 h-4" />
              הוסף שירות חדש
            </button>
          </div>

          {/* Add Service Modal/Box */}
          {isAddingService && (
            <div className="bg-white border-2 border-gold rounded-2xl p-5 mb-6 shadow-md animate-fadeIn">
              <h3 className="font-bold text-sm text-[#1C1C1C] mb-3">הוספת שירות חדש למחירון</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="שם השירות (למשל: תספורת מיוחדת)"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                />
                <input
                  type="number"
                  placeholder="מחיר בש״ח"
                  value={newService.price || ''}
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  className="px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                />
                <input
                  type="number"
                  placeholder="משך זמן (דקות)"
                  value={newService.duration || ''}
                  onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                  className="px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                />
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value as ServiceCategory })}
                  className="px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                >
                  <option value="haircut">תספורת</option>
                  <option value="beard">זקן</option>
                  <option value="treatment">טיפוח</option>
                  <option value="color">צביעה</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="תיאור קצר של השירות"
                value={newService.description || ''}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold mb-3"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsAddingService(false)}
                  className="px-4 py-1.5 text-xs font-bold text-[#6B6560]"
                >
                  ביטול
                </button>
                <button
                  onClick={handleAddService}
                  className="btn-shimmer px-4 py-1.5 rounded-xl text-xs font-bold text-[#1C1C1C]"
                >
                  שמור שירות
                </button>
              </div>
            </div>
          )}

          {/* Services List Table */}
          <div className="bg-white rounded-2xl border border-[#E5DDD0] shadow-sm overflow-hidden divide-y divide-[#F0EBE1]">
            {localServices.map((service) => {
              const isEditing = editingService?.id === service.id;

              return (
                <div key={service.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 transition-colors">
                  {isEditing ? (
                    <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        className="px-3 py-1.5 border rounded-lg text-xs font-bold w-full sm:w-1/3"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-[#9E9891]">מחיר:</span>
                        <input
                          type="number"
                          value={editingService.price}
                          onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                          className="px-2 py-1.5 border rounded-lg text-xs font-bold w-20"
                        />
                        <span className="text-xs text-[#9E9891]">₪</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-[#9E9891]">זמן:</span>
                        <input
                          type="number"
                          value={editingService.duration}
                          onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                          className="px-2 py-1.5 border rounded-lg text-xs font-bold w-16"
                        />
                        <span className="text-xs text-[#9E9891]">דק׳</span>
                      </div>
                      <div className="flex gap-2 mr-auto">
                        <button
                          onClick={() => handleSaveService(editingService)}
                          className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          שמור
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="text-xs text-[#6B6560] px-2 py-1.5"
                        >
                          ביטול
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.icon || '✂️'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-sm text-[#1C1C1C]">{service.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30">
                              {service.category}
                            </span>
                            {!service.isActive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600">
                                לא פעיל
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6B6560] mt-0.5">{service.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mr-auto sm:mr-0">
                        <div className="text-left sm:text-right">
                          <div className="text-base font-black text-[#1C1C1C]">{formatPrice(service.price)}</div>
                          <div className="text-[11px] text-[#9E9891]">{formatDuration(service.duration)}</div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingService(service)}
                            className="p-2 text-[#6B6560] hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                            title="ערוך מחיר ושירות"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleServiceActive(service.id)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                              service.isActive
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                          >
                            {service.isActive ? 'פעיל' : 'מושהה'}
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      )}

      {/* ============================================================ */}
      {/* TAB 3: ANNOUNCEMENT BANNER                                    */}
      {/* ============================================================ */}
      {activeTab === 'banner' && (
        <div className="bg-white rounded-2xl border border-[#E5DDD0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-black text-[#1C1C1C]">באנר הודעה עליונה באתר</h2>
              <p className="text-xs text-[#6B6560]">הודעה שתופיע בראש עמוד הבית (למשל: עדכון על מבחנים, שינוי ימים או ברכת חג)</p>
            </div>

            <button
              onClick={() => {
                const current = localSettings.announcementBanner?.isActive ?? true;
                const updated = {
                  ...localSettings,
                  announcementBanner: {
                    text: localSettings.announcementBanner?.text || '',
                    isActive: !current,
                  },
                };
                setLocalSettings(updated);
                saveSettings(updated);
                notifySave();
              }}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
                localSettings.announcementBanner?.isActive
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {localSettings.announcementBanner?.isActive ? '✓ באנר פעיל באתר' : 'באנר כבוי'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">תוכן ההודעה:</label>
            <textarea
              rows={3}
              value={localSettings.announcementBanner?.text || ''}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  announcementBanner: {
                    text: e.target.value,
                    isActive: localSettings.announcementBanner?.isActive ?? true,
                  },
                })
              }
              placeholder="למשל: 📢 שימו לב: בשבוע הקרוב אני באריאל רק ביום שני. מהרו לשריין תורים!"
              className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold leading-relaxed"
            />
          </div>

          {/* Live Preview */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#9E9891] block mb-1">תצוגה מקדימה:</span>
            <div className="bg-gradient-to-r from-amber-600 via-gold to-amber-500 text-[#1C1C1C] text-xs font-bold py-2 px-4 rounded-xl text-center shadow-sm">
              {localSettings.announcementBanner?.text || 'הזן טקסט כדי לראות תצוגה מקדימה...'}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                saveSettings(localSettings);
                notifySave();
              }}
              className="btn-shimmer flex items-center gap-2 py-2 px-5 rounded-xl text-xs font-bold text-[#1C1C1C]"
            >
              <Save className="w-4 h-4" />
              שמור באנר
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: BARBERS & FUTURE STAFF                                 */}
      {/* ============================================================ */}
      {activeTab === 'barbers' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-[#1C1C1C]">ניהול ספרים וצוות</h2>
              <p className="text-xs text-[#6B6560]">
                דביר מוגדר כספר הראשי. אם תרצה להוסיף בעתיד ספר נוסף – תוכל לעשות זאת כאן בקליק!
              </p>
            </div>
            <button
              onClick={() => setIsAddingBarber(true)}
              className="btn-shimmer flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1C1C1C] py-2 px-4 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-sm"
            >
              <Plus className="w-4 h-4" />
              הוסף ספר נוסף
            </button>
          </div>

          {/* Add Barber Form */}
          {isAddingBarber && (
            <div className="bg-white border-2 border-gold rounded-2xl p-5 mb-6 shadow-md animate-fadeIn">
              <h3 className="font-bold text-sm text-[#1C1C1C] mb-3">הוספת ספר לצוות</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="שם הספר"
                  value={newBarber.name}
                  onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                  className="px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                />
                <input
                  type="text"
                  placeholder="תפקיד (למשל: ספר בכיר / מתמחה)"
                  value={newBarber.role}
                  onChange={(e) => setNewBarber({ ...newBarber, role: e.target.value })}
                  className="px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                />
                <input
                  type="text"
                  placeholder="טלפון הספר"
                  value={newBarber.phone}
                  onChange={(e) => setNewBarber({ ...newBarber, phone: e.target.value })}
                  className="px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsAddingBarber(false)}
                  className="px-4 py-1.5 text-xs font-bold text-[#6B6560]"
                >
                  ביטול
                </button>
                <button
                  onClick={handleAddBarber}
                  className="btn-shimmer px-4 py-1.5 rounded-xl text-xs font-bold text-[#1C1C1C]"
                >
                  שמור ספר
                </button>
              </div>
            </div>
          )}

          {/* Barbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {localBarbers.map((barber) => (
              <div key={barber.id} className="bg-white rounded-2xl border border-[#E5DDD0] p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg shadow-sm"
                      style={{ backgroundColor: barber.color || '#C9A84C' }}
                    >
                      {barber.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-[#1C1C1C]">{barber.name}</h3>
                      <p className="text-xs text-gold font-bold">{barber.role}</p>
                      {barber.phone && <p className="text-xs text-[#9E9891]" dir="ltr">{barber.phone}</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleBarberActive(barber.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                      barber.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {barber.is_active ? 'פעיל לקבלת תורים' : 'לא פעיל'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: GENERAL SETTINGS, LUNCH BREAK & POLICIES               */}
      {/* ============================================================ */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white rounded-2xl border border-[#E5DDD0] p-6 shadow-sm space-y-6">
          <div>
            <h2 className="font-black text-base text-[#1C1C1C] mb-1">הפסקות צהריים, טלפונים ומדיניות ביטולים</h2>
            <p className="text-xs text-[#6B6560]">התאמת כל פרטי המספרה באופן חופשי ועצמאי</p>
          </div>

          {/* Lunch break */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-gold" />
                <span className="text-xs font-bold text-[#1C1C1C]">הפסקת צהריים יומית קבועה (חסימת שעות אוטומטית)</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    lunchBreak: {
                      start: localSettings.lunchBreak?.start || '14:00',
                      end: localSettings.lunchBreak?.end || '14:30',
                      isActive: !localSettings.lunchBreak?.isActive,
                    },
                  })
                }
                className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                  localSettings.lunchBreak?.isActive ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {localSettings.lunchBreak?.isActive ? 'הפסקה מופעלת' : 'ללא הפסקה'}
              </button>
            </div>

            {localSettings.lunchBreak?.isActive && (
              <div className="flex items-center gap-3 text-xs" dir="ltr">
                <input
                  type="time"
                  value={localSettings.lunchBreak?.start || '14:00'}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      lunchBreak: {
                        start: e.target.value,
                        end: localSettings.lunchBreak?.end || '14:30',
                        isActive: true,
                      },
                    })
                  }
                  className="px-2 py-1 border rounded-lg bg-white"
                />
                <span className="text-[#9E9891]">עד</span>
                <input
                  type="time"
                  value={localSettings.lunchBreak?.end || '14:30'}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      lunchBreak: {
                        start: localSettings.lunchBreak?.start || '14:00',
                        end: e.target.value,
                        isActive: true,
                      },
                    })
                  }
                  className="px-2 py-1 border rounded-lg bg-white"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">שם המספרה</label>
              <input
                type="text"
                value={localSettings.shopName}
                onChange={(e) => setLocalSettings({ ...localSettings, shopName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">טלפון ראשי / WhatsApp</label>
              <input
                type="text"
                value={localSettings.mainPhone}
                onChange={(e) => setLocalSettings({ ...localSettings, mainPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              📱 תבנית הודעת שימור לקוחות (תזכורת חודשית בוואטסאפ)
            </label>
            <textarea
              rows={2}
              value={localSettings.retentionMessageTemplate}
              onChange={(e) => setLocalSettings({ ...localSettings, retentionMessageTemplate: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold leading-relaxed"
            />
          </div>

          {/* Password Security Card */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-[#1C1C1C]">🔒 אבטחה ושינוי סיסמת מנהל</h3>
                <p className="text-[11px] text-[#6B6560]">קבע סיסמה אישית חדשה לכניסה למערכת הניהול של דביר</p>
              </div>
              {passwordChangedNotice && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ✓ הסיסמה עודכנה בהצלחה!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="הקלד סיסמה חדשה (למשל: dvir2025)"
                className="flex-1 px-3 py-2 border rounded-xl text-xs outline-none focus:border-gold"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => {
                  if (!adminPasswordInput.trim()) return;
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('dvir_admin_password', adminPasswordInput.trim());
                    setPasswordChangedNotice(true);
                    setAdminPasswordInput('');
                    setTimeout(() => setPasswordChangedNotice(false), 3000);
                  }
                }}
                className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#2A2A2A] text-gold rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 shadow-xs"
              >
                עדכן סיסמה
              </button>
            </div>
          </div>

          {/* Clean Slate / Wipe Demo Data */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-xs text-[#1C1C1C]">איפוס והתחלה נקייה לייצור</h3>
              <p className="text-[11px] text-[#6B6560]">
                רוצה לנקות לקוחות ותורים לדוגמה ולהתחיל עם יומן נקי ב-100% עבור דביר?
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('thecut_customers');
                  localStorage.removeItem('thecut_appointments');
                  window.location.reload();
                }
              }}
              className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              אפס נתוני בדיקה
            </button>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="btn-shimmer flex items-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs text-[#1C1C1C] hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              שמור הגדרות
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
