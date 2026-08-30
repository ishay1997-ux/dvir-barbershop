export type BgThemeOption =
  | 'dark-obsidian'
  | 'brand-midnight'
  | 'luxury-light'
  | 'cyber-carbon'
  | 'lavender-mist'
  | 'botanical-sage';

export interface ThemeTokens {
  isLight: boolean;
  bgTheme: BgThemeOption;
  sectionBg: string;
  cardBg: string;
  cardSubtleBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderColor: string;
  divideColor: string;
  hoverItemBg: string;
  buttonSecondaryBg: string;
  badgeBg: string;
}

export function getThemeTokens(bgTheme?: string): ThemeTokens {
  const theme = (bgTheme as BgThemeOption) || 'dark-obsidian';
  const isLight = theme === 'luxury-light' || theme === 'lavender-mist' || theme === 'botanical-sage';

  if (theme === 'lavender-mist') {
    return {
      isLight: true,
      bgTheme: 'lavender-mist',
      sectionBg: 'bg-transparent text-slate-900',
      cardBg: 'bg-white/95 border border-purple-200/90 shadow-xl shadow-purple-100/50',
      cardSubtleBg: 'bg-purple-50/70 border border-purple-100',
      textPrimary: 'text-slate-950',
      textSecondary: 'text-purple-950/80',
      textMuted: 'text-purple-900/60',
      borderColor: 'border-purple-200/90',
      divideColor: 'divide-purple-100',
      hoverItemBg: 'hover:bg-purple-50/80',
      buttonSecondaryBg: 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200',
      badgeBg: 'bg-purple-100/80 text-purple-900 border-purple-200',
    };
  }

  if (theme === 'botanical-sage') {
    return {
      isLight: true,
      bgTheme: 'botanical-sage',
      sectionBg: 'bg-transparent text-slate-900',
      cardBg: 'bg-white/95 border border-emerald-200/90 shadow-xl shadow-emerald-100/40',
      cardSubtleBg: 'bg-emerald-50/70 border border-emerald-100',
      textPrimary: 'text-slate-950',
      textSecondary: 'text-emerald-950/80',
      textMuted: 'text-emerald-900/60',
      borderColor: 'border-emerald-200/90',
      divideColor: 'divide-emerald-100',
      hoverItemBg: 'hover:bg-emerald-50/80',
      buttonSecondaryBg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200',
      badgeBg: 'bg-emerald-100/80 text-emerald-900 border-emerald-200',
    };
  }

  if (theme === 'luxury-light') {
    return {
      isLight: true,
      bgTheme: 'luxury-light',
      sectionBg: 'bg-transparent text-slate-900',
      cardBg: 'bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50',
      cardSubtleBg: 'bg-slate-50/90 border border-slate-200/70',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-500',
      borderColor: 'border-slate-200',
      divideColor: 'divide-slate-200/80',
      hoverItemBg: 'hover:bg-slate-100/80',
      buttonSecondaryBg: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  }

  return {
    isLight: false,
    bgTheme: theme,
    sectionBg: 'bg-transparent text-white',
    cardBg: 'bg-[#1F1F24] border border-white/10 shadow-2xl',
    cardSubtleBg: 'bg-black/30 border border-white/5',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-300',
    textMuted: 'text-zinc-400',
    borderColor: 'border-white/10',
    divideColor: 'divide-white/10',
    hoverItemBg: 'hover:bg-white/5',
    buttonSecondaryBg: 'bg-white/10 hover:bg-white/15 text-white border-white/10',
    badgeBg: 'bg-white/10 text-zinc-300 border-white/10',
  };
}
