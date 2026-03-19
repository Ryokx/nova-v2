"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  FileText,
  Lock,
  AlertTriangle,
  Shield,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/features/star-rating";
import { useFetch } from "@/hooks/use-fetch";
import { cn, formatPrice, getInitials } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MissionDetail {
  id: string;
  type: string;
  category: string | null;
  description: string | null;
  status: string;
  amount: number | null;
  address: string | null;
  scheduledDate: string | null;
  scheduledSlot: string | null;
  artisan: { trade: string; user: { name: string; avatar: string | null } };
  payment: { amount: number; status: string; commissionAmount: number | null } | null;
  devis: { id: string; number: string; totalHT: number; totalTTC: number; tva: number; items: unknown[] } | null;
  invoice: { id: string; number: string } | null;
  review: { id: string; rating: number } | null;
}

/* ------------------------------------------------------------------ */
/*  Mock data for prototype feel                                       */
/* ------------------------------------------------------------------ */

const mockMission: MissionDetail = {
  id: "1",
  type: "Plomberie",
  category: "Plomberie",
  description: "Réparation fuite sous évier cuisine. Remplacement du siphon et des joints.",
  status: "COMPLETED",
  amount: 320,
  address: "12 rue de la Paix, 75002 Paris",
  scheduledDate: "2026-03-12T10:00:00",
  scheduledSlot: "10h00",
  artisan: { trade: "Plombier", user: { name: "Jean-Michel P.", avatar: null } },
  payment: { amount: 320, status: "ESCROWED", commissionAmount: 16 },
  devis: { id: "d1", number: "DEV-2026-041", totalHT: 266.67, totalTTC: 320, tva: 53.33, items: [] },
  invoice: { id: "i1", number: "FAC-2026-041" },
  review: null,
};

/* ------------------------------------------------------------------ */
/*  Escrow stepper (horizontal, 4 steps)                               */
/* ------------------------------------------------------------------ */

const escrowLabels = [
  "Paiement bloqué",
  "Mission en cours",
  "Nous validons",
  "Artisan payé",
];

function getStep(status: string): number {
  const map: Record<string, number> = {
    PENDING: 0,
    ACCEPTED: 1,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    VALIDATED: 3,
    DISPUTED: 2,
  };
  return map[status] ?? 0;
}

function EscrowStepperH({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center w-full">
      {escrowLabels.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  done && "bg-success text-white",
                  active && "border-2 border-forest text-forest bg-white",
                  !done && !active && "bg-gray-100 text-grayText",
                )}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold text-center leading-tight whitespace-nowrap",
                  done ? "text-success" : active ? "text-forest" : "text-grayText",
                )}
              >
                {label}
              </span>
            </div>
            {i < escrowLabels.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 mt-[-18px]",
                  i < currentStep ? "bg-success" : "bg-gray-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge config                                                */
/* ------------------------------------------------------------------ */

const statusBadge: Record<string, { label: string; cls: string }> = {
  COMPLETED: { label: "À valider", cls: "bg-success/10 text-success" },
  VALIDATED: { label: "Validée", cls: "bg-gold/10 text-gold" },
  DISPUTED: { label: "Litige", cls: "bg-red/10 text-red" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: apiMission, loading, refetch } = useFetch<MissionDetail>(`/api/missions/${id}`);
  const [stars, setStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  const mission = apiMission ?? mockMission;

  if (loading) {
    return (
      <div className="max-w-[700px] mx-auto p-5 md:p-8 space-y-4">
        <Skeleton height={24} width={100} />
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  const name = mission.artisan.user.name ?? "Artisan";
  const initials = getInitials(name);
  const currentStep = getStep(mission.status);
  const isCompleted = mission.status === "COMPLETED" && !mission.review;
  const isDisputed = mission.status === "DISPUTED";
  const badge = statusBadge[mission.status] ?? {
    label: mission.review ? "Validée" : mission.status,
    cls: mission.review ? "bg-gold/10 text-gold" : "bg-surface text-forest",
  };

  const handleValidate = async () => {
    if (stars === 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId: mission.id, rating: stars }),
      });
      setValidated(true);
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  /* Validated success screen */
  if (validated || mission.review) {
    const amount = mission.amount ? formatPrice(mission.amount) : "";
    return (
      <div className="max-w-[700px] mx-auto p-5 md:p-8 text-center py-16 animate-in fade-in duration-500">
        <div className="w-[72px] h-[72px] rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5">
          <Check className="w-9 h-9 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">
          Mission validée !
        </h1>
        <p className="text-sm text-grayText mb-6">
          {amount} sera versé sous 48h à {name}.
        </p>
        <Button onClick={() => router.push("/missions")}>Retour aux missions</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-forest font-medium mb-5 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div>
            <h1 className="font-heading text-[22px] font-extrabold text-navy">{mission.type}</h1>
            <p className="text-sm text-grayText">
              {name} &middot; {mission.category}
            </p>
          </div>
        </div>
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold", badge.cls)}>
          {mission.review ? "Validée" : badge.label}
        </span>
      </div>

      {/* Escrow stepper */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-4">Suivi séquestre</h2>
        <EscrowStepperH currentStep={currentStep} />
      </Card>

      {/* Mission info grid */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Détails</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[11px] text-grayText">Catégorie</span>
            <div className="font-medium text-navy">{mission.category}</div>
          </div>
          <div>
            <span className="text-[11px] text-grayText">Adresse</span>
            <div className="font-medium text-navy">{mission.address ?? "---"}</div>
          </div>
          <div>
            <span className="text-[11px] text-grayText">Date / heure</span>
            <div className="font-medium text-navy">
              {mission.scheduledDate
                ? new Date(mission.scheduledDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "---"}
              {mission.scheduledSlot && ` à ${mission.scheduledSlot}`}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-grayText">Artisan</span>
            <div className="font-medium text-navy">{name}</div>
          </div>
        </div>
        {mission.description && (
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-[11px] text-grayText">Description</span>
            <p className="text-sm text-navy mt-1">{mission.description}</p>
          </div>
        )}
      </Card>

      {/* Financial breakdown */}
      {mission.devis && (
        <Card className="mb-4">
          <h2 className="font-heading text-sm font-bold text-navy mb-3">Paiement</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-grayText">Montant HT</span>
              <span className="font-mono font-semibold text-navy">{formatPrice(mission.devis.totalHT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-grayText">TVA (20%)</span>
              <span className="font-mono font-semibold text-navy">{formatPrice(mission.devis.tva)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold text-navy">Total TTC</span>
              <span className="font-mono text-lg font-bold text-navy">{formatPrice(mission.devis.totalTTC)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Documents */}
      <div className="flex gap-2 mb-5">
        {mission.devis && (
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] bg-surface text-forest text-sm font-medium hover:bg-border transition-colors">
            <Download className="w-4 h-4" />
            Devis #{mission.devis.number}
          </button>
        )}
        {mission.invoice ? (
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] bg-surface text-forest text-sm font-medium hover:bg-border transition-colors">
            <Download className="w-4 h-4" />
            Facture #{mission.invoice.number}
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] border border-dashed border-border text-grayText text-sm">
            <FileText className="w-4 h-4" /> Facture non disponible
          </div>
        )}
      </div>

      {/* Validation section */}
      {isCompleted && (
        <Card className="border-2 border-success/20">
          <h2 className="font-heading text-sm font-bold text-navy mb-3">
            Valider l&apos;intervention
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-grayText">Notez {name} :</span>
            <StarRating value={stars} onChange={setStars} size="lg" />
          </div>
          <button
            className={cn(
              "w-full py-3 rounded-[14px] bg-deepForest text-white font-bold font-heading text-sm transition-all flex items-center justify-center gap-2",
              stars > 0
                ? "hover:-translate-y-0.5 opacity-100"
                : "opacity-50 cursor-not-allowed",
            )}
            disabled={stars === 0 || submitting}
            onClick={handleValidate}
          >
            {submitting ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Shield className="w-4 h-4" />
            )}
            Valider — Libérer le paiement
          </button>
          <button className="w-full mt-2 py-2.5 rounded-[14px] text-red text-sm font-semibold hover:bg-red/5 transition-colors flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Signaler un litige
          </button>
        </Card>
      )}

      {/* Disputed state */}
      {isDisputed && (
        <Card className="bg-red/5 border-red/20">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red" />
            <span className="text-sm font-semibold text-red">
              Litige en cours — Le paiement est bloqué en attendant la résolution
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
