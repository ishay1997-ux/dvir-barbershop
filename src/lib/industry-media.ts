import { resolveIndustryCategoryKey } from './industry-terminology';

export interface GalleryPhotoItem {
  id: number;
  title: string;
  category: string;
  src: string;
  likes?: number;
}

export interface AmbientSlideItem {
  id: number;
  title: string;
  description: string;
  tag: string;
  src: string;
}

export interface IndustryMediaBundle {
  categoryKey: string;
  heroImage: string;
  heroImages: string[];
  avatarUrl: string;
  galleryPhotos: GalleryPhotoItem[];
  ambientSlides: AmbientSlideItem[];
}

export const INDUSTRY_MEDIA_MAP: Record<string, IndustryMediaBundle> = {
  barber: {
    categoryKey: 'barber',
    heroImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80',
    heroImages: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    galleryPhotos: [
      {
        id: 1,
        title: 'סקין פייד מדויק עם קו תער חד',
        category: 'דירוגים',
        src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
        likes: 245,
      },
      {
        id: 2,
        title: 'פיסול ויישור זקן פרימיום',
        category: 'זקנים',
        src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80',
        likes: 198,
      },
      {
        id: 3,
        title: 'קלאסי מודרני מעוצב בחימר מט',
        category: 'תספורת',
        src: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=700&q=80',
        likes: 312,
      },
      {
        id: 4,
        title: 'קרופ צרפתי טקסטורלי',
        category: 'דירוגים',
        src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&q=80',
        likes: 176,
      },
      {
        id: 5,
        title: 'טייפר פייד נקי ומסגרת חדה',
        category: 'פייד',
        src: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=700&q=80',
        likes: 289,
      },
      {
        id: 6,
        title: 'עיצוב זקן מלא ומטופח',
        category: 'זקנים',
        src: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=700&q=80',
        likes: 220,
      },
    ],
    ambientSlides: [
      {
        id: 1,
        title: 'לאונג׳ גברים פרימיום ועמדות ספרים מעוצבות',
        description: 'כיסאות עור וינטג׳ מקצועיים, בר שתייה עשיר ואווירת גברים אלגנטית.',
        src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80',
        tag: 'אווירת ברברשופ קלאסית',
      },
      {
        id: 2,
        title: 'תכשירי טיפוח מובחרים ופיסול בתער חם',
        description: 'שמני זקן אורגניים, מגבות חמות וקרמים טיפוליים ברמה בינלאומית.',
        src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80',
        tag: 'טיפוח ועיצוב פרימיום',
      },
      {
        id: 3,
        title: 'דיוק כירורגי וטכניקות גזירה מתקדמות',
        description: 'שילוב של אומנות קלאסית עם טרנדים מודרניים של דירוגים וסקין פייד.',
        src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80',
        tag: 'מאסטר ברבר מוסמך',
      },
    ],
  },

  beauty_salon: {
    categoryKey: 'beauty_salon',
    heroImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1600&q=80',
    heroImages: [
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=80',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    galleryPhotos: [
      {
        id: 1,
        title: 'מבנה אנטומי & לק ג׳ל מילקי מדויק',
        category: 'מבנה אנטומי',
        src: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80',
        likes: 312,
      },
      {
        id: 2,
        title: 'מניקור רוסי נקי ומריחה מתחת לקוטיקולה',
        category: 'מניקור קומבי',
        src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=80',
        likes: 275,
      },
      {
        id: 3,
        title: 'הארכת ציפורניים בפוליג׳ל טבעי',
        category: 'בניית ציפורניים',
        src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=700&q=80',
        likes: 420,
      },
      {
        id: 4,
        title: 'פרנץ׳ מינימליסטי ואפקט כרום גלייזד',
        category: 'נייל ארט',
        src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
        likes: 380,
      },
      {
        id: 5,
        title: 'הרמת ריסים טבעית והזנת קרטין',
        category: 'ריסים וגבות',
        src: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80',
        likes: 195,
      },
      {
        id: 6,
        title: 'פדיקור ספא טיפולי ומפנק',
        category: 'פדיקור',
        src: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=700&q=80',
        likes: 230,
      },
    ],
    ambientSlides: [
      {
        id: 1,
        title: 'סטודיו בוטיק מואר וסטריליזציה ברמה רפואית',
        description: 'שקיות עיקור אישיות שנפתחות מולך, אוטוקלאב רפואי וחיטוי קפדני של כל כלי עבודה.',
        src: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80',
        tag: 'סטריליות ואסתטיקה ללא פשרות',
      },
      {
        id: 2,
        title: 'חומרי פרימיום היפואלרגניים ובסיסי רבר גומי',
        description: 'עמידות מושלמת ל-4 שבועות תוך שמירה מלאה על בריאות הציפורן הטבעית.',
        src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
        tag: 'מותגי איכות בינלאומיים',
      },
      {
        id: 3,
        title: 'נייל ארט טרנדי והתאמה אישית של מבנה הציפורן',
        description: 'התאמה מדויקת של צורת שקד, מרובע רך או בלרינה לגוון העור ומבנה כף היד.',
        src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
        tag: 'עיצוב אישי ומדויק',
      },
    ],
  },

  cosmetics_aesthetician: {
    categoryKey: 'cosmetics_aesthetician',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80',
    heroImages: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f5be661f4eb?auto=format&fit=crop&w=1600&q=80',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
    galleryPhotos: [
      {
        id: 1,
        title: 'טיפול פנים קליני עמוק ואבחון עור',
        category: 'טיפולי פנים',
        src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
        likes: 340,
      },
      {
        id: 2,
        title: 'שיקום עור אקנאי ואיזון סבום',
        category: 'שיקום אקנה',
        src: 'https://images.unsplash.com/photo-1512290900672-1f5be661f4eb?auto=format&fit=crop&w=700&q=80',
        likes: 290,
      },
      {
        id: 3,
        title: 'פילינג חומצות והבהרת פיגמנטציה',
        category: 'הבהרה ופילינג',
        src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=700&q=80',
        likes: 410,
      },
      {
        id: 4,
        title: 'אנטי-אייג׳ינג ומזותרפיה למיצוק',
        category: 'אנטי-אייג׳ינג',
        src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
        likes: 365,
      },
      {
        id: 5,
        title: 'החדרת סרומים פעילים והזנה עמוקה',
        category: 'Glow Rejuvenation',
        src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80',
        likes: 280,
      },
      {
        id: 6,
        title: 'עיסוי פנים ממצק ומסיכת קולגן',
        category: 'מיצוק וזוהר',
        src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
        likes: 315,
      },
    ],
    ambientSlides: [
      {
        id: 1,
        title: 'קליניקה פרא-רפואית מתקדמת P.M.E',
        description: 'אבחון מדויק תחת תאורה דרמטולוגית והתאמת פרוטוקול טיפול ושגרת בית אישית.',
        src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
        tag: 'קוסמטיקה פרא-רפואית מוסמכת',
      },
      {
        id: 2,
        title: 'חומרים פעילים ברישיון משרד הבריאות',
        description: 'פפטידים, חומצות אלפא וביתא הידרוקסיות ונוגדי חמצון בריכוז טיפולי גבוה.',
        src: 'https://images.unsplash.com/photo-1512290900672-1f5be661f4eb?auto=format&fit=crop&w=900&q=80',
        tag: 'תוצאות נראות לעין',
      },
      {
        id: 3,
        title: 'אווירת רוגע, טיפוח וחידוש העור',
        description: 'שילוב של מקצועיות מדעית עם חוויית פינוק אינטימית ושקטה.',
        src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80',
        tag: 'חוויית טיפוח פרימיום',
      },
    ],
  },

  clinic_therapist: {
    categoryKey: 'clinic_therapist',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    heroImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    galleryPhotos: [
      {
        id: 1,
        title: 'עיסוי שוודי קלאסי בשמנים ארומטיים',
        category: 'עיסויים',
        src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
        likes: 260,
      },
      {
        id: 2,
        title: 'עיסוי אבנים חמות להרגעת שרירים',
        category: 'אבנים חמות',
        src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=700&q=80',
        likes: 310,
      },
      {
        id: 3,
        title: 'עיסוי רקמות עמוק לספורטאים',
        category: 'רקמות עמוק',
        src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=700&q=80',
        likes: 215,
      },
      {
        id: 4,
        title: 'טיפול רפלקסולוגיה ואיזון אנרגטי',
        category: 'רפלקסולוגיה',
        src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80',
        likes: 185,
      },
      {
        id: 5,
        title: 'פילינג גוף ממריץ ומזין',
        category: 'טיפולי גוף',
        src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
        likes: 240,
      },
      {
        id: 6,
        title: 'חבילת ספא זוגית פרימיום',
        category: 'חבילות ספא',
        src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=700&q=80',
        likes: 395,
      },
    ],
    ambientSlides: [
      {
        id: 1,
        title: 'חדרי טיפול פרטיים ואווירת שלווה מוחלטת',
        description: 'חללים מרווחים, מוזיקה מרגיעה ותאורה עמומה לשחרור מוחלט של הגוף והנפש.',
        src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
        tag: 'אווירת ספא פרימיום',
      },
      {
        id: 2,
        title: 'שמנים ארומטיים טבעיים ועיסוי רקמות',
        description: 'תמציות צמחים אורגניות המעניקות לעור לחות עשירה ומשחררות עומסי שרירים.',
        src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
        tag: 'חומרים 100% טבעיים',
      },
      {
        id: 3,
        title: 'טיפולים הוליסטיים לאיזון הגוף והנפש',
        description: 'מטפלים מוסמכים עם ניסיון עשיר בהפגת מתחים ושיקום תנועה.',
        src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
        tag: 'מומחיות ומגע מרפא',
      },
    ],
  },

  private_instructor: {
    categoryKey: 'private_instructor',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    heroImages: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1600&q=80',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80',
    galleryPhotos: [
      {
        id: 1,
        title: 'אימון כוח אישי וחיטוב מתקדם',
        category: 'אימוני כוח',
        src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
        likes: 380,
      },
      {
        id: 2,
        title: 'אימון פונקציונלי וקרוספיט',
        category: 'פונקציונלי',
        src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
        likes: 295,
      },
      {
        id: 3,
        title: 'אימוני אינטרוולים HIIT לשריפת שומן',
        category: 'HIIT & Cardio',
        src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
        likes: 310,
      },
      {
        id: 4,
        title: 'אימון זוגי / קבוצות קטנות בסטודיו',
        category: 'אימונים בקבוצה',
        src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=700&q=80',
        likes: 250,
      },
      {
        id: 5,
        title: 'ליווי תזונתי ובניית תפריט מדויק',
        category: 'תזונת ספורט',
        src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=80',
        likes: 420,
      },
      {
        id: 6,
        title: 'עבודה על טכניקה ומניעת פציעות',
        category: 'טכניקה',
        src: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=700&q=80',
        likes: 190,
      },
    ],
    ambientSlides: [
      {
        id: 1,
        title: 'סטודיו כושר פרטי ומאובזר בציוד המתקדם ביותר',
        description: 'אימונים באווירה פרטית 1-על-1 ללא עומס וללא הסחות דעת.',
        src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
        tag: 'אימון אישי VIP',
      },
      {
        id: 2,
        title: 'תוכניות אימון מדעיות להעלאת מסת שריר וחיטוב',
        description: 'מעקב שבועי של אחוזי שומן, היקפים והתקדמות משקלי עבודה.',
        src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80',
        tag: 'תוצאות מוכחות',
      },
      {
        id: 3,
        title: 'ליווי מנטלי ותזונתי מסביב לשעון',
        description: 'זמינות מלאה בוואטסאפ לכל שאלה, תפריטים מותאמים ומוטיבציה גבוהה.',
        src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
        tag: 'מעטפת הצלחה מלאה',
      },
    ],
  },

  clinics_aesthetics: {
    categoryKey: 'clinics_aesthetics',
    heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
    heroImages: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    galleryPhotos: [
      {
        id: 1,
        title: 'ייעוץ ואבחון רפואי אישי מקיף',
        category: 'ייעוץ רפואי',
        src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=80',
        likes: 270,
      },
      {
        id: 2,
        title: 'הזרקות חומצה היאלורונית ובוטוקס',
        category: 'הזרקות ואסתטיקה',
        src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=80',
        likes: 390,
      },
      {
        id: 3,
        title: 'טיפולי לייזר לחידוש מרקם העור',
        category: 'לייזר רפואי',
        src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80',
        likes: 310,
      },
      {
        id: 4,
        title: 'עיצוב ופיסול שפתיים טבעי',
        category: 'פיסול שפתיים',
        src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
        likes: 450,
      },
      {
        id: 5,
        title: 'מיצוק קו לסת וסנטר בחומרי מילוי',
        category: 'פיסול פנים',
        src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
        likes: 330,
      },
      {
        id: 6,
        title: 'טשטוש קמטים ושיפור אלסטיות',
        category: 'אנטי-אייג׳ינג',
        src: 'https://images.unsplash.com/photo-1512290900672-1f5be661f4eb?auto=format&fit=crop&w=700&q=80',
        likes: 280,
      },
    ],
    ambientSlides: [
      {
        id: 1,
        title: 'קליניקה רפואית בסטנדרטים המחמירים ביותר',
        description: 'רופאים מוסמכים בלבד, חומרים מקוריים עם אישור FDA ומשרד הבריאות.',
        src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
        tag: 'רפואה ואסתטיקה מובילה',
      },
      {
        id: 2,
        title: 'טכנולוגיות לייזר ומכשור רפואי מתקדם',
        description: 'טיפולים בטוחים ללא זמן החלמה ממושך ותוצאות טבעיות והרמוניות.',
        src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
        tag: 'חדשנות רפואית',
      },
      {
        id: 3,
        title: 'ליווי וזמינות רפואית מלאה לאחר הטיפול',
        description: 'ביקורת ומעקב אישי להבטחת שביעות רצון מושלמת ובריאות מקסימלית.',
        src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
        tag: 'יחס אישי ומסור',
      },
    ],
  },

  home_technician: {
    categoryKey: 'home_technician',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    heroImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    galleryPhotos: [
      {
        id: 1,
        title: 'איתור נזילות במצלמה תרמית ללא הרס',
        category: 'איתור נזילות',
        src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
        likes: 190,
      },
      {
        id: 2,
        title: 'פתיחת סתימות מורכבות במכשור חשמלי',
        category: 'פתיחת סתימות',
        src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80',
        likes: 165,
      },
      {
        id: 3,
        title: 'החלפת צנרת ואינסטלציה כללית',
        category: 'אינסטלציה',
        src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
        likes: 210,
      },
      {
        id: 4,
        title: 'התקנת ברזים, כלים סניטריים וכיורים',
        category: 'התקנות',
        src: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80',
        likes: 145,
      },
      {
        id: 5,
        title: 'עבודות חשמל ותיקון לוחות',
        category: 'חשמל',
        src: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80',
        likes: 230,
      },
      {
        id: 6,
        title: 'תיקון והתקנת מזגנים ומערכות מיזוג',
        category: 'מיזוג אוויר',
        src: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=700&q=80',
        likes: 180,
      },
    ],
    ambientSlides: [
      {
        id: 1,
        title: 'רכב שירות מאובזר וזמינות לקריאות דחופות',
        description: 'מגיעים לבית הלקוח עם חלקי חילוף מקוריים וציוד דיאגנוסטיקה מלא.',
        src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
        tag: 'שירות מהיר ואמין',
      },
      {
        id: 2,
        title: 'טכנאי מוסמך ואחריות מלאה בכתב על כל עבודה',
        description: 'אבחון מדויק, מחירים שקופים וללא הפתעות בסיום העבודה.',
        src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
        tag: 'מקצועיות ואמינות',
      },
      {
        id: 3,
        title: 'עבודה נקייה, יסודית וללא הרס מיותר',
        description: 'הקפדה על סדר וניקיון בבית הלקוח והשארת המקום מבריק.',
        src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
        tag: 'שירות פרימיום בביתך',
      },
    ],
  },

  tattoo_piercing: {
    categoryKey: 'tattoo_piercing',
    heroImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1600&q=80',
    heroImages: [
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1600&q=80',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    galleryPhotos: [
      {
        id: 1,
        title: 'קעקוע פיין ליין גיאומטרי מדויק',
        category: 'פיין ליין',
        src: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=700&q=80',
        likes: 540,
      },
      {
        id: 2,
        title: 'קעקוע ריאליסטי בשחור ואפור',
        category: 'ריאליזם שחור-אפור',
        src: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=700&q=80',
        likes: 620,
      },
      {
        id: 3,
        title: 'קעקוע מיקרו-ריאליזם ובוטניקה',
        category: 'בוטניקה וטבע',
        src: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=700&q=80',
        likes: 480,
      },
      {
        id: 4,
        title: 'סקיצה מקורית בעיצוב אישי',
        category: 'Custom Art',
        src: 'https://images.unsplash.com/photo-1590246814883-57c511e76523?auto=format&fit=crop&w=700&q=80',
        likes: 390,
      },
      {
        id: 5,
        title: 'פירסינג מדויק בעגילים רפואיים',
        category: 'פירסינג',
        src: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=700&q=80',
        likes: 310,
      },
      {
        id: 6,
        title: 'כיסוי וחידוש קעקועים ישנים (Cover Up)',
        category: 'Cover Up',
        src: 'https://images.unsplash.com/photo-1565058379802-dd104a434771?auto=format&fit=crop&w=700&q=80',
        likes: 440,
      },
    ],
    ambientSlides: [
      {
        id: 1,
        title: 'סטודיו קעקועים בוטיק ברמת סטריליזציה רפואית',
        description: 'מחטים חד פעמיות סטריליות, צבעים טבעוניים מובחרים וסביבת עבודה מחוטאת.',
        src: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=900&q=80',
        tag: 'סטריליות ואומנות ללא פשרות',
      },
      {
        id: 2,
        title: 'עיצוב סקיצות אישיות בהתאמה לגוף',
        description: 'פגישת ייעוץ והתאמה מדויקת של הקעקוע לזרימה האנטומית של השריר.',
        src: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=900&q=80',
        tag: 'יצירה מקורית אחת ויחידה',
      },
      {
        id: 3,
        title: 'הנחיות החלמה וליווי אישי עד לריפוי מושלם',
        description: 'משחות החלמה ייעודיות, מעקב שבועי וזמינות מלאה לכל שאלה.',
        src: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=900&q=80',
        tag: 'ליווי וטיפול מסור',
      },
    ],
  },
};

/**
 * Resolves the full media bundle for a given business
 */
export function getIndustryMediaBundle(business?: any): IndustryMediaBundle {
  const catKey = resolveIndustryCategoryKey(business);
  return INDUSTRY_MEDIA_MAP[catKey] || INDUSTRY_MEDIA_MAP.barber;
}

/**
 * Resolves gallery photo objects for a business
 */
export function getIndustryGalleryPhotos(business?: any): GalleryPhotoItem[] {
  const bundle = getIndustryMediaBundle(business);
  if (Array.isArray(business?.galleryImages) && business.galleryImages.length > 0) {
    return business.galleryImages.map((src: string, idx: number) => ({
      id: idx + 1,
      title: `${bundle.galleryPhotos[idx % bundle.galleryPhotos.length]?.title || 'עבודה פרימיום'} #${idx + 1}`,
      category: bundle.galleryPhotos[idx % bundle.galleryPhotos.length]?.category || 'גלריה',
      src,
      likes: bundle.galleryPhotos[idx % bundle.galleryPhotos.length]?.likes || 150 + idx * 25,
    }));
  }
  return bundle.galleryPhotos;
}

/**
 * Resolves ambient slides for a business
 */
export function getIndustryAmbientSlides(business?: any): AmbientSlideItem[] {
  const bundle = getIndustryMediaBundle(business);
  return bundle.ambientSlides;
}

/**
 * Resolves hero background image for a business
 */
export function getIndustryHeroImage(business?: any): string {
  if (business?.heroImages && business.heroImages.length > 0) {
    return business.heroImages[0];
  }
  const bundle = getIndustryMediaBundle(business);
  return bundle.heroImage;
}

/**
 * Resolves avatar image for a business
 */
export function getIndustryAvatarUrl(business?: any): string {
  if (business?.avatarUrl) {
    return business.avatarUrl;
  }
  const bundle = getIndustryMediaBundle(business);
  return bundle.avatarUrl;
}
