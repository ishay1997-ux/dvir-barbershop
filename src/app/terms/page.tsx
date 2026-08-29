import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'תקנון ותנאי שימוש | The Cut זימון תורים',
  description: 'תקנון ותנאי השימוש המלאים במערכת זימון התורים והאפליקציה.',
};

export default function TermsPage() {
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
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">תקנון ותנאי שימוש</h1>
                <p className="text-xs sm:text-sm text-[#9E9891]">The Cut · מערכת לזימון תורים</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              גרסה 2.1 · עודכן לאחרונה: 30 באוגוסט 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-2xl p-5 text-sm text-zinc-200">
              משתמש/ת יקר/ה!<br />
              ברוך הבא ל-<strong>The Cut</strong> – זימון תורים בקלות. אנו מודים לך על ביקורך ו/או תחילת שימושך באפליקציית זימון התורים (להלן: &quot;המערכת&quot;, &quot;מערכת הניהול&quot;, &quot;התוכנה&quot;, &quot;המוצר&quot;, &quot;האתר&quot; ו/או &quot;האפליקציה&quot;).
            </div>

            {/* 1 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">1. פתח דבר</h2>
              <p>1.1. מסמך זה מנוסח בלשון זכר מטעמי נוחות אך מתייחס כמובן לנשים ולגברים כאחד.</p>
              <p>1.2. תנאי השימוש שלהלן מפרטים את תנאי הרישיון לשימוש במערכת, והם מהווים הסכם משפטי מחייב בינך לבין החברה המפעילה (להלן: &quot;החברה&quot;).</p>
              <p>1.3. תנאי השימוש חלים על השימוש במערכת ובתכנים הכלולים בה באמצעות מחשב, טלפון סלולארי או כל מכשיר תקשורת אחר. תנאים אלה חלים גם על השימוש באתר, בין באמצעות רשת האינטרנט ובין באמצעות כל רשת או אמצעי תקשורת אחרים.</p>
              <p>1.4. השימוש במערכת ובכלל זה בתכנים המוצגים בה כפוף לתנאי השימוש. אנא קרא תנאים אלה בעיון ובקפידה, שכן הכניסה למערכת והשימוש בהם מעידים על הסכמתך ואישורך לתנאים אלו. אם אינך מסכים לתנאים, כולם או חלקם, אנא הימנע מעשיית שימוש במערכת, מגישה אליה או מהתקנתה.</p>
              <p>1.5. אנו עשויים לשנות ו/או לערוך ו/או לעדכן את תקנון השימוש מעת לעת. אנו נעדכן אותך אם יתבצע שינוי מהותי.</p>
            </section>

            {/* 2 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">2. על המערכת</h2>
              <p>2.1. המערכת היא מערכת לזימון תורים לעסקים המופעלת על ידי החברה. מטרת המערכת היא לשמש כלי יעיל ונוח לזימון תורים עבור בתי עסק ולקוחותיהם.</p>
              <p>2.2. הרישיון המוענק לך בהצטרפות לשירותינו הינו רישיון לשימוש במערכת בלבד ואין בו כל רישיון, הרשאה או מתן זכות אחרת של החברה.</p>
            </section>

            {/* 3 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">3. תהליך הרישום למערכת</h2>
              <p>3.1. השימוש בחלק משירותי המערכת טעון הרשמה ומסירת פרטים נדרשים.</p>
              <p>3.2. לבעלי עסקים השימוש בשירותי המערכת עשוי להיות כרוך בתשלום דמי מנוי בהתאם למסלול שנבחר.</p>
              <p>3.3. בעת הרישום ייתכן ותידרש למסור: שם פרטי ומשפחה, מספר טלפון נייד, כתובת דוא&quot;ל ופרטי תשלום במידת הצורך.</p>
              <p>3.4. הנתונים שתמסור יישמרו במאגר המידע המאובטח של החברה בהתאם לחוק הגנת הפרטיות.</p>
              <p>3.5. מסירת פרטים שגויים במתכוון מהווה עבירה על פי החוק.</p>
              <p>3.6. החברה רשאית לבטל רישום משתמש במקרה של מסירת פרטים כוזבים, הפרת תנאי שימוש או פעילות הפוגעת במערכת.</p>
            </section>

            {/* 4 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">4. שימוש במערכת</h2>
              <p>4.1. תוכן המערכת, ממשקיה, עיצוביה והתראות ה-SMS וה-Push נועדו לשירותך האישי ככלי עזר לניהול ולזימון תורים.</p>
              <p>4.2. כל פעולה שנעשית במערכת היא באחריות המשתמש בלבד. ידוע למשתמש שככלי עזר מקוון, ייתכנו שיבושים זמניים הנובעים מבעיות תקשורת סלולרית או אינטרנטית.</p>
              <p>4.3. החברה אינה מתחייבת לחסינות מוחלטת מתקלות, והמשתמש מנוע מלטעון להסתמכות בלעדית על המידע במערכת.</p>
            </section>

            {/* 5 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">5. תמיכה טכנית</h2>
              <p>5.1. החברה מעניקה שירות תמיכה טכנית למוצר לצורך מענה על שאלות וטיפול בתקלות שמקורן במוצר עצמו.</p>
              <p>5.2. התמיכה אינה חלה על בעיות חומרה, רשת או מכשיר של המשתמש שאינן תלויות במערכת.</p>
            </section>

            {/* 6 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">6. אבטחת מידע ותקלות</h2>
              <p>6.1. החברה נעזרת באמצעי אבטחה טכנולוגיים ופרוטוקולי הצפנה מקובלים (SSL/TLS) להגנה על המידע והתקשורת עם השרתים.</p>
              <p>6.2. המידע נשמר בשרתים מוגנים. החברה אינה אחראית לנזקים עקב פריצה בלתי מורשית שאינה בשליטתה הסבירה, ומבצעת גיבויים שוטפים.</p>
            </section>

            {/* 7 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">7. אחריות אחסנת קבצים ומדיה</h2>
              <p>7.1. העלאת קבצים או תמונות למערכת היא באחריות המשתמש בלבד. המשתמש מתחייב לשמור גיבוי נפרד לנתוניו.</p>
            </section>

            {/* 8 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">8. הגבלת אחריות</h2>
              <p>8.1. השימוש במערכת הינו באחריות המלאה של המשתמש. המערכת מהווה כלי עזר לזימון תורים וניהול עסקי.</p>
              <p>8.2. החברה לא תישא באחריות לכל נזק ישיר או עקיף, אובדן רווחים או הפסד שייגרם כתוצאה משימוש או אי-יכולת שימוש במערכת.</p>
            </section>

            {/* 9 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">9. אחריות המשתמש</h2>
              <p>9.1. המשתמש אחראי לשמור על סודיות פרטי הכניסה שלו ולא להעבירם לצד ג&apos;.</p>
            </section>

            {/* 10 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">10. שימוש אסור במערכת</h2>
              <p>10.1. חל איסור מוחלט לבצע סריקה אוטומטית (Crawling/Scraping), הפצת וירוסים, פגיעה באבטחה או שימוש בלתי חוקי במערכת.</p>
            </section>

            {/* 11 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">11. חסימת משתמשים וסיום התקשרות</h2>
              <p>11.1. החברה רשאית להשעות או לסגור חשבון משתמש הפועל בניגוד לחוק או לתקנון זה.</p>
            </section>

            {/* 12 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">12. שליחת מסרונים ועמידה בחוק התקשורת (&quot;חוק הספאם&quot;)</h2>
              <p>12.1. המשתמש מתחייב לשלוח הודעות תזכורת ועדכונים רק לנמענים שנתנו הסכמתם בהתאם לסעיף 30א לחוק התקשורת.</p>
            </section>

            {/* 13 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">13. סודיות ודיווח לרשויות</h2>
              <p>13.1. המידע יישמר בסודיות בהתאם לדין, והחברה רשאית לדווח לרשויות האכיפה במקרה של חשד לעבירה פלילית.</p>
            </section>

            {/* 14 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">14. קניין רוחני</h2>
              <p>14.1. כל זכויות הקניין הרוחני באתר ובמערכת, לרבות עיצוב, טקסטים, לוגו, גרפיקה, קוד מקור וממשק המשתמש, שייכים לחברה ומוגנים בחוקי זכויות יוצרים ובדיני הקניין הרוחני.</p>
              <p>14.2. אין להעתיק, לשכפל, להפיץ, לפרסם, להציג בפומבי או לעשות שימוש מסחרי בכל תוכן מהאתר או מהמערכת ללא אישור בכתב ומראש מהחברה.</p>
            </section>

            {/* 15 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">15. מדיניות פרטיות</h2>
              <p>
                מדיניות הפרטיות המלאה מפורטת בדף{' '}
                <Link href="/privacy" className="text-[#DFCA85] underline font-bold">
                  מדיניות פרטיות ואבטחת מידע
                </Link>
                {' '}ומהווה חלק בלתי נפרד מתנאי שימוש אלו.
              </p>
            </section>

            {/* 16 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">16. הצהרת נגישות</h2>
              <p>
                לעיון בהצהרת הנגישות המלאה של המערכת, היכנס לקישור הבא:{' '}
                <Link href="/accessibility" className="text-[#DFCA85] underline font-bold">
                  הצהרת נגישות תקנית (WCAG 2.1 AA)
                </Link>
              </p>
            </section>

            {/* 17 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">17. סמכות שיפוט והדין החל</h2>
              <p>17.1. על תנאי שימוש אלו יחולו אך ורק דיני מדינת ישראל, וסמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.</p>
            </section>

            {/* 18 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">18. יצירת קשר</h2>
              <p>לכל שאלה או בירור בנוגע לתנאי שימוש אלו, ניתן לפנות אלינו בכתובת דוא&quot;ל: <a href="mailto:support@thecut.co.il" className="text-[#DFCA85] underline">support@thecut.co.il</a>.</p>
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
