'use client';

import { useState, useEffect } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfToday,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
} from 'date-fns';
import { he } from 'date-fns/locale';
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  TrendingUp,
  Bell,
  Sparkles,
  Scissors,
  Coffee,
  AlertTriangle,
  MessageCircle,
  Trash2,
  Check,
  User,
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/common/ToastProvider';
import type { HaircutFormula, WaitlistEntry } from '@/lib/types';
import Link from 'next/link';

const today = startOfToday();

interface AdminAppointment {
  id: string;
  date: Date;
  time: string;
  customerName: string;
  phone: string;
  service: string;
  branchId: 'ariel' | 'rehovot';
  branchName: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no_show';
  price: number;
}

const INITIAL_APPOINTMENTS: AdminAppointment[] = [];

export default function AppointmentsPage() {
  const { success, error } = useToast();
  const {
    settings,
    branches,
    waitlist,
    customers,
    saveSettings,
    removeFromWaitlist,
    updateWaitlistStatus,
    updateCustomerFormula,
  } = useShopStore();

  const [appointments, setAppointments] = useState<AdminAppointment[]>(INITIAL_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(true);

  // View Controls
  const [activeMainTab, setActiveMainTab] = useState<'calendar' | 'waitlist'>('calendar');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'all' | 'ariel' | 'rehovot'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modals state
  const [selectedFormulaAppointment, setSelectedFormulaAppointment] = useState<AdminAppointment | null>(null);
  const [editingFormula, setEditingFormula] = useState<HaircutFormula>({});
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('שירות מילואים דחוף');

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await fetch('/api/appointments');
        if (res.ok) {
          const data = await res.json();
          if (data.appointments && Array.isArray(data.appointments)) {
            const mapped = data.appointments.map((a: any) => {
              const appDate = a.date ? new Date(a.date) : today;
              return {
                id: a.id,
                date: appDate,
                time: a.time || '09:00',
                customerName: a.customerName || 'לקוח',
                phone: a.customerPhone || a.phone || '',
                service: a.serviceName || a.service || 'תספורת',
                branchId: (a.branchId as 'ariel' | 'rehovot') || 'ariel',
                branchName: a.branchName || (a.branchId === 'rehovot' ? 'סניף רחובות' : 'סניף אריאל'),
                status: (a.status as any) || 'confirmed',
                price: Number(a.servicePrice || a.price) || 80,
              };
            });
            setAppointments(mapped);
          }
        }
      } catch (err) {
        console.error('Error loading appointments:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, []);

  // Time navigation
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 0 });

  const handlePrev = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, -1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((a) => {
    if (selectedBranchFilter !== 'all' && a.branchId !== selectedBranchFilter) return false;
    if (selectedStatusFilter !== 'all' && a.status !== selectedStatusFilter) return false;
    return true;
  });

  const dayAppointments = filteredAppointments.filter((a) => isSameDay(a.date, currentDate));

  const handleStatusChange = async (id: string, newStatus: AdminAppointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        const labels: Record<string, string> = {
          confirmed: 'מאושר 🟢',
          cancelled: 'בוטל ❌',
          completed: 'הושלם ✓',
          no_show: 'לא הגיע ⚠️',
          pending: 'ממתין 🟡',
        };
        success('סטטוס התור עודכן בהצלחה', `התור עודכן ל-${labels[newStatus] || newStatus}`);
      } else {
        error('שגיאה בעדכון התור בשרת');
      }
    } catch (err) {
      console.error('Failed to update status on server:', err);
      error('שגיאת תקשורת בעדכון התור');
    }
  };

  const handleOpenFormula = (app: AdminAppointment) => {
    setSelectedFormulaAppointment(app);
    const cleanP = app.phone.replace(/\D/g, '');
    const found = customers.find((c) => {
      const cP = c.phone.replace(/\D/g, '');
      return cP.endsWith(cleanP) || cleanP.endsWith(cP);
    });
    setEditingFormula(
      found?.haircutFormula || {
        sides: '0.5 סקין פייד',
        top: 'מספריים, קיצור קל',
        beard: 'קווים חדים בתער',
        notes: '',
        beverage: 'מים קרים',
      }
    );
  };

  const handleSaveFormula = () => {
    if (!selectedFormulaAppointment) return;
    updateCustomerFormula(selectedFormulaAppointment.phone, editingFormula);
    success('נוסחת תספורת נשמרה ב-CRM', `עודכנו העדפות עבור ${selectedFormulaAppointment.customerName}`);
    setSelectedFormulaAppointment(null);
  };

  const handleExecuteEmergencyClosure = () => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const updatedDailyOverrides = {
      ...(settings.dailyOverrides || {}),
      [dateKey]: {
        date: dateKey,
        branchId: 'closed' as const,
        isOpen: false,
        startTime: '00:00',
        endTime: '00:00',
        note: emergencyReason,
      },
    };
    saveSettings({
      ...settings,
      dailyOverrides: updatedDailyOverrides,
    });
    success('היום נסגר ביומן', 'התאריך נחסם לקבלת תורים חדשים');
  };

  const waitingCount = waitlist.filter((w) => w.status === 'waiting').length;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto" dir="rtl">
      {/* Top Main Navigation: Calendar vs Smart Waitlist */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-[#E5DDD0] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeMainTab === 'calendar'
                ? 'bg-[#1C1C1C] text-gold shadow-md scale-105'
                : 'bg-white text-[#6B6560] border border-[#E5DDD0] hover:text-[#1C1C1C]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>יומן תורים שבועי / יומי</span>
          </button>

          <button
            onClick={() => setActiveMainTab('waitlist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all relative ${
              activeMainTab === 'waitlist'
                ? 'bg-[#1C1C1C] text-gold shadow-md scale-105'
                : 'bg-white text-[#6B6560] border border-[#E5DDD0] hover:text-[#1C1C1C]'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>רשימת המתנה (Waitlist)</span>
            {waitingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {waitingCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 hover:bg-red-500/20 text-xs font-bold transition-all active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>סגירת חירום להיום</span>
          </button>

          <Link
            href="/booking"
            className="btn-shimmer text-xs font-black text-[#1C1C1C] py-2 px-3.5 rounded-xl flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>תור חדש</span>
          </Link>
        </div>
      </div>

      {activeMainTab === 'waitlist' ? (
        /* ============================================================ */
        /* SMART WAITLIST TAB VIEW                                      */
        /* ============================================================ */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 via-gold/10 to-transparent p-6 rounded-3xl border border-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-black text-[10px]">
                  {waitingCount} לקוחות ממתינים
                </span>
                <h2 className="text-xl font-black text-[#1C1C1C]">רשימת המתנה חכמה למספרה</h2>
              </div>
              <p className="text-xs text-[#6B6560] mt-1">
                לקוחות שנרשמו להתראה ברגע שמתפנה תור מביטול. בלחיצה אחת ניתן לשלוח להם הודעת וואטסאפ לשריין את התור!
              </p>
            </div>
          </div>

          {waitlist.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5DDD0] p-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-[#1C1C1C]">אין כרגע לקוחות ברשימת ההמתנה</h3>
              <p className="text-xs text-[#9E9891]">לקוחות יוכלו להירשם ישירות מאשף ההזמנות כששעות מסוימות מלאות.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {waitlist.map((item) => {
                const rangeLabel =
                  item.preferredTimeRange === 'morning'
                    ? 'בוקר (09:00 - 12:00)'
                    : item.preferredTimeRange === 'afternoon'
                    ? 'צהריים (12:00 - 16:30)'
                    : item.preferredTimeRange === 'evening'
                    ? 'ערב (16:30 - 20:00)'
                    : 'כל שעה שתתפנה';

                const cleanPhone = item.customerPhone.replace(/\D/g, '').replace(/^0/, '972');
                const whatsappText = `היי ${item.customerName}, התפנה תור להיום במספרה של דביר (${item.branchName})! רוצה שאשריין לך אותו לפני שיתפס?`;
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-3xl border border-[#E5DDD0] shadow-sm hover:border-gold transition-all space-y-3.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gold/20 text-[#856514] font-black flex items-center justify-center text-sm">
                          {item.customerName.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#1C1C1C]">{item.customerName}</h4>
                          <div className="text-xs text-[#6B6560] font-mono" dir="ltr">{item.customerPhone}</div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          item.status === 'waiting'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'notified'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'booked'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {item.status === 'waiting' ? 'ממתין לתור ⏳' : item.status === 'notified' ? 'נשלחה התראה 📲' : item.status === 'booked' ? 'נקבע תור ✓' : 'בוטל'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF7F2] p-3 rounded-2xl border border-[#E5DDD0]">
                      <div>
                        <span className="text-[#9E9891] text-[10px] block">תאריך מבוקש</span>
                        <span className="font-bold text-[#1C1C1C]">{item.date}</span>
                      </div>
                      <div>
                        <span className="text-[#9E9891] text-[10px] block">שעות מועדפות</span>
                        <span className="font-bold text-[#1C1C1C]">{rangeLabel}</span>
                      </div>
                      <div>
                        <span className="text-[#9E9891] text-[10px] block">סניף</span>
                        <span className="font-bold text-[#1C1C1C]">{item.branchName}</span>
                      </div>
                      <div>
                        <span className="text-[#9E9891] text-[10px] block">שירות</span>
                        <span className="font-bold text-[#1C1C1C]">{item.serviceName || 'תספורת גברים'}</span>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-[#6B6560] bg-zinc-50 p-2 rounded-xl">
                        💬 {item.notes}
                      </p>
                    )}

                    <div className="pt-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => updateWaitlistStatus(item.id, 'notified')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>שלח התראה בוואטסאפ</span>
                        </a>

                        <button
                          onClick={() => updateWaitlistStatus(item.id, 'booked')}
                          className="px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-gold/20 border border-[#E5DDD0] text-xs font-bold text-[#1C1C1C] transition-all"
                        >
                          סמן כנקבע ✓
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromWaitlist(item.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        title="מחק מרשימת המתנה"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ============================================================ */
        /* APPOINTMENTS CALENDAR VIEW                                   */
        /* ============================================================ */
        <div>
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C]">יומן תורים חכם לדביר</h1>
              <p className="text-[#6B6560] text-sm mt-0.5">
                ניהול תורים בתצוגה יומית, שבועית או חודשית בסניפי אריאל ורחובות
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* View Switcher */}
              <div className="flex bg-white rounded-2xl p-1 border border-[#E5DDD0] shadow-sm">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'day' ? 'bg-[#1C1C1C] text-gold shadow-sm' : 'text-[#6B6560] hover:text-[#1C1C1C]'
                  }`}
                >
                  יומי
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'week' ? 'bg-[#1C1C1C] text-gold shadow-sm' : 'text-[#6B6560] hover:text-[#1C1C1C]'
                  }`}
                >
                  שבועי
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'month' ? 'bg-[#1C1C1C] text-gold shadow-sm' : 'text-[#6B6560] hover:text-[#1C1C1C]'
                  }`}
                >
                  חודשי
                </button>
              </div>
            </div>
          </div>

      {/* Navigation Bar & Branch Filters */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Date Navigator */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-[#FAF7F2] rounded-xl border border-[#E5DDD0] transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#1C1C1C]" />
          </button>

          <div className="text-center font-black text-sm text-[#1C1C1C]">
            {viewMode === 'day' && format(currentDate, 'EEEE, d בMMMM yyyy', { locale: he })}
            {viewMode === 'week' && (
              <span>
                {format(weekStart, 'd בMMMM', { locale: he })} – {format(addDays(weekStart, 6), 'd בMMMM yyyy', { locale: he })}
              </span>
            )}
            {viewMode === 'month' && format(currentDate, 'MMMM yyyy', { locale: he })}
          </div>

          <button
            onClick={handleNext}
            className="p-2 hover:bg-[#FAF7F2] rounded-xl border border-[#E5DDD0] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#1C1C1C]" />
          </button>

          <button
            onClick={() => setCurrentDate(today)}
            className="text-xs font-bold text-gold bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-xl border border-gold/30 transition-colors mr-2"
          >
            היום
          </button>
        </div>

        {/* Branch Filter Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-[#6B6560] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            סניף:
          </span>
          <button
            onClick={() => setSelectedBranchFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedBranchFilter === 'all'
                ? 'bg-zinc-800 text-white'
                : 'bg-[#FAF7F2] text-[#6B6560] border'
            }`}
          >
            הכל
          </button>
          <button
            onClick={() => setSelectedBranchFilter('ariel')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedBranchFilter === 'ariel'
                ? 'bg-gold text-[#1C1C1C] font-black'
                : 'bg-[#FAF7F2] text-[#6B6560] border hover:border-gold'
            }`}
          >
            📍 סניף אריאל
          </button>
          <button
            onClick={() => setSelectedBranchFilter('rehovot')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedBranchFilter === 'rehovot'
                ? 'bg-amber-800 text-white font-black'
                : 'bg-[#FAF7F2] text-[#6B6560] border hover:border-amber-800'
            }`}
          >
            📍 סניף רחובות
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. DAILY VIEW (AGENDA TIMELINE)                              */}
      {/* ============================================================ */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-3xl border border-[#E5DDD0] shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1] mb-6">
            <h2 className="font-black text-lg text-[#1C1C1C]">
              לוח תורים ל{format(currentDate, 'EEEE, d בMMMM', { locale: he })}
            </h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {dayAppointments.length} תורים סה״כ · {formatPrice(dayAppointments.reduce((s, a) => s + a.price, 0))}
            </span>
          </div>

          {dayAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#9E9891]">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-gold" />
              <p className="text-base font-bold text-[#1C1C1C]">אין תורים מתוזמנים ליום זה</p>
              <p className="text-xs mt-1">כל השעות פנויות להזמנה</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[#E5DDD0] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] text-gold font-black text-sm flex items-center justify-center shadow-sm" dir="ltr">
                      {app.time}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-[#1C1C1C]">{app.customerName}</h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-[#1C1C1C] border border-gold/30">
                          {app.service}
                        </span>
                        <span className="text-[10px] text-[#6B6560] bg-white px-2 py-0.5 rounded-full border">
                          {app.branchName}
                        </span>
                      </div>
                      <div className="text-xs text-[#6B6560] mt-1 flex items-center gap-3">
                        <span dir="ltr">{app.phone}</span>
                        <span>•</span>
                        <span className="font-bold text-[#1C1C1C]">{formatPrice(app.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status, Formula & WhatsApp Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenFormula(app)}
                      className="px-2.5 py-2 bg-gold/15 hover:bg-gold/25 text-[#856514] font-bold text-xs rounded-xl border border-gold/30 flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                      title="נוסחת תספורת והעדפות לקוח"
                    >
                      <Scissors className="w-3.5 h-3.5 -rotate-45" />
                      <span className="hidden sm:inline">נוסחה</span>
                    </button>

                    <a
                      href={`https://wa.me/972${app.phone.replace(/\D/g, '').slice(1)}?text=${encodeURIComponent(`היי ${app.customerName}, מדבר דביר מהמספרה. מזכיר לך את התור שלך ב-${app.time}:`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                      title="שלח WhatsApp"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as AdminAppointment['status'])}
                      className="px-3 py-2 border rounded-xl text-xs font-bold outline-none bg-white focus:border-gold"
                    >
                      <option value="confirmed">מאושר ✓</option>
                      <option value="completed">בוצע ושולם ✓</option>
                      <option value="pending">ממתין לאישור</option>
                      <option value="cancelled">בוטל ✗</option>
                      <option value="no_show">לא הגיע (No-Show)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. WEEKLY VIEW (7-DAY GRID)                                  */}
      {/* ============================================================ */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-3xl border border-[#E5DDD0] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#F0EBE1]">
            {weekDays.map((day) => {
              const dayIndex = day.getDay();
              const isToday = isSameDay(day, today);
              const dayAppts = filteredAppointments.filter((a) => isSameDay(a.date, day));
              const isSat = dayIndex === 6;

              const branchLocation =
                settings.branchSchedule?.[dayIndex] ||
                (dayIndex < 3 ? 'ariel' : dayIndex < 6 ? 'rehovot' : 'closed');

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode('day');
                  }}
                  className={`p-3 sm:p-4 flex flex-col justify-between min-h-[220px] transition-colors cursor-pointer hover:bg-[#FAF7F2]/80 ${
                    isToday ? 'bg-gold/10' : isSat ? 'bg-zinc-50' : 'bg-white'
                  }`}
                >
                  <div>
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#6B6560]">
                        {format(day, 'EEEE', { locale: he })}
                      </span>
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                          isToday ? 'bg-[#1C1C1C] text-gold' : 'text-[#1C1C1C]'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>

                    {/* Branch Badge */}
                    <div className="mb-3">
                      {branchLocation === 'ariel' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-[#1C1C1C] border border-gold/40 block text-center">
                          אריאל (אוניברסיטה)
                        </span>
                      )}
                      {branchLocation === 'rehovot' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-800 text-white block text-center">
                          רחובות (בית ההורים)
                        </span>
                      )}
                      {branchLocation === 'closed' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600 block text-center">
                          סגור / חופש
                        </span>
                      )}
                    </div>

                    {/* Appointments list preview */}
                    <div className="space-y-1.5">
                      {dayAppts.slice(0, 3).map((app) => (
                        <div
                          key={app.id}
                          className="bg-white p-1.5 rounded-lg border border-[#E5DDD0] text-[11px] font-bold shadow-xs truncate"
                        >
                          <span className="text-gold ml-1" dir="ltr">{app.time}</span>
                          <span className="text-[#1C1C1C]">{app.customerName}</span>
                        </div>
                      ))}
                      {dayAppts.length > 3 && (
                        <div className="text-[10px] font-bold text-center text-[#6B6560]">
                          + עוד {dayAppts.length - 3} תורים
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Day Footer */}
                  <div className="pt-3 border-t border-[#F0EBE1] text-[11px] font-bold flex items-center justify-between text-[#6B6560]">
                    <span>{dayAppts.length} תורים</span>
                    {dayAppts.length > 0 && (
                      <span className="text-emerald-600">
                        {formatPrice(dayAppts.reduce((s, a) => s + a.price, 0))}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MONTHLY VIEW (CALENDAR OVERVIEW)                          */}
      {/* ============================================================ */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl border border-[#E5DDD0] p-6 shadow-sm">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#6B6560] mb-3 pb-2 border-b border-[#F0EBE1]">
            <span>א׳</span>
            <span>ב׳</span>
            <span>ג׳</span>
            <span>ד׳</span>
            <span>ה׳</span>
            <span>ו׳</span>
            <span>שבת</span>
          </div>

          <div className="space-y-2">
            {monthWeeks.map((week, wIdx) => {
              const days = eachDayOfInterval({ start: week, end: addDays(week, 6) });
              return (
                <div key={wIdx} className="grid grid-cols-7 gap-2">
                  {days.map((day) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = isSameDay(day, today);
                    const dayAppts = filteredAppointments.filter((a) => isSameDay(a.date, day));

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => {
                          setCurrentDate(day);
                          setViewMode('day');
                        }}
                        className={`p-2 rounded-2xl text-center border transition-all h-20 flex flex-col justify-between ${
                          isToday
                            ? 'bg-gold/15 border-gold font-black'
                            : isCurrentMonth
                            ? 'bg-[#FAF7F2] border-[#E5DDD0] hover:border-gold'
                            : 'bg-zinc-50 border-zinc-100 opacity-40'
                        }`}
                      >
                        <span className="text-xs font-bold self-start">{format(day, 'd')}</span>
                        {dayAppts.length > 0 && (
                          <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md py-0.5">
                            {dayAppts.length} תורים
                          </div>
                        )}
                        <span className="text-[9px] text-[#9E9891]">
                          {day.getDay() < 3 ? 'אריאל' : day.getDay() < 6 ? 'רחובות' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )}

      {/* ============================================================ */}
      {/* 4. HAIRCUT FORMULA & VIP CLIENT MODAL                        */}
      {/* ============================================================ */}
      {selectedFormulaAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E5DDD0] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1C1C1C] text-gold flex items-center justify-center font-black">
                  <Scissors className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#1C1C1C]">נוסחת תספורת והעדפות אישיות</h3>
                  <p className="text-xs text-[#6B6560]">
                    {selectedFormulaAppointment.customerName} · {selectedFormulaAppointment.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFormulaAppointment(null)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs font-bold text-[#6B6560]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                  ✂️ מספר מכונה בצדדים וסגנון פייד
                </label>
                <input
                  type="text"
                  placeholder="למשל: 0.5 סקין פייד נמוך, טייפר עדין"
                  value={editingFormula.sides || ''}
                  onChange={(e) => setEditingFormula({ ...editingFormula, sides: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                  💈 חלק עליון ומספריים
                </label>
                <input
                  type="text"
                  placeholder="למשל: קיצור חצי אורך, טקסטורה, פוני ישר"
                  value={editingFormula.top || ''}
                  onChange={(e) => setEditingFormula({ ...editingFormula, top: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                  🪒 זקן וקווי מתאר
                </label>
                <input
                  type="text"
                  placeholder="למשל: קווים חדים בתער בלחיים, קיצור סנטר, שמן ארגן"
                  value={editingFormula.beard || ''}
                  onChange={(e) => setEditingFormula({ ...editingFormula, beard: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    ☕ שתייה והעדפה במספרה
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: אספרסו קצר בלי סוכר"
                    value={editingFormula.beverage || ''}
                    onChange={(e) => setEditingFormula({ ...editingFormula, beverage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    ⚠️ רגישויות והערות אישיות
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: עור רגיש בעורף, לא להשתמש באלכוהול"
                    value={editingFormula.notes || ''}
                    onChange={(e) => setEditingFormula({ ...editingFormula, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C] focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5DDD0] flex justify-end gap-2">
              <button
                onClick={() => setSelectedFormulaAppointment(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E5DDD0] text-xs font-bold text-[#6B6560]"
              >
                סגור
              </button>
              <button
                onClick={handleSaveFormula}
                className="px-5 py-2 rounded-xl bg-[#1C1C1C] text-gold hover:bg-[#2C2C2C] text-xs font-black shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>שמור נוסחה ללקוח ב-CRM</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. EMERGENCY 1-CLICK CLOSURE MODAL                           */}
      {/* ============================================================ */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#FAF7F2] border border-red-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E5DDD0] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-red-700">סגירת חירום / מילואים להיום</h3>
                  <p className="text-xs text-[#6B6560]">
                    {format(currentDate, 'EEEE, d בMMMM yyyy', { locale: he })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs font-bold text-[#6B6560]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">סיבת הסגירה (תוצג ללקוחות)</label>
                <input
                  type="text"
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DDD0] bg-white text-xs text-[#1C1C1C]"
                />
              </div>

              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs text-red-800">
                ⚠️ סגירת היום תחסום את כל השעות ביומן ותאפשר לשלוח בוואטסאפ הודעת התנצלות + קישור לקביעת תור חלופי ל-
                <strong> {dayAppointments.length} </strong>
                לקוחות שקבעו להיום.
              </div>

              {dayAppointments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1C] mb-2">לקוחות שקבעו להיום ({dayAppointments.length}):</h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {dayAppointments.map((app) => {
                      const cleanPhone = app.phone.replace(/\D/g, '').replace(/^0/, '972');
                      const msg = `היי ${app.customerName}, מדבר דביר מהמספרה. לצערי עקב ${emergencyReason} לא אוכל לקבל אותך היום בשעה ${app.time}. מתנצל מאוד! אנא קבע מועד חלופי כאן: https://thecut.co.il/booking`;
                      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

                      return (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-2 bg-white rounded-xl border text-xs"
                        >
                          <div className="font-bold text-[#1C1C1C]">
                            {app.time} - {app.customerName}
                          </div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>שלח הודעה</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E5DDD0] flex justify-end gap-2">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E5DDD0] text-xs font-bold text-[#6B6560]"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  handleExecuteEmergencyClosure();
                  setShowEmergencyModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>חסום יום זה עכשיו</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
