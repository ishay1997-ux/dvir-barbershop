'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  showConfirm: (options: ConfirmDialogOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const showToast = useCallback(({ type, title, message, duration = 3500 }: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showConfirm = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  }, []);

  const handleConfirm = async () => {
    if (!confirmDialog) return;
    setIsConfirmLoading(true);
    try {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Close confirm dialog on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmDialog && !isConfirmLoading) {
        setConfirmDialog(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog, isConfirmLoading]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, showConfirm }}>
      {children}

      {/* Floating Stacked Toasts Container (RTL Top-Center) */}
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999999] flex flex-col gap-2.5 max-w-md w-[94vw] sm:w-full pointer-events-none"
        dir="rtl"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            let borderClass = 'border-emerald-500/40 text-emerald-400';
            let bgGlow = 'bg-emerald-500/10';
            let Icon = CheckCircle2;

            if (toast.type === 'error') {
              borderClass = 'border-red-500/40 text-red-400';
              bgGlow = 'bg-red-500/10';
              Icon = AlertCircle;
            } else if (toast.type === 'warning') {
              borderClass = 'border-amber-500/40 text-amber-400';
              bgGlow = 'bg-amber-500/10';
              Icon = AlertTriangle;
            } else if (toast.type === 'info') {
              borderClass = 'border-[#C9A84C]/40 text-[#C9A84C]';
              bgGlow = 'bg-[#C9A84C]/10';
              Icon = Sparkles;
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl bg-[#18181B]/95 text-white ${borderClass}`}
              >
                <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 border ${borderClass} ${bgGlow}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 text-right min-w-0">
                  <h4 className="text-sm font-black text-white leading-snug">{toast.title}</h4>
                  {toast.message && (
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed font-sans">{toast.message}</p>
                  )}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
                  aria-label="סגור התראה"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Luxury Custom Confirm Dialog Modal */}
      <AnimatePresence>
        {confirmDialog && (
          <div
            className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            dir="rtl"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => !isConfirmLoading && setConfirmDialog(null)}
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative max-w-md w-full bg-[#1C1C1E] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-center text-white"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby="confirm-desc"
            >
              {/* Top Icon Badge */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
                  confirmDialog.type === 'danger'
                    ? 'bg-red-500/15 text-red-400 border-red-500/30'
                    : 'bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30'
                }`}
              >
                {confirmDialog.type === 'danger' ? (
                  <AlertCircle className="w-7 h-7" />
                ) : (
                  <AlertTriangle className="w-7 h-7" />
                )}
              </div>

              {/* Title & Message */}
              <h3 id="confirm-title" className="text-lg sm:text-xl font-black text-white mb-2">
                {confirmDialog.title}
              </h3>
              <p id="confirm-desc" className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed font-sans">
                {confirmDialog.message}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isConfirmLoading}
                  onClick={handleConfirm}
                  className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${
                    confirmDialog.type === 'danger'
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
                      : 'bg-[#C9A84C] hover:bg-[#DFCA85] text-black shadow-[#C9A84C]/20'
                  }`}
                >
                  {isConfirmLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>מבצע פעולה...</span>
                    </>
                  ) : (
                    confirmDialog.confirmText || 'אישור'
                  )}
                </button>

                <button
                  type="button"
                  disabled={isConfirmLoading}
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer border border-white/10"
                >
                  {confirmDialog.cancelText || 'ביטול'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
