'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

const today = startOfToday();
const currentDayIndex = today.getDay();

const INITIAL_TODAY_APPOINTMENTS = [
  { id: '1', time: '09:30', customerName: 'יונתן שפירא', customerPhone: '050-111-2233', service: 'תספורת גברים פרימיום', status: 'confirmed', price: 80 },
  { id: '2', time: '10:30', customerName: 'עומר אלוני', customerPhone: '052-333-4455', service: 'תספורת + פיסול זקן', status: 'confirmed', price: 120 },
  { id: '3', time: '11:30', customerName: 'איתי ברקוביץ', customerPhone: '054-555-6677', service: 'דירוג סקין פייד', status: 'confirmed', price: 80 },
  { id: '4', time: '13:00', customerName: 'מתן כהן', customerPhone: '053-777-8899', service: 'תספורת גברים', status: 'confirmed', price: 80 },
  { id: '5', time: '15:00', customerName: 'דניאל לוי', customerPhone: '052-999-8877', service: 'תספורת + זקן', status: 'pending', price: 120 },
  { id: '6', time: '16:30', customerName: 'רועי קדוש', customerPhone: '054-222-3344', service: 'טיפוח ופילינג', status: 'confirmed', price: 100 },
];

export default function AdminDashboard() {
  const { settings, branches } = useShopStore();
  const [appointments, setAppointments] = useState(INITIAL_TODAY_APPOINTMENTS);

  const todayLocationKey = settings.branchSchedule?.[currentDayIndex] || (currentDayIndex < 3 ? 'ariel' : currentDayIndex < 6 ? 'rehovot' : 'closed');
  const todayBranch = branches.find((b) => b.id === todayLocationKey);

  const totalRevenue = appointments
    .filter((a) => a.status === 'confirmed')
    .reduce((sum, a) => sum + a.price, 0);

  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto" dir="rtl">
      {/* Top Banner: Today's Location */}
      <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1C1C1C] text-white p-6 rounded-3xl border-2 border-gold/40 shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
            <MapPin className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">סטטוס סניף להיום</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              {todayLocationKey === 'closed'
                ? 'היום המספרה סגורה (יום חופש)'
                : `היום דביר מספר ב${todayBranch?.name || 'אריאל'}`}
            </h1>
            <p className="text-xs text-[#9E9891] mt-0.5">
              {format(today, 'EEEE, d בMMMM yyyy', { locale: he })} {todayBranch ? `· ${todayBranch.address}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Link
            href="/admin/settings"
            className="text-xs font-bold text-gold hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-gold/30 transition-colors"
          >
            שנה שיבוץ יומי
          </Link>
          <Link
            href="/booking"
            className="btn-shimmer text-xs font-black text-[#1C1C1C] px-4 py-2.5 rounded-xl shadow-md"
          >
            + קבע תור מהיר ללקוח
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DDD0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#6B6560] font-bold">תורים מתוזמנים להיום</span>
            <Calendar className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1C1C1C]">{appointments.length}</div>
          <div className="text-xs text-emerald-600 font-bold mt-1">{confirmedCount} מאושרים</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DDD0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#6B6560] font-bold">הכנסה יומית צפויה</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1C1C1C]">{formatPrice(totalRevenue)}</div>
          <div className="text-xs text-[#9E9891] mt-1">ממוצע {formatPrice(Math.round(totalRevenue / (appointments.length || 1)))} ללקוח</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DDD0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#6B6560] font-bold">הפסקת צהריים</span>
            <Coffee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#1C1C1C]" dir="ltr">
            {settings.lunchBreak?.isActive ? `${settings.lunchBreak.start} – ${settings.lunchBreak.end}` : 'ללא'}
          </div>
          <div className="text-xs text-[#9E9891] mt-1">חסום אוטומטית</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DDD0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#6B6560] font-bold">לקוחות לשימור (מעל 30 יום)</span>
            <Users className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600">3</div>
          <Link href="/admin/customers" className="text-xs text-gold font-bold hover:underline mt-1 block">
            שלח תזכורת WhatsApp ←
          </Link>
        </div>
      </div>

      {/* Today's Appointments List */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-[#F0EBE1] flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg text-[#1C1C1C]">רשימת התורים של דביר להיום</h2>
            <p className="text-xs text-[#6B6560]">כל התורים המוזמנים להיום עם אפשרות לשליחת תזכורת WhatsApp בלחיצה</p>
          </div>
          <Link href="/admin/appointments" className="text-xs font-bold text-gold hover:underline">
            פתח יומן שבועי מלא ←
          </Link>
        </div>

        <div className="divide-y divide-[#F0EBE1]">
          {appointments.map((app) => (
            <div key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] text-gold flex flex-col items-center justify-center font-black flex-shrink-0 shadow-sm">
                  <span className="text-sm leading-none" dir="ltr">{app.time}</span>
                  <span className="text-[10px] text-[#9E9891] font-normal mt-0.5">היום</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-[#1C1C1C]">{app.customerName}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {app.service}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B6560] mt-1 flex items-center gap-3">
                    <span dir="ltr">{app.customerPhone}</span>
                    <span>•</span>
                    <span className="font-bold text-[#1C1C1C]">{formatPrice(app.price)}</span>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Reminder */}
              <div className="flex items-center gap-2 mr-auto sm:mr-0">
                <a
                  href={`https://wa.me/972${app.customerPhone.replace(/\D/g, '').slice(1)}?text=${encodeURIComponent(`היי ${app.customerName}, מזכיר לך את התור שלך היום ב-${app.time} במספרה של דביר ✂️ נתראה!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold py-2 px-3.5 rounded-xl transition-colors active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  תזכורת WhatsApp
                </a>

                <button
                  onClick={() => setAppointments(appointments.filter((a) => a.id !== app.id))}
                  className="text-xs font-bold text-red-500 hover:bg-red-50 p-2 rounded-xl"
                  title="בטל תור"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
