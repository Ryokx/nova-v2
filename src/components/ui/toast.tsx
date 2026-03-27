"use client";

/**
 * Système de notifications toast.
 *
 * - ToastProvider : enveloppe l'app et gère la pile de toasts
 * - useToast() : hook pour afficher un toast depuis n'importe quel composant
 *
 * Exemple d'utilisation :
 *   const { toast } = useToast();
 *   toast("Paiement validé !", "success");
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

/** Types de toast disponibles */
type ToastType = "success" | "error" | "warning" | "info";

/** Structure d'un toast dans la pile */
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/** Valeur exposée par le contexte */
interface ToastContextValue {
  toast: (msg: string, t?: ToastType) => void; // eslint-disable-line no-unused-vars
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Icône associée à chaque type de toast */
const iconMap: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-success" />,
  error: <AlertCircle className="w-5 h-5 text-red" />,
  warning: <AlertTriangle className="w-5 h-5 text-gold" />,
  info: <Info className="w-5 h-5 text-forest" />,
};

/** Couleurs de fond et bordure pour chaque type */
const bgMap: Record<ToastType, string> = {
  success: "border-success/20 bg-success/5",
  error: "border-red/20 bg-red/5",
  warning: "border-gold/20 bg-gold/5",
  info: "border-forest/20 bg-forest/5",
};

/** Durée d'affichage d'un toast en millisecondes */
const TOAST_DURATION_MS = 4000;

/**
 * Provider à placer à la racine de l'app.
 * Affiche les toasts en bas à droite de l'écran.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /** Ajoute un toast à la pile (il disparaît automatiquement après TOAST_DURATION_MS) */
  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  /** Supprime un toast manuellement (clic sur le X) */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Conteneur des toasts — position fixe en bas à droite */}
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

/**
 * Hook pour afficher un toast.
 * Doit être utilisé dans un composant enfant de ToastProvider.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
