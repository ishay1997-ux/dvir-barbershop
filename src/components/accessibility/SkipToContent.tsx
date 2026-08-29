'use client';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[99999] focus:px-6 focus:py-3 focus:bg-[#C9A84C] focus:text-[#1C1C1C] focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-black transition-all"
    >
      דלג לתוכן המרכזי של האתר (Enter)
    </a>
  );
}
