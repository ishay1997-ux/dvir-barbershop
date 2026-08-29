export interface A11yState {
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

export const defaultState: A11yState = {
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

export const STORAGE_KEY = 'thecut_a11y_v3_state';

export const LANGUAGES = [
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
] as const;

export interface TileItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}
