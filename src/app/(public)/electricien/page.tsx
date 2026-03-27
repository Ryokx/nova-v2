/**
 * Page métier Électricien — /electricien
 *
 * Landing page dédiée au métier d'électricien.
 * Utilise le composant générique TradeLanding avec les données du métier.
 */
"use client";

import { TradeLanding } from "@/components/features/trade-landing";
import { trades } from "@/lib/trades";

export default function Page() {
  return <TradeLanding trade={trades.electricien} />;
}
