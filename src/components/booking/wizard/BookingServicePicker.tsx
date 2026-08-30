'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';
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
  return (
    <div className="space-y-4">
      {/* Branch Selector (if multiple) */}
      {business.branches && business.branches.length > 1 && (
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
                    ? 'bg-white/15 border-white text-white'
                    : 'bg-[#141414] border-white/10 text-zinc-400'
                }`}
              >
                <div className="truncate">{b.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Choose Service */}
      <div>
        <label className="block text-xs font-bold text-zinc-300 mb-2">1. בחר טיפול / שירות:</label>
        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
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
                    : 'bg-[#141414] border-white/10 text-zinc-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? `${themeColor}20` : '#141414',
                  borderColor: isSelected ? themeColor : 'rgba(255,255,255,0.1)',
                }}
              >
                <div>
                  <div className="text-xs font-black text-white">{srv.name}</div>
                  <span className="text-[10px] text-zinc-500">{srv.duration} דקות</span>
                </div>
                <span className="text-xs font-black" style={{ color: themeColor }}>
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
