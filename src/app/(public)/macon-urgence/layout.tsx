/**
 * Layout SEO pour la page urgence Maçon — /macon-urgence
 *
 * Métadonnées optimisées pour le référencement + données structurées JSON-LD.
 */
import type { Metadata } from "next";
import { trades } from "@/lib/trades";
import { TradeUrgencyJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Maçon urgence 24h/24 | Nova — Fissure, effondrement, intervention rapide",
  description:
    "Fissure structurelle, effondrement, mur fragilisé ? Maçon certifié en urgence pour sécuriser votre bâtiment. Intervention rapide, devis sur place, paiement sécurisé par séquestre Nova. Demandez un artisan maintenant.",
  openGraph: {
    title: "Maçon urgence 24h/24 | Nova",
    description:
      "Fissure structurelle, effondrement ? Maçon certifié en urgence pour sécuriser votre bâtiment. Paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/macon-urgence",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maçon urgence 24h/24 | Nova",
    description: "Problème structurel ? Maçon certifié en urgence, paiement sécurisé par séquestre Nova.",
  },
  alternates: {
    canonical: "https://nova.fr/macon-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TradeUrgencyJsonLd trade={trades.macon!} />
      {children}
    </>
  );
}
