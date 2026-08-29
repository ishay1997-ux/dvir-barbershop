'use client';

import { User, Phone, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  phone: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
}

export default function PersonalInfoStep({ name, phone, onNameChange, onPhoneChange }: Props) {
  const nameValid = name.trim().length >= 2;
  const phoneValid = phone.trim().replace(/\D/g, '').length >= 9;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1C1C1C]">פרטים אישיים</h2>
        <p className="text-[#6B6560] text-sm mt-1">
          לשליחת אישור ותזכורת לפני התור
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="customer-name" className="text-sm font-bold text-[#1C1C1C]">
            שם מלא <span className="text-gold">*</span>
          </label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9891]" />
            <input
              id="customer-name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="ישראל ישראלי"
              className={cn(
                'w-full pr-10 pl-4 py-3.5 rounded-xl border-2 bg-white text-[#1C1C1C] text-base outline-none transition-all duration-200',
                name.length > 0
                  ? nameValid
                    ? 'border-green-400 focus:border-green-500'
                    : 'border-red-300 focus:border-red-400'
                  : 'border-[#E5DDD0] focus:border-gold'
              )}
              autoComplete="name"
              aria-required="true"
              aria-invalid={name.length > 0 && !nameValid}
            />
          </div>
          {name.length > 0 && !nameValid && (
            <p className="text-red-500 text-xs flex items-center gap-1" role="alert">
              <AlertCircle className="w-3 h-3" />
              שם חייב להכיל לפחות 2 תווים
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label htmlFor="customer-phone" className="text-sm font-bold text-[#1C1C1C]">
            מספר טלפון <span className="text-gold">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9891]" />
            <input
              id="customer-phone"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="050-000-0000"
              dir="ltr"
              className={cn(
                'w-full pr-10 pl-4 py-3.5 rounded-xl border-2 bg-white text-[#1C1C1C] text-base outline-none transition-all duration-200 text-right',
                phone.length > 0
                  ? phoneValid
                    ? 'border-green-400 focus:border-green-500'
                    : 'border-red-300 focus:border-red-400'
                  : 'border-[#E5DDD0] focus:border-gold'
              )}
              autoComplete="tel"
              aria-required="true"
              aria-invalid={phone.length > 0 && !phoneValid}
            />
          </div>
          {phone.length > 0 && !phoneValid && (
            <p className="text-red-500 text-xs flex items-center gap-1" role="alert">
              <AlertCircle className="w-3 h-3" />
              הכנס מספר טלפון תקין
            </p>
          )}
        </div>

        {/* Privacy notice */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
          🔒 הפרטים שלך שמורים אצלנו בלבד ומשמשים רק לאישור ותזכורת לפני התור. לא נשלח ספאם.
        </div>
      </div>
    </div>
  );
}
