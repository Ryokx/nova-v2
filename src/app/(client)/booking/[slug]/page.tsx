"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
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

const slots = ["9h00", "11h00", "14h00", "16h00", "18h00"];
const stepLabels = ["Date", "Détails", "Confirmation"];
const availableDays = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29];

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: artisan, loading } = useFetch<ArtisanData>(`/api/artisans/${slug}`);

  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // March 2026 calendar
  const year = 2026;
  const month = 2; // March (0-indexed)
  const daysInMonth = 31;
  // March 1, 2026 is a Sunday => offset 6 (Lu=0..Di=6)
  const offset = 6;

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
      <div className="max-w-[560px] mx-auto px-5 py-8">
        <Skeleton height={400} variant="rectangular" />
      </div>
    );
  }

  const name = artisan?.user.name ?? "Artisan";

  return (
    <div className="max-w-[560px] mx-auto px-5 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      {/* Title */}
      <h1 className="font-heading text-2xl font-extrabold text-navy mb-5">
        Prendre rendez-vous
      </h1>

      {/* Step progress bar */}
      <div className="flex gap-2 mb-6">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={cn(
                "h-[3px] rounded-sm mb-1.5 transition-colors",
                i <= step ? "bg-deepForest" : "bg-border",
              )}
            />
            <span
              className={cn(
                "text-[11px]",
                i === step ? "font-bold text-navy" : i < step ? "font-normal text-navy" : "font-normal text-grayText",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card>
        {/* Step 0: Calendar */}
        {step === 0 && (
          <>
            <h3 className="font-heading text-[15px] font-bold text-navy mb-3.5">
              Mars 2026
            </h3>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1.5 mb-5">
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <div
                  key={i}
                  className="text-center text-[11px] font-semibold text-grayText/60 py-1"
                >
                  {d}
                </div>
              ))}

              {/* Empty cells for offset */}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`e${i}`} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isAvailable = availableDays.includes(day);
                const isSelected = day === selectedDay;
                return (
                  <button
                    key={day}
                    onClick={() => isAvailable && setSelectedDay(day)}
                    className={cn(
                      "w-[38px] h-[38px] rounded-[10px] border-none text-sm font-medium mx-auto transition-all",
                      isSelected
                        ? "bg-deepForest text-white font-bold cursor-pointer"
                        : isAvailable
                          ? "bg-surface text-navy hover:bg-border cursor-pointer"
                          : "bg-transparent text-grayText/40 cursor-default",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3 rounded-xl bg-deepForest text-white border-none text-sm font-semibold cursor-pointer hover:-translate-y-0.5 transition-transform"
            >
              Continuer
            </button>
          </>
        )}

        {/* Step 1: Time slot + description */}
        {step === 1 && (
          <>
            <h3 className="font-heading text-[15px] font-bold text-navy mb-3">
              Créneau
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    "px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all cursor-pointer",
                    selectedSlot === slot
                      ? "bg-deepForest text-white border-none"
                      : "bg-surface text-navy border border-border hover:bg-border",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Décrivez votre problème..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[100px] rounded-[14px] border border-border bg-white px-3.5 py-3.5 text-sm font-body text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest resize-none mb-3.5 box-border"
            />

            <button
              onClick={() => selectedSlot && setStep(2)}
              disabled={!selectedSlot}
              className={cn(
                "w-full py-3 rounded-xl border-none text-sm font-semibold cursor-pointer hover:-translate-y-0.5 transition-transform",
                selectedSlot
                  ? "bg-deepForest text-white"
                  : "bg-deepForest/50 text-white/70 cursor-default",
              )}
            >
              Continuer
            </button>
          </>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <>
            <h3 className="font-heading text-[15px] font-bold text-navy mb-3.5">
              Récapitulatif
            </h3>

            {/* Summary rows */}
            {[
              ["Artisan", name],
              ["Date", `${selectedDay} mars 2026`],
              ["Créneau", selectedSlot ?? "14h00"],
              ["Adresse", "12 rue de Rivoli, Paris 4e"],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={cn(
                  "flex justify-between py-2.5",
                  i > 0 && "border-t border-border",
                )}
              >
                <span className="text-[13px] text-grayText">{label}</span>
                <span className="text-[13px] font-semibold text-navy">{value}</span>
              </div>
            ))}

            {/* Escrow info badge */}
            <div className="bg-surface rounded-xl p-3 mt-4 mb-4 flex items-center gap-2 border border-forest/10">
              <Shield className="w-4 h-4 text-forest flex-shrink-0" />
              <span className="text-xs text-forest font-medium">
                Votre paiement sera sécurisé par séquestre
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-deepForest text-white border-none text-sm font-semibold cursor-pointer hover:-translate-y-0.5 transition-transform disabled:opacity-50"
            >
              {submitting ? "Confirmation..." : "Confirmer le rendez-vous"}
            </button>
          </>
        )}
      </Card>
    </div>
  );
}
