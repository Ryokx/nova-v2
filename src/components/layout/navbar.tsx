"use client";

/**
 * Composant Navbar — Barre de navigation principale de l'application.
 *
 * Trois variantes sont rendues selon le contexte :
 * 1. Navbar publique (visiteurs) : dégradé vert, flottante, liens publics + boutons connexion/inscription
 * 2. Navbar authentifiée (clients/artisans) : blanche, fixe, liens selon le rôle
 * 3. Navbar minimale (chargement sur pages protégées) : juste le logo
 *
 * Fonctionnalités :
 * - Menu mobile hamburger
 * - Dropdown "Plus" pour les liens artisan secondaires
 * - Détection des sections sombres pour adapter les couleurs (mode public)
 * - Badge de notifications non lues
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu, X, LayoutDashboard, FileText, CreditCard, Megaphone,
  Globe, UserCircle, Calculator, ChevronDown, Wrench, Search,
  Shield, ClipboardList, Bell, Heart, LogOut, ArrowRight, Zap,
  MapPin, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ━━━ Bannière de suivi intervention en cours ━━━ */

interface ActiveMission {
  id: string;
  status: string;
  trade?: string;
  artisanName?: string;
  eta?: string;
}

function TrackingBanner() {
  const { data: session } = useSession();
  const [mission, setMission] = useState<ActiveMission | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!session?.user) { setMission(null); return; }

    const readMission = () => {
      try {
        const raw = localStorage.getItem("nova_active_mission");
        if (!raw) { setMission(null); return; }
        const data = JSON.parse(raw);
        // Masquer si statut avancé (devis signé ou plus)
        if (["DEVIS_SIGNED", "COMPLETED", "RELEASED", "CANCELLED"].includes(data.status)) {
          localStorage.removeItem("nova_active_mission");
          setMission(null);
          return;
        }
        setMission({
          id: data.id,
          status: data.status,
          trade: data.trade,
          artisanName: undefined,
          eta: data.isUrgent ? "~20 min" : undefined,
        });
      } catch {
        setMission(null);
      }
    };

    readMission();
    // Poll localStorage + événement storage (cross-tab)
    const interval = setInterval(readMission, 5_000);
    const onStorage = (e: StorageEvent) => { if (e.key === "nova_active_mission") readMission(); };
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(interval); window.removeEventListener("storage", onStorage); };
  }, [session]);

  if (!mission || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-deepForest to-forest text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
        <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
        <div className="flex-1 min-w-0 flex items-center gap-2 text-xs font-medium">
          <span className="truncate">
            Intervention en cours{mission.trade ? ` — ${mission.trade}` : ""}
            {mission.artisanName ? ` avec ${mission.artisanName}` : ""}
          </span>
          {mission.eta && (
            <span className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/15 text-[10px] font-bold shrink-0">
              <Clock className="w-3 h-3" /> {mission.eta}
            </span>
          )}
        </div>
        <Link
          href={`/tracking/${mission.id}`}
          className="shrink-0 px-3 py-1 rounded-[6px] bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors duration-200 cursor-pointer flex items-center gap-1"
        >
          Suivre <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 w-5 h-5 flex items-center justify-center rounded-[4px] hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/* ━━━ Définition des liens de navigation ━━━ */

/** Liens pour les clients connectés */
const clientLinks = [
  { href: "/artisans", label: "Artisans", icon: Search },
  { href: "/missions", label: "Missions", icon: ClipboardList },
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profil", icon: UserCircle },
];

/** Liens principaux pour les artisans (affichés directement dans la navbar) */
const artisanMainLinks = [
  { href: "/artisan-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/artisan-documents", label: "Documents", icon: FileText },
  { href: "/artisan-payments", label: "Paiements", icon: CreditCard },
  { href: "/artisan-compta", label: "Comptabilité", icon: Calculator },
  { href: "/artisan-notifications", label: "Notifications", icon: Bell },
];

/** Liens secondaires artisan (dans le dropdown "Plus") */
const artisanMoreLinks = [
  { href: "/artisan-communication", label: "Communication", icon: Megaphone },
  { href: "/artisan-website", label: "Mon site", icon: Globe },
  { href: "/artisan-clients", label: "Clients", icon: Heart },
  { href: "/artisan-profile", label: "Profil", icon: UserCircle },
];

/** Tous les liens artisan combinés (utilisé pour le menu mobile) */
const artisanLinks = [...artisanMainLinks, ...artisanMoreLinks];

/** Chemins publics où la navbar verte est affichée (sauf si connecté) */
const PUBLIC_PATHS = [
  "/", "/login", "/signup", "/comment-ca-marche", "/devenir-partenaire", "/support", "/cgu", "/confidentialite", "/mentions-legales", "/reset-password", "/complete-profile",
  // Pages SEO métiers
  "/serrurier", "/plombier", "/electricien", "/chauffagiste", "/peintre", "/menuisier", "/carreleur", "/macon",
  // Pages SEO urgences
  "/serrurier-urgence", "/plombier-urgence", "/electricien-urgence", "/chauffagiste-urgence", "/macon-urgence",
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // États locaux
  const [mobileOpen, setMobileOpen] = useState(false);   // Menu mobile ouvert/fermé
  const [moreOpen, setMoreOpen] = useState(false);        // Dropdown "Plus" ouvert/fermé
  const [onDark, setOnDark] = useState(false);            // La navbar est-elle sur une section sombre ?
  const [unreadCount, setUnreadCount] = useState(0);      // Nombre de notifications non lues

  const moreRef = useRef<HTMLDivElement>(null);

  // Raccourcis pour l'état de session
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isArtisan = session?.user?.role === "ARTISAN";
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p);

  /** Liens affichés dans la navbar publique */
  const publicLinks = [
    { href: "/", label: "Trouver un artisan", icon: Search },
    { href: "/comment-ca-marche", label: "Comment ça marche", icon: Wrench },
  ];

  /* ━━━ Détection des sections sombres (navbar publique seulement) ━━━ */
  // Utilise IntersectionObserver pour détecter si la navbar est au-dessus d'une section sombre
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

  // Complément au scroll pour une détection plus réactive des sections sombres
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

  /* ━━━ Récupération du nombre de notifications non lues ━━━ */
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

  /* ━━━ Fermeture du dropdown "Plus" au clic extérieur ━━━ */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /** Vérifie si un lien correspond à la page active */
  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  /** Vérifie si un des liens "Plus" est actif (pour le surlignage du dropdown) */
  const isMoreActive = isArtisan && artisanMoreLinks.some((l) => isLinkActive(l.href));

  /* ━━━ Décision : quelle navbar afficher ━━━ */
  const hasValidSession = isAuthenticated && !!session?.user?.email;
  const showPublicNavbar = isPublicPath
    ? !hasValidSession // Sur les pages publiques : navbar verte sauf si connecté
    : status === "unauthenticated";
  const showAuthNavbar = hasValidSession;
  const showMinimalNavbar = !showPublicNavbar && !showAuthNavbar; // Chargement sur pages protégées

  /* ━━━ 1. Navbar minimale (chargement) ━━━ */
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

  /* ━━━ 2. Navbar authentifiée (blanche, fixe) ━━━ */
  if (showAuthNavbar) {
    return (
      <>
        {/* Spacer pour compenser la navbar fixe + banner */}
        <div className="h-[56px]" />
        <TrackingBanner />

        <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-border/60 shadow-sm px-5 flex items-center justify-between">
          {/* Logo — redirige vers le dashboard approprié */}
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

          {/* Liens desktop — différents selon client ou artisan */}
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
                  {/* Badge notifications non lues */}
                  {isNotif && unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red text-white text-[10px] font-bold leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                  {/* Indicateur de lien actif */}
                  {active && (
                    <span className="absolute -bottom-[5px] left-3 right-3 h-[2px] rounded-full bg-forest" />
                  )}
                </Link>
              );
            })}

            {/* Dropdown "Plus" pour les liens artisan secondaires */}
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

          {/* Bouton de déconnexion (desktop) */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="hidden md:flex items-center gap-1.5 ml-4 px-3.5 py-[7px] rounded-lg text-[12px] font-semibold text-red hover:text-red hover:bg-red/[0.05] active:scale-[0.97] transition-all duration-200 cursor-pointer border-none bg-transparent"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>

          {/* Bouton hamburger (mobile) */}
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

        {/* Menu mobile déroulant (authentifié) */}
        {mobileOpen && (
          <div className="fixed inset-x-0 top-14 bottom-0 z-40 md:hidden">
            {/* Fond semi-transparent */}
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

  /* ━━━ 3. Navbar publique (visiteurs non connectés) ━━━ */
  return (
    <>
      {/* Spacer pour compenser la navbar fixe */}
      <div className="h-[72px]" />

      <nav
        className={cn(
          "fixed top-3 left-4 right-4 z-50 mx-auto max-w-[1200px]",
          "h-12 rounded-2xl px-5 flex items-center justify-between",
          "border transition-all duration-300",
          // Quand la navbar est sur une section sombre, elle passe en blanc
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

        {/* Liens publics (desktop) */}
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
                  // Couleurs adaptées au mode clair/sombre de la navbar
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

        {/* Boutons connexion / inscription (desktop) */}
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

        {/* Bouton hamburger (mobile) */}
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

      {/* Menu mobile déroulant (public) */}
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

            {/* Boutons connexion/inscription (mobile) */}
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
