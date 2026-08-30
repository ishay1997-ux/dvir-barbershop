import { IndustryPreset } from './types';
import { INDUSTRY_MEDIA_MAP } from '@/lib/industry-media';

export const tattooPiercingPreset: IndustryPreset = {
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
  heroImages: INDUSTRY_MEDIA_MAP.tattoo_piercing.heroImages,
  galleryImages: INDUSTRY_MEDIA_MAP.tattoo_piercing.galleryPhotos.map((p) => p.src),
  avatarUrl: INDUSTRY_MEDIA_MAP.tattoo_piercing.avatarUrl,
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
};
