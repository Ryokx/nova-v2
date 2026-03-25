import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menuisier certifié | Nova — Portes, fenêtres, placards sur mesure",
  description:
    "Trouvez un menuisier certifié. Pose de portes, fenêtres, placards sur mesure, parquet. Devis sur place, paiement sécurisé par séquestre Nova.",
  openGraph: {
    title: "Menuisier certifié | Nova",
    description:
      "Trouvez un menuisier certifié. Pose de portes, fenêtres, placards sur mesure, parquet. Devis sur place, paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/menuisier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
