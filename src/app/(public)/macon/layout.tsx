import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maçon certifié | Nova — Construction, rénovation, terrasses",
  description:
    "Trouvez un maçon certifié. Construction murs, terrasses, fondations, rénovation. Devis détaillé sur place, paiement sécurisé par séquestre Nova.",
  openGraph: {
    title: "Maçon certifié | Nova",
    description:
      "Trouvez un maçon certifié. Construction murs, terrasses, fondations, rénovation. Devis détaillé sur place, paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/macon",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
