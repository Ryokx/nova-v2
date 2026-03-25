import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peintre certifié | Nova — Peinture intérieure, extérieure, enduits",
  description:
    "Trouvez un peintre certifié près de chez vous. Peinture intérieure, extérieure, enduits décoratifs. Devis sur place, paiement sécurisé par séquestre.",
  openGraph: {
    title: "Peintre certifié | Nova",
    description:
      "Trouvez un peintre certifié près de chez vous. Peinture intérieure, extérieure, enduits décoratifs. Devis sur place, paiement sécurisé par séquestre.",
    type: "website",
    url: "https://nova.fr/peintre",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
