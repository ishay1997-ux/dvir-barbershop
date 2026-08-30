'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'האם הלקוחות שלי צריכים להוריד אפליקציה מחנות האפליקציות?',
      a: 'ממש לא! האתר שלכם פועל כאתר אינטרנט מהיר ומודרני (Web App) ישירות בכל דפדפן (ספארי, כרום ועוד). הלקוח פשוט נכנס לקישור באינסטגרם שלכם, בוחר טיפול ושעה, ומקבל אישור ישיר בוואטסאפ – תוך 3 קליקים.',
    },
    {
      q: 'איך עובדת מערכת התזכורות ואישורי ה-WhatsApp?',
      a: 'המערכת מאפשרת שליחת הודעות אישור אוטומטיות ותזכורות ישירות לטלפון של הלקוח. כל הודעה כוללת את פרטי התור, שם נותן השירות וקישור ישיר ל-Waze להגעה קלה ומהירה.',
    },
    {
      q: 'האם אני יכול להתאים אישית את הצבעים, השירותים והעיצוב?',
      a: 'בוודאי! בפאנל הניהול שלכם תוכלו לבחור ערכות נושא (סגנון בהיר יוקרתי, כהה מודרני, ניאון), להעלות לוגו ותמונות גלריה, להגדיר שעות פתיחה, לקבוע מחירון מדויק ולהפעיל או לכבות סקשנים לפי רצונכם.',
    },
    {
      q: 'האם המערכת מתאימה גם לעסקים עם מספר עובדים או סניפים?',
      a: 'כן! בחבילות Pro ו-Team ניתן להגדיר מספר אנשי צוות, להקצות לכל עובד יומן שבועי נפרד, שעות פעילות וסניפים שונים, ולנהל את הכל תחת דשבורד מרכזי אחד.',
    },
    {
      q: 'כמה זמן לוקח להקים את האתר ולהתחיל לקבל תורים?',
      a: 'פחות מ-60 שניות. אתם בוחרים את ענף הפעילות, מזינים את שם העסק שלכם – והאתר באוויר ומוכן לקבלת תורים באופן מיידי.',
    },
    {
      q: 'האם יש התחייבות או עלויות נסתרות?',
      a: 'אפס התחייבות. תוכלו להתחיל בחינם לחלוטין בחבילת Starter ללא צורך בכרטיס אשראי, לשדרג מתי שתרצו, ולבטל בכל רגע בלחיצת כפתור.',
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white border-t border-slate-200/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>שאלות ותשובות</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            כל מה שחשוב לדעת על CutWeb
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-sans leading-relaxed">
            תשובות לשאלות הנפוצות ביותר של בעלי עסקים שרוצים לשדרג את ניהול התורים שלהם.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-[#F8FAFC] border-indigo-200 shadow-md'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Support Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-100/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-center sm:text-right">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">יש לכם שאלה מיוחדת לעסק שלכם?</h4>
              <p className="text-xs text-slate-500 font-sans">הצוות שלנו זמין לעזור לכם בכל שאלה או התאמה אישית.</p>
            </div>
          </div>
          <a
            href="https://wa.me/972587815071?text=היי,%20יש%20לי%20שאלה%20לגבי%20מערכת%20CutWeb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>דברו איתנו בוואטסאפ</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
