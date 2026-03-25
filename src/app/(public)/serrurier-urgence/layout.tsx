import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serrurier urgence 24h/24 | Nova — Intervention en moins de 2h",
  description:
    "Porte claquée, serrure cassée ? Serrurier certifié en urgence, disponible 24h/24. Intervention en moins de 2h, paiement sécurisé par séquestre Nova.",
  openGraph: {
    title: "Serrurier urgence 24h/24 | Nova",
    description:
      "Porte claquée, serrure cassée ? Serrurier certifié en urgence, disponible 24h/24. Intervention en moins de 2h, paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/serrurier-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
