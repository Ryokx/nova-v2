/**
 * Layout SEO pour la page métier Plombier — /plombier
 *
 * Définit les métadonnées (title, description, OpenGraph) pour le référencement.
 * Le composant ne fait que passer les enfants sans wrapper supplémentaire.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plombier certifié | Nova — Dépannage, fuite, installation plomberie",
  description:
    "Trouvez un plombier certifié près de chez vous. Fuite d'eau, débouchage, chauffe-eau. Paiement sécurisé par séquestre. Intervention rapide 24h/24.",
  openGraph: {
    title: "Plombier certifié | Nova",
    description:
      "Trouvez un plombier certifié près de chez vous. Fuite d'eau, débouchage, chauffe-eau. Paiement sécurisé par séquestre. Intervention rapide 24h/24.",
    type: "website",
    url: "https://nova.fr/plombier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
