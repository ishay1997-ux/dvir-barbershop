import { BusinessConfig } from '@/types/business';

export interface IndustryTerminology {
  id: string;
  businessType: string;
  staffTitle: string;
  staffPlural: string;
  serviceTitle: string;
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
  clinic_therapist: {
    id: 'clinic_therapist',
    businessType: 'מרכז ספא, עיסויים ובריאות',
    staffTitle: 'מטפל/ת מוסמך/ת',
    staffPlural: 'מטפלים',
    serviceTitle: 'עיסוי וטיפול גוף',
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

/**
 * Helper to infer the appropriate terminology given a BusinessConfig or category string.
 */
export function getIndustryTerminology(business?: Partial<BusinessConfig> | string): IndustryTerminology {
  let cat = typeof business === 'string' ? business : business?.category;
  
  if (!cat && typeof business === 'object' && business) {
    const combined = `${business.name || ''} ${business.slogan || ''}`.toLowerCase();
    const themeColor = business.themeColor;
    
    if (combined.includes('ציפורניים') || combined.includes('קוסמטיקה') || combined.includes('יופי') || themeColor === '#EC4899' || themeColor === '#A855F7') {
      cat = 'beauty_salon';
    } else if (combined.includes('ספא') || combined.includes('עיסוי') || combined.includes('רפואה') || themeColor === '#14B8A6') {
      cat = 'clinic_therapist';
    } else if (combined.includes('קעקוע') || combined.includes('פירסינג') || themeColor === '#E2E8F0') {
      cat = 'tattoo_piercing';
    } else if (combined.includes('כושר') || combined.includes('מאמן') || combined.includes('אימונים') || themeColor === '#10B981') {
      cat = 'private_instructor';
    } else if (combined.includes('קליניקה') || combined.includes('אסתטיקה') || combined.includes('טיפולי פנים') || themeColor === '#3B82F6') {
      cat = 'clinics_aesthetics';
    } else if (combined.includes('טכנאי') || combined.includes('מנעולן') || combined.includes('תיקונים') || themeColor === '#0EA5E9') {
      cat = 'home_technician';
    }
  }

  return (cat && INDUSTRY_TERMINOLOGIES[cat]) || INDUSTRY_TERMINOLOGIES.barber;
}
