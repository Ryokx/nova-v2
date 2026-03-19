"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (msg: string, t?: ToastType) => void; // eslint-disable-line no-unused-vars
}

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-success" />,
  error: <AlertCircle className="w-5 h-5 text-red" />,
  warning: <AlertTriangle className="w-5 h-5 text-gold" />,
  info: <Info className="w-5 h-5 text-forest" />,
};

const bgMap: Record<ToastType, string> = {
  success: "border-success/20 bg-success/5",
  error: "border-red/20 bg-red/5",
  warning: "border-gold/20 bg-gold/5",
  info: "border-forest/20 bg-forest/5",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md animate-slideUp",
              "bg-white min-w-[300px] max-w-[420px]",
              bgMap[t.type],
            )}
            role="alert"
          >
            {iconMap[t.type]}
            <span className="flex-1 text-sm font-medium text-navy">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-grayText hover:text-navy transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
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
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
