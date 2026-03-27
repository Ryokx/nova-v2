/**
 * Layout SEO pour la page métier Carreleur — /carreleur
 *
 * Définit les métadonnées (title, description, OpenGraph) pour le référencement.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carreleur certifié | Nova — Carrelage sol, faïence, mosaïque",
  description:
    "Trouvez un carreleur certifié. Pose de carrelage sol et mur, faïence, mosaïque. Devis sur place, paiement sécurisé par séquestre Nova.",
  openGraph: {
    title: "Carreleur certifié | Nova",
    description:
      "Trouvez un carreleur certifié. Pose de carrelage sol et mur, faïence, mosaïque. Devis sur place, paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/carreleur",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
