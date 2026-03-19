"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";

interface ArtisanStats {
  monthRevenue: number;
  activeMissions: number;
  pendingDevis: number;
  rating: number;
  upcomingAppointments: Array<{
    id: string;
    client: string;
    type: string;
    date: string;
    slot: string | null;
    status: string;
  }>;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "#F5A623" },
  ACCEPTED: { label: "Confirmé", color: "#22C88A" },
  IN_PROGRESS: { label: "En cours", color: "#1B6B4E" },
};

// Mock upcoming RDV (fallback when API returns empty)
const mockRdv = [
  { id: "m1", client: "Pierre M.", type: "Installation robinet", date: "Auj. 14h", status: "Confirmé", sColor: "#22C88A" },
  { id: "m2", client: "Amélie R.", type: "Réparation chauffe-eau", date: "Dem. 9h", status: "En cours", sColor: "#1B6B4E" },
  { id: "m3", client: "Luc D.", type: "Diagnostic fuite", date: "18 mars 11h", status: "En attente", sColor: "#F5A623" },
];

export default function ArtisanDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: stats, loading } = useFetch<ArtisanStats>("/api/artisan/stats");

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto" style={{ padding: "32px 20px" }}>
        <Skeleton height={32} width={300} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-7">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={100} />)}
        </div>
        <Skeleton variant="rectangular" height={100} className="mt-7" />
        <Skeleton variant="rectangular" height={200} className="mt-5" />
      </div>
    );
  }

  const appointments = stats?.upcomingAppointments ?? [];
  const rdvList = appointments.length > 0
    ? appointments.map((a) => {
        const st = statusConfig[a.status] ?? { label: a.status, color: "#6B7280" };
        const dateStr = a.date
          ? new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
          : "";
        return { id: a.id, client: a.client, type: a.type, date: `${dateStr}${a.slot ? ` ${a.slot}` : ""}`, status: st.label, sColor: st.color };
      })
    : mockRdv;

  return (
    <div className="max-w-[900px] mx-auto" style={{ padding: "32px 20px" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <div>
          <h1 className="font-heading text-[26px] font-extrabold text-navy" style={{ margin: "0 0 4px" }}>
            Bonjour {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-grayText m-0">Artisan Certifié Nova • #2847</p>
        </div>
        <div className="hidden md:flex gap-2">
          <Link
            href="/artisan-devis/new"
            className="px-5 py-2.5 rounded-md bg-deepForest text-white text-[13px] font-semibold cursor-pointer border-none"
          >
            Créer un devis
          </Link>
          <Link
            href="/artisan-invoices"
            className="px-5 py-2.5 rounded-md bg-white text-navy text-[13px] font-semibold cursor-pointer border border-border"
          >
            Facture
          </Link>
        </div>
      </div>

      {/* Stats — 4 column grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-7">
        {[
          { label: "Revenus du mois", value: `${stats?.monthRevenue ?? 4820}€`, icon: "💶", href: "/artisan-payments" },
          { label: "Missions en cours", value: String(stats?.activeMissions ?? 3), icon: "🔧", href: "/artisan-documents" },
          { label: "Devis en attente", value: String(stats?.pendingDevis ?? 2), icon: "📄", href: "/artisan-documents" },
          { label: "Note moyenne", value: `★ ${stats?.rating ?? 4.9}`, icon: "⭐", href: "/artisan-profile" },
        ].map((s) => (
          <div
            key={s.label}
            onClick={() => router.push(s.href)}
            className="bg-white rounded-xl p-5 border border-border shadow-sm text-center cursor-pointer hover:-translate-y-0.5 transition-transform"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-mono text-xl font-bold text-navy">{s.value}</div>
            <div className="text-[11px] text-grayText mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Urgent demand */}
      <div
        className="bg-white rounded-xl p-6 shadow-sm mb-5"
        style={{ border: "1px solid rgba(232,48,42,0.12)" }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <div>
              <div className="text-sm font-bold text-red">Fuite d&apos;eau urgente</div>
              <div className="text-xs text-grayText">Secteur Paris 9e • Il y a 4 min</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-[10px] bg-success text-white border-none text-xs font-semibold cursor-pointer">
              Accepter
            </button>
            <button className="px-4 py-2 rounded-[10px] bg-surface text-[#4A5568] border-none text-xs font-semibold cursor-pointer">
              Voir
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming RDV */}
      <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
        <h3 className="text-base font-bold text-navy" style={{ margin: "0 0 16px" }}>Prochains rendez-vous</h3>
        {rdvList.map((r, i) => (
          <div
            key={r.id}
            className="flex justify-between items-center"
            style={{ padding: "12px 0", borderTop: i ? "1px solid #D4EBE0" : "none" }}
          >
            <div>
              <div className="text-sm font-semibold text-navy">{r.client}</div>
              <div className="text-xs text-grayText">{r.type} • {r.date}</div>
            </div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              style={{ color: r.sColor, background: r.sColor + "12" }}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
