import { BusinessConfig, ServiceItem, BranchItem, TestimonialItem, FaqItem } from '@/types/business';

export interface BusinessArchetype {
  id: 'mens-barbershop' | 'womens-salon' | 'luxury-vip' | 'unisex-family';
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
    name: 'ברברשופ גברים קלאסי & פיידים',
    badge: 'ברברשופ לגברים',
    icon: '💈',
    description: 'מתאים למספרות גברים מודרניות, פיידים מדויקים, פיסול זקן ומגבות חמות',
    defaultColor: '#C9A84C',
    slogan: (owner, city) => `עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר ב${city || 'ישראל'}`,
    announcement: (owner, city) => `🌟 קביעת תורים מהירה אונליין לכל הסניפים ב${city || 'ישראל'} 24/7 – שריינו מראש!`,
    bio: (owner, city, bizName, exp) => `ב-${bizName} אנו מאמינים שתספורת היא כרטיס הביקור של הגבר המודרני. ${owner} מעניק לכל לקוח יחס אישי, התאמה אופטימלית למבנה הפנים, שימוש בתערים יפניים וחיטוי וסטריליות קפדניים.`,
    services: [
      { id: 'srv-1', name: 'תספורת גברים פרימיום (Fade)', price: 80, duration: 30, description: 'כולל חפיפה מפנקת, דירוג Fade מדויק ועיצוב בחומרי פרימיום', popular: true },
      { id: 'srv-2', name: 'עיצוב ופיסול זקן Master', price: 40, duration: 20, description: 'תיחום קווים בתער, ריכוך בשמנים מזינים ומגבת חמה', popular: false },
      { id: 'srv-3', name: 'חבילת VIP משולבת (תספורת + זקן)', price: 110, duration: 45, description: 'החוויה המושלמת: תספורת פייד, פיסול זקן, טיפול מגבת חמה וחפיפה', popular: true },
      { id: 'srv-4', name: 'תספורת ילדים ונוער', price: 70, duration: 30, description: 'תספורת אופנתית וסבלנית באווירה צעירה ונעימה', popular: false },
    ],
    testimonials: (owner, city) => [
      { id: 't1', name: 'יונתן כהן', comment: `הספר הכי מדויק שיצא לי להסתפר אצלו ב${city}! פייד נקי וחלק בלי שום פשרות.`, rating: 5, timeAgo: 'לפני 3 ימים', serviceUsed: 'תספורת גברים פרימיום' },
      { id: 't2', name: 'עומר לוי', comment: 'חבילת ה-VIP שווה כל שקל! פיסול הזקן והמגבת החמה זו חוויה של מספרת יוקרה.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'חבילת VIP משולבת' },
      { id: 't3', name: 'רועי ששון', comment: 'שירות מעל המצופה, עמידה מדויקת בזמנים, אווירה טובה ומקצוענות שיא!', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'תספורת גברים פרימיום' },
    ],
    faqs: (owner, city) => [
      { question: 'האם חובה לקבוע תור מראש?', answer: 'כן, כדי להבטיח שלא תמתינו אפילו דקה אחת, אנו עובדים במתכונת תורים מוזמנים מראש דרך המערכת.' },
      { question: 'האם ניתן לבטל או להזיז תור?', answer: 'בהחלט! ניתן לבטל תור בקלות דרך האתר עד שעתיים לפני מועד התור ללא עלות.' },
      { question: 'אילו אמצעי תשלום מתקבלים במספרה?', answer: 'אנו מקבלים מזומן, כרטיסי אשראי, Bit, PayBox ו-Apple Pay.' },
      { question: 'האם יש חניה צמודה בסניף?', answer: `כן, בקרבת הסניף ב${city} קיימת חניה מסודרת וגישה נוחה ללקוחותינו.` },
    ],
  },

  'womens-salon': {
    id: 'womens-salon',
    name: 'סלון עיצוב שיער נשים & החלקות',
    badge: 'סלון נשים והחלקות',
    icon: '💇‍♀️',
    description: 'מתאים לסלוני נשים, החלקות אורגניות, גוונים, בלונד, תספורות ועיצוב תסרוקות',
    defaultColor: '#EC4899',
    slogan: (owner, city) => `מרכז החלקות אורגניות, בלונד מושלם, גוונים ועיצוב שיער מקצועי ב${city || 'ישראל'}`,
    announcement: (owner, city) => `✨ 15% הנחה על טיפול שיקום שיער בכל הזמנת החלקה אורגנית השבוע!`,
    bio: (owner, city, bizName, exp) => `ב-${bizName} אנו מתמחים בטיפוח, שיקום והעצמת השיער הנשי. ${owner} מתמחה בהחלקות בריאות ללא פורמלין באישור משרד הבריאות, כימיה מתקדמת וגוונים טבעיים בטכניקות המובילות בעולם.`,
    services: [
      { id: 'srv-1', name: 'החלקה אורגנית משקמת פרימיום', price: 550, duration: 120, description: 'פורמולה טבעית ללא פורמלין, מועשרת בחומצות אמינו ומעניקה ברק מושלם', popular: true },
      { id: 'srv-2', name: 'גוונים / בליאז׳ / אומברה', price: 420, duration: 90, description: 'טכניקת פיזור טבעית בהתאמה אישית לגוון העור ומבנה הפנים', popular: true },
      { id: 'srv-3', name: 'תספורת נשים ועיצוב קצוות', price: 120, duration: 45, description: 'כולל חפיפה טיפולית, מסכה מזינה והתאמת דירוג אישי', popular: false },
      { id: 'srv-4', name: 'פן מקצועי ועיצוב תסרוקת VIP', price: 80, duration: 30, description: 'פן עמיד ומבריק עם חומרי הזנה וברק יוקרתיים', popular: false },
    ],
    testimonials: (owner, city) => [
      { id: 't1', name: 'מיכל שטרן', comment: `ההחלקה הכי טובה שעשיתי בחיים! השיער נשאר חלק, רך וזוהר כבר 4 חודשים. ממליצה על ${owner} בחום!`, rating: 5, timeAgo: 'לפני 4 ימים', serviceUsed: 'החלקה אורגנית משקמת' },
      { id: 't2', name: 'שירה אברהם', comment: 'הגוונים יצאו פשוט מושלמים! בדיוק כמו בתמונות שרציתי. יחס חם ואווירה נעימה.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'גוונים / בליאז׳' },
      { id: 't3', name: 'נועה ברק', comment: 'שירות מכל הלב, ידי זהב ומקצוענות ללא פשרות. הסלון הכי שווה ב' + city + '!', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'תספורת נשים' },
    ],
    faqs: (owner, city) => [
      { question: 'האם ההחלקות מאושרות ע״י משרד הבריאות?', answer: 'כן, כל החומצות והחומרים בהם אנו משתמשים הינם 100% מאושרים ובטוחים לשימוש.' },
      { question: 'איך לשמור על ההחלקה לאורך זמן?', answer: 'אנו ממליצים על שימוש בשמפו ומסכה ללא מלחים אותם ניתן לרכוש גם ישירות אצלנו בסלון.' },
      { question: 'כמה זמן מראש צריך לשריין תור להחלקה?', answer: 'החלקות דורשות זמן עבודה ממושך, לכן מומלץ לשריין לפחות 3-5 ימים מראש.' },
      { question: 'אילו אמצעי תשלום מתקבלים?', answer: 'מזומן, אשראי (חלוקה לתשלומים בהחלקות), Bit ו-Apple Pay.' },
    ],
  },

  'luxury-vip': {
    id: 'luxury-vip',
    name: 'סטודיו בוטיק יוקרתי VIP',
    badge: 'בוטיק יוקרה VIP',
    icon: '👑',
    description: 'מתאים לסטודיו פרימיום, טיפולי פנים, חבילות יוקרה וטיפוח לגבר ולאישה',
    defaultColor: '#10B981',
    slogan: (owner, city) => `חוויית טיפוח ועיצוב שיער אקסקלוסיבית באווירת בוטיק יוקרתית ב${city || 'ישראל'}`,
    announcement: (owner, city) => `💎 חוויית אירוח VIP מלאה, קפה מובחר וטיפולים בלעדיים – שריינו מראש!`,
    bio: (owner, city, bizName, exp) => `ב-${bizName} אנו הופכים כל תספורת לחוויית פינוק מושלמת. ${owner} מוביל סטנדרט חדש של אירוח: טיפולי מגבת חמה, טיפולי פנים מטהרים, מוצרי פרימיום עולמיים ויחס אקסקלוסיבי לכל לקוח.`,
    services: [
      { id: 'srv-1', name: 'חבילת Platinum VIP לגבר', price: 150, duration: 60, description: 'תספורת פייד, פיסול זקן, מסכה שחורה מטהרת, טיפול מגבות חמות וקרם עיסוי', popular: true },
      { id: 'srv-2', name: 'תספורת Executive Signature', price: 90, duration: 35, description: 'דירוג מדויק ומותאם אישית, שטיפה כפולה ועיצוב במוצרי יוקרה', popular: true },
      { id: 'srv-3', name: 'טיפול פנים ופילינג עמוק', price: 70, duration: 25, description: 'ניקוי נקבוביות, מסכת לחות עשירה ועיסוי מרענן לקרקפת', popular: false },
      { id: 'srv-4', name: 'עיצוב זקן ושפם Signature', price: 50, duration: 25, description: 'תיחום גיאומטרי מדויק, שמני ארגן מזינים ומגבת ארומטית', popular: false },
    ],
    testimonials: (owner, city) => [
      { id: 't1', name: 'דניאל מזרחי', comment: `חבילת הפלטינום היא הרמה הכי גבוהה שנתקלתי בה בישראל. שירות מדהים ופינוק אמיתי אצל ${owner}!`, rating: 5, timeAgo: 'לפני יומיים', serviceUsed: 'חבילת Platinum VIP' },
      { id: 't2', name: 'איתי קליין', comment: 'סטודיו ברמה אירופאית! מקום יפהפה, נקי, קפה טעים וידיים של אמן.', rating: 5, timeAgo: 'לפני 5 ימים', serviceUsed: 'תספורת Executive' },
      { id: 't3', name: 'גיא פרידמן', comment: 'הדיוק והירידה לפרטים כאן היא משהו נדיר. שווה כל שקל!', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'חבילת Platinum VIP' },
    ],
    faqs: (owner, city) => [
      { question: 'מה כוללת חוויית ה-VIP בסטודיו?', answer: 'כל לקוח נהנה מחוויית אירוח אישית, משקאות פרימיום, טיפולי מגבת חמה ומוצרי טיפוח מובחרים.' },
      { question: 'האם יש פרטיות במהלך הטיפול?', answer: 'כן, הסטודיו מתוכנן במתכונת בוטיק אינטימית ללא צפיפות ועומס.' },
      { question: 'האם ניתן לרכוש שובר מתנה?', answer: 'בהחלט! ניתן לרכוש שובר חוויית VIP דיגיטלי מתנה ליום הולדת או אירוע מיוחד.' },
      { question: 'היכן ממוקם הסטודיו?', answer: `הסטודיו ממוקם במיקום מרכזי ונגיש ב${city} עם חניה נוחה.` },
    ],
  },

  'unisex-family': {
    id: 'unisex-family',
    name: 'מספרת יוניסקס ומשפחה',
    badge: 'מספרה לכל המשפחה',
    icon: '✂️',
    description: 'מתאים למספרות שכונתיות, גברים, נשים, ילדים ונוער באווירה חמה ונגישה',
    defaultColor: '#3B82F6',
    slogan: (owner, city) => `עיצוב שיער מקצועי לכל המשפחה – גברים, נשים וילדים באווירה חמה ב${city || 'ישראל'}`,
    announcement: (owner, city) => `👨‍👩‍👧 מבצע משפחתי: 15% הנחה על כל תספורת שנייה ומעלה באותו היום!`,
    bio: (owner, city, bizName, exp) => `ב-${bizName} אנו מעניקים חוויית מספרה חמה, סבלנית ומקצועית לכל המשפחה. ${owner} והצוות מקפידים על מחירים הוגנים, יחס אוהב לילדים, ועיצוב תספורות עדכניות לכל הגילאים.`,
    services: [
      { id: 'srv-1', name: 'תספורת גברים / דירוג מודרני', price: 75, duration: 30, description: 'תספורת גברים אופנתית כולל חפיפה ועיצוב', popular: true },
      { id: 'srv-2', name: 'תספורת נשים ועיצוב', price: 110, duration: 40, description: 'תספורת, התאמת קצוות וחפיפה עם מסכה', popular: true },
      { id: 'srv-3', name: 'תספורת ילדים ונוער', price: 60, duration: 25, description: 'תספורת סבלנית וכיפית עם יחס חם לילדים', popular: false },
      { id: 'srv-4', name: 'פן / עיצוב תסרוקת מהיר', price: 70, duration: 25, description: 'פן חלק או גלי עמיד ומעוצב', popular: false },
    ],
    testimonials: (owner, city) => [
      { id: 't1', name: 'קרן דהן', comment: `הספר היחיד שהילד שלי יושב אצלו בשקט ומחייך! סבלנות מדהימה ויחס נדיר תודה ל${owner}.`, rating: 5, timeAgo: 'לפני 3 ימים', serviceUsed: 'תספורת ילדים' },
      { id: 't2', name: 'אביב גבאי', comment: 'תספורת גברים מעולה ומחיר הכי הוגן באזור. מומלץ מאוד!', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'תספורת גברים' },
      { id: 't3', name: 'מיכל לוין', comment: 'מקום נעים, נקי ותמיד מקבלים אותך עם חיוך. מספרה משפחתית אמיתית!', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'תספורת נשים' },
    ],
    faqs: (owner, city) => [
      { question: 'האם מתאים לילדים קטנים?', answer: 'בהחלט! יש לנו ניסיון רב וסבלנות גדולה עם פעוטות וילדים בכל הגילאים.' },
      { question: 'האם אפשר לקבוע תור משפחתי ברצף?', answer: 'כן, ניתן לבחור מספר תורים ברצף עבור בני המשפחה במערכת ההזמנות.' },
      { question: 'אילו אמצעי תשלום מקבלים?', answer: 'אנו מקבלים מזומן, אשראי, Bit, PayBox ו-Apple Pay.' },
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
  archetypeId?: string;
  themeColor?: string;
  plan?: 'pro' | 'starter' | 'enterprise';
  instagramHandle?: string;
  branches?: BranchItem[];
  services?: ServiceItem[];
}): BusinessConfig {
  const cleanSlug = params.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
  const archetype = BUSINESS_ARCHETYPES[params.archetypeId || 'mens-barbershop'] || BUSINESS_ARCHETYPES['mens-barbershop'];
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
    instagramHandle: params.instagramHandle || `@${cleanSlug}_barber`,
    services: params.services && params.services.length > 0 ? params.services : archetype.services,
    branches: params.branches && params.branches.length > 0 ? params.branches : [defaultBranch],
    testimonials: archetype.testimonials(owner, city),
    faqs: archetype.faqs(owner, city),
  };
}
