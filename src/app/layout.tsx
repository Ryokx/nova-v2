import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Nova — Artisans certifiés, paiement sécurisé",
  description:
    "Trouvez des artisans certifiés près de chez vous. Paiement sécurisé par séquestre : l'artisan n'est payé qu'après validation de l'intervention.",
  keywords: ["artisan", "certifié", "séquestre", "paiement sécurisé", "rénovation", "plombier", "électricien"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-bgPage font-body text-navy antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
