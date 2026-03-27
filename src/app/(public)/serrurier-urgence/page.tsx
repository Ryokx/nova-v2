/**
 * Page urgence Serrurier — /serrurier-urgence
 *
 * Landing page d'urgence pour le métier de serrurier.
 * Utilise le composant générique TradeUrgency avec les données du métier.
 */
import { TradeUrgency } from "@/components/features/trade-urgency";
import { trades } from "@/lib/trades";

export default function Page() {
  return <TradeUrgency trade={trades.serrurier!} />;
}
