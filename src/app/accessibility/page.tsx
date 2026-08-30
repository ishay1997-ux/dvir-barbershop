import type { Metadata } from 'next';
import { ShieldCheck, Phone, Mail, CheckCircle, Clock, Keyboard, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { LegalNavbar } from '@/components/marketing/LegalNavbar';
import { MarketingFooter } from '@/components/marketing/sections/MarketingFooter';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | CutWeb OS - פלטפורמת ניהול יומנים ואתרי עסקים',
  description: 'הצהרת נגישות מלאה לפי תקן ישראלי ת"י 5568 ברמת AA ודרישות WCAG 2.1 – פירוט התאמות נגישות בפלטפורמת CutWeb.',
};

export default function AccessibilityPage() {
  const lastUpdated = '30 באוגוסט 2026';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900" dir="rtl">
      <LegalNavbar />

      <main id="main-content" className="flex-1 py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Header Banner */}
          <div className="bg-slate-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-4">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 text-xs font-bold tracking-wide">
                תקן ישראלי ת"י 5568 · רמת AA · WCAG 2.1
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-4">הצהרת נגישות</h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              הנהלת פלטפורמת <strong>CutWeb OS</strong> רואה חשיבות עליונה בהנגשת האתר, מערכות הניהול וכלל אתרי הלקוחות וטפסי זימון התורים לאנשים עם מוגבלויות, ופועלת על פי עקרונות שוויון, כבוד והכלה.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col gap-8">
            {/* Quick Keyboard Access Notice */}
            <div className="bg-indigo-50/80 border-2 border-indigo-200/80 rounded-2xl p-5 text-indigo-950 text-sm leading-relaxed">
              <div className="font-black text-indigo-900 text-base mb-2 flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-indigo-600" />
                <span>שִׂים לֵב: בַּמַּעֲרֶכֶת מֻפְעֶלֶת נְגִישׁוּת מִתְקַדֶּמֶת</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-indigo-900/90">
                <li>• לְחַץ <strong>Control + F11</strong> לְהַתְאָמַת הָאֲתָר לְעִוְורִים הַמִּשְׁתַּמְּשִׁים בְּתוֹכְנַת קוֹרֵא־מָסָךְ.</li>
                <li>• לְחַץ <strong>Control + F10</strong> או <strong>Alt + A</strong> לִפְתִיחַת תַּפְרִיט נְגִישׁוּת.</li>
                <li>• לחץ <strong>Enter</strong> בראש הדף לקפיצה ישירה לתוכן המרכזי.</li>
              </ul>
            </div>

            {/* General Statement */}
            <section aria-labelledby="statement-intro">
              <h2 id="statement-intro" className="text-xl font-black text-slate-900 mb-3">
                מחויבותנו לנגישות דיגיטלית
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                פלטפורמת CutWeb, לרבות דפי השיווק, ממשקי ניהול היומנים (Admin Dashboard) וכל אתרי הלקוחות וטפסי קביעת התורים המוקמים באמצעותה, מותאמים להנחיות Web Content Accessibility Guidelines (WCAG) 2.0 ו-2.1 ברמה AA, כפי שפורסמו על ידי ארגון התקינה הבינלאומי W3C, ובהתאם לתקן הישראלי ת"י 5568 להנגשת אתרי אינטרנט.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Actions Taken for Accessibility */}
            <section aria-labelledby="actions-taken">
              <h2 id="actions-taken" className="text-xl font-black text-slate-900 mb-4">
                פעולות והתאמות שבוצעו לשיפור הנגישות במערכת:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'התאמה מלאה לקוראי מסך (Screen Readers)',
                    desc: 'שימוש בתגיות ARIA, טקסט חלופי (Alt) לכל התמונות, והיררכיית כותרות סמנטית ברורה (H1-H6).',
                  },
                  {
                    title: 'ניווט מקלדת מלא בין שדות הטופס',
                    desc: 'אמצעי ניווט פשוטים ונוחים, כולל מעבר בין כל שדות הטופס, הכפתורים והתורים באמצעות מקש Tab ו-Enter.',
                  },
                  {
                    title: 'ניגודיות צבעים מוקפדת (Color Contrast)',
                    desc: 'יחסי ניגודיות מחמירים לפי תקן WCAG AA לטקסטים, כפתורים ואייקונים לקריאות מקסימלית.',
                  },
                  {
                    title: 'שליטה בגודל גופן וריווחים',
                    desc: 'תמיכה מלאה בהגדלת טקסטים בדפדפן עד 200% ללא פגיעה במבנה הדף או בחוויית המשתמש.',
                  },
                  {
                    title: 'התאמה מלאה למובייל וטאבלט',
                    desc: 'ממשק רספונסיבי מותאם מגע עם מטרות לחיצה (Touch Targets) בגודל תקני של לפחות 44x44 פיקסלים.',
                  },
                  {
                    title: 'טפסים נגישים עם חיווי שגיאות קולי וחזותי',
                    desc: 'הודעות שגיאה ברורות ומזוהות ע"י קורא מסך, עם הסבר מפורש כיצד לתקן שדות שגויים.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                      <div className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Accessibility Limitations / Disclaimer */}
            <section aria-labelledby="a11y-disclaimer">
              <h2 id="a11y-disclaimer" className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>סייגים לנגישות</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3">
                אנו מקפידים על בניית טפסים ודפים נגישים ברמת AA. עם זאת, ייתכן כי חלק מהתכנים המועלים על ידי בעלי עסקים שונים (כגון תמונות גלריה פרטיות) יחסרו לעיתים תיאור טקסטואלי מלא.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                בנוסף, רכיבים חיצוניים מוטמעים שאינם בשליטתנו המלאה (כגון מפות Google Maps או סרטוני וידאו מצד שלישי) עלולים שלא להיות נגישים במלואם.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Continuous Improvement & Contact */}
            <section aria-labelledby="coordinator-info">
              <h2 id="coordinator-info" className="text-xl font-black text-slate-900 mb-3">
                רכז הנגישות ודרכי התקשרות
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                נתקלת בבעיית נגישות באתר או במערכת? מעוניין להציע הצעה לשיפור? צוות הנגישות של CutWeb זמין וקשוב לכל פנייה:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">טלפון / WhatsApp רכז נגישות</div>
                    <a href="tel:0587815070" className="font-bold text-slate-900 text-sm hover:text-indigo-600" dir="ltr">
                      058-781-5070
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">אימייל לפניות נגישות</div>
                    <a href="mailto:support@cutweb.co.il" className="font-bold text-slate-900 text-sm hover:text-indigo-600">
                      support@cutweb.co.il
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4" />
                <span>תאריך עדכון אחרון: <strong>{lastUpdated}</strong></span>
              </div>
            </section>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-8 py-3.5 rounded-full hover:bg-slate-800 transition-colors shadow-md hover:scale-105"
              >
                <span>חזרה לעמוד הבית הראשי</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
