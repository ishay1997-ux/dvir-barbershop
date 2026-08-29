'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles, AlertTriangle } from 'lucide-react';

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

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, showConfirm }}>
      {children}

      {/* Floating Stacked Toasts Container (RTL Top-Center / Left) */}
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] flex flex-col gap-2.5 max-w-md w-[92vw] sm:w-full pointer-events-none"
        dir="rtl"
      >
        {toasts.map((toast) => {
          let bgClass = 'bg-[#1C1C1C] border-emerald-500/50 shadow-emerald-950/40 text-emerald-400';
          let Icon = CheckCircle2;

          if (toast.type === 'error') {
            bgClass = 'bg-[#1C1C1C] border-red-500/50 shadow-red-950/40 text-red-400';
            Icon = AlertCircle;
          } else if (toast.type === 'warning') {
            bgClass = 'bg-[#1C1C1C] border-amber-500/50 shadow-amber-950/40 text-amber-400';
            Icon = AlertTriangle;
          } else if (toast.type === 'info') {
            bgClass = 'bg-[#1C1C1C] border-[#C9A84C]/50 shadow-[#C9A84C]/20 text-[#C9A84C]';
            Icon = Sparkles;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border-2 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${bgClass}`}
            >
              <div className="p-1 rounded-xl bg-white/5 flex-shrink-0 mt-0.5">
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 text-right">
                <h4 className="text-sm font-black text-white">{toast.title}</h4>
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
            </div>
          );
        })}
      </div>

      {/* Luxury Confirm Dialog Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" dir="rtl">
          <div className="absolute inset-0" onClick={() => !isConfirmLoading && setConfirmDialog(null)} />
          <div className="relative max-w-sm w-full bg-[#1C1C1C] border-2 border-[#C9A84C]/40 rounded-3xl p-6 shadow-2xl z-10 text-center animate-in zoom-in-95">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              confirmDialog.type === 'danger' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30'
            }`}>
              {confirmDialog.type === 'danger' ? <AlertCircle className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>

            <h3 className="text-lg font-black text-white mb-1.5">{confirmDialog.title}</h3>
            <p className="text-xs text-zinc-300 mb-6 leading-relaxed font-sans">{confirmDialog.message}</p>

            <div className="flex gap-2.5">
              <button
                type="button"
                disabled={isConfirmLoading}
                onClick={handleConfirm}
                className={`flex-1 py-3 rounded-xl font-black text-xs transition-all cursor-pointer shadow-lg disabled:opacity-50 ${
                  confirmDialog.type === 'danger'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-[#C9A84C] hover:bg-[#DFCA85] text-black'
                }`}
              >
                {isConfirmLoading ? 'מבצע פעולה...' : confirmDialog.confirmText || 'אישור'}
              </button>

              <button
                type="button"
                disabled={isConfirmLoading}
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {confirmDialog.cancelText || 'ביטול'}
              </button>
            </div>
          </div>
        </div>
      )}
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
