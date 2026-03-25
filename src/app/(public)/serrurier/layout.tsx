import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serrurier certifié | Nova — Ouverture de porte, dépannage serrurerie",
  description:
    "Trouvez un serrurier certifié près de chez vous. Ouverture de porte, changement de serrure, blindage. Paiement sécurisé par séquestre. Intervention rapide.",
  openGraph: {
    title: "Serrurier certifié | Nova",
    description:
      "Trouvez un serrurier certifié près de chez vous. Ouverture de porte, changement de serrure, blindage. Paiement sécurisé par séquestre. Intervention rapide.",
    type: "website",
    url: "https://nova.fr/serrurier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
