/**
 * Composant Badge — Étiquette colorée pour afficher un statut ou une catégorie.
 * Exemples : "En cours" (success), "Urgent" (danger), "Info" (info).
 */

import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Variantes visuelles du badge */
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Couleur/style du badge (par défaut : "default") */
  variant?: BadgeVariant;
}

/** Classes CSS associées à chaque variante */
const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface text-forest",
  success: "bg-success/15 text-success",
  warning: "bg-gold/15 text-gold",
  danger: "bg-red/10 text-red",
  info: "bg-forest/10 text-forest",
};

/** Badge inline avec coins arrondis et texte en gras */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge, type BadgeProps, type BadgeVariant };
