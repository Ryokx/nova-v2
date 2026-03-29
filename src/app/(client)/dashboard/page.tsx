/**
 * Dashboard Client — fond vert doux, suivi en direct, stats, missions, actions.
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import {
  Wrench, Lock, CheckCircle, Bell, CreditCard, MessageCircle,
  ChevronRight, ArrowRight, MapPin, Clock, Check, Zap, Phone,
  Shield, Navigation, Plus, Settings, FileText, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types & Config                                                     */
/* ------------------------------------------------------------------ */

interface MissionData {
  id: string;
  type: string;
  status: string;
  amount: number | null;
  scheduledDate: string | null;
  artisan: { user: { name: string; avatar: string | null } };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "En attente", color: "#92650A", bg: "#FEF3C7" },
  ACCEPTED: { label: "Acceptée", color: "#065F46", bg: "#D1FAE5" },
  IN_PROGRESS: { label: "En cours", color: "#0E7C5F", bg: "#D1FAE5" },
  COMPLETED: { label: "Terminée", color: "#065F46", bg: "#D1FAE5" },
  VALIDATED: { label: "Validée", color: "#92650A", bg: "#FEF3C7" },
  DISPUTED: { label: "Litige", color: "#991B1B", bg: "#FEE2E2" },
  CANCELLED: { label: "Annulée", color: "#374151", bg: "#F3F4F6" },
};

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { data: missions, loading } = useFetch<MissionData[]>("/api/missions");

  /* ── Intervention en cours ── */
  const [activeMission, setActiveMission] = useState<{
    id: string; trade: string; address: string; isUrgent: boolean;
    paymentMethod: string; status: string; createdAt: string;
  } | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("nova_active_mission");
        if (!raw) { setActiveMission(null); return; }
        const data = JSON.parse(raw);
        if (["DEVIS_SIGNED", "COMPLETED", "RELEASED", "CANCELLED"].includes(data.status)) {
          localStorage.removeItem("nova_active_mission");
          setActiveMission(null);
          return;
        }
        setActiveMission(data);
      } catch { setActiveMission(null); }
    };
    read();
    const interval = setInterval(read, 5_000);
    const onStorage = (e: StorageEvent) => { if (e.key === "nova_active_mission") read(); };
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(interval); window.removeEventListener("storage", onStorage); };
  }, []);

  useEffect(() => {
    if (!activeMission || activeMission.status !== "SEARCHING") return;
    const t1 = setTimeout(() => {
      try {
        const raw = localStorage.getItem("nova_active_mission");
        if (raw) {
          const data = JSON.parse(raw);
          data.status = "EN_ROUTE";
          localStorage.setItem("nova_active_mission", JSON.stringify(data));
          setActiveMission(data);
        }
      } catch {}
    }, 5000);
    return () => clearTimeout(t1);
  }, [activeMission]);

  const trackingSteps = [
    { key: "SEARCHING", label: "Trouvé", icon: Check },
    { key: "EN_ROUTE", label: "En route", icon: Navigation },
    { key: "ON_SITE", label: "Sur place", icon: Wrench },
    { key: "DEVIS_SIGNED", label: "Devis signé", icon: FileText },
  ];

  const currentStepIndex = activeMission
    ? trackingSteps.findIndex(s => s.key === activeMission.status)
    : -1;

  /* Loading */
  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 space-y-5">
          <Skeleton height={32} width={250} />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} />)}
          </div>
          <Skeleton variant="rectangular" height={300} />
        </div>
      </div>
    );
  }

  const activeMissions = missions?.filter((m) => ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(m.status)) ?? [];
  const escrowAmount = missions
    ?.filter((m) => ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(m.status))
    .reduce((sum, m) => sum + (m.amount ?? 0), 0) ?? 0;
  const completedCount = missions?.filter((m) => ["COMPLETED", "VALIDATED"].includes(m.status)).length ?? 0;
  const recentMissions = missions?.slice(0, 5) ?? [];
  const firstName = session?.user?.name?.split(" ")[0] ?? "Client";

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 space-y-5">

        {/* ═══════════ HEADER ═══════════ */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-[22px] md:text-[26px] font-extrabold text-navy">Bonjour {firstName}</h1>
            <p className="text-[13px] text-grayText mt-0.5">
              {activeMission ? "Une intervention est en cours" : "Bienvenue sur votre espace Nova"}
            </p>
          </div>
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-gradient-to-r from-deepForest to-forest text-white text-[12px] font-bold cursor-pointer hover:shadow-md transition-shadow"
          >
            <Plus className="w-3.5 h-3.5" /> Nouvelle demande
          </Link>
        </div>

        {/* ═══════════ SUIVI EN DIRECT ═══════════ */}
        {activeMission && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Carte principale */}
            <div className="lg:col-span-2 bg-white rounded-[6px] border border-border/60 overflow-hidden">
              {/* Bandeau */}
              <div className="bg-gradient-to-r from-deepForest to-forest px-5 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[13px] font-bold text-white flex-1">Suivi en direct</span>
                {activeMission.isUrgent && (
                  <span className="px-2 py-0.5 rounded-[4px] bg-white/20 text-[10px] font-bold text-white flex items-center gap-1">
                    <Zap className="w-3 h-3" /> URGENCE
                  </span>
                )}
              </div>

              <div className="p-5 space-y-5">
                {/* Artisan */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[6px] bg-gradient-to-br from-deepForest to-forest flex items-center justify-center text-white text-sm font-bold shrink-0">MD</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-navy">Marc Dupont</div>
                    <div className="text-xs text-grayText">{activeMission.trade}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="w-8 h-8 rounded-[6px] bg-surface flex items-center justify-center text-forest hover:bg-border transition-colors cursor-pointer">
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-[6px] bg-surface flex items-center justify-center text-forest hover:bg-border transition-colors cursor-pointer">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Timeline horizontale */}
                <div className="flex items-center">
                  {trackingSteps.map((s, i) => {
                    const Icon = s.icon;
                    const isDone = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div key={s.key} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            isCurrent ? "bg-forest ring-[3px] ring-forest/20" :
                            isDone ? "bg-forest" : "bg-surface",
                          )}>
                            <Icon className={cn("w-3.5 h-3.5", isDone ? "text-white" : "text-grayText")} />
                          </div>
                          <span className={cn(
                            "text-[10px] mt-1 font-medium whitespace-nowrap",
                            isCurrent ? "text-forest font-bold" : isDone ? "text-navy" : "text-grayText",
                          )}>{s.label}</span>
                        </div>
                        {i < trackingSteps.length - 1 && (
                          <div className={cn("h-0.5 flex-1 mx-1.5 mt-[-16px]", i < currentStepIndex ? "bg-forest" : "bg-border")} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Barre ETA */}
                {activeMission.isUrgent && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-semibold text-grayText">Arrivée estimée</span>
                      <span className="text-sm font-bold text-forest font-mono">~18 min</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-forest to-sage rounded-full transition-all duration-1000" style={{ width: currentStepIndex >= 1 ? "55%" : "20%" }} />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/tracking/${activeMission.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[6px] bg-gradient-to-r from-deepForest to-forest text-white text-xs font-bold hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" /> Suivre l&apos;artisan sur la carte
                </Link>
              </div>
            </div>

            {/* Sidebar infos mission */}
            <div className="space-y-3">
              {/* Séquestre */}
              <div className="bg-gradient-to-br from-deepForest to-forest rounded-[6px] p-4 text-white">
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield className="w-3.5 h-3.5 text-lightSage" />
                  <span className="text-[11px] font-bold text-lightSage">Séquestre</span>
                </div>
                <div className="font-mono text-xl font-bold">320,00&nbsp;&euro;</div>
                <div className="text-[10px] text-white/50 mt-0.5">Protégé jusqu&apos;à validation</div>
              </div>

              {/* Détails */}
              <div className="bg-white rounded-[6px] border border-border/60 p-4 space-y-2.5">
                {[
                  { icon: Wrench, label: "Domaine", value: activeMission.trade },
                  { icon: MapPin, label: "Adresse", value: activeMission.address },
                  { icon: CreditCard, label: "Paiement", value: activeMission.paymentMethod === "card" ? "Séquestre" : "Espèces" },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-2.5">
                    <row.icon className="w-3.5 h-3.5 text-forest mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] text-grayText uppercase tracking-wide">{row.label}</div>
                      <div className="text-xs font-medium text-navy truncate">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ STATS ═══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Missions actives", value: String(activeMissions.length), Icon: Wrench, accent: "text-forest", accentBg: "bg-forest/8" },
            { label: "En séquestre", value: `${escrowAmount.toLocaleString("fr-FR")} \u20AC`, Icon: Lock, accent: "text-gold", accentBg: "bg-gold/8" },
            { label: "Terminées", value: String(completedCount), Icon: CheckCircle, accent: "text-sage", accentBg: "bg-sage/8" },
          ].map((s) => (
            <div
              key={s.label}
              role="button"
              tabIndex={0}
              onClick={() => router.push("/missions")}
              onKeyDown={(e) => e.key === "Enter" && router.push("/missions")}
              className="bg-white rounded-[6px] border border-border/60 p-4 flex items-center gap-3.5 cursor-pointer hover:shadow-sm transition-all"
            >
              <div className={cn("w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0", s.accentBg)}>
                <s.Icon className={cn("w-5 h-5", s.accent)} />
              </div>
              <div>
                <div className="font-mono text-[20px] font-bold text-navy leading-none">{s.value}</div>
                <div className="text-[11px] text-grayText mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════ MISSIONS + SIDEBAR ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Missions récentes */}
          <div className="lg:col-span-2 bg-white rounded-[6px] border border-border/60 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[15px] font-bold text-navy">Missions récentes</h3>
              <Link href="/missions" className="text-[12px] text-forest font-semibold hover:underline flex items-center gap-1">
                Tout voir <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {recentMissions.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-[6px] bg-surface flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-grayText" />
                </div>
                <p className="text-[13px] text-grayText mb-2">Aucune mission pour le moment</p>
                <Link href="/" className="text-xs font-semibold text-forest hover:underline flex items-center justify-center gap-1">
                  Trouver un artisan <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {recentMissions.map((m) => {
                  const st = statusConfig[m.status] ?? { label: m.status, color: "#374151", bg: "#F3F4F6" };
                  return (
                    <div
                      key={m.id}
                      onClick={() => router.push(`/mission/${m.id}`)}
                      className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 cursor-pointer hover:bg-surface/50 -mx-2 px-2 rounded-[4px] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-[6px] bg-surface flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4 text-grayText" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-navy">{m.artisan.user.name ?? "Artisan"}</div>
                        <div className="text-[11px] text-grayText">{m.type}</div>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <div className="text-[12px] font-mono font-semibold text-navy">
                          {m.amount ? `${m.amount.toLocaleString("fr-FR")} \u20AC` : "\u2014"}
                        </div>
                        <div className="text-[10px] text-grayText">
                          {m.scheduledDate
                            ? new Date(m.scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                            : ""}
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-1 rounded-[4px] shrink-0"
                        style={{ color: st.color, background: st.bg }}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions rapides */}
          <div className="space-y-3">
            {[
              { label: "Notifications", desc: "Vos dernières alertes", Icon: Bell, href: "/notifications" },
              { label: "Paiements", desc: "Gérer vos cartes", Icon: CreditCard, href: "/payment-methods" },
              { label: "Support", desc: "Chat en direct", Icon: MessageCircle, href: "/support" },
              { label: "Paramètres", desc: "Profil et préférences", Icon: Settings, href: "/settings" },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 bg-white rounded-[6px] border border-border/60 p-3.5 hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-[6px] bg-surface flex items-center justify-center shrink-0 group-hover:bg-forest/10 transition-colors">
                  <a.Icon className="w-4 h-4 text-grayText group-hover:text-forest transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-navy">{a.label}</div>
                  <div className="text-[11px] text-grayText">{a.desc}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-grayText/30 group-hover:text-forest transition-all shrink-0" />
              </Link>
            ))}

            {/* CTA mobile */}
            <Link
              href="/"
              className="md:hidden flex items-center justify-center gap-2 w-full py-3 rounded-[6px] bg-gradient-to-r from-deepForest to-forest text-white text-[13px] font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Nouvelle demande
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
