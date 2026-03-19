"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone, Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EscrowStepper } from "@/components/features/escrow-stepper";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";

interface TrackingMission {
  id: string;
  type: string;
  status: string;
  amount: number | null;
  address: string | null;
  scheduledDate: string | null;
  scheduledSlot: string | null;
  artisan: {
    trade: string;
    user: { name: string; avatar: string | null };
  };
  payment: { amount: number; status: string } | null;
}

function getTrackingStep(status: string): number {
  switch (status) {
    case "PENDING": return 0;
    case "ACCEPTED": return 1;
    case "IN_PROGRESS": return 2;
    case "COMPLETED": return 3;
    default: return 0;
  }
}

const statusLabels: Record<string, { label: string; bg: string }> = {
  PENDING: { label: "En attente", bg: "bg-gold/10 text-gold" },
  ACCEPTED: { label: "Artisan en route", bg: "bg-forest/10 text-forest" },
  IN_PROGRESS: { label: "Sur place", bg: "bg-success/10 text-success" },
  COMPLETED: { label: "Terminée", bg: "bg-success/10 text-success" },
};

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: mission, loading } = useFetch<TrackingMission>(`/api/missions/${id}`);

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 space-y-4">
        <Skeleton height={24} width={100} />
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="rectangular" height={300} />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 text-center py-20">
        <p className="text-grayText">Mission introuvable</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/missions")}>
          Retour aux missions
        </Button>
      </div>
    );
  }

  const name = mission.artisan.user.name ?? "Artisan";
  const currentStep = getTrackingStep(mission.status);
  const statusInfo = statusLabels[mission.status] ?? { label: "En attente", bg: "bg-gold/10 text-gold" };

  const steps = [
    { label: "Devis signé", description: "Paiement bloqué en séquestre" },
    { label: "Artisan en route", description: `${name} arrive dans ~15 min` },
    { label: "Sur place", description: "Intervention en cours" },
    { label: "Terminée", description: "En attente de votre validation" },
  ];

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <button
        onClick={() => router.push("/missions")}
        className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Missions
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">{mission.type}</h1>
      <p className="text-sm text-grayText mb-5">{mission.address ?? "Adresse non renseignée"}</p>

      {/* Artisan card */}
      <Card className="flex items-center gap-3.5 mb-4">
        <Avatar name={name} src={mission.artisan.user.avatar} size="lg" />
        <div className="flex-1">
          <div className="font-semibold text-sm text-navy">{name}</div>
          <div className="text-xs text-grayText">{mission.artisan.trade}</div>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-forest hover:bg-border transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-forest hover:bg-border transition-colors">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Status */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-sm font-bold text-navy">Suivi en temps réel</h2>
          <Badge className={statusInfo.bg}>{statusInfo.label}</Badge>
        </div>
        <EscrowStepper steps={steps} currentStep={currentStep} />
      </Card>

      {/* Escrow info */}
      {mission.payment && (
        <Card className="bg-gradient-to-br from-deepForest to-forest text-white mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-lightSage" />
            <span className="text-xs font-bold text-lightSage">Paiement en séquestre</span>
          </div>
          <div className="font-mono text-2xl font-bold">{formatPrice(mission.payment.amount)}</div>
          <div className="text-xs text-white/50 mt-0.5">
            Protégé jusqu&apos;à validation de l&apos;intervention
          </div>
        </Card>
      )}

      {/* Action buttons */}
      {mission.status === "COMPLETED" && (
        <Button
          className="w-full"
          size="lg"
          onClick={() => router.push(`/mission/${mission.id}`)}
        >
          Valider l&apos;intervention
        </Button>
      )}
    </div>
  );
}
