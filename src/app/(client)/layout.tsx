import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Nova",
    default: "Espace Client | Nova",
  },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
