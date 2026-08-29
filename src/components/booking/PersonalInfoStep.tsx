'use client';

import { User, Phone, AlertCircle, Sparkles, Check, PackagePlus } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useShopStore } from '@/lib/store';
import type { ProductAddon } from '@/lib/types';

interface Props {
  name: string;
  phone: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  selectedAddons?: ProductAddon[];
  onToggleAddon?: (addon: ProductAddon) => void;
}

export default function PersonalInfoStep({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  selectedAddons = [],
  onToggleAddon,
}: Props) {
  const { productAddons } = useShopStore();
  const nameValid = name.trim().length >= 2;
  const phoneValid = phone.trim().replace(/\D/g, '').length >= 9;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1C1C1C]">פרטים אישיים ושדרוגים</h2>
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

        {/* Product Add-Ons Upsell Card */}
        {productAddons && productAddons.length > 0 && (
          <div className="mt-2 p-4 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gold/20 text-[#856514] flex items-center justify-center">
                <PackagePlus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1C1C1C]">רוצה לשדרג את התור עם מוצרי פרימיום?</h4>
                <p className="text-[11px] text-[#6B6560]">איסוף ישיר מהספר במעמד התספורת</p>
              </div>
            </div>

            <div className="space-y-2">
              {productAddons.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.id === addon.id);

                return (
                  <div
                    key={addon.id}
                    onClick={() => onToggleAddon && onToggleAddon(addon)}
                    className={cn(
                      'p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-right',
                      isSelected
                        ? 'bg-amber-500/10 border-gold shadow-sm ring-1 ring-gold/50'
                        : 'bg-[#FAF7F2] border-[#E5DDD0] hover:border-gold/40'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-md border flex items-center justify-center text-xs transition-colors shrink-0',
                          isSelected ? 'bg-gold border-gold text-[#1C1C1C] font-black' : 'border-zinc-300 bg-white'
                        )}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5">
                          <span>{addon.icon}</span>
                          <span>{addon.name}</span>
                        </div>
                        <div className="text-[11px] text-[#6B6560] line-clamp-1">{addon.description}</div>
                      </div>
                    </div>

                    <span className="font-mono font-black text-xs text-gold whitespace-nowrap">
                      +{formatPrice(addon.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Privacy notice */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-700 leading-relaxed">
          🔒 הפרטים שלך שמורים אצלנו בלבד ומשמשים רק לאישור ותזכורת לפני התור. לא נשלח ספאם.
        </div>
      </div>
    </div>
  );
}
