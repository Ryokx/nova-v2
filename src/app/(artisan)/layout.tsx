/**
 * Layout du portail artisan.
 * Définit les métadonnées SEO (titre dynamique) et englobe toutes les pages artisan.
 */
import type { Metadata } from "next";

/* Métadonnées : le titre de chaque sous-page remplace "%s" */
export const metadata: Metadata = {
  title: {
    template: "%s | Nova Artisan",
    default: "Espace Artisan | Nova",
  },
};

/* Layout wrapper — rend simplement les enfants sans UI additionnelle */
export default function ArtisanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
