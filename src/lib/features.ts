import { BusinessConfig } from '@/types/business';

export interface BusinessFeaturesConfig {
  enableWaitlist?: boolean;           // רשימת המתנה חכמה
  enableWhatsAppReminders?: boolean;  // תזכורות אוטומטיות בוואטסאפ
  enableProductAddons?: boolean;      // תוספות שירות / מוצרים נלווים
  enableReviewsCollection?: boolean;  // איסוף ביקורות אוטומטי
  enableMultiStaff?: boolean;         // ניהול צוות ועמדות מרובות
  enableEmergencyClosure?: boolean;   // מודאל סגירת חירום וביטול מרוכז
  enableAdvancedAnalytics?: boolean;  // דוחות והכנסות מתקדמים
}

export type PlanType = 'starter' | 'pro' | 'enterprise';

export const PLAN_FEATURE_DEFAULTS: Record<PlanType, BusinessFeaturesConfig> = {
  starter: {
    enableWaitlist: false,
    enableWhatsAppReminders: true,
    enableProductAddons: false,
    enableReviewsCollection: true,
    enableMultiStaff: false,
    enableEmergencyClosure: false,
    enableAdvancedAnalytics: false,
  },
  pro: {
    enableWaitlist: true,
    enableWhatsAppReminders: true,
    enableProductAddons: true,
    enableReviewsCollection: true,
    enableMultiStaff: false,
    enableEmergencyClosure: true,
    enableAdvancedAnalytics: true,
  },
  enterprise: {
    enableWaitlist: true,
    enableWhatsAppReminders: true,
    enableProductAddons: true,
    enableReviewsCollection: true,
    enableMultiStaff: true,
    enableEmergencyClosure: true,
    enableAdvancedAnalytics: true,
  },
};

/**
 * Checks if a specific feature is enabled for a given business
 */
export function isFeatureEnabled(
  business: Partial<BusinessConfig> | null | undefined,
  feature: keyof BusinessFeaturesConfig
): boolean {
  if (!business) return false;

  // 1. If explicit business feature override is set, respect it
  if (business.features && business.features[feature] !== undefined) {
    return Boolean(business.features[feature]);
  }

  // 2. Otherwise, fallback to the plan default
  const plan = (business.plan as PlanType) || 'pro';
  const planDefaults = PLAN_FEATURE_DEFAULTS[plan] || PLAN_FEATURE_DEFAULTS.pro;
  return Boolean(planDefaults[feature]);
}
