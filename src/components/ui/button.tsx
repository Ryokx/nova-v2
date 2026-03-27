"use client";

/**
 * Composant Button — Bouton réutilisable avec variantes et tailles.
 * Supporte un état de chargement (spinner) et la désactivation.
 */

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Variantes visuelles disponibles pour le bouton */
type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";

/** Tailles disponibles pour le bouton */
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Style visuel du bouton (par défaut : "primary") */
  variant?: ButtonVariant;
  /** Taille du bouton (par défaut : "md") */
  size?: ButtonSize;
  /** Affiche un spinner et désactive le bouton si true */
  loading?: boolean;
}

/** Classes CSS pour chaque variante */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-deepForest to-forest text-white shadow-lg hover:shadow-xl",
  secondary:
    "bg-surface text-forest border border-border hover:bg-border",
  outline:
    "bg-transparent text-navy border border-border hover:bg-surface",
  danger:
    "bg-red/10 text-red border border-red/20 hover:bg-red/20",
  ghost:
    "bg-transparent text-grayText hover:bg-surface hover:text-navy",
};

/** Classes CSS pour chaque taille */
const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-sm",
  md: "px-6 py-3 text-sm rounded-[5px]",
  lg: "px-8 py-4 text-base rounded-[5px]",
};

/**
 * Bouton principal de l'application.
 * Utilise forwardRef pour permettre l'accès au DOM depuis un composant parent.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Styles de base : flexbox, police, transitions
          "inline-flex items-center justify-center gap-2 font-bold font-heading transition-all duration-200",
          // Animation au survol et au clic
          "hover:-translate-y-0.5 active:translate-y-0",
          // Style du focus pour l'accessibilité
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
          // Style désactivé
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Spinner SVG affiché pendant le chargement */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
