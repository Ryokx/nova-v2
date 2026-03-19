import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche | Nova — Trouvez un artisan certifié",
  description:
    "Trouvez un artisan certifié en 30 secondes. Paiement sécurisé par séquestre, artisans vérifiés (SIRET, décennale), satisfaction garantie.",
  openGraph: {
    title: "Comment ça marche | Nova",
    description: "Artisans certifiés, paiement sécurisé par séquestre, satisfaction garantie.",
    type: "website",
    url: "https://nova.fr/comment-ca-marche",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
