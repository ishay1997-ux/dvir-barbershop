'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import type { BookingState, Service, Barber, Branch } from '@/lib/types';
import BranchStep from './BranchStep';
import ServiceStep from './ServiceStep';
import BarberStep from './BarberStep';
import DateTimeStep from './DateTimeStep';
import PersonalInfoStep from './PersonalInfoStep';
import ConfirmationStep from './ConfirmationStep';

const STEPS = [
  { id: 1, label: 'סניף' },
  { id: 2, label: 'שירות' },
  { id: 3, label: 'ספר' },
  { id: 4, label: 'מועד' },
  { id: 5, label: 'פרטים' },
  { id: 6, label: 'אישור' },
] as const;

const initialState: BookingState = {
  step: 1,
  selectedBranch: null,
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  customerName: '',
  customerPhone: '',
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

import { useShopStore } from '@/lib/store';

export default function BookingWizard({ initialBarber }: { initialBarber?: string }) {
  const { barbers } = useShopStore();
  const activeBarbers = barbers.filter((b) => b.is_active);
  const isSoloBarber = activeBarbers.length <= 1;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = initialBarber;
  const [state, setState] = useState<BookingState>({
    ...initialState,
    selectedBarber: isSoloBarber && activeBarbers[0] ? activeBarbers[0] : null,
  });
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingStep, setPendingStep] = useState<number | null>(null);

  // Auto-advance
  useEffect(() => {
    if (pendingStep !== null) {
      const timer = setTimeout(() => {
        setDirection(1);
        setState((prev) => ({ ...prev, step: pendingStep as BookingState['step'] }));
        setPendingStep(null);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [pendingStep]);

  const goToStep = useCallback((step: number) => {
    setDirection(step > state.step ? 1 : -1);
    setState((prev) => ({ ...prev, step: step as BookingState['step'] }));
  }, [state.step]);

  const canProceed = useCallback(() => {
    switch (state.step) {
      case 1: return !!state.selectedBranch;
      case 2: return !!state.selectedService;
      case 3: return isSoloBarber || !!state.selectedBarber;
      case 4: return !!state.selectedDate && !!state.selectedTime;
      case 5: return state.customerName.trim().length >= 2 && state.customerPhone.trim().length >= 9;
      case 6: return true;
    }
  }, [state, isSoloBarber]);

  const handleNext = useCallback(() => {
    if (state.step === 2 && isSoloBarber) {
      setState((prev) => ({ ...prev, selectedBarber: activeBarbers[0] || null }));
      goToStep(4);
      return;
    }
    if (state.step < 6 && canProceed()) goToStep(state.step + 1);
  }, [state.step, canProceed, goToStep, isSoloBarber, activeBarbers]);

  const handleBack = useCallback(() => {
    if (state.step === 4 && isSoloBarber) {
      goToStep(2);
      return;
    }
    if (state.step > 1) goToStep(state.step - 1);
  }, [state.step, goToStep, isSoloBarber]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const dateStr = state.selectedDate ? state.selectedDate.toISOString().split('T')[0] : '';
    const tempId = `apt-${Date.now()}`;

    const newAppointmentPayload = {
      id: tempId,
      branchId: state.selectedBranch?.id,
      branchName: state.selectedBranch?.name,
      branch: state.selectedBranch?.name,
      serviceId: state.selectedService?.id,
      serviceName: state.selectedService?.name,
      service: state.selectedService?.name,
      servicePrice: state.selectedService?.price,
      price: state.selectedService?.price,
      barberId: state.selectedBarber?.id || 'dvir',
      barberName: state.selectedBarber?.name || 'דביר',
      barber: state.selectedBarber?.name || 'דביר',
      date: dateStr,
      time: state.selectedTime,
      customerName: state.customerName,
      customerPhone: state.customerPhone,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // 1. Save immediately to localStorage for instant lookup & manage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('thecut_customer_appointments_v3');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newAppointmentPayload);
        localStorage.setItem('thecut_customer_appointments_v3', JSON.stringify(list));
      } catch (e) {
        console.error('Storage error', e);
      }
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointmentPayload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.appointmentId && typeof window !== 'undefined') {
          // Update id in localStorage if backend returned specific id
          const stored = localStorage.getItem('thecut_customer_appointments_v3');
          if (stored) {
            const list = JSON.parse(stored);
            if (list[0]) {
              list[0].id = data.appointmentId;
              localStorage.setItem('thecut_customer_appointments_v3', JSON.stringify(list));
            }
          }
        }
      }
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
      goToStep(6);
    }
  }, [state, goToStep]);

  const visibleSteps = isSoloBarber ? STEPS.filter((s) => s.id !== 3) : STEPS;
  const currentVisibleIdx = visibleSteps.findIndex((s) => s.id === state.step);
  const activeIdx = currentVisibleIdx >= 0 ? currentVisibleIdx : 0;
  const progressRatio = visibleSteps.length > 1 ? activeIdx / (visibleSteps.length - 1) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#E5DDD0] -z-10" />
        <div
          className="absolute top-5 right-5 h-0.5 bg-[#C9A84C] -z-10 transition-all duration-500 ease-out"
          style={{ width: `calc(${progressRatio * 100}% - 2.5rem)` }}
        />

        {visibleSteps.map((step, idx) => {
          const isCompleted = state.step > step.id;
          const isActive = state.step === step.id;
          return (
            <button
              key={step.id}
              onClick={() => isCompleted ? goToStep(step.id) : undefined}
              disabled={!isCompleted}
              className="flex flex-col items-center gap-1.5 group"
              aria-label={`שלב ${idx + 1}: ${step.label}${isCompleted ? ' (הושלם)' : isActive ? ' (פעיל)' : ''}`}
            >
              <div
                className={`step-indicator ${
                  isCompleted ? 'completed cursor-pointer' :
                  isActive ? 'active' : 'inactive'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold transition-colors ${
                isActive ? 'text-gold' : isCompleted ? 'text-[#3D3D3D]' : 'text-[#9E9891]'
              }`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={state.step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {state.step === 1 && (
              <BranchStep
                selectedBranch={state.selectedBranch}
                onSelectBranch={(branch: Branch) => {
                  setState((prev) => ({ ...prev, selectedBranch: branch }));
                  setPendingStep(2);
                }}
              />
            )}

            {state.step === 2 && (
              <ServiceStep
                selected={state.selectedService}
                onSelect={(service: Service) => {
                  setState((prev) => ({
                    ...prev,
                    selectedService: service,
                    selectedBarber: isSoloBarber && activeBarbers[0] ? activeBarbers[0] : prev.selectedBarber,
                  }));
                  setPendingStep(isSoloBarber ? 4 : 3);
                }}
              />
            )}

            {state.step === 3 && (
              <BarberStep
                selected={state.selectedBarber}
                onSelect={(barber: Barber) => {
                  setState((prev) => ({ ...prev, selectedBarber: barber }));
                  setPendingStep(4);
                }}
              />
            )}

            {state.step === 4 && (
              <DateTimeStep
                branch={state.selectedBranch}
                service={state.selectedService}
                barber={state.selectedBarber}
                selectedDate={state.selectedDate}
                selectedTime={state.selectedTime}
                onDateSelect={(date: Date) => setState((prev) => ({ ...prev, selectedDate: date }))}
                onTimeSelect={(time: string) => {
                  setState((prev) => ({ ...prev, selectedTime: time }));
                  setPendingStep(5);
                }}
              />
            )}

            {state.step === 5 && (
              <PersonalInfoStep
                name={state.customerName}
                phone={state.customerPhone}
                onNameChange={(name) => setState((prev) => ({ ...prev, customerName: name }))}
                onPhoneChange={(phone) => setState((prev) => ({ ...prev, customerPhone: phone }))}
              />
            )}

            {state.step === 6 && (
              <ConfirmationStep booking={state} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons (Steps 1–5) */}
      {state.step < 6 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5DDD0]">
          {state.step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 text-sm font-bold text-[#6B6560] hover:text-[#1C1C1C] transition-colors py-2.5 px-4 rounded-xl hover:bg-[#FAF7F2] active:scale-95"
              id="wizard-back-button"
            >
              <ChevronRight className="w-4 h-4" />
              חזור
            </button>
          ) : <div />}

          {state.step < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn-shimmer flex items-center gap-1.5 text-sm font-bold text-[#1C1C1C] py-2.5 px-6 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md"
              id="wizard-next-button"
            >
              המשך
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="btn-shimmer flex items-center gap-2 text-sm font-black text-[#1C1C1C] py-3 px-8 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-gold"
              id="wizard-submit-button"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#1C1C1C]/30 border-t-[#1C1C1C] rounded-full animate-spin" />
                  מאשר תור...
                </>
              ) : (
                'אשר ושריין תור ✓'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
