'use client';

import { Clock } from 'lucide-react';
import { MOCK_SERVICES, formatPrice, formatDuration, cn } from '@/lib/utils';
import type { Service } from '@/lib/types';

export default function ServiceStep({
  selected,
  onSelect,
}: {
  selected: Service | null;
  onSelect: (service: Service) => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1C1C1C]">בחר שירות</h2>
        <p className="text-[#6B6560] text-sm mt-1">איזה שירות תרצה לקבוע?</p>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_SERVICES.map((service) => {
          const isSelected = selected?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={cn(
                'w-full text-right flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-md active:scale-[0.98]',
                isSelected
                  ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(201,168,76,0.1)]'
                  : 'border-[#E5DDD0] bg-white hover:border-gold/50'
              )}
              aria-pressed={isSelected}
              aria-label={`בחר ${service.name} - ${formatPrice(service.price)}`}
              id={`service-option-${service.id}`}
            >
              {/* Icon */}
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors',
                isSelected ? 'bg-gold/20' : 'bg-[#F0EBE1]'
              )}>
                {service.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('font-bold text-base', isSelected ? 'text-gold' : 'text-[#1C1C1C]')}>
                    {service.name}
                  </span>
                  <span className={cn('font-black text-lg flex-shrink-0', isSelected ? 'text-gold' : 'text-[#1C1C1C]')}>
                    {formatPrice(service.price)}
                  </span>
                </div>
                <p className="text-[#6B6560] text-xs mt-0.5 truncate">{service.description}</p>
                <div className="flex items-center gap-1 mt-1.5 text-[#9E9891] text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(service.duration)}</span>
                </div>
              </div>

              {/* Check indicator */}
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
