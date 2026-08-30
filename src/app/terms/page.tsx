import Link from 'next/link';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { LegalNavbar } from '@/components/marketing/LegalNavbar';
import { MarketingFooter } from '@/components/marketing/sections/MarketingFooter';

export const metadata = {
  title: 'תקנון ותנאי שימוש | CutWeb OS - פלטפורמת ניהול יומנים ואתרי עסקים',
  description: 'תקנון ותנאי השימוש המלאים בפלטפורמת CutWeb, במערכת ניהול היומנים ובאתרי הלקוחות.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900" dir="rtl">
      <LegalNavbar />

      <main id="main-content" className="flex-1 py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Breadcrumbs */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span>חזרה לעמוד הבית</span>
            </Link>
          </div>

          {/* Header Banner */}
          <div className="bg-slate-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-4">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 text-xs font-bold tracking-wide">CutWeb OS · מסמך משפטי מחייב</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">תקנון ותנאי שימוש</h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              תנאי הרישיון, השימוש וההתקשרות המלאים בפלטפורמת CutWeb OS, במערכות זימון התורים ובאתרי הלקוחות
            </p>
            <div className="mt-4 inline-block text-xs text-indigo-300 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              גרסה 2.4 · עודכן לאחרונה: 30 באוגוסט 2026
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm flex flex-col gap-8 text-slate-700">
            {/* Welcome Box */}
            <div className="bg-indigo-50/80 border-r-4 border-r-indigo-600 border border-indigo-200/80 rounded-2xl p-6 text-sm sm:text-base leading-relaxed text-indigo-950">
              <div className="font-black text-slate-900 text-base mb-1.5">משתמש/ת יקר/ה, שלום רב!</div>
              <p>
                ברוך הבא ל-<strong>CutWeb OS</strong> – פלטפורמת ניהול היומנים, אתרי העסקים וזימון התורים הדיגיטלי (להלן: &quot;המערכת&quot;, &quot;הפלטפורמה&quot;, &quot;התוכנה&quot; ו/או &quot;השירות&quot;).
              </p>
            </div>

            {/* 1 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">1. פתח דבר</h2>
              <p className="text-sm sm:text-base leading-relaxed">1.1. מסמך זה מנוסח בלשון זכר מטעמי נוחות אך מתייחס כמובן לנשים ולגברים כאחד.</p>
              <p className="text-sm sm:text-base leading-relaxed">1.2. תנאי השימוש שלהלן מפרטים את תנאי הרישיון לשימוש במערכת, והם מהווים הסכם משפטי מחייב בינך לבין החברה המפעילה (להלן: &quot;החברה&quot;).</p>
              <p className="text-sm sm:text-base leading-relaxed">1.3. תנאי השימוש חלים על השימוש במערכת ובתכנים הכלולים בה באמצעות מחשב, טלפון סלולארי או כל מכשיר תקשורת אחר.</p>
              <p className="text-sm sm:text-base leading-relaxed">1.4. השימוש במערכת ובכלל זה בתכנים המוצגים בה כפוף לתנאי השימוש. אנא קרא תנאים אלה בעיון ובקפידה.</p>
            </section>

            <hr className="border-slate-100" />

            {/* 2 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">2. שירותי הפלטפורמה (SaaS Service Scope)</h2>
              <p className="text-sm sm:text-base leading-relaxed">2.1. CutWeb מספקת פלטפורמת תוכנה כשירות (SaaS) לניהול יומנים, הקמת דפי נחיתה אישיים וסנכרון תורים עבור עסקים עצמאיים וחברות.</p>
              <p className="text-sm sm:text-base leading-relaxed">2.2. החברה מתחייבת לזמינות מערכת (SLA) גבוהה של 99.9%, בכפוף לתחזוקה תקופתית שוטפת.</p>
            </section>

            <hr className="border-slate-100" />

            {/* 3 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">3. פרטיות, אבטחת מידע ונגישות</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                3.1. החברה פועלת בהתאם לחוק הגנת הפרטיות, תשמ&quot;א-1981 ותקנותיו, ומיישמת פרוטוקולי הצפנה בסטנדרט Enterprise (SSL/TLS ו-AES-256).
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                3.2. לפרטים נוספים, עיין ב-
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800 underline font-bold mx-1">
                  מדיניות הפרטיות המלאה
                </Link>
                וכן ב-
                <Link href="/accessibility" className="text-indigo-600 hover:text-indigo-800 underline font-bold mx-1">
                  הצהרת הנגישות (WCAG 2.1 AA)
                </Link>.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 4 */}
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">4. יצירת קשר ותמיכה</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                לכל שאלה, תמיכה טכנית או בירור בנוגע לתנאי שירות אלו, ניתן לפנות אלינו בכתובת דוא&quot;ל:{' '}
                <a href="mailto:support@cutweb.co.il" className="text-indigo-600 hover:text-indigo-800 underline font-bold" dir="ltr">
                  support@cutweb.co.il
                </a>{' '}
                או בטלפון:{' '}
                <a href="tel:0587815070" className="text-indigo-600 hover:text-indigo-800 underline font-bold" dir="ltr">
                  058-781-5070
                </a>.
              </p>
            </section>

            {/* Back Button */}
            <div className="pt-6 border-t border-slate-100 text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-xs px-8 py-3.5 rounded-full hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזרה לעמוד הבית</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
