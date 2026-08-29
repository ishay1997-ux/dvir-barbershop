import Link from 'next/link';
import { Scissors, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'תנאי שימוש ותקנון | המספרה של דביר',
  description: 'תקנון ותנאי השימוש במערכת זימון התורים של המספרה של דביר.',
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
                <p className="text-xs sm:text-sm text-[#9E9891]">המספרה של דביר · מערכת זימון תורים</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              עודכן לאחרונה: 2026 · גרסה 2.1
            </p>
          </div>

          {/* Content */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-2xl p-4 text-xs sm:text-sm text-zinc-200">
              משתמש/ת יקר/ה! ברוך הבא למערכת זימון התורים של <strong>המספרה של דביר</strong>. אנו מודים לך על ביקורך ושימושך במערכת זימון התורים (להלן: &quot;המערכת&quot;, &quot;האתר&quot; ו/או &quot;האפליקציה&quot;).
            </div>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">1. פתח דבר</h2>
              <p>1.1. מסמך זה מנוסח בלשון זכר מטעמי נוחות אך מתייחס כמובן לנשים ולגברים כאחד.</p>
              <p>1.2. תנאי השימוש שלהלן מפרטים את תנאי הרישיון לשימוש במערכת, והם מהווים הסכם משפטי מחייב בינך לבין הנהלת המספרה ומפעילי המערכת.</p>
              <p>1.3. תנאי השימוש חלים על השימוש במערכת ובתכנים הכלולים בה באמצעות מחשב, טלפון סלולארי או כל מכשיר תקשורת אחר, בין באמצעות רשת האינטרנט ובין באמצעות כל רשת או אמצעי תקשורת אחרים.</p>
              <p>1.4. השימוש במערכת ובכלל זה בתכנים המוצגים בה כפוף לתנאי השימוש. כניסה למערכת והשימוש בה מעידים על הסכמתך לתנאים אלו. אם אינך מסכים לתנאים, כולם או חלקם, הנך מתבקש להימנע מעשיית שימוש במערכת.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">2. על המערכת וזימון תורים</h2>
              <p>2.1. המערכת מיועדת לזימון, צפייה, שינוי וביטול תורים לתספורות ועיצוב זקן במספרה של דביר בסניפי אריאל ורחובות.</p>
              <p>2.2. בעת זימון תור, הנך מתבקש להזין פרטים מדויקים (שם מלא ומספר טלפון נייד זמין) לצורך זיהוי, אישור התור ומשלוח תזכורות.</p>
              <p>2.3. הנהלת המספרה שומרת לעצמה את הזכות לעדכן מועדי תורים או ליצור קשר במקרים חריגים.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">3. מדיניות ביטולים ושינוי מועד</h2>
              <p>3.1. לקוח אשר אינו יכול להגיע לתור שנקבע מתבקש לבטל או לעדכן את התור בהקדם האפשרי דרך עמוד &quot;התורים שלי&quot; באתר או בהודעה ישירה למספרה.</p>
              <p>3.2. הגעה בזמן: יש להגיע כ-5 דקות לפני מועד התור שנקבע על מנת לאפשר רצף עבודה מדויק ונוח לכלל הלקוחות.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">4. אבטחת מידע ופרטיות</h2>
              <p>4.1. המערכת עושה שימוש באמצעי אבטחה טכנולוגיים והצפנת תקשורת (SSL/TLS) כדי להגן על המידע האישי שהוזן.</p>
              <p>4.2. הנתונים הנמסרים בעת הרישום (שם וטלפון) משמשים אך ורק לצורך ניהול התורים, עדכונים לגבי המספרה ומשלוח תזכורות לקראת התור.</p>
              <p>4.3. פרטי הלקוחות לא יועברו לצדדים שלישיים ללא הסכמה מפורשת, למעט לצורך תפעול טכני של המערכת.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">5. משלוח הודעות ותזכורות (SMS / WhatsApp)</h2>
              <p>5.1. ברישומך לשירות הנך מאשר קבלת הודעות תפעוליות הנוגעות לתורים שקבעת (אישור תור, תזכורת יום לפני, ועדכונים רלוונטיים).</p>
              <p>5.2. בכל עת ניתן לפנות להנהלת המספרה בבקשה לעדכון או הסרה מרשימת התפוצה.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">6. יצירת קשר ושירות לקוחות</h2>
              <p>לכל שאלה, הבהרה או בירור לגבי תנאי שימוש אלו או פעילות המספרה, ניתן לפנות אלינו:</p>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1 font-bold">
                <p>📍 המספרה של דביר · אריאל & רחובות</p>
                <p>📞 טלפון / וואטסאפ: 058-781-5071</p>
                <p>🌐 כתובת האתר: thecut-reg-in.vercel.app</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
