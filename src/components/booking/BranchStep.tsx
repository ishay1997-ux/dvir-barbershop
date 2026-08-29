'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Calendar, Check, Phone } from 'lucide-react';
import { useShopStore } from '@/lib/store';
import type { Branch } from '@/lib/types';

interface BranchStepProps {
  selectedBranch: Branch | null;
  onSelectBranch: (branch: Branch) => void;
}

const dayNames = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'שבת'];

export default function BranchStep({ selectedBranch, onSelectBranch }: BranchStepProps) {
  const { branches } = useShopStore();

  return (
    <div>
      <div className="text-center mb-8">
        <span className="text-gold text-xs font-bold tracking-widest uppercase">שלב ראשון</span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] mt-1 mb-2">
          באיזה סניף תרצה להסתפר?
        </h2>
        <p className="text-[#6B6560] text-sm max-w-sm mx-auto">
          דביר מספר באריאל וברחובות. בחר את המיקום הנוח עבורך להזמנת תור.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => {
          const isSelected = selectedBranch?.id === branch.id;
          const activeDaysFormatted = branch.activeDays.map((d) => dayNames[d]).join(', ');

          return (
            <motion.div
              key={branch.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectBranch(branch)}
              className={`relative rounded-2xl p-6 cursor-pointer border-2 transition-all duration-200 text-right flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-gold shadow-gold ring-2 ring-gold/20'
                  : 'bg-white/80 border-[#E5DDD0] hover:border-gold/50 shadow-sm'
              }`}
            >
              {/* Selected checkmark badge */}
              {isSelected && (
                <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-gold text-[#1C1C1C] flex items-center justify-center font-bold shadow-md">
                  <Check className="w-4 h-4" />
                </div>
              )}

              <div>
                {/* Branch Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gold uppercase tracking-wider">
                      {branch.city}
                    </span>
                    <h3 className="text-lg font-black text-[#1C1C1C] leading-tight">
                      {branch.name.replace(`סניף ${branch.city} – `, '')}
                    </h3>
                  </div>
                </div>

                {/* Address & description */}
                <p className="text-xs text-[#6B6560] mt-2 mb-4 leading-relaxed">
                  {branch.shortDescription}
                </p>

                <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#E5DDD0]/60 space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[#3D3D3D]">
                    <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="font-semibold">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3D3D3D]">
                    <Calendar className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span>ימי פעילות: <strong>{activeDaysFormatted}</strong></span>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE1] text-xs">
                <a
                  href={branch.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  ניווט ב-Waze
                </a>

                <span className={`font-bold transition-colors ${
                  isSelected ? 'text-gold' : 'text-[#9E9891]'
                }`}>
                  {isSelected ? 'סניף נבחר ✓' : 'לחץ לבחירה ←'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
