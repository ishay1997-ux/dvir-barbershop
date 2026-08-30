export interface ThemeTokens {
  isLight: boolean;
  bgTheme: 'dark-obsidian' | 'brand-midnight' | 'luxury-light' | 'cyber-carbon';
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
  const isLight = bgTheme === 'luxury-light';
  const theme = (bgTheme as any) || 'dark-obsidian';

  if (isLight) {
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
