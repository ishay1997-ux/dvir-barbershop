import { BusinessConfig, ServiceItem, FaqItem } from '@/types/business';
import { TransformationItem } from '@/lib/types';

export interface IndustryPreset {
  id: string;
  name: string;
  categoryName: string;
  icon: string;
  badge: string;
  description: string;
  themeColor: string;
  bgTheme: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon' | 'lavender-mist' | 'botanical-sage';
  heroStyle: 'hub-monogram' | 'split-cinema' | 'minimalist-vip';
  servicesStyle: 'split-gallery' | 'cards-grid' | 'compact-menu';
  galleryStyle: 'before-after-slider' | 'instagram-masonry' | 'ambient-carousel';
  showBeforeAfter?: boolean;
  showBio?: boolean;
  showBranches?: boolean;
  borderRadius: 'modern-rounded' | 'sharp-luxury' | 'classic-soft';
  cardRadius?: 'sharp' | 'smooth' | 'pill';
  fontStyle: 'modern-sans' | 'urban-bold' | 'luxury-serif';
  typographyMood?: 'modern-clean' | 'luxury-serif' | 'urban-bold';
  shopName: string;
  ownerName: string;
  slogan: string;
  announcement: string;
  trustBadges: string[];
  services: ServiceItem[];
  faqs: FaqItem[];
  transformations?: TransformationItem[];
  sectionsOrder?: any[];
  sectionTitles?: {
    services?: string;
    servicesSubtitle?: string;
    gallery?: string;
    bio?: string;
    branches?: string;
    reviews?: string;
    faqs?: string;
    trustBadges?: string;
    policies?: string;
  };
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
    galleryStyle: 'before-after-slider',
    showBeforeAfter: true,
    showBio: true,
    showBranches: true,
    borderRadius: 'modern-rounded',
    fontStyle: 'urban-bold',
    shopName: 'המספרה של דביר',
    ownerName: 'דביר',
    slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר בישראל',
    announcement: '🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7 – שריינו מקום מראש!',
    sectionsOrder: ['hero', 'announcement', 'trust-badges', 'services', 'gallery', 'bio', 'policies', 'branches', 'reviews', 'faqs'],
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
    id: 'cosmetics-aesthetician',
    name: 'קוסמטיקה פרא-רפואית ואסתטיקה',
    categoryName: 'קוסמטיקה ועור',
    icon: '🌸',
    badge: 'P.M.E Clinical Skincare & Aesthetics',
    description: 'אווירת Lavender Mist יוקרתית, אבחון עור קליני, טיפולי אקנה ופיגמנטציה, וסליידר תוצאות לפני/אחרי.',
    themeColor: '#EC4899', // Rose Velvet / Blush
    bgTheme: 'lavender-mist',
    heroStyle: 'split-cinema',
    servicesStyle: 'cards-grid',
    galleryStyle: 'before-after-slider',
    showBeforeAfter: true,
    showBio: true,
    showBranches: false,
    borderRadius: 'classic-soft',
    fontStyle: 'luxury-serif',
    typographyMood: 'luxury-serif',
    shopName: 'קליניקת Glow & Skin | קוסמטיקה פרא-רפואית',
    ownerName: 'שירן כהן (P.M.E)',
    slogan: 'קוסמטיקה פרא-רפואית מתקדמת, אבחון עור קליני, שיקום אקנה והבהרת פיגמנטציה',
    announcement: '✨ אבחון עור קליני והתאמת שגרת טיפוח אישית – שרייני תור אונליין 24/7!',
    sectionsOrder: ['announcement', 'hero', 'trust-badges', 'services', 'gallery', 'bio', 'policies', 'reviews', 'faqs'],
    transformations: [
      {
        id: 'c1',
        title: 'שיקום עור אקנאי ואיזון בלוטות שומן',
        category: 'טיפול אקנה פרא-רפואי',
        description: 'תהליך ריפוי דלקות פעילות והאחדת מרקם העור לאחר 4 מפגשים קליניים.',
        beforeGradient: 'from-stone-900 via-rose-950 to-stone-900',
        afterGradient: 'from-rose-900 via-pink-800 to-rose-700',
      },
      {
        id: 'c2',
        title: 'הבהרת כתמי פיגמנטציה ופוסט-אקנה',
        category: 'פילינג חומצות משולב',
        description: 'פילינג מותאם אישית בשילוב חומצות אלפא-הידרוקסי להבהרה אחידה וזוהרת.',
        beforeGradient: 'from-zinc-900 via-neutral-900 to-stone-900',
        afterGradient: 'from-fuchsia-950 via-pink-900 to-rose-700',
      },
      {
        id: 'c3',
        title: 'חידוש והצערת עור הפנים (Glow Rejuvenation)',
        category: 'אנטי-אייג׳ינג & מזותרפיה',
        description: 'החדרת פפטידים וחומצה היאלורונית למיצוק העור וטשטוש קמטוטים.',
        beforeGradient: 'from-neutral-900 via-zinc-800 to-stone-900',
        afterGradient: 'from-pink-950 via-rose-900 to-purple-800',
      },
    ],
    trustBadges: [
      'הסמכה פרא-רפואית בכירה P.M.E',
      'חומרים פעילים באישור משרד הבריאות',
      'מכשור טכנולוגי מתקדם לחידוש העור',
      'סטריליזציה רפואית באוטוקלאב (Autoclave)',
      'דירוג 5.0★ (340+ מטופלות מרוצות)',
    ],
    services: [
      { id: 'srv-cos-1', name: 'טיפול פנים עמוק & אבחון עור קליני', price: 350, duration: 60, description: 'ניקוי עמוק, ניקוז קומדונים, החדרת לחויות עמוקה והרגעת העור בחומרים פעילים' },
      { id: 'srv-cos-2', name: 'טיפול שיקום אקנה ואיזון סבום', price: 420, duration: 75, description: 'פרוטוקול טיפולי קליני להפחתת דלקות, ויסות בלוטות החלב ושיקום מחסום העור' },
      { id: 'srv-cos-3', name: 'הבהרת פיגמנטציה & פילינג חומצות', price: 480, duration: 60, description: 'קילוף מבוקר של שכבות העור העליונות, פירוק מלנין והבהרת כתמי שמש וגיל' },
      { id: 'srv-cos-4', name: 'אנטי-אייג׳ינג פרימיום & מזותרפיה', price: 650, duration: 90, description: 'מיקרונידלינג מתקדם להמרצת קולגן ואלסטין, מיצוק וטשטוש קמטוטים' },
      { id: 'srv-cos-5', name: 'הרמת ריסים והזנת קרטין', price: 220, duration: 45, description: 'הדגשה והרמה טבעית של הריסים עם סרום קרטין מזין ל-8 שבועות' },
      { id: 'srv-cos-6', name: 'עיצוב ושיקום גבות בשיטת השערה', price: 120, duration: 30, description: 'פיסול והתאמה למבנה הפנים, צביעה בחומרים צמחיים ושיקום צמיחה' },
    ],
    faqs: [
      { id: 'faq-cos-1', question: 'מה כולל הטיפול הראשון בקליניקה?', answer: 'כל טיפול ראשון נפתח באבחון קליני מעמיק של סוג העור, תשאול רפואי ובניית תוכנית טיפול אישית ושגרת בית.' },
      { id: 'faq-cos-2', question: 'מתי רואים תוצאות בטיפולי אקנה או פיגמנטציה?', answer: 'שיפור ברמת הדלקת והברק נראה כבר מהטיפול הראשון. שיקום יסודי מתרחש בהדרגה לאורך סדרת טיפולים.' },
      { id: 'faq-cos-3', question: 'האם הטיפולים מתאימים בהריון או הנקה?', answer: 'בהחלט! אנו מתאימים פרוטוקול טיפולי בטוח ללא חומצות אגרסיביות או רטינול.' },
      { id: 'faq-cos-4', question: 'האם הטיפול כואב?', answer: 'הטיפולים מבוצעים בעדינות מרבית, עם טכניקות הרגעה והכנת העור למניעת כאב או אי נוחות.' },
    ],
    policies: {
      cancellationNotice: 'ביטול או שינוי תור עד 24 שעות מראש ללא עלות',
      arrivalTime: 'נא להגיע כ-5 דקות לפני הזמן ללא איפור',
      paymentMethods: 'Bit, Apple Pay, אשראי והעברה בנקאית',
      customNote: 'חובה לדווח על נטילת רואקוטן או הריון. יש להימנע מחשיפה לשמש 48 שעות לאחר הטיפול',
    },
  },
  {
    id: 'nails-beauty',
    name: 'קוסמטיקה, ציפורניים וריסים',
    categoryName: 'קוסמטיקה ויופי',
    icon: '💅',
    badge: 'Lavender Luxury Beauty Boutique',
    description: 'אווירת בוטיק לילך ולבנדר יוקרתית, גלריית אינסטגרם עשירה, מבנה אנטומי וטיפולי פנים.',
    themeColor: '#8B5CF6', // Royal Lilac & Lavender
    bgTheme: 'lavender-mist',
    heroStyle: 'split-cinema',
    servicesStyle: 'cards-grid',
    galleryStyle: 'instagram-masonry',
    showBeforeAfter: true,
    showBio: true,
    showBranches: false,
    borderRadius: 'classic-soft',
    fontStyle: 'luxury-serif',
    shopName: 'סטודיו שירן ביוטי & בוטיק',
    ownerName: 'שירן',
    slogan: 'עיצוב ציפורניים במבנה אנטומי, הרמת ריסים וטיפולי פנים מתקדמים',
    announcement: '🌸 מבצע חודשי: 10% הנחה על טיפול פנים משולב למצטרפות חדשות!',
    sectionsOrder: ['announcement', 'hero', 'trust-badges', 'gallery', 'services', 'bio', 'policies', 'reviews', 'faqs'],
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
    badge: 'Holistic Botanical Wellness Spa',
    description: 'גווני מרווה ומנטה בוטנית, קרוסלת חדרי טיפול מרגיעה ועיסויי גוף עמוקים לגוף ולנפש.',
    themeColor: '#059669', // Botanical Sage Green
    bgTheme: 'botanical-sage',
    heroStyle: 'minimalist-vip',
    servicesStyle: 'cards-grid',
    galleryStyle: 'ambient-carousel',
    showBeforeAfter: true,
    showBio: true,
    showBranches: true,
    borderRadius: 'classic-soft',
    fontStyle: 'modern-sans',
    shopName: 'ספא לוטוס – בית למנוחה ומרגוע',
    ownerName: 'מיכל',
    slogan: 'עיסויים מקצועיים, שחרור שרירים עמוק ופינוק הוליסטי לגוף ולנפש',
    announcement: '🌿 חבילת פינוק זוגית כוללת שמנים ארומטיים וכיבוד – להזמנה ישירה',
    sectionsOrder: ['announcement', 'hero', 'trust-badges', 'gallery', 'services', 'bio', 'policies', 'reviews', 'faqs'],
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
    description: 'מראה Cyber Carbon שחור מוחלט, גלריית עבודות Custom Art ופירסינג סטרילי.',
    themeColor: '#A855F7', // Royal Violet / Neon
    bgTheme: 'cyber-carbon',
    heroStyle: 'split-cinema',
    servicesStyle: 'cards-grid',
    galleryStyle: 'instagram-masonry',
    showBeforeAfter: true,
    showBio: false,
    showBranches: false,
    borderRadius: 'sharp-luxury',
    fontStyle: 'urban-bold',
    shopName: 'סטודיו בלאק אינק טאטו',
    ownerName: 'רון',
    slogan: 'קעקועים מותאמים אישית (Custom Art), כיסויים (Cover-up) ופירסינג מקצועי',
    announcement: '🔥 שריינו סקיצה אישית לפרויקטים גדולים – ייעוץ ראשוני ללא עלות!',
    sectionsOrder: ['hero', 'trust-badges', 'gallery', 'services', 'policies', 'reviews', 'faqs'],
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
    description: 'מראה ירוק אמרלד ספורטיבי, סליידר תוצאות גוף וחיטוב, תוכניות VIP ותזונה.',
    themeColor: '#10B981', // Cyber Emerald
    bgTheme: 'dark-obsidian',
    heroStyle: 'split-cinema',
    servicesStyle: 'cards-grid',
    galleryStyle: 'before-after-slider',
    showBeforeAfter: true,
    showBio: true,
    showBranches: false,
    borderRadius: 'modern-rounded',
    fontStyle: 'urban-bold',
    shopName: 'סטודיו אופק – אימונים אישיים',
    ownerName: 'אופק',
    slogan: 'אימוני כושר אישיים, חיטוב והעלאת מסת שריר בליווי תזונתי מדויק',
    announcement: '💪 הצטרפו עכשיו לתוכנית הליווי הממוקדת לחיטוב הגוף – מספר מקומות מוגבל!',
    sectionsOrder: ['hero', 'announcement', 'trust-badges', 'services', 'gallery', 'bio', 'reviews', 'faqs', 'policies'],
    transformations: [
      {
        id: '1',
        title: 'חיטוב גוף מלא וירידה ב-8% שומן',
        category: 'תוכנית ליווי 90 יום',
        description: 'תהליך חיטוב ממוקד המשלב אימוני כוח אישיים ותפריט תזונה עשיר בחלבון.',
        beforeGradient: 'from-stone-900 via-stone-800 to-zinc-900',
        afterGradient: 'from-emerald-950 via-teal-900 to-emerald-700',
      },
      {
        id: '2',
        title: 'עלייה במסת שריר ושיפור יציבה',
        category: 'אימוני היפרטרופיה',
        description: 'עלייה של 4.5 ק״ג מסת שריר נקייה, חיזוק חגורת הכתפיים ושרירי הליבה.',
        beforeGradient: 'from-zinc-900 via-neutral-900 to-stone-900',
        afterGradient: 'from-teal-950 via-emerald-900 to-teal-700',
      },
      {
        id: '3',
        title: 'הצרת היקפים ובטן חטובה',
        category: 'חיטוב פונקציונלי',
        description: 'ירידה של 7 ס״מ בהיקף המותניים ושיפור דרמטי בסיבולת לב-ריאה.',
        beforeGradient: 'from-neutral-900 via-zinc-800 to-stone-900',
        afterGradient: 'from-emerald-900 via-teal-800 to-emerald-600',
      },
    ],
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
    description: 'מראה Brand Midnight כחול-ספיר יוקרתי, תוצאות הזרקות וטיפולי פנים רפואיים.',
    themeColor: '#0EA5E9', // Electric Blue / Sapphire
    bgTheme: 'brand-midnight',
    heroStyle: 'minimalist-vip',
    servicesStyle: 'cards-grid',
    galleryStyle: 'before-after-slider',
    showBeforeAfter: true,
    showBio: true,
    showBranches: false,
    borderRadius: 'classic-soft',
    fontStyle: 'modern-sans',
    shopName: 'קליניקת ד״ר לוי לאסתטיקה רפואית',
    ownerName: 'ד״ר לוי',
    slogan: 'רפואה אסתטית מתקדמת, פיסול פנים, בוטוקס וחומצה היאלורונית',
    announcement: '💎 ייעוץ ואבחון פנים מקצועי ללא עלות בהרשמה מראש דרך האתר',
    sectionsOrder: ['hero', 'announcement', 'trust-badges', 'gallery', 'services', 'bio', 'policies', 'reviews', 'faqs'],
    transformations: [
      {
        id: '1',
        title: 'טיפול פנים זוהר והעלמת פיגמנטציה',
        category: 'פרוטוקול Glow רפואי',
        description: 'חידוש מרקם העור, אחידות גוון הפנים והחזרת הברק הטבעי.',
        beforeGradient: 'from-slate-900 via-zinc-900 to-slate-950',
        afterGradient: 'from-sky-950 via-blue-900 to-sky-700',
      },
      {
        id: '2',
        title: 'פיסול ועיבוי שפתיים סימטרי',
        category: 'חומצה היאלורונית פרימיום',
        description: 'עיצוב קווי מתאר עדינים והענקת נפח טבעי ומחמיא במיוחד.',
        beforeGradient: 'from-slate-900 via-neutral-900 to-zinc-900',
        afterGradient: 'from-blue-950 via-indigo-900 to-sky-700',
      },
      {
        id: '3',
        title: 'טשטוש קמטי הבעה במצח',
        category: 'בוטוקס רפואי מדויק',
        description: 'מראה מצח חלק, פתוח ורענן תוך שמירה מלאה על הבעות הפנים הטבעיות.',
        beforeGradient: 'from-zinc-900 via-slate-900 to-stone-900',
        afterGradient: 'from-sky-900 via-blue-800 to-indigo-700',
      },
    ],
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
    description: 'מראה נקי, הגעה מהירה, שקיפות מחירים מלאה, אחריות בכתב ואזורי שירות.',
    themeColor: '#F59E0B', // Amber Bronze
    bgTheme: 'dark-obsidian',
    heroStyle: 'split-cinema',
    servicesStyle: 'compact-menu',
    galleryStyle: 'compact-menu' as any,
    showBeforeAfter: false, // Technicians do not have haircut/makeup sliders
    showBio: false,
    showBranches: true,
    borderRadius: 'sharp-luxury',
    fontStyle: 'modern-sans',
    shopName: 'שרון שירותי מיזוג וחשמל',
    ownerName: 'שרון',
    slogan: 'התקנה ותיקון מזגנים, פתרונות חשמל מתקדמים ושירות מהיר ואמין',
    announcement: '⚡ זמינות להגעת חירום באזור המרכז תוך 60 דקות – התקשרו עכשיו!',
    sectionsOrder: ['hero', 'announcement', 'trust-badges', 'services', 'branches', 'policies', 'reviews', 'faqs'],
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
