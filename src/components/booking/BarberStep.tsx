'use client';

import { Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useShopStore } from '@/lib/store';
import type { Barber } from '@/lib/types';

const avatarGradients = [
  'from-amber-700 via-amber-600 to-yellow-500',
  'from-stone-600 via-stone-500 to-stone-400',
  'from-amber-900 via-amber-700 to-amber-500',
];

export default function BarberStep({
  selected,
  onSelect,
}: {
  selected: Barber | null;
  onSelect: (barber: Barber) => void;
}) {
  const { barbers } = useShopStore();
  const activeBarbers = barbers.filter((b) => b.is_active);
  const handleAny = () => {
    const anyBarber: Barber = {
      id: 'any',
      name: 'כל ספר פנוי',
      role: 'ספר פנוי',
      bio: 'השבץ אוטומטי לספר הזמין הקרוב ביותר',
      specialties: [],
      color: '#C9A84C',
      branchIds: ['ariel', 'rehovot'],
      is_active: true,
      photo_url: null,
    };
    onSelect(anyBarber);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1C1C1C]">בחר ספר</h2>
        <p className="text-[#6B6560] text-sm mt-1">עם מי תרצה לקבוע תור?</p>
      </div>

      {/* Any barber option */}
      <button
        onClick={handleAny}
        className={cn(
          'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 mb-4 active:scale-[0.98]',
          selected?.id === 'any'
            ? 'border-gold bg-gold/5'
            : 'border-dashed border-[#D5CBB8] bg-[#FAF7F2] hover:border-gold/50'
        )}
        aria-pressed={selected?.id === 'any'}
        id="barber-any-button"
      >
        <div className="w-12 h-12 rounded-xl bg-[#F0EBE1] flex items-center justify-center">
          <Shuffle className="w-5 h-5 text-[#6B6560]" />
        </div>
        <div className="text-right">
          <div className="font-bold text-[#1C1C1C]">כל ספר פנוי</div>
          <div className="text-[#6B6560] text-xs">השבץ אוטומטי לספר הזמין הקרוב ביותר</div>
        </div>
      </button>

      {/* Individual barbers */}
      <div className="flex flex-col gap-3">
        {activeBarbers.map((barber, i) => {
          const isSelected = selected?.id === barber.id;
          return (
            <button
              key={barber.id}
              onClick={() => onSelect(barber)}
              className={cn(
                'w-full text-right flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-md active:scale-[0.98]',
                isSelected
                  ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(201,168,76,0.1)]'
                  : 'border-[#E5DDD0] bg-white hover:border-gold/50'
              )}
              aria-pressed={isSelected}
              aria-label={`בחר את הספר ${barber.name}`}
              id={`barber-option-${barber.id}`}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGradients[i]} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                {barber.name[0]}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className={cn('font-bold text-base', isSelected ? 'text-gold' : 'text-[#1C1C1C]')}>
                  {barber.name}
                </div>
                <div className="text-[#6B6560] text-xs mt-0.5">{barber.bio}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {barber.specialties.map((spec) => (
                    <span key={spec} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0EBE1] text-[#6B6560]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Radio */}
              <div className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                isSelected ? 'border-gold bg-gold' : 'border-[#D5CBB8]'
              )}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
