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
      cardBg: 'bg-white/95 border border-purple-200/90 shadow-xl shadow-purple-100/50 backdrop-blur-md',
      cardSubtleBg: 'bg-purple-50/80 border border-purple-100',
      textPrimary: 'text-slate-950',
      textSecondary: 'text-purple-950/85',
      textMuted: 'text-purple-900/60',
      borderColor: 'border-purple-200/90',
      divideColor: 'divide-purple-100',
      hoverItemBg: 'hover:bg-purple-50/90',
      buttonSecondaryBg: 'bg-purple-50 hover:bg-purple-100 text-purple-950 border-purple-200',
      badgeBg: 'bg-purple-100/80 text-purple-950 border-purple-200',
    };
  }

  if (theme === 'botanical-sage') {
    return {
      isLight: true,
      bgTheme: 'botanical-sage',
      sectionBg: 'bg-transparent text-slate-900',
      cardBg: 'bg-white/95 border border-emerald-200/90 shadow-xl shadow-emerald-100/40 backdrop-blur-md',
      cardSubtleBg: 'bg-emerald-50/80 border border-emerald-100',
      textPrimary: 'text-slate-950',
      textSecondary: 'text-emerald-950/85',
      textMuted: 'text-emerald-900/60',
      borderColor: 'border-emerald-200/90',
      divideColor: 'divide-emerald-100',
      hoverItemBg: 'hover:bg-emerald-50/90',
      buttonSecondaryBg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-200',
      badgeBg: 'bg-emerald-100/80 text-emerald-950 border-emerald-200',
    };
  }

  if (theme === 'luxury-light') {
    return {
      isLight: true,
      bgTheme: 'luxury-light',
      sectionBg: 'bg-transparent text-stone-900',
      cardBg: 'bg-white/95 border border-amber-200/70 shadow-xl shadow-amber-950/5 backdrop-blur-md',
      cardSubtleBg: 'bg-stone-50/90 border border-amber-100/70',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-700',
      textMuted: 'text-stone-500',
      borderColor: 'border-amber-200/70',
      divideColor: 'divide-amber-100',
      hoverItemBg: 'hover:bg-amber-50/80',
      buttonSecondaryBg: 'bg-amber-50 hover:bg-amber-100/80 text-amber-950 border-amber-200/80',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/80',
    };
  }

  if (theme === 'brand-midnight') {
    return {
      isLight: false,
      bgTheme: 'brand-midnight',
      sectionBg: 'bg-transparent text-blue-50',
      cardBg: 'bg-[#0B1528]/95 border border-blue-400/25 shadow-2xl shadow-blue-950/60 backdrop-blur-md',
      cardSubtleBg: 'bg-[#070D18]/80 border border-blue-400/15',
      textPrimary: 'text-blue-50',
      textSecondary: 'text-blue-200/80',
      textMuted: 'text-blue-300/60',
      borderColor: 'border-blue-400/20',
      divideColor: 'divide-blue-400/15',
      hoverItemBg: 'hover:bg-blue-900/40',
      buttonSecondaryBg: 'bg-blue-950/80 hover:bg-blue-900/80 text-blue-200 border-blue-400/30',
      badgeBg: 'bg-blue-950/90 text-blue-300 border-blue-400/30',
    };
  }

  if (theme === 'cyber-carbon') {
    return {
      isLight: false,
      bgTheme: 'cyber-carbon',
      sectionBg: 'bg-transparent text-white',
      cardBg: 'bg-[#0C0E14]/95 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 backdrop-blur-md',
      cardSubtleBg: 'bg-black/60 border border-emerald-500/20',
      textPrimary: 'text-white',
      textSecondary: 'text-emerald-300/80',
      textMuted: 'text-zinc-400',
      borderColor: 'border-emerald-500/25',
      divideColor: 'divide-emerald-500/20',
      hoverItemBg: 'hover:bg-emerald-950/40',
      buttonSecondaryBg: 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/30',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
    };
  }

  // Dark Obsidian (Default Luxury Dark)
  return {
    isLight: false,
    bgTheme: 'dark-obsidian',
    sectionBg: 'bg-transparent text-white',
    cardBg: 'bg-[#18181F]/90 border border-white/10 shadow-2xl backdrop-blur-md',
    cardSubtleBg: 'bg-black/40 border border-white/5',
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
