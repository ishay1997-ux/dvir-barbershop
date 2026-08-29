'use client';

import React from 'react';

export default function SkipToContent() {
  return (
    <div className="a11y-screen-reader-anchors sr-only focus-within:not-sr-only">
      {/* 1. Blind / Screen-Reader Mode Trigger */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[999999] focus:px-5 focus:py-3 focus:bg-[#085B7A] focus:text-white focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400 text-sm transition-all"
        onClick={() => {
          document.documentElement.classList.add('a11y-keyboard-nav');
        }}
      >
        שִׂים לֵב: בְּאֲתָר זֶה מֻפְעֶלֶת מַעֲרֶכֶת נְגִישׁוּת. לְחַץ Control-F11 לְהַתְאָמַת הָאֲתָר לְעִוְורִים הַמִּשְׁתַּמְּשִׁים בְּתוֹכְנַת קוֹרֵא־מָסָךְ; לְחַץ Control-F10 לִפְתִיחַת תַּפְרִיט נְגִישׁוּת.
      </a>

      {/* 2. Skip directly to central content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-16 focus:right-2 focus:z-[999999] focus:px-5 focus:py-3 focus:bg-[#C9A84C] focus:text-[#1C1C1C] focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-black text-sm transition-all"
      >
        דלג לתוכן המרכזי של האתר (Enter)
      </a>

      {/* 3. Screen Reader Fast Links */}
      <button
        type="button"
        onClick={() => {
          const btn = document.getElementById('a11y-trigger-btn');
          if (btn) btn.click();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-30 focus:right-2 focus:z-[999999] focus:px-5 focus:py-3 focus:bg-slate-900 focus:text-yellow-300 focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 text-sm transition-all cursor-pointer"
      >
        לְחַץ אֶנְטֵר לִפְתִיחַת תַּפְרִיט נְגִישׁוּת (Control-F10)
      </button>
    </div>
  );
}
