'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Calendar,
  ShieldCheck,
  Zap,
  Users,
  Layers,
  ArrowUpRight,
  Clock,
  ChevronLeft,
  X,
  Send,
} from 'lucide-react';
import { useToast } from '@/components/common/ToastProvider';

interface BillingSettingsTabProps {
  business: any;
  onUpdateBusiness: (updated: any) => Promise<void> | void;
}

export const BillingSettingsTab: React.FC<BillingSettingsTabProps> = ({
  business,
  onUpdateBusiness,
}) => {
  const { success, error, info, showConfirm } = useToast();

  const currentPlanId = (business?.plan || 'starter') as 'starter' | 'pro' | 'team';
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<'starter' | 'pro' | 'team'>(
    currentPlanId === 'starter' ? 'pro' : 'team'
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Simulated Invoices
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-891',
      date: '01/08/2026',
      description: `מנוי CutWeb ${currentPlanId.toUpperCase()} (${billingCycle === 'monthly' ? 'חודשי' : 'שנתי'})`,
      amount: currentPlanId === 'team' ? '119 ₪' : currentPlanId === 'pro' ? '59 ₪' : '0 ₪',
      status: 'שולם',
      pdfUrl: '#',
    },
    {
      id: 'INV-2026-754',
      date: '01/07/2026',
      description: `מנוי CutWeb ${currentPlanId.toUpperCase()}`,
      amount: currentPlanId === 'team' ? '119 ₪' : currentPlanId === 'pro' ? '59 ₪' : '0 ₪',
      status: 'שולם',
      pdfUrl: '#',
    },
  ]);

  const plansConfig = {
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
      name: 'Team (צוות וכיסאות)',
      badge: 'למספרות וקליניקות',
      priceMonthly: '119 ₪',
      priceAnnual: '990 ₪',
      appointmentsLimit: 'ללא הגבלה',
      staffLimit: 5,
      hasBranding: false,
      customDomain: true,
      color: '#059669',
      features: [
        'עד 5 אנשי צוות / כיסאות',
        'יומן אישי לכל עובד',
        'הרשאות גישה אישיות לכל איש צוות',
        'רשימת המתנה חכמה (Waitlist)',
        'דוח הכנסות וביצועים לפי עובד',
        'הסרת מיתוג וחיבור דומיין אישי',
      ],
    },
  };

  const currentPlan = plansConfig[currentPlanId] || plansConfig.starter;

  // Handle Plan Upgrade / Switch
  const handleConfirmPlanChange = async () => {
    setIsProcessingPayment(true);
    try {
      // Simulate Payment & Firestore Update
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const updated = {
        ...business,
        plan: selectedUpgradePlan,
        subscriptionStatus: 'active',
        subscriptionUpdatedAt: new Date().toISOString(),
        billingCycle,
      };

      await onUpdateBusiness(updated);

      // Add new invoice to list
      const newInvoice = {
        id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toLocaleDateString('he-IL'),
        description: `שדרוג מנוי CutWeb ${selectedUpgradePlan.toUpperCase()} (${
          billingCycle === 'monthly' ? 'חודשי' : 'שנתי'
        })`,
        amount:
          selectedUpgradePlan === 'team'
            ? billingCycle === 'monthly'
              ? '119 ₪'
              : '990 ₪'
            : selectedUpgradePlan === 'pro'
            ? billingCycle === 'monthly'
              ? '59 ₪'
              : '490 ₪'
            : '0 ₪',
        status: 'שולם',
        pdfUrl: '#',
      };

      setInvoices((prev) => [newInvoice, ...prev]);
      setIsUpgradeModalOpen(false);
      success('המסלול עודכן בהצלחה!', `העסק שלך פועל כעת תחת מסלול ${selectedUpgradePlan.toUpperCase()}`);
    } catch (err: any) {
      error('שגיאה בעדכון המסלול', err?.message || 'אנא נסה שוב');
    } finally {
      setIsProcessingPayment(false);
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
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-black shadow-xs">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">{currentPlan.name}</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>מנוי פעיל</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                החידוש הבא: 1 באוקטובר 2026 · חיוב חודשי אוטומטי
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>שדרוג / שינוי מסלול</span>
            </button>

            {currentPlanId !== 'starter' && (
              <button
                type="button"
                onClick={handleCancelSubscription}
                className="px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                ביטול / הנמכה
              </button>
            )}
          </div>
        </div>

        {/* Usage & Feature Limits Meter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>תורים החודש</span>
              </span>
              <span className="font-mono font-black text-slate-900">
                {currentPlanId === 'starter' ? '14 / 35' : '142 (ללא הגבלה)'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: currentPlanId === 'starter' ? '40%' : '100%' }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {currentPlanId === 'starter' ? 'נותרו 21 תורים לפיילוט החודש' : 'מסלול ללא הגבלת תורים'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>אנשי צוות ויומנים</span>
              </span>
              <span className="font-mono font-black text-slate-900">
                {currentPlanId === 'team' ? '2 מתוך 5' : '1 מתוך 1'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: currentPlanId === 'team' ? '40%' : '100%' }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {currentPlanId === 'team' ? 'ניתן להוסיף עוד 3 עובדים' : 'יומן אישי לעובד יחיד'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>הסרת מיתוג CutWeb</span>
              </span>
              <span className="text-xs font-bold text-slate-900">
                {currentPlanId === 'starter' ? 'כולל מיתוג' : 'הוסר בהצלחה ✓'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: currentPlanId === 'starter' ? '0%' : '100%' }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {currentPlanId === 'starter' ? 'שדרג ל-Pro להסרת מיתוג' : 'אתר לבן מותאם אישית'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Invoices & Billing History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">היסטוריית חיובים וחשבוניות מס</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              חשבוניות מס-קבלה חתומות דיגיטלית המוכרות לצורכי מס בישראל
            </p>
          </div>
          <span className="text-xs text-slate-400 font-bold">סליקה מאובטחת</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-3 px-3">מספר חשבונית</th>
                <th className="py-3 px-3">תאריך</th>
                <th className="py-3 px-3">פירוט</th>
                <th className="py-3 px-3">סכום</th>
                <th className="py-3 px-3">סטטוס</th>
                <th className="py-3 px-3 text-left">מסמך</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.id}</td>
                  <td className="py-3 px-3 text-slate-600">{inv.date}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{inv.description}</td>
                  <td className="py-3 px-3 font-mono font-black text-slate-900">{inv.amount}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      {inv.status} ✓
                    </span>
                  </td>
                  <td className="py-3 px-3 text-left">
                    <button
                      type="button"
                      onClick={() => info('הורדת חשבונית', `חשבונית ${inv.id} נשלחה גם למייל שלך.`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="הורדת PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Interactive Upgrade / Change Plan Modal */}
      {isUpgradeModalOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="absolute inset-0" onClick={() => setIsUpgradeModalOpen(false)} />

          <div className="relative max-w-2xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 my-auto text-right overflow-hidden transition-all text-slate-900">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-l from-indigo-50 via-white to-white border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">שדרוג והתאמת חבילת המנוי</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  בחרו את המסלול המתאים לקצב הפעילות של העסק שלכם
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Billing Cycle Switcher */}
              <div className="flex items-center justify-center">
                <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    חיוב חודשי
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>חיוב שנתי</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-black">
                      חודשיים חינם 🎁
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['starter', 'pro', 'team'] as const).map((pKey) => {
                  const p = plansConfig[pKey];
                  const isSelected = selectedUpgradePlan === pKey;
                  const isCurrent = currentPlanId === pKey;

                  return (
                    <div
                      key={pKey}
                      onClick={() => setSelectedUpgradePlan(pKey)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">{p.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              נוכחי
                            </span>
                          )}
                        </div>

                        <div className="text-xl font-black text-slate-900">
                          {billingCycle === 'monthly' ? p.priceMonthly : p.priceAnnual}
                          <span className="text-[11px] text-slate-500 font-normal">
                            /{billingCycle === 'monthly' ? 'חודש' : 'שנה'}
                          </span>
                        </div>

                        <ul className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                          {p.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isCurrent ? 'המסלול שלך' : isSelected ? 'נבחר לשדרוג' : 'בחר מסלול'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700">סליקה מאובטחת</span> · חשבונית מס תישלח אוטומטית למייל
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                  >
                    ביטול
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmPlanChange}
                    disabled={isProcessingPayment || selectedUpgradePlan === currentPlanId}
                    className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessingPayment ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>
                      {selectedUpgradePlan === currentPlanId
                        ? 'זהו המסלול הפעיל'
                        : `אישור שדרוג ל-${selectedUpgradePlan.toUpperCase()}`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
