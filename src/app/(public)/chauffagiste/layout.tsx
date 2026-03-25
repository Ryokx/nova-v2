import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Chauffagiste certifié | Nova — Chaudière, pompe à chaleur, dépannage",
  description:
    "Trouvez un chauffagiste certifié RGE. Dépannage chaudière, installation pompe à chaleur, entretien annuel. Paiement sécurisé par séquestre Nova.",
  openGraph: {
    title: "Chauffagiste certifié | Nova",
    description:
      "Trouvez un chauffagiste certifié RGE. Dépannage chaudière, installation pompe à chaleur, entretien annuel. Paiement sécurisé par séquestre Nova.",
    type: "website",
    url: "https://nova.fr/chauffagiste",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
