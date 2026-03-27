/**
 * Page métier Plombier — /plombier
 *
 * Landing page dédiée au métier de plombier.
 * Utilise le composant générique TradeLanding avec les données du métier.
 */
"use client";

import { TradeLanding } from "@/components/features/trade-landing";
import { trades } from "@/lib/trades";

export default function Page() {
  return <TradeLanding trade={trades.plombier} />;
}
