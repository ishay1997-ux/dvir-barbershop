'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard } from 'lucide-react';

export interface PlanConfig {
  name: string;
  badge: string;
  priceMonthly: string;
  priceAnnual: string;
  appointmentsLimit: number | string;
  staffLimit: number;
  hasBranding: boolean;
  customDomain: boolean;
  color: string;
  features: string[];
}

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: 'starter' | 'pro' | 'team';
  plansConfig: Record<'starter' | 'pro' | 'team', PlanConfig>;
  onConfirmPlanChange: (
    newPlan: 'starter' | 'pro' | 'team',
    billingCycle: 'monthly' | 'annual'
  ) => Promise<void>;
}

export function PlanUpgradeModal({
  isOpen,
  onClose,
  currentPlanId,
  plansConfig,
  onConfirmPlanChange,
}: PlanUpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<'starter' | 'pro' | 'team'>(
    currentPlanId === 'starter' ? 'pro' : 'team'
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessingPayment(true);
    try {
      await onConfirmPlanChange(selectedUpgradePlan, billingCycle);
      onClose();
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose} />

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
            onClick={onClose}
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
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                ביטול
              </button>

              <button
                type="button"
                onClick={handleConfirm}
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
  );
}
