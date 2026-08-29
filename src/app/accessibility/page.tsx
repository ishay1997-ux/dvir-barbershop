import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import { ShieldCheck, Phone, Mail, MapPin, CheckCircle, Clock, Keyboard, Eye, AlertCircle } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | The Cut & המספרה של דביר',
  description: 'הצהרת נגישות מלאה לפי תקן ישראלי ת"י 5568 ברמת AA ודרישות WCAG 2.1 – פירוט התאמות נגישות באתר ובמספרה.',
};

export default function AccessibilityPage() {
  const lastUpdated = '30 באוגוסט 2026';

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[#FAF7F2] pt-24 pb-20" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Banner */}
          <div className="bg-[#1C1C1C] rounded-3xl p-8 sm:p-12 text-center text-white mb-10 shadow-lg relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-bold tracking-wide">תקן ישראלי ת"י 5568 · רמת AA · WCAG 2.1</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-4">הצהרת נגישות</h1>
            <p className="text-[#9E9891] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              הנהלת {SHOP_INFO.name} ופלטפורמת זימון התורים רואות חשיבות עליונה בהנגשת האתר וטפסי הרישום והזימון לאנשים עם מוגבלויות, ופועלות על פי עקרונות שוויון, כבוד והכלה.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DDD0] shadow-sm flex flex-col gap-8">
            {/* Quick Keyboard Access Notice */}
            <div className="bg-[#085B7A]/10 border-2 border-[#085B7A]/30 rounded-2xl p-5 text-slate-800 text-sm leading-relaxed">
              <div className="font-black text-[#085B7A] text-base mb-2 flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                <span>שִׂים לֵב: בְּאֲתָר זֶה מֻפְעֶלֶת מַעֲרֶכֶת נְגִישׁוּת מִתְקַדֶּמֶת</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>• לְחַץ <strong>Control + F11</strong> לְהַתְאָמַת הָאֲתָר לְעִוְורִים הַמִּשְׁתַּמְּשִׁים בְּתוֹכְנַת קוֹרֵא־מָסָךְ.</li>
                <li>• לְחַץ <strong>Control + F10</strong> או <strong>Alt + A</strong> לִפְתִיחַת תַּפְרִיט נְגִישׁוּת.</li>
                <li>• לחץ <strong>Enter</strong> בראש הדף לקפיצה ישירה לתוכן המרכזי.</li>
              </ul>
            </div>

            {/* General Statement */}
            <section aria-labelledby="statement-intro">
              <h2 id="statement-intro" className="text-xl font-black text-[#1C1C1C] mb-3">
                מחויבותנו לנגישות
              </h2>
              <p className="text-[#3D3D3D] text-sm sm:text-base leading-relaxed">
                מערכת האתר וטפסי הרישום מותאמים להנחיות Web Content Accessibility Guidelines (WCAG) 2.0 ו-2.1 ברמה AA, כפי שפורסמו על ידי ארגון התקינה הבינלאומי W3C, ובהתאם לתקן הישראלי ת"י 5568 להנגשת אתרי אינטרנט.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* Actions Taken for Accessibility */}
            <section aria-labelledby="actions-taken">
              <h2 id="actions-taken" className="text-xl font-black text-[#1C1C1C] mb-4">
                פעולות והתאמות שבוצעו לשיפור הנגישות במערכת:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'אפשרות לשינוי גודל הגופן',
                    desc: 'הגדלת טקסט עד 150% ושליטה על ריווח מילים, גובה שורות וריווח אותיות.',
                  },
                  {
                    title: 'ניווט מקלדת מלא בין שדות הטופס',
                    desc: 'אמצעי ניווט פשוטים ונוחים, כולל מעבר בין כל שדות הטופס, הכפתורים והתורים באמצעות מקש Tab ו-Enter.',
                  },
                  {
                    title: 'כותרות סמנטיות ומבנה ברור',
                    desc: 'טקסטים כתובים בשפה ברורה ופשוטה, מאורגנים באמצעות היררכיית כותרות תקנית (H1, H2, H3).',
                  },
                  {
                    title: 'התאמת ניגודיות וצבעים',
                    desc: 'אפשרות לניגודיות כהה (שחור/צהוב), ניגודיות בהירה, היפוך צבעים, מונוכרום ובחירת גוון אישי.',
                  },
                  {
                    title: 'חלופות טקסטואליות (alt) לתמונות',
                    desc: 'מתן טקסט אלטרנטיבי ברור לכל האלמנטים הגרפיים והתמונות באתר.',
                  },
                  {
                    title: 'התאמה מלאה לדפדפנים ומכשירים',
                    desc: 'התאמה לצפייה, ניווט ומילוי טפסים בכל הדפדפנים העדכניים התומכים ב-JavaScript ובמכשירי מובייל.',
                  },
                  {
                    title: 'קישורים ברורים ומוסברים',
                    desc: 'קישורים ברורים הכוללים הסבר על יעד ההפניה והדגשה חזותית במידת הצורך.',
                  },
                  {
                    title: 'מנוע הקראה קולית חכם',
                    desc: 'הקראת תוכן האתר בקול טבעי כולל מצב קריאה רציף במעבר עכבר (Hover-to-read).',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0]">
                    <CheckCircle className="w-5 h-5 text-[#085B7A] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1C1C1C] text-sm">{item.title}</div>
                      <div className="text-xs text-[#6B6560] mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* Physical Barbershop Accessibility */}
            <section aria-labelledby="physical-a11y">
              <h2 id="physical-a11y" className="text-xl font-black text-[#1C1C1C] mb-4">
                הסדרי נגישות פיזיים בסניפי המספרה
              </h2>
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5DDD0] flex flex-col gap-3 text-sm text-[#3D3D3D]">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                  <span><strong>סניפי המספרה:</strong> סניף אריאל (מעונות/קמפוס) | סניף רחובות (הרצל 45)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                  <span><strong>כניסה נגישה:</strong> כניסת המספרה במפלס הרחוב ללא מדרגות או מעלון נגיש.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                  <span><strong>עמדת תספורת מונגשת:</strong> כסא מותאם ומרווח מספק לכיסא גלגלים.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                  <span><strong>חיות שירות:</strong> כניסת כלבי נחייה וחיות שירות מותרת ומבורכת.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                  <span><strong>חניית נכים:</strong> קיימות חניות נכים מסומנות ברחוב בסמוך לכניסה.</span>
                </div>
              </div>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* Accessibility Limitations / Disclaimer */}
            <section aria-labelledby="a11y-disclaimer">
              <h2 id="a11y-disclaimer" className="text-xl font-black text-[#1C1C1C] mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>סייגים לנגישות</span>
              </h2>
              <p className="text-[#3D3D3D] text-sm sm:text-base leading-relaxed mb-3">
                אנו מקפידים על בניית טפסים ודפים נגישים ברמת AA. עם זאת, ייתכן כי חלק מהתכנים המועלים על ידי צדדים שלישיים או משתמשים לא כללו טקסט חלופי לתמונות או הסברים לקישורים.
              </p>
              <p className="text-[#3D3D3D] text-sm sm:text-base leading-relaxed">
                בנוסף, רכיבים חיצוניים שאינם בשליטתנו המלאה (כגון מפות Google Maps מוטמעות או סרטוני YouTube) עלולים שלא להיות נגישים במלואם.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* Continuous Improvement & Contact */}
            <section aria-labelledby="coordinator-info">
              <h2 id="coordinator-info" className="text-xl font-black text-[#1C1C1C] mb-3">
                המשך שיפור ופרטי רכז הנגישות
              </h2>
              <p className="text-[#3D3D3D] text-sm leading-relaxed mb-4">
                אנו מחויבים להמשיך ולשפר את הנגישות במערכת, במטרה לאפשר שימוש שוויוני ונוח לכלל הציבור, ובכלל זה אנשים עם מוגבלויות.
                נשמח לסייע, להשיב על שאלות ולקבל הערות ובקשות בנושא נגישות:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0]">
                  <div className="w-10 h-10 rounded-full bg-[#085B7A]/15 flex items-center justify-center text-[#085B7A] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#6B6560]">טלפון / WhatsApp</div>
                    <a href={`tel:${SHOP_INFO.phone}`} className="font-bold text-[#1C1C1C] text-sm hover:text-[#085B7A]" dir="ltr">
                      {SHOP_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0]">
                  <div className="w-10 h-10 rounded-full bg-[#085B7A]/15 flex items-center justify-center text-[#085B7A] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#6B6560]">דואר אלקטרוני לפניות נגישות</div>
                    <a href="mailto:support@thecut.co.il" className="font-bold text-[#1C1C1C] text-sm hover:text-[#085B7A]">
                      support@thecut.co.il
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-[#9E9891]">
                <Clock className="w-4 h-4" />
                <span>תאריך עדכון אחרון: <strong>{lastUpdated}</strong></span>
              </div>
            </section>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className="inline-block bg-[#085B7A] text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-[#064961] transition-colors shadow-md"
              >
                ← חזרה לעמוד הבית
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
