'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  VolumeX,
  Keyboard,
  Sun,
  Moon,
  Eye,
  Contrast,
  Type,
  ZoomIn,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading,
  Printer,
  MousePointer,
  RotateCcw,
  Sparkles,
  ChevronDown,
  EyeOff,
  Sliders,
  Check,
  Search,
  BookOpen,
  Move,
  Delete,
  ArrowLeftRight,
  Play,
  Pause,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Settings,
  Minus,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

interface A11yState {
  // Font & Content Adjustments
  fontScaleLevel: number; // 0..5 (100% to 150%)
  wordSpacingLevel: number; // 0..4 (0 to 8px)
  lineHeightLevel: number; // 0..4 (1.5 to 2.3)
  letterSpacingLevel: number; // 0..3 (0 to 3px)
  fontAdjustmentMode: 'size' | 'word' | 'line' | 'letter';

  // Contrast & Filters
  contrastMode: 'normal' | 'light' | 'dark' | 'grayscale' | 'invert';

  // Color Spectrum Customization
  colorTarget: 'background' | 'headings' | 'text';
  customBgHue: number | null; // 0..360
  customHeadingHue: number | null;
  customTextHue: number | null;

  // Toggle Features
  readableFont: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  screenZoom: boolean;
  stopAnimations: boolean;
  bigCursor: boolean;
  cursorMode: 'default' | 'white' | 'black';
  keyboardNav: boolean;
  imageAltTooltips: boolean;
  virtualKeyboard: boolean;

  // Language
  language: 'he' | 'en' | 'ar' | 'ru';
}

const defaultState: A11yState = {
  fontScaleLevel: 0,
  wordSpacingLevel: 0,
  lineHeightLevel: 0,
  letterSpacingLevel: 0,
  fontAdjustmentMode: 'size',

  contrastMode: 'normal',

  colorTarget: 'background',
  customBgHue: null,
  customHeadingHue: null,
  customTextHue: null,

  readableFont: false,
  highlightLinks: false,
  highlightHeadings: false,
  screenZoom: false,
  stopAnimations: false,
  bigCursor: false,
  cursorMode: 'default',
  keyboardNav: false,
  imageAltTooltips: false,
  virtualKeyboard: false,

  language: 'he',
};

const STORAGE_KEY = 'thecut_a11y_v3_state';

const LANGUAGES = [
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
] as const;

// Translations dictionary for all 4 languages
const A11Y_I18N = {
  he: {
    triggerBtn: 'כפתור',
    triggerA11y: 'נגישות',
    title: 'נגישות',
    close: 'סגור תפריט נגישות',
    selectLanguage: 'בחר שפה',
    hideWidget: 'הסתר כפתור נגישות לזמן קצר',
    hoverPrompt: '💡 העבר את העכבר על כל אפשרות כדי לקרוא את הפירוט המדויק שלה',
    activeSettingsBadge: 'הגדרות נגישות מופעלות',

    // 14 Tiles
    keyboardNavTitle: 'ניווט מקלדת',
    keyboardNavDesc: 'התאמת האתר לניווט באמצעות המקלדת, ללא צורך בעכבר',
    speechTitle: 'הקראת טקסט',
    speechStopTitle: 'עצור הקראה',
    speechDesc: 'הקראה קולית חכמה של תכנים, פסקאות וכותרות באתר בעברית',
    contrastDarkTitle: 'ניגודיות כהה',
    contrastDarkDesc: 'הצגת האתר על רקע שחור מלא עם טקסט צהוב וכחול זוהר לקריאה קלה',
    contrastLightTitle: 'ניגודיות בהירה',
    contrastLightDesc: 'הצגת האתר על גבי רקע לבן צח עם טקסט שחור כהה וקישורים בולטים',
    contrastInvertTitle: 'מוד ניגודיות',
    contrastInvertDesc: 'היפוך צבעי האתר בצורה חדה תוך שמירה מלאה על צבעי תמונות ווידאו',
    grayscaleTitle: 'מונוכרום',
    grayscaleDesc: 'הפיכת כל צבעי האתר לגווני אפור (שחור-לבן) למניעת עומס ראייתי',
    screenZoomTitle: 'הגדלת תצוגה',
    screenZoomDesc: 'הגדלת כל שטח התצוגה של האתר ב-15% לצפייה נוחה וברורה',
    readableFontTitle: 'גופן קריא',
    readableFontDesc: 'החלפת גופן האתר לגופן קריא, פשוט וברור (מותאם לקריאה רציפה)',
    imageAltTitle: 'תיאור לתמונות',
    imageAltDesc: 'הצגת תיאורי תוכן והסברים טקסטואליים ישירות על גבי התמונות באתר',
    highlightLinksTitle: 'הדגשת קישורים',
    highlightLinksDesc: 'הדגשה בולטת בצהוב עם קו תחתי על כל הקישורים והכפתורים באתר',
    highlightHeadingsTitle: 'הדגשת כותרות',
    highlightHeadingsDesc: 'סימון והדגשה בצבע טורקיז ברור של כל הכותרות והקטעים המרכזיים',
    readingModeTitle: 'תצוגה קריאה',
    readingModeDesc: 'פתיחת חלון קריאה נקי ונטול הסחות דעת עם אפשרות להדפסה ישירה',
    contentScaleTitle: 'הגדלת תכנים',
    contentScaleDesc: 'הגדלת גודל הטקסטים והפסקאות בכל עמודי האתר עד 150%',
    virtualKeyboardTitle: 'מקלדת וירטואלית',
    virtualKeyboardDesc: 'הצגת מקלדת על גבי המסך להקלדה נוחה בעברית באמצעות העכבר בלבד',

    // Color section
    colorSectionTitle: 'התאמת צבעים אישית',
    colorSectionDesc: 'שינוי צבעי הרקע, הכותרות והטקסטים',
    targetBackground: 'רקעים',
    targetHeadings: 'כותרות',
    targetText: 'תכנים',
    resetColors: 'איפוס צבעים',
    activeCustomColor: 'צבע מותאם פעיל ✓',

    // Font section
    fontSectionTitle: 'התאמות גופן',
    fontSectionDesc: 'הגדלת והקטנת הגופן',
    fontSize: 'גודל גופן',
    wordSpacing: 'ריווח בין מילים',
    lineHeight: 'ריווח בין שורות',
    letterSpacing: 'ריווח אותיות',
    levelOf: (lvl: number, max: number) => `דרגה ${lvl} מתוך ${max}`,

    // Mouse Cursor
    cursorSectionTitle: 'סמן העכבר',
    cursorSectionDesc: 'הגדלת סמן העכבר ושינוי צבעו',
    cursorWhite: 'לבן',
    cursorBlack: 'שחור',

    // Extra
    bigCursor: 'סמן עכבר מוגדל',
    stopAnimations: 'עצירת אנימציות',
    resetAll: 'בטל נגישות',
    statementLink: 'הצהרת נגישות תקן 5568 ←',
    standardBadge: 'נגיש בקליק · WCAG 2.1 AA',

    // Virtual Keyboard
    keyboardTitle: '⌨️ מקלדת וירטואלית על המסך',
    spaceKey: 'רווח (Space)',
    backspaceKey: 'מחיקה',

    // Reader Modal
    readerTitle: 'המספרה של דביר – תצוגת קריאה נגישה',
    readerSubtitle: 'מותאם להדפסה ולקריאה מוגדלת ברורה',
    printBtn: 'הדפס תוכן נגיש',
    readerAboutTitle: 'אודות המספרה',
    readerAboutContent:
      'המספרה של דביר פועלת בשני סניפים מרכזיים: סניף אריאל וסניף רחובות. דביר אטיאס מתמחה בעיצובי שיער גברים, פיידים מדויקים ועיצוב זקן ברמה הגבוהה ביותר.',
    readerServicesTitle: 'מחירון שירותים מובילים',

    // Speech Player
    speechPlayerTitle: 'נגן הקראה קולית',
    continuousReadingTitle: 'הקראה ממושכת',
    continuousReadingDesc: 'העבר את סמן העכבר מעל כל טקסט או כותרת לקריאה קולית אוטומטית',
    speechSettingsTitle: 'הגדרות הקראה קולית',
    speechPitch: 'גובה צליל',
    speechRate: 'קצב',
    speechVoice: 'קול הקראה',
    speechClose: 'סגור נגן הקראה',
    speechRestart: 'התחל מחדש',
    speechPrev: 'קטע קודם',
    speechNext: 'קטע הבא',
    speechPause: 'השהה',
    speechPlay: 'נגן',
    speechMute: 'השתק',
    speechUnmute: 'בטל השתקה',
  },

  en: {
    triggerBtn: 'A11y',
    triggerA11y: 'Accessibility',
    title: 'Accessibility',
    close: 'Close Accessibility Menu',
    selectLanguage: 'Select Language',
    hideWidget: 'Temporarily hide accessibility widget',
    hoverPrompt: '💡 Hover over any feature to see detailed explanations',
    activeSettingsBadge: 'Accessibility features active',

    // 14 Tiles
    keyboardNavTitle: 'Keyboard Nav',
    keyboardNavDesc: 'Enable full website navigation using keyboard keys without mouse',
    speechTitle: 'Text to Speech',
    speechStopTitle: 'Stop Speech',
    speechDesc: 'Smart voice readout for website headings, paragraphs, and content',
    contrastDarkTitle: 'Dark Contrast',
    contrastDarkDesc: 'High-contrast dark background with bright yellow and blue text',
    contrastLightTitle: 'Light Contrast',
    contrastLightDesc: 'Crisp white background with bold dark text and distinct links',
    contrastInvertTitle: 'Invert Colors',
    contrastInvertDesc: 'Sharply invert website color palette while preserving media/images',
    grayscaleTitle: 'Monochrome',
    grayscaleDesc: 'Convert all site colors into grayscale to relieve visual fatigue',
    screenZoomTitle: 'Screen Zoom',
    screenZoomDesc: 'Magnify whole viewport display by 15% for easy readability',
    readableFontTitle: 'Readable Font',
    readableFontDesc: 'Switch website font to clean, high-legibility sans-serif typeface',
    imageAltTitle: 'Image Tooltips',
    imageAltDesc: 'Show informative text descriptions directly over all website imagery',
    highlightLinksTitle: 'Highlight Links',
    highlightLinksDesc: 'High-visibility yellow underline on all links and interactive buttons',
    highlightHeadingsTitle: 'Highlight Titles',
    highlightHeadingsDesc: 'Cyan highlight markers over all primary sections and headers',
    readingModeTitle: 'Reading Mode',
    readingModeDesc: 'Distraction-free clean reader window with instant print layout',
    contentScaleTitle: 'Scale Content',
    contentScaleDesc: 'Increase paragraphs and font sizes up to 150% across pages',
    virtualKeyboardTitle: 'Virtual Keys',
    virtualKeyboardDesc: 'On-screen virtual keyboard for typing using mouse clicks alone',

    // Color section
    colorSectionTitle: 'Custom Palette',
    colorSectionDesc: 'Customize background, heading, and text hues directly',
    targetBackground: 'Backgrounds',
    targetHeadings: 'Headings',
    targetText: 'Text Content',
    resetColors: 'Reset Colors',
    activeCustomColor: 'Custom Color Active ✓',

    // Font section
    fontSectionTitle: 'Font Adjustments',
    fontSectionDesc: 'Enlarge and scale font layout',
    fontSize: 'Font Size',
    wordSpacing: 'Word Spacing',
    lineHeight: 'Line Height',
    letterSpacing: 'Letter Spacing',
    levelOf: (lvl: number, max: number) => `Level ${lvl} of ${max}`,

    // Mouse Cursor
    cursorSectionTitle: 'Mouse Cursor',
    cursorSectionDesc: 'Enlarge mouse cursor and change color',
    cursorWhite: 'White',
    cursorBlack: 'Black',

    // Extra
    bigCursor: 'Large Mouse Cursor',
    stopAnimations: 'Pause Animations',
    resetAll: 'Reset Accessibility',
    statementLink: 'Accessibility Statement (WCAG 2.1) ←',
    standardBadge: 'AccessClick · WCAG 2.1 AA',

    // Virtual Keyboard
    keyboardTitle: '⌨️ On-Screen Virtual Keyboard',
    spaceKey: 'Space Bar',
    backspaceKey: 'Delete',

    // Reader Modal
    readerTitle: 'Dvir Barbershop – Accessible Reader View',
    readerSubtitle: 'Optimized for high-contrast print and enhanced readability',
    printBtn: 'Print Content',
    readerAboutTitle: 'About The Barbershop',
    readerAboutContent:
      'Dvir Barbershop operates across two branches in Ariel and Rehovot. Dvir Attias specializes in precision fades, executive men styling, and custom beard sculpting.',
    readerServicesTitle: 'Featured Pricing & Services',

    // Speech Player
    speechPlayerTitle: 'Text-to-Speech Player',
    continuousReadingTitle: 'Continuous Reading',
    continuousReadingDesc: 'Hover over any text or heading to automatically listen to it',
    speechSettingsTitle: 'Speech Settings',
    speechPitch: 'Pitch',
    speechRate: 'Speed',
    speechVoice: 'Voice',
    speechClose: 'Close Speech Player',
    speechRestart: 'Restart',
    speechPrev: 'Previous',
    speechNext: 'Next',
    speechPause: 'Pause',
    speechPlay: 'Play',
    speechMute: 'Mute',
    speechUnmute: 'Unmute',
  },

  ar: {
    triggerBtn: 'زر',
    triggerA11y: 'إمكانية الوصول',
    title: 'إمكانية الوصول',
    close: 'إغلاق قائمة إمكانية الوصول',
    selectLanguage: 'اختر اللغة',
    hideWidget: 'إخفاء زر الوصول مؤقتًا',
    hoverPrompt: '💡 مرر الفأرة فوق أي خيار للاطلاع على التفاصيل الكاملة',
    activeSettingsBadge: 'إعدادات إمكانية الوصول نشطة',

    // 14 Tiles
    keyboardNavTitle: 'التنقل بلوحة المفاتيح',
    keyboardNavDesc: 'تكييف الموقع للتنقل الكامل عبر لوحة المفاتيح دون الحاجة للفأرة',
    speechTitle: 'قراءة النصوص',
    speechStopTitle: 'إيقاف القراءة',
    speechDesc: 'قراءة صوتية ذكية لفقرات وعناوين الموقع بدقة ووضوح',
    contrastDarkTitle: 'تباين داكن',
    contrastDarkDesc: 'عرض الموقع بخلفية سوداء كاملة مع نصوص صفراء وزرقاء ساطعة',
    contrastLightTitle: 'تباين فاتح',
    contrastLightDesc: 'عرض الموقع بخلفية بيضاء نقية مع نصوص سوداء واضحة وروابط مميزة',
    contrastInvertTitle: 'عكس الألوان',
    contrastInvertDesc: 'عكس ألوان الموقع بالكامل مع الحفاظ التام على ألوان الصور والفيديو',
    grayscaleTitle: 'أحادي اللون',
    grayscaleDesc: 'تحويل ألوان الموقع إلى درجات الرمادي لتجنب الإجهاد البصري',
    screenZoomTitle: 'تكبير الشاشة',
    screenZoomDesc: 'تكبير مساحة العرض بنسبة 15% لتسهيل المشاهدة والقراءة',
    readableFontTitle: 'خط واضح للقراءة',
    readableFontDesc: 'تغيير خط الموقع إلى خط بسيط ومريح للقراءة السلسة',
    imageAltTitle: 'وصف الصور',
    imageAltDesc: 'عرض شروح نصية ووصف محتوى الصور مباشرة عند المشاهدة',
    highlightLinksTitle: 'تمييز الروابط',
    highlightLinksDesc: 'تحديد بارز باللون الأصفر مع خط سفلي لجميع الروابط والأزرار',
    highlightHeadingsTitle: 'تمييز العناوين',
    highlightHeadingsDesc: 'تحديد وتظليل واضح باللون الفيروزي لجميع العناوين والأقسام',
    readingModeTitle: 'عرض القراءة المريح',
    readingModeDesc: 'فتح نافذة قراءة نظيفة خالية من المشتتات مع إمكانية الطباعة الفورية',
    contentScaleTitle: 'تكبير المحتوى',
    contentScaleDesc: 'زيادة حجم النصوص والفقرات في الموقع بنسبة تصل إلى 150%',
    virtualKeyboardTitle: 'لوحة مفاتيح افتراضية',
    virtualKeyboardDesc: 'عرض لوحة مفاتيح على الشاشة للكتابة المريحة بواسطة الفأرة',

    // Color section
    colorSectionTitle: 'تخصيص الألوان',
    colorSectionDesc: 'تغيير ألوان الخلفية والعناوين والنصوص مباشرة',
    targetBackground: 'الخلفيات',
    targetHeadings: 'العناوين',
    targetText: 'النصوص',
    resetColors: 'إعادة ضبط الألوان',
    activeCustomColor: 'الألوان المخصصة نشطة ✓',

    // Font section
    fontSectionTitle: 'تعديل الخطوط',
    fontSectionDesc: 'تكبير وتصغير حجم الخط',
    fontSize: 'حجم الخط',
    wordSpacing: 'تباعد الكلمات',
    lineHeight: 'ارتفاع السطر',
    letterSpacing: 'تباعد الأحرف',
    levelOf: (lvl: number, max: number) => `المستوى ${lvl} من ${max}`,

    // Mouse Cursor
    cursorSectionTitle: 'مؤشر الفأرة',
    cursorSectionDesc: 'تكبير مؤشر الفأرة وتغيير لونه',
    cursorWhite: 'أبيض',
    cursorBlack: 'أسود',

    // Extra
    bigCursor: 'مؤشر فأرة كبير',
    stopAnimations: 'إيقاف الحركات والرسوم',
    resetAll: 'إلغاء إمكانية الوصول',
    statementLink: 'بيان إمكانية الوصول المعياري ←',
    standardBadge: 'متاح بنقرة واحدة · WCAG 2.1 AA',

    // Virtual Keyboard
    keyboardTitle: '⌨️ لوحة مفاتيح افتراضية على الشاشة',
    spaceKey: 'مسافة (Space)',
    backspaceKey: 'حذف',

    // Reader Modal
    readerTitle: 'صالون دبير – عرض قراءة ميسر',
    readerSubtitle: 'مخصص للطباعة والقراءة المكبرة بوضوح تام',
    printBtn: 'طباعة المحتوى',
    readerAboutTitle: 'عن الصالון',
    readerAboutContent:
      'يعمل صالون دبير في فرعين رئيسيين: فرع أريئيل وفرع رحوفوت. دبير أتياس خبير في تصفيف شعر الرجال وقصات الفيد الدقيقة وتصميم اللحى بأعلى المعايير.',
    readerServicesTitle: 'قائمة الأسعار والخدمات المميزة',

    // Speech Player
    speechPlayerTitle: 'مشغل القراءة الصوتية',
    continuousReadingTitle: 'قراءة مستمرة',
    continuousReadingDesc: 'مرر مؤشر الفأرة فوق أي نص للاستماع إليه تلقائيًا',
    speechSettingsTitle: 'إعدادات الصوت',
    speechPitch: 'طبقة الصوت',
    speechRate: 'السرعة',
    speechVoice: 'الصوت',
    speechClose: 'إغلاق مشغل الصوت',
    speechRestart: 'إعادة البدء',
    speechPrev: 'السابق',
    speechNext: 'التالي',
    speechPause: 'إيقاف مؤقت',
    speechPlay: 'تشغيل',
    speechMute: 'كتم الصوت',
    speechUnmute: 'إلغاء الكتم',
  },

  ru: {
    triggerBtn: 'Кнопка',
    triggerA11y: 'Доступность',
    title: 'Доступность',
    close: 'Закрыть меню доступности',
    selectLanguage: 'Выбрать язык',
    hideWidget: 'Временно скрыть кнопку доступности',
    hoverPrompt: '💡 Наведите курсор на любую функцию для подробного описания',
    activeSettingsBadge: 'Настройки доступности активны',

    // 14 Tiles
    keyboardNavTitle: 'Навигация с клавиш',
    keyboardNavDesc: 'Адаптация сайта для полного управления с клавиатуры без мыши',
    speechTitle: 'Озвучивание текста',
    speechStopTitle: 'Остановить речь',
    speechDesc: 'Голосовое чтение заголовков, абзацев и контента сайта вслух',
    contrastDarkTitle: 'Темный контраст',
    contrastDarkDesc: 'Сайт на черном фоне с ярким желтым и синим легкочитаемым текстом',
    contrastLightTitle: 'Светлый контраст',
    contrastLightDesc: 'Сайт на чистом белом фоне с контрастным темным текстом и ссылками',
    contrastInvertTitle: 'Инверсия цветов',
    contrastInvertDesc: 'Инвертировать цвета сайта с сохранением оригинальных цветов медиа',
    grayscaleTitle: 'Монохром',
    grayscaleDesc: 'Преобразование цветов сайта в оттенки серого для снижения нагрузки на глаза',
    screenZoomTitle: 'Увеличение экрана',
    screenZoomDesc: 'Увеличение масштаба отображения сайта на 15% для удобного просмотра',
    readableFontTitle: 'Читаемый шрифт',
    readableFontDesc: 'Переключение на простой, четкий шрифт для легкого восприятия',
    imageAltTitle: 'Описания картинок',
    imageAltDesc: 'Отображение поясняющего текста поверх изображений на сайте',
    highlightLinksTitle: 'Выделение ссылок',
    highlightLinksDesc: 'Яркое желтое подчеркивание всех ссылок и интерактивных кнопок',
    highlightHeadingsTitle: 'Выделение титров',
    highlightHeadingsDesc: 'Бирюзовое выделение всех основных заголовков и разделов',
    readingModeTitle: 'Режим чтения',
    readingModeDesc: 'Чистое окно для чтения без лишних элементов с возможностью печати',
    contentScaleTitle: 'Масштаб текста',
    contentScaleDesc: 'Увеличение размера шрифта и абзацев на сайте до 150%',
    virtualKeyboardTitle: 'Экранные клавиши',
    virtualKeyboardDesc: 'Экранная клавиатура для комфортного ввода текста кликами мыши',

    // Color section
    colorSectionTitle: 'Настройка цветов',
    colorSectionDesc: 'Изменение оттенков фона, заголовков и основного текста',
    targetBackground: 'Фон',
    targetHeadings: 'Заголовки',
    targetText: 'Текст',
    resetColors: 'Сброс цветов',
    activeCustomColor: 'Пользовательский цвет активен ✓',

    // Font section
    fontSectionTitle: 'Настройки шрифта',
    fontSectionDesc: 'Увеличение и масштабирование шрифта',
    fontSize: 'Размер шрифта',
    wordSpacing: 'Интервал слов',
    lineHeight: 'Высота строки',
    letterSpacing: 'Межбуквенный интервал',
    levelOf: (lvl: number, max: number) => `Уровень ${lvl} из ${max}`,

    // Mouse Cursor
    cursorSectionTitle: 'Курсор мыши',
    cursorSectionDesc: 'Увеличение и изменение цвета курсора',
    cursorWhite: 'Белый',
    cursorBlack: 'Черный',

    // Extra
    bigCursor: 'Увеличенный курсор',
    stopAnimations: 'Остановить анимации',
    resetAll: 'Сбросить доступность',
    statementLink: 'Заявление о доступности WCAG 2.1 ←',
    standardBadge: 'Доступно в 1 клик · WCAG 2.1 AA',

    // Virtual Keyboard
    keyboardTitle: '⌨️ Экранная виртуальная клавиатура',
    spaceKey: 'Пробел (Space)',
    backspaceKey: 'Стереть',

    // Reader Modal
    readerTitle: 'Барбершоп Двира – Режим чтения',
    readerSubtitle: 'Оптимизировано для печати и комфортного чтения',
    printBtn: 'Печать страницы',
    readerAboutTitle: 'О барбершопе',
    readerAboutContent:
      'Барбершоп Двира работает в двух филиалах: Ариэль и Реховот. Двир Аттиас специализируется на безупречных мужских стрижках, фейдах и моделировании бороды.',
    readerServicesTitle: 'Прайс-лист популярных услуг',

    // Speech Player
    speechPlayerTitle: 'Плеер озвучивания текста',
    continuousReadingTitle: 'Непрерывное чтение',
    continuousReadingDesc: 'Наведите курсор мыши на любой текст для автоматического чтения',
    speechSettingsTitle: 'Настройки голоса',
    speechPitch: 'Высота тона',
    speechRate: 'Скорость',
    speechVoice: 'Голос',
    speechClose: 'Закрыть плеер',
    speechRestart: 'Начать сначала',
    speechPrev: 'Назад',
    speechNext: 'Вперед',
    speechPause: 'Пауза',
    speechPlay: 'Слушать',
    speechMute: 'Без звука',
    speechUnmute: 'Включить звук',
  },
};

// Keyboard layouts for each language
const KEYBOARD_LAYOUTS = {
  he: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['/', '\'', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
    ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
    ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', '.'],
  ],
  en: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
  ],
  ar: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
    ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
  ],
  ru: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
    ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.'],
  ],
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [dockSide, setDockSide] = useState<'left' | 'right'>('left');
  const [state, setState] = useState<A11yState>(defaultState);
  const [isClient, setIsClient] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [isHiddenTemporarily, setIsHiddenTemporarily] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<{ id: string; title: string; desc: string } | null>(null);
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const colorSliderRef = useRef<HTMLDivElement>(null);

  // Floating Speech Player & Settings State (Matching user screenshots)
  const [isSpeechBarOpen, setIsSpeechBarOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [continuousReading, setContinuousReading] = useState(false);
  const [isSpeechSettingsOpen, setIsSpeechSettingsOpen] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechElements, setSpeechElements] = useState<HTMLElement[]>([]);
  const [speechIndex, setSpeechIndex] = useState(0);
  const isPlayingRef = useRef(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load from local storage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState({ ...defaultState, ...JSON.parse(saved) });
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to local storage
  const saveState = useCallback((newState: A11yState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // Ignore
    }
  }, []);

  // Listen to focus events to support virtual keyboard typing into any active input
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
        !target.closest('.a11y-ignore')
      ) {
        setActiveInput(target as HTMLInputElement | HTMLTextAreaElement);
      }
    };

    window.addEventListener('focusin', handleFocus);
    return () => window.removeEventListener('focusin', handleFocus);
  }, []);

  // Current translation dictionary and layout direction
  const t = A11Y_I18N[state.language] || A11Y_I18N.he;
  const isRtl = state.language === 'he' || state.language === 'ar';
  const currentDirection = isRtl ? 'rtl' : 'ltr';

  // Apply Accessibility Classes & Styles to <html> and <body>
  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;
    const body = document.body;

    // 1. Font Scale
    root.classList.remove('a11y-font-1', 'a11y-font-2', 'a11y-font-3', 'a11y-font-4', 'a11y-font-5');
    if (state.fontScaleLevel > 0) {
      root.classList.add(`a11y-font-${state.fontScaleLevel}`);
    }

    // 2. Word Spacing
    root.classList.remove('a11y-word-1', 'a11y-word-2', 'a11y-word-3', 'a11y-word-4');
    if (state.wordSpacingLevel > 0) {
      root.classList.add(`a11y-word-${state.wordSpacingLevel}`);
    }

    // 3. Line Height
    root.classList.remove('a11y-line-1', 'a11y-line-2', 'a11y-line-3', 'a11y-line-4');
    if (state.lineHeightLevel > 0) {
      root.classList.add(`a11y-line-${state.lineHeightLevel}`);
    }

    // 4. Letter Spacing
    root.classList.remove('a11y-letter-1', 'a11y-letter-2', 'a11y-letter-3');
    if (state.letterSpacingLevel > 0) {
      root.classList.add(`a11y-letter-${state.letterSpacingLevel}`);
    }

    // 5. Contrast Mode
    root.classList.remove(
      'a11y-contrast-light',
      'a11y-contrast-dark',
      'a11y-contrast-grayscale',
      'a11y-contrast-invert'
    );
    if (state.contrastMode !== 'normal') {
      root.classList.add(`a11y-contrast-${state.contrastMode}`);
    }

    // 6. Custom Hues via CSS variables
    if (state.customBgHue !== null) {
      root.style.setProperty('--a11y-custom-bg', `hsl(${state.customBgHue}, 60%, 95%)`);
      root.classList.add('a11y-has-custom-bg');
    } else {
      root.style.removeProperty('--a11y-custom-bg');
      root.classList.remove('a11y-has-custom-bg');
    }

    if (state.customHeadingHue !== null) {
      root.style.setProperty('--a11y-custom-heading', `hsl(${state.customHeadingHue}, 80%, 30%)`);
      root.classList.add('a11y-has-custom-heading');
    } else {
      root.style.removeProperty('--a11y-custom-heading');
      root.classList.remove('a11y-has-custom-heading');
    }

    if (state.customTextHue !== null) {
      root.style.setProperty('--a11y-custom-text', `hsl(${state.customTextHue}, 80%, 25%)`);
      root.classList.add('a11y-has-custom-text');
    } else {
      root.style.removeProperty('--a11y-custom-text');
      root.classList.remove('a11y-has-custom-text');
    }

    // 7. Toggle Features
    root.classList.toggle('a11y-readable-font', state.readableFont);
    root.classList.toggle('a11y-highlight-links', state.highlightLinks);
    root.classList.toggle('a11y-highlight-headings', state.highlightHeadings);
    root.classList.toggle('a11y-screen-zoom', state.screenZoom);
    root.classList.toggle('a11y-stop-animations', state.stopAnimations);
    body.classList.toggle(
      'a11y-cursor-black',
      state.cursorMode === 'black' || (state.bigCursor && state.cursorMode !== 'white')
    );
    body.classList.toggle('a11y-cursor-white', state.cursorMode === 'white');
    root.classList.toggle('a11y-keyboard-nav', state.keyboardNav);
    root.classList.toggle('a11y-image-alt-tooltips', state.imageAltTooltips);

    // Save to storage
    saveState(state);
  }, [state, isClient, saveState]);

  // Keyboard shortcut: Alt + A opens accessibility drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsLanguageOpen(false);
        setShowReaderModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load browser speech voices and match to current selected language
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;
      setAvailableVoices(voices);

      const langCode =
        state.language === 'he'
          ? 'he'
          : state.language === 'ar'
          ? 'ar'
          : state.language === 'ru'
          ? 'ru'
          : 'en';

      const match = voices.find((v) => v.lang.toLowerCase().startsWith(langCode));
      if (match) {
        setSelectedVoice(match);
      } else if (voices.length > 0) {
        setSelectedVoice((prev) => prev || voices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [state.language]);

  // Extract all meaningful readable text elements across the page
  const extractReadableElements = useCallback((): HTMLElement[] => {
    if (typeof document === 'undefined') return [];
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, h5, h6, p, li, [role="heading"], button, a, [role="button"], td, th, span.font-bold'
      )
    );

    return elements.filter((el) => {
      if (el.closest('.a11y-ignore')) return false;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
      }
      const text = (el.innerText || el.textContent || '').trim();
      return text.length >= 2;
    });
  }, []);

  // Remove active highlight from all elements
  const clearSpeechHighlights = useCallback(() => {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.a11y-speech-active').forEach((el) => {
      el.classList.remove('a11y-speech-active');
    });
  }, []);

  // Speak element at specific index in sequence
  const speakElementAtIndex = useCallback(
    (index: number, elementsList?: HTMLElement[]) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const list = elementsList && elementsList.length > 0 ? elementsList : speechElements;

      if (!list || list.length === 0) {
        const freshList = extractReadableElements();
        setSpeechElements(freshList);
        if (freshList.length === 0) return;
        speakElementAtIndex(0, freshList);
        return;
      }

      if (index < 0 || index >= list.length) {
        clearSpeechHighlights();
        setIsSpeaking(false);
        setIsPaused(false);
        isPlayingRef.current = false;
        setSpeechIndex(0);
        return;
      }

      clearSpeechHighlights();
      const target = list[index];
      if (!target) return;

      target.classList.add('a11y-speech-active');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      window.speechSynthesis.cancel();
      const text = (target.innerText || target.textContent || '').trim();
      if (!text) {
        if (isPlayingRef.current) speakElementAtIndex(index + 1, list);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang =
        state.language === 'he'
          ? 'he-IL'
          : state.language === 'ar'
          ? 'ar-SA'
          : state.language === 'ru'
          ? 'ru-RU'
          : 'en-US';

      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = isMuted ? 0 : 1;

      utterance.onend = () => {
        if (isPlayingRef.current) {
          speakElementAtIndex(index + 1, list);
        } else {
          clearSpeechHighlights();
          setIsSpeaking(false);
        }
      };

      utterance.onerror = () => {
        clearSpeechHighlights();
        setIsSpeaking(false);
      };

      currentUtteranceRef.current = utterance;
      setSpeechIndex(index);
      setIsSpeaking(true);
      setIsPaused(false);
      isPlayingRef.current = true;
      window.speechSynthesis.speak(utterance);
    },
    [
      speechElements,
      extractReadableElements,
      clearSpeechHighlights,
      selectedVoice,
      state.language,
      speechRate,
      speechPitch,
      isMuted,
    ]
  );

  // Play / Pause Toggle
  const handlePlayPause = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('דפדפן זה אינו תומך בהקראת טקסט (Web Speech API).');
      return;
    }

    if (isSpeaking) {
      isPlayingRef.current = false;
      window.speechSynthesis.cancel();
      clearSpeechHighlights();
      setIsSpeaking(false);
      setIsPaused(true);
    } else {
      isPlayingRef.current = true;
      const list = speechElements.length > 0 ? speechElements : extractReadableElements();
      setSpeechElements(list);
      speakElementAtIndex(speechIndex, list);
    }
  }, [
    isSpeaking,
    speechElements,
    extractReadableElements,
    speakElementAtIndex,
    speechIndex,
    clearSpeechHighlights,
  ]);

  // Forward >> (Next block)
  const handleNextSentence = useCallback(() => {
    isPlayingRef.current = true;
    const list = speechElements.length > 0 ? speechElements : extractReadableElements();
    setSpeechElements(list);
    const nextIdx = Math.min(list.length - 1, speechIndex + 1);
    speakElementAtIndex(nextIdx, list);
  }, [speechElements, extractReadableElements, speechIndex, speakElementAtIndex]);

  // Rewind << (Previous block)
  const handlePrevSentence = useCallback(() => {
    isPlayingRef.current = true;
    const list = speechElements.length > 0 ? speechElements : extractReadableElements();
    setSpeechElements(list);
    const prevIdx = Math.max(0, speechIndex - 1);
    speakElementAtIndex(prevIdx, list);
  }, [speechElements, extractReadableElements, speechIndex, speakElementAtIndex]);

  // Restart 🔄 (From beginning)
  const handleRestartSpeech = useCallback(() => {
    isPlayingRef.current = true;
    const list = extractReadableElements();
    setSpeechElements(list);
    speakElementAtIndex(0, list);
  }, [extractReadableElements, speakElementAtIndex]);

  // Close floating speech player bar
  const handleCloseSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isPlayingRef.current = false;
    clearSpeechHighlights();
    setIsSpeechBarOpen(false);
    setIsSpeaking(false);
    setIsPaused(false);
    setContinuousReading(false);
    setIsSpeechSettingsOpen(false);
  }, [clearSpeechHighlights]);

  // Toggle Mute 🔊 / 🔇
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Toggle Continuous Reading 📑 (Hover over any text to read)
  const handleToggleContinuous = useCallback(() => {
    setContinuousReading((prev) => {
      const next = !prev;
      if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        clearSpeechHighlights();
        setIsSpeaking(false);
      }
      return next;
    });
  }, [clearSpeechHighlights]);

  // Continuous Reading Listener (Hover-to-read across all elements)
  useEffect(() => {
    if (!continuousReading || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    let hoverTimeout: NodeJS.Timeout | null = null;
    let hoveredEl: HTMLElement | null = null;

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.closest('.a11y-ignore')) return;

      const text = (target.innerText || target.textContent || '').trim();
      if (!text || text.length < 2) return;

      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        if (hoveredEl) hoveredEl.classList.remove('a11y-speech-active');
        hoveredEl = target;
        target.classList.add('a11y-speech-active');

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.lang =
          state.language === 'he'
            ? 'he-IL'
            : state.language === 'ar'
            ? 'ar-SA'
            : state.language === 'ru'
            ? 'ru-RU'
            : 'en-US';
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        utterance.volume = isMuted ? 0 : 1;
        utterance.onend = () => {
          target.classList.remove('a11y-speech-active');
        };
        utterance.onerror = () => {
          target.classList.remove('a11y-speech-active');
        };
        window.speechSynthesis.speak(utterance);
      }, 150);
    };

    document.addEventListener('mouseover', handleHover);
    return () => {
      document.removeEventListener('mouseover', handleHover);
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (hoveredEl) (hoveredEl as HTMLElement).classList.remove('a11y-speech-active');
    };
  }, [continuousReading, selectedVoice, speechRate, speechPitch, isMuted, state.language]);

  // Reset all accessibility modifications
  const handleResetAll = useCallback(() => {
    handleCloseSpeech();
    setShowReaderModal(false);
    saveState(defaultState);
  }, [handleCloseSpeech, saveState]);

  // Color Spectrum Click Handler
  const handleColorSpectrumClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const selectedHue = Math.round(percentage * 360);

    setState((prev) => {
      if (prev.colorTarget === 'background') return { ...prev, customBgHue: selectedHue };
      if (prev.colorTarget === 'headings') return { ...prev, customHeadingHue: selectedHue };
      return { ...prev, customTextHue: selectedHue };
    });
  };

  const handleResetColors = () => {
    setState((prev) => {
      if (prev.colorTarget === 'background') return { ...prev, customBgHue: null };
      if (prev.colorTarget === 'headings') return { ...prev, customHeadingHue: null };
      return { ...prev, customTextHue: null };
    });
  };

  // Font Stepper Handlers
  const handleStepperIncrease = () => {
    setState((prev) => {
      if (prev.fontAdjustmentMode === 'size') {
        return { ...prev, fontScaleLevel: Math.min(5, prev.fontScaleLevel + 1) };
      }
      if (prev.fontAdjustmentMode === 'word') {
        return { ...prev, wordSpacingLevel: Math.min(4, prev.wordSpacingLevel + 1) };
      }
      if (prev.fontAdjustmentMode === 'line') {
        return { ...prev, lineHeightLevel: Math.min(4, prev.lineHeightLevel + 1) };
      }
      return { ...prev, letterSpacingLevel: Math.min(3, prev.letterSpacingLevel + 1) };
    });
  };

  const handleStepperDecrease = () => {
    setState((prev) => {
      if (prev.fontAdjustmentMode === 'size') {
        return { ...prev, fontScaleLevel: Math.max(0, prev.fontScaleLevel - 1) };
      }
      if (prev.fontAdjustmentMode === 'word') {
        return { ...prev, wordSpacingLevel: Math.max(0, prev.wordSpacingLevel - 1) };
      }
      if (prev.fontAdjustmentMode === 'line') {
        return { ...prev, lineHeightLevel: Math.max(0, prev.lineHeightLevel - 1) };
      }
      return { ...prev, letterSpacingLevel: Math.max(0, prev.letterSpacingLevel - 1) };
    });
  };

  // Virtual Keyboard typing simulation
  const handleVirtualKeyPress = (char: string) => {
    if (!activeInput) return;
    const start = activeInput.selectionStart || activeInput.value.length;
    const end = activeInput.selectionEnd || activeInput.value.length;
    const val = activeInput.value;
    const newVal = val.slice(0, start) + char + val.slice(end);
    activeInput.value = newVal;
    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
    activeInput.setSelectionRange(start + char.length, start + char.length);
    activeInput.focus();
  };

  const handleVirtualBackspace = () => {
    if (!activeInput) return;
    const start = activeInput.selectionStart || activeInput.value.length;
    const end = activeInput.selectionEnd || activeInput.value.length;
    const val = activeInput.value;
    if (start === end && start > 0) {
      activeInput.value = val.slice(0, start - 1) + val.slice(end);
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.setSelectionRange(start - 1, start - 1);
    } else if (start !== end) {
      activeInput.value = val.slice(0, start) + val.slice(end);
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.setSelectionRange(start, start);
    }
    activeInput.focus();
  };

  // Check if any modification is active
  const isModified =
    state.fontScaleLevel > 0 ||
    state.wordSpacingLevel > 0 ||
    state.lineHeightLevel > 0 ||
    state.letterSpacingLevel > 0 ||
    state.contrastMode !== 'normal' ||
    state.customBgHue !== null ||
    state.customHeadingHue !== null ||
    state.customTextHue !== null ||
    state.readableFont ||
    state.highlightLinks ||
    state.highlightHeadings ||
    state.screenZoom ||
    state.stopAnimations ||
    state.bigCursor ||
    state.keyboardNav ||
    state.imageAltTooltips ||
    state.virtualKeyboard;

  // Active Hue for current selected color target
  const currentTargetHue =
    state.colorTarget === 'background'
      ? state.customBgHue
      : state.colorTarget === 'headings'
      ? state.customHeadingHue
      : state.customTextHue;

  // Stepper Current Level & Max Level
  const currentLevel =
    state.fontAdjustmentMode === 'size'
      ? state.fontScaleLevel
      : state.fontAdjustmentMode === 'word'
      ? state.wordSpacingLevel
      : state.fontAdjustmentMode === 'line'
      ? state.lineHeightLevel
      : state.letterSpacingLevel;

  const maxLevel =
    state.fontAdjustmentMode === 'size'
      ? 5
      : state.fontAdjustmentMode === 'word'
      ? 4
      : state.fontAdjustmentMode === 'line'
      ? 4
      : 3;

  // 14 Core Accessibility Features with Translated Titles & Descriptions
  const A11Y_TILES = [
    {
      id: 'keyboardNav',
      title: t.keyboardNavTitle,
      desc: t.keyboardNavDesc,
      icon: <Keyboard className="w-6 h-6 text-[#085B7A]" />,
      active: state.keyboardNav,
      onClick: () => setState((prev) => ({ ...prev, keyboardNav: !prev.keyboardNav })),
    },
    {
      id: 'speech',
      title: isSpeaking || isSpeechBarOpen ? t.speechStopTitle : t.speechTitle,
      desc: t.speechDesc,
      icon: (
        <Volume2
          className={`w-6 h-6 ${
            isSpeaking ? 'text-[#0088A9] animate-pulse' : 'text-[#085B7A]'
          }`}
        />
      ),
      active: isSpeechBarOpen || isSpeaking,
      onClick: () => {
        setIsSpeechBarOpen(true);
        setIsOpen(false);
        if (!isSpeaking) {
          handlePlayPause();
        }
      },
    },
    {
      id: 'contrastDark',
      title: t.contrastDarkTitle,
      desc: t.contrastDarkDesc,
      icon: <Moon className="w-6 h-6 text-[#085B7A]" />,
      active: state.contrastMode === 'dark',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'dark' ? 'normal' : 'dark' })),
    },
    {
      id: 'contrastLight',
      title: t.contrastLightTitle,
      desc: t.contrastLightDesc,
      icon: <Sun className="w-6 h-6 text-[#085B7A]" />,
      active: state.contrastMode === 'light',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'light' ? 'normal' : 'light' })),
    },
    {
      id: 'contrastInvert',
      title: t.contrastInvertTitle,
      desc: t.contrastInvertDesc,
      icon: <Contrast className="w-6 h-6 text-[#085B7A]" />,
      active: state.contrastMode === 'invert',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'invert' ? 'normal' : 'invert' })),
    },
    {
      id: 'grayscale',
      title: t.grayscaleTitle,
      desc: t.grayscaleDesc,
      icon: <Eye className="w-6 h-6 text-[#085B7A]" />,
      active: state.contrastMode === 'grayscale',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'grayscale' ? 'normal' : 'grayscale' })),
    },
    {
      id: 'screenZoom',
      title: t.screenZoomTitle,
      desc: t.screenZoomDesc,
      icon: <ZoomIn className="w-6 h-6 text-[#085B7A]" />,
      active: state.screenZoom,
      onClick: () => setState((prev) => ({ ...prev, screenZoom: !prev.screenZoom })),
    },
    {
      id: 'readableFont',
      title: t.readableFontTitle,
      desc: t.readableFontDesc,
      icon: <Type className="w-6 h-6 text-[#085B7A]" />,
      active: state.readableFont,
      onClick: () => setState((prev) => ({ ...prev, readableFont: !prev.readableFont })),
    },
    {
      id: 'imageAlt',
      title: t.imageAltTitle,
      desc: t.imageAltDesc,
      icon: <ImageIcon className="w-6 h-6 text-[#085B7A]" />,
      active: state.imageAltTooltips,
      onClick: () => setState((prev) => ({ ...prev, imageAltTooltips: !prev.imageAltTooltips })),
    },
    {
      id: 'highlightLinks',
      title: t.highlightLinksTitle,
      desc: t.highlightLinksDesc,
      icon: <LinkIcon className="w-6 h-6 text-[#085B7A]" />,
      active: state.highlightLinks,
      onClick: () => setState((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks })),
    },
    {
      id: 'highlightHeadings',
      title: t.highlightHeadingsTitle,
      desc: t.highlightHeadingsDesc,
      icon: <Heading className="w-6 h-6 text-[#085B7A]" />,
      active: state.highlightHeadings,
      onClick: () => setState((prev) => ({ ...prev, highlightHeadings: !prev.highlightHeadings })),
    },
    {
      id: 'readingMode',
      title: t.readingModeTitle,
      desc: t.readingModeDesc,
      icon: <BookOpen className="w-6 h-6 text-[#085B7A]" />,
      active: showReaderModal,
      onClick: () => setShowReaderModal(true),
    },
    {
      id: 'contentScale',
      title: t.contentScaleTitle,
      desc: t.contentScaleDesc,
      icon: <Search className="w-6 h-6 text-[#085B7A]" />,
      active: state.fontScaleLevel > 0,
      onClick: () => setState((prev) => ({
        ...prev,
        fontAdjustmentMode: 'size',
        fontScaleLevel: prev.fontScaleLevel >= 5 ? 0 : prev.fontScaleLevel + 1,
      })),
    },
    {
      id: 'virtualKeyboard',
      title: t.virtualKeyboardTitle,
      desc: t.virtualKeyboardDesc,
      icon: (
        <div className="w-6 h-6 border-2 border-[#085B7A] rounded-md flex flex-wrap gap-0.5 p-0.5 items-center justify-center">
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
          <span className="w-1 h-1 bg-[#085B7A] rounded-[1px]" />
        </div>
      ),
      active: state.virtualKeyboard,
      onClick: () => setState((prev) => ({ ...prev, virtualKeyboard: !prev.virtualKeyboard })),
    },
  ];

  if (!isClient) return null;

  return (
    <>
      {/* 1. Floating Accessibility Button (Circular by default, expands to badge on hover) */}
      {!isHiddenTemporarily && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 ${
            dockSide === 'right' ? 'right-6' : 'left-6'
          } z-[9999] h-12 w-12 hover:w-auto bg-[#085B7A] text-white hover:bg-[#064961] shadow-2xl border-2 border-white/40 rounded-full hover:rounded-2xl flex items-center justify-center hover:justify-start gap-2.5 p-2 hover:px-3.5 transition-all duration-300 transform hover:scale-105 active:scale-95 a11y-ignore group cursor-pointer overflow-hidden`}
          aria-label={`${t.title} (Alt + A)`}
          aria-expanded={isOpen}
          id="a11y-trigger-btn"
          dir={currentDirection}
        >
          {/* Universal Accessibility Icon + 4 Directional Arrows on hover */}
          <div className="flex flex-col items-center justify-center text-white shrink-0 group-hover:border-l group-hover:border-white/20 group-hover:pl-2">
            <Move className="w-3 h-3 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:block -mb-0.5" />
            <svg
              className="w-6 h-6 fill-current text-white transition-transform group-hover:scale-90"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
            </svg>
          </div>

          {/* Text that only shows smoothly on hover */}
          <div className="text-right hidden group-hover:block whitespace-nowrap animate-fadeIn">
            <span className="block text-[11px] font-black text-white leading-tight">
              {t.triggerBtn}
            </span>
            <span className="block text-[11px] font-bold text-cyan-300 leading-tight">
              {t.triggerA11y}
            </span>
          </div>

          {isModified && (
            <span
              className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"
              title={t.activeSettingsBadge}
            />
          )}
        </button>
      )}

      {/* 2. Main Accessibility Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <div
            className={`fixed inset-0 z-[99999] flex items-stretch ${
              dockSide === 'right' ? 'justify-end' : 'justify-start'
            } p-0 sm:p-4 bg-black/60 backdrop-blur-xs a11y-ignore`}
            dir="ltr"
          >
            {/* Click outside backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, x: dockSide === 'right' ? 80 : -80, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dockSide === 'right' ? 80 : -80, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="relative w-full sm:w-[440px] h-full sm:h-auto max-h-full sm:max-h-[96vh] overflow-y-auto bg-white rounded-none sm:rounded-3xl shadow-2xl border border-slate-300 text-[#1C1C1C] flex flex-col z-10 font-sans"
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-main-title"
              dir={currentDirection}
            >
              {/* ============================================================ */}
              {/* 1. TOP HEADER FRAME (Vibrant Classic Accessibility Blue)     */}
              {/* ============================================================ */}
              <div className="bg-[#085B7A] text-white p-4 pt-3.5 rounded-none sm:rounded-t-3xl relative shadow-md">
                {/* Top Controls Row (Close X, Language Dropdown, Actions) */}
                <div className="flex items-center justify-between gap-2.5">
                  {/* Close button X */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                    aria-label={t.close}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Language Selector Dropdown */}
                  <div className="relative flex-1 max-w-[190px]">
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="w-full flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
                      aria-expanded={isLanguageOpen}
                      aria-label={t.selectLanguage}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{LANGUAGES.find((l) => l.code === state.language)?.flag}</span>
                        <span>{LANGUAGES.find((l) => l.code === state.language)?.name}</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>

                    {isLanguageOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#1C1C1C] rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 py-1">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setState((prev) => ({ ...prev, language: lang.code as A11yState['language'] }));
                              setIsLanguageOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer ${
                              state.language === lang.code ? 'text-[#085B7A] bg-[#085B7A]/10 font-black' : 'text-[#3D3D3D]'
                            }`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                            {state.language === lang.code && <Check className={`w-3.5 h-3.5 ${isRtl ? 'mr-auto' : 'ml-auto'} text-[#085B7A]`} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Actions: Hide Widget & Toggle Left/Right Side */}
                  <div className="flex items-center gap-1.5">
                    {/* Hide button */}
                    <button
                      onClick={() => {
                        setIsHiddenTemporarily(true);
                        setIsOpen(false);
                      }}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                      title={t.hideWidget}
                      aria-label={t.hideWidget}
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>

                    {/* Switch Left / Right Dock Side */}
                    <button
                      onClick={() => setDockSide((prev) => (prev === 'left' ? 'right' : 'left'))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                      title="החלף צד תפריט (שמאל / ימין)"
                      aria-label="החלף צד תפריט"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Centered Outline Pill: "נגישות" */}
                <div className="flex justify-center mt-3 pb-1">
                  <div className="px-8 py-1 rounded-full border border-white/70 text-white font-black text-xs tracking-wider shadow-xs">
                    {t.title}
                  </div>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto relative">
                {/* Interactive Hover Tooltip Box */}
                <div className="min-h-[50px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {hoveredTile ? (
                      <motion.div
                        key={hoveredTile.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="w-full bg-[#085B7A] text-white p-2.5 px-3.5 rounded-xl shadow-lg text-center text-xs font-semibold leading-relaxed border border-white/20"
                      >
                        <strong className="text-amber-300 ml-1">{hoveredTile.title}:</strong>
                        <span>{hoveredTile.desc}</span>
                      </motion.div>
                    ) : (
                      <div className="w-full bg-slate-100 text-slate-600 p-2.5 px-3.5 rounded-xl text-center text-xs font-medium border border-slate-200">
                        {t.hoverPrompt}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ============================================================ */}
                {/* 2. 14 CORE FEATURES GRID (Square Tiles with Corner Check)     */}
                {/* ============================================================ */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {A11Y_TILES.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={tile.onClick}
                      onMouseEnter={() => setHoveredTile(tile)}
                      onMouseLeave={() => setHoveredTile(null)}
                      onFocus={() => setHoveredTile(tile)}
                      onBlur={() => setHoveredTile(null)}
                      className={`aspect-square p-2 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all active:scale-95 cursor-pointer relative group ${
                        tile.active
                          ? 'border-2 border-[#085B7A] bg-[#085B7A]/10 text-[#085B7A] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[#085B7A]/50 hover:bg-slate-50 text-[#085B7A]'
                      }`}
                      aria-pressed={tile.active}
                      title={tile.title}
                    >
                      {/* Top-Right Checkmark when active */}
                      {tile.active && (
                        <div
                          className={`absolute top-1.5 ${
                            isRtl ? 'right-1.5' : 'left-1.5'
                          } text-xs font-black text-[#085B7A] leading-none`}
                        >
                          ✓
                        </div>
                      )}

                      <div className="flex items-center justify-center h-7 text-[#085B7A]">
                        {tile.icon}
                      </div>
                      <span className="font-bold text-[10.5px] sm:text-xs leading-tight text-[#2C2C2C] line-clamp-2">
                        {tile.title}
                      </span>
                    </button>
                  ))}
                </div>

                {/* ============================================================ */}
                {/* 3. SECTION: COLOR ADJUSTMENTS (התאמת צבעים)                 */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-[#085B7A]">{t.colorSectionTitle}</h3>
                      <p className="text-[10.5px] text-[#6B6560]">{t.colorSectionDesc}</p>
                    </div>
                    <Sliders className="w-4 h-4 text-[#085B7A]" />
                  </div>

                  {/* Target Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'background' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'background'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-slate-200 hover:border-[#085B7A]'
                      }`}
                    >
                      {t.targetBackground}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'headings' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'headings'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-slate-200 hover:border-[#085B7A]'
                      }`}
                    >
                      {t.targetHeadings}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'text' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'text'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-slate-200 hover:border-[#085B7A]'
                      }`}
                    >
                      {t.targetText}
                    </button>
                  </div>

                  {/* Rainbow Spectrum Color Bar */}
                  <div
                    ref={colorSliderRef}
                    onClick={handleColorSpectrumClick}
                    className="relative h-5 rounded-full cursor-pointer shadow-inner mb-2.5 border border-black/10"
                    style={{
                      background:
                        'linear-gradient(to right, #000 0%, #fff 15%, #ff0000 25%, #ffff00 40%, #00ff00 55%, #00ffff 70%, #0000ff 85%, #ff00ff 100%)',
                    }}
                    title={t.colorSectionTitle}
                  >
                    {currentTargetHue !== null && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#085B7A] shadow-md -ml-2.5 pointer-events-none"
                        style={{ left: `${(currentTargetHue / 360) * 100}%` }}
                      />
                    )}
                  </div>

                  {/* Reset Colors Button */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleResetColors}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#085B7A] hover:underline cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {t.resetColors}
                    </button>

                    {currentTargetHue !== null && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {t.activeCustomColor}
                      </span>
                    )}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 3. SECTION: MOUSE CURSOR (סמן העכבר - Matching Screenshot)   */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between mb-3" dir={currentDirection}>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h3 className="font-bold text-sm text-[#085B7A] leading-snug">
                        {t.cursorSectionTitle}
                      </h3>
                      <p className="text-xs text-[#085B7A]/80 font-medium leading-snug">
                        {t.cursorSectionDesc}
                      </p>
                    </div>
                    <div className="text-[#085B7A] shrink-0">
                      <svg
                        className="w-6 h-6 fill-none stroke-current stroke-2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3l7 18 3-7 7-3L3 3z" />
                      </svg>
                    </div>
                  </div>

                  {/* 2 Pills: לבן / שחור */}
                  <div className="grid grid-cols-2 gap-2.5" dir={currentDirection}>
                    <button
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          cursorMode: prev.cursorMode === 'black' ? 'default' : 'black',
                          bigCursor: prev.cursorMode !== 'black',
                        }))
                      }
                      className={`py-2 px-3 rounded-full text-xs font-bold transition-all border cursor-pointer text-center ${
                        state.cursorMode === 'black' || (state.bigCursor && state.cursorMode !== 'white')
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                      aria-pressed={state.cursorMode === 'black'}
                    >
                      {t.cursorBlack}
                    </button>

                    <button
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          cursorMode: prev.cursorMode === 'white' ? 'default' : 'white',
                          bigCursor: prev.cursorMode !== 'white',
                        }))
                      }
                      className={`py-2 px-3 rounded-full text-xs font-bold transition-all border cursor-pointer text-center ${
                        state.cursorMode === 'white'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                      aria-pressed={state.cursorMode === 'white'}
                    >
                      {t.cursorWhite}
                    </button>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 4. SECTION: FONT ADJUSTMENTS (התאמות גופן - Matching Screenshot) */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between mb-3" dir={currentDirection}>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h3 className="font-bold text-sm text-[#085B7A] leading-snug">
                        {t.fontSectionTitle}
                      </h3>
                      <p className="text-xs text-[#085B7A]/80 font-medium leading-snug">
                        {t.fontSectionDesc}
                      </p>
                    </div>
                    <div className="text-[#085B7A] shrink-0 font-bold flex items-center justify-center">
                      <svg
                        className="w-6 h-6 fill-none stroke-current stroke-2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 20h16" />
                        <path d="M8 16l4-10 4 10" />
                        <path d="M10 12h4" />
                        <path d="M12 2v2" />
                      </svg>
                    </div>
                  </div>

                  {/* 4 Mode Pills in a single row (RTL order: גודל גופן, ריווח בין שורות, ריווח בין מילים, ריווח אותיות) */}
                  <div className="grid grid-cols-4 gap-1.5 mb-3.5" dir={currentDirection}>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'size' }))}
                      className={`py-1.5 px-1.5 rounded-full text-[11px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
                        state.fontAdjustmentMode === 'size'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                    >
                      {t.fontSize}
                    </button>

                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'line' }))}
                      className={`py-1.5 px-1.5 rounded-full text-[11px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
                        state.fontAdjustmentMode === 'line'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                    >
                      {t.lineHeight}
                    </button>

                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'word' }))}
                      className={`py-1.5 px-1.5 rounded-full text-[11px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
                        state.fontAdjustmentMode === 'word'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                    >
                      {t.wordSpacing}
                    </button>

                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'letter' }))}
                      className={`py-1.5 px-1.5 rounded-full text-[11px] font-bold transition-all border text-center cursor-pointer whitespace-nowrap ${
                        state.fontAdjustmentMode === 'letter'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs font-black'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                    >
                      {t.letterSpacing}
                    </button>
                  </div>

                  {/* Smooth Range Slider Bar (Pill with - on left and + on right) */}
                  <div
                    className="relative h-9 bg-slate-100/90 rounded-full flex items-center p-1 border border-slate-200/80 shadow-inner select-none"
                    dir="ltr"
                  >
                    {/* Minus Button */}
                    <button
                      onClick={handleStepperDecrease}
                      disabled={currentLevel <= 0}
                      className="w-7 h-7 rounded-full bg-[#085B7A] text-white flex items-center justify-center font-black text-sm disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 z-10"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    {/* Blue Filled Range Bar */}
                    <div className="flex-1 h-full mx-1.5 relative overflow-hidden rounded-full flex items-center bg-slate-200/60">
                      <div
                        className="h-full bg-[#085B7A]/75 rounded-full transition-all duration-200 shadow-xs"
                        style={{
                          width: `${(currentLevel / maxLevel) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Plus Button */}
                    <button
                      onClick={handleStepperIncrease}
                      disabled={currentLevel >= maxLevel}
                      className="w-7 h-7 rounded-full bg-[#085B7A] text-white flex items-center justify-center font-black text-sm disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer shadow-xs shrink-0 z-10"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 5. SECTION: COLOR ADJUSTMENTS (התאמת צבעים אישית)           */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#085B7A]">{t.colorSectionTitle}</h3>
                      <p className="text-xs text-[#085B7A]/80">{t.colorSectionDesc}</p>
                    </div>
                    <Sliders className="w-4 h-4 text-[#085B7A]" />
                  </div>

                  {/* Target Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'background' }))}
                      className={`py-1.5 px-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'background'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                    >
                      {t.targetBackground}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'headings' }))}
                      className={`py-1.5 px-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'headings'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                    >
                      {t.targetHeadings}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'text' }))}
                      className={`py-1.5 px-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'text'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#085B7A] border-[#085B7A]/35 hover:border-[#085B7A] hover:bg-[#085B7A]/5'
                      }`}
                    >
                      {t.targetText}
                    </button>
                  </div>

                  {/* Rainbow Spectrum Color Bar */}
                  <div
                    ref={colorSliderRef}
                    onClick={handleColorSpectrumClick}
                    className="relative h-5 rounded-full cursor-pointer shadow-inner mb-2.5 border border-black/10"
                    style={{
                      background:
                        'linear-gradient(to right, #000 0%, #fff 15%, #ff0000 25%, #ffff00 40%, #00ff00 55%, #00ffff 70%, #0000ff 85%, #ff00ff 100%)',
                    }}
                    title={t.colorSectionTitle}
                  >
                    {currentTargetHue !== null && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#085B7A] shadow-md -ml-2.5 pointer-events-none"
                        style={{ left: `${(currentTargetHue / 360) * 100}%` }}
                      />
                    )}
                  </div>

                  {/* Reset Colors Button */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleResetColors}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#085B7A] hover:underline cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {t.resetColors}
                    </button>

                    {currentTargetHue !== null && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {t.activeCustomColor}
                      </span>
                    )}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 6. EXTRA UTILITIES (עצירת אנימציות)                         */}
                {/* ============================================================ */}
                <div>
                  <button
                    onClick={() => setState((prev) => ({ ...prev, stopAnimations: !prev.stopAnimations }))}
                    className={`w-full p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      state.stopAnimations
                        ? 'border-[#085B7A] bg-[#085B7A]/10 text-[#085B7A] font-black'
                        : 'border-slate-200 bg-white text-[#3D3D3D] hover:border-[#085B7A]'
                    }`}
                    aria-pressed={state.stopAnimations}
                  >
                    <Sparkles className="w-4 h-4 text-[#085B7A]" />
                    {t.stopAnimations}
                  </button>
                </div>
              </div>

              {/* ============================================================ */}
              {/* 6. BOTTOM FOOTER (Classic Accessibility Blue)               */}
              {/* ============================================================ */}
              <div className="bg-[#085B7A] text-white p-3.5 space-y-2 mt-auto rounded-none sm:rounded-b-3xl">
                <button
                  onClick={handleResetAll}
                  className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-black transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t.resetAll}
                </button>

                <div className="flex items-center justify-between text-[11px] text-white/80 pt-1">
                  <Link
                    href="/accessibility"
                    onClick={() => setIsOpen(false)}
                    className="hover:underline font-bold text-white"
                  >
                    {t.statementLink}
                  </Link>

                  <span className="opacity-70 text-[10px]">{t.standardBadge}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. On-Screen Virtual Keyboard (Layout dynamically matches selected language) */}
      <AnimatePresence>
        {state.virtualKeyboard && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-[999999] bg-[#1E293B] text-white p-3 rounded-2xl shadow-2xl border-2 border-cyan-500/40 select-none a11y-ignore"
            dir={currentDirection}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 text-xs">
              <span className="font-black text-cyan-300 flex items-center gap-1.5">
                {t.keyboardTitle}
              </span>
              <button
                onClick={() => setState((prev) => ({ ...prev, virtualKeyboard: false }))}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                aria-label={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {(KEYBOARD_LAYOUTS[state.language] || KEYBOARD_LAYOUTS.he).map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center gap-1">
                  {row.map((char) => (
                    <button
                      key={char}
                      onClick={() => handleVirtualKeyPress(char)}
                      className="flex-1 min-w-[24px] h-9 sm:h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-sm sm:text-base font-bold text-white shadow-xs border border-slate-600 transition-colors cursor-pointer"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}

              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => handleVirtualKeyPress(' ')}
                  className="flex-1 h-9 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-xs font-bold text-white shadow-xs border border-slate-600 cursor-pointer"
                >
                  {t.spaceKey}
                </button>
                <button
                  onClick={handleVirtualBackspace}
                  className="w-16 h-9 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                  aria-label={t.backspaceKey}
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Accessible Reader & Print Mode Modal Window */}
      {showReaderModal && (
        <div className="fixed inset-0 z-[999999] bg-white text-[#1C1C1C] p-6 sm:p-12 overflow-y-auto a11y-ignore" dir={currentDirection}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
              <div>
                <h2 className="text-2xl font-black">{t.readerTitle}</h2>
                <p className="text-xs text-[#6B6560]">{t.readerSubtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-[#085B7A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#064961] transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> {t.printBtn}
                </button>
                <button
                  onClick={() => setShowReaderModal(false)}
                  className="bg-zinc-200 hover:bg-zinc-300 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 text-base sm:text-lg leading-relaxed">
              <section>
                <h3 className="text-xl font-bold mb-2">{t.readerAboutTitle}</h3>
                <p>{t.readerAboutContent}</p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-2">{t.readerServicesTitle}</h3>
                <ul className="list-disc pr-6 pl-6 space-y-2">
                  <li>תספורת גברים פרימיום – ₪80 (30 דקות)</li>
                  <li>עיצוב ופיסול זקן Master – ₪40 (20 דקות)</li>
                  <li>חבילת VIP משולבת (תספורת + זקן) – ₪110 (45 דקות)</li>
                  <li>תספורת ילדים ונוער – ₪70 (30 דקות)</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating Speech Player Bar (Exact Match for Image 1) */}
      <AnimatePresence>
        {isSpeechBarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-[999999] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.18)] border border-slate-200/90 py-2 sm:py-2.5 px-3 sm:px-4 flex items-center gap-1.5 sm:gap-3 select-none a11y-ignore"
            dir="ltr"
          >
            {/* Top-Left Floating Circular Close X Button */}
            <button
              onClick={handleCloseSpeech}
              className="absolute -top-3 -left-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label={t.speechClose}
              title={t.speechClose}
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* 1. Volume / Mute Speaker (🔊 / 🔇) */}
            <button
              onClick={handleToggleMute}
              className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isMuted
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-[#0088A9] hover:bg-[#0088A9]/10'
              }`}
              title={isMuted ? t.speechUnmute : t.speechMute}
              aria-label={isMuted ? t.speechUnmute : t.speechMute}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2
                  className={`w-5 h-5 ${
                    isSpeaking ? 'animate-pulse text-[#0088A9]' : 'text-[#0088A9]'
                  }`}
                />
              )}
            </button>

            {/* Vertical Divider */}
            <div className="w-[1px] h-6 bg-slate-200" />

            {/* 2. Play / Pause (▶️ / ⏸️) */}
            <button
              onClick={handlePlayPause}
              className="p-1.5 sm:p-2 rounded-xl text-[#0088A9] hover:bg-[#0088A9]/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title={isSpeaking ? t.speechPause : t.speechPlay}
              aria-label={isSpeaking ? t.speechPause : t.speechPlay}
            >
              {isSpeaking ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </button>

            {/* 3. Rewind << (Previous section) */}
            <button
              onClick={handlePrevSentence}
              className="p-1.5 sm:p-2 rounded-xl text-[#0088A9] hover:bg-[#0088A9]/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title={t.speechPrev}
              aria-label={t.speechPrev}
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>

            {/* 4. Forward >> (Next section) */}
            <button
              onClick={handleNextSentence}
              className="p-1.5 sm:p-2 rounded-xl text-[#0088A9] hover:bg-[#0088A9]/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title={t.speechNext}
              aria-label={t.speechNext}
            >
              <ChevronsRight className="w-5 h-5" />
            </button>

            {/* Vertical Divider */}
            <div className="w-[1px] h-6 bg-slate-200" />

            {/* 5. Restart 🔄 (From beginning) */}
            <button
              onClick={handleRestartSpeech}
              className="p-1.5 sm:p-2 rounded-xl text-[#0088A9] hover:bg-[#0088A9]/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title={t.speechRestart}
              aria-label={t.speechRestart}
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Vertical Divider */}
            <div className="w-[1px] h-6 bg-slate-200" />

            {/* 6. Continuous / Hover-To-Read Mode 📑 (Notepad icon for continuous reading) */}
            <button
              onClick={handleToggleContinuous}
              className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                continuousReading
                  ? 'bg-[#0088A9] text-white shadow-md ring-2 ring-[#0088A9]/30'
                  : 'text-[#0088A9] hover:bg-[#0088A9]/10'
              }`}
              title={`${t.continuousReadingTitle}: ${t.continuousReadingDesc}`}
              aria-label={t.continuousReadingTitle}
              aria-pressed={continuousReading}
            >
              <FileText className="w-5 h-5" />
            </button>

            {/* Vertical Divider */}
            <div className="w-[1px] h-6 bg-slate-200" />

            {/* 7. Settings Gear ⚙️ (Opens Image 2 popup) */}
            <button
              onClick={() => setIsSpeechSettingsOpen((prev) => !prev)}
              className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isSpeechSettingsOpen
                  ? 'bg-[#0088A9] text-white shadow-md'
                  : 'text-[#0088A9] hover:bg-[#0088A9]/10'
              }`}
              title={t.speechSettingsTitle}
              aria-label={t.speechSettingsTitle}
              aria-expanded={isSpeechSettingsOpen}
            >
              <Settings className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Speech Settings Modal Dialog (Exact Match for Image 2) */}
      <AnimatePresence>
        {isSpeechSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-[9999999] w-[92vw] max-w-[370px] bg-white rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.22)] border border-slate-200 p-4 sm:p-5 a11y-ignore text-slate-800 select-none"
            dir="rtl"
          >
            {/* Top Close X Button */}
            <div className="flex items-center justify-end pb-1 mb-2">
              <button
                onClick={() => setIsSpeechSettingsOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#0088A9] hover:text-black transition-colors cursor-pointer"
                aria-label={t.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Voice Selector Banner (Teal / Cyan Banner with Flag & Name) */}
            <div className="bg-[#0088A9] text-white rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 mb-4 shadow-sm">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">
                  {LANGUAGES.find((l) => l.code === state.language)?.flag || '🇮🇱'}
                </span>
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = availableVoices.find((v) => v.name === e.target.value);
                    if (voice) setSelectedVoice(voice);
                  }}
                  className="bg-transparent text-white font-bold text-xs outline-none w-full truncate cursor-pointer"
                  aria-label={t.speechVoice}
                >
                  {availableVoices.length > 0 ? (
                    availableVoices.map((v) => (
                      <option key={v.name} value={v.name} className="bg-slate-900 text-white">
                        {v.name} ({v.lang})
                      </option>
                    ))
                  ) : (
                    <option value="" className="bg-slate-900 text-white">
                      Microsoft Asaf - Hebrew (Israel)
                    </option>
                  )}
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-white/80 pointer-events-none shrink-0" />
            </div>

            {/* 2 Circular Gauge Controls Side-by-Side (גובה צליל & קצב) */}
            <div className="grid grid-cols-2 gap-3 py-2 relative">
              {/* Vertical Center Divider */}
              <div className="absolute top-2 bottom-2 left-1/2 w-[1px] bg-slate-200 -translate-x-1/2" />

              {/* 1. גובה צליל (Pitch) */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-bold text-[#0088A9] mb-2.5">
                  {t.speechPitch}
                </span>

                <div className="flex items-center justify-center gap-2 w-full">
                  {/* Minus Button */}
                  <button
                    onClick={() =>
                      setSpeechPitch((p) => Math.max(0.5, Number((p - 0.1).toFixed(1))))
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0088A9] font-black text-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    title="הנמך גובה צליל"
                    aria-label="הנמך גובה צליל"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Rotary Dial Gauge */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-[#0088A9] flex items-center justify-center bg-white shadow-xs">
                    {/* Inner Solid Circle with Current Value */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0088A9] flex items-center justify-center text-white font-black text-xs shadow-xs">
                      {speechPitch.toFixed(1)}
                    </div>

                    {/* Indicator Dot on the outer ring */}
                    <div
                      className="absolute w-3 h-3 rounded-full bg-[#0088A9] border-2 border-white shadow-sm"
                      style={{
                        top: `${50 - 46 * Math.cos(((speechPitch - 0.5) / 1.3) * 2 * Math.PI)}%`,
                        left: `${50 + 46 * Math.sin(((speechPitch - 0.5) / 1.3) * 2 * Math.PI)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>

                  {/* Plus Button */}
                  <button
                    onClick={() =>
                      setSpeechPitch((p) => Math.min(1.8, Number((p + 0.1).toFixed(1))))
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0088A9] font-black text-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    title="הגבר גובה צליל"
                    aria-label="הגבר גובה צליל"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. קצב (Rate / Speed) */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-bold text-[#0088A9] mb-2.5">
                  {t.speechRate}
                </span>

                <div className="flex items-center justify-center gap-2 w-full">
                  {/* Minus Button */}
                  <button
                    onClick={() =>
                      setSpeechRate((r) => Math.max(0.5, Number((r - 0.1).toFixed(1))))
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0088A9] font-black text-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    title="האט קצב"
                    aria-label="האט קצב"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Rotary Dial Gauge */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-[#0088A9] flex items-center justify-center bg-white shadow-xs">
                    {/* Inner Solid Circle with Current Value */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0088A9] flex items-center justify-center text-white font-black text-xs shadow-xs">
                      {speechRate.toFixed(1)}
                    </div>

                    {/* Indicator Dot on the outer ring */}
                    <div
                      className="absolute w-3 h-3 rounded-full bg-[#0088A9] border-2 border-white shadow-sm"
                      style={{
                        top: `${50 - 46 * Math.cos(((speechRate - 0.5) / 1.5) * 2 * Math.PI)}%`,
                        left: `${50 + 46 * Math.sin(((speechRate - 0.5) / 1.5) * 2 * Math.PI)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>

                  {/* Plus Button */}
                  <button
                    onClick={() =>
                      setSpeechRate((r) => Math.min(2.0, Number((r + 0.1).toFixed(1))))
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0088A9] font-black text-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    title="הגבר קצב"
                    aria-label="הגבר קצב"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Left Circular Close Button (Matches Image 2) */}
            <div className="flex items-center justify-start pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={() => setIsSpeechSettingsOpen(false)}
                className="w-7 h-7 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center text-slate-500 hover:text-black transition-colors cursor-pointer"
                aria-label={t.close}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
