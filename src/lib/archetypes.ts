import {
  BusinessConfig,
  ServiceItem,
  BranchItem,
  TestimonialItem,
  FaqItem,
  BusinessCategory,
} from '@/types/business';

export interface BusinessArchetype {
  id: string;
  category: BusinessCategory;
  name: string;
  badge: string;
  icon: string;
  description: string;
  defaultColor: string;
  slogan: (owner: string, city: string, bizName: string) => string;
  announcement: (owner: string, city: string, bizName: string) => string;
  bio: (owner: string, city: string, bizName: string, exp: number) => string;
  services: ServiceItem[];
  testimonials: (owner: string, city: string) => TestimonialItem[];
  faqs: (owner: string, city: string) => FaqItem[];
}

export const THEME_PALETTES = [
  {
    id: 'gold',
    name: 'זהב מלכותי · Royal Gold',
    color: '#C9A84C',
    gradient: 'from-[#DFCA85] via-[#C9A84C] to-[#9A7B2C]',
    bgTint: 'rgba(201, 168, 76, 0.12)',
    borderTint: 'rgba(201, 168, 76, 0.35)',
  },
  {
    id: 'emerald',
    name: 'ירוק אמרלד · Emerald VIP',
    color: '#10B981',
    gradient: 'from-[#34D399] via-[#10B981] to-[#059669]',
    bgTint: 'rgba(16, 185, 129, 0.12)',
    borderTint: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'sapphire',
    name: 'כחול ספיר · Deep Sapphire',
    color: '#3B82F6',
    gradient: 'from-[#60A5FA] via-[#3B82F6] to-[#1D4ED8]',
    bgTint: 'rgba(59, 130, 246, 0.12)',
    borderTint: 'rgba(59, 130, 246, 0.35)',
  },
  {
    id: 'rose',
    name: 'רוז גולד · Rose Velvet',
    color: '#EC4899',
    gradient: 'from-[#F472B6] via-[#EC4899] to-[#BE185D]',
    bgTint: 'rgba(236, 72, 153, 0.12)',
    borderTint: 'rgba(236, 72, 153, 0.35)',
  },
  {
    id: 'silver',
    name: 'כסף טיטניום · Titanium Silver',
    color: '#E4E4E7',
    gradient: 'from-[#FFFFFF] via-[#E4E4E7] to-[#71717A]',
    bgTint: 'rgba(228, 228, 231, 0.10)',
    borderTint: 'rgba(228, 228, 231, 0.30)',
  },
  {
    id: 'ruby',
    name: 'אדום רובי · Ruby Luxury',
    color: '#EF4444',
    gradient: 'from-[#F87171] via-[#EF4444] to-[#B91C1C]',
    bgTint: 'rgba(239, 68, 68, 0.12)',
    borderTint: 'rgba(239, 68, 68, 0.35)',
  },
  {
    id: 'sunset',
    name: 'שקיעה לוהטת · Sunset Orange',
    color: '#F97316',
    gradient: 'from-[#FB923C] via-[#F97316] to-[#C2410C]',
    bgTint: 'rgba(249, 115, 22, 0.12)',
    borderTint: 'rgba(249, 115, 22, 0.35)',
  },
  {
    id: 'violet',
    name: 'סגול ניאון · Cyber Violet',
    color: '#8B5CF6',
    gradient: 'from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9]',
    bgTint: 'rgba(139, 92, 246, 0.12)',
    borderTint: 'rgba(139, 92, 246, 0.35)',
  },
];

export const BUSINESS_ARCHETYPES: Record<string, BusinessArchetype> = {
  'mens-barbershop': {
    id: 'mens-barbershop',
    category: 'barber',
    name: 'ברברשופ גברים קלאסי & פיידים',
    badge: 'ברברשופ לגברים',
    icon: '💈',
    description: 'מתאים למספרות גברים מודרניות, פיידים מדויקים, פיסול זקן ומגבות חמות',
    defaultColor: '#C9A84C',
    slogan: (owner, city) => `עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר ב${city || 'ישראל'}`,
    announcement: (owner, city) => `🌟 קביעת תורים מהירה אונליין לכל הסניפים ב${city || 'ישראל'} 24/7 – שריינו מראש!`,
    bio: (owner, city, bizName) => `ב-${bizName} אנו מאמינים שתספורת היא כרטיס הביקור של הגבר המודרני. ${owner} מעניק לכל לקוח יחס אישי, התאמה אופטימלית למבנה הפנים, שימוש בתערים יפניים וחיטוי וסטריליות קפדניים.`,
    services: [
      { id: 'srv-1', name: 'תספורת גברים פרימיום (Fade)', price: 80, duration: 30, description: 'כולל חפיפה מפנקת, דירוג Fade מדויק ועיצוב בחומרי פרימיום', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 5 },
      { id: 'srv-2', name: 'עיצוב ופיסול זקן Master', price: 40, duration: 20, description: 'תיחום קווים בתער, ריכוך בשמנים מזינים ומגבת חמה', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 5 },
      { id: 'srv-3', name: 'חבילת VIP משולבת (תספורת + זקן)', price: 110, duration: 45, description: 'החוויה המושלמת: תספורת פייד, פיסול זקן, טיפול מגבת חמה וחפיפה', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 5 },
      { id: 'srv-4', name: 'תספורת ילדים ונוער', price: 70, duration: 30, description: 'תספורת אופנתית וסבלנית באווירה צעירה ונעימה', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 5 },
    ],
    testimonials: (owner) => [
      { id: 't1', name: 'איתי ברקוביץ', comment: `הסקין פייד הכי מדויק שעשו לי אי פעם. שירות ויחס ברמה הכי גבוהה שיש אצל ${owner}!`, rating: 5, timeAgo: 'לפני יומיים', serviceUsed: 'תספורת גברים פרימיום' },
      { id: 't2', name: 'עומר אלוני', comment: 'מסתפר קבוע, אווירה נעימה, מקצועיות שאין לתאר וזמנים מדויקים על הדקה.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'חבילת VIP משולבת' },
      { id: 't3', name: 'יונתן שפירא', comment: 'אין על הדיוק והשירות, תמיד יוצא מרוצה במאה אחוז.', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'תספורת + זקן' },
    ],
    faqs: (owner, city) => [
      { question: 'האם חובה להזמין תור מראש?', answer: `כן, כדי למנוע המתנה מומלץ תמיד לשריין תור מראש במערכת האונליין של ${owner}.` },
      { question: 'מהי מדיניות ביטול או שינוי תור?', answer: 'ניתן לבטל או להזיז תור עד שעתיים לפני המועד בלחיצת כפתור דרך האתר.' },
      { question: 'אילו אמצעי תשלום מכבדים במספרה?', answer: 'מזומן, אשראי, Bit, PayBox ו-Apple Pay.' },
      { question: 'האם יש חניה צמודה?', answer: `כן, ישנה חניה זמינה ובחינם בסמוך למספרה ב${city}.` },
    ],
  },

  'beauty-cosmetics': {
    id: 'beauty-cosmetics',
    category: 'beauty_salon',
    name: 'קליניקת קוסמטיקה, ציפורניים & טיפוח',
    badge: 'קוסמטיקה ויופי',
    icon: '💅',
    description: 'מתאים לקוסמטיקאיות, מכוני מניקור-פדיקור, טיפולי פנים, עיצוב גבות והסרת שיער',
    defaultColor: '#EC4899',
    slogan: (owner, city) => `טיפולי קוסמטיקה מתקדמים, מניקור ג׳ל מדויק וטיפוח עור הפנים ב${city || 'ישראל'}`,
    announcement: (owner, city) => `✨ שרייני תור אונליין לטיפולי יופי וציפורניים בקליניקה ב${city || 'ישראל'} – זמינות מיידית!`,
    bio: (owner, city, bizName) => `ב-${bizName} אנו מחברים בין בריאות העור ליופי ואסתטיקה ללא פשרות. ${owner} מתמחה במכשור מתקדם, חומרי פרימיום בינלאומיים וחיטוי בסטנדרט רפואי מחמיר.`,
    services: [
      { id: 'srv-1', name: 'מניקור ג׳ל רוסי משולב מבנה אנטומי', price: 140, duration: 60, description: 'מניקור יסודי, חיזוק במבנה אנטומי ומריחה צמודה לעור עם לקים מובחרים', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 10 },
      { id: 'srv-2', name: 'טיפול פנים קלאסי עמוק & זוהר', price: 280, duration: 75, description: 'ניקוי עמוק, פילינג חומצות, החדרת לחויות ומסכת זוהר בהתאמה אישית', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 15 },
      { id: 'srv-3', name: 'עיצוב ושיקום גבות + צביעה', price: 90, duration: 30, description: 'עיצוב בשיטת השערה, התאמה למבנה הפנים וצביעה בחומרים טבעיים', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 5 },
      { id: 'srv-4', name: 'פדיקור רפואי / טיפולי מפנק', price: 180, duration: 50, description: 'טיפול יסודי בכף הרגל, הסרת עור קשה, עיסוי קרם הזנה ומריחת לק', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 10 },
    ],
    testimonials: (owner) => [
      { id: 't1', name: 'רוני כהן', comment: `המניקור של ${owner} מחזיק לי חודש שלם בלי שום צ׳יפ! עבודה נקייה ומדויקת להפליא.`, rating: 5, timeAgo: 'לפני 3 ימים', serviceUsed: 'מניקור ג׳ל מבנה אנטומי' },
      { id: 't2', name: 'הילה שמש', comment: 'טיפול הפנים עשה פלאים לעור שלי, מקצועיות שאין כמותה ואווירה סופר מרגיעה.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'טיפול פנים זוהר' },
      { id: 't3', name: 'שני מזרחי', comment: 'קליניקה מדהימה, סטריליות 100% ושירות מושלם. ממליצה בחום!', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'עיצוב גבות' },
    ],
    faqs: (owner, city) => [
      { question: 'האם המכשור עובר חיטוי וסטריליזציה?', answer: 'באופן קפדני ביותר. כל הכלים עוברים תהליך חיטוי ועיקור באוטוקלאב רפואי לפני כל לקוחה.' },
      { question: 'כמה זמן מחזיק מבנה אנטומי?', answer: 'בממוצע 3 עד 4 שבועות של עמידות מושלמת וברק מלא.' },
      { question: 'איך מתבצעת הגעה לקליניקה?', answer: `הקליניקה ממוקמת ב${city} במקום נגיש עם חניה נוחה.` },
    ],
  },

  'home-technician': {
    id: 'home-technician',
    category: 'home_technician',
    name: 'טכנאי שירותי בית & אינסטלציה (שירות בבית הלקוח)',
    badge: 'שירותי בית ואחזקה',
    icon: '🔧',
    description: 'מתאים לאינסטלטורים, חשמלאים, מנעולנים, תיקוני מזגנים ואנשי שירות שמגיעים לבית הלקוח',
    defaultColor: '#3B82F6',
    slogan: (owner, city) => `שירותי אינסטלציה ותיקונים מהירים בבית הלקוח ב${city || 'ישראל'} – אמינות, מקצועיות ואחריות מלאה`,
    announcement: (owner, city) => `🛠️ שריינו חלון הגעת טכנאי אונליין לכל אזור ${city || 'ישראל'} – מגיעים עם ציוד מלא!`,
    bio: (owner, city, bizName) => `ב-${bizName} אנו מספקים מענה מהיר, יסודי ומקצועי לכל תקלה בבית או בעסק. ${owner} מתמחה באיתור נזילות במצלמות תרמיות, פתיחת סתימות מורכבות, ועבודות אינסטלציה וחשמל עם אחריות בכתב.`,
    services: [
      { id: 'srv-1', name: 'ביקור טכנאי ובדיקה כללית בבית הלקוח', price: 200, duration: 60, description: 'הגעה, בדיקת התקלה, מתן דיאגנוסטיקה והצעת מחיר מדויקת במקום', popular: true, bookingType: 'TIME_WINDOW', locationType: 'CLIENT_ADDRESS', bufferAfterMinutes: 30 },
      { id: 'srv-2', name: 'פתיחת סתימה במכשור חשמלי מתקדם', price: 350, duration: 60, description: 'פתיחת סתימות בכיור, באסלה או בצנרת ראשית ללא שבירות ונזקים', popular: true, bookingType: 'TIME_WINDOW', locationType: 'CLIENT_ADDRESS', bufferAfterMinutes: 30 },
      { id: 'srv-3', name: 'איתור נזילות במצלמה תרמית + דו״ח', price: 750, duration: 90, description: 'בדיקה תרמית ללא הרס ואיתור מקור הרטיבות כולל הפקת דו״ח מקצועי', popular: false, bookingType: 'TIME_WINDOW', locationType: 'CLIENT_ADDRESS', bufferAfterMinutes: 45 },
      { id: 'srv-4', name: 'החלפת ברזים / סיפונים וכלים סניטריים', price: 280, duration: 45, description: 'התקנה מקצועית של ברזים, ניאגרות וחיבורי מים עם איטום מלא', popular: false, bookingType: 'TIME_WINDOW', locationType: 'CLIENT_ADDRESS', bufferAfterMinutes: 30 },
    ],
    testimonials: (owner) => [
      { id: 't1', name: 'יורם אשכנזי', comment: `הגיע בדיוק בזמן, איתר את הנזילה תוך 10 דקות ותיקן במחיר הוגן ביותר. ${owner} מקצוען אמיתי!`, rating: 5, timeAgo: 'לפני 4 ימים', serviceUsed: 'איתור נזילה' },
      { id: 't2', name: 'דנה קופלר', comment: 'השירות הכי מהיר ואמין שקיבלתי. פתר סתימה קשה ששני בעלי מקצוע אחרים הסתבכו איתה.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'פתיחת סתימה' },
      { id: 't3', name: 'משה ארצי', comment: 'עבודה נקייה, יסודית ואחריות מלאה על העבודה. ממליץ בחום!', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'החלפת ברזים' },
    ],
    faqs: (owner, city) => [
      { question: 'האם ניתנת אחריות על התיקון?', answer: 'בהחלט! על כל עבודה ותיקון ניתנת אחריות מלאה בכתב.' },
      { question: 'איך עובד חלון הזמנים להגעה?', answer: 'בעת ההזמנה בוחרים חלון הגעה נוח (בוקר/צהריים/ערב), והטכנאי מעדכן בוואטסאפ כחצי שעה לפני הגעתו.' },
      { question: 'באילו אזורים ניתן השירות?', answer: `אנו מספקים שירות ב${city} ובכל יישובי הסביבה.` },
    ],
  },

  'clinic-therapist': {
    id: 'clinic-therapist',
    category: 'clinic_therapist',
    name: 'קליניקה פרטית, עיסויים & רפואה משלימה',
    badge: 'קליניקה ובריאות',
    icon: '🌿',
    description: 'מתאים למטפלים בעיסוי, פסיכותרפיסטים, כירופרקטים, דיקור סיני ומטפלי גוף-נפש',
    defaultColor: '#10B981',
    slogan: (owner, city) => `טיפולי גוף ונפש, עיסויים רפואיים ורפואה משלימה באווירה שלווה ב${city || 'ישראל'}`,
    announcement: (owner, city) => `🌿 שריינו מועד לטיפול מרגיע ומחדש אנרגיות בקליניקה ב${city || 'ישראל'} – חוויה מרפאת!`,
    bio: (owner, city, bizName) => `ב-${bizName} אנו יוצרים מרחב של שקט, ריפוי והפגת מתחים. ${owner} מוסמך בטכניקות מתקדמות של שחרור שרירים תפוסים, איזון אנרגטי ושיקום פיזיולוגי מותאם אישית.`,
    services: [
      { id: 'srv-1', name: 'עיסוי רפואי משולב & שחרור מתחים (60 דק\')', price: 280, duration: 60, description: 'שילוב טכניקות שוודי, רקמות עמוקות ושמנים ארומתרפיים להרפיה מלאה', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 15 },
      { id: 'srv-2', name: 'עיסוי רקמות עמוקות וספורטאים (75 דק\')', price: 340, duration: 75, description: 'עבודה ממוקדת על שרירים תפוסים, שחרור מפרקים ושיפור טווחי תנועה', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 15 },
      { id: 'srv-3', name: 'פגישת ייעוץ וטיפול ברפואה משלימה', price: 250, duration: 50, description: 'אבחון מקיף, דיקור סיני / רפלקסולוגיה והתאמת תוכנית טיפול', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 10 },
    ],
    testimonials: (owner) => [
      { id: 't1', name: 'רועי בן דוד', comment: `הגעתי עם גב תפוס לחלוטין ויצאתי כמו חדש. הטיפול של ${owner} פשוט מציל חיים!`, rating: 5, timeAgo: 'לפני יומיים', serviceUsed: 'עיסוי רקמות עמוקות' },
      { id: 't2', name: 'מיכל אלון', comment: 'קליניקה מדהימה, שקטה ונקייה. העיסוי הכי מקצועי ומרגיע שחוויתי.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'עיסוי שוודי משולב' },
    ],
    faqs: (owner, city) => [
      { question: 'האם הטיפול מתאים גם לסובלים מכאבים כרוניים?', answer: 'כן, הטיפול מותאם אישית לאחר תשאול רפואי מדויק בתחילת הפגישה.' },
      { question: 'מה צריך להביא לטיפול?', answer: 'אין צורך להביא דבר, הקליניקה מספקת מגבות סטריליות, חלוקים ומקלחת צמודה.' },
    ],
  },
};

/**
 * Creates a fully customized, rich BusinessConfig for any new business
 */
export function generateTailoredBusinessConfig(params: {
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  category?: BusinessCategory;
  archetypeId?: string;
  themeColor?: string;
  plan?: 'pro' | 'starter' | 'enterprise';
  instagramHandle?: string;
  branches?: BranchItem[];
  services?: ServiceItem[];
}): BusinessConfig {
  const cleanSlug = params.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
  const archetypeKey = params.archetypeId || 'mens-barbershop';
  const archetype = BUSINESS_ARCHETYPES[archetypeKey] || BUSINESS_ARCHETYPES['mens-barbershop'];
  const color = params.themeColor || archetype.defaultColor;
  const owner = params.ownerName || params.name;
  const city = params.city || 'ישראל';

  const defaultBranch: BranchItem = {
    id: 'main',
    name: `סניף ראשי – ${city}`,
    address: `${city} (כתובת מלאה באפליקציית Waze)`,
    phone: params.phone,
    hours: 'א׳-ה׳: 09:00-20:00 | ו׳: 08:30-14:00',
    wazeLink: `https://waze.com/ul?q=${encodeURIComponent(city)}`,
    googleMapsLink: `https://maps.google.com/?q=${encodeURIComponent(city)}`,
  };

  return {
    id: `biz-${cleanSlug}`,
    name: params.name,
    slug: cleanSlug,
    category: params.category || archetype.category || 'barber',
    ownerName: owner,
    phone: params.phone,
    city: city,
    slogan: archetype.slogan(owner, city, params.name),
    announcement: archetype.announcement(owner, city, params.name),
    themeColor: color,
    branchesCount: params.branches?.length || 1,
    status: 'active',
    plan: params.plan || 'pro',
    createdAt: new Date().toISOString().split('T')[0],
    experienceYears: 5,
    instagramHandle: params.instagramHandle || `@${cleanSlug}`,
    services: params.services && params.services.length > 0 ? params.services : archetype.services,
    branches: params.branches && params.branches.length > 0 ? params.branches : [defaultBranch],
    testimonials: archetype.testimonials(owner, city),
    faqs: archetype.faqs(owner, city),
  };
}
