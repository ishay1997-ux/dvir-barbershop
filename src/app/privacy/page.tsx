import Link from 'next/link';
import { ArrowRight, ShieldCheck, Lock, Eye } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'מדיניות פרטיות | המספרה של דביר',
  description: 'מדיניות הפרטיות ואבטחת המידע במספרה של דביר.',
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
                <p className="text-xs sm:text-sm text-[#9E9891]">המספרה של דביר</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              עודכן לאחרונה: 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">1. איסוף המידע</h2>
              <p>בעת הזמנת תור במספרה של דביר, אנו אוספים פרטים בסיסיים הנדרשים לתיאום התור בלבד: שם מלא, מספר טלפון נייד, וסניף ושירות מבוקש.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">2. השימוש במידע</h2>
              <p>המידע משמש אך ורק למטרות הבאות:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                <li>תיאום ואישור התור במספרה.</li>
                <li>משלוח תזכורות או עדכונים לגבי מועד התור.</li>
                <li>שמירת היסטוריית תורים לנוחיות הלקוח (בעמוד &quot;התורים שלי&quot;).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">3. שמירה ואבטחת מידע</h2>
              <p>אנו מיישמים אמצעי אבטחה טכנולוגיים מתקדמים, לרבות פרוטוקולי הצפנה (SSL/TLS), על מנת להבטיח את סודיות המידע שנמסר לנו.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#DFCA85]">4. יצירת קשר בנושאי פרטיות</h2>
              <p>בכל עת ניתן לפנות לדביר בטלפון 052-123-4567 לבקשת עיון, תיקון או מחיקת פרטיכם ממאגר הלקוחות.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
