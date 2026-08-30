'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { BusinessConfig } from '@/types/business';

interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'איך מבטלים או משנים מועד של תור שכבר הוזמן?',
    answer: 'ניתן לבטל תור בקלות ובכל עת דרך כפתור "התורים שלי" בראש האתר, בהודעת ה-WhatsApp של אישור ההזמנה, או בפנייה ישירה למספרה.',
  },
  {
    question: 'מה קורה אם אני מאחר לתור שנקבע לי?',
    answer: 'אנחנו מקפידים על לוח זמנים מדויק. איחור של מעל 10 דקות עלול לגרום לקיצור זמן הטיפול או לצורך בקביעת מועד חדש.',
  },
  {
    question: 'האם יש חניה נגישה בסמוך למספרה?',
    answer: 'כן! קיימות חניות רחוב וחניון מוסדר בצמוד למספרה עם גישה נוחה ונגישה.',
  },
  {
    question: 'באילו אמצעי תשלום ניתן לשלם במספרה?',
    answer: 'אנו מקבלים את כל סוגי כרטיסי האשראי, אפליקציות תשלום (Bit, Apple Pay, Google Pay) ומזומן. התשלום מתבצע במספרה בסיום הטיפול.',
  },
  {
    question: 'האם אתם מספרים גם ילדים ונוער?',
    answer: 'כן! אנו מבצעים תספורות ילדים ונוער באווירה סבלנית, חווייתית ומקצועית עם כל הטרנדים והדירוגים המובילים.',
  },
];

export default function FaqSection({
  business,
}: {
  business?: Partial<BusinessConfig>;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const themeColor = business?.themeColor || '#C9A84C';
  const bizName = business?.name || 'המספרה של דביר';

  const faqs: FaqItem[] = business?.faqs && business.faqs.length > 0
    ? business.faqs
    : DEFAULT_FAQS;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={ref}
      className="py-20 bg-[#141414] text-white relative border-t border-white/10"
      aria-labelledby="faq-heading"
      dir="rtl"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-3"
            style={{
              borderColor: `${themeColor}40`,
              backgroundColor: `${themeColor}15`,
              color: themeColor,
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-black tracking-widest uppercase">
              מידע שימושי
            </span>
          </div>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-black text-white mt-1 mb-3"
          >
            {business?.layout?.sectionTitles?.faqs || 'שאלות נפוצות'}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: themeColor }} />
          <p className="text-zinc-400 mt-4 max-w-md mx-auto text-xs sm:text-sm font-sans">
            כל מה שחשוב לדעת לפני שמגיעים לתור שלך ב-{bizName}
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-[#202020] rounded-2xl border transition-all overflow-hidden"
                style={{
                  borderColor: isOpen ? `${themeColor}80` : 'rgba(255,255,255,0.08)',
                }}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 leading-relaxed">{faq.question}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300"
                    style={{
                      backgroundColor: isOpen ? themeColor : 'rgba(255,255,255,0.05)',
                      borderColor: isOpen ? themeColor : 'rgba(255,255,255,0.1)',
                      color: isOpen ? '#1C1C1C' : '#9E9891',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
