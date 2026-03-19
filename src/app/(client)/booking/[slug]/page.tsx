"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Camera, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

interface ArtisanData {
  id: string;
  trade: string;
  hourlyRate: number | null;
  user: { name: string };
}

const slots = ["09h00", "11h00", "14h00", "16h00", "18h00"];
const stepLabels = ["Date", "Détails", "Confirmation"];

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: artisan, loading } = useFetch<ArtisanData>(`/api/artisans/${slug}`);

  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Generate calendar days for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const today = now.getDate();

  const handleSubmit = async () => {
    if (!artisan || !selectedDay || !selectedSlot) return;
    setSubmitting(true);
    try {
      const scheduledDate = new Date(year, month, selectedDay);
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanId: artisan.id,
          type: description.split("\n")[0] || `Intervention ${artisan.trade}`,
          category: artisan.trade,
          description,
          scheduledDate: scheduledDate.toISOString(),
          scheduledSlot: selectedSlot,
        }),
      });
      if (res.ok) {
        router.push("/missions");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8">
        <Skeleton height={400} variant="rectangular" />
      </div>
    );
  }

  const name = artisan?.user.name ?? "Artisan";

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">
        Réserver avec {name}
      </h1>
      <p className="text-sm text-grayText mb-6">{artisan?.trade}</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                i <= step ? "bg-deepForest text-white" : "bg-border text-grayText",
              )}
            >
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={cn("text-xs font-medium", i <= step ? "text-navy" : "text-grayText")}>
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <div className={cn("flex-1 h-0.5 rounded", i < step ? "bg-deepForest" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Date */}
      {step === 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-forest" />
            <h2 className="font-heading text-sm font-bold text-navy">
              {new Date(year, month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <div key={i} className="text-[10px] font-semibold text-grayText py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isPast = day < today;
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  disabled={isPast}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "h-9 rounded-lg text-sm font-medium transition-all",
                    isPast && "text-grayText/30 cursor-default",
                    !isPast && !isSelected && "text-navy hover:bg-forest/5",
                    isSelected && "bg-deepForest text-white font-bold",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <Button
            className="w-full mt-5"
            disabled={!selectedDay}
            onClick={() => setStep(1)}
          >
            Continuer
          </Button>
        </Card>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-forest" />
            <h2 className="font-heading text-sm font-bold text-navy">Créneau et détails</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "py-3 rounded-lg text-sm font-semibold transition-all",
                  selectedSlot === slot
                    ? "bg-deepForest text-white"
                    : "bg-surface text-navy hover:bg-border",
                )}
              >
                {slot}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Décrivez votre besoin (type de panne, urgence, accès...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-[100px] px-4 py-3 rounded-md border border-border bg-white text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest resize-y mb-3"
          />
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface text-forest text-sm font-medium hover:bg-border transition-colors mb-5">
            <Camera className="w-4 h-4" /> Ajouter photo / vidéo diagnostic
          </button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(0)}>Retour</Button>
            <Button className="flex-1" disabled={!selectedSlot} onClick={() => setStep(2)}>
              Continuer
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Confirmation */}
      {step === 2 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-4 h-4 text-success" />
            <h2 className="font-heading text-sm font-bold text-navy">Récapitulatif</h2>
          </div>
          <div className="space-y-3 mb-5">
            {[
              { label: "Artisan", value: name },
              { label: "Métier", value: artisan?.trade ?? "" },
              {
                label: "Date",
                value: selectedDay
                  ? new Date(year, month, selectedDay).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                  : "",
              },
              { label: "Créneau", value: selectedSlot ?? "" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-grayText">{row.label}</span>
                <span className="font-semibold text-navy">{row.value}</span>
              </div>
            ))}
            {description && (
              <div className="pt-3 border-t border-border">
                <div className="text-xs text-grayText mb-1">Description</div>
                <p className="text-sm text-navy">{description}</p>
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-forest/5 border border-forest/10 flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-forest" />
            <span className="text-xs text-forest font-medium">
              Paiement sécurisé par séquestre — L&apos;artisan est payé après validation
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
            <Button className="flex-1" loading={submitting} onClick={handleSubmit}>
              Confirmer la réservation
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
