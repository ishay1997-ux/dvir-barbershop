import { BusinessConfig } from '@/types/business';

export interface IndustryTerminology {
  id: string;
  businessType: string;
  staffTitle: string;
  staffPlural: string;
  serviceTitle: string;
  serviceTitlePlural?: string;
  clientTitle?: string;
  clientPlural?: string;
  bookingAction: string;
  bioHeading: string;
  bioBadge: string;
  clientNotesTitle: string;
  clientNotesSubtitle: string;
  clientNotesFields: {
    field1Label: string;
    field1Placeholder: string;
    field2Label: string;
    field2Placeholder: string;
    field3Label: string;
    field3Placeholder: string;
    notesLabel: string;
    notesPlaceholder: string;
  };
  whatsappGreeting: string;
  retentionMessage: string;
  icon: string;
  badge: string;
  categoryName?: string;
  whatsappRetentionTemplate?: string;
}

export const INDUSTRY_TERMINOLOGIES: Record<string, IndustryTerminology> = {
  barber: {
    id: 'barber',
    businessType: 'מספרת גברים וברברשופ',
    staffTitle: 'ספר ראשי',
    staffPlural: 'ספרים',
    serviceTitle: 'תספורת וזקן',
    serviceTitlePlural: 'תספורות',
    clientTitle: 'לקוח',
    clientPlural: 'לקוחות',
    bookingAction: 'קביעת תור',
    bioHeading: 'הכירו את המאסטר',
    bioBadge: 'המאסטר שלכם',
    clientNotesTitle: 'נוסחת תספורת אישית',
    clientNotesSubtitle: 'תיעוד מספרי מכונה, דירוג וסגנון אישי ללקוח',
    clientNotesFields: {
      field1Label: 'מספר מכונה בצדדים / פייד',
      field1Placeholder: 'לדוגמה: 0.5 פתוח, סקין פייד נמוך',
      field2Label: 'אורך וטקסטורה למעלה',
      field2Placeholder: 'לדוגמה: מספריים, קיצור 2 ס״מ, טקסטורה',
      field3Label: 'עיצוב זקן וקווי מתאר',
      field3Placeholder: 'לדוגמה: קו לחיים ישר בתער, חיבור זקן דק',
      notesLabel: 'העדפות ודגשים מיוחדים',
      notesPlaceholder: 'רגישות בעורף, צמיחה הפוכה, ווקס מט...',
    },
    whatsappGreeting: 'היי, ראיתי את האתר של המספרה ואשמח לפרטים על תור:',
    retentionMessage: 'היי {name}, עבר מעל חודש מאז התספורת הקודמת שלך ✂️ רוצה שאשריין לך תור להשבוע?',
    icon: '💈',
    badge: 'פרימיום Barber Hub',
  },
  beauty_salon: {
    id: 'beauty_salon',
    businessType: 'סטודיו לקוסמטיקה, ציפורניים ויופי',
    staffTitle: 'קוסמטיקאית ואמנית ציפורניים',
    staffPlural: 'מטפלות',
    serviceTitle: 'טיפול יופי וציפורניים',
    serviceTitlePlural: 'טיפולים',
    clientTitle: 'לקוחה',
    clientPlural: 'לקוחות',
    bookingAction: 'קביעת תור',
    bioHeading: 'הכירו את המומחית',
    bioBadge: 'המומחית שלכן',
    clientNotesTitle: 'כרטיס טיפול ומבנה אנטומי',
    clientNotesSubtitle: 'תיעוד סוג הבנייה, מספרי גוונים והעדפות הלקוחה',
    clientNotesFields: {
      field1Label: 'מבנה אנטומי / סוג בסיס',
      field1Placeholder: 'לדוגמה: בסיס גומי רבר, חיזוק אקריל/פוליג׳ל',
      field2Label: 'מספרי לק וגוונים אהובים',
      field2Placeholder: 'לדוגמה: קודי קולור #42 ניוד, פרנץ׳ עדין',
      field3Label: 'רגישויות ומצב ציפורניים',
      field3Placeholder: 'לדוגמה: קוטיקולה רגישה, נטייה להתפצלויות',
      notesLabel: 'העדפות ועיצובים מיוחדים',
      notesPlaceholder: 'עיצוב אומנותי, אבנים, אורך בינוני שקד...',
    },
    whatsappGreeting: 'היי, ראיתי את האתר של הסטודיו ואשמח לפרטים על תור:',
    retentionMessage: 'היי {name}, עברו 3 שבועות מאז המבנה האנטומי הקודם שלך 💅 הגיע הזמן לחידוש! מתי מתאים לך?',
    icon: '💅',
    badge: 'Luxury Beauty Lounge',
  },
  cosmetics_aesthetician: {
    id: 'cosmetics_aesthetician',
    businessType: 'קליניקה לקוסמטיקה פרא-רפואית ועור',
    staffTitle: 'קוסמטיקאית פרא-רפואית P.M.E',
    staffPlural: 'קוסמטיקאיות',
    serviceTitle: 'טיפול פנים ועור',
    serviceTitlePlural: 'טיפולים',
    clientTitle: 'מטופלת',
    clientPlural: 'מטופלות',
    bookingAction: 'קביעת תור',
    bioHeading: 'הכירו את המומחית',
    bioBadge: 'קוסמטיקאית P.M.E מוסמכת',
    clientNotesTitle: 'תיק אבחון עור ופרוטוקול',
    clientNotesSubtitle: 'תיעוד סוג העור, רגישויות, פילינג ושגרת בית',
    clientNotesFields: {
      field1Label: 'אבחון עור ורמת רגישות',
      field1Placeholder: 'לדוגמה: עור מעורב, נטייה לאקנה הורמונלי, מחסום עור פגוע',
      field2Label: 'חומצות ופרוטוקול טיפול',
      field2Placeholder: 'לדוגמה: חומצה סליצילית 2%, אזלאית 10%, רטינול עדין',
      field3Label: 'שגרת טיפוח ביתית מומלצת',
      field3Placeholder: 'לדוגמה: סבון מקציף עדין, לחות לא קומדוגנית, מקדם הגנה 50+',
      notesLabel: 'הנחיות רפואיות ודגשים',
      notesPlaceholder: 'היריון/הנקה, נטילת רואקוטן בעבר, רגישות לחומצות...',
    },
    whatsappGreeting: 'היי שירן, ראיתי את האתר של הקליניקה ואשמח לפרטים על תור:',
    retentionMessage: 'היי {name}, עבר כחודש מאז טיפול הפנים הקודם שלך 🌸 הגיע הזמן לרענון עמוק ולחות לעור. מתי מתאים לך?',
    icon: '🌸',
    badge: 'Clinical Skincare Aesthetics',
  },
  clinic_therapist: {
    id: 'clinic_therapist',
    businessType: 'מרכז ספא, עיסויים ובריאות',
    staffTitle: 'מטפל/ת מוסמך/ת',
    staffPlural: 'מטפלים',
    serviceTitle: 'עיסוי וטיפול גוף',
    serviceTitlePlural: 'טיפולים',
    clientTitle: 'מטופל/ת',
    clientPlural: 'מטופלים',
    bookingAction: 'הזמנת טיפול',
    bioHeading: 'אודות המטפלים המוסמכים',
    bioBadge: 'צוות הטיפול',
    clientNotesTitle: 'כרטיס העדפות ורגישויות',
    clientNotesSubtitle: 'תיעוד עוצמת עיסוי, אזורי מיקוד ומגבלות בריאותיות',
    clientNotesFields: {
      field1Label: 'עוצמת עיסוי מועדפת',
      field1Placeholder: 'לדוגמה: בינונית-חזקה, רקמות עמוק',
      field2Label: 'אזורי מיקוד / כאב',
      field2Placeholder: 'לדוגמה: שכמות תפוסות, גב תחתון, צוואר',
      field3Label: 'שמנים וארומתרפיה',
      field3Placeholder: 'לדוגמה: שמן שקדים טבעי, לבנדר להרגעה',
      notesLabel: 'הנחיות רפואיות ומגבלות',
      notesPlaceholder: 'פריצת דיסק, רגישות למגע חזק, לחץ דם...',
    },
    whatsappGreeting: 'היי, ראיתי את האתר של הספא ואשמח לתאם טיפול מפנק:',
    retentionMessage: 'היי {name}, הגוף מאותת שצריך הפסקה? 🌿 נשמח לארח אותך לעיסוי משחרר להפגת מתחים.',
    icon: '🌿',
    badge: 'Holistic Wellness Spa',
  },
  private_instructor: {
    id: 'private_instructor',
    businessType: 'סטודיו לאימוני כושר אישיים',
    staffTitle: 'מאמן כושר אישי',
    staffPlural: 'מאמנים',
    serviceTitle: 'אימון כושר אישי',
    serviceTitlePlural: 'אימונים',
    clientTitle: 'מתאמן/ת',
    clientPlural: 'מתאמנים',
    bookingAction: 'תיאום אימון',
    bioHeading: 'הכירו את המאמן',
    bioBadge: 'המאמן שלכם',
    clientNotesTitle: 'מעקב מדדים והתקדמות מתאמן',
    clientNotesSubtitle: 'תיעוד שקילה, אחוזי שומן ויעדי אימון',
    clientNotesFields: {
      field1Label: 'משקל נוכחי ויעד',
      field1Placeholder: 'לדוגמה: 78 ק״ג (יעד: 73 ק״ג חיטוב)',
      field2Label: 'אחוז שומן והיקפים',
      field2Placeholder: 'לדוגמה: 18.5% שומן, היקף מותניים 84 ס״מ',
      field3Label: 'משקלי עבודה עיקריים',
      field3Placeholder: 'לדוגמה: סקוואט 90 ק״ג, בנץ׳ 75 ק״ג',
      notesLabel: 'דגשי תזונה ופציעות קודמות',
      notesPlaceholder: 'דגש על 150 גרם חלבון, להימנע מעומס על ברך שמאל...',
    },
    whatsappGreeting: 'היי, ראיתי את האתר ואשמח לתאם אימון היכרות:',
    retentionMessage: 'היי {name}, השבוע לא קבעת אימון! 💪 בוא נשמור על הרצף והתוצאות. מתי נוח לך?',
    icon: '🏋️',
    badge: 'Pro Fitness Coaching',
  },
  clinics_aesthetics: {
    id: 'clinics_aesthetics',
    businessType: 'קליניקה לאסתטיקה רפואית',
    staffTitle: 'רופא מומחה לאסתטיקה',
    staffPlural: 'רופאים',
    serviceTitle: 'טיפול רפואי ואסתטי',
    serviceTitlePlural: 'טיפולים',
    clientTitle: 'מטופל/ת',
    clientPlural: 'מטופלים',
    bookingAction: 'קביעת ייעוץ',
    bioHeading: 'אודות הצוות הרפואי',
    bioBadge: 'מומחיות רפואית',
    clientNotesTitle: 'תיק טיפולים ופרוטוקול רפואי',
    clientNotesSubtitle: 'תיעוד חומרי הזרקה, מילוי ותאריכי מעקב',
    clientNotesFields: {
      field1Label: 'פרוטוקול הזרקה / אזורים',
      field1Placeholder: 'לדוגמה: בוטוקס 30 יחידות (מצח + גלבלה)',
      field2Label: 'חומרי מילוי ומספרי מנות',
      field2Placeholder: 'לדוגמה: Juvederm Volift 1.0ml לשפתיים',
      field3Label: 'מועד ביקורת ומעקב',
      field3Placeholder: 'לדוגמה: ביקורת בעוד 14 יום לטאץ׳-אפ',
      notesLabel: 'רגישויות לתרופות והנחיות',
      notesPlaceholder: 'ללא אלרגיות ידועות, נטילת ויטמינים...',
    },
    whatsappGreeting: 'שלום, ראיתי את אתר הקליניקה ואשמח לתאם פגישת ייעוץ:',
    retentionMessage: 'שלום {name}, עברו כ-5 חודשים מטיפול הבוטוקס האחרון שלך 🩺 מומלץ לתאם ביקורת לשימור התוצאה הטבעית.',
    icon: '🩺',
    badge: 'Advanced Aesthetic Clinic',
  },
  tattoo_piercing: {
    id: 'tattoo_piercing',
    businessType: 'סטודיו לקעקועים ופירסינג',
    staffTitle: 'אמן קעקועים ראשי',
    staffPlural: 'אמנים',
    serviceTitle: 'סשן קעקוע וסקיצה',
    serviceTitlePlural: 'סשנים וקעקועים',
    clientTitle: 'לקוח',
    clientPlural: 'לקוחות',
    bookingAction: 'תיאום סשן',
    bioHeading: 'הכירו את האמן',
    bioBadge: 'אמן הסטודיו',
    clientNotesTitle: 'פרטי סקיצה ופרויקט',
    clientNotesSubtitle: 'תיעוד גודל, מיקום בגוף וסטטוס מקדמה',
    clientNotesFields: {
      field1Label: 'מיקום וגודל בגוף (בס״מ)',
      field1Placeholder: 'לדוגמה: אמה פנימית ימין, 15x8 ס״מ',
      field2Label: 'סגנון אמנותי וצבעים',
      field2Placeholder: 'לדוגמה: Black & Grey ריאליסטי, הצללות עדינות',
      field3Label: 'סטטוס מקדמה וסקיצה',
      field3Placeholder: 'לדוגמה: שולמה מקדמה 200₪, סקיצה אושרה בוואטסאפ',
      notesLabel: 'דגשים והחלמה',
      notesPlaceholder: 'הנחיות דרמפיקס, עור רגיש לאדום...',
    },
    whatsappGreeting: 'היי, ראיתי את האתר של הסטודיו ואשמח לפרטים על סקיצה/קעקוע:',
    retentionMessage: 'היי {name}, איך הקעקוע החדש החלים? 🔥 נשמח לראות תמונה ולתכנן את הפרויקט הבא שלך!',
    icon: '⚡',
    badge: 'Custom Tattoo Studio',
  },
  home_technician: {
    id: 'home_technician',
    businessType: 'שירותי טכנאי, חשמל ומיזוג',
    staffTitle: 'טכנאי מוסמך וחשמלאי',
    staffPlural: 'טכנאים',
    serviceTitle: 'קריאת שירות וביקור',
    serviceTitlePlural: 'קריאות שירות',
    clientTitle: 'לקוח',
    clientPlural: 'לקוחות',
    bookingAction: 'הזמנת שירות',
    bioHeading: 'אודות איש המקצוע',
    bioBadge: 'מוסמך ומורשה',
    clientNotesTitle: 'יומן תקלות ואחריות',
    clientNotesSubtitle: 'תיעוד דגם המכשיר, התיקון שבוצע ותוקף האחריות',
    clientNotesFields: {
      field1Label: 'דגם מכשיר / מזגן / לוח',
      field1Placeholder: 'לדוגמה: תדיראן אינוורטר 2.5 כ״ס, שנת 2021',
      field2Label: 'מהות התקלה והתיקון שבוצע',
      field2Placeholder: 'לדוגמה: הוחלף קבל מדחס 45uF + מילוי גז R410',
      field3Label: 'תוקף אחריות ומספר חשבונית',
      field3Placeholder: 'לדוגמה: 12 חודשי אחריות על הקבל (עד 08/2027)',
      notesLabel: 'דגשים וגישה למקום',
      notesPlaceholder: 'מסתור כביסה קומה 3, קוד כניסה לבניין 1234...',
    },
    whatsappGreeting: 'שלום, ראיתי את האתר ואשמח להזמין קריאת שירות דחופה:',
    retentionMessage: 'שלום {name}, הקיץ בפתח! ☀️ מומלץ לבצע בדיקת תחזוקה תקופתית וניקוי פילטרים למזגן.',
    icon: '🔧',
    badge: 'Certified Pro Services',
  },
};

export interface IndustryMeta {
  categoryKey: string;
  icon: string;
  label: string;
  heroImage: string;
  masterTitle: string;
  vipBadge: string;
  actionIcon: string;
  actionLabel: string;
}

export const INDUSTRY_META_MAP: Record<string, IndustryMeta> = {
  barber: {
    categoryKey: 'barber',
    icon: '✂️',
    label: 'Barbershop',
    heroImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80',
    masterTitle: 'מאסטר ברבר ראשי ומנהל',
    vipBadge: 'VIP BARBERSHOP & GROOMING EXPERIENCE',
    actionIcon: '✂️',
    actionLabel: 'קביעת תור',
  },
  beauty_salon: {
    categoryKey: 'beauty_salon',
    icon: '💅',
    label: 'Beauty & Nails',
    heroImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=80',
    masterTitle: 'אמנית ציפורניים ומטפלת ראשית',
    vipBadge: 'LUXURY BEAUTY & NAILS LOUNGE',
    actionIcon: '💅',
    actionLabel: 'קביעת תור',
  },
  cosmetics_aesthetician: {
    categoryKey: 'cosmetics_aesthetician',
    icon: '🌸',
    label: 'Cosmetics & Skincare',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80',
    masterTitle: 'קוסמטיקאית פרא-רפואית P.M.E',
    vipBadge: 'CLINICAL SKINCARE & AESTHETICS',
    actionIcon: '🌸',
    actionLabel: 'קביעת תור',
  },
  clinic_therapist: {
    categoryKey: 'clinic_therapist',
    icon: '🌿',
    label: 'Spa & Wellness',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    masterTitle: 'מטפלת מוסמכת ומנהלת ספא',
    vipBadge: 'HOLISTIC WELLNESS SPA EXPERIENCE',
    actionIcon: '🌿',
    actionLabel: 'הזמנת טיפול',
  },
  private_instructor: {
    categoryKey: 'private_instructor',
    icon: '🏋️',
    label: 'Fitness & Coach',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    masterTitle: 'מאמן כושר אישי בכיר',
    vipBadge: 'PRO FITNESS & BODY COACHING',
    actionIcon: '🏋️',
    actionLabel: 'תיאום אימון',
  },
  clinics_aesthetics: {
    categoryKey: 'clinics_aesthetics',
    icon: '🩺',
    label: 'Aesthetic Clinic',
    heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
    masterTitle: 'רופא מומחה ומנהל קליניקה',
    vipBadge: 'ADVANCED MEDICAL AESTHETIC CLINIC',
    actionIcon: '🩺',
    actionLabel: 'קביעת ייעוץ',
  },
  home_technician: {
    categoryKey: 'home_technician',
    icon: '🔧',
    label: 'Tech & Repair',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    masterTitle: 'טכנאי מוסמך וחשמלאי מורשה',
    vipBadge: 'CERTIFIED PRO HOME SERVICES',
    actionIcon: '🔧',
    actionLabel: 'הזמן שירות',
  },
  tattoo_piercing: {
    categoryKey: 'tattoo_piercing',
    icon: '⚡',
    label: 'Tattoo Studio',
    heroImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1600&q=80',
    masterTitle: 'אמן קעקועים ראשי ומעצב',
    vipBadge: 'CUSTOM TATTOO ART & PIERCING',
    actionIcon: '⚡',
    actionLabel: 'תיאום סשן',
  },
};

/**
 * Resolves the clean category key from BusinessConfig or string
 */
export function resolveIndustryCategoryKey(business?: any): string {
  if (!business) return 'barber';

  if (typeof business === 'string') {
    const raw = business.trim().toLowerCase();
    if (INDUSTRY_META_MAP[raw]) return raw;
    if (raw === 'cosmetics' || raw === 'cosmetics-aesthetician' || raw === 'glow' || raw === 'skin') return 'cosmetics_aesthetician';
    if (raw === 'beauty' || raw === 'nails' || raw === 'nails-beauty') return 'beauty_salon';
    if (raw === 'trainer' || raw === 'fitness' || raw === 'fitness-trainer' || raw === 'coach') return 'private_instructor';
    if (raw === 'spa' || raw === 'massage' || raw === 'spa-massage') return 'clinic_therapist';
    if (raw === 'clinic' || raw === 'clinics' || raw === 'clinics-aesthetics' || raw === 'doctor' || raw === 'aesthetics') return 'clinics_aesthetics';
    if (raw === 'services' || raw === 'tech' || raw === 'home-technician' || raw === 'plumber' || raw === 'ac') return 'home_technician';
    if (raw === 'tattoo' || raw === 'tattoo-piercing' || raw === 'piercing') return 'tattoo_piercing';
    if (raw === 'dvir' || raw === 'thecut' || raw === 'barber' || raw === 'barbershop') return 'barber';
    return 'barber';
  }

  // Priority 1: Flagship or explicit slug
  const slug = (business.slug || '').toLowerCase().trim();
  if (slug === 'dvir' || slug === 'thecut') return 'barber';
  if (slug === 'cosmetics' || slug === 'glow' || slug === 'skin') return 'cosmetics_aesthetician';
  if (slug === 'beauty' || slug === 'nails') return 'beauty_salon';
  if (slug === 'spa' || slug === 'massage') return 'clinic_therapist';
  if (slug === 'trainer' || slug === 'fitness') return 'private_instructor';
  if (slug === 'clinic' || slug === 'aesthetics') return 'clinics_aesthetics';
  if (slug === 'services' || slug === 'tech' || slug === 'plumber' || slug === 'ac') return 'home_technician';
  if (slug === 'tattoo') return 'tattoo_piercing';

  // Priority 2: Explicit category field
  const cat = business.category;
  if (cat) {
    if (INDUSTRY_META_MAP[cat]) return cat;
    if (cat === 'cosmetics' || cat === 'cosmetics-aesthetician' || cat === 'glow' || cat === 'skin') return 'cosmetics_aesthetician';
    if (cat === 'beauty' || cat === 'nails' || cat === 'nails-beauty') return 'beauty_salon';
    if (cat === 'trainer' || cat === 'fitness' || cat === 'fitness-trainer' || cat === 'coach') return 'private_instructor';
    if (cat === 'spa' || cat === 'massage' || cat === 'spa-massage') return 'clinic_therapist';
    if (cat === 'clinic' || cat === 'clinics' || cat === 'clinics-aesthetics' || cat === 'doctor' || cat === 'aesthetics') return 'clinics_aesthetics';
    if (cat === 'services' || cat === 'tech' || cat === 'home-technician' || cat === 'plumber' || cat === 'ac') return 'home_technician';
    if (cat === 'tattoo' || cat === 'tattoo-piercing' || cat === 'piercing') return 'tattoo_piercing';
    if (cat === 'barber' || cat === 'barbershop') return 'barber';
  }

  // Priority 3: Explicit business name analysis (Barbershops check FIRST)
  const name = (business.name || business.shopName || '').toLowerCase();
  const slogan = (business.slogan || '').toLowerCase();
  const combined = `${name} ${slogan}`;

  if (
    combined.includes('מספרה') ||
    combined.includes('מספרת') ||
    combined.includes('ברבר') ||
    combined.includes('barber') ||
    combined.includes('תספורת') ||
    combined.includes('שיער') ||
    combined.includes('זקן') ||
    combined.includes('פייד') ||
    combined.includes('fade') ||
    combined.includes('דביר')
  ) {
    return 'barber';
  }

  if (
    combined.includes('קוסמטיקה') ||
    combined.includes('שירן') ||
    combined.includes('פרא-רפואית') ||
    combined.includes('אקנה') ||
    combined.includes('פילינג') ||
    combined.includes('p.m.e') ||
    combined.includes('skincare')
  ) {
    return 'cosmetics_aesthetician';
  }

  if (
    combined.includes('ביוטי') ||
    combined.includes('beauty') ||
    combined.includes('מיה') ||
    combined.includes('ציפורניים') ||
    combined.includes('ציפורן') ||
    combined.includes('מניקור') ||
    combined.includes('פדיקור') ||
    combined.includes('לק ג׳ל') ||
    combined.includes('מבנה אנטומי') ||
    combined.includes('ריסים')
  ) {
    return 'beauty_salon';
  }

  if (
    combined.includes('כושר') ||
    combined.includes('מאמן') ||
    combined.includes('אימונים') ||
    combined.includes('אימון אישי') ||
    combined.includes('אופק') ||
    combined.includes('fitness') ||
    combined.includes('trainer') ||
    combined.includes('gym')
  ) {
    return 'private_instructor';
  }

  if (
    combined.includes('ספא') ||
    combined.includes('עיסוי') ||
    combined.includes('מסאז') ||
    combined.includes('לוטוס') ||
    combined.includes('רפלקסולוגיה') ||
    combined.includes('wellness')
  ) {
    return 'clinic_therapist';
  }

  if (
    combined.includes('קליניקה') ||
    combined.includes('אסתטיקה') ||
    combined.includes('הזרקות') ||
    combined.includes('בוטוקס') ||
    combined.includes('חומצה היאלורונית') ||
    combined.includes('ד״ר')
  ) {
    return 'clinics_aesthetics';
  }

  if (
    combined.includes('טכנאי') ||
    combined.includes('מנעולן') ||
    combined.includes('מיזוג') ||
    combined.includes('אינסטלציה') ||
    combined.includes('חשמלאי') ||
    combined.includes('תיקונים')
  ) {
    return 'home_technician';
  }

  if (
    combined.includes('קעקוע') ||
    combined.includes('קעקועים') ||
    combined.includes('פירסינג') ||
    combined.includes('tattoo')
  ) {
    return 'tattoo_piercing';
  }

  return 'barber';
}

/**
 * Authoritative Industry Meta resolver for all components
 */
export function getIndustryMeta(business?: any): IndustryMeta {
  const catKey = resolveIndustryCategoryKey(business);
  return INDUSTRY_META_MAP[catKey] || INDUSTRY_META_MAP.barber;
}

/**
 * Authoritative Industry Terminology resolver
 */
export function getIndustryTerminology(business?: any): IndustryTerminology {
  const catKey = resolveIndustryCategoryKey(business);
  return INDUSTRY_TERMINOLOGIES[catKey] || INDUSTRY_TERMINOLOGIES.barber;
}

