/**
 * Layout SEO pour la page urgence Chauffagiste — /chauffagiste-urgence
 *
 * Métadonnées optimisées pour le référencement + données structurées JSON-LD.
 */
import type { Metadata } from "next";
import { trades } from "@/lib/trades";
import { TradeUrgencyJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Chauffagiste urgence 24h/24 | Nova — Panne chaudière, intervention < 2h",
  description:
    "Panne de chaudière, fuite de gaz, radiateur froid ? Chauffagiste certifié en urgence 24h/24. Intervention en moins de 2h, devis sur place, paiement sécurisé par séquestre Nova. Demandez un artisan maintenant.",
  openGraph: {
    title: "Chauffagiste urgence 24h/24 | Nova",
    description:
      "Panne de chaudière, fuite de gaz ? Chauffagiste certifié en urgence 24h/24. Intervention en moins de 2h. Paiement sécurisé Nova.",
    type: "website",
    url: "https://nova.fr/chauffagiste-urgence",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chauffagiste urgence 24h/24 | Nova",
    description: "Panne de chauffage ? Chauffagiste certifié en < 2h, paiement sécurisé par séquestre Nova.",
  },
  alternates: {
    canonical: "https://nova.fr/chauffagiste-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TradeUrgencyJsonLd trade={trades.chauffagiste!} />
      {children}
    </>
  );
}
