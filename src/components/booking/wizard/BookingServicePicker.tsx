'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';
import { getIndustryTerminology } from '@/lib/industry-terminology';
import { MapPin, Sparkles, Home, Building2 } from 'lucide-react';
import type { BusinessConfig, BusinessService } from '@/types/business';

interface BookingServicePickerProps {
  business: BusinessConfig;
  selectedBranch: string;
  selectedService: BusinessService | null;
  themeColor: string;
  onSelectBranch: (branchName: string) => void;
  onSelectService: (service: BusinessService) => void;
}

export const BookingServicePicker: React.FC<BookingServicePickerProps> = ({
  business,
  selectedBranch,
  selectedService,
  themeColor,
  onSelectBranch,
  onSelectService,
}) => {
  const terminology = getIndustryTerminology(business);
  const isHomeService =
    business.category === 'home_technician' ||
    selectedService?.locationType === 'CLIENT_ADDRESS';

  return (
    <div className="space-y-4">
      {/* 1. Branch Selector OR Service Area Banner */}
      {!isHomeService && business.branches && business.branches.length > 1 ? (
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-2">בחר סניף:</label>
          <div className="grid grid-cols-2 gap-2">
            {business.branches.map((b, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectBranch(b.name)}
                className={`p-2.5 rounded-xl border text-right text-xs font-bold transition-all cursor-pointer ${
                  selectedBranch === b.name
                    ? 'bg-white/15 border-white text-white shadow-xs'
                    : 'bg-[#141414] border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="truncate flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{b.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : isHomeService ? (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-300 text-xs">
          <Home className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1">
            <span className="font-black">שירות והגעה עד בית/עסק הלקוח</span>
            <span className="text-[11px] text-zinc-300 block opacity-90">
              אזור פעילות וכיסוי: {business.city || 'אזור מרכז והסביבה'}
            </span>
          </div>
        </div>
      ) : null}

      {/* 2. Choose Service */}
      <div>
        <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center justify-between">
          <span>1. בחר {terminology.serviceTitle || 'שירות'}:</span>
          <span className="text-[10px] text-zinc-500 font-normal">מחירים שקופים</span>
        </label>
        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-none">
          {business.services?.map((srv, idx) => {
            const isSelected = selectedService?.name === srv.name;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectService(srv)}
                className={`p-3 rounded-xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-white text-white shadow-xs'
                    : 'bg-[#141414] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
                style={{
                  backgroundColor: isSelected ? `${themeColor}20` : '#141414',
                  borderColor: isSelected ? themeColor : 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex-1 pr-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{srv.name}</span>
                    {srv.popular && (
                      <span
                        className="text-[9px] font-black px-1.5 py-0.2 rounded-md text-slate-950"
                        style={{ backgroundColor: themeColor }}
                      >
                        מומלץ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-2">
                    <span>⏱️ {srv.duration} דקות</span>
                    {srv.locationType === 'CLIENT_ADDRESS' && (
                      <span className="text-amber-400 font-bold">🏠 בבית הלקוח</span>
                    )}
                  </div>
                  {srv.description && (
                    <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                      {srv.description}
                    </p>
                  )}
                </div>
                <span className="text-xs font-black shrink-0 mr-2" style={{ color: themeColor }}>
                  {formatPrice(srv.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
