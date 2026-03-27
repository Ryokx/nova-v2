"use client";

/**
 * Composant Providers — Enveloppe l'application avec les providers nécessaires.
 *
 * Chaîne de providers :
 * 1. SessionProvider (NextAuth) : gère l'état d'authentification
 * 2. ToastProvider : système de notifications toast
 * 3. PhoneGuard : redirige vers /complete-profile si le téléphone n'est pas renseigné
 */

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastProvider } from "@/components/ui/toast";

/** Chemins accessibles sans numéro de téléphone */
const PUBLIC_PATHS = ["/", "/login", "/signup", "/complete-profile", "/devenir-partenaire", "/comment-ca-marche", "/cgu", "/confidentialite", "/mentions-legales"];

/**
 * PhoneGuard — Redirige les utilisateurs connectés qui n'ont pas renseigné leur téléphone.
 * Ne s'applique pas sur les pages publiques ni les routes API.
 */
function PhoneGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p) || pathname.startsWith("/api/");

  useEffect(() => {
    // Si connecté mais sans téléphone, et pas sur une page publique → redirection
    if (status === "authenticated" && session?.user && !session.user.hasPhone && !isPublic) {
      router.replace("/complete-profile");
    }
  }, [status, session, isPublic, router]);

  return <>{children}</>;
}

/**
 * Provider racine de l'application.
 * À placer dans le layout principal (app/layout.tsx).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <PhoneGuard>{children}</PhoneGuard>
      </ToastProvider>
    </SessionProvider>
  );
}
