/**
 * Configuration des polices Google Fonts
 *
 * - Manrope : titres (font-weight 700, 800)
 * - DM Sans : corps de texte (font-weight 400 à 700)
 * - DM Mono : données chiffrées (font-weight 500)
 *
 * Chaque police est exposée via une variable CSS (--font-heading, --font-body, --font-mono).
 * display: "swap" évite le flash de texte invisible au chargement.
 */

import { Manrope, DM_Sans, DM_Mono } from "next/font/google";

/** Police des titres */
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-heading",
  display: "swap",
});

/** Police du corps de texte */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Police monospace pour les chiffres */
export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
});
