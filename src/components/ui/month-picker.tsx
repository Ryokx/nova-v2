"use client";

/**
 * Composant MonthPicker — Sélecteur de mois/année sous forme de dropdown.
 * Utilisé dans les pages de comptabilité et paiements pour filtrer par période.
 */

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/** Noms complets des mois (pour l'affichage du bouton) */
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

/** Noms abrégés des mois (pour la grille de sélection) */
const SHORT_MONTHS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
];

interface MonthPickerProps {
  /** Mois sélectionné (0 = Janvier, 11 = Décembre) */
  month: number;
  /** Année sélectionnée */
  year: number;
  /** Callback appelé quand l'utilisateur sélectionne un mois */
  onChange: (month: number, year: number) => void;
}

export function MonthPicker({ month, year, onChange }: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year); // Année affichée dans le dropdown (peut être différente de l'année sélectionnée)
  const ref = useRef<HTMLDivElement>(null);

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Réinitialise l'année affichée quand le dropdown s'ouvre ou que l'année change
  useEffect(() => {
    setViewYear(year);
  }, [year, open]);

  /** Texte affiché sur le bouton (ex: "Mars 2026") */
  const label = `${MONTHS[month]} ${year}`;

  const now = new Date();
  /** Vérifie si un mois est le mois en cours */
  const isCurrentMonth = (m: number) => m === now.getMonth() && viewYear === now.getFullYear();
  /** Vérifie si un mois est celui actuellement sélectionné */
  const isSelected = (m: number) => m === month && viewYear === year;

  return (
    <div className="relative" ref={ref}>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-[5px] text-sm font-semibold border transition-colors cursor-pointer",
          open
            ? "bg-forest/[0.05] border-forest/20 text-forest"
            : "bg-white border-border text-navy hover:border-navy/20"
        )}
      >
        <Calendar className="w-4 h-4" />
        {label}
        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-90")} />
      </button>

      {/* Dropdown de sélection */}
      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-[280px] bg-white rounded-[5px] border border-border shadow-lg z-50 overflow-hidden">
          {/* Navigation par année (boutons < et >) */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <button
              onClick={() => setViewYear(viewYear - 1)}
              className="w-7 h-7 rounded-[5px] border border-border flex items-center justify-center hover:bg-surface transition-colors cursor-pointer bg-white"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-navy" />
            </button>
            <span className="text-sm font-bold text-navy">{viewYear}</span>
            <button
              onClick={() => setViewYear(viewYear + 1)}
              className="w-7 h-7 rounded-[5px] border border-border flex items-center justify-center hover:bg-surface transition-colors cursor-pointer bg-white"
            >
              <ChevronRight className="w-3.5 h-3.5 text-navy" />
            </button>
          </div>

          {/* Grille de 12 mois (3 colonnes x 4 lignes) */}
          <div className="grid grid-cols-3 gap-1.5 p-3">
            {SHORT_MONTHS.map((m, i) => (
              <button
                key={m}
                onClick={() => {
                  onChange(i, viewYear);
                  setOpen(false);
                }}
                className={cn(
                  "py-2 rounded-[5px] text-[13px] font-medium transition-colors cursor-pointer border-none",
                  isSelected(i)
                    ? "bg-forest text-white font-semibold"
                    : isCurrentMonth(i)
                      ? "bg-forest/[0.06] text-forest font-semibold"
                      : "text-navy hover:bg-surface bg-transparent"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
