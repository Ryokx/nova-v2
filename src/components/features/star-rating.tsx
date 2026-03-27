"use client";

/**
 * StarRating — Composant d'évaluation par étoiles (1 à 5)
 *
 * Deux modes :
 * - Lecture seule (readonly=true) : affiche la note sans interaction
 * - Interactif (readonly=false) : permet de cliquer pour noter
 *
 * Tailles disponibles : sm, md, lg
 */

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ━━━ Types ━━━ */
interface StarRatingProps {
  value: number;                    // Note actuelle (1-5)
  onChange?: (_v: number) => void;  // Callback au clic (mode interactif)
  size?: "sm" | "md" | "lg";       // Taille des étoiles
  readonly?: boolean;               // Désactive les clics si true
}

/* Correspondance taille → classes CSS */
const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };

export function StarRating({ value, onChange, size = "md", readonly = false }: StarRatingProps) {
  return (
    <div className="inline-flex gap-0.5" role="group" aria-label={`Note: ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-transform",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default",
          )}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          {/* Étoile remplie si <= valeur, vide sinon */}
          <Star
            className={cn(
              sizes[size],
              star <= value ? "fill-gold text-gold" : "fill-none text-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}
