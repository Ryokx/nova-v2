/**
 * Fonctions utilitaires générales
 * - Fusion de classes CSS
 * - Formatage de noms et de prix
 */

import { clsx, type ClassValue } from "clsx";

/** Fusionne des classes CSS conditionnelles (wrapper autour de clsx) */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Extrait les initiales d'un nom (ex: "Jean Dupont" → "JD") */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Formate un montant en euros (ex: 1500 → "1 500,00 €") */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
