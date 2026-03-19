"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const clientLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/artisans", label: "Artisans" },
  { href: "/missions", label: "Missions" },
  { href: "/notifications", label: "Notifications" },
  { href: "/profile", label: "Profil" },
];

const artisanLinks = [
  { href: "/artisan-dashboard", label: "Dashboard" },
  { href: "/artisan-documents", label: "Documents" },
  { href: "/artisan-payments", label: "Paiements" },
  { href: "/artisan-notifications", label: "Notifications" },
  { href: "/artisan-profile", label: "Profil" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isArtisan = session?.user?.role === "ARTISAN";
  const links = session ? (isArtisan ? artisanLinks : clientLinks) : [];

  return (
    <>
      <nav className="sticky top-0 z-50 h-16 bg-white/88 backdrop-blur-xl border-b border-border/60 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={session ? (isArtisan ? "/artisan-dashboard" : "/dashboard") : "/"} className="relative flex items-center">
          <span className="font-heading text-[22px] font-extrabold text-navy tracking-tight">
            Nova
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-gold absolute -top-0.5 -right-2" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-body pb-1 border-b-2 transition-all duration-200",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "font-semibold text-navy border-forest"
                  : "font-normal text-grayText border-transparent hover:text-navy",
              )}
            >
              {link.label}
            </Link>
          ))}

          {!session ? (
            <div className="flex gap-2.5">
              <Link
                href="/login"
                className="px-5 py-2 rounded-[10px] bg-forest text-white text-[13px] font-semibold hover:-translate-y-0.5 transition-transform"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 rounded-[10px] border border-border text-navy text-[13px] font-semibold hover:-translate-y-0.5 transition-transform"
              >
                Inscription
              </Link>
            </div>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3.5 py-1.5 rounded-sm bg-red/5 text-red text-[11px] font-semibold hover:bg-red/10 transition-colors"
            >
              Déconnexion
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5 text-navy" /> : <Menu className="w-5 h-5 text-navy" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white/98 backdrop-blur-xl border-b border-border p-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-[10px] text-sm font-medium",
                  pathname === link.href
                    ? "bg-forest/5 text-forest font-bold"
                    : "text-navy hover:bg-surface",
                )}
              >
                {link.label}
              </Link>
            ))}
            {!session ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-[10px] bg-forest text-white text-sm font-semibold text-center mt-2"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-[10px] border border-border text-navy text-sm font-semibold text-center"
                >
                  Inscription
                </Link>
              </>
            ) : (
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                className="px-4 py-3 rounded-[10px] bg-red/5 text-red text-sm font-semibold text-center mt-2"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
