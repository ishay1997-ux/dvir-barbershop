'use client';

import { useState, useEffect } from 'react';
import { format, startOfToday } from 'date-fns';
import { he } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Plus,
  ArrowUpRight,
  Coffee,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface TodayAppointment {
  id: string;
  time: string;
  customerName: string;
  customerPhone: string;
  service: string;
  status: string;
  price: number;
  date?: string;
}

const today = startOfToday();
const currentDayIndex = today.getDay();

export default function AdminDashboard() {
  const { settings, branches, customers } = useShopStore();
  const { isDemoMode, user } = useAuth();
  const slug = user?.businessSlugs?.[0] || 'dvir';
  const terminology = getIndustryTerminology({
    name: settings.shopName,
    shopName: settings.shopName,
    slogan: settings.heroSubtitle,
    category: settings.category,
    themeColor: settings.themeColor,
    slug,
  });
  const bizName = settings.shopName || (isDemoMode ? 'עסק הדגמה (Demo Hub)' : 'דשבורד העסק');
  const ownerName = settings.ownerName || 'מנהל ראשי';

  const [appointments, setAppointments] = useState<TodayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayStr = format(today, 'yyyy-MM-dd');
  const todayLocationKey = settings.branchSchedule?.[currentDayIndex] || (currentDayIndex < 3 ? 'ariel' : currentDayIndex < 6 ? 'rehovot' : 'closed');
  const todayBranch = branches.find((b) => b.id === todayLocationKey);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await fetch('/api/appointments');
        if (res.ok) {
          const data = await res.json();
          if (data.appointments && Array.isArray(data.appointments)) {
            const todayApps = data.appointments
              .filter((a: any) => a.date === todayStr || !a.date)
              .map((a: any) => ({
                id: a.id,
                time: a.time || '09:00',
                customerName: a.customerName || 'לקוח',
                customerPhone: a.customerPhone || '',
                service: a.serviceName || a.service || terminology.serviceTitle,
                status: a.status || 'confirmed',
                price: Number(a.servicePrice || a.price) || 80,
                date: a.date,
              }));
            setAppointments(todayApps);
          }
        }
      } catch (err) {
        console.error('Error fetching today appointments:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, [todayStr, terminology.serviceTitle]);

  const totalRevenue = appointments
    .filter((a) => a.status === 'confirmed')
    .reduce((sum, a) => sum + a.price, 0);

  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const atRiskCustomersCount = customers.filter((c) => c.status === 'at_risk').length;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6" dir="rtl">
      {/* Top Banner: Today's Status */}
      <div className="bg-white text-slate-900 p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0 shadow-xs text-indigo-600">
            {terminology.icon || '💈'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                סטטוס פעילות להיום
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isDemoMode && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-bold">
                  סביבת הדגמה חיה
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {todayLocationKey === 'closed'
                ? 'היום העסק סגור (יום חופש)'
                : `${ownerName} מקבל/ת היום ב${todayBranch?.name || 'סניף מרכזי'}`}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              {format(today, 'EEEE, d בMMMM yyyy', { locale: he })} {todayBranch ? `· ${todayBranch.address}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Link
            href="/admin/settings?tab=schedule"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-4 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
          >
            שנה שיבוץ יומי
          </Link>
          <Link
            href={slug === 'dvir' ? '/booking' : `/${slug}/booking`}
            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl shadow-xs transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ קבע תור מהיר</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid (Enterprise Light Style Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Appointments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-bold">תורים מתוזמנים להיום</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{appointments.length}</div>
          <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{confirmedCount} מאושרים</span>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-bold">הכנסה יומית צפויה</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-sans">
            ממוצע {formatPrice(Math.round(totalRevenue / (appointments.length || 1)))} ללקוח
          </div>
        </div>

        {/* Card 3: Lunch Break */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-bold">הפסקת צהריים</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900" dir="ltr">
            {settings.lunchBreak?.isActive ? `${settings.lunchBreak.start} – ${settings.lunchBreak.end}` : 'ללא הפסקה'}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-sans">חסום אוטומטית ביומן</div>
        </div>

        {/* Card 4: Retention */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-bold">לקוחות לשימור</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{atRiskCustomersCount}</div>
          <Link href="/admin/customers" className="text-xs text-indigo-600 hover:text-indigo-700 font-bold mt-1 block transition-colors">
            פתח ספר לקוחות CRM ←
          </Link>
        </div>
      </div>

      {/* Today's Appointments List Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="font-black text-lg text-slate-900">
              רשימת התורים להיום · {bizName}
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              כל התורים המוזמנים להיום עם אפשרות לשליחת תזכורת WhatsApp בלחיצה
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            <span>פתח יומן מלא</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-xs">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">אין תורים מתוזמנים להיום עדיין</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed font-sans">
              היומן פנוי לקבלת לקוחות. תורים שיוזמנו דרך האתר או שתוסיף ידנית יופיעו כאן בזמן אמת.
            </p>
            <Link
              href={slug === 'dvir' ? '/booking' : `/${slug}/booking`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>קבע תור חדש להיום</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((app) => (
              <div
                key={app.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex flex-col items-center justify-center font-black shrink-0 shadow-xs">
                    <span className="text-sm leading-none" dir="ltr">{app.time}</span>
                    <span className="text-[10px] text-slate-500 font-normal mt-0.5">היום</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-slate-900">{app.customerName}</h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {app.service}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 font-sans">
                      <span dir="ltr">{app.customerPhone}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-900 font-mono">{formatPrice(app.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick WhatsApp Reminder */}
                <div className="flex items-center gap-2 mr-auto sm:mr-0">
                  <a
                    href={`https://wa.me/972${app.customerPhone.replace(/\D/g, '').slice(1)}?text=${encodeURIComponent(`היי ${app.customerName}, מזכיר/ה לך את התור שלך היום ב-${app.time} ב-${bizName} 🌟 נתראה!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold py-2 px-3.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>תזכורת WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setAppointments(appointments.filter((a) => a.id !== app.id))}
                    className="text-xs font-bold text-rose-500 hover:bg-rose-50 p-2 rounded-xl border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                    title="בטל תור"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
