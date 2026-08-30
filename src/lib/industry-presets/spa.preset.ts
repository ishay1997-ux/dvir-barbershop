import { IndustryPreset } from './types';
import { INDUSTRY_MEDIA_MAP } from '@/lib/industry-media';

export const spaMassagePreset: IndustryPreset = {
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
  heroImages: INDUSTRY_MEDIA_MAP.clinic_therapist.heroImages,
  galleryImages: INDUSTRY_MEDIA_MAP.clinic_therapist.galleryPhotos.map((p) => p.src),
  avatarUrl: INDUSTRY_MEDIA_MAP.clinic_therapist.avatarUrl,
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
};
