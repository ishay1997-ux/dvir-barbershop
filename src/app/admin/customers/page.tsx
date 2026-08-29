'use client';

import { useState } from 'react';
import {
  Search,
  Phone,
  Calendar,
  Sparkles,
  AlertTriangle,
  Send,
  Crown,
  Scissors,
  Save,
  MapPin,
  Clock,
  Plus,
  X,
  History,
  CheckCircle2,
  TrendingUp,
  User,
  Coffee,
} from 'lucide-react';
import { useShopStore } from '@/lib/store';
import type { Customer } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

const getCustomerHistory = (customer: Customer) => {
  if (!customer.lastVisit) return [];
  const d = new Date(customer.lastVisit);
  return [
    {
      id: 'h1',
      date: isNaN(d.getTime()) ? customer.lastVisit : d.toLocaleDateString('he-IL'),
      time: isNaN(d.getTime()) ? '' : d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      service: 'תספורת גברים',
      branch: customer.favoriteBranchId === 'rehovot' ? 'סניף רחובות' : 'סניף אריאל',
      price: 80,
      status: 'הושלם',
    },
  ];
};

type ProcessedCustomer = Customer & {
  daysSinceVisit: number;
  calculatedStatus: Customer['status'];
};

export default function CustomersPage() {
  const { customers, settings, saveCustomers } = useShopStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'at_risk' | 'vip' | 'active'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<ProcessedCustomer | null>(null);
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers);
  const [savedNotice, setSavedNotice] = useState(false);

  // Editable customer modal state
  const [editSpecs, setEditSpecs] = useState({
    machineNumber: '',
    fadeType: '',
    notes: '',
  });

  // Calculate retention status dynamically
  const now = Date.now();
  const processedCustomers = localCustomers.map((c) => {
    const daysSinceVisit = Math.floor((now - new Date(c.lastVisit).getTime()) / 86400000);
    let status: Customer['status'] = 'active';
    if (c.totalVisits >= 6 && daysSinceVisit <= 21) {
      status = 'vip';
    } else if (daysSinceVisit >= 30) {
      status = 'at_risk';
    }
    return { ...c, daysSinceVisit, calculatedStatus: status };
  });

  const atRiskCount = processedCustomers.filter((c) => c.calculatedStatus === 'at_risk').length;
  const vipCount = processedCustomers.filter((c) => c.calculatedStatus === 'vip').length;

  const filtered = processedCustomers.filter((c) => {
    const matchesSearch =
      c.name.includes(search) ||
      c.phone.includes(search) ||
      (c.preferences?.notes && c.preferences.notes.toLowerCase().includes(search.toLowerCase())) ||
      (c.preferences?.machineNumber && c.preferences.machineNumber.includes(search));

    if (!matchesSearch) return false;
    if (filterType === 'at_risk') return c.calculatedStatus === 'at_risk';
    if (filterType === 'vip') return c.calculatedStatus === 'vip';
    if (filterType === 'active') return c.calculatedStatus === 'active';
    return true;
  });

  const openCustomerModal = (customer: ProcessedCustomer) => {
    setSelectedCustomer(customer);
    setEditSpecs({
      machineNumber: customer.preferences?.machineNumber || '',
      fadeType: customer.preferences?.fadeType || '',
      notes: customer.preferences?.notes || '',
    });
  };

  const handleSaveSpecs = () => {
    if (!selectedCustomer) return;
    const updated = localCustomers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          preferences: {
            ...c.preferences,
            machineNumber: editSpecs.machineNumber,
            fadeType: editSpecs.fadeType,
            notes: editSpecs.notes,
          },
        };
      }
      return c;
    });
    setLocalCustomers(updated);
    saveCustomers(updated);
    setSelectedCustomer({
      ...selectedCustomer,
      preferences: {
        ...selectedCustomer.preferences,
        machineNumber: editSpecs.machineNumber,
        fadeType: editSpecs.fadeType,
        notes: editSpecs.notes,
      },
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const generateRetentionWhatsAppUrl = (customer: Customer) => {
    const template =
      settings.retentionMessageTemplate ||
      'היי {name}, מה קורה? עבר כבר מעל חודש מאז התספורת הקודמת שלך במספרה של דביר ✂️ רוצה שאשריין לך תור להשבוע?';
    const message = template.replace('{name}', customer.name);
    const cleanPhone = customer.phone.replace(/\D/g, '').replace(/^0/, '972');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C]">מאגר לקוחות וכרטיס לקוח 360 (Smart CRM)</h1>
          <p className="text-[#6B6560] text-sm mt-0.5">
            היסטוריית תספורות מלאה, מפרט טכני לכל לקוח ושימור לקוחות בוואטסאפ
          </p>
        </div>

        <Link
          href="/booking"
          className="btn-shimmer text-xs font-black text-[#1C1C1C] py-2.5 px-4 rounded-xl flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          הוסף לקוח חדש / תור
        </Link>
      </div>

      {/* Retention Alert Banner (When there are dormant customers) */}
      {atRiskCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/40 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#1C1C1C]">
                זוהו {atRiskCount} לקוחות שלא הסתפרו מעל 30 יום!
              </h2>
              <p className="text-xs text-[#6B6560] mt-0.5">
                אל תיתן להם ללכת למספרה אחרת. לחיצה אחת שולחת להם הודעת שימור אישית בוואטסאפ.
              </p>
            </div>
          </div>

          <button
            onClick={() => setFilterType('at_risk')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            הצג לקוחות לשימור מיידי ←
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-sm">
          <span className="text-xs text-[#6B6560] font-bold">סך לקוחות פעילים</span>
          <div className="text-2xl font-black text-[#1C1C1C] mt-1">{processedCustomers.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-sm">
          <span className="text-xs text-[#6B6560] font-bold">לקוחות VIP קבועים (👑)</span>
          <div className="text-2xl font-black text-gold mt-1">{vipCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-sm">
          <span className="text-xs text-[#6B6560] font-bold">לקוחות לשימור (מעל 30 יום)</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{atRiskCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-sm">
          <span className="text-xs text-[#6B6560] font-bold">ממוצע תספורות ללקוח</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {(
              processedCustomers.reduce((acc, c) => acc + c.totalVisits, 0) /
              (processedCustomers.length || 1)
            ).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-[#E5DDD0] p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9891]" />
          <input
            type="text"
            placeholder="חפש לפי שם, טלפון או מספר מכונה..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-9 py-2 rounded-xl border border-[#E5DDD0] bg-[#FAF7F2] text-xs outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#1C1C1C] text-gold'
                : 'bg-[#FAF7F2] text-[#6B6560] hover:bg-[#F0EBE1]'
            }`}
          >
            כל הלקוחות ({processedCustomers.length})
          </button>

          <button
            onClick={() => setFilterType('at_risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterType === 'at_risk'
                ? 'bg-amber-600 text-white'
                : 'bg-[#FAF7F2] text-amber-800 hover:bg-amber-50'
            }`}
          >
            לשימור דחוף ({atRiskCount})
          </button>

          <button
            onClick={() => setFilterType('vip')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterType === 'vip'
                ? 'bg-gold text-[#1C1C1C]'
                : 'bg-[#FAF7F2] text-[#6B6560] hover:bg-[#F0EBE1]'
            }`}
          >
            לקוחות VIP 👑 ({vipCount})
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            onClick={() => openCustomerModal(customer)}
            className="bg-white hover:bg-[#FAF7F2]/60 rounded-2xl border border-[#E5DDD0] hover:border-gold/60 p-4 sm:p-5 transition-all cursor-pointer shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1C1C] text-gold flex items-center justify-center text-lg font-black flex-shrink-0 shadow-sm">
                {customer.name.slice(0, 1)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base text-[#1C1C1C]">{customer.name}</h3>
                  {customer.calculatedStatus === 'vip' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-amber-800 border border-gold/40 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-gold fill-gold" /> VIP
                    </span>
                  )}
                  {customer.calculatedStatus === 'at_risk' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                      לא הסתפר {customer.daysSinceVisit} ימים
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B6560] mt-1">
                  <span dir="ltr">{customer.phone}</span>
                  <span>•</span>
                  <span>סך הכל {customer.totalVisits} תספורות</span>
                  <span>•</span>
                  <span className="font-bold text-[#1C1C1C]">{formatPrice(customer.totalSpent)}</span>
                  {customer.preferences?.machineNumber && (
                    <>
                      <span>•</span>
                      <span className="text-gold font-bold">✂️ {customer.preferences.machineNumber}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
              <a
                href={generateRetentionWhatsAppUrl(customer)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                וואטסאפ
              </a>

              <button
                onClick={() => openCustomerModal(customer)}
                className="btn-shimmer text-xs font-bold text-[#1C1C1C] py-2 px-3 rounded-xl shadow-sm"
              >
                פתח כרטיס לקוח 360 ←
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* 360° CUSTOMER PROFILE MODAL                                  */}
      {/* ============================================================ */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E5DDD0] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8" dir="rtl">
            {/* Close */}
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute left-6 top-6 p-2 rounded-full hover:bg-zinc-100 text-[#6B6560] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#F0EBE1] mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] text-gold text-2xl font-black flex items-center justify-center shadow-md">
                {selectedCustomer.name.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-[#1C1C1C]">{selectedCustomer.name}</h2>
                  {selectedCustomer.calculatedStatus === 'vip' && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold/20 text-amber-800 border border-gold">
                      👑 לקוח VIP
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#6B6560] mt-1 flex items-center gap-3">
                  <span dir="ltr" className="font-bold text-[#1C1C1C]">{selectedCustomer.phone}</span>
                  <span>•</span>
                  <span>ביקור אחרון: לפני {selectedCustomer.daysSinceVisit} ימים</span>
                </div>
              </div>
            </div>

            {/* Customer Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#FAF7F2] p-3 rounded-2xl text-center border border-[#E5DDD0]">
                <span className="text-[11px] text-[#9E9891]">סה״כ תספורות</span>
                <div className="text-lg font-black text-[#1C1C1C]">{selectedCustomer.totalVisits}</div>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl text-center border border-[#E5DDD0]">
                <span className="text-[11px] text-[#9E9891]">סה״כ הכנסות</span>
                <div className="text-lg font-black text-emerald-600">{formatPrice(selectedCustomer.totalSpent)}</div>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl text-center border border-[#E5DDD0]">
                <span className="text-[11px] text-[#9E9891]">סניף מועדף</span>
                <div className="text-xs font-black text-[#1C1C1C] mt-1">סניף אריאל</div>
              </div>
            </div>

            {/* Section 1: Haircut Technical Specs (מפרט תספורת שמור) */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E5DDD0] mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-gold" />
                  <h3 className="font-black text-sm text-[#1C1C1C]">מפרט תספורת והעדפות שמורות (דביר)</h3>
                </div>
                {savedNotice && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> נשמר בהצלחה!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                    מספרי מכונה (צדדים / למעלה):
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: 0.5 בצדדים, 3 למעלה"
                    value={editSpecs.machineNumber}
                    onChange={(e) => setEditSpecs({ ...editSpecs, machineNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5DDD0] text-xs outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                    סגנון דירוג / פייד:
                  </label>
                  <input
                    type="text"
                    placeholder="למשל: Low Skin Fade, מספריים"
                    value={editSpecs.fadeType}
                    onChange={(e) => setEditSpecs({ ...editSpecs, fadeType: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5DDD0] text-xs outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6560] mb-1">
                  הערות אישיות של הספר (רגישויות, סגנון, שתייה):
                </label>
                <textarea
                  rows={2}
                  placeholder="למשל: עורף רגיש, מעדיף חימר מט, שותה קפה שחור"
                  value={editSpecs.notes}
                  onChange={(e) => setEditSpecs({ ...editSpecs, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5DDD0] text-xs outline-none focus:border-gold leading-relaxed"
                />
              </div>

              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSaveSpecs}
                  className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C1C1C]"
                >
                  <Save className="w-3.5 h-3.5" />
                  שמור מפרט לקוח
                </button>
              </div>
            </div>

            {/* Section 2: Full Appointment History Log */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-gold" />
                <h3 className="font-black text-sm text-[#1C1C1C]">היסטוריית תורים וביקורים קודמים</h3>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5DDD0] overflow-hidden divide-y divide-[#F0EBE1]">
                {getCustomerHistory(selectedCustomer).length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#9E9891]">
                    אין היסטוריית תורים קודמת שנשמרה ללקוח זה עדיין
                  </div>
                ) : (
                  getCustomerHistory(selectedCustomer).map((history) => (
                    <div key={history.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#1C1C1C]">{history.service}</div>
                        <div className="text-[11px] text-[#9E9891] mt-0.5 flex items-center gap-2">
                          <span>{history.date} {history.time ? `בשעה ${history.time}` : ''}</span>
                          <span>•</span>
                          <span>{history.branch}</span>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="font-bold text-[#1C1C1C]">{formatPrice(history.price)}</div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {history.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center gap-3 pt-6 border-t border-[#F0EBE1] mt-6">
              <a
                href={generateRetentionWhatsAppUrl(selectedCustomer)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                שלח הודעת WhatsApp
              </a>

              <Link
                href="/booking"
                className="flex-1 btn-shimmer py-3 text-[#1C1C1C] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                קבע תור חדש ללקוח
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
