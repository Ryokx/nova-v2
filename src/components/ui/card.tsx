/**
 * Composants Card — Carte conteneur avec en-tête, titre et contenu.
 * Utilisée partout dans l'app pour afficher des blocs d'information.
 */

import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Active l'effet de survol (élévation + ombre) si true */
  hover?: boolean;
}

/** Conteneur principal de la carte */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-xl border border-border shadow-sm p-6",
          hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

/** En-tête de la carte (marge basse pour séparer du contenu) */
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

/** Titre de la carte (h3, police Manrope bold) */
const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-heading text-lg font-bold text-navy", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

/** Zone de contenu de la carte */
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent, type CardProps };
