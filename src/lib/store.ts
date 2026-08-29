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
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: 'המספרה של דביר',
  ownerName: 'דביר',
  city: 'אריאל & רחובות',
  mainPhone: '058-781-5071',
  slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר בישראל',
  bio: 'אמן תספורות ומומחה לפיידים מודרניים, עיצוב זקנים מדויק וחוויית שירות אישית ובלתי מתפשרת.',
  experienceYears: 7,
  themeColor: '#C9A84C',
  bgTheme: 'dark-obsidian',
  whatsappNumber: '0587815071',
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
    style: 'gold',
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
  blockedDates: [],
  galleryImages: [
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517832606589-7629c339590a?w=800&auto=format&fit=crop&q=80',
  ],
  transformations: [
    {
      id: '1',
      title: 'סקין פייד קלאסי ועיצוב קווי מתאר',
      category: 'תספורת פרימיום',
      description: 'מעבר משיער פרוע לפייד מדויק עם קווי מתאר חדים וטקסטורה עליונה.',
      beforeGradient: 'from-stone-900 via-stone-800 to-zinc-900',
      afterGradient: 'from-amber-900 via-amber-800 to-yellow-700',
    },
    {
      id: '2',
      title: 'פיסול זקן מלא + דירוג לחיים',
      category: 'עיצוב זקן',
      description: 'יישור סימטרי מדויק של קו הלחיים והצוואר, שמן הזנה ועיצוב עם תער חם.',
      beforeGradient: 'from-zinc-900 via-neutral-900 to-stone-900',
      afterGradient: 'from-amber-950 via-amber-900 to-amber-700',
    },
    {
      id: '3',
      title: 'פרנץ\' קרופ מודרני וטקסטורה עשירה',
      category: 'סגנון מודרני',
      description: 'מראה צעיר, רענן וקל לעיצוב יומיומי עם חימר מט פרימיום.',
      beforeGradient: 'from-neutral-900 via-zinc-800 to-stone-900',
      afterGradient: 'from-yellow-950 via-amber-800 to-yellow-600',
    },
  ],
  testimonials: [
    {
      id: 't1',
      name: 'עומר לוי',
      comment: 'הספר הכי מדויק שיש! פייד מושלם כל פעם מחדש. הממשק לקביעת תור פשוט הצלה.',
      rating: 5,
      timeAgo: 'לפני 3 ימים',
      serviceUsed: 'תספורת גברים פרימיום',
    },
    {
      id: 't2',
      name: 'יונתן כהן',
      comment: 'חבילת ה-VIP שווה כל שקל! פיסול הזקן והמגבת החמה זו חוויה של מספרה מהשורה הראשונה.',
      rating: 5,
      timeAgo: 'לפני שבוע',
      serviceUsed: 'חבילת VIP משולבת',
    },
    {
      id: 't3',
      name: 'רועי ששון',
      comment: 'שירות מעל המצופה, עמידה מדויקת בזמנים, אווירה טובה ומקצוענות שיא!',
      rating: 5,
      timeAgo: 'לפני שבועיים',
      serviceUsed: 'תספורת גברים פרימיום',
    },
  ],
  faqs: [
    {
      id: 'f1',
      question: 'האם חובה לקבוע תור מראש?',
      answer: 'כן, כדי להבטיח שלא תמתינו אפילו דקה אחת, אנו עובדים במתכונת תורים מוזמנים מראש דרך המערכת.',
    },
    {
      id: 'f2',
      question: 'האם ניתן לבטל או להזיז תור?',
      answer: 'בהחלט! ניתן לבטל תור בקלות דרך עמוד "איתור וניהול התורים שלי" עד שעתיים לפני מועד התור ללא עלות.',
    },
    {
      id: 'f3',
      question: 'אילו אמצעי תשלום מתקבלים במספרה?',
      answer: 'אנו מקבלים מזומן, אשראי, Bit, PayBox והעברה בנקאית.',
    },
    {
      id: 'f4',
      question: 'האם יש חניה צמודה בסניפים?',
      answer: 'כן, בשני הסניפים באריאל וברחובות קיימת חניה מסודרת ונגישה ללקוחותינו.',
    },
  ],
  layout: {
    bgTheme: 'dark-obsidian',
    heroStyle: 'hub-monogram',
    servicesStyle: 'split-gallery',
    cardStyle: 'glass',
    showBeforeAfter: true,
    showReviews: true,
    showFaqs: true,
    showBranches: true,
    showBio: true,
  },
  instagramUrl: 'https://instagram.com/dvir_barber',
  instagramHandle: '@dvir_barber',
  facebookUrl: 'https://facebook.com/dvirbarber',
  tiktokUrl: 'https://tiktok.com/@dvir_barber',
  wazeUrl: 'https://waze.com/ul?q=Ariel+University',
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
      const CURRENT_STORE_VERSION = 'v3_solo_dvir';
      const storedVersion = localStorage.getItem('thecut_version');
      if (storedVersion !== CURRENT_STORE_VERSION) {
        localStorage.removeItem('thecut_customers');
        localStorage.removeItem('thecut_appointments');
        localStorage.removeItem('thecut_barbers');
        localStorage.setItem('thecut_version', CURRENT_STORE_VERSION);
      }

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
