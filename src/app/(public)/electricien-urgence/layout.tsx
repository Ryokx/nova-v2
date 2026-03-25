import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Électricien urgence 24h/24 | Nova — Intervention en moins de 2h",
  description:
    "Panne de courant, court-circuit ? Électricien certifié en urgence 24h/24. Intervention en moins de 2h. Paiement sécurisé par séquestre Nova.",
  openGraph: {
    title: "Électricien urgence 24h/24 | Nova",
    description:
      "Panne de courant, court-circuit ? Électricien certifié en urgence 24h/24. Intervention en moins de 2h. Paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/electricien-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
