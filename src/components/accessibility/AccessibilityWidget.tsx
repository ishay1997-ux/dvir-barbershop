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
    fontSectionTitle: 'התאמות גופן וריווחים',
    fontSectionDesc: 'שליטה מדויקת בגודל הגופן ובריווח בין מילים ושורות',
    fontSize: 'גודל גופן',
    wordSpacing: 'ריווח בין מילים',
    lineHeight: 'ריווח בין שורות',
    letterSpacing: 'ריווח אותיות',
    levelOf: (lvl: number, max: number) => `דרגה ${lvl} מתוך ${max}`,

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
    fontSectionTitle: 'Typography & Spacing',
    fontSectionDesc: 'Precise fine-tuning of font sizes, word gaps, and line heights',
    fontSize: 'Font Size',
    wordSpacing: 'Word Spacing',
    lineHeight: 'Line Height',
    letterSpacing: 'Letter Spacing',
    levelOf: (lvl: number, max: number) => `Level ${lvl} of ${max}`,

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
    fontSectionTitle: 'الخط والمسافات',
    fontSectionDesc: 'تحكم دقيق بحجم الخطوط والمسافات بين الكلمات والأسطر',
    fontSize: 'حجم الخط',
    wordSpacing: 'تباعد الكلمات',
    lineHeight: 'ارتفاع السطر',
    letterSpacing: 'تباعد الأحرف',
    levelOf: (lvl: number, max: number) => `المستوى ${lvl} من ${max}`,

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
    fontSectionTitle: 'Шрифт и интервалы',
    fontSectionDesc: 'Точное управление размером шрифта, интервалами слов и строк',
    fontSize: 'Размер шрифта',
    wordSpacing: 'Интервал слов',
    lineHeight: 'Высота строки',
    letterSpacing: 'Межбуквенный интервал',
    levelOf: (lvl: number, max: number) => `Уровень ${lvl} из ${max}`,

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
  const [state, setState] = useState<A11yState>(defaultState);
  const [isClient, setIsClient] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [isHiddenTemporarily, setIsHiddenTemporarily] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<{ id: string; title: string; desc: string } | null>(null);
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const colorSliderRef = useRef<HTMLDivElement>(null);

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
    body.classList.toggle('a11y-big-cursor', state.bigCursor);
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

  // Text-To-Speech Reader with current language locale
  const handleToggleSpeech = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('דפדפן זה אינו תומך בהקראת טקסט (Web Speech API).');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const mainContent = document.querySelector('main') || document.body;
    const textToRead = (mainContent.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1500);

    if (!textToRead) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Match speech locale to selected language
    utterance.lang =
      state.language === 'he'
        ? 'he-IL'
        : state.language === 'ar'
        ? 'ar-SA'
        : state.language === 'ru'
        ? 'ru-RU'
        : 'en-US';

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSpeaking, state.language]);

  // Reset all accessibility modifications
  const handleResetAll = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setShowReaderModal(false);
    saveState(defaultState);
  }, [saveState]);

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
      icon: <Keyboard className="w-7 h-7 text-[#085B7A]" />,
      active: state.keyboardNav,
      onClick: () => setState((prev) => ({ ...prev, keyboardNav: !prev.keyboardNav })),
    },
    {
      id: 'speech',
      title: isSpeaking ? t.speechStopTitle : t.speechTitle,
      desc: t.speechDesc,
      icon: isSpeaking ? <VolumeX className="w-7 h-7 text-red-500 animate-pulse" /> : <Volume2 className="w-7 h-7 text-[#085B7A]" />,
      active: isSpeaking,
      onClick: handleToggleSpeech,
    },
    {
      id: 'contrastDark',
      title: t.contrastDarkTitle,
      desc: t.contrastDarkDesc,
      icon: <Moon className="w-7 h-7 text-[#085B7A]" />,
      active: state.contrastMode === 'dark',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'dark' ? 'normal' : 'dark' })),
    },
    {
      id: 'contrastLight',
      title: t.contrastLightTitle,
      desc: t.contrastLightDesc,
      icon: <Sun className="w-7 h-7 text-[#085B7A]" />,
      active: state.contrastMode === 'light',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'light' ? 'normal' : 'light' })),
    },
    {
      id: 'contrastInvert',
      title: t.contrastInvertTitle,
      desc: t.contrastInvertDesc,
      icon: <Contrast className="w-7 h-7 text-[#085B7A]" />,
      active: state.contrastMode === 'invert',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'invert' ? 'normal' : 'invert' })),
    },
    {
      id: 'grayscale',
      title: t.grayscaleTitle,
      desc: t.grayscaleDesc,
      icon: <Eye className="w-7 h-7 text-[#085B7A]" />,
      active: state.contrastMode === 'grayscale',
      onClick: () => setState((prev) => ({ ...prev, contrastMode: prev.contrastMode === 'grayscale' ? 'normal' : 'grayscale' })),
    },
    {
      id: 'screenZoom',
      title: t.screenZoomTitle,
      desc: t.screenZoomDesc,
      icon: <ZoomIn className="w-7 h-7 text-[#085B7A]" />,
      active: state.screenZoom,
      onClick: () => setState((prev) => ({ ...prev, screenZoom: !prev.screenZoom })),
    },
    {
      id: 'readableFont',
      title: t.readableFontTitle,
      desc: t.readableFontDesc,
      icon: <Type className="w-7 h-7 text-[#085B7A]" />,
      active: state.readableFont,
      onClick: () => setState((prev) => ({ ...prev, readableFont: !prev.readableFont })),
    },
    {
      id: 'imageAlt',
      title: t.imageAltTitle,
      desc: t.imageAltDesc,
      icon: <ImageIcon className="w-7 h-7 text-[#085B7A]" />,
      active: state.imageAltTooltips,
      onClick: () => setState((prev) => ({ ...prev, imageAltTooltips: !prev.imageAltTooltips })),
    },
    {
      id: 'highlightLinks',
      title: t.highlightLinksTitle,
      desc: t.highlightLinksDesc,
      icon: <LinkIcon className="w-7 h-7 text-[#085B7A]" />,
      active: state.highlightLinks,
      onClick: () => setState((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks })),
    },
    {
      id: 'highlightHeadings',
      title: t.highlightHeadingsTitle,
      desc: t.highlightHeadingsDesc,
      icon: <Heading className="w-7 h-7 text-[#085B7A]" />,
      active: state.highlightHeadings,
      onClick: () => setState((prev) => ({ ...prev, highlightHeadings: !prev.highlightHeadings })),
    },
    {
      id: 'readingMode',
      title: t.readingModeTitle,
      desc: t.readingModeDesc,
      icon: <BookOpen className="w-7 h-7 text-[#085B7A]" />,
      active: showReaderModal,
      onClick: () => setShowReaderModal(true),
    },
    {
      id: 'contentScale',
      title: t.contentScaleTitle,
      desc: t.contentScaleDesc,
      icon: <Search className="w-7 h-7 text-[#085B7A]" />,
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
        <div className="w-7 h-7 border-2 border-[#085B7A] rounded-md flex flex-wrap gap-0.5 p-0.5 items-center justify-center">
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
          className="fixed bottom-6 left-6 z-[9999] h-12 w-12 hover:w-auto bg-[#085B7A] text-white hover:bg-[#064961] shadow-2xl border-2 border-white/40 rounded-full hover:rounded-2xl flex items-center justify-center hover:justify-start gap-2.5 p-2 hover:px-3.5 transition-all duration-300 transform hover:scale-105 active:scale-95 a11y-ignore group cursor-pointer overflow-hidden"
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
          <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-start p-0 sm:p-4 bg-black/60 backdrop-blur-xs a11y-ignore">
            {/* Click outside backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full sm:w-[480px] max-h-[94vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#D5E2E8] text-[#1C1C1C] flex flex-col z-10 font-sans"
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-main-title"
              dir={currentDirection}
            >
              {/* Top Header Frame */}
              <div className="bg-[#085B7A] text-white p-4 pt-4 rounded-t-3xl sm:rounded-t-3xl relative">
                <div className="flex items-center justify-between gap-3">
                  {/* Close button X */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                    aria-label={t.close}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Language Selector Dropdown */}
                  <div className="relative flex-1 max-w-[200px]">
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="w-full flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
                      aria-expanded={isLanguageOpen}
                      aria-label={t.selectLanguage}
                    >
                      <span className="flex items-center gap-2">
                        <span>{LANGUAGES.find((l) => l.code === state.language)?.flag}</span>
                        <span>{LANGUAGES.find((l) => l.code === state.language)?.name}</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {isLanguageOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#1C1C1C] rounded-xl shadow-xl border border-[#D5E2E8] overflow-hidden z-30 py-1">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setState((prev) => ({ ...prev, language: lang.code as A11yState['language'] }));
                              setIsLanguageOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold hover:bg-[#F0F6F8] transition-colors cursor-pointer ${
                              state.language === lang.code ? 'text-[#085B7A] bg-[#E5EFF2]' : 'text-[#3D3D3D]'
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

                  {/* Hide widget button */}
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
                </div>

                {/* Banner title */}
                <div className="text-center mt-3 pb-1">
                  <h2 id="a11y-main-title" className="text-xl font-black tracking-wide text-white">
                    {t.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-4 space-y-4 overflow-y-auto relative">
                {/* Interactive Hover Tooltip Box */}
                <div className="min-h-[54px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {hoveredTile ? (
                      <motion.div
                        key={hoveredTile.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="w-full bg-[#475569] text-white p-2.5 px-3.5 rounded-xl shadow-lg text-center text-xs font-semibold leading-relaxed border border-slate-500/40"
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
                {/* 1. 14 CORE FEATURES GRID                                     */}
                {/* ============================================================ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {A11Y_TILES.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={tile.onClick}
                      onMouseEnter={() => setHoveredTile(tile)}
                      onMouseLeave={() => setHoveredTile(null)}
                      onFocus={() => setHoveredTile(tile)}
                      onBlur={() => setHoveredTile(null)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-1.5 transition-all active:scale-95 cursor-pointer relative group ${
                        tile.active
                          ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A] ring-2 ring-[#085B7A]/20 shadow-xs'
                          : 'border-[#D5E2E8] bg-white hover:border-[#085B7A]/60 hover:bg-[#F8FBFC] text-[#085B7A]'
                      }`}
                      aria-pressed={tile.active}
                      title={tile.title}
                    >
                      <div className="flex items-center justify-center h-8">
                        {tile.icon}
                      </div>
                      <span className="font-bold text-[11px] sm:text-xs leading-tight text-[#085B7A]">
                        {tile.title}
                      </span>
                      {tile.active && (
                        <div className={`absolute top-1.5 ${isRtl ? 'right-1.5' : 'left-1.5'} w-2 h-2 rounded-full bg-emerald-500`} />
                      )}
                    </button>
                  ))}
                </div>

                {/* ============================================================ */}
                {/* 2. SECTION: COLOR ADJUSTMENTS (התאמת צבעים)                 */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border-2 border-[#D5E2E8] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-black text-sm text-[#085B7A]">{t.colorSectionTitle}</h3>
                      <p className="text-[11px] text-[#6B6560]">{t.colorSectionDesc}</p>
                    </div>
                    <Sliders className="w-4 h-4 text-[#085B7A]" />
                  </div>

                  {/* Target Buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'background' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'background'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      {t.targetBackground}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'headings' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'headings'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      {t.targetHeadings}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, colorTarget: 'text' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.colorTarget === 'text'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      {t.targetText}
                    </button>
                  </div>

                  {/* Rainbow Spectrum Color Bar */}
                  <div
                    ref={colorSliderRef}
                    onClick={handleColorSpectrumClick}
                    className="relative h-6 rounded-full cursor-pointer shadow-inner mb-3 border border-black/10"
                    style={{
                      background:
                        'linear-gradient(to right, #000 0%, #fff 15%, #ff0000 25%, #ffff00 40%, #00ff00 55%, #00ffff 70%, #0000ff 85%, #ff00ff 100%)',
                    }}
                    title={t.colorSectionTitle}
                  >
                    {currentTargetHue !== null && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#085B7A] shadow-md -ml-3 pointer-events-none"
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
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {t.activeCustomColor}
                      </span>
                    )}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 3. SECTION: FONT ADJUSTMENTS (התאמות גופן וריווח)           */}
                {/* ============================================================ */}
                <div className="bg-white rounded-2xl border-2 border-[#D5E2E8] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-black text-sm text-[#085B7A]">{t.fontSectionTitle}</h3>
                      <p className="text-[11px] text-[#6B6560]">{t.fontSectionDesc}</p>
                    </div>
                    <Type className="w-4 h-4 text-[#085B7A]" />
                  </div>

                  {/* Mode Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'size' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.fontAdjustmentMode === 'size'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      {t.fontSize} {state.fontScaleLevel > 0 && `(+${state.fontScaleLevel * 10}%)`}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'word' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.fontAdjustmentMode === 'word'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      {t.wordSpacing}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'line' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.fontAdjustmentMode === 'line'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      {t.lineHeight}
                    </button>
                    <button
                      onClick={() => setState((prev) => ({ ...prev, fontAdjustmentMode: 'letter' }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        state.fontAdjustmentMode === 'letter'
                          ? 'bg-[#085B7A] text-white border-[#085B7A] shadow-xs'
                          : 'bg-white text-[#3D3D3D] border-[#D5E2E8] hover:border-[#085B7A]'
                      }`}
                    >
                      {t.letterSpacing}
                    </button>
                  </div>

                  {/* Stepper Control: [-] === [+] */}
                  <div className="flex items-center gap-3 bg-[#F0F6F8] rounded-2xl p-2 border border-[#D5E2E8]">
                    <button
                      onClick={handleStepperDecrease}
                      disabled={currentLevel <= 0}
                      className="w-10 h-10 rounded-xl bg-[#085B7A] text-white flex items-center justify-center font-black text-lg disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer"
                      aria-label="Decrease"
                    >
                      -
                    </button>

                    {/* Level Track Bar */}
                    <div className="flex-1 px-2">
                      <div className="w-full bg-[#D5E2E8] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#085B7A] h-full transition-all duration-200"
                          style={{ width: `${(currentLevel / maxLevel) * 100}%` }}
                        />
                      </div>
                      <div className="text-center text-[10px] font-bold text-[#085B7A] mt-1">
                        {t.levelOf(currentLevel, maxLevel)}
                      </div>
                    </div>

                    <button
                      onClick={handleStepperIncrease}
                      disabled={currentLevel >= maxLevel}
                      className="w-10 h-10 rounded-xl bg-[#085B7A] text-white flex items-center justify-center font-black text-lg disabled:opacity-40 hover:bg-[#064961] active:scale-95 transition-all cursor-pointer"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 4. EXTRA UTILITIES (Big cursor & Stop animations)           */}
                {/* ============================================================ */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setState((prev) => ({ ...prev, bigCursor: !prev.bigCursor }))}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      state.bigCursor
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A]'
                        : 'border-[#D5E2E8] bg-white text-[#3D3D3D] hover:border-[#085B7A]'
                    }`}
                    aria-pressed={state.bigCursor}
                  >
                    <MousePointer className="w-3.5 h-3.5" />
                    {t.bigCursor}
                  </button>

                  <button
                    onClick={() => setState((prev) => ({ ...prev, stopAnimations: !prev.stopAnimations }))}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      state.stopAnimations
                        ? 'border-[#085B7A] bg-[#E5EFF2] text-[#085B7A]'
                        : 'border-[#D5E2E8] bg-white text-[#3D3D3D] hover:border-[#085B7A]'
                    }`}
                    aria-pressed={state.stopAnimations}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.stopAnimations}
                  </button>
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="bg-[#085B7A] text-white p-4 space-y-2 mt-auto">
                <button
                  onClick={handleResetAll}
                  className="w-full py-2.5 rounded-xl bg-white text-[#085B7A] hover:bg-white/90 text-xs font-black transition-colors shadow-xs cursor-pointer"
                >
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

                  <span className="opacity-70">{t.standardBadge}</span>
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
    </>
  );
}
