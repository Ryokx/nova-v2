/**
 * Layout du portail client.
 * Enveloppe toutes les pages sous /(client)/.
 * Définit le template de titre pour le SEO (ex: "Dashboard | Nova").
 */

import type { Metadata } from "next";

/* Métadonnées SEO : le titre de chaque page enfant sera formaté "Titre | Nova" */
export const metadata: Metadata = {
  title: {
    template: "%s | Nova",
    default: "Espace Client | Nova",
  },
};

/* Layout simple qui affiche les enfants sans wrapper supplémentaire */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
