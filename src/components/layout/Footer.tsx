import Link from 'next/link';
import { Scissors, Phone, MapPin, Clock, Lock } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import { BusinessConfig } from '@/types/business';
import { SHORT_VERSION_LABEL } from '@/config/version';
import { getThemeTokens } from '@/lib/theme-tokens';
import { getIndustryMeta } from '@/lib/industry-terminology';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="3"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function Footer({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const currentYear = new Date().getFullYear();

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';
  const city = business?.city || 'אריאל & רחובות';
  const phone = business?.phone || SHOP_INFO.phone;
  const slug = business?.slug || 'dvir';
  const bgTheme = business?.layout?.bgTheme || 'dark-obsidian';
  const t = getThemeTokens(bgTheme);

  const facebook = business?.facebookUrl || (slug === 'dvir' ? SHOP_INFO.facebook : '');
  const instagram = business?.instagramUrl || (business?.instagramHandle
    ? (business.instagramHandle.startsWith('http') ? business.instagramHandle : `https://instagram.com/${business.instagramHandle.replace('@', '')}`)
    : (slug === 'dvir' ? SHOP_INFO.instagram : ''));

  const branches = business?.branches && business.branches.length > 0
    ? business.branches
    : [
        { name: 'סניף אריאל (אוניברסיטה)', address: 'מעונות הסטודנטים', hours: 'ימים א׳-ג׳: 09:00 – 20:00' },
        { name: 'סניף רחובות (קליניקה פרטית)', address: 'רחובות', hours: 'ימים ד׳-ו׳: 09:00 – 20:00' },
      ];

  const industryIcon = getIndustryMeta(business).icon;

  return (
    <footer className={`border-t transition-colors ${t.isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#1C1C1C] text-white border-white/10'}`} role="contentinfo" id="footer" dir="rtl">
      {/* Brand top border */}
      <div className="h-0.5" style={{ backgroundColor: themeColor }} />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-right">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#1C1C1C] overflow-hidden"
                style={{ backgroundColor: themeColor }}
              >
                {business?.logoUrl || business?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={business.logoUrl || business.avatarUrl}
                    alt={bizName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg">{industryIcon}</span>
                )}
              </div>
              <div>
                <span className={`block text-xl font-black tracking-wider ${t.textPrimary}`}>
                  {bizName}
                </span>
                <span className={`text-xs ${t.textMuted}`}>{city}</span>
              </div>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-xs font-sans ${t.textSecondary}`}>
              {business?.slogan || 'תספורות פרימיום, דירוגי פייד ופיסול זקן ברמה הגבוהה ביותר בישראל.'}
            </p>
            {/* Social */}
            {(instagram || facebook) && (
              <div className="flex gap-3 mt-2">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${t.isLight ? 'border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900' : 'border-[#3D3D3D] text-[#9E9891] hover:border-white hover:text-white'}`}
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${t.isLight ? 'border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900' : 'border-[#3D3D3D] text-[#9E9891] hover:border-white hover:text-white'}`}
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Hours & Branches */}
          <div>
            <h3 className="text-sm font-bold tracking-widest mb-5 uppercase" style={{ color: themeColor }}>
              סניפים ושעות פעילות
            </h3>
            <ul className="flex flex-col gap-3 text-xs">
              {branches.map((b, idx) => (
                <li key={idx} className={`p-3 rounded-xl border transition-colors ${t.isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#2A2A2A] border-[#3D3D3D]'}`}>
                  <div className={`font-bold mb-1 ${t.textPrimary}`}>📍 {b.name}</div>
                  <div className={t.textSecondary}>{b.hours || b.address}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + CTA */}
          <div>
            <h3 className="text-sm font-bold tracking-widest mb-5 uppercase" style={{ color: themeColor }}>
              יצירת קשר
            </h3>
            <ul className="flex flex-col gap-4 mb-8">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: themeColor }} />
                <a
                  href={`tel:${phone}`}
                  className={`text-sm hover:underline transition-colors ${t.textSecondary}`}
                  dir="ltr"
                >
                  {phone}
                </a>
              </li>
            </ul>

            <Link
              href={slug === 'dvir' || slug === 'thecut' ? '/booking' : `/${slug}/booking`}
              className="inline-block w-full text-[#1C1C1C] font-black text-center text-sm py-3 px-6 rounded-full transition-opacity hover:opacity-90 shadow-lg cursor-pointer"
              style={{ backgroundColor: themeColor }}
            >
              הזמן תור עכשיו
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${t.isLight ? 'border-slate-200 text-slate-500' : 'border-[#3D3D3D] text-[#9E9891]'}`}>
          <div className="flex items-center gap-2">
            <span>© {currentYear} {bizName} · כל הזכויות שמורות</span>
            <span className="text-[11px] opacity-70">({SHORT_VERSION_LABEL})</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className={`hover:underline transition-colors ${t.isLight ? 'text-slate-600 hover:text-slate-900' : 'hover:text-white'}`}>
              תנאי שימוש
            </Link>
            <span>·</span>
            <Link href="/privacy" className={`hover:underline transition-colors ${t.isLight ? 'text-slate-600 hover:text-slate-900' : 'hover:text-white'}`}>
              מדיניות פרטיות
            </Link>
            <span>·</span>
            <Link href="/accessibility" className={`hover:underline transition-colors ${t.isLight ? 'text-slate-600 hover:text-slate-900' : 'hover:text-white'}`}>
              הצהרת נגישות
            </Link>
            <span>·</span>
            <Link href="/admin" className={`hover:underline transition-colors flex items-center gap-1 ${t.isLight ? 'text-slate-600 hover:text-slate-900' : 'hover:text-white'}`}>
              <Lock className="w-3 h-3" /> ניהול
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
