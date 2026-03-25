import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maçon urgence | Nova — Intervention rapide",
  description:
    "Fissure structurelle, effondrement ? Maçon certifié en urgence pour sécuriser votre bâtiment. Paiement sécurisé par séquestre Nova.",
  openGraph: {
    title: "Maçon urgence | Nova",
    description:
      "Fissure structurelle, effondrement ? Maçon certifié en urgence pour sécuriser votre bâtiment. Paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/macon-urgence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
