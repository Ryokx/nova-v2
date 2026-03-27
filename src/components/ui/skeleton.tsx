/**
 * Composant Skeleton — Placeholder animé affiché pendant le chargement.
 * Remplace visuellement un contenu en attente (texte, image, bloc).
 *
 * Variantes :
 * - "text" : ligne de texte (par défaut)
 * - "circular" : rond (avatar, icône)
 * - "rectangular" : rectangle (image, carte)
 */

import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Forme du skeleton */
  variant?: "text" | "circular" | "rectangular";
  /** Largeur personnalisée (ex: "200px", 200) */
  width?: string | number;
  /** Hauteur personnalisée (ex: "40px", 40) */
  height?: string | number;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        // Animation de shimmer (dégradé qui se déplace)
        "animate-shimmer bg-gradient-to-r from-border/40 via-border/80 to-border/40 bg-[length:200%_100%]",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-md",
        variant === "text" && "rounded h-4 w-full",
        className,
      )}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
