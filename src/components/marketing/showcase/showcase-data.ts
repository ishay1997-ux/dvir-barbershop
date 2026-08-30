export interface ShowcaseSite {
  id: string;
  category: string;
  tabLabel: string;
  businessName: string;
  city: string;
  slogan: string;
  themeColor: string;
  bgGradient: string;
  textColor: string;
  badge: string;
  slug: string;
  isLive: boolean;
  services: Array<{ name: string; price: number; time: string }>;
  recentBooking: {
    client: string;
    service: string;
    time: string;
    status: string;
  };
}

export const SHOWCASE_SITES: ShowcaseSite[] = [
  {
    id: 'barber',
    category: 'מספרות גברים וזקן',
    tabLabel: '💈 מספרות',
    businessName: 'המספרה של דביר',
    city: 'אריאל & רחובות',
    slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן פרימיום',
    themeColor: '#C9A84C',
    bgGradient: 'from-amber-950/30 via-slate-900 to-black',
    textColor: 'text-amber-400',
    badge: 'פיילוט חי באוויר 🚀',
    slug: 'dvir',
    isLive: true,
    services: [
      { name: 'תספורת גברים פרימיום', price: 80, time: '30 דק׳' },
      { name: 'עיצוב ופיסול זקן Master', price: 40, time: '20 דק׳' },
      { name: 'חבילת VIP (תספורת + זקן)', price: 110, time: '45 דק׳' },
    ],
    recentBooking: {
      client: 'איתי לוי',
      service: 'תספורת + פיסול זקן',
      time: 'היום בשעה 17:30',
      status: 'אושר בוואטסאפ ✓',
    },
  },
  {
    id: 'beauty',
    category: 'קוסמטיקה וציפורניים',
    tabLabel: '💅 ביוטי וציפורניים',
    businessName: 'סטודיו שירן ביוטי & בוטיק',
    city: 'ראשון לציון',
    slogan: 'עיצוב ציפורניים במבנה אנטומי, הרמת ריסים וטיפולי פנים',
    themeColor: '#EC4899',
    bgGradient: 'from-pink-950/30 via-slate-900 to-black',
    textColor: 'text-pink-400',
    badge: 'אתר הדגמה חי ✨',
    slug: 'beauty',
    isLive: true,
    services: [
      { name: 'מבנה אנטומי & לק ג׳ל פרימיום', price: 160, time: '60 דק׳' },
      { name: 'הארכת ציפורניים בפוליג׳ל', price: 250, time: '90 דק׳' },
      { name: 'הרמת ריסים & בוטוקס', price: 220, time: '50 דק׳' },
    ],
    recentBooking: {
      client: 'נועה שחר',
      service: 'מבנה אנטומי & לק ג׳ל',
      time: 'מחר בשעה 10:00',
      status: 'אושר בוואטסאפ ✓',
    },
  },
  {
    id: 'spa',
    category: 'ספא ועיסויים',
    tabLabel: '🌿 ספא ועיסויים',
    businessName: 'ספא לוטוס – בית למנוחה ומרגוע',
    city: 'רמת השרון',
    slogan: 'עיסויים מקצועיים, שחרור שרירים עמוק ופינוק הוליסטי',
    themeColor: '#14B8A6',
    bgGradient: 'from-teal-950/30 via-slate-900 to-black',
    textColor: 'text-teal-400',
    badge: 'אתר הדגמה חי 🌿',
    slug: 'spa',
    isLive: true,
    services: [
      { name: 'עיסוי שוודי קלאסי משחרר', price: 280, time: '60 דק׳' },
      { name: 'עיסוי רקמות עמוק לספורטאים', price: 320, time: '60 דק׳' },
      { name: 'טיפול אבנים חמות הוליסטי', price: 360, time: '75 דק׳' },
    ],
    recentBooking: {
      client: 'דניאל כהן',
      service: 'עיסוי רקמות עמוק',
      time: 'יום ד׳ בשעה 16:00',
      status: 'אושר בוואטסאפ ✓',
    },
  },
  {
    id: 'trainer',
    category: 'אימוני כושר אישיים',
    tabLabel: '🏋️ מאמני כושר',
    businessName: 'סטודיו אופק – אימונים אישיים',
    city: 'הרצליה פיתוח',
    slogan: 'אימוני כושר אישיים, חיטוב והעלאת מסת שריר',
    themeColor: '#10B981',
    bgGradient: 'from-emerald-950/30 via-slate-900 to-black',
    textColor: 'text-emerald-400',
    badge: 'אתר הדגמה חי 🏋️',
    slug: 'trainer',
    isLive: true,
    services: [
      { name: 'אימון אישי 1-על-1 VIP', price: 200, time: '60 דק׳' },
      { name: 'כרטיסיית 10 אימונים אישיים', price: 1800, time: '10 מפגשים' },
      { name: 'אימון זוגי / חברים', price: 280, time: '60 דק׳' },
    ],
    recentBooking: {
      client: 'רועי ברק',
      service: 'אימון אישי 1-על-1',
      time: 'מחר ב-08:00',
      status: 'אושר ביומן ✓',
    },
  },
  {
    id: 'clinic',
    category: 'קליניקות אסתטיקה',
    tabLabel: '🩺 קליניקות',
    businessName: 'קליניקת ד״ר לוי לאסתטיקה רפואית',
    city: 'תל אביב',
    slogan: 'רפואה אסתטית מתקדמת, פיסול פנים, בוטוקס וחומצה היאלורונית',
    themeColor: '#0EA5E9',
    bgGradient: 'from-sky-950/30 via-slate-900 to-black',
    textColor: 'text-sky-400',
    badge: 'אתר הדגמה חי 🩺',
    slug: 'clinic',
    isLive: true,
    services: [
      { name: 'פגישת אבחון ותכנון טיפול', price: 200, time: '30 דק׳' },
      { name: 'הזרקת בוטוקס רפואי מדויק', price: 750, time: '30 דק׳' },
      { name: 'פיסול שפתיים חומצה היאלורונית', price: 1400, time: '45 דק׳' },
    ],
    recentBooking: {
      client: 'מיכל אברהם',
      service: 'פיסול שפתיים פרימיום',
      time: 'היום ב-13:30',
      status: 'אושר בוואטסאפ ✓',
    },
  },
  {
    id: 'services',
    category: 'טכנאים ושירותי בית',
    tabLabel: '🔧 טכנאים ושירות',
    businessName: 'שרון שירותי מיזוג וחשמל',
    city: 'מרכז והשרון',
    slogan: 'התקנה ותיקון מזגנים, פתרונות חשמל מתקדמים ושירות מהיר',
    themeColor: '#F59E0B',
    bgGradient: 'from-amber-950/30 via-slate-900 to-black',
    textColor: 'text-amber-400',
    badge: 'חלונות הגעה ו-Waze 🔧',
    slug: 'services',
    isLive: true,
    services: [
      { name: 'ביקור ובדיקת תקלה מקיפה', price: 250, time: 'חלון 45 דק׳' },
      { name: 'מילוי גז ותיקון דליפות', price: 450, time: 'חלון שעה' },
      { name: 'ניקוי עמוק וחיטוי בקטריאלי', price: 380, time: 'חלון שעה' },
    ],
    recentBooking: {
      client: 'יוסי כרמי',
      service: 'בדיקת תקלה במזגן',
      time: 'היום • חלון 10:00-12:00',
      status: 'ניווט Waze מוכן ✓',
    },
  },
];
