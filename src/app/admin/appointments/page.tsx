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
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
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
  const { settings, branches } = useShopStore();
  const [appointments, setAppointments] = useState<AdminAppointment[]>(INITIAL_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(true);

  // View Controls
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'all' | 'ariel' | 'rehovot'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

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
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto" dir="rtl">
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

          <Link
            href="/booking"
            className="btn-shimmer text-xs font-black text-[#1C1C1C] py-2 px-3.5 rounded-xl flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            תור חדש
          </Link>
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

                  {/* Status & WhatsApp Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
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
  );
}
