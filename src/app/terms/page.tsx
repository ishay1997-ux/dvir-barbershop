import Link from 'next/link';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
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
              <FileText className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-bold tracking-wide">The Cut · מסמך משפטי מחייב</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">תקנון ותנאי שימוש</h1>
            <p className="text-[#9E9891] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              תנאי הרישיון, השימוש וההתקשרות המלאים במערכת ובפלטפורמת זימון התורים
            </p>
            <div className="mt-4 inline-block text-xs text-[#C9A84C]/90 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              גרסה 2.1 · עודכן לאחרונה: 30 באוגוסט 2026
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E5DDD0] shadow-sm flex flex-col gap-8 text-[#3D3833]">
            {/* Welcome Box */}
            <div className="bg-[#FAF7F2] border-r-4 border-r-[#C9A84C] border border-[#E5DDD0] rounded-2xl p-6 text-sm sm:text-base leading-relaxed text-[#2C2926]">
              <div className="font-black text-[#1C1C1C] text-base mb-1.5">משתמש/ת יקר/ה, שלום רב!</div>
              <p>
                ברוך הבא ל-<strong>The Cut</strong> – זימון תורים בקלות. אנו מודים לך על ביקורך ו/או תחילת שימושך באפליקציית זימון התורים (להלן: &quot;המערכת&quot;, &quot;מערכת הניהול&quot;, &quot;התוכנה&quot;, &quot;המוצר&quot;, &quot;האתר&quot; ו/או &quot;האפליקציה&quot;).
              </p>
            </div>

            {/* 1 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">1. פתח דבר</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">1.1. מסמך זה מנוסח בלשון זכר מטעמי נוחות אך מתייחס כמובן לנשים ולגברים כאחד.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">1.2. תנאי השימוש שלהלן מפרטים את תנאי הרישיון לשימוש במערכת, והם מהווים הסכם משפטי מחייב בינך לבין החברה המפעילה (להלן: &quot;החברה&quot;).</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">1.3. תנאי השימוש חלים על השימוש במערכת ובתכנים הכלולים בה באמצעות מחשב, טלפון סלולארי או כל מכשיר תקשורת אחר. תנאים אלה חלים גם על השימוש באתר, בין באמצעות רשת האינטרנט ובין באמצעות כל רשת או אמצעי תקשורת אחרים.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">1.4. השימוש במערכת ובכלל זה בתכנים המוצגים בה כפוף לתנאי השימוש. אנא קרא תנאים אלה בעיון ובקפידה, שכן הכניסה למערכת והשימוש בהם מעידים על הסכמתך ואישורך לתנאים אלו. אם אינך מסכים לתנאים, כולם או חלקם, אנא הימנע מעשיית שימוש במערכת, מגישה אליה או מהתקנתה.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">1.5. אנו עשויים לשנות ו/או לערוך ו/או לעדכן את תקנון השימוש מעת לעת. אנו נעדכן אותך אם יתבצע שינוי מהותי.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 2 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">2. על המערכת</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">2.1. המערכת היא מערכת לזימון תורים לעסקים המופעלת על ידי החברה. מטרת המערכת היא לשמש כלי יעיל ונוח לזימון תורים עבור בתי עסק ולקוחותיהם.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">2.2. הרישיון המוענק לך בהצטרפות לשירותינו הינו רישיון לשימוש במערכת בלבד ואין בו כל רישיון, הרשאה או מתן זכות אחרת של החברה.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 3 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">3. תהליך הרישום למערכת</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">3.1. השימוש בחלק משירותי המערכת טעון הרשמה ומסירת פרטים נדרשים.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">3.2. לבעלי עסקים השימוש בשירותי המערכת עשוי להיות כרוך בתשלום דמי מנוי בהתאם למסלול שנבחר.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">3.3. בעת הרישום ייתכן ותידרש למסור: שם פרטי ומשפחה, מספר טלפון נייד, כתובת דוא&quot;ל ופרטי תשלום במידת הצורך.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">3.4. הנתונים שתמסור יישמרו במאגר המידע המאובטח של החברה בהתאם לחוק הגנת הפרטיות.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">3.5. מסירת פרטים שגויים במתכוון מהווה עבירה על פי החוק.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">3.6. החברה רשאית לבטל רישום משתמש במקרה של מסירת פרטים כוזבים, הפרת תנאי שימוש או פעילות הפוגעת במערכת.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 4 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">4. שימוש במערכת</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">4.1. תוכן המערכת, ממשקיה, עיצוביה והתראות ה-SMS וה-Push נועדו לשירותך האישי ככלי עזר לניהול ולזימון תורים.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">4.2. כל פעולה שנעשית במערכת היא באחריות המשתמש בלבד. ידוע למשתמש שככלי עזר מקוון, ייתכנו שיבושים זמניים הנובעים מבעיות תקשורת סלולרית או אינטרנטית.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">4.3. החברה אינה מתחייבת לחסינות מוחלטת מתקלות, והמשתמש מנוע מלטעון להסתמכות בלעדית על המידע במערכת.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 5 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">5. תמיכה טכנית</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">5.1. החברה מעניקה שירות תמיכה טכנית למוצר לצורך מענה על שאלות וטיפול בתקלות שמקורן במוצר עצמו.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">5.2. התמיכה אינה חלה על בעיות חומרה, רשת או מכשיר של המשתמש שאינן תלויות במערכת.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 6 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">6. אבטחת מידע ותקלות</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">6.1. החברה נעזרת באמצעי אבטחה טכנולוגיים ופרוטוקולי הצפנה מקובלים (SSL/TLS) להגנה על המידע והתקשורת עם השרתים.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">6.2. המידע נשמר בשרתים מוגנים. החברה אינה אחראית לנזקים עקב פריצה בלתי מורשית שאינה בשליטתה הסבירה, ומבצעת גיבויים שוטפים.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 7 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">7. אחריות אחסנת קבצים ומדיה</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">7.1. העלאת קבצים או תמונות למערכת היא באחריות המשתמש בלבד. המשתמש מתחייב לשמור גיבוי נפרד לנתוניו.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 8 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">8. הגבלת אחריות</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">8.1. השימוש במערכת הינו באחריות המלאה של המשתמש. המערכת מהווה כלי עזר לזימון תורים וניהול עסקי.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">8.2. החברה לא תישא באחריות לכל נזק ישיר או עקיף, אובדן רווחים או הפסד שייגרם כתוצאה משימוש או אי-יכולת שימוש במערכת.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 9 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">9. אחריות המשתמש</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">9.1. המשתמש אחראי לשמור על סודיות פרטי הכניסה שלו ולא להעבירם לצד ג&apos;.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 10 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">10. שימוש אסור במערכת</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">10.1. חל איסור מוחלט לבצע סריקה אוטומטית (Crawling/Scraping), הפצת וירוסים, פגיעה באבטחה או שימוש בלתי חוקי במערכת.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 11 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">11. חסימת משתמשים וסיום התקשרות</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">11.1. החברה רשאית להשעות או לסגור חשבון משתמש הפועל בניגוד לחוק או לתקנון זה.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 12 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">12. שליחת מסרונים ועמידה בחוק התקשורת (&quot;חוק הספאם&quot;)</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">12.1. המשתמש מתחייב לשלוח הודעות תזכורת ועדכונים רק לנמענים שנתנו הסכמתם בהתאם לסעיף 30א לחוק התקשורת.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 13 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">13. סודיות ודיווח לרשויות</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">13.1. המידע יישמר בסודיות בהתאם לדין, והחברה רשאית לדווח לרשויות האכיפה במקרה של חשד לעבירה פלילית.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 14 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">14. קניין רוחני</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">14.1. כל זכויות הקניין הרוחני באתר ובמערכת, לרבות עיצוב, טקסטים, לוגו, גרפיקה, קוד מקור וממשק המשתמש, שייכים לחברה ומוגנים בחוקי זכויות יוצרים ובדיני הקניין הרוחני.</p>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">14.2. אין להעתיק, לשכפל, להפיץ, לפרסם, להציג בפומבי או לעשות שימוש מסחרי בכל תוכן מהאתר או מהמערכת ללא אישור בכתב ומראש מהחברה.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 15 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">15. מדיניות פרטיות</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                מדיניות הפרטיות המלאה מפורטת בדף{' '}
                <Link href="/privacy" className="text-[#8C6B1C] hover:text-[#5A4512] underline font-bold transition-colors">
                  מדיניות פרטיות ואבטחת מידע
                </Link>
                {' '}ומהווה חלק בלתי נפרד מתנאי שימוש אלו.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 16 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">16. הצהרת נגישות</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                לעיון בהצהרת הנגישות המלאה של המערכת, היכנס לקישור הבא:{' '}
                <Link href="/accessibility" className="text-[#8C6B1C] hover:text-[#5A4512] underline font-bold transition-colors">
                  הצהרת נגישות תקנית (WCAG 2.1 AA)
                </Link>
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 17 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">17. סמכות שיפוט והדין החל</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">17.1. על תנאי שימוש אלו יחולו אך ורק דיני מדינת ישראל, וסמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.</p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* 18 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1C1C1C]">18. יצירת קשר</h2>
              <p className="text-[#4A4540] text-sm sm:text-base leading-relaxed">
                לכל שאלה או בירור בנוגע לתנאי שימוש אלו, ניתן לפנות אלינו בכתובת דוא&quot;ל:{' '}
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
