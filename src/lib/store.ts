'use client';

import { useState, useEffect } from 'react';
import type { Branch, Service, Barber, Customer, ShopSettings, BlockedDate, WorkingHours } from './types';

// ============================================================
// INITIAL SEED DATA FOR "המספרה של דביר"
// ============================================================

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'ariel',
    name: 'סניף אריאל – אוניברסיטת אריאל',
    city: 'אריאל',
    address: 'מתחם המעונות / קמפוס אוניברסיטת אריאל',
    shortDescription: 'תספורות לסטודנטים ולתושבי אריאל באווירה צעירה ודינמית',
    wazeUrl: 'https://waze.com/ul?q=Ariel+University',
    activeDays: [0, 1, 2], // Sun, Mon, Tue
    phone: '052-123-4567',
    isActive: true,
  },
  {
    id: 'rehovot',
    name: 'סניף רחובות – קליניקה פרטית',
    city: 'רחובות',
    address: 'רחוב הרצל 45, רחובות',
    shortDescription: 'אווירה ביתית, פרטית, מדויקת ומפנקת ברחובות',
    wazeUrl: 'https://waze.com/ul?q=Herzl+Rehovot',
    activeDays: [3, 4, 5], // Wed, Thu, Fri
    phone: '052-123-4567',
    isActive: true,
  },
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'תספורת גברים פרימיום',
    description: 'תספורת מותאמת אישית, דירוג מדויק (פייד), שטיפה ועיצוב בחומרים מובילים.',
    duration: 30,
    price: 80,
    category: 'haircut',
    icon: '✂️',
    isActive: true,
  },
  {
    id: '2',
    name: 'תספורת + פיסול ועיצוב זקן',
    description: 'הטיפול המושלם – שילוב תספורת מדויקת עם עיצוב זקן בתער ומגבת חמה.',
    duration: 45,
    price: 120,
    category: 'haircut',
    icon: '💈',
    isActive: true,
  },
  {
    id: '3',
    name: 'עיצוב ופיסול זקן בתער',
    description: 'דילול, יישור קווי לחיים וצוואר בתער חד ושמן הזנה יוקרתי לזקן.',
    duration: 20,
    price: 50,
    category: 'beard',
    icon: '🪒',
    isActive: true,
  },
  {
    id: '4',
    name: 'תספורת סטודנט / נוער',
    description: 'הנחת סטודנט מיוחדת באריאל וברחובות – סטייל צעיר ומעודכן.',
    duration: 25,
    price: 70,
    category: 'haircut',
    icon: '🎓',
    isActive: true,
  },
  {
    id: '5',
    name: 'טיפול פרימיום – מסכת פנים + גילוח מסורתי',
    description: 'פינוק מרגיע של פילינג, מגבות חמות, מסכת בוץ שחורה וגילוח יפני.',
    duration: 40,
    price: 100,
    category: 'treatment',
    icon: '🧖',
    isActive: true,
  },
  {
    id: '6',
    name: 'צבע וכיסוי שיבה טבעי',
    description: 'כיסוי שיבה מקצועי בגוון טבעי לשיער או לזקן ללא חומרים מזיקים.',
    duration: 35,
    price: 90,
    category: 'color',
    icon: '🎨',
    isActive: true,
  },
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'dvir',
    name: 'דביר',
    role: 'ספר ראשי ומנהל המספרה',
    bio: 'אמן תספורות ומומחה לפיידים מודרניים, עיצוב זקנים מדויק וחוויית שירות אישית.',
    photo_url: null,
    specialties: ['סקין פייד', 'פיסול זקן', 'עיצוב אישי', 'פרנץ קרופ'],
    color: '#C9A84C', // Gold
    phone: '052-123-4567',
    branchIds: ['ariel', 'rehovot'],
    is_active: true,
  },
  {
    id: 'barber2',
    name: 'אוראל',
    role: 'ספר בכיר',
    bio: 'מתמחה בטקסטורות עשירות, גזירות מספריים ודירוגים חדים.',
    photo_url: null,
    specialties: ['קלאסי', 'מספריים', 'זקנים'],
    color: '#3D3D3D',
    phone: '054-987-6543',
    branchIds: ['ariel'],
    is_active: true,
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'יונתן שפירא',
    phone: '050-111-2233',
    lastVisit: new Date(Date.now() - 42 * 86400000).toISOString(), // 42 days ago -> at risk!
    totalVisits: 8,
    totalSpent: 640,
    status: 'at_risk',
    favoriteBarberId: 'dvir',
    favoriteBranchId: 'ariel',
    preferences: {
      machineNumber: 'דירוג 0.5 בצדדים, 3 למעלה',
      fadeType: 'Low Skin Fade',
      notes: 'רגיש בעורף, אוהב מריחת חימר מט בסיום',
    },
  },
  {
    id: 'c2',
    name: 'עומר אלוני',
    phone: '052-333-4455',
    lastVisit: new Date(Date.now() - 35 * 86400000).toISOString(), // 35 days ago -> at risk!
    totalVisits: 5,
    totalSpent: 420,
    status: 'at_risk',
    favoriteBarberId: 'dvir',
    favoriteBranchId: 'rehovot',
    preferences: {
      machineNumber: '1 בצדדים, מספריים למעלה',
      fadeType: 'Mid Fade',
      notes: 'זקן קצר עם קווים חדים',
    },
  },
  {
    id: 'c3',
    name: 'איתי ברקוביץ',
    phone: '054-555-6677',
    lastVisit: new Date(Date.now() - 8 * 86400000).toISOString(), // 8 days ago -> VIP!
    totalVisits: 14,
    totalSpent: 1680,
    status: 'vip',
    favoriteBarberId: 'dvir',
    favoriteBranchId: 'ariel',
    preferences: {
      machineNumber: '0 בצדדים, פרנץ קרופ',
      fadeType: 'High Fade',
      notes: 'מגיע קבוע כל שבועיים בימי ראשון',
    },
  },
  {
    id: 'c4',
    name: 'מתן כהן',
    phone: '053-777-8899',
    lastVisit: new Date(Date.now() - 14 * 86400000).toISOString(),
    totalVisits: 4,
    totalSpent: 320,
    status: 'active',
    favoriteBarberId: 'dvir',
    favoriteBranchId: 'rehovot',
    preferences: {
      machineNumber: '2 בצדדים',
      notes: 'תספורת מהירה ונקייה',
    },
  },
];

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: 'המספרה של דביר',
  ownerName: 'דביר',
  mainPhone: '052-123-4567',
  whatsappGreeting: 'היי דביר, ראיתי את האתר של המספרה ואשמח לפרטים על תור:',
  retentionMessageTemplate: 'היי {name}, מה קורה? עבר כבר מעל חודש מאז התספורת הקודמת שלך במספרה של דביר ✂️ רוצה שאשריין לך תור להשבוע?',
  cancellationNoticeHours: 2,
  bufferMinutesBetweenAppointments: 5,
  bookingWindowDays: 21,
  lunchBreak: {
    start: '14:00',
    end: '14:30',
    isActive: true,
  },
  announcementBanner: {
    text: '📢 שים לב: ניתן לשריין תורים מראש באריאל (א׳-ג׳) וברחובות (ד׳-ו׳) ישירות באתר ב-30 שניות!',
    isActive: true,
  },
  branchSchedule: {
    0: 'ariel',
    1: 'ariel',
    2: 'ariel',
    3: 'rehovot',
    4: 'rehovot',
    5: 'rehovot',
    6: 'closed',
  },
  dailyOverrides: {},
  instagramUrl: 'https://instagram.com/dvir_barber',
  facebookUrl: 'https://facebook.com/dvirbarber',
};

// ============================================================
// DYNAMIC SHIFT CALCULATION UTILITY
// ============================================================

/**
 * Calculates the effective shift for a specific date:
 * 1. Checks if a specific daily override exists for this YYYY-MM-DD.
 * 2. If not, falls back to the recurring weekly branchSchedule template.
 */
export function getEffectiveShiftForDate(
  date: Date,
  settings: ShopSettings
): {
  date: string;
  branchId: 'ariel' | 'rehovot' | 'closed';
  isOpen: boolean;
  startTime: string;
  endTime: string;
  note?: string;
  isCustomOverride: boolean;
} {
  // Safe ISO format YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const dateKey = `${y}-${m}-${d}`;

  const override = settings.dailyOverrides?.[dateKey];

  if (override) {
    return {
      date: dateKey,
      branchId: override.branchId,
      isOpen: override.isOpen && override.branchId !== 'closed',
      startTime: override.startTime || '09:00',
      endTime: override.endTime || '20:00',
      note: override.note,
      isCustomOverride: true,
    };
  }

  // Fallback to weekly schedule template
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
  const defaultBranch = settings.branchSchedule[dayOfWeek] || 'closed';
  const isClosed = defaultBranch === 'closed' || dayOfWeek === 6;

  // Friday default is shorter (e.g. 08:30 - 13:30)
  const isFriday = dayOfWeek === 5;

  return {
    date: dateKey,
    branchId: defaultBranch,
    isOpen: !isClosed,
    startTime: isFriday ? '08:30' : '09:00',
    endTime: isFriday ? '13:30' : '20:00',
    note: undefined,
    isCustomOverride: false,
  };
}

// ============================================================
// REACT HOOK FOR GLOBAL DATA STORE
// ============================================================

export function useShopStore() {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [barbers, setBarbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [settings, setSettings] = useState<ShopSettings>(INITIAL_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBranches = localStorage.getItem('thecut_branches');
      const storedServices = localStorage.getItem('thecut_services');
      const storedBarbers = localStorage.getItem('thecut_barbers');
      const storedCustomers = localStorage.getItem('thecut_customers');
      const storedSettings = localStorage.getItem('thecut_settings');

      if (storedBranches) setBranches(JSON.parse(storedBranches));
      if (storedServices) setServices(JSON.parse(storedServices));
      if (storedBarbers) setBarbers(JSON.parse(storedBarbers));
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings({
          ...INITIAL_SETTINGS,
          ...parsed,
          dailyOverrides: parsed.dailyOverrides || {},
        });
      }
      setIsLoaded(true);
    }
  }, []);

  // Save actions
  const saveBranches = (newBranches: Branch[]) => {
    setBranches(newBranches);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_branches', JSON.stringify(newBranches));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveServices = (newServices: Service[]) => {
    setServices(newServices);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_services', JSON.stringify(newServices));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveBarbers = (newBarbers: Barber[]) => {
    setBarbers(newBarbers);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_barbers', JSON.stringify(newBarbers));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_customers', JSON.stringify(newCustomers));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_settings', JSON.stringify(newSettings));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  return {
    branches,
    services,
    barbers,
    customers,
    settings,
    isLoaded,
    saveBranches,
    saveServices,
    saveBarbers,
    saveCustomers,
    saveSettings,
  };
}
