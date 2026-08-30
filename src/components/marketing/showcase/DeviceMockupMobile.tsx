import React from 'react';
import { ShowcaseSite } from './showcase-data';

interface DeviceMockupMobileProps {
  current: ShowcaseSite;
  selectedServiceIndex: number;
  hasSimulatedBooking: boolean;
  onSelectService: (idx: number) => void;
  onSimulateBooking: () => void;
}

export function DeviceMockupMobile({
  current,
  selectedServiceIndex,
  hasSimulatedBooking,
  onSelectService,
  onSimulateBooking,
}: DeviceMockupMobileProps) {
  const activeService = current.services[selectedServiceIndex] || current.services[0];

  return (
    <div className="max-w-[340px] mx-auto bg-slate-950 rounded-[44px] border-[6px] border-slate-800 shadow-2xl p-4 overflow-hidden relative text-white space-y-4">
      {/* Dynamic Island / Speaker Notch */}
      <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-slate-800 ml-2" />
      </div>

      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-black"
            style={{ backgroundColor: current.themeColor }}
          >
            {current.businessName.charAt(0)}
          </div>
          <div>
            <h4 className="text-xs font-black truncate max-w-[150px]">{current.businessName}</h4>
            <span className="text-[9px] text-zinc-400">📍 {current.city}</span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-400">פתוח לתורים</span>
      </div>

      {/* Mobile Hero & Slogan */}
      <div className="space-y-1.5 text-right">
        <span className="text-[10px] text-zinc-400 font-sans">הזמנת תור אונליין:</span>
        <h3 className="text-sm font-black leading-snug">{current.slogan}</h3>
      </div>

      {/* Mobile Services Selection List */}
      <div className="space-y-2">
        {current.services.map((srv, i) => (
          <div
            key={i}
            onClick={() => onSelectService(i)}
            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
              selectedServiceIndex === i
                ? 'bg-white/15 border-white/40'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div>
              <span className="font-bold block text-white text-[11px]">{srv.name}</span>
              <span className="text-[9px] text-zinc-400">{srv.time}</span>
            </div>
            <span className="font-mono font-black" style={{ color: current.themeColor }}>
              {srv.price} ₪
            </span>
          </div>
        ))}
      </div>

      {/* Mobile Bottom Booking Bar */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <button
          type="button"
          onClick={onSimulateBooking}
          className="w-full py-2.5 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-1 shadow-md cursor-pointer"
          style={{ backgroundColor: current.themeColor }}
        >
          <span>{hasSimulatedBooking ? '✓ נשלח לוואטסאפ!' : `קבע תור · ${activeService.price} ₪`}</span>
        </button>
        <span className="text-[9px] text-zinc-400 block text-center">
          ללא צורך בהורדת אפליקציה · אישור מיידי
        </span>
      </div>
    </div>
  );
}
