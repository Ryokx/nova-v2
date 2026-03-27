/**
 * Composant Avatar — Affiche la photo de profil ou les initiales de l'utilisateur.
 * Si une image (src) est fournie, elle est affichée. Sinon, les initiales sont calculées.
 */

import { type HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Nom complet (utilisé pour les initiales et l'attribut alt) */
  name: string;
  /** URL de la photo de profil (optionnel) */
  src?: string | null;
  /** Taille de l'avatar (par défaut : "md") */
  size?: "sm" | "md" | "lg";
}

/** Dimensions CSS pour chaque taille */
const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

/** Dimensions en pixels pour le composant Image de Next.js */
const sizePx = { sm: 32, md: 40, lg: 56 };

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, src, size = "md", className, ...props }, ref) => {
    const initials = getInitials(name);

    // Si une image est disponible, on affiche le composant Image optimisé de Next.js
    if (src) {
      return (
        <Image
          src={src}
          alt={name}
          width={sizePx[size]}
          height={sizePx[size]}
          className={cn(
            "rounded-full object-cover",
            sizeStyles[size],
            className,
          )}
        />
      );
    }

    // Sinon, on affiche un cercle avec les initiales sur fond dégradé vert
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full bg-gradient-to-br from-surface to-border flex items-center justify-center font-bold text-forest",
          sizeStyles[size],
          className,
        )}
        aria-label={name}
        {...props}
      >
        {initials}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar, type AvatarProps };
