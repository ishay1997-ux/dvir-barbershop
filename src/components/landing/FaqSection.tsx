'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'איך מבטלים או משנים מועד של תור שכבר הוזמן?',
    answer: 'ניתן לבטל או לשנות את מועד התור בקלות דרך הקישור בהודעת ה-WhatsApp שנשלחה אליכם באישור ההזמנה, או בפנייה ישירה למספרה עד שעתיים לפני מועד התור.',
  },
  {
    question: 'מה קורה אם אני מאחר לתור שנקבע לי?',
    answer: 'אנחנו עושים מאמץ לשמור על לוח זמנים מדויק עבור כל הלקוחות. איחור של מעל 10 דקות עלול לגרום לקיצור זמן הטיפול או לצורך בקביעת מועד חדש, בהתאם לעומס במספרה.',
  },
  {
    question: 'האם יש חניה נגישה בסמוך למספרה?',
    answer: 'כן! קיימות חניות רחוב (כחול-לבן) וחניון מוסדר במרחק של כ-50 מטרים מהמספרה. ישנן גם חניות נכים מסומנות עם גישה ללא מדרגות עד פתח המספרה.',
  },
  {
    question: 'האם אפשר לבחור ספר ספציפי בתהליך ההזמנה?',
    answer: 'בוודאי! במהלך תהליך ההזמנה באתר ניתן לבחור את הספר המועדף עליך (יוסי, דניאל או אבי), או לבחור באפשרות "כל ספר פנוי" לקבלת התור המהיר ביותר.',
  },
  {
    question: 'האם אתם מספרים גם ילדים ונוער?',
    answer: 'כן, אנו מבצעים תספורות ילדים ונוער באווירה סבלנית, חווייתית ומקצועית עם כל הטרנדים הכי חמים.',
  },
  {
    question: 'באילו אמצעי תשלום ניתן לשלם במספרה?',
    answer: 'אנו מקבלים את כל סוגי כרטיסי האשראי, אפליקציות תשלום (Bit, Apple Pay, Google Pay) ומזומן. התשלום מתבצע במספרה בסיום הטיפול.',
  },
];

export default function FaqSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Schema.org FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={ref}
      className="py-24 bg-[#F0EBE1] relative"
      aria-labelledby="faq-heading"
    >
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase">
              מידע שימושי
            </span>
          </div>
          <h2
            id="faq-heading"
            className="text-4xl sm:text-5xl font-black text-[#1C1C1C] mt-2 mb-4"
          >
            שאלות נפוצות
          </h2>
          <div className="gold-divider" />
          <p className="text-[#6B6560] mt-4 max-w-md mx-auto text-sm sm:text-base">
            כל מה שחשוב לדעת לפני שמגיעים לתור שלך במספרה.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-white rounded-2xl border border-[#E5DDD0] shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-right p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#1C1C1C] hover:text-[#C9A84C] transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#E5DDD0] text-xs flex items-center justify-center text-[#C9A84C] font-black flex-shrink-0">
                      0{index + 1}
                    </span>
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-gold text-[#1C1C1C]' : 'bg-[#FAF7F2] text-[#6B6560]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-[#6B6560] text-sm sm:text-base leading-relaxed border-t border-[#F0EBE1] pr-14">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DDD0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-right sm:text-right">
            <h3 className="font-bold text-lg text-[#1C1C1C]">יש לך שאלה נוספת שלא מופיעה כאן?</h3>
            <p className="text-[#6B6560] text-xs sm:text-sm mt-1">אנחנו תמיד זמינים לשוחח ב-WhatsApp או בטלפון.</p>
          </div>
          <Link
            href="/booking"
            className="btn-shimmer text-[#1C1C1C] font-bold text-xs sm:text-sm px-6 py-3 rounded-full flex-shrink-0 hover:scale-105 active:scale-95 transition-all"
          >
            הזמן תור עכשיו ←
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
