import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chauffagiste urgence 24h/24 | Nova — Intervention en moins de 2h",
  description:
    "Panne de chaudière, fuite de gaz ? Chauffagiste certifié en urgence 24h/24. Intervention en moins de 2h. Paiement sécurisé Nova.",
  openGraph: {
    title: "Chauffagiste urgence 24h/24 | Nova",
    description:
      "Panne de chaudière, fuite de gaz ? Chauffagiste certifié en urgence 24h/24. Intervention en moins de 2h. Paiement sécurisé Nova.",
    type: "website",
    url: "https://nova.fr/chauffagiste-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
