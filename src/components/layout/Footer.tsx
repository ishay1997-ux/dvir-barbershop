import Link from 'next/link';
import { Scissors, Phone, MapPin, Clock, Lock } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';

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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1C1C] text-white" role="contentinfo" id="footer">
      {/* Gold top border */}
      <div className="h-0.5 gradient-gold" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                <Scissors className="w-5 h-5 text-[#1C1C1C] -rotate-45" />
              </div>
              <div>
                <span className="block text-xl font-black tracking-wider">
                  המספרה של <span className="text-gold">דביר</span>
                </span>
                <span className="text-xs text-[#6B6560]">אריאל & רחובות</span>
              </div>
            </div>
            <p className="text-[#9E9891] text-sm leading-relaxed max-w-xs">
              {SHOP_INFO.tagline}. תספורות גברים, דירוגי פייד ופיסול זקן ברמה הגבוהה ביותר.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-2">
              <a
                href={SHOP_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-[#3D3D3D] flex items-center justify-center text-[#9E9891] hover:border-gold hover:text-gold transition-all duration-200"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={SHOP_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-[#3D3D3D] flex items-center justify-center text-[#9E9891] hover:border-gold hover:text-gold transition-all duration-200"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Hours & Branches */}
          <div>
            <h3 className="text-sm font-bold tracking-widest text-gold mb-5 uppercase">סניפים ושעות פעילות</h3>
            <ul className="flex flex-col gap-3 text-xs">
              <li className="bg-[#2A2A2A] p-3 rounded-xl border border-[#3D3D3D]">
                <div className="font-bold text-white mb-1">📍 סניף אריאל (אוניברסיטה)</div>
                <div className="text-[#9E9891]">ימים א׳-ג׳: 09:00 – 20:00</div>
              </li>
              <li className="bg-[#2A2A2A] p-3 rounded-xl border border-[#3D3D3D]">
                <div className="font-bold text-white mb-1">📍 סניף רחובות (בית ההורים)</div>
                <div className="text-[#9E9891]">ימים ד׳-ו׳: 09:00 – 20:00 (ו׳ עד 14:00)</div>
              </li>
            </ul>
          </div>

          {/* Contact + CTA */}
          <div>
            <h3 className="text-sm font-bold tracking-widest text-gold mb-5 uppercase">יצירת קשר</h3>
            <ul className="flex flex-col gap-4 mb-8">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a
                  href={`tel:${SHOP_INFO.phone}`}
                  className="text-sm text-[#9E9891] hover:text-gold transition-colors"
                  dir="ltr"
                >
                  {SHOP_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-sm text-[#9E9891]">הזמנות אונליין 24/7</span>
              </li>
            </ul>

            <div className="flex flex-col gap-3">
              <Link
                href="/booking"
                className="btn-shimmer inline-block text-center text-[#1C1C1C] font-bold text-sm px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200 shadow-md"
                id="footer-cta-button"
              >
                הזמן תור עכשיו ←
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2A2A2A] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B6560]">
            © {currentYear} המספרה של דביר. כל הזכויות שמורות.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#9E9891]">
            <Link
              href="/accessibility"
              className="hover:text-gold transition-colors flex items-center gap-1.5"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-gold/50" />
              הצהרת נגישות (ת"י 5568)
            </Link>
            <span>·</span>
            <Link
              href="/admin"
              className="hover:text-gold transition-colors flex items-center gap-1.5 font-bold text-gold/80 hover:text-gold bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10"
            >
              <Lock className="w-3 h-3" />
              כניסת מנהל (דביר)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
