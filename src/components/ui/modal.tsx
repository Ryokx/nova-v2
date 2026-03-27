"use client";

/**
 * Composant Modal — Fenêtre modale (dialog) avec fond semi-transparent.
 * Se ferme avec Escape, clic sur le fond, ou le bouton X.
 * Bloque le scroll de la page quand elle est ouverte.
 */

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  /** Contrôle l'ouverture/fermeture de la modale */
  open: boolean;
  /** Fonction appelée pour fermer la modale */
  onClose: () => void;
  /** Titre affiché dans l'en-tête (optionnel) */
  title?: string;
  /** Contenu de la modale */
  children: ReactNode;
  /** Largeur maximale de la modale (par défaut : "md") */
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Classes CSS de largeur pour chaque taille */
const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, children, size = "md", className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /** Ferme la modale quand on appuie sur Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  // Ajoute/retire les écouteurs clavier et bloque le scroll du body
  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      contentRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  // Ne rend rien si la modale est fermée
  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Ferme la modale si on clique sur le fond (pas sur le contenu)
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Fond semi-transparent avec flou */}
      <div className="absolute inset-0 bg-navy/30 backdrop-blur-sm animate-fadeIn" />

      {/* Contenu de la modale */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className={cn(
          "relative w-full bg-white rounded-xl shadow-lg border border-border animate-slideUp",
          sizeStyles[size],
          className,
        )}
      >
        {/* En-tête avec titre et bouton fermer */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 id="modal-title" className="font-heading text-lg font-bold text-navy">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-grayText hover:text-navy hover:bg-surface transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Corps de la modale */}
        <div className="px-6 py-5">{children}</div>

        {/* Bouton fermer flottant quand il n'y a pas de titre */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-grayText hover:text-navy hover:bg-surface transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
