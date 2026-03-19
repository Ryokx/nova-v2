"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Check,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { cn, formatPrice, getInitials } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Timeline steps                                                     */
/* ------------------------------------------------------------------ */

interface TimelineStep {
  label: string;
  time: string;
  description?: string;
}

const timelineSteps: TimelineStep[] = [
  { label: "Devis signé", time: "14:02", description: "Paiement bloqué en séquestre" },
  { label: "Artisan en route", time: "14:35", description: "Estimation ~15 min" },
  { label: "Sur place", time: "14:52", description: "Intervention en cours" },
  { label: "Terminé", time: "15:40", description: "En attente de validation" },
];

/* ------------------------------------------------------------------ */
/*  Status banners                                                     */
/* ------------------------------------------------------------------ */

const statusBanners: Record<number, { text: string; cls: string }> = {
  0: { text: "Devis signé — En attente de l'artisan", cls: "bg-surface text-forest border border-border" },
  1: { text: "En route vers vous — ~15 min", cls: "bg-gold/10 text-gold border border-gold/20" },
  2: { text: "Intervention en cours", cls: "bg-success/10 text-success border border-success/20" },
  3: { text: "Terminée — En attente de validation", cls: "bg-success/10 text-success border border-success/20" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: mission, loading } = useFetch<TrackingMission>(`/api/missions/${id}`);

  // Demo step state for prototype cycling
  const [demoStep, setDemoStep] = useState(1);

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 space-y-4">
        <Skeleton height={24} width={100} />
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="rectangular" height={300} />
      </div>
    );
  }

  // Fallback values for prototype
  const name = mission?.artisan.user.name ?? "Marc Dupont";
  const trade = mission?.artisan.trade ?? "Plombier";
  const missionType = mission?.type ?? "Fuite sous évier";
  const initials = getInitials(name);
  const currentStep = demoStep;
  const banner = statusBanners[currentStep] ?? statusBanners[0] ?? { text: "", cls: "" };

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      {/* Back */}
      <button
        onClick={() => router.push("/missions")}
        className="flex items-center gap-1.5 text-sm text-forest font-medium mb-5 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Missions
      </button>

      {/* Artisan card */}
      <Card className="flex items-center gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-heading font-semibold text-sm text-navy">{name}</div>
          <div className="text-xs text-grayText">{trade}</div>
          <div className="text-xs text-forest font-medium mt-0.5">{missionType}</div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-[12px] bg-surface flex items-center justify-center text-forest hover:bg-border transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-[12px] bg-surface flex items-center justify-center text-forest hover:bg-border transition-colors">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Status banner */}
      <div className={cn("px-4 py-3 rounded-[14px] text-sm font-semibold text-center mb-5", banner.cls)}>
        {banner.text}
      </div>

      {/* Vertical timeline */}
      <Card className="mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-4">Suivi en temps réel</h2>
        <div className="flex flex-col">
          {timelineSteps.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const future = i > currentStep;

            return (
              <div key={i} className="flex gap-3">
                {/* Vertical line + circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      done && "bg-success text-white",
                      active && "border-2 border-forest text-forest bg-white",
                      future && "bg-gray-100 text-grayText",
                    )}
                  >
                    {done ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 flex-1 min-h-[28px]",
                        done ? "bg-success" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-5 pt-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        done ? "text-success" : active ? "text-navy" : "text-grayText",
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="font-mono text-[11px] text-grayText">{step.time}</span>
                  </div>
                  {step.description && (
                    <div className={cn("text-xs mt-0.5", future ? "text-grayText/50" : "text-grayText")}>
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Escrow info */}
      {(mission?.payment || true) && (
        <Card className="bg-gradient-to-br from-deepForest to-forest text-white mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-lightSage" />
            <span className="text-xs font-bold text-lightSage">Paiement en séquestre</span>
          </div>
          <div className="font-mono text-2xl font-bold">
            {mission?.payment ? formatPrice(mission.payment.amount) : "320,00\u00A0\u20AC"}
          </div>
          <div className="text-xs text-white/50 mt-0.5">
            Protégé jusqu&apos;à validation de l&apos;intervention
          </div>
        </Card>
      )}

      {/* Demo controls */}
      <div className="flex gap-2 mb-4">
        {[0, 1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setDemoStep(s)}
            className={cn(
              "flex-1 py-2 rounded-[10px] text-xs font-semibold transition-all",
              demoStep === s
                ? "bg-deepForest text-white"
                : "bg-white border border-border text-navy hover:bg-surface",
            )}
          >
            Étape {s + 1}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-grayText text-center mb-5">
        Boutons de démo — Cliquez pour simuler la progression
      </p>

      {/* Validate button (appears at last step) */}
      {currentStep === 3 && (
        <Button
          className="w-full"
          size="lg"
          onClick={() => router.push(`/mission/${mission?.id ?? id}`)}
        >
          Valider l&apos;intervention
        </Button>
      )}
    </div>
  );
}
