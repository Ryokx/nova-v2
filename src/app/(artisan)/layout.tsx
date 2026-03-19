import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Nova Artisan",
    default: "Espace Artisan | Nova",
  },
};

export default function ArtisanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
