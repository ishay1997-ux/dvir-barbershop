import { BusinessCategory } from '@/types/business';

export interface CategoryTerminology {
  staffSingular: string;      // ספר / קוסמטיקאית / טכנאי / מטפל / מאמן
  staffPlural: string;        // ספרים / צוות הקליניקה / טכנאים / מטפלים / מאמנים
  serviceSingular: string;    // תספורת / טיפול / קריאת שירות / טיפול / אימון
  servicePlural: string;      // שירותים ומחירון / טיפולים ומחירון / מחירון שירותים
  bookingAction: string;      // קביעת תור / הזמנת תור / הזמנת שירות / שריין אימון
  placeSingular: string;      // המספרה / הקליניקה / העסק / המרכז / הסטודיו
  defaultRole: string;        // מאסטר ברבר / קוסמטיקאית בכירה / טכנאי מוסמך / מטפל מוסמך
  icon: string;               // 💈 / 💅 / 🔧 / 🌿 / 🏋️
}

/**
 * Returns dynamic Hebrew terminology and microcopy tailored for any business category
 */
export function getCategoryTerminology(category?: BusinessCategory): CategoryTerminology {
  switch (category) {
    case 'beauty_salon':
      return {
        staffSingular: 'קוסמטיקאית',
        staffPlural: 'צוות הקליניקה',
        serviceSingular: 'טיפול',
        servicePlural: 'טיפולים ומחירון',
        bookingAction: 'קביעת תור',
        placeSingular: 'הקליניקה',
        defaultRole: 'קוסמטיקאית בכירה',
        icon: '💅',
      };
    case 'home_technician':
      return {
        staffSingular: 'טכנאי',
        staffPlural: 'טכנאים מוסמכים',
        serviceSingular: 'שירות',
        servicePlural: 'מחירון שירותים',
        bookingAction: 'הזמנת שירות לבית',
        placeSingular: 'החברה',
        defaultRole: 'טכנאי מוסמך',
        icon: '🔧',
      };
    case 'clinic_therapist':
      return {
        staffSingular: 'מטפל',
        staffPlural: 'צוות המטפלים',
        serviceSingular: 'טיפול',
        servicePlural: 'טיפולים ומחירון',
        bookingAction: 'קביעת טיפול',
        placeSingular: 'הקליניקה',
        defaultRole: 'מטפל מוסמך',
        icon: '🌿',
      };
    case 'private_instructor':
      return {
        staffSingular: 'מאמן',
        staffPlural: 'מאמנים',
        serviceSingular: 'אימון',
        servicePlural: 'חבילות ואימונים',
        bookingAction: 'שריין אימון',
        placeSingular: 'הסטודיו',
        defaultRole: 'מאמן מוסמך',
        icon: '🏋️',
      };
    case 'barber':
    default:
      return {
        staffSingular: 'ספר',
        staffPlural: 'ספרים',
        serviceSingular: 'תספורת',
        servicePlural: 'שירותים ומחירון',
        bookingAction: 'קביעת תור',
        placeSingular: 'המספרה',
        defaultRole: 'מאסטר ברבר',
        icon: '💈',
      };
  }
}
