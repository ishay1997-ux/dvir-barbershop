import Link from 'next/link';
import { ArrowRight, ShieldCheck, Lock, Eye, Database } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'מדיניות פרטיות | The Cut זימון תורים',
  description: 'מדיניות הפרטיות, איסוף הנתונים ואבטחת המידע במערכת.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#141414] text-white py-12 sm:py-16" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A84C] hover:underline"
            >
              <ArrowRight className="w-4 h-4" /> חזרה לעמוד הבית
            </Link>
          </div>

          {/* Header */}
          <div className="bg-[#1C1C1C] border border-[#C9A84C]/30 rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">מדיניות פרטיות ואבטחת מידע</h1>
                <p className="text-xs sm:text-sm text-[#9E9891]">משתמשי קצה ובעלי עסקים · תאימות מלאה ל-GDPR והחוק הישראלי</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              גרסה 2.1 · עודכן לאחרונה: 30 באוגוסט 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-2xl p-5 text-sm text-zinc-200">
              מדיניות פרטיות זו מהווה חלק בלתי נפרד מתקנון המערכת ותנאי השימוש בה. אנו מכבדים את פרטיותך ומחויבים להגן עליה.
            </div>

            {/* 1 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">1. הקדמה ופתח דבר</h2>
              <p>1.1. מסמך זה מנוסח בלשון זכר מטעמי נוחות אך מתייחס כמובן לנשים ולגברים כאחד.</p>
              <p>1.2. השימוש במידע אישי שנאסף באמצעות השירותים מוגבל למטרת מתן השירות שאותו ביקשו לקוחותינו.</p>
              <p>1.3. מדיניות זו מתארת את הנהלים שלנו בקשר למידע שאנו אוספים באמצעות הפלטפורמה ובהודעות דואר אלקטרוני ו-SMS.</p>
            </section>

            {/* 2 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">2. סיווג פרטיות ומשתמשים</h2>
              <p>• <strong>מבקרים:</strong> אנשים וגופים שניגשים לאתר ומקיימים איתו אינטראקציה.</p>
              <p>• <strong>לקוחות ובעלי עסקים:</strong> מנהלי מספרות, ספרים וצוותים המורשים לגשת למערכת הניהול.</p>
              <p>• <strong>משתמשי קצה:</strong> לקוחות המזמינים תורים לתספורות ושירותים באמצעות המערכת.</p>
            </section>

            {/* 3 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">3. איסוף נתונים ותאימות ל-GDPR</h2>
              <p>3.1. מערכת זימון התורים ולקוחותיה אוספים נתונים אישיים על אנשים שנרשמים לתורים. בעלי העסקים משמשים כבקרי נתונים (Data Controllers) והמערכת כמעבדת נתונים (Data Processor).</p>
              <p>3.2. המערכת מיישמת אמצעים לשמירה על דיוק הנתונים, אבטחתם ומחיקתם לפי דרישה חוקית.</p>
            </section>

            {/* 4 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">4. סוגי המידע הנאספים</h2>
              <p>• <strong>מידע אישי מזהה:</strong> שם מלא, מספר טלפון נייד, כתובת דוא&quot;ל, סניף מועדף, היסטוריית תורים וסוגי שירותים מבוקשים.</p>
              <p>• <strong>נתונים טכניים:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה, זמני פעילות ושפת ממשק מועדפת.</p>
              <p>• <strong>נתוני תשלום:</strong> פרטי תשלום במידה ונמסרו מעובדים באמצעות ספקי סליקה מאובטחים העומדים בתקן המחמיר PCI-DSS.</p>
            </section>

            {/* 5 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">5. מטרות השימוש במידע</h2>
              <p>• תיאום, אישור, עדכון וביטול תורים לתספורות וטיפולים.</p>
              <p>• משלוח תזכורות אוטומטיות ב-SMS או WhatsApp למועד התור.</p>
              <p>• שיפור חוויית השימוש, אבטחת האתר ומניעת פעילות הונאה.</p>
            </section>

            {/* 6 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">6. שיתוף מידע עם צדדים שלישיים</h2>
              <p>המידע מועבר אך ורק לספקי שירות חיוניים הנדרשים לתפעול המערכת (כגון שרתי ענן מאובטחים, ספקי שליחת הודעות SMS וספקי סליקה מורשים), ותחת התחייבות סודיות מלאה.</p>
            </section>

            {/* 7 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">7. עוגיות (Cookies) וטכנולוגיות מעקב</h2>
              <p>המערכת עושה שימוש בעוגיות לצורך זיהוי משתמשים מחוברים, שמירת העדפות נגישות (כגון שפה, ניגודיות וגודל גופן) ושיפור ביצועי האתר.</p>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs sm:text-sm border border-white/10 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-[#C9A84C]/15 text-[#DFCA85]">
                      <th className="text-right p-3 font-bold border-b border-white/10">סוג</th>
                      <th className="text-right p-3 font-bold border-b border-white/10">מטרה</th>
                      <th className="text-right p-3 font-bold border-b border-white/10">משך</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    <tr className="border-b border-white/5">
                      <td className="p-3 font-medium text-white">עוגיות הכרחיות</td>
                      <td className="p-3">זיהוי משתמש, אימות, הפעלת תכונות חיוניות</td>
                      <td className="p-3">סשן</td>
                    </tr>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <td className="p-3 font-medium text-white">עוגיות נגישות</td>
                      <td className="p-3">שמירת העדפות נגישות (שפה, ניגודיות, גופן, סמן)</td>
                      <td className="p-3">30 יום</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">עוגיות ביצועים</td>
                      <td className="p-3">שיפור ביצועים ואנליטיקה כללית</td>
                      <td className="p-3">12 חודשים</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 8 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">8. אבטחת מידע</h2>
              <p>אנו מפעילים מנגנוני אבטחה טכנולוגיים וארגוניים מתקדמים, לרבות הצפנת SSL/TLS, להגנה על המידע האישי שלך מפני גישה בלתי מורשית.</p>
            </section>

            {/* 9 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">9. שמירת מידע ומחיקתו</h2>
              <p>9.1. מידע אישי נשמר כל עוד החשבון פעיל או כנדרש למתן השירות.</p>
              <p>9.2. לאחר מחיקת חשבון, המידע יימחק תוך 90 יום, למעט מידע שחובה לשמור לפי דין (לדוגמה: רשומות חשבונאיות – עד 7 שנים בהתאם לפקודת מס הכנסה).</p>
            </section>

            {/* 10 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">10. העברת מידע לחו&quot;ל</h2>
              <p>10.1. חלק מהמידע עשוי להישמר בשרתים מחוץ לישראל (כגון שירותי ענן בינלאומיים). במקרים אלו, אנו מוודאים שמדינת היעד מספקת רמת הגנה מספקת או שקיימות ערבויות חוזיות מתאימות בהתאם לדרישות חוק הגנת הפרטיות.</p>
            </section>

            {/* 11 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">11. זכויות המשתמש (עיון, תיקון ומחיקה)</h2>
              <p>לכל משתמש עומדת הזכות לעיין במידע שנשמר אודותיו, לבקש את תיקונו או לדרוש את מחיקתו ממאגרי המידע, בכפוף לחובות שמירת רשומות על פי דין.</p>
            </section>

            {/* 12 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">12. ילדים מתחת לגיל 14</h2>
              <p>השירותים אינם מיועדים לרישום עצמאי של ילדים מתחת לגיל 14 ללא אישור והשגחת הורה או אפוטרופוס חוקי.</p>
            </section>

            {/* 13 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">13. שינויים במדיניות</h2>
              <p>13.1. אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר ו/או ישלחו ללקוחות בדוא&quot;ל.</p>
              <p>13.2. המשך השימוש במערכת לאחר עדכון המדיניות מהווה הסכמה לתנאים המעודכנים.</p>
            </section>

            {/* 14 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">14. יצירת קשר בנושאי פרטיות</h2>
              <p>בכל שאלה, בקשת עיון או מחיקת מידע, ניתן לפנות לנציג הגנת המידע בכתובת דוא&quot;ל: <a href="mailto:support@thecut.co.il" className="text-[#DFCA85] underline">support@thecut.co.il</a>.</p>
            </section>

            {/* Back Button */}
            <div className="pt-6 border-t border-white/10 text-center">
              <Link
                href="/"
                className="inline-block bg-[#C9A84C] text-[#1C1C1C] font-bold text-sm px-8 py-3.5 rounded-full hover:bg-[#DFCA85] transition-colors shadow-lg"
              >
                חזרה לעמוד הבית
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
