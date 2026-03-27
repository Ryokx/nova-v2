/**
 * Composant EmptyState — Affiché quand une liste ou section est vide.
 * Exemple : "Aucune mission en cours", "Pas encore de paiement".
 * Peut contenir une icône, un titre, une description et un bouton d'action.
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Icône affichée au-dessus du titre (optionnel) */
  icon?: ReactNode;
  /** Titre principal du message */
  title: string;
  /** Description complémentaire (optionnel) */
  description?: string;
  /** Bouton ou lien d'action (optionnel) */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      {/* Icône dans un conteneur arrondi */}
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
          {icon}
        </div>
      )}

      <h3 className="font-heading text-lg font-bold text-navy mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-grayText max-w-sm leading-relaxed">{description}</p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
