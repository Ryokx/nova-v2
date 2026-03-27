/**
 * Layout SEO pour la page métier Électricien — /electricien
 *
 * Définit les métadonnées (title, description, OpenGraph) pour le référencement.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Électricien certifié | Nova — Dépannage, installation électrique",
  description:
    "Trouvez un électricien certifié près de chez vous. Panne, tableau électrique, prises. Travaux aux normes NF C 15-100. Paiement sécurisé par séquestre.",
  openGraph: {
    title: "Électricien certifié | Nova",
    description:
      "Trouvez un électricien certifié près de chez vous. Panne, tableau électrique, prises. Travaux aux normes NF C 15-100. Paiement sécurisé par séquestre.",
    type: "website",
    url: "https://nova.fr/electricien",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
