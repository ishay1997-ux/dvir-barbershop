'use client';

import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useShopStore } from '@/lib/store';
import type { Customer } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/components/common/ToastProvider';
import { getIndustryTerminology } from '@/lib/industry-terminology';

// Subcomponents
import type { ProcessedCustomer, CustomerHistoryItem } from '@/components/admin/customers/types';
import { CustomerStatsKPI } from '@/components/admin/customers/CustomerStatsKPI';
import { CustomerListCard } from '@/components/admin/customers/CustomerListCard';
import { CustomerDetailDrawer } from '@/components/admin/customers/CustomerDetailDrawer';

const getCustomerHistory = (customer: Customer): CustomerHistoryItem[] => {
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

export default function CustomersPage() {
  const { customers, settings, saveCustomers } = useShopStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'at_risk' | 'vip' | 'active'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<ProcessedCustomer | null>(null);
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    async function loadLiveCustomers() {
      try {
        let deletedPhones: string[] = [];
        if (typeof window !== 'undefined') {
          const storedDeleted = localStorage.getItem('thecut_deleted_customers');
          if (storedDeleted) {
            try {
              deletedPhones = JSON.parse(storedDeleted);
            } catch {}
          }
        }

        const isDeleted = (p: string) => {
          const digits = String(p || '').replace(/\D/g, '');
          const last9 = digits.slice(-9);
          return (
            deletedPhones.includes(digits) ||
            deletedPhones.includes(last9) ||
            (last9 && deletedPhones.some((dp) => dp.endsWith(last9) || last9.endsWith(dp)))
          );
        };

        const res = await fetch('/api/appointments');
        if (res.ok) {
          const data = await res.json();
          if (data.appointments && Array.isArray(data.appointments)) {
            const map = new Map<string, Customer>();

            // Add existing local customers first (excluding deleted)
            localCustomers.forEach((c) => {
              const cleanP = c.phone.replace(/\D/g, '');
              const last9 = cleanP.slice(-9);
              if (!isDeleted(c.phone)) {
                map.set(last9 || cleanP, c);
              }
            });

            // Merge newly booked appointments (excluding deleted)
            data.appointments.forEach((apt: any) => {
              const phoneRaw = apt.customerPhone || apt.phone || apt.cleanPhone || '';
              const cleanP = String(phoneRaw).replace(/\D/g, '');
              const last9 = cleanP.slice(-9);

              if (cleanP && !isDeleted(phoneRaw)) {
                const key = last9 || cleanP;
                if (!map.has(key)) {
                  map.set(key, {
                    id: `c-live-${key}`,
                    name: apt.customerName || 'לקוח חדש',
                    phone: apt.customerPhone || apt.phone || cleanP,
                    lastVisit: apt.date || new Date().toISOString(),
                    totalVisits: 1,
                    totalSpent: Number(apt.servicePrice || apt.price || 80),
                    favoriteBranchId: (apt.branchId as any) || 'ariel',
                    status: 'active',
                    preferences: { notes: `הוזמן תור ב-${apt.date} ${apt.time}` },
                  });
                }
              }
            });

            const merged = Array.from(map.values());
            setLocalCustomers(merged);
          }
        }
      } catch (err) {
        console.error('Error loading live customer visits:', err);
      }
    }

    loadLiveCustomers();
  }, []);

  // Editable customer modal state
  const [editSpecs, setEditSpecs] = useState({
    machineNumber: '',
    fadeType: '',
    beard: '',
    beverage: '',
    notes: '',
  });

  // Calculate retention status dynamically
  const now = Date.now();
  const processedCustomers: ProcessedCustomer[] = localCustomers.map((c) => {
    const daysSinceVisit = Math.floor((now - new Date(c.lastVisit).getTime()) / 86400000);
    let status: Customer['status'] = 'active';
    if (c.totalVisits >= 6 && daysSinceVisit <= 21) {
      status = 'vip';
    } else if (daysSinceVisit >= 25) {
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
      (c.preferences?.machineNumber && c.preferences.machineNumber.includes(search)) ||
      (c.haircutFormula?.sides && c.haircutFormula.sides.includes(search));

    if (!matchesSearch) return false;
    if (filterType === 'at_risk') return c.calculatedStatus === 'at_risk';
    if (filterType === 'vip') return c.calculatedStatus === 'vip';
    if (filterType === 'active') return c.calculatedStatus === 'active';
    return true;
  });

  const openCustomerModal = (customer: ProcessedCustomer) => {
    setSelectedCustomer(customer);
    setEditSpecs({
      machineNumber: customer.haircutFormula?.sides || customer.preferences?.machineNumber || '',
      fadeType: customer.haircutFormula?.top || customer.preferences?.fadeType || '',
      beard: customer.haircutFormula?.beard || customer.preferences?.beardStyle || '',
      beverage: customer.haircutFormula?.beverage || '',
      notes: customer.haircutFormula?.notes || customer.preferences?.notes || '',
    });
  };

  const handleSaveSpecs = () => {
    if (!selectedCustomer) return;
    const formulaPayload = {
      sides: editSpecs.machineNumber,
      top: editSpecs.fadeType,
      beard: editSpecs.beard,
      beverage: editSpecs.beverage,
      notes: editSpecs.notes,
      updatedAt: new Date().toISOString(),
    };

    const updated = localCustomers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          haircutFormula: formulaPayload,
          preferences: {
            ...c.preferences,
            machineNumber: editSpecs.machineNumber,
            fadeType: editSpecs.fadeType,
            beardStyle: editSpecs.beard,
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
      haircutFormula: formulaPayload,
      preferences: {
        ...selectedCustomer.preferences,
        machineNumber: editSpecs.machineNumber,
        fadeType: editSpecs.fadeType,
        beardStyle: editSpecs.beard,
        notes: editSpecs.notes,
      },
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const { showConfirm, success, error } = useToast();

  const handleDeleteCustomer = (customer: Customer) => {
    showConfirm({
      title: 'מחיקת לקוח לצמיתות',
      message: `האם למחוק את הלקוח "${customer.name}" (${customer.phone}) ואת כל התורים שלו מהמערכת לצמיתות? פעולה זו אינה ניתנת לביטול.`,
      confirmText: 'כן, מחק לצמיתות',
      cancelText: 'ביטול',
      type: 'danger',
      onConfirm: async () => {
        try {
          const rawDigits = customer.phone.replace(/\D/g, '');
          const last9Digits = rawDigits.slice(-9);

          // 1. Add to permanent deleted list in localStorage
          if (typeof window !== 'undefined') {
            let deletedList: string[] = [];
            const stored = localStorage.getItem('thecut_deleted_customers');
            if (stored) {
              try {
                deletedList = JSON.parse(stored);
              } catch {}
            }
            if (!deletedList.includes(last9Digits)) {
              deletedList.push(last9Digits);
              if (rawDigits && !deletedList.includes(rawDigits)) {
                deletedList.push(rawDigits);
              }
              localStorage.setItem('thecut_deleted_customers', JSON.stringify(deletedList));
            }

            // Remove from customer appointments cache
            const aptStored = localStorage.getItem('thecut_customer_appointments_v3');
            if (aptStored) {
              try {
                const parsed = JSON.parse(aptStored);
                const filteredApts = parsed.filter((a: any) => {
                  const p = String(a.customerPhone || a.phone || '').replace(/\D/g, '');
                  return !p.endsWith(last9Digits);
                });
                localStorage.setItem('thecut_customer_appointments_v3', JSON.stringify(filteredApts));
              } catch {}
            }
          }

          // 2. Delete all appointments and customer from Firestore API
          await fetch(`/api/appointments?phone=${encodeURIComponent(customer.phone)}`, {
            method: 'DELETE',
          });

          // 3. Remove from local state
          const updated = localCustomers.filter((c) => {
            const p = c.phone.replace(/\D/g, '');
            return !p.endsWith(last9Digits) && p !== rawDigits;
          });
          setLocalCustomers(updated);
          saveCustomers(updated);
          setSelectedCustomer(null);
          success('הלקוח נמחק בהצלחה', `הלקוח ${customer.name} וכל התורים שלו הוסרו לצמיתות`);
        } catch (err) {
          console.error('Failed to delete customer:', err);
          error('שגיאה במחיקת הלקוח', 'לא ניתן היה להשלים את הפעולה, אנא נסה שוב.');
        }
      },
    });
  };

  const terminology = getIndustryTerminology({
    name: settings.shopName,
    shopName: settings.shopName,
    category: settings.category,
    themeColor: settings.themeColor,
  });
  const bizName = settings.shopName || 'העסק';

  const generateRetentionWhatsAppUrl = (customer: Customer) => {
    const template =
      settings.retentionMessageTemplate ||
      terminology.whatsappRetentionTemplate ||
      `היי {name}, מה קורה? עבר כבר זמן מאז הטיפול הקודם שלך ב-${bizName} 🌟 רוצה שאשריין לך תור להשבוע?`;
    const message = template.replace('{name}', customer.name);
    const cleanPhone = customer.phone.replace(/\D/g, '').replace(/^0/, '972');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            מאגר לקוחות וכרטיס 360 (Smart CRM)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-sans">
            היסטוריית ביקורים מלאה, מפרט טכני לכל לקוח ותזכורות שימור בוואטסאפ
          </p>
        </div>

        <Link
          href="/booking"
          className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 py-2.5 px-4 rounded-xl flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-indigo-600/30 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף לקוח / תור חדש</span>
        </Link>
      </div>

      {/* KPI Stats & Retention Alert */}
      <CustomerStatsKPI
        processedCustomers={processedCustomers}
        atRiskCount={atRiskCount}
        vipCount={vipCount}
        onFilterAtRisk={() => setFilterType('at_risk')}
      />

      {/* Filters & Search */}
      <div className="bg-[#111420] rounded-2xl border border-slate-800/80 p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="חפש לפי שם, טלפון או הערות..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/80 hover:bg-slate-700 hover:text-white'
            }`}
          >
            כל הלקוחות ({processedCustomers.length})
          </button>

          <button
            onClick={() => setFilterType('at_risk')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'at_risk'
                ? 'bg-rose-600 text-white font-black shadow-md shadow-rose-600/30'
                : 'bg-rose-950/30 text-rose-300 border border-rose-500/30 hover:bg-rose-900/40'
            }`}
          >
            לשימור דחוף ({atRiskCount})
          </button>

          <button
            onClick={() => setFilterType('vip')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'vip'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            לקוחות VIP 👑 ({vipCount})
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((customer) => (
          <CustomerListCard
            key={customer.id}
            customer={customer}
            retentionUrl={generateRetentionWhatsAppUrl(customer)}
            onOpenModal={openCustomerModal}
            onDelete={handleDeleteCustomer}
          />
        ))}
      </div>

      {/* 360° Customer Detail Drawer / Modal */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        editSpecs={editSpecs}
        savedNotice={savedNotice}
        history={selectedCustomer ? getCustomerHistory(selectedCustomer) : []}
        retentionUrl={selectedCustomer ? generateRetentionWhatsAppUrl(selectedCustomer) : ''}
        onChangeSpecs={setEditSpecs}
        onSaveSpecs={handleSaveSpecs}
        onDeleteCustomer={handleDeleteCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
