/**
 * EscrowStepper — Stepper vertical pour visualiser les étapes du séquestre
 *
 * Affiche une liste d'étapes avec un indicateur visuel :
 * - Vert (check) : étape complétée
 * - Or (numéro) : étape en cours
 * - Gris (numéro) : étape à venir
 *
 * Utilisé dans le suivi de mission et le détail de paiement.
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ━━━ Types ━━━ */
interface Step {
  label: string;
  description?: string;
  time?: string;        // Horodatage facultatif (ex: "14h30")
}

interface EscrowStepperProps {
  steps: Step[];
  currentStep: number;  // Index de l'étape en cours (0-based)
}

export function EscrowStepper({ steps, currentStep }: EscrowStepperProps) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        /* Détermine l'état de chaque étape par rapport à l'étape courante */
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isPending = i > currentStep;

        return (
          <div key={i} className="flex gap-3">
            {/* Colonne gauche : cercle numéroté + ligne verticale */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  isCompleted && "bg-success text-white",
                  isCurrent && "bg-gold text-white",
                  isPending && "bg-border text-grayText",
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {/* Ligne de connexion (sauf pour la dernière étape) */}
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[24px]",
                    i < currentStep ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>

            {/* Colonne droite : label, description, horodatage */}
            <div className="pb-4 pt-0.5">
              <div
                className={cn(
                  "text-sm font-semibold",
                  isCompleted && "text-success",
                  isCurrent && "text-gold",
                  isPending && "text-grayText",
                )}
              >
                {step.label}
              </div>
              {step.description && (
                <div className="text-xs text-grayText mt-0.5">{step.description}</div>
              )}
              {step.time && (
                <div className="text-[10px] font-mono text-grayText/70 mt-0.5">{step.time}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
