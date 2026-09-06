'use client';

import React from 'react';
import './accessibility.widget.css'; // generated: npm run build:a11y-css
import './accessibility.base.css';

export default function SkipToContent() {
  return (
    <div className="a11y-screen-reader-anchors acc:sr-only acc:focus-within:not-sr-only">
      {/* 1. Blind / Screen-Reader Mode Trigger */}
      <a
        href="#main-content"
        className="acc:sr-only acc:focus:not-sr-only acc:focus:fixed acc:focus:top-2 acc:focus:right-2 acc:focus:z-[999999] acc:focus:px-5 acc:focus:py-3 acc:focus:bg-[#085B7A] acc:focus:text-white acc:focus:font-black acc:focus:rounded-xl acc:focus:shadow-2xl acc:focus:outline-none acc:focus:ring-4 acc:focus:ring-yellow-400 acc:text-sm acc:transition-all"
        onClick={() => {
          document.documentElement.classList.add('a11y-keyboard-nav');
        }}
      >
        שִׂים לֵב: בְּאֲתָר זֶה מֻפְעֶלֶת מַעֲרֶכֶת נְגִישׁוּת. לְחַץ Control-F11 לְהַתְאָמַת הָאֲתָר לְעִוְורִים הַמִּשְׁתַּמְּשִׁים בְּתוֹכְנַת קוֹרֵא־מָסָךְ; לְחַץ Control-F10 לִפְתִיחַת תַּפְרִיט נְגִישׁוּת.
      </a>

      {/* 2. Skip directly to central content */}
      <a
        href="#main-content"
        className="acc:sr-only acc:focus:not-sr-only acc:focus:fixed acc:focus:top-16 acc:focus:right-2 acc:focus:z-[999999] acc:focus:px-5 acc:focus:py-3 acc:focus:bg-[#C9A84C] acc:focus:text-[#1C1C1C] acc:focus:font-black acc:focus:rounded-xl acc:focus:shadow-2xl acc:focus:outline-none acc:focus:ring-4 acc:focus:ring-black acc:text-sm acc:transition-all"
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
        className="acc:sr-only acc:focus:not-sr-only acc:focus:fixed acc:focus:top-30 acc:focus:right-2 acc:focus:z-[999999] acc:focus:px-5 acc:focus:py-3 acc:focus:bg-slate-900 acc:focus:text-yellow-300 acc:focus:font-black acc:focus:rounded-xl acc:focus:shadow-2xl acc:focus:outline-none acc:focus:ring-4 acc:focus:ring-blue-400 acc:text-sm acc:transition-all acc:cursor-pointer"
      >
        לְחַץ אֶנְטֵר לִפְתִיחַת תַּפְרִיט נְגִישׁוּת (Control-F10)
      </button>
    </div>
  );
}
