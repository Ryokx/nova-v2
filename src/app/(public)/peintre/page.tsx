/**
 * Page métier Peintre — /peintre
 *
 * Landing page dédiée au métier de peintre.
 * Utilise le composant générique TradeLanding avec les données du métier.
 */
"use client";

import { TradeLanding } from "@/components/features/trade-landing";
import { trades } from "@/lib/trades";

export default function Page() {
  return <TradeLanding trade={trades.peintre} />;
}
