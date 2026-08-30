'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Layers,
  ArrowUpRight,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';
import { InvoicesHistoryTable, InvoiceItem } from '@/components/admin/settings/billing/InvoicesHistoryTable';
import { PlanUpgradeModal, PlanConfig } from '@/components/admin/settings/billing/PlanUpgradeModal';

interface BillingSettingsTabProps {
  business: any;
  onUpdateBusiness: (updated: any) => Promise<void> | void;
}

const plansConfig: Record<'starter' | 'pro' | 'team', PlanConfig> = {
  starter: {
    name: 'Starter (חינמי)',
    badge: 'מסלול בסיסי',
    priceMonthly: '0 ₪',
    priceAnnual: '0 ₪',
    appointmentsLimit: 35,
    staffLimit: 1,
    hasBranding: true,
    customDomain: false,
    color: '#64748B',
    features: [
      'עד 35 תורים בחודש',
      'איש צוות יחיד',
      'סאב-דומיין CutWeb',
      'תזכורות WhatsApp בלחיצה',
      'מיתוג CutWeb בתחתית האתר',
    ],
  },
  pro: {
    name: 'Pro (עצמאי)',
    badge: 'הכי פופולרי ✨',
    priceMonthly: '59 ₪',
    priceAnnual: '490 ₪',
    appointmentsLimit: 'ללא הגבלה',
    staffLimit: 1,
    hasBranding: false,
    customDomain: true,
    color: '#4F46E5',
    features: [
      'תורים ללא הגבלה',
      'הסרת מיתוג CutWeb',
      'חיבור דומיין אישי (.co.il)',
      'מיני-CRM והיסטוריית לקוחות',
      'איש צוות יחיד',
      'תמיכה בוואטסאפ בעדיפות גבוהה',
    ],
  },
  team: {
    name: 'Team (צוות וסניפים)',
    badge: 'למספרות וקליניקות',
    priceMonthly: '119 ₪',
    priceAnnual: '990 ₪',
    appointmentsLimit: 'ללא הגבלה',
    staffLimit: 5,
    hasBranding: false,
    customDomain: true,
    color: '#059669',
    features: [
      'כל מה שכלול ב-Pro',
      'עד 5 אנשי צוות עם יומנים נפרדים',
      'הרשאות גישה אישיות לכל עובד',
      'רשימת המתנה חכמה (Waitlist)',
      'דוחות הכנסה וביצועים לפי עובד',
      'תמיכה טלפונית וחיבור ייעודי',
    ],
  },
};

export const BillingSettingsTab: React.FC<BillingSettingsTabProps> = ({
  business,
  onUpdateBusiness,
}) => {
  const { success, error, info, showConfirm } = useToast();
  const currentPlanId = (business?.plan || 'starter') as 'starter' | 'pro' | 'team';
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Simulated Invoices
  const [invoices] = useState<InvoiceItem[]>([
    {
      id: 'INV-2026-891',
      date: '01/08/2026',
      description: `מנוי CutWeb ${currentPlanId.toUpperCase()}`,
      amount: currentPlanId === 'team' ? '119 ₪' : currentPlanId === 'pro' ? '59 ₪' : '0 ₪',
      status: 'שולם',
    },
    {
      id: 'INV-2026-754',
      date: '01/07/2026',
      description: `מנוי CutWeb ${currentPlanId.toUpperCase()}`,
      amount: currentPlanId === 'team' ? '119 ₪' : currentPlanId === 'pro' ? '59 ₪' : '0 ₪',
      status: 'שולם',
    },
  ]);

  const currentPlan = plansConfig[currentPlanId] || plansConfig.starter;
  const currentAppointmentsUsed = 14;
  const maxAppointments = currentPlan.appointmentsLimit;
  const currentStaffCount = business?.staff?.length || 1;
  const maxStaff = currentPlan.staffLimit;

  const handleConfirmPlanChange = async (
    newPlan: 'starter' | 'pro' | 'team',
    cycle: 'monthly' | 'annual'
  ) => {
    try {
      const updated = {
        ...business,
        plan: newPlan,
        billingCycle: cycle,
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date().toISOString(),
      };
      await onUpdateBusiness(updated);
      success(
        'המסלול עודכן בהצלחה! 🎉',
        `החשבון שודרג למסלול ${plansConfig[newPlan].name}. ההטבות פעילות כעת.`
      );
    } catch (err: any) {
      error('שגיאה בשדרוג', err.message || 'לא ניתן היה לעדכן את המנוי כעת.');
    }
  };

  const handleCancelSubscription = () => {
    showConfirm({
      title: 'הנמכת מנוי למסלול Starter',
      message:
        'האם אתה בטוח שברצונך להנמיך למסלול Starter החינמי? ההטבות של החבילה המשולמת ימשיכו לפעול עד סוף תקופת החיוב הנוכחית.',
      confirmText: 'כן, הנמך מנוי',
      cancelText: 'השאר חבילה פעילה',
      onConfirm: async () => {
        const updated = {
          ...business,
          plan: 'starter',
          subscriptionStatus: 'downgrade_scheduled',
        };
        await onUpdateBusiness(updated);
        info('בקשת ההנמכה נרשמה', 'החשבון יעבור למסלול Starter בסיום חודש הפעילות הנוכחי.');
      },
    });
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Top Active Subscription Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: currentPlan.color }}
            >
              {currentPlanId === 'team' ? (
                <Users className="w-7 h-7" />
              ) : currentPlanId === 'pro' ? (
                <Zap className="w-7 h-7" />
              ) : (
                <Sparkles className="w-7 h-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{currentPlan.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  מנוי פעיל
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentPlanId === 'starter'
                  ? 'מסלול חינמי בסיסי להתחלה ופיילוט'
                  : 'חידוש אוטומטי בהוראת קבע מאובטחת'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>שדרג / החלף מסלול</span>
            </button>

            {currentPlanId !== 'starter' && (
              <button
                type="button"
                onClick={handleCancelSubscription}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
              >
                הנמך מסלול
              </button>
            )}
          </div>
        </div>

        {/* Usage & Feature Limits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
              <span>תורים שנוצלו החודש</span>
              <span className="text-indigo-600 font-black">
                {currentAppointmentsUsed} / {maxAppointments === 'ללא הגבלה' ? '∞' : maxAppointments}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{
                  width:
                    maxAppointments === 'ללא הגבלה'
                      ? '25%'
                      : `${Math.min(100, (currentAppointmentsUsed / (maxAppointments as number)) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {maxAppointments === 'ללא הגבלה'
                ? 'תורים חופשיים ללא הגבלה'
                : `נותרו עוד ${(maxAppointments as number) - currentAppointmentsUsed} תורים החודש`}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
              <span>אנשי צוות ויומנים</span>
              <span className="text-indigo-600 font-black">
                {currentStaffCount} מתוך {maxStaff}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (currentStaffCount / maxStaff) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {maxStaff > 1
                ? `ניתן להוסיף עוד ${maxStaff - currentStaffCount} עובדים בצוות`
                : 'איש צוות יחיד (שדרגו ל-Team לצוות)'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
              <span>מיתוג המערכת (Watermark)</span>
              <span
                className={`font-black ${currentPlan.hasBranding ? 'text-amber-600' : 'text-emerald-600'}`}
              >
                {currentPlan.hasBranding ? 'פעיל (חינמי)' : 'הוסר לחלוטין ✓'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>{currentPlan.hasBranding ? 'שדרגו ל-Pro להסרת מיתוג' : 'אתר במיתוג 100% אישי שלך'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Invoices & Billing History Table */}
      <InvoicesHistoryTable invoices={invoices} />

      {/* 3. Interactive Upgrade / Change Plan Modal */}
      <PlanUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlanId={currentPlanId}
        plansConfig={plansConfig}
        onConfirmPlanChange={handleConfirmPlanChange}
      />
    </div>
  );
};
