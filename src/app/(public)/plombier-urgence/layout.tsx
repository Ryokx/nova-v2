import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plombier urgence 24h/24 | Nova — Intervention en moins de 2h",
  description:
    "Fuite d'eau, canalisation bouchée ? Plombier certifié en urgence 24h/24. Intervention en moins de 2h, paiement sécurisé par séquestre Nova.",
  openGraph: {
    title: "Plombier urgence 24h/24 | Nova",
    description:
      "Fuite d'eau, canalisation bouchée ? Plombier certifié en urgence 24h/24. Intervention en moins de 2h, paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/plombier-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
