/**
 * Layout SEO pour la page urgence Électricien — /electricien-urgence
 *
 * Métadonnées optimisées pour le référencement + données structurées JSON-LD.
 */
import type { Metadata } from "next";
import { trades } from "@/lib/trades";
import { TradeUrgencyJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Électricien urgence 24h/24 | Nova — Panne, court-circuit, intervention < 2h",
  description:
    "Panne de courant, court-circuit, odeur de brûlé ? Électricien certifié en urgence 24h/24 près de chez vous. Intervention en moins de 2h, devis sur place, paiement sécurisé par séquestre. Demandez un artisan maintenant.",
  openGraph: {
    title: "Électricien urgence 24h/24 | Nova",
    description:
      "Panne de courant, court-circuit ? Électricien certifié en urgence 24h/24. Intervention en moins de 2h. Paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/electricien-urgence",
  },
  twitter: {
    card: "summary_large_image",
    title: "Électricien urgence 24h/24 | Nova",
    description: "Panne électrique ? Électricien certifié en < 2h, paiement sécurisé par séquestre Nova.",
  },
  alternates: {
    canonical: "https://nova.fr/electricien-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TradeUrgencyJsonLd trade={trades.electricien!} />
      {children}
    </>
  );
}
