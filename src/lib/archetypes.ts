import {
  BusinessConfig,
  ServiceItem,
  BranchItem,
  TestimonialItem,
  FaqItem,
  BusinessCategory,
} from '@/types/business';
import { INDUSTRY_MEDIA_MAP } from '@/lib/industry-media';

export interface BusinessArchetype {
  id: string;
  category: BusinessCategory;
  name: string;
  badge: string;
  icon: string;
  description: string;
  defaultColor: string;
  heroImages?: string[];
  galleryImages?: string[];
  avatarUrl?: string;
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
    id: 'amber',
    name: 'קופר & שקיעה · Sunset Amber',
    color: '#F59E0B',
    gradient: 'from-[#FDE68A] via-[#F59E0B] to-[#B45309]',
    bgTint: 'rgba(245, 158, 11, 0.12)',
    borderTint: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'teal',
    name: 'טורקיז מנטה · Nordic Teal',
    color: '#14B8A6',
    gradient: 'from-[#99F6E4] via-[#14B8A6] to-[#0F766E]',
    bgTint: 'rgba(20, 184, 166, 0.12)',
    borderTint: 'rgba(20, 184, 166, 0.35)',
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
    heroImages: INDUSTRY_MEDIA_MAP.barber.heroImages,
    galleryImages: INDUSTRY_MEDIA_MAP.barber.galleryPhotos.map((p) => p.src),
    avatarUrl: INDUSTRY_MEDIA_MAP.barber.avatarUrl,
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

  'cosmetics-aesthetician': {
    id: 'cosmetics-aesthetician',
    category: 'cosmetics_aesthetician' as any,
    name: 'קליניקה לקוסמטיקה פרא-רפואית ואסתטיקה',
    badge: 'קוסמטיקה פרא-רפואית',
    icon: '🌸',
    description: 'מתאים לקוסמטיקאיות פרא-רפואיות (P.M.E), אבחון עור קליני, טיפולי אקנה, פיגמנטציה ואנטי-אייג׳ינג',
    defaultColor: '#EC4899',
    heroImages: INDUSTRY_MEDIA_MAP.cosmetics_aesthetician.heroImages,
    galleryImages: INDUSTRY_MEDIA_MAP.cosmetics_aesthetician.galleryPhotos.map((p) => p.src),
    avatarUrl: INDUSTRY_MEDIA_MAP.cosmetics_aesthetician.avatarUrl,
    slogan: (owner, city) => `קוסמטיקה פרא-רפואית מתקדמת, אבחון עור קליני, שיקום אקנה והבהרת פיגמנטציה ב${city || 'ישראל'}`,
    announcement: (owner, city) => `✨ אבחון עור קליני והתאמת שגרת טיפוח אישית בקליניקה ב${city || 'ישראל'} – שרייני תור אונליין!`,
    bio: (owner, city, bizName) => `ב-${bizName} אנו מאמינים שבריאות העור היא הבסיס ליופי אמיתי. ${owner} מתמחה באבחון קליני מעמיק, שיקום פגמי עור, החדרת חומרים פעילים ומכשור טכנולוגי מתקדם בתקנים המחמירים ביותר.`,
    services: [
      { id: 'srv-1', name: 'טיפול פנים עמוק & אבחון עור קליני', price: 350, duration: 60, description: 'ניקוי עמוק, ניקוז קומדונים, החדרת לחויות עמוקה והרגעת העור בחומרים פעילים', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 15 },
      { id: 'srv-2', name: 'טיפול שיקום אקנה ואיזון סבום', price: 420, duration: 75, description: 'פרוטוקול טיפולי קליני להפחתת דלקות, ויסות בלוטות החלב ושיקום מחסום העור', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 15 },
      { id: 'srv-3', name: 'הבהרת פיגמנטציה & פילינג חומצות', price: 480, duration: 60, description: 'קילוף מבוקר של שכבות העור העליונות, פירוק מלנין והבהרת כתמי שמש וגיל', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 15 },
      { id: 'srv-4', name: 'אנטי-אייג׳ינג פרימיום & מזותרפיה', price: 650, duration: 90, description: 'מיקרונידלינג מתקדם להמרצת קולגן ואלסטין, מיצוק וטשטוש קמטוטים', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 20 },
      { id: 'srv-5', name: 'הרמת ריסים והזנת קרטין', price: 220, duration: 45, description: 'הדגשה והרמה טבעית של הריסים עם סרום קרטין מזין ל-8 שבועות', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 10 },
      { id: 'srv-6', name: 'עיצוב ושיקום גבות בשיטת השערה', price: 120, duration: 30, description: 'פיסול והתאמה למבנה הפנים, צביעה בחומרים צמחיים ושיקום צמיחה', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 5 },
    ],
    testimonials: (owner) => [
      { id: 't1', name: 'עדי שפירא', comment: `הגעתי עם אקנה קשה שאף אחד לא הצליח לפתור. אחרי 3 טיפולים אצל ${owner} העור שלי פשוט חלק ומבריק!`, rating: 5, timeAgo: 'לפני 3 ימים', serviceUsed: 'טיפול שיקום אקנה' },
      { id: 't2', name: 'מאיה אלון', comment: 'הקליניקה הכי נקייה ומקצועית שיש, טיפול הפנים נתן לי זוהר מטורף לחתונה.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'טיפול פנים עמוק' },
      { id: 't3', name: 'דניאל כהן', comment: 'קוסמטיקאית בחסד עליון, רואים שיש כאן ידע קליני מעמיק ומכשור ברמה הכי גבוהה.', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'אנטי אייג׳ינג ומזותרפיה' },
    ],
    faqs: (owner, city) => [
      { question: 'מה כולל הטיפול הראשון בקליניקה?', answer: `כל טיפול ראשון אצל ${owner} נפתח באבחון קליני מעמיק של סוג העור, תשאול רפואי והתאמת שגרת טיפוח אישית לבית.` },
      { question: 'מתי מתחילים לראות תוצאות בטיפולי אקנה או פיגמנטציה?', answer: 'שיפור ברמת הדלקת והאחידות נראה כבר מהטיפול הראשון. שיקום מלא מתרחש בהדרגה לאורך סדרת טיפולים מותאמת.' },
      { question: 'האם הטיפולים מתאימים בהריון או הנקה?', answer: 'בהחלט! אנו מתאימים פרוטוקול טיפול ייעודי ובטוח ללא חומצות אגרסיביות או רטינול.' },
      { question: 'האם נדרשת הגנה מיוחדת משמש אחרי טיפול?', answer: 'כן, חובה למרוח מקדם הגנה SPF 50 ולהימנע מחשיפה ישירה לשמש וסאונה ב-48 השעות שלאחר הטיפול.' },
    ],
  },
  'beauty-cosmetics': {
    id: 'beauty-cosmetics',
    category: 'beauty_salon',
    name: 'סטודיו למניקור, לק ג׳ל & מבנה אנטומי',
    badge: 'מניקור וציפורניים',
    icon: '💅',
    description: 'מתאים למניקוריסטיות, מכוני לק ג׳ל, מבנה אנטומי, בניית ציפורניים בפוליג׳ל ופדיקור',
    defaultColor: '#8B5CF6',
    heroImages: INDUSTRY_MEDIA_MAP.beauty_salon.heroImages,
    galleryImages: INDUSTRY_MEDIA_MAP.beauty_salon.galleryPhotos.map((p) => p.src),
    avatarUrl: INDUSTRY_MEDIA_MAP.beauty_salon.avatarUrl,
    slogan: (owner, city) => `מניקור רוסי משולב, מבנה אנטומי עמיד ל-4 שבועות ונייל ארט פרימיום ב${city || 'ישראל'}`,
    announcement: (owner, city) => `✨ שרייני תור אונליין למבנה אנטומי ומניקור משולב ב${city || 'ישראל'} – זמינות מיידית!`,
    bio: (owner, city, bizName) => `ב-${bizName} אנו שמים דגש על בריאות הציפורן הטבעית, דיוק כירורגי במניקור רוסי וחיטוי באוטוקלאב רפואי. ${owner} מתמחה במבנה אנטומי מחוזק (Rubber Base), בנייה קלה בפוליג׳ל ונייל ארט טרנדי.`,
    services: [
      { id: 'srv-1', name: 'מניקור משולב & לק ג׳ל במבנה אנטומי', price: 160, duration: 60, description: 'ניקוי קוטיקולה יסודי (מניקור קומבי), חיזוק בסיס רבר גומי ומריחה מדויקת וצמודה לעור', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 10 },
      { id: 'srv-2', name: 'הארכת ציפורניים בפוליג׳ל / ג׳ל טיפס (סט חדש)', price: 260, duration: 90, description: 'בנייה חזקה, קלה וטבעית למראה ציפורניים ארוכות ומעוצבות במיוחד', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 15 },
      { id: 'srv-3', name: 'מילוי וחידוש מבנה אנטומי / בנייה קיימת', price: 170, duration: 60, description: 'הסרה מבוקרת, ניקוי מניקור רוסי מחדש, יישור מבנה אנטומי ומריחת לק חדש', popular: true, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 10 },
      { id: 'srv-4', name: 'פדיקור טיפולי / רפואי משולב ומפנק', price: 190, duration: 50, description: 'הסרת עור יבש וסדוק, גזירה נכונה למניעת ציפורן חודרנית, עיסוי קרם הזנה ומריחה', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 10 },
      { id: 'srv-5', name: 'שדרוג נייל ארט: פרנץ׳ / כרום גלייזד / בייבי בומר', price: 30, duration: 15, description: 'עיצוב אומנותי מדויק על כל הציפורניים בגימור מודרני מרהיב', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 5 },
      { id: 'srv-6', name: 'הסרת לק ג׳ל ישן ממכון אחר', price: 30, duration: 20, description: 'הסרה עדינה ובטוחה בשיוף מבוקר ללא פגיעה בלוחית הציפורן הטבעית', popular: false, bookingType: 'FIXED_SLOT', locationType: 'BUSINESS_LOCATION', bufferAfterMinutes: 5 },
    ],
    testimonials: (owner) => [
      { id: 't1', name: 'רוני כהן', comment: `המבנה האנטומי של ${owner} מחזיק לי חודש שלם בלי שום צ׳יפ! עבודה נקייה ומדויקת להפליא.`, rating: 5, timeAgo: 'לפני 3 ימים', serviceUsed: 'מבנה אנטומי & לק ג׳ל' },
      { id: 't2', name: 'הילה שמש', comment: 'המניקור הכי נקי שעשו לי בחיים! אין פציעות, הציפורניים חזקות ומבריקות.', rating: 5, timeAgo: 'לפני שבוע', serviceUsed: 'בנייה בפוליג׳ל' },
      { id: 't3', name: 'שני מזרחי', comment: 'סטודיו מושלם, סטריליות 100% ושירות מכל הלב. ממליצה בחום!', rating: 5, timeAgo: 'לפני שבועיים', serviceUsed: 'שדרוג פרנץ׳ מדויק' },
    ],
    faqs: (owner, city) => [
      { question: 'מה ההבדל בין לק ג׳ל רגיל למבנה אנטומי?', answer: 'מבנה אנטומי כולל יישור שכבת הבסיס ויצירת קשת Apex במרכז הציפורן, המעניקה עמידות מקסימלית ומגנה על הציפורן הטבעית משבירה.' },
      { question: 'כמה זמן מחזיק מבנה אנטומי?', answer: 'בממוצע 3 עד 4 שבועות של עמידות מושלמת וברק מלא.' },
      { question: 'האם המכשור עובר חיטוי וסטריליזציה?', answer: 'באופן קפדני ביותר. כל הכלים עוברים תהליך חיטוי ועיקור באוטוקלאב רפואי ונפתחים משקית סטרילית מול כל לקוחה.' },
      { question: 'מה עושים אם מגיעים עם לק ממכון אחר?', answer: 'יש לסמן שירות "הסרת לק ג׳ל ממכון אחר" בעת קביעת התור כדי לשריין את הזמן הנדרש להסרה בטוחה.' },
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
    heroImages: INDUSTRY_MEDIA_MAP.home_technician.heroImages,
    galleryImages: INDUSTRY_MEDIA_MAP.home_technician.galleryPhotos.map((p) => p.src),
    avatarUrl: INDUSTRY_MEDIA_MAP.home_technician.avatarUrl,
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
    heroImages: INDUSTRY_MEDIA_MAP.clinic_therapist.heroImages,
    galleryImages: INDUSTRY_MEDIA_MAP.clinic_therapist.galleryPhotos.map((p) => p.src),
    avatarUrl: INDUSTRY_MEDIA_MAP.clinic_therapist.avatarUrl,
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
    heroImages: archetype.heroImages,
    galleryImages: archetype.galleryImages,
    avatarUrl: archetype.avatarUrl,
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
    layout: {
      bgTheme:
        archetypeKey === 'cosmetics-aesthetician' || archetypeKey === 'beauty-cosmetics'
          ? 'lavender-mist'
          : archetypeKey === 'clinic-therapist'
          ? 'botanical-sage'
          : 'dark-obsidian',
      heroStyle:
        archetypeKey === 'cosmetics-aesthetician' || archetypeKey === 'beauty-cosmetics'
          ? 'split-cinema'
          : archetypeKey === 'clinic-therapist'
          ? 'minimalist-vip'
          : 'hub-monogram',
      servicesStyle:
        archetypeKey === 'cosmetics-aesthetician' || archetypeKey === 'beauty-cosmetics'
          ? 'cards-grid'
          : archetypeKey === 'home-technician'
          ? 'compact-menu'
          : 'split-gallery',
      galleryStyle:
        archetypeKey === 'cosmetics-aesthetician'
          ? 'before-after-slider'
          : archetypeKey === 'beauty-cosmetics'
          ? 'instagram-masonry'
          : archetypeKey === 'clinic-therapist'
          ? 'ambient-carousel'
          : 'before-after-slider',
      cardStyle: 'glass',
      borderRadius:
        archetypeKey === 'cosmetics-aesthetician' || archetypeKey === 'beauty-cosmetics' || archetypeKey === 'clinic-therapist'
          ? 'classic-soft'
          : 'modern-rounded',
      fontStyle:
        archetypeKey === 'cosmetics-aesthetician' || archetypeKey === 'beauty-cosmetics'
          ? 'luxury-serif'
          : 'urban-bold',
      showBeforeAfter: true,
      showReviews: true,
      showFaqs: true,
      showBranches: true,
      showBio: true,
    },
  };
}
