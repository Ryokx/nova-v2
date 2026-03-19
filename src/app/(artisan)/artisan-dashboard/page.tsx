"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Zap, DollarSign, Wrench, FileText, Star, Check, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";

interface ArtisanStats {
  monthRevenue: number;
  activeMissions: number;
  pendingDevis: number;
  rating: number;
  reviewCount: number;
  upcomingAppointments: Array<{
    id: string;
    client: string;
    type: string;
    date: string;
    slot: string | null;
    status: string;
  }>;
}

export default function ArtisanDashboardPage() {
  const { data: session } = useSession();
  const { data: stats, loading } = useFetch<ArtisanStats>("/api/artisan/stats");

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto p-5 md:p-8 space-y-5">
        <Skeleton height={32} width={300} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rectangular" height={100} />)}
        </div>
        <Skeleton variant="rectangular" height={100} />
        <Skeleton variant="rectangular" height={200} />
      </div>
    );
  }

  const statCards = [
    { label: "Revenus du mois", value: formatPrice(stats?.monthRevenue ?? 0), icon: <DollarSign className="w-5 h-5" />, href: "/artisan-payments" },
    { label: "Missions en cours", value: stats?.activeMissions ?? 0, icon: <Wrench className="w-5 h-5" />, href: "/artisan-documents" },
    { label: "Devis en attente", value: stats?.pendingDevis ?? 0, icon: <FileText className="w-5 h-5" />, href: "/artisan-documents" },
    { label: "Note moyenne", value: `★ ${stats?.rating ?? 0}`, icon: <Star className="w-5 h-5" />, href: "/artisan-profile" },
  ];

  const appointments = stats?.upcomingAppointments ?? [];

  return (
    <div className="max-w-[900px] mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-[26px] font-extrabold text-navy">
            Bonjour {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-grayText">Artisan Certifié Nova • #2847</p>
        </div>
        <div className="hidden md:flex gap-2">
          <Link href="/artisan-devis/new">
            <Button size="sm">Créer un devis</Button>
          </Link>
          <Link href="/artisan-invoices">
            <Button variant="outline" size="sm">Facture</Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card hover className="text-center py-5">
              <div className="flex justify-center mb-2 text-forest">{s.icon}</div>
              <div className="font-mono text-xl font-bold text-navy">{s.value}</div>
              <div className="text-[11px] text-grayText mt-1">{s.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Urgent alert */}
      <Card className="mb-5 border-red/15 bg-red/[0.02]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red/10 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-red" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-navy">Fuite d&apos;eau urgente</div>
            <div className="text-xs text-grayText">Secteur Paris 9e • Il y a 4 min</div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" className="bg-success hover:bg-success/90 text-xs px-3">
              <Check className="w-3 h-3 mr-1" /> Accepter
            </Button>
            <Button variant="outline" size="sm" className="text-xs px-3">
              <Eye className="w-3 h-3 mr-1" /> Voir
            </Button>
          </div>
        </div>
      </Card>

      {/* Upcoming appointments */}
      <Card>
        <h2 className="font-heading text-base font-bold text-navy mb-4">Prochains rendez-vous</h2>
        {appointments.length === 0 ? (
          <p className="text-sm text-grayText text-center py-6">Aucun rendez-vous à venir</p>
        ) : (
          <div className="space-y-0">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <Avatar name={apt.client} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy">{apt.client}</div>
                  <div className="text-xs text-grayText truncate">{apt.type}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-medium text-navy">
                    {apt.date ? new Date(apt.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : ""}
                    {apt.slot && ` ${apt.slot}`}
                  </div>
                  <Badge
                    variant={apt.status === "ACCEPTED" ? "success" : apt.status === "PENDING" ? "warning" : "info"}
                    className="text-[10px] mt-0.5"
                  >
                    {apt.status === "ACCEPTED" ? "Confirmé" : apt.status === "PENDING" ? "En attente" : "En cours"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
