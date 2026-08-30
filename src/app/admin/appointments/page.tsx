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
import {
  Calendar,
  Plus,
  Bell,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { useToast } from '@/components/common/ToastProvider';
import type { HaircutFormula } from '@/lib/types';
import Link from 'next/link';

// Subcomponents
import type { AdminAppointment } from '@/components/admin/appointments/types';
import { WaitlistManager } from '@/components/admin/appointments/WaitlistManager';
import { DailyAgendaTimeline } from '@/components/admin/appointments/DailyAgendaTimeline';
import { WeeklyCalendarGrid } from '@/components/admin/appointments/WeeklyCalendarGrid';
import { MonthlyCalendarGrid } from '@/components/admin/appointments/MonthlyCalendarGrid';
import { HaircutFormulaModal } from '@/components/admin/appointments/HaircutFormulaModal';
import { EmergencyClosureModal } from '@/components/admin/appointments/EmergencyClosureModal';
import { AppointmentsToolbar } from '@/components/admin/appointments/AppointmentsToolbar';
import { InteractiveScheduleXCalendar } from '@/components/admin/appointments/InteractiveScheduleXCalendar';

const today = startOfToday();
const INITIAL_APPOINTMENTS: AdminAppointment[] = [];

export default function AppointmentsPage() {
  const { success, error } = useToast();
  const {
    settings,
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
  const [calendarType, setCalendarType] = useState<'classic' | 'schedulex'>('classic');
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

  const handleAppointmentReschedule = async (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        String(a.id) === String(id) ? { ...a, date: new Date(newDate), time: newTime } : a
      )
    );
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, date: newDate, time: newTime }),
      });
      if (res.ok) {
        success('התור נגרר והועבר בהצלחה! 🔄', `הועבר לתאריך ${newDate} בשעה ${newTime}`);
      } else {
        error('שגיאה בעדכון מועד התור בשרת');
      }
    } catch {
      error('שגיאת תקשורת בהעברת התור');
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
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeMainTab === 'calendar'
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'bg-[#16171B] text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>יומן תורים שבועי / יומי</span>
          </button>

          <button
            onClick={() => setActiveMainTab('waitlist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all relative cursor-pointer ${
              activeMainTab === 'waitlist'
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'bg-[#16171B] text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>רשימת המתנה (Waitlist)</span>
            {waitingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {waitingCount}
              </span>
            )}
          </button>
        </div>

        {activeMainTab === 'calendar' && (
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>סגירת חירום / מילואים</span>
          </button>
        )}
      </div>

      {activeMainTab === 'waitlist' ? (
        <WaitlistManager
          waitlist={waitlist}
          onUpdateStatus={updateWaitlistStatus}
          onRemove={removeFromWaitlist}
        />
      ) : (
        <div>
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                יומן תורים חכם · {settings.shopName || 'העסק'}
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-sans">
                ניהול לו״ז שבועי, שינוי סטטוסים ותיעוד נוסחת טיפול לכל לקוח
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/booking"
                className="text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>קבע תור חדש</span>
              </Link>
            </div>
          </div>

          {/* Engine / View Switcher (Classic vs Schedule-X Drag & Drop) */}
          <div className="flex items-center gap-2 mb-5 bg-[#16171B] p-1.5 rounded-2xl border border-white/10 w-fit shadow-md">
            <button
              onClick={() => setCalendarType('classic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calendarType === 'classic'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📅 יומן שבועי / יומי מעוצב
            </button>
            <button
              onClick={() => setCalendarType('schedulex')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                calendarType === 'schedulex'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>לוח גרירה אינטראקטיבי (Drag & Drop)</span>
            </button>
          </div>

          {calendarType === 'schedulex' ? (
            <div className="mb-6">
              <InteractiveScheduleXCalendar
                appointments={filteredAppointments}
                onAppointmentReschedule={handleAppointmentReschedule}
                onAppointmentClick={handleOpenFormula}
              />
            </div>
          ) : (
            <>
              {/* View Mode & Date Switcher Toolbar */}
              <AppointmentsToolbar
                viewMode={viewMode}
                currentDate={currentDate}
                weekDays={weekDays}
                selectedBranchFilter={selectedBranchFilter}
                onViewModeChange={setViewMode}
                onPrev={handlePrev}
                onNext={handleNext}
                onToday={() => setCurrentDate(today)}
                onBranchFilterChange={setSelectedBranchFilter}
              />

              {/* 1. DAILY VIEW */}
              {viewMode === 'day' && (
                <DailyAgendaTimeline
                  currentDate={currentDate}
                  dayAppointments={dayAppointments}
                  onOpenFormula={handleOpenFormula}
                  onStatusChange={handleStatusChange}
                />
              )}

              {/* 2. WEEKLY VIEW */}
              {viewMode === 'week' && (
                <WeeklyCalendarGrid
                  weekDays={weekDays}
                  today={today}
                  filteredAppointments={filteredAppointments}
                  settings={settings}
                  onSelectDay={(day) => {
                    setCurrentDate(day);
                    setViewMode('day');
                  }}
                />
              )}

              {/* 3. MONTHLY VIEW */}
              {viewMode === 'month' && (
                <MonthlyCalendarGrid
                  monthWeeks={monthWeeks}
                  currentDate={currentDate}
                  today={today}
                  filteredAppointments={filteredAppointments}
                  onSelectDay={(day) => {
                    setCurrentDate(day);
                    setViewMode('day');
                  }}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* 4. HAIRCUT FORMULA MODAL */}
      <HaircutFormulaModal
        appointment={selectedFormulaAppointment}
        formula={editingFormula}
        onChangeFormula={setEditingFormula}
        onSave={handleSaveFormula}
        onClose={() => setSelectedFormulaAppointment(null)}
      />

      {/* 5. EMERGENCY CLOSURE MODAL */}
      <EmergencyClosureModal
        isOpen={showEmergencyModal}
        currentDate={currentDate}
        emergencyReason={emergencyReason}
        dayAppointments={dayAppointments}
        onChangeReason={setEmergencyReason}
        onExecute={handleExecuteEmergencyClosure}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
}
