/**
 * Layout du portail administrateur.
 * Définit les métadonnées SEO et empêche l'indexation (robots noindex/nofollow).
 */
import type { Metadata } from "next";

/* Métadonnées : page admin non indexable par les moteurs de recherche */
export const metadata: Metadata = {
  title: "Administration | Nova",
  robots: { index: false, follow: false },
};

/* Layout wrapper — rend simplement les enfants */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
