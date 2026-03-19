"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench, Lock, CheckCircle, Zap, Bell, CreditCard, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MissionCard } from "@/components/features/mission-card";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";

interface MissionData {
  id: string;
  type: string;
  status: string;
  amount: number | null;
  scheduledDate: string | null;
  artisan: { user: { name: string; avatar: string | null } };
}

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

  const stats = [
    { label: "Missions actives", value: activeMissions.length, icon: <Wrench className="w-5 h-5 text-forest" />, color: "text-forest" },
    { label: "En séquestre", value: formatPrice(escrowAmount), icon: <Lock className="w-5 h-5 text-forest" />, color: "text-forest" },
    { label: "Terminées", value: completedCount, icon: <CheckCircle className="w-5 h-5 text-success" />, color: "text-success" },
  ];

  const quickActions = [
    { label: "Urgence 24/7", icon: <Zap className="w-5 h-5" />, href: "/urgence", color: "text-red", bg: "bg-red/5" },
    { label: "Notifications", icon: <Bell className="w-5 h-5" />, href: "/notifications", color: "text-forest", bg: "bg-forest/5" },
    { label: "Paiements", icon: <CreditCard className="w-5 h-5" />, href: "/payment-methods", color: "text-forest", bg: "bg-forest/5" },
    { label: "Support", icon: <MessageCircle className="w-5 h-5" />, href: "/support", color: "text-forest", bg: "bg-forest/5" },
  ];

  return (
    <div className="max-w-[900px] mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-[26px] font-extrabold text-navy">
            Bonjour {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-grayText">Bienvenue dans votre espace client</p>
        </div>
        <Link
          href="/artisans"
          className="hidden md:inline-flex px-5 py-2.5 rounded-[14px] bg-gradient-to-br from-deepForest to-forest text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          Trouver un artisan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3.5 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="text-center py-5">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <div className={`font-mono text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-grayText mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Recent missions */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-base font-bold text-navy">Missions récentes</h2>
          <Link href="/missions" className="text-xs text-forest font-semibold hover:underline">
            Voir tout →
          </Link>
        </div>
        {recentMissions.length === 0 ? (
          <p className="text-sm text-grayText text-center py-8">
            Aucune mission pour le moment.{" "}
            <Link href="/artisans" className="text-forest font-semibold">Trouvez un artisan</Link>
          </p>
        ) : (
          <div className="space-y-2">
            {recentMissions.map((m) => (
              <MissionCard
                key={m.id}
                id={m.id}
                type={m.type}
                status={m.status}
                amount={m.amount}
                artisanName={m.artisan.user.name ?? "Artisan"}
                artisanAvatar={m.artisan.user.avatar}
                scheduledDate={m.scheduledDate}
                onClick={() => router.push(`/mission/${m.id}`)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-border ${a.bg} hover:-translate-y-0.5 transition-transform`}
          >
            <div className={a.color}>{a.icon}</div>
            <span className="text-xs font-semibold text-navy">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
