"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Briefcase, Clock, AlertTriangle, CreditCard, Shield,
  Users, Star, Search, Check, XCircle, Eye, TrendingUp, TrendingDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice, cn } from "@/lib/utils";
import type { BadgeVariant } from "@/components/ui/badge";

interface AdminStats {
  totalUsers: number; totalArtisans: number; totalClients: number;
  totalMissions: number; activeMissions: number; disputedMissions: number;
  pendingValidation: number; revenue7d: number; escrowBalance: number; avgRating: number;
}

interface UserData {
  id: string; name: string | null; email: string; role: string; createdAt: string;
  artisanProfile: { trade: string; isVerified: boolean; rating: number; missionCount: number } | null;
}

interface MissionData {
  id: string; type: string; status: string; amount: number | null; createdAt: string;
  client: { name: string | null };
  artisan: { user: { name: string | null } };
  payment: { id: string; amount: number; status: string } | null;
}

const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: "En attente", variant: "warning" },
  ACCEPTED: { label: "Acceptée", variant: "info" },
  IN_PROGRESS: { label: "En cours", variant: "success" },
  COMPLETED: { label: "Terminée", variant: "info" },
  VALIDATED: { label: "Validée", variant: "success" },
  DISPUTED: { label: "Litige", variant: "danger" },
  CANCELLED: { label: "Annulée", variant: "default" },
};

export default function AdminPage() {
  const { data: session, status: authStatus } = useSession();
  const [tab, setTab] = useState<"overview" | "users" | "missions">("overview");
  const [userSearch, setUserSearch] = useState("");
  const [missionFilter, setMissionFilter] = useState("");

  const { data: stats, loading: loadingStats } = useFetch<AdminStats>("/api/admin/stats");
  const { data: users, loading: loadingUsers } = useFetch<UserData[]>(
    tab === "users" ? `/api/admin/users${userSearch ? `?search=${encodeURIComponent(userSearch)}` : ""}` : null,
  );
  const { data: missions, loading: loadingMissions } = useFetch<MissionData[]>(
    tab === "missions" ? `/api/admin/missions${missionFilter ? `?status=${missionFilter}` : ""}` : null,
  );

  if (authStatus === "loading") return <div className="max-w-[1100px] mx-auto p-8"><Skeleton height={400} variant="rectangular" /></div>;
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const handlePaymentAction = async (paymentId: string, action: "release" | "refund") => {
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId, action }),
    });
    window.location.reload();
  };

  /* ── KPI definitions matching nova-admin.jsx ── */
  const kpiRow1 = stats ? [
    {
      label: "Interventions actives",
      value: stats.activeMissions,
      icon: <Briefcase className="w-[18px] h-[18px] text-forest" />,
      sub: "dont 3 urgences",
      trend: "up" as const,
      trendValue: "+8% cette semaine",
    },
    {
      label: "En attente validation",
      value: stats.pendingValidation,
      icon: <Clock className="w-[18px] h-[18px] text-gold" />,
      sub: "délai moyen : 2.4h",
      trend: null,
      trendValue: "",
    },
    {
      label: "Litiges ouverts",
      value: stats.disputedMissions,
      icon: <AlertTriangle className="w-[18px] h-[18px] text-red" />,
      sub: stats.disputedMissions > 0 ? `${stats.disputedMissions} en cours` : undefined,
      trend: null,
      trendValue: "",
    },
    {
      label: "Revenus 7 jours",
      value: formatPrice(stats.revenue7d),
      icon: <CreditCard className="w-[18px] h-[18px] text-forest" />,
      sub: undefined,
      trend: "up" as const,
      trendValue: "+12.4%",
    },
  ] : [];

  const kpiRow2 = stats ? [
    {
      label: "Séquestre en cours",
      value: formatPrice(stats.escrowBalance),
      icon: <Shield className="w-[18px] h-[18px] text-forest" />,
      sub: "18 missions",
      trend: null,
      trendValue: "",
    },
    {
      label: "Artisans actifs",
      value: stats.totalArtisans,
      icon: <Users className="w-[18px] h-[18px] text-forest" />,
      sub: undefined,
      trend: "up" as const,
      trendValue: "+6 ce mois",
    },
    {
      label: "Clients actifs",
      value: stats.totalClients,
      icon: <Users className="w-[18px] h-[18px] text-sage" />,
      sub: undefined,
      trend: null,
      trendValue: "",
    },
    {
      label: "Note moyenne",
      value: `${stats.avgRating}/5`,
      icon: <Star className="w-4 h-4 fill-gold text-gold" />,
      sub: `${stats.totalClients} clients actifs`,
      trend: null,
      trendValue: "",
    },
  ] : [];

  return (
    <div className="max-w-[1100px] mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Tableau de bord</h1>
        <p className="font-body text-sm text-grayText">Vue d&apos;ensemble en temps réel</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { id: "overview" as const, label: "Vue d'ensemble" },
          { id: "users" as const, label: "Utilisateurs" },
          { id: "missions" as const, label: "Missions" },
        ]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all",
              tab === t.id ? "bg-deepForest text-white" : "bg-white border border-border text-navy hover:bg-surface")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════ OVERVIEW ══════ */}
      {tab === "overview" && (
        <>
          {loadingStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={130} />)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[5, 6, 7, 8].map((i) => <Skeleton key={i} variant="rectangular" height={130} />)}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiRow1.map((k) => (
                  <div key={k.label} className="bg-white rounded-[20px] p-5 border border-border hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-body text-[13px] text-grayText font-medium">{k.label}</span>
                      <div className="w-9 h-9 rounded-[10px] bg-surface flex items-center justify-center">{k.icon}</div>
                    </div>
                    <div className="font-heading text-[28px] font-extrabold text-navy leading-none">{k.value}</div>
                    {k.sub && <div className="font-mono text-[11px] text-grayText mt-1.5">{k.sub}</div>}
                    {k.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        {k.trend === "up" ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-red" />}
                        <span className={`font-mono text-[11px] font-medium ${k.trend === "up" ? "text-success" : "text-red"}`}>{k.trendValue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiRow2.map((k) => (
                  <div key={k.label} className="bg-white rounded-[20px] p-5 border border-border hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-body text-[13px] text-grayText font-medium">{k.label}</span>
                      <div className="w-9 h-9 rounded-[10px] bg-surface flex items-center justify-center">{k.icon}</div>
                    </div>
                    <div className="font-heading text-[28px] font-extrabold text-navy leading-none">{k.value}</div>
                    {k.sub && <div className="font-mono text-[11px] text-grayText mt-1.5">{k.sub}</div>}
                    {k.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        {k.trend === "up" ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-red" />}
                        <span className={`font-mono text-[11px] font-medium ${k.trend === "up" ? "text-success" : "text-red"}`}>{k.trendValue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disputed missions alert */}
          {stats && stats.disputedMissions > 0 && (
            <div className="mt-5 bg-white rounded-[20px] border border-red/15 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red" />
                </div>
                <div className="flex-1">
                  <div className="font-heading text-sm font-bold text-navy">
                    {stats.disputedMissions} litige{stats.disputedMissions > 1 ? "s" : ""} en cours
                  </div>
                  <div className="text-xs text-grayText">Nécessite une intervention manuelle</div>
                </div>
                <Button size="sm" variant="danger" onClick={() => { setTab("missions"); setMissionFilter("DISPUTED"); }}>
                  Voir les litiges
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════ USERS ══════ */}
      {tab === "users" && (
        <>
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
            <input type="text" placeholder="Rechercher un utilisateur..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm text-navy font-body placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30" />
          </div>
          {loadingUsers ? (
            <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={70} />)}</div>
          ) : users && users.length > 0 ? (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="bg-white rounded-[16px] border border-border p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                  <Avatar name={u.name ?? u.email} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-sm font-semibold text-navy">{u.name ?? "\u2014"}</div>
                    <div className="font-body text-xs text-grayText truncate">{u.email}</div>
                  </div>
                  <Badge variant={u.role === "ADMIN" ? "danger" : u.role === "ARTISAN" ? "info" : "default"}>
                    {u.role}
                  </Badge>
                  {u.artisanProfile && (
                    <div className="text-right text-xs hidden md:block">
                      <div className="font-body font-medium text-navy">{u.artisanProfile.trade}</div>
                      <div className="text-grayText flex items-center justify-end gap-1">
                        {u.artisanProfile.isVerified ? <Check className="w-3 h-3 text-success" /> : <Clock className="w-3 h-3 text-gold" />}
                        <Star className="w-3 h-3 fill-gold text-gold" /> {u.artisanProfile.rating} &bull; {u.artisanProfile.missionCount} missions
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-grayText text-center py-8">Aucun utilisateur trouvé</p>
          )}
        </>
      )}

      {/* ══════ MISSIONS ══════ */}
      {tab === "missions" && (
        <>
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {[
              { id: "", label: "Toutes" },
              { id: "DISPUTED", label: "Litiges" },
              { id: "COMPLETED", label: "À valider" },
              { id: "IN_PROGRESS", label: "En cours" },
              { id: "VALIDATED", label: "Validées" },
            ].map((f) => (
              <button key={f.id} onClick={() => setMissionFilter(f.id)}
                className={cn("px-3.5 py-2 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all",
                  missionFilter === f.id ? "bg-deepForest text-white" : "bg-white border border-border text-navy hover:bg-surface")}>
                {f.label}
              </button>
            ))}
          </div>
          {loadingMissions ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={90} />)}</div>
          ) : missions && missions.length > 0 ? (
            <div className="space-y-2">
              {missions.map((m) => {
                const st = statusMap[m.status] ?? { label: m.status, variant: "default" as BadgeVariant };
                return (
                  <div key={m.id} className="bg-white rounded-[16px] border border-border p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] text-forest">{m.id.slice(0, 8)}</span>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </div>
                        <div className="font-body text-sm text-navy mt-0.5">
                          {m.client.name ?? "Client"} &rarr; {m.artisan.user.name ?? "Artisan"} &bull; {m.type}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {m.amount && <div className="font-mono text-sm font-bold text-navy">{formatPrice(m.amount)}</div>}
                        {m.payment && (
                          <Badge variant={m.payment.status === "ESCROWED" ? "warning" : m.payment.status === "RELEASED" ? "success" : "default"} className="text-[10px]">
                            {m.payment.status === "ESCROWED" ? "Séquestre" : m.payment.status === "RELEASED" ? "Libéré" : m.payment.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* Admin actions for disputes */}
                    {m.status === "DISPUTED" && m.payment && m.payment.status === "ESCROWED" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <Button size="sm" className="bg-success hover:bg-success/90 text-xs flex-1" onClick={() => handlePaymentAction(m.payment!.id, "release")}>
                          <Check className="w-3 h-3 mr-1" /> Libérer le paiement
                        </Button>
                        <Button size="sm" variant="danger" className="text-xs flex-1" onClick={() => handlePaymentAction(m.payment!.id, "refund")}>
                          <XCircle className="w-3 h-3 mr-1" /> Rembourser le client
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" /> Détail
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-grayText text-center py-8">Aucune mission trouvée</p>
          )}
        </>
      )}
    </div>
  );
}
