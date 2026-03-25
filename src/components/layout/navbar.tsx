"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu, X, LayoutDashboard, FileText, CreditCard, Megaphone,
  Globe, UserCircle, Calculator, ChevronDown, Wrench, Search,
  Shield, ClipboardList, Bell, Heart, LogOut, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const clientLinks = [
  { href: "/artisans", label: "Artisans", icon: Search },
  { href: "/missions", label: "Missions", icon: ClipboardList },
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profil", icon: UserCircle },
];

const artisanMainLinks = [
  { href: "/artisan-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/artisan-documents", label: "Documents", icon: FileText },
  { href: "/artisan-payments", label: "Paiements", icon: CreditCard },
  { href: "/artisan-compta", label: "Comptabilité", icon: Calculator },
  { href: "/artisan-notifications", label: "Notifications", icon: Bell },
];

const artisanMoreLinks = [
  { href: "/artisan-communication", label: "Communication", icon: Megaphone },
  { href: "/artisan-website", label: "Mon site", icon: Globe },
  { href: "/artisan-clients", label: "Clients", icon: Heart },
  { href: "/artisan-profile", label: "Profil", icon: UserCircle },
];

const artisanLinks = [...artisanMainLinks, ...artisanMoreLinks];

const PUBLIC_PATHS = [
  "/", "/login", "/signup", "/comment-ca-marche", "/devenir-partenaire", "/support", "/cgu", "/confidentialite", "/mentions-legales", "/reset-password", "/complete-profile",
  // SEO trade landing pages
  "/serrurier", "/plombier", "/electricien", "/chauffagiste", "/peintre", "/menuisier", "/carreleur", "/macon",
  // SEO urgency landing pages
  "/serrurier-urgence", "/plombier-urgence", "/electricien-urgence", "/chauffagiste-urgence", "/macon-urgence",
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Hide navbar on urgency pages (full-screen immersive experience)
  if (pathname.includes("-urgence")) return null;
  const moreRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isArtisan = session?.user?.role === "ARTISAN";

  // On public paths, show the public navbar immediately (even during loading)
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p);

  const publicLinks = [
    { href: "/artisans", label: "Trouver un artisan", icon: Search },
    { href: "/comment-ca-marche", label: "Comment ça marche", icon: Wrench },
  ];

  // Detect dark sections behind navbar (only for public/guest navbar)
  useEffect(() => {
    if (isAuthenticated) {
      setOnDark(false);
      return;
    }
    const darkSections = document.querySelectorAll("[data-navbar-dark]");
    if (!darkSections.length) {
      setOnDark(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const anyDark = entries.some((entry) => {
          if (!entry.isIntersecting) return false;
          const rect = entry.boundingClientRect;
          return rect.top < 72 && rect.bottom > 0;
        });
        setOnDark(anyDark);
      },
      {
        rootMargin: "0px 0px -95% 0px",
        threshold: [0, 0.01, 0.1],
      },
    );

    darkSections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) return;
    const checkDark = () => {
      const darkSections = document.querySelectorAll("[data-navbar-dark]");
      let isDark = false;
      darkSections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < 60 && rect.bottom > 20) {
          isDark = true;
        }
      });
      setOnDark(isDark);
    };

    window.addEventListener("scroll", checkDark, { passive: true });
    checkDark();
    return () => window.removeEventListener("scroll", checkDark);
  }, [pathname, isAuthenticated]);

  // Fetch unread notification count
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    fetch("/api/notifications")
      .then((r) => r.ok ? r.json() : [])
      .then((data: { read: boolean }[]) => {
        if (!cancelled) setUnreadCount(data.filter((n) => !n.read).length);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [isAuthenticated, pathname]);

  // Close "Plus" dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isMoreActive = isArtisan && artisanMoreLinks.some((l) => isLinkActive(l.href));

  // ━━━ Decision: which navbar to show ━━━
  // - Public path → always green navbar UNLESS genuinely authenticated with valid session
  // - Authenticated with valid session → white navbar
  // - Protected path + loading → white minimal navbar (skeleton)
  // - Protected path + unauthenticated → white minimal navbar (will redirect via middleware)

  const hasValidSession = isAuthenticated && !!session?.user?.email;
  const showPublicNavbar = isPublicPath
    ? !hasValidSession // On public paths: green navbar unless truly logged in
    : status === "unauthenticated";
  const showAuthNavbar = hasValidSession;
  const showMinimalNavbar = !showPublicNavbar && !showAuthNavbar; // loading on protected pages

  // ━━━ Minimal loading navbar (protected pages only) ━━━
  if (showMinimalNavbar) {
    return (
      <>
        <div className="h-14" />
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-border/60 shadow-sm px-5 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-deepForest to-forest flex items-center justify-center shadow-[0_2px_8px_rgba(10,64,48,0.25)]">
              <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-[18px] font-extrabold tracking-tight text-navy">Nova</span>
          </Link>
        </nav>
      </>
    );
  }

  // ━━━ Authenticated navbar: white, full-width, fixed ━━━
  if (showAuthNavbar) {
    return (
      <>
        <div className="h-[56px]" />

        <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-border/60 shadow-sm px-5 flex items-center justify-between">
          {/* Logo */}
          <Link
            href={isArtisan ? "/artisan-dashboard" : "/artisans"}
            className="relative flex items-center gap-2 mr-6 group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-deepForest to-forest flex items-center justify-center shadow-[0_2px_8px_rgba(10,64,48,0.25)]">
              <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-[18px] font-extrabold tracking-tight text-navy">
              Nova
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-gold absolute -top-0.5 right-[-6px]" />
          </Link>

          <div className="flex-1" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {(isArtisan ? artisanMainLinks : clientLinks).map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.href);
              const isNotif = link.href === "/notifications" || link.href === "/artisan-notifications";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer",
                    active
                      ? "text-forest font-semibold"
                      : "text-navy/60 hover:text-navy hover:bg-forest/[0.04]",
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                  {isNotif && unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red text-white text-[10px] font-bold leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                  {active && (
                    <span className="absolute -bottom-[5px] left-3 right-3 h-[2px] rounded-full bg-forest" />
                  )}
                </Link>
              );
            })}

            {/* "Plus" dropdown (artisan) */}
            {isArtisan && (
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={cn(
                    "relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer border-none bg-transparent",
                    isMoreActive || moreOpen
                      ? "text-forest font-semibold"
                      : "text-navy/60 hover:text-navy hover:bg-forest/[0.04]",
                  )}
                >
                  Plus
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", moreOpen && "rotate-180")} />
                  {isMoreActive && (
                    <span className="absolute -bottom-[5px] left-3 right-3 h-[2px] rounded-full bg-forest" />
                  )}
                </button>
                {moreOpen && (
                  <div className="absolute top-full left-0 mt-2.5 w-[220px] bg-white/95 backdrop-blur-2xl rounded-xl border border-border/60 shadow-lg z-50 py-1.5 overflow-hidden">
                    {artisanMoreLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isLinkActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 cursor-pointer",
                            active
                              ? "bg-forest/[0.06] text-forest font-semibold"
                              : "text-navy hover:bg-forest/[0.04]",
                          )}
                        >
                          <Icon className={cn("w-4 h-4", active ? "text-forest" : "text-navy/40")} />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Déconnexion */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="hidden md:flex items-center gap-1.5 ml-4 px-3.5 py-[7px] rounded-lg text-[12px] font-semibold text-red hover:text-red hover:bg-red/[0.05] active:scale-[0.97] transition-all duration-200 cursor-pointer border-none bg-transparent"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-forest/[0.04] active:scale-[0.95] transition-all cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen
              ? <X className="w-5 h-5 text-navy" />
              : <Menu className="w-5 h-5 text-navy" />
            }
          </button>
        </nav>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="fixed inset-x-0 top-14 bottom-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-navy/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative mx-4 mt-2 bg-white border border-border/60 rounded-2xl shadow-lg p-3 flex flex-col gap-0.5 motion-safe:animate-slideUp">
              {(isArtisan ? artisanLinks : clientLinks).map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href);
                const isNotif = link.href === "/notifications" || link.href === "/artisan-notifications";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer",
                      active
                        ? "bg-forest/[0.06] text-forest font-semibold"
                        : "text-navy hover:bg-forest/[0.04]",
                    )}
                  >
                    <Icon className={cn("w-4.5 h-4.5", active ? "text-forest" : "text-navy/40")} />
                    {link.label}
                    {isNotif && unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red text-white text-[10px] font-bold leading-none ml-auto">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="h-px bg-border/40 my-2" />

              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red text-sm font-medium hover:bg-red/[0.04] active:scale-[0.97] transition-all border-none cursor-pointer bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ━━━ Public/guest navbar: green gradient, floating, rounded ━━━
  return (
    <>
      <div className="h-[72px]" />

      <nav
        className={cn(
          "fixed top-3 left-4 right-4 z-50 mx-auto max-w-[1200px]",
          "h-12 rounded-2xl px-5 flex items-center justify-between",
          "border transition-all duration-300",
          onDark
            ? "bg-white/90 backdrop-blur-2xl border-white/60 shadow-lg"
            : "bg-gradient-to-r from-deepForest to-forest backdrop-blur-2xl border-white/[0.08] shadow-[0_4px_20px_rgba(10,64,48,0.25)]",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="relative flex items-center gap-2 mr-6 group"
        >
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300",
            onDark
              ? "bg-gradient-to-br from-deepForest to-forest shadow-[0_2px_8px_rgba(10,64,48,0.25)]"
              : "bg-white/15",
          )}>
            <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className={cn(
            "font-heading text-[18px] font-extrabold tracking-tight transition-colors duration-300",
            onDark ? "text-navy" : "text-white",
          )}>
            Nova
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-gold absolute -top-0.5 right-[-6px]" />
        </Link>

        <div className="flex-1" />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer",
                  onDark
                    ? active
                      ? "text-forest font-semibold"
                      : "text-navy/60 hover:text-navy hover:bg-forest/[0.04]"
                    : active
                      ? "text-white font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/[0.08]",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
                {active && (
                  <span className={cn(
                    "absolute -bottom-[5px] left-3 right-3 h-[2px] rounded-full",
                    onDark ? "bg-forest" : "bg-white",
                  )} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth buttons — always visible on public navbar */}
        <div className="hidden md:flex items-center gap-2 ml-4">
            <Link
              href="/login"
              className={cn(
                "px-4 py-[7px] rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer",
                onDark
                  ? "text-navy/70 hover:text-navy hover:bg-forest/[0.04]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.08]",
              )}
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className={cn(
                "group flex items-center gap-1.5 px-5 py-[7px] rounded-lg text-[13px] font-bold active:scale-[0.97] transition-all duration-200 cursor-pointer",
                onDark
                  ? "bg-gradient-to-r from-deepForest to-forest text-white shadow-[0_2px_10px_rgba(10,64,48,0.25)] hover:shadow-[0_4px_16px_rgba(10,64,48,0.35)]"
                  : "bg-white text-deepForest shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]",
              )}
            >
              S&apos;inscrire
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            "md:hidden w-9 h-9 flex items-center justify-center rounded-lg active:scale-[0.95] transition-all cursor-pointer",
            onDark ? "hover:bg-forest/[0.04]" : "hover:bg-white/[0.1]",
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen
            ? <X className={cn("w-5 h-5", onDark ? "text-navy" : "text-white")} />
            : <Menu className={cn("w-5 h-5", onDark ? "text-navy" : "text-white")} />
          }
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[68px] bottom-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-navy/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative mx-4 bg-white/95 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-lg p-3 flex flex-col gap-0.5 motion-safe:animate-slideUp">
            {publicLinks.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer",
                    active
                      ? "bg-forest/[0.06] text-forest font-semibold"
                      : "text-navy hover:bg-forest/[0.04]",
                  )}
                >
                  <Icon className={cn("w-4.5 h-4.5", active ? "text-forest" : "text-navy/40")} />
                  {link.label}
                </Link>
              );
            })}

            <div className="h-px bg-border/40 my-2" />

            <div className="flex flex-col gap-2">
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-deepForest to-forest text-white text-sm font-bold shadow-md active:scale-[0.97] transition-all cursor-pointer"
              >
                S&apos;inscrire gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-navy text-sm font-semibold text-center hover:bg-forest/[0.04] transition-colors cursor-pointer"
              >
                Déjà un compte ? Connexion
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
