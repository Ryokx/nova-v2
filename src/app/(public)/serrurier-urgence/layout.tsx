/**
 * Layout SEO pour la page urgence Serrurier — /serrurier-urgence
 *
 * Métadonnées optimisées pour le référencement + données structurées JSON-LD.
 */
import type { Metadata } from "next";
import { trades } from "@/lib/trades";
import { TradeUrgencyJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Serrurier urgence 24h/24 Paris | Nova — Intervention en moins de 2h",
  description:
    "Porte claquée, serrure cassée ? Serrurier certifié en urgence 24h/24 près de chez vous. Intervention en moins de 2h, devis sur place, paiement sécurisé par séquestre. Demandez un artisan maintenant.",
  openGraph: {
    title: "Serrurier urgence 24h/24 | Nova",
    description:
      "Porte claquée, serrure cassée ? Serrurier certifié en urgence, disponible 24h/24. Intervention en moins de 2h, paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/serrurier-urgence",
  },
  twitter: {
    card: "summary_large_image",
    title: "Serrurier urgence 24h/24 | Nova",
    description: "Porte claquée ? Serrurier certifié en < 2h, paiement sécurisé par séquestre Nova.",
  },
  alternates: {
    canonical: "https://nova.fr/serrurier-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TradeUrgencyJsonLd trade={trades.serrurier!} />
      {children}
    </>
  );
}
