import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import clsx from "clsx";

export type ToastType = "success" | "warning" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type, title, message, duration = 4000 }: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, type, title, message, duration };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // max 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Notification Container in top right */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded-card border shadow-xl backdrop-blur-md animate-slideInRight transition-all",
              toast.type === "success" && "bg-surface/95 border-ok/40 text-ink shadow-ok/10",
              toast.type === "warning" && "bg-surface/95 border-sev-high/40 text-ink shadow-sev-high/10",
              toast.type === "error" && "bg-surface/95 border-sev-critical/40 text-ink shadow-sev-critical/10",
              toast.type === "info" && "bg-surface/95 border-accent/40 text-ink shadow-accent/10"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 size={18} className="text-ok" />}
              {toast.type === "warning" && <AlertTriangle size={18} className="text-sev-high" />}
              {toast.type === "error" && <XCircle size={18} className="text-sev-critical" />}
              {toast.type === "info" && <Info size={18} className="text-accent" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-muted mt-0.5 leading-snug break-words">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-chip text-muted hover:text-ink hover:bg-raised transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
