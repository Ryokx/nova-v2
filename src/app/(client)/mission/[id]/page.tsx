"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, FileText, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EscrowStepper } from "@/components/features/escrow-stepper";
import { StarRating } from "@/components/features/star-rating";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";

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

function getStep(status: string): number {
  const map: Record<string, number> = { PENDING: 0, ACCEPTED: 1, IN_PROGRESS: 1, COMPLETED: 2, VALIDATED: 3, DISPUTED: 2 };
  return map[status] ?? 0;
}

export default function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: mission, loading, refetch } = useFetch<MissionDetail>(`/api/missions/${id}`);
  const [stars, setStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  if (loading) {
    return (
      <div className="max-w-[700px] mx-auto p-5 md:p-8 space-y-4">
        <Skeleton height={24} width={100} />
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="max-w-[700px] mx-auto p-5 md:p-8 text-center py-20">
        <p className="text-grayText">Mission introuvable</p>
      </div>
    );
  }

  const name = mission.artisan.user.name ?? "Artisan";
  const currentStep = getStep(mission.status);
  const isCompleted = mission.status === "COMPLETED" && !mission.review;
  const isDisputed = mission.status === "DISPUTED";

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

  const steps = [
    { label: "Devis signé", description: "Paiement bloqué en séquestre" },
    { label: "Intervention", description: "L'artisan est intervenu" },
    { label: "Validation", description: "En attente de votre validation" },
    { label: "Paiement libéré", description: "L'artisan est payé" },
  ];

  // Success state after validation
  if (validated) {
    return (
      <div className="max-w-[700px] mx-auto p-5 md:p-8 text-center py-16 animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">
          Mission validée ! 🎉
        </h1>
        <p className="text-sm text-grayText mb-6">
          Le paiement de {mission.amount ? formatPrice(mission.amount) : ""} sera libéré sous 48h vers {name}.
        </p>
        <Button onClick={() => router.push("/missions")}>Retour aux missions</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto p-5 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-heading text-[22px] font-extrabold text-navy">{mission.type}</h1>
          <p className="text-sm text-grayText">{name} • {mission.category}</p>
        </div>
        <Badge variant={isDisputed ? "danger" : mission.review ? "success" : "warning"}>
          {isDisputed ? "Litige" : mission.review ? "Validée" : mission.status === "COMPLETED" ? "À valider" : mission.status}
        </Badge>
      </div>

      {/* Escrow stepper */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Suivi</h2>
        <EscrowStepper steps={steps} currentStep={currentStep} />
      </Card>

      {/* Mission info */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Détails</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[11px] text-grayText">Catégorie</span>
            <div className="font-medium text-navy">{mission.category}</div>
          </div>
          <div>
            <span className="text-[11px] text-grayText">Adresse</span>
            <div className="font-medium text-navy">{mission.address ?? "—"}</div>
          </div>
          <div>
            <span className="text-[11px] text-grayText">Date</span>
            <div className="font-medium text-navy">
              {mission.scheduledDate
                ? new Date(mission.scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                : "—"}
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

      {/* Payment breakdown */}
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
          <button className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg bg-forest/5 text-forest text-sm font-medium hover:bg-forest/10 transition-colors">
            <FileText className="w-4 h-4" />
            <span>Devis <span className="font-mono text-xs">#{mission.devis.number}</span></span>
          </button>
        )}
        {mission.invoice ? (
          <button className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg bg-forest/5 text-forest text-sm font-medium hover:bg-forest/10 transition-colors">
            <FileText className="w-4 h-4" />
            <span>Facture <span className="font-mono text-xs">#{mission.invoice.number}</span></span>
          </button>
        ) : (
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border text-grayText text-sm">
            <FileText className="w-4 h-4" /> Facture non disponible
          </div>
        )}
      </div>

      {/* Validation / Rating */}
      {isCompleted && (
        <Card className="border-2 border-success/20">
          <h2 className="font-heading text-sm font-bold text-navy mb-3">Valider l&apos;intervention</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-grayText">Notez {name} :</span>
            <StarRating value={stars} onChange={setStars} size="lg" />
          </div>
          <Button
            className="w-full bg-success hover:bg-success/90"
            disabled={stars === 0}
            loading={submitting}
            onClick={handleValidate}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Valider — Libérer le paiement
          </Button>
          <button className="w-full mt-2 py-2.5 rounded-lg bg-red/5 text-red text-sm font-semibold hover:bg-red/10 transition-colors">
            <AlertTriangle className="w-4 h-4 inline mr-1.5" />
            Signaler un problème
          </button>
        </Card>
      )}

      {/* Already validated */}
      {mission.review && (
        <Card className="bg-success/5 border-success/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm font-semibold text-success">
              Mission validée — Paiement en cours de libération
            </span>
          </div>
        </Card>
      )}

      {/* Disputed */}
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
