import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import { ShieldCheck, Phone, Mail, MapPin, CheckCircle, Clock } from 'lucide-react';
import { SHOP_INFO } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | The Cut מספרה',
  description: 'הצהרת נגישות לפי תקן ישראלי 5568 ברמת AA ודרישות WCAG 2.1 – פירוט הסדרי נגישות באתר ובמספרה.',
};

export default function AccessibilityPage() {
  const lastUpdated = 'אוגוסט 2026';

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="bg-[#1C1C1C] rounded-3xl p-8 sm:p-12 text-center text-white mb-10 shadow-lg relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-bold tracking-wide">תקן ישראלי ת"י 5568 · רמת AA</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-4">הצהרת נגישות</h1>
            <p className="text-[#9E9891] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              מספרת {SHOP_INFO.name} רואה חשיבות עליונה בהנגשת שירותיה והאתר שלה לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DDD0] shadow-sm flex flex-col gap-8">
            {/* General Statement */}
            <section aria-labelledby="statement-intro">
              <h2 id="statement-intro" className="text-xl font-black text-[#1C1C1C] mb-3">
                מחויבותנו לנגישות
              </h2>
              <p className="text-[#3D3D3D] text-sm sm:text-base leading-relaxed">
                אנו פועלים בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998, ותקנות הנגישות שהותקנו מכוחו. אתר זה עוצב ונבנה בהתאם להנחיות הנגישות בתקן הישראלי (ת"י 5568) המבוסס על הנחיות ה-Web Content Accessibility Guidelines (WCAG 2.1) של ארגון ה-W3C הבינלאומי ברמת AA.
              </p>
            </section>

            <hr className="border-[#F0EBE1]" />

            {/* Digital Accessibility Features */}
            <section aria-labelledby="digital-a11y">
              <h2 id="digital-a11y" className="text-xl font-black text-[#1C1C1C] mb-4">
                התאמות הנגישות באתר האינטרנט
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'ניווט מקלדת מלא', desc: 'ניתן לנווט בכל חלקי האתר באמצעות מקש Tab, החצים ו-Enter.' },
                  { title: 'סרגל נגישות צף', desc: 'הגדלת טקסט, ניגודיות גבוהה, גווני אפור, גופן קריא ועצירת אנימציות.' },
                  { title: 'דילוג לתוכן מרכזי', desc: 'קישור דילוג מהיר (Skip to Content) בראש הדף למשתמשי מקלדת וקוראי מסך.' },
                  { title: 'תמיכה בקוראי מסך', desc: 'שימוש בתגיות HTML5 סמנטיות, מאפייני ARIA וטקסטים חלופיים לתמונות.' },
                  { title: 'ניגודיות צבעים תקנית', desc: 'כל הטקסטים והרכיבים עומדים ביחסי הניגודיות הנדרשים (מעל 4.5:1 לטקסט רגיל).' },
                  { title: 'התאמה מלאה למובייל', desc: 'כפתורים רחבים (מעל 44px) ופריסה רספונסיבית ברורה לכל גודל מסך.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0]">
                    <CheckCircle className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
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
                הסדרי נגישות פיזיים במספרה
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

            {/* Accessibility Coordinator Contact */}
            <section aria-labelledby="coordinator-info">
              <h2 id="coordinator-info" className="text-xl font-black text-[#1C1C1C] mb-3">
                פרטי רכז הנגישות ופניות בנושא נגישות
              </h2>
              <p className="text-[#3D3D3D] text-sm leading-relaxed mb-4">
                אם נתקלתם בקושי בגלישה באתר או בביקור במספרה, או שיש לכם הצעה לשיפור הנגישות, נשמח מאוד שתפנו אלינו ואנו נטפל בפנייתכם בהקדם האפשרי:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0]">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#6B6560]">טלפון / WhatsApp</div>
                    <a href={`tel:${SHOP_INFO.phone}`} className="font-bold text-[#1C1C1C] text-sm hover:text-[#C9A84C]" dir="ltr">
                      {SHOP_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0]">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#6B6560]">דואר אלקטרוני</div>
                    <a href="mailto:info@thecut.co.il" className="font-bold text-[#1C1C1C] text-sm hover:text-[#C9A84C]">
                      info@thecut.co.il
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-[#9E9891]">
                <Clock className="w-4 h-4" />
                <span>הצהרת הנגישות עודכנה לאחרונה בתאריך: <strong>{lastUpdated}</strong></span>
              </div>
            </section>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className="btn-shimmer inline-block text-[#1C1C1C] font-bold text-sm px-8 py-3.5 rounded-full hover:scale-105 transition-transform"
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
