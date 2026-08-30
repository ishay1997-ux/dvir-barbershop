import { IndustryPreset } from './types';
import { INDUSTRY_MEDIA_MAP } from '@/lib/industry-media';

export const homeTechnicianPreset: IndustryPreset = {
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
  heroImages: INDUSTRY_MEDIA_MAP.home_technician.heroImages,
  galleryImages: INDUSTRY_MEDIA_MAP.home_technician.galleryPhotos.map((p) => p.src),
  avatarUrl: INDUSTRY_MEDIA_MAP.home_technician.avatarUrl,
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
};
