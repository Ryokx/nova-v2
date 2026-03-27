/**
 * Page Dashboard Client.
 * Affiche un résumé de l'activité : stats (missions actives, séquestre, terminées),
 * tableau des missions récentes, et liens rapides (notifications, paiements, support).
 */

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import {
  Wrench,
  Lock,
  CheckCircle,
  Bell,
  CreditCard,
  MessageCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Structure d'une mission retournée par l'API */
interface MissionData {
  id: string;
  type: string;
  status: string;
  amount: number | null;
  scheduledDate: string | null;
  artisan: { user: { name: string; avatar: string | null } };
}

/* ------------------------------------------------------------------ */
/*  Configuration des statuts (label + couleurs)                       */
/* ------------------------------------------------------------------ */

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
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  /* Authentification et données */
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { data: missions, loading } = useFetch<MissionData[]>("/api/missions");

  /* Squelette de chargement pendant le fetch */
  if (authStatus === "loading" || loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 space-y-5">
        <Skeleton height={32} width={250} />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} />)}
        </div>
        <Skeleton variant="rectangular" height={300} />
      </div>
    );
  }

  /* Calculs dérivés des missions */
  const activeMissions = missions?.filter((m) => ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(m.status)) ?? [];
  const escrowAmount = missions
    ?.filter((m) => ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(m.status))
    .reduce((sum, m) => sum + (m.amount ?? 0), 0) ?? 0;
  const completedCount = missions?.filter((m) => ["COMPLETED", "VALIDATED"].includes(m.status)).length ?? 0;
  const recentMissions = missions?.slice(0, 5) ?? [];

  /* Cartes de statistiques affichées en haut */
  const statsCards = [
    { label: "Missions actives", value: String(activeMissions.length), Icon: Wrench, iconColor: "text-forest", iconBg: "bg-forest/[0.08]" },
    { label: "En séquestre", value: `${escrowAmount.toLocaleString("fr-FR")} €`, Icon: Lock, iconColor: "text-gold", iconBg: "bg-gold/[0.08]" },
    { label: "Terminées", value: String(completedCount), Icon: CheckCircle, iconColor: "text-sage", iconBg: "bg-sage/[0.08]" },
  ];

  /* Liens rapides de la barre latérale */
  const quickActions = [
    { label: "Notifications", desc: "Vos dernières alertes", Icon: Bell, href: "/notifications" },
    { label: "Paiements", desc: "Gérer vos moyens de paiement", Icon: CreditCard, href: "/payment-methods" },
    { label: "Support", desc: "Chat en direct", Icon: MessageCircle, href: "/support" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8">

      {/* En-tête : salutation + bouton CTA */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-[24px] font-extrabold text-navy mb-0.5">
            Bonjour {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-[13px] text-grayText">Bienvenue sur votre espace client</p>
        </div>
        <Link
          href="/artisans"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-deepForest text-white text-[13px] font-bold cursor-pointer hover:-translate-y-0.5 transition-transform"
        >
          Trouver un artisan
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Ligne de statistiques cliquables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        {statsCards.map((s) => (
          <div
            key={s.label}
            role="button"
            tabIndex={0}
            onClick={() => router.push("/missions")}
            onKeyDown={(e) => e.key === "Enter" && router.push("/missions")}
            className="bg-white rounded-[5px] border border-border p-4 flex items-center gap-3.5 cursor-pointer hover:border-forest/20 hover:shadow-sm transition-all"
          >
            <div className={`w-10 h-10 rounded-[5px] flex items-center justify-center shrink-0 ${s.iconBg}`}>
              <s.Icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <div>
              <div className="font-mono text-[18px] font-bold text-navy leading-none">{s.value}</div>
              <div className="text-[11px] text-grayText mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Contenu principal : tableau missions + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Tableau des missions récentes (2 colonnes) */}
        <div className="lg:col-span-2 bg-white rounded-[5px] border border-border p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[15px] font-bold text-navy">Missions récentes</h3>
            <Link href="/missions" className="inline-flex items-center gap-1 text-[12px] text-forest font-semibold">
              Tout voir <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recentMissions.length === 0 ? (
            /* Message vide si aucune mission */
            <p className="text-[13px] text-grayText text-center py-10">
              Aucune mission pour le moment.{" "}
              <Link href="/artisans" className="text-forest font-semibold">Trouvez un artisan</Link>
            </p>
          ) : (
            /* Tableau de données */
            <table className="w-full">
              <thead>
                <tr className="text-[11px] text-grayText uppercase tracking-wider border-b border-border/60">
                  <th className="text-left pb-2.5 font-medium">Artisan</th>
                  <th className="text-left pb-2.5 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right pb-2.5 font-medium hidden sm:table-cell">Montant</th>
                  <th className="text-right pb-2.5 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentMissions.map((m) => {
                  const st = statusConfig[m.status] ?? { label: m.status, color: "#374151", bg: "#F3F4F6" };
                  return (
                    <tr
                      key={m.id}
                      onClick={() => router.push(`/mission/${m.id}`)}
                      className="border-b border-border/40 last:border-0 cursor-pointer hover:bg-bgPage/50 transition-colors"
                    >
                      <td className="py-3">
                        <div className="text-[13px] font-semibold text-navy">{m.artisan.user.name ?? "Artisan"}</div>
                        <div className="text-[11px] text-grayText mt-0.5">{m.type}</div>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        <span className="text-[12px] text-grayText">
                          {m.scheduledDate
                            ? new Date(m.scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                            : "—"}
                        </span>
                      </td>
                      <td className="py-3 text-right hidden sm:table-cell">
                        <span className="text-[13px] font-mono font-semibold text-navy">
                          {m.amount ? `${m.amount.toLocaleString("fr-FR")} €` : "—"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className="text-[10px] font-semibold px-2 py-1 rounded-md inline-block"
                          style={{ color: st.color, background: st.bg }}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Barre latérale : liens rapides */}
        <div className="space-y-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-3 bg-white rounded-[5px] border border-border p-4 hover:border-forest/20 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-[5px] bg-forest/[0.06] flex items-center justify-center shrink-0">
                <a.Icon className="w-4 h-4 text-forest" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-navy">{a.label}</div>
                <div className="text-[11px] text-grayText">{a.desc}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-grayText/30 group-hover:text-forest group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
