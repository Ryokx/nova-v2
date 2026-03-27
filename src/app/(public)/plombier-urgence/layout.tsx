/**
 * Layout SEO pour la page urgence Plombier — /plombier-urgence
 *
 * Métadonnées optimisées pour le référencement (title, description, OpenGraph, Twitter).
 * Inclut le composant TradeUrgencyJsonLd pour les données structurées Schema.org
 * (améliore la visibilité dans les résultats de recherche Google).
 */
import type { Metadata } from "next";
import { trades } from "@/lib/trades";
import { TradeUrgencyJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Plombier urgence 24h/24 | Fuite d'eau ? Nova intervient en < 2h",
  description:
    "Fuite d'eau, canalisation bouchée, dégât des eaux ? Plombier certifié en urgence 24h/24 près de chez vous. Intervention en moins de 2h, devis sur place, paiement sécurisé par séquestre. Demandez un artisan maintenant.",
  openGraph: {
    title: "Plombier urgence 24h/24 | Nova",
    description:
      "Fuite d'eau, canalisation bouchée ? Plombier certifié en urgence 24h/24. Intervention en moins de 2h, paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/plombier-urgence",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plombier urgence 24h/24 | Nova",
    description: "Fuite d'eau ? Plombier certifié en < 2h, paiement sécurisé par séquestre Nova.",
  },
  alternates: {
    canonical: "https://nova.fr/plombier-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Données structurées JSON-LD pour le SEO */}
      <TradeUrgencyJsonLd trade={trades.plombier!} />
      {children}
    </>
  );
}
