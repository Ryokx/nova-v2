"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";

interface MissionData {
  id: string;
  type: string;
  status: string;
  amount: number | null;
  scheduledDate: string | null;
  artisan: { user: { name: string; avatar: string | null } };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "#F5A623" },
  ACCEPTED: { label: "Acceptée", color: "#1B6B4E" },
  IN_PROGRESS: { label: "En cours", color: "#22C88A" },
  COMPLETED: { label: "Terminée", color: "#1B6B4E" },
  VALIDATED: { label: "Validée", color: "#F5A623" },
  DISPUTED: { label: "Litige", color: "#E8302A" },
  CANCELLED: { label: "Annulée", color: "#6B7280" },
};

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { data: missions, loading } = useFetch<MissionData[]>("/api/missions");

  if (authStatus === "loading" || loading) {
    return (
      <div className="max-w-[900px] mx-auto p-5 md:p-8 space-y-5">
        <Skeleton height={32} width={250} />
        <div className="grid grid-cols-3 gap-3.5">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={100} />)}
        </div>
        <Skeleton variant="rectangular" height={300} />
      </div>
    );
  }

  const activeMissions = missions?.filter((m) => ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(m.status)) ?? [];
  const escrowAmount = missions
    ?.filter((m) => ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(m.status))
    .reduce((sum, m) => sum + (m.amount ?? 0), 0) ?? 0;
  const completedCount = missions?.filter((m) => ["COMPLETED", "VALIDATED"].includes(m.status)).length ?? 0;
  const recentMissions = missions?.slice(0, 3) ?? [];

  return (
    <div className="max-w-[900px] mx-auto" style={{ padding: "32px 20px" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <div>
          <h1 className="font-heading text-[26px] font-extrabold text-navy" style={{ margin: "0 0 4px" }}>
            Bonjour {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-grayText m-0">Bienvenue sur votre espace client</p>
        </div>
        <Link
          href="/artisans"
          className="hidden md:inline-block px-6 py-2.5 rounded-md bg-deepForest text-white text-sm font-semibold cursor-pointer"
        >
          Trouver un artisan
        </Link>
      </div>

      {/* Stats — 3 column grid */}
      <div className="grid grid-cols-3 gap-3.5 mb-7">
        {[
          { label: "Missions actives", value: String(activeMissions.length), icon: "🔧" },
          { label: "En séquestre", value: `${escrowAmount}€`, icon: "🔒" },
          { label: "Terminées", value: String(completedCount), icon: "✓" },
        ].map((s) => (
          <div
            key={s.label}
            onClick={() => router.push("/missions")}
            className="bg-white rounded-xl p-5 border border-border shadow-sm text-center cursor-pointer hover:-translate-y-0.5 transition-transform"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-mono text-xl font-bold text-navy">{s.value}</div>
            <div className="text-[11px] text-grayText mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent missions */}
      <div className="bg-white rounded-xl p-6 border border-border shadow-sm mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-navy m-0">Missions récentes</h3>
          <button onClick={() => router.push("/missions")} className="bg-transparent border-none text-[13px] text-forest cursor-pointer font-semibold">
            Tout voir →
          </button>
        </div>
        {recentMissions.length === 0 ? (
          <p className="text-sm text-grayText text-center py-8">
            Aucune mission pour le moment.{" "}
            <Link href="/artisans" className="text-forest font-semibold">Trouvez un artisan</Link>
          </p>
        ) : (
          recentMissions.map((m, i) => {
            const st = statusConfig[m.status] ?? { label: m.status, color: "#6B7280" };
            return (
              <div
                key={m.id}
                onClick={() => router.push(`/mission/${m.id}`)}
                className="flex justify-between items-center py-3.5 cursor-pointer"
                style={{ borderTop: i ? "1px solid #D4EBE0" : "none" }}
              >
                <div>
                  <div className="text-sm font-semibold text-navy">
                    {m.artisan.user.name ?? "Artisan"} — {m.type}
                  </div>
                  <div className="text-xs text-grayText mt-0.5">
                    {m.scheduledDate
                      ? new Date(m.scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                      : ""}
                    {m.amount ? ` • ${m.amount}€` : ""}
                  </div>
                </div>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ color: st.color, background: st.color + "12" }}
                >
                  {st.label}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Quick actions — 4 column grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {[
          { label: "Urgence 24/7", desc: "Intervention < 2h", icon: "⚡", href: "/urgence", accent: "#E8302A" },
          { label: "Notifications", desc: "2 nouvelles", icon: "🔔", href: "/notifications", accent: undefined },
          { label: "Paiements", desc: "Visa •••• 6411", icon: "💳", href: "/payment-methods", accent: undefined },
          { label: "Support", desc: "Chat en direct", icon: "💬", href: "/support", accent: undefined },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="bg-white rounded-lg p-5 cursor-pointer shadow-sm hover:-translate-y-0.5 transition-transform"
            style={{ border: a.accent ? `1px solid ${a.accent}20` : "1px solid #D4EBE0" }}
          >
            <span className="text-2xl">{a.icon}</span>
            <div className="text-[15px] font-bold mt-2" style={{ color: a.accent ?? "#0A1628" }}>{a.label}</div>
            <div className="text-xs text-grayText mt-0.5">{a.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
