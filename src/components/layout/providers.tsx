"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastProvider } from "@/components/ui/toast";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/complete-profile", "/devenir-partenaire", "/comment-ca-marche", "/cgu", "/confidentialite", "/mentions-legales"];

function PhoneGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p) || pathname.startsWith("/api/");

  useEffect(() => {
    if (status === "authenticated" && session?.user && !session.user.hasPhone && !isPublic) {
      router.replace("/complete-profile");
    }
  }, [status, session, isPublic, router]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <PhoneGuard>{children}</PhoneGuard>
      </ToastProvider>
    </SessionProvider>
  );
}
