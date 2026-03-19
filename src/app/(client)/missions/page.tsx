"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { MissionCard } from "@/components/features/mission-card";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

interface MissionData {
  id: string;
  type: string;
  status: string;
  amount: number | null;
  scheduledDate: string | null;
  artisan: { user: { name: string; avatar: string | null } };
}

const tabs = [
  { id: "all", label: "Toutes" },
  { id: "IN_PROGRESS", label: "En cours" },
  { id: "COMPLETED", label: "Terminées" },
  { id: "VALIDATED", label: "Validées" },
  { id: "DISPUTED", label: "Litiges" },
];

export default function MissionsPage() {
  const [tab, setTab] = useState("all");
  const router = useRouter();
  const { data: missions, loading } = useFetch<MissionData[]>("/api/missions");

  const filteredMissions = missions?.filter((m) => {
    if (tab === "all") return true;
    if (tab === "IN_PROGRESS") return ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(m.status);
    return m.status === tab;
  }) ?? [];

  return (
    <div className="max-w-[900px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-1">
        Mes missions
      </h1>
      <p className="text-sm text-grayText mb-6">Suivez vos interventions</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 rounded-[10px] text-[13px] font-semibold whitespace-nowrap transition-all",
              tab === t.id
                ? "bg-deepForest text-white"
                : "bg-white border border-border text-navy hover:bg-surface",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Missions list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} />)}
        </div>
      ) : filteredMissions.length > 0 ? (
        <div className="space-y-2">
          {filteredMissions.map((m) => (
            <MissionCard
              key={m.id}
              id={m.id}
              type={m.type}
              status={m.status}
              amount={m.amount}
              artisanName={m.artisan.user.name ?? "Artisan"}
              artisanAvatar={m.artisan.user.avatar}
              scheduledDate={m.scheduledDate}
              onClick={() => {
                if (["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(m.status)) {
                  router.push(`/tracking/${m.id}`);
                } else {
                  router.push(`/mission/${m.id}`);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={tab === "DISPUTED" ? <AlertTriangle className="w-6 h-6 text-grayText" /> : <FileText className="w-6 h-6 text-grayText" />}
          title={tab === "DISPUTED" ? "Aucun litige" : "Aucune mission"}
          description={tab === "all" ? "Réservez un artisan pour voir vos missions ici" : undefined}
        />
      )}
    </div>
  );
}
