'use client';

import React, { useState } from 'react';
import { Sparkles, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TopAnnouncementBannerProps {
  announcement?: string;
  themeColor?: string;
  link?: string;
  linkText?: string;
  isDismissible?: boolean;
}

export default function TopAnnouncementBanner({
  announcement,
  themeColor = '#C9A84C',
  link,
  linkText = 'לפרטים והזמנה ↗',
  isDismissible = true,
}: TopAnnouncementBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!announcement || isDismissed) return null;

  return (
    <aside
      aria-label="הודעה חשובה ומבצעים"
      className="relative z-40 w-full py-2.5 px-4 text-xs font-bold text-white shadow-md transition-all border-b"
      style={{
        backgroundColor: '#0F172A',
        borderColor: `${themeColor}40`,
      }}
      dir="rtl"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, ${themeColor} 0%, transparent 80%)`,
        }}
      />

      <div className="container mx-auto px-4 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2 flex-1 justify-center text-center">
          <span
            className="w-2 h-2 rounded-full animate-pulse shrink-0"
            style={{ backgroundColor: themeColor }}
          />
          <span className="text-xs sm:text-sm text-slate-100 font-medium tracking-wide">
            {announcement}
          </span>

          {link && (
            <Link
              href={link}
              className="inline-flex items-center gap-1 font-black underline underline-offset-4 hover:opacity-80 transition-opacity mr-1.5"
              style={{ color: themeColor }}
            >
              <span>{linkText}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isDismissible && (
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="סגור הודעה"
            title="סגור הודעה"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
