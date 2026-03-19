import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir partenaire artisan | Nova — 0% d'impayés, paiement garanti",
  description:
    "Rejoignez Nova : paiement garanti par séquestre, 0% d'impayés, gestion complète (devis, factures, planning). Inscription gratuite, sans engagement.",
  openGraph: {
    title: "Devenir partenaire artisan | Nova",
    description: "Zéro impayé. Vos clients paient avant. Paiement sous 48h garanti.",
    type: "website",
    url: "https://nova.fr/devenir-partenaire",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
