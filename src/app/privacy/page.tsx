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
      <main id="main-content" className="min-h-screen bg-[#FAF7F2] text-[#2C2926] pt-24 pb-20" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6B1C] hover:text-[#5A4512] transition-colors group"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span>חזרה לעמוד הבית</span>
            </Link>
          </div>

          {/* Header Banner */}
          <div className="bg-[#1C1C1C] rounded-3xl p-8 sm:p-12 text-center text-white mb-10 shadow-lg relative overflow-hidden border border-[#C9A84C]/25">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-bold tracking-wide">תאימות מלאה לחוק הגנת הפרטיות ו-GDPR</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">מדיניות פרטיות ואבטחת מידע</h1>
            <p className="text-[#9E9891] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              הנהלים והעקרונות שלנו להגנה על המידע האישי של משתמשי הקצה ובעלי העסקים
            </p>
            <div className="mt-4 inline-block text-xs text-[#C9A84C]/90 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              גרסה 2.1 · עודכן לאחרונה: 30 באוגוסט 2026
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E5DDD0] shadow-sm flex flex-col gap-8 text-[#3D3833]">
            {/* Welcome Box */}
            <div className="bg-[#FAF7F2] border-r-4 border-r-[#C9A84C] border border-[#E5DDD0] rounded-2xl p-6 text-sm sm:text-base leading-relaxed text-[#2C2926]">
              <div className="font-black text-[#1C1C1C] text-base mb-1.5">הגנה על פרטיותך בראש סדר העדיפויות</div>
              <p>
                מדיניות פרטיות זו מהווה חלק בלתי נפרד מתקנון המערכת ותנאי השימוש בה. אנו מכבדים את פרטיותך ומחויבים להגן על הנתונים האישיים שלך באמצעי האבטחה המתקדמים ביותר.
              </p>
            </div>

            {/* 1 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">1. הקדמה ופתח דבר</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">1.1. מסמך זה מנוסח בלשון זכר מטעמי נוחות אך מתייחס כמובן לנשים ולגברים כאחד.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">1.2. השימוש במידע אישי שנאסף באמצעות השירותים מוגבל למטרת מתן השירות שאותו ביקשו לקוחותינו.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">1.3. מדיניות זו מתארת את הנהלים שלנו בקשר למידע שאנו אוספים באמצעות הפלטפורמה ובהודעות דואר אלקטרוני ו-SMS.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 2 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">2. סיווג פרטיות ומשתמשים</h2>
              <div className="space-y-2 text-[#4A4540] text-sm sm:text-base leading-relaxed">
                <p>• <strong>מבקרים:</strong> אנשים וגופים שניגשים לאתר ומקיימים איתו אינטראקציה.</p>
                <p>• <strong>לקוחות ובעלי עסקים:</strong> מנהלי מספרות, ספרים וצוותים המורשים לגשת למערכת הניהול.</p>
                <p>• <strong>משתמשי קצה:</strong> לקוחות המזמינים תורים לתספורות ושירותים באמצעות המערכת.</p>
              </div>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 3 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">3. איסוף נתונים ותאימות ל-GDPR</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">3.1. מערכת זימון התורים ולקוחותיה אוספים נתונים אישיים על אנשים שנרשמים לתורים. בעלי העסקים משמשים כבקרי נתונים (Data Controllers) והמערכת כמעבדת נתונים (Data Processor).</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">3.2. המערכת מיישמת אמצעים לשמירה על דיוק הנתונים, אבטחתם ומחיקתם לפי דרישה חוקית.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 4 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">4. סוגי המידע הנאספים</h2>
              <div className="space-y-2 text-[#4A4540] text-sm sm:text-base leading-relaxed">
                <p>• <strong>מידע אישי מזהה:</strong> שם מלא, מספר טלפון נייד, כתובת דוא&quot;ל, סניף מועדף, היסטוריית תורים וסוגי שירותים מבוקשים.</p>
                <p>• <strong>נתונים טכניים:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה, זמני פעילות ושפת ממשק מועדפת.</p>
                <p>• <strong>נתוני תשלום:</strong> פרטי תשלום במידה ונמסרו מעובדים באמצעות ספקי סליקה מאובטחים העומדים בתקן המחמיר PCI-DSS.</p>
              </div>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 5 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">5. מטרות השימוש במידע</h2>
              <div className="space-y-2 text-[#4A4540] text-sm sm:text-base leading-relaxed">
                <p>• תיאום, אישור, עדכון וביטול תורים לתספורות וטיפולים.</p>
                <p>• משלוח תזכורות אוטומטיות ב-SMS או WhatsApp למועד התור.</p>
                <p>• שיפור חוויית השימוש, אבטחת האתר ומניעת פעילות הונאה.</p>
              </div>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 6 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">6. שיתוף מידע עם צדדים שלישיים</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                המידע מועבר אך ורק לספקי שירות חיוניים הנדרשים לתפעול המערכת (כגון שרתי ענן מאובטחים, ספקי שליחת הודעות SMS וספקי סליקה מורשים), ותחת התחייבות סודיות מלאה.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 7 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">7. עוגיות (Cookies) וטכנולוגיות מעקב</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                המערכת עושה שימוש בעוגיות לצורך זיהוי משתמשים מחוברים, שמירת העדפות נגישות (כגון שפה, ניגודיות וגודל גופן) ושיפור ביצועי האתר.
              </p>
              <div className="overflow-x-auto mt-3 border border-[#E5DDD0] rounded-2xl shadow-xs">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-[#1C1C1C] border-b border-[#E5DDD0]">
                      <th className="text-right p-3.5 font-bold">סוג העוגייה</th>
                      <th className="text-right p-3.5 font-bold">מטרה ושימוש</th>
                      <th className="text-right p-3.5 font-bold">משך תוקף</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1] text-[#3D3833]">
                    <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#1C1C1C]">עוגיות הכרחיות</td>
                      <td className="p-3.5">זיהוי משתמש, אימות, הפעלת תכונות חיוניות</td>
                      <td className="p-3.5 text-[#6B6560]">סשן (Session)</td>
                    </tr>
                    <tr className="bg-[#FAF7F2]/30 hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-3.5 font-bold text-[#1C1C1C]">עוגיות נגישות</td>
                      <td className="p-3.5">שמירת העדפות נגישות (שפה, ניגודיות, גופן, סמן)</td>
                      <td className="p-3.5 text-[#6B6560]">30 יום</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#1C1C1C]">עוגיות ביצועים</td>
                      <td className="p-3.5">שיפור ביצועים ואנליטיקה כללית</td>
                      <td className="p-3.5 text-[#6B6560]">12 חודשים</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 8 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">8. אבטחת מידע</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                אנו מפעילים מנגנוני אבטחה טכנולוגיים וארגוניים מתקדמים, לרבות הצפנת SSL/TLS, להגנה על המידע האישי שלך מפני גישה בלתי מורשית.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 9 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">9. שמירת מידע ומחיקתו</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">9.1. מידע אישי נשמר כל עוד החשבון פעיל או כנדרש למתן השירות.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">9.2. לאחר מחיקת חשבון, המידע יימחק תוך 90 יום, למעט מידע שחובה לשמור לפי דין (לדוגמה: רשומות חשבונאיות – עד 7 שנים בהתאם לפקודת מס הכנסה).</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 10 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">10. העברת מידע לחו&quot;ל</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                10.1. חלק מהמידע עשוי להישמר בשרתים מחוץ לישראל (כגון שירותי ענן בינלאומיים). במקרים אלו, אנו מוודאים שמדינת היעד מספקת רמת הגנה מספקת או שקיימות ערבויות חוזיות מתאימות בהתאם לדרישות חוק הגנת הפרטיות.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 11 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">11. זכויות המשתמש (עיון, תיקון ומחיקה)</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                לכל משתמש עומדת הזכות לעיין במידע שנשמר אודותיו, לבקש את תיקונו או לדרוש את מחיקתו ממאגרי המידע, בכפוף לחובות שמירת רשומות על פי דין.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 12 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">12. ילדים מתחת לגיל 14</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                השירותים אינם מיועדים לרישום עצמאי של ילדים מתחת לגיל 14 ללא אישור והשגחת הורה או אפוטרופוס חוקי.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 13 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">13. שינויים במדיניות</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">13.1. אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר ו/או ישלחו ללקוחות בדוא&quot;ל.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">13.2. המשך השימוש במערכת לאחר עדכון המדיניות מהווה הסכמה לתנאים המעודכנים.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 14 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">14. יצירת קשר בנושאי פרטיות</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                בכל שאלה, בקשת עיון או מחיקת מידע, ניתן לפנות לנציג הגנת המידע בכתובת דוא&quot;ל:{' '}
                <a href="mailto:support@thecut.co.il" className="text-[#8C6B1C] hover:text-[#5A4512] underline font-bold transition-colors">
                  support@thecut.co.il
                </a>.
              </p>
            </section>

            {/* Back Button */}
            <div className="pt-6 border-t border-[#F0EBE1] text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-[#1C1C1C] text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-[#C9A84C] hover:text-[#1C1C1C] transition-all shadow-md active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזרה לעמוד הבית</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
