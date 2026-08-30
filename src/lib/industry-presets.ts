import { BusinessConfig, ServiceItem, FaqItem } from '@/types/business';

export interface IndustryPreset {
  id: string;
  name: string;
  categoryName: string;
  icon: string;
  badge: string;
  description: string;
  themeColor: string;
  bgTheme: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon';
  heroStyle: 'hub-monogram' | 'split-cinema' | 'minimalist-vip';
  servicesStyle: 'split-gallery' | 'cards-grid' | 'compact-menu';
  borderRadius: 'modern-rounded' | 'sharp-luxury' | 'classic-soft';
  fontStyle: 'modern-sans' | 'urban-bold' | 'luxury-serif';
  shopName: string;
  ownerName: string;
  slogan: string;
  announcement: string;
  trustBadges: string[];
  services: ServiceItem[];
  faqs: FaqItem[];
  policies: {
    cancellationNotice: string;
    arrivalTime: string;
    paymentMethods: string;
    customNote: string;
  };
}

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: 'barbershop',
    name: 'מספרת גברים ופיסול זקן',
    categoryName: 'מספרות גברים',
    icon: '💈',
    badge: 'פרימיום Barber Hub',
    description: 'מראה פחם מט יוקרתי, דירוגים כירורגיים, סליידר לפני/אחרי ואווירת גברים פרימיום.',
    themeColor: '#C9A84C', // Gold Obsidian
    bgTheme: 'dark-obsidian',
    heroStyle: 'hub-monogram',
    servicesStyle: 'split-gallery',
    borderRadius: 'modern-rounded',
    fontStyle: 'urban-bold',
    shopName: 'המספרה של דביר',
    ownerName: 'דביר',
    slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר בישראל',
    announcement: '🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7 – שריינו מקום מראש!',
    trustBadges: [
      'דירוג 5.0 כוכבים (420+ ביקורות Google)',
      '10+ שנות ותק וניסיון מקצועי',
      'חניה צמודה ונוחה במקום',
      'אספרסו וכיבוד פרימיום חינם',
      'תשלום נוח ב-Bit, Apple Pay ואשראי',
    ],
    services: [
      { id: 'srv-1', name: 'תספורת גברים פרימיום & דירוג', price: 80, duration: 30, description: 'תספורת מדויקת לפי מבנה הפנים, שטיפה וחפיפה ועיצוב עם ווקס פרימיום' },
      { id: 'srv-2', name: 'פיסול ועיצוב זקן Master', price: 40, duration: 20, description: 'קווים חדים בתער יפני, שמנים מזינים ומגבת חמה' },
      { id: 'srv-3', name: 'חבילת VIP משולבת (שיער + זקן)', price: 110, duration: 45, description: 'החבילה המובילה: תספורת מלאה, פיסול זקן ומסיכת פנים מרעננת' },
      { id: 'srv-4', name: 'תספורת ילדים ונוער (עד גיל 13)', price: 70, duration: 30, description: 'יחס אישי, סבלנות ודירוג אופנתי ומדויק' },
    ],
    faqs: [
      { id: 'faq-1', question: 'איך מתבצע ביטול או שינוי מועד התור?', answer: 'ניתן לבטל או לשנות את מועד התור בקלות דרך כפתור "התורים שלי" באתר עד שעתיים לפני המועד שנקבע.' },
      { id: 'faq-2', question: 'האם יש חניה מסודרת ליד המספרה?', answer: 'כן, בסניפינו ישנה חניה חינם ובשפע ממש בצמוד לכניסה.' },
      { id: 'faq-3', question: 'באילו אמצעי תשלום ניתן לשלם?', answer: 'אנו מכבדים כרטיסי אשראי, מזומן, Bit ו-Apple Pay.' },
    ],
    policies: {
      cancellationNotice: 'ביטול או שינוי תור ללא עלות עד שעתיים לפני המועד',
      arrivalTime: 'נא להגיע כ-5 דקות לפני שעת התור',
      paymentMethods: 'תשלום באשראי, Bit, Apple Pay או מזומן',
      customNote: 'במקרה של איחור מעל 10 דקות, יש לעדכן אותנו מראש בוואטסאפ',
    },
  },
  {
    id: 'nails-beauty',
    name: 'קוסמטיקה, ציפורניים וריסים',
    categoryName: 'קוסמטיקה ויופי',
    icon: '💅',
    badge: 'Luxury Beauty Lounge',
    description: 'מראה שמפניה ואלבסטר רך, גלריית עבודות מרהיבה, מבנה אנטומי וטיפולי פנים.',
    themeColor: '#EC4899', // Rose Blush
    bgTheme: 'luxury-light',
    heroStyle: 'split-cinema',
    servicesStyle: 'cards-grid',
    borderRadius: 'modern-rounded',
    fontStyle: 'luxury-serif',
    shopName: 'סטודיו שירן ביוטי & בוטיק',
    ownerName: 'שירן',
    slogan: 'עיצוב ציפורניים במבנה אנטומי, הרמת ריסים וטיפולי פנים מתקדמים',
    announcement: '✨ מבצע חודשי: 10% הנחה על טיפול פנים משולב למצטרפות חדשות!',
    trustBadges: [
      'סטריליזציה ברמה רפואית (Autoclave)',
      'חומרי פרימיום היפואלרגניים בלבד',
      'דירוג 5.0★ (280+ לקוחות מרוצות)',
      'אווירה שקטה, קפה וכיבוד אישי',
      'תשלום ב-Bit, Apple Pay וכל כרטיסי האשראי',
    ],
    services: [
      { id: 'srv-101', name: 'מבנה אנטומי & לק ג׳ל פרימיום', price: 160, duration: 60, description: 'חיזוק הציפורן הטבעית, מניקור רוסי משולב ומריחה מדויקת מתחת לקוטיקולה' },
      { id: 'srv-102', name: 'הארכת ציפורניים בפוליג׳ל / טיפס', price: 250, duration: 90, description: 'בנייה עדינה, חזקה ועמידה במיוחד עם עיצוב אומנותי לבחירה' },
      { id: 'srv-103', name: 'הרמת ריסים & צביעה בוטוקס', price: 220, duration: 50, description: 'מראה ריסים מלא, מורם ומודגש ללא צורך במסקרה עד 8 שבועות' },
      { id: 'srv-104', name: 'טיפול פנים זוהר Glow & לחות', price: 350, duration: 60, description: 'פילינג עדין, עיסוי פנים ממצק ומסיכת קולגן עשירה להזנה' },
    ],
    faqs: [
      { id: 'faq-101', question: 'כמה זמן מחזיק מבנה אנטומי?', answer: 'מבנה אנטומי מחזיק בין 3 ל-4 שבועות בעמידות מושלמת וללא קילופים.' },
      { id: 'faq-102', question: 'האם הכלים עוברים חיטוי?', answer: 'בוודאי! כל כלי העבודה עוברים חיטוי באוטוקלאב רפואי ונפתחים משקית סטרילית מול עיני הלקוחה.' },
    ],
    policies: {
      cancellationNotice: 'ביטול או שינוי תור עד 24 שעות מראש',
      arrivalTime: 'נא להגיע בזמן מדויק ללא ליווי לטובת פרטיות הטיפול',
      paymentMethods: 'Bit, PayBox, אשראי והעברה בנקאית',
      customNote: 'במידה ויש לק קיים ממכון אחר, נא לבחור שירות כולל הסרה',
    },
  },
  {
    id: 'spa-massage',
    name: 'ספא, מסאז׳ים וטיפולי גוף',
    categoryName: 'ספא ובריאות',
    icon: '🌿',
    badge: 'Holistic Wellness Spa',
    description: 'גווני טורקיז נורדי ואלבסטר חם, שקט נפשי, מוזיקה מרגיעה ועיסויי גוף עמוקים.',
    themeColor: '#14B8A6', // Nordic Teal
    bgTheme: 'luxury-light',
    heroStyle: 'minimalist-vip',
    servicesStyle: 'cards-grid',
    borderRadius: 'classic-soft',
    fontStyle: 'modern-sans',
    shopName: 'ספא לוטוס – בית למנוחה ומרגוע',
    ownerName: 'מיכל',
    slogan: 'עיסויים מקצועיים, שחרור שרירים עמוק ופינוק הוליסטי לגוף ולנפש',
    announcement: '🌿 חבילת פינוק זוגית כוללת שמנים ארומטיים וכיבוד – להזמנה ישירה',
    trustBadges: [
      'מטפלים מוסמכים בעלי תעודות בכירות',
      'שמנים אורגניים 100% טבעיים',
      'חדרי טיפול מרווחים, מקלחת צמודה',
      'חוויית שקט מוחלטת ללא רעשי רקע',
      'חניה פרטית שמורה ללקוחות',
    ],
    services: [
      { id: 'srv-201', name: 'עיסוי שוודי קלאסי משחרר', price: 280, duration: 60, description: 'עיסוי מפנק עם שמנים חמים להפגת מתחים ושיפור זרימת הדם' },
      { id: 'srv-202', name: 'עיסוי רקמות עמוק לספורטאים', price: 320, duration: 60, description: 'שחרור קשרים ודלקות שרירים כרוניות באמצעות טכניקות ממוקדות' },
      { id: 'srv-203', name: 'טיפול אבנים חמות הוליסטי', price: 360, duration: 75, description: 'שילוב אבני בזלת וולקניות מחוממות להרפיה עמוקה של כל הגוף' },
      { id: 'srv-204', name: 'עיסוי רפלקסולוגיה וקצוות', price: 220, duration: 45, description: 'לחיצות מדויקות בכפות הרגליים לאיזון מערכות הגוף והפגת עייפות' },
    ],
    faqs: [
      { id: 'faq-201', question: 'האם המטפלים מוסמכים?', answer: 'כל צוות המטפלים שלנו מחזיק בתעודות הסמכה ממכללות מוכרות ובעל ניסיון של מעל 5 שנים.' },
      { id: 'faq-202', question: 'מה צריך להביא לטיפול?', answer: 'אין צורך להביא דבר – אנו מספקים חלוקי רחצה, מגבות נקיות ותאי הלבשה פרטיים.' },
    ],
    policies: {
      cancellationNotice: 'ביטול תור ללא חיוב עד 12 שעות לפני המועד',
      arrivalTime: 'מומלץ להגיע כ-10 דקות לפני הזמן לשתיית תה צמחים והרפיה',
      paymentMethods: 'תשלום באשראי, Bit או מזומן במקום',
      customNote: 'אנא עדכנו את המטפל/ת על מגבלות רפואיות או היריון לפני הטיפול',
    },
  },
  {
    id: 'tattoo-piercing',
    name: 'סטודיו קעקועים ופירסינג',
    categoryName: 'קעקועים ופירסינג',
    icon: '⚡',
    badge: 'Custom Tattoo Art Studio',
    description: 'מראה Cyber Carbon שחור מוחלט, דגש על סקיצות אישיות, סטריליות ותיק עבודות.',
    themeColor: '#A855F7', // Royal Violet / Neon
    bgTheme: 'cyber-carbon',
    heroStyle: 'split-cinema',
    servicesStyle: 'cards-grid',
    borderRadius: 'sharp-luxury',
    fontStyle: 'urban-bold',
    shopName: 'סטודיו בלאק אינק טאטו',
    ownerName: 'רון',
    slogan: 'קעקועים מותאמים אישית (Custom Art), כיסויים (Cover-up) ופירסינג מקצועי',
    announcement: '🔥 שריינו סקיצה אישית לפרויקטים גדולים – ייעוץ ראשוני ללא עלות!',
    trustBadges: [
      'רישיון משרד הבריאות וסטריליזציה מלאה',
      'מחטים וציוד חד-פעמי שנפתח מול הלקוח',
      'צבעי Vegan ידידותיים לעור ללא מתכות',
      'אמני קעקועים בעלי ניסיון בינלאומי',
    ],
    services: [
      { id: 'srv-301', name: 'פגישת ייעוץ וסקיצה אישית', price: 150, duration: 30, description: 'תכנון הרעיון, מדידות מדויקות על הגוף וציור סקיצה ייחודית עבורך' },
      { id: 'srv-302', name: 'קעקוע מינימליסטי / עדין (Fine Line)', price: 350, duration: 60, description: 'קווים דקיקים ומדויקים בעבודה עדינה ביותר' },
      { id: 'srv-303', name: 'סשן קעקוע בינוני (עד 3 שעות)', price: 900, duration: 180, description: 'עבודה מפורטת כולל הצללות, צבעים ופרטים עשירים' },
      { id: 'srv-304', name: 'פירסינג מקצועי כולל עגיל טיטניום', price: 150, duration: 20, description: 'פירסינג מדויק במחט רפואית כולל הוראות חיטוי וטיפול ביתי' },
    ],
    faqs: [
      { id: 'faq-301', question: 'מאיזה גיל ניתן להתקעקע?', answer: 'הקעקוע מבוצע מגיל 18 ומעלה, או מגיל 16 בליווי הורה וחתימה על טופס הסכמה.' },
    ],
    policies: {
      cancellationNotice: 'שינוי מועד סשן עד 48 שעות מראש לשמירת המקדמה',
      arrivalTime: 'נא לאכול היטב ולשתות מים לפני ההגעה לסשן',
      paymentMethods: 'מזומן, Bit, אשראי והעברה בנקאית',
      customNote: 'אין להגיע תחת השפעת אלכוהול או אספירין',
    },
  },
  {
    id: 'fitness-trainer',
    name: 'אימונים אישיים וקליניקות כושר',
    categoryName: 'כושר וספורט',
    icon: '🏋️',
    badge: 'Pro Fitness & Body Coaching',
    description: 'מראה ירוק אמרלד ספורטיבי, תוכניות ליווי אישיות, תזונה ותוצאות מוכחות.',
    themeColor: '#10B981', // Cyber Emerald
    bgTheme: 'dark-obsidian',
    heroStyle: 'split-cinema',
    servicesStyle: 'cards-grid',
    borderRadius: 'modern-rounded',
    fontStyle: 'urban-bold',
    shopName: 'סטודיו אופק – אימונים אישיים',
    ownerName: 'אופק',
    slogan: 'אימוני כושר אישיים, חיטוב והעלאת מסת שריר בליווי תזונתי מדויק',
    announcement: '💪 הצטרפו עכשיו לתוכנית הליווי הממוקדת לחיטוב הגוף – מספר מקומות מוגבל!',
    trustBadges: [
      'מאמנים מוסמכי וינגייט בעלי תואר ראשון',
      'תוכניות מותאמות אישית לפי בדיקת מדדים',
      'ציוד כוח ומשקולות מתקדם ביותר',
      'מעקב שבועי בוואטסאפ ותפריט תזונה',
    ],
    services: [
      { id: 'srv-401', name: 'אימון אישי 1-על-1 (VIP Session)', price: 200, duration: 60, description: 'אימון ממוקד עם ליווי מלא על טכניקה, נשימה ודחיפה לקצה היכולת' },
      { id: 'srv-402', name: 'כרטיסיית 10 אימונים אישיים', price: 1800, duration: 60, description: 'חבילת אימונים מקיפה כולל תפריט תזונה מותאם ובדיקות שקילה חודשיות' },
      { id: 'srv-403', name: 'אימון זוגי / חברים', price: 280, duration: 60, description: 'אימון אינטנסיבי וחווייתי לשניים עם אנרגיות גבוהות' },
    ],
    faqs: [
      { id: 'faq-401', question: 'האם האימון מתאים גם למתחילים?', answer: 'בהחלט! כל תוכנית נבנית בהתאם לרמת הכושר הנוכחית שלך ומתקדמת בצורה בטוחה.' },
    ],
    policies: {
      cancellationNotice: 'ביטול אימון עד 8 שעות מראש ללא חיוב',
      arrivalTime: 'נא להגיע בבגדי ספורט, נעלי ריצה ובקבוק מים',
      paymentMethods: 'Bit, אשראי, PayBox והוראת קבע לחבילות',
      customNote: 'נדרש אישור רפואי בתוקף לפני תחילת האימונים',
    },
  },
  {
    id: 'clinics-aesthetics',
    name: 'קליניקות אסתטיקה ורופאים',
    categoryName: 'קליניקות ורפואה',
    icon: '🩺',
    badge: 'Advanced Aesthetic Clinic',
    description: 'מראה Brand Midnight כחול-ספיר יוקרתי, טיפולי הזרקות ואסתטיקה רפואית מתקדמת.',
    themeColor: '#0EA5E9', // Electric Blue / Sapphire
    bgTheme: 'brand-midnight',
    heroStyle: 'minimalist-vip',
    servicesStyle: 'cards-grid',
    borderRadius: 'classic-soft',
    fontStyle: 'modern-sans',
    shopName: 'קליניקת ד״ר לוי לאסתטיקה רפואית',
    ownerName: 'ד״ר לוי',
    slogan: 'רפואה אסתטית מתקדמת, פיסול פנים, בוטוקס וחומצה היאלורונית',
    announcement: '💎 ייעוץ ואבחון פנים מקצועי ללא עלות בהרשמה מראש דרך האתר',
    trustBadges: [
      'טיפולים ע״י רופאים מוסמכים בלבד',
      'חומרי מילוי באישור FDA ומשרד הבריאות',
      'טכנולוגיות מיצוק והצערה המתקדמות בעולם',
      'תוצאות טבעיות ומדויקות ללא זמן החלמה',
    ],
    services: [
      { id: 'srv-501', name: 'פגישת אבחון ותכנון טיפול רפואי', price: 200, duration: 30, description: 'מיפוי תווי הפנים, התאמת פרוטוקול טיפולים ותיאום ציפיות מדויק' },
      { id: 'srv-502', name: 'הזרקת בוטוקס (אזור אחד / שלושה אזורים)', price: 750, duration: 30, description: 'טשטוש קמטי הבעה במצח, בין הגבות ובצידי העיניים למראה רענן' },
      { id: 'srv-503', name: 'פיסול ועיבוי שפתיים בחומצה היאלורונית', price: 1400, duration: 45, description: 'עיצוב שפתיים סימטרי וטבעי עם חומרי מילוי אירופאיים מהשורה הראשונה' },
    ],
    faqs: [
      { id: 'faq-501', question: 'כמה זמן נמשכת השפעת הטיפול?', answer: 'תוצאות בוטוקס נשמרות בין 4 ל-6 חודשים, וחומצה היאלורונית בין 9 ל-14 חודשים.' },
    ],
    policies: {
      cancellationNotice: 'ביטול תור עד 24 שעות מראש',
      arrivalTime: 'הגעה 10 דקות לפני למריחת קרם אלחוש',
      paymentMethods: 'אשראי (עד 12 תשלומים), Bit, העברה בנקאית ומזומן',
      customNote: 'יש להימנע מנטילת מדללי דם יום לפני ההזרקות',
    },
  },
  {
    id: 'home-technician',
    name: 'טכנאים ושירותי בית',
    categoryName: 'טכנאים ושירותים',
    icon: '🔧',
    badge: 'Certified Home Pro Services',
    description: 'מראה נקי, זמני הגעה מהירים, שקיפות מחירים מלאה ואזורי פעילות ברורים.',
    themeColor: '#F59E0B', // Amber Bronze
    bgTheme: 'dark-obsidian',
    heroStyle: 'split-cinema',
    servicesStyle: 'compact-menu',
    borderRadius: 'sharp-luxury',
    fontStyle: 'modern-sans',
    shopName: 'שרון שירותי מיזוג וחשמל',
    ownerName: 'שרון',
    slogan: 'התקנה ותיקון מזגנים, פתרונות חשמל מתקדמים ושירות מהיר ואמין',
    announcement: '⚡ זמינות להגעת חירום באזור המרכז תוך 60 דקות – התקשרו עכשיו!',
    trustBadges: [
      'טכנאי מוסמך וחשמלאי מורשה',
      'אחריות מלאה בכתב על כל עבודה',
      'ציוד אבחון מתקדם וחלפים מקוריים',
      'מחירים שקופים ללא הפתעות במקום',
    ],
    services: [
      { id: 'srv-601', name: 'ביקור ובדיקת תקלה מקיפה', price: 250, duration: 45, description: 'אבחון מקצועי של מקור התקלה. עלות הביקור מתקזזת מעלות התיקון' },
      { id: 'srv-602', name: 'מילוי גז ותיקון דליפות במזגן', price: 450, duration: 60, description: 'בדיקת לחצים, איתור דליפה ומילוי גז מקורי בתקן' },
      { id: 'srv-603', name: 'ניקוי עמוק וחיטוי בקטריאלי למזגן', price: 380, duration: 60, description: 'הסרת עובש, שטיפת רדיאטורים ונטרול ריחות לא נעימים' },
    ],
    faqs: [
      { id: 'faq-601', question: 'באילו אזורים אתם נותנים שירות?', answer: 'אנו מעניקים שירות מלא באזור המרכז, גוש דן, השפלה והשרון.' },
    ],
    policies: {
      cancellationNotice: 'ביטול קריאת שירות עד שעתיים לפני מועד ההגעה',
      arrivalTime: 'טווח הגעה של שעה מרגע התיאום',
      paymentMethods: 'אשראי, Bit, העברה בנקאית ומזומן במקום',
      customNote: 'חשבונית מס ואחריות בכתב מונפקות מיד בסיום העבודה',
    },
  },
];
