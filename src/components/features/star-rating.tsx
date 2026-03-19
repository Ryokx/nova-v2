"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (_v: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

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
