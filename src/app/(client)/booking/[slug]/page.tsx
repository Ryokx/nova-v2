"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft, Shield, Star, CreditCard, Lock, Check,
  Calendar, Clock, Zap, Bell, ChevronRight, MapPin,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

interface ArtisanData {
  id: string;
  trade: string;
  travelFee: number;
  rating: number;
  reviewCount: number;
  missionCount: number;
  isVerified: boolean;
  city: string | null;
  user: { id: string; name: string; avatar: string | null };
}

const slots = ["9h00", "10h00", "11h00", "14h00", "15h00", "16h00", "18h00"];
const availableDays = [24, 25, 26, 27, 28, 29, 31];
const stepLabels = ["Votre demande", "Paiement", "Confirmation"];

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { data: artisan, loading } = useFetch<ArtisanData>(`/api/artisans/${slug}`);

  const isUrgency = searchParams.get("mode") === "urgence";

  const [step, setStep] = useState(0);

  // Step 0: Request details
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  // Step 1: Payment
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  // Step 2: Confirmation
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Pre-fill card holder name from session
  useEffect(() => {
    if (session?.user?.name) {
      setCardName(session.user.name);
    }
  }, [session]);

  // Format card number with spaces
  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  // Format expiry as MM/YY
  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  const canProceedStep0 = isUrgency
    ? description.length >= 10
    : selectedDay !== null && selectedSlot !== null && description.length >= 10;

  const canProceedStep1 =
    cardNumber.replace(/\s/g, "").length === 16 &&
    cardExpiry.length === 5 &&
    cardCvc.length >= 3 &&
    cardName.length >= 2;

  const handleConfirm = async () => {
    if (!artisan) return;
    setSubmitting(true);
    try {
      const scheduledDate = isUrgency
        ? new Date().toISOString()
        : new Date(2026, 2, selectedDay!).toISOString();

      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanId: artisan.id,
          type: description.split("\n")[0] || `Intervention ${artisan.trade}`,
          category: artisan.trade,
          description,
          scheduledDate,
          scheduledSlot: isUrgency ? "ASAP" : selectedSlot,
          isUrgency,
        }),
      });
      if (res.ok) {
        setConfirmed(true);
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

  const name = artisan?.user?.name ?? "Artisan";
  const initials = getInitials(name);
  const trade = artisan?.trade ?? "Artisan";
  const rating = artisan?.rating ?? 4.9;
  const reviewCount = artisan?.reviewCount ?? 127;
  const city = artisan?.city ?? "Paris";

  // ━━━ SUCCESS STATE ━━━
  if (confirmed) {
    return (
      <div className="max-w-[560px] mx-auto px-5 py-8">
        <div className="bg-white border border-border rounded-[5px] p-8 text-center shadow-sm">
          {/* Success animation */}
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
            <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center animate-pageIn">
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
          </div>

          <h1 className="font-heading text-[24px] font-extrabold text-navy mb-2">
            Demande confirmée !
          </h1>
          <p className="text-sm text-grayText leading-relaxed max-w-[360px] mx-auto mb-6">
            {isUrgency
              ? `Votre demande d'urgence a été envoyée à ${name}. Il sera notifié immédiatement.`
              : `Votre rendez-vous avec ${name} est confirmé. Il a été notifié et reviendra vers vous sous peu.`}
          </p>

          {/* Artisan notified card */}
          <div className="bg-surface rounded-[5px] p-4 mb-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-[5px] bg-gradient-to-br from-forest to-sage flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">{initials}</span>
              </div>
              <div className="text-left flex-1">
                <div className="font-heading text-[15px] font-bold text-navy">{name}</div>
                <div className="text-xs text-grayText">{trade} · {city}</div>
              </div>
              <div className="flex items-center gap-1.5 bg-success/10 px-2.5 py-1 rounded-lg">
                <Bell className="w-3.5 h-3.5 text-success" />
                <span className="text-[11px] font-bold text-success">Notifié</span>
              </div>
            </div>

            <div className="space-y-2">
              {!isUrgency && (
                <div className="flex justify-between text-xs">
                  <span className="text-grayText">Date</span>
                  <span className="font-semibold text-navy">{selectedDay} mars 2026 à {selectedSlot}</span>
                </div>
              )}
              {isUrgency && (
                <div className="flex justify-between text-xs">
                  <span className="text-grayText">Mode</span>
                  <span className="font-semibold text-red">Urgence — Intervention rapide</span>
                </div>
              )}
            </div>
          </div>

          {/* Escrow badge */}
          <div className="bg-deepForest/5 rounded-[5px] p-3.5 flex items-center gap-3 mb-6 border border-forest/10">
            <Lock className="w-5 h-5 text-forest shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-navy">Paiement protégé par séquestre</div>
              <div className="text-[11px] text-grayText">Votre argent ne sera débité qu'après validation de l'intervention</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => router.push("/missions")}
              className="w-full py-3.5 rounded-[5px] bg-deepForest text-white font-bold text-sm hover:-translate-y-0.5 transition-transform"
            >
              Voir mes missions
            </button>
            <button
              onClick={() => router.push("/artisans")}
              className="w-full py-3 rounded-[5px] bg-white border border-border text-navy font-semibold text-sm hover:-translate-y-0.5 transition-transform"
            >
              Rechercher un artisan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ━━━ MAIN BOOKING FLOW ━━━
  return (
    <div className="max-w-[560px] mx-auto px-5 py-8">
      {/* Back button */}
      <button
        onClick={() => step > 0 ? setStep(step - 1) : router.back()}
        className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> {step > 0 ? "Étape précédente" : "Retour"}
      </button>

      {/* Title */}
      <div className="flex items-center gap-3 mb-5">
        <h1 className="font-heading text-2xl font-extrabold text-navy">
          {isUrgency ? "Intervention urgente" : "Prendre rendez-vous"}
        </h1>
        {isUrgency && (
          <span className="px-2.5 py-1 rounded-lg bg-red/10 text-red text-xs font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" /> Urgence
          </span>
        )}
      </div>

      {/* Artisan summary (always visible) */}
      <div className="bg-white border border-border rounded-[5px] p-4 mb-5 flex items-center gap-3.5 shadow-sm">
        <div className={cn(
          "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
          isUrgency ? "bg-gradient-to-br from-red to-red/70" : "bg-gradient-to-br from-forest to-sage",
        )}>
          <span className="text-white font-heading font-bold text-sm">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-navy truncate">{name}</span>
            <Shield className="w-3.5 h-3.5 text-forest shrink-0" />
          </div>
          <div className="text-xs text-grayText">{trade} · {city}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="text-sm font-bold text-navy">{rating}</span>
          </div>
          <div className="text-[10px] text-grayText">{reviewCount} avis</div>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex gap-2 mb-6">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={cn(
                "h-[3px] rounded-sm mb-1.5 transition-all duration-300",
                i <= step ? (isUrgency ? "bg-red" : "bg-deepForest") : "bg-border",
              )}
            />
            <span
              className={cn(
                "text-[11px]",
                i === step ? "font-bold text-navy" : i < step ? "font-medium text-forest" : "font-normal text-grayText",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ━━━ STEP 0: Request Details ━━━ */}
      {step === 0 && (
        <div className="bg-white border border-border rounded-[5px] p-6 shadow-sm">
          {isUrgency ? (
            <>
              {/* Urgency banner */}
              <div className="bg-red/[0.05] border border-red/20 rounded-[5px] px-4 py-3 mb-5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-red" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">Intervention au plus vite</p>
                  <p className="text-xs text-grayText leading-relaxed mt-0.5">
                    L'artisan sera notifié immédiatement et vous contactera dans les plus brefs délais.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-navy mb-2 block">
                  Décrivez votre urgence <span className="text-red">*</span>
                </label>
                <textarea
                  placeholder="Ex : Fuite d'eau importante sous l'évier de la cuisine, le sol est inondé..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-[120px] rounded-[5px] border border-border bg-bgPage px-4 py-3.5 text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red resize-none transition-all"
                />
                <div className="text-[11px] text-grayText mt-1.5">
                  {description.length}/10 caractères minimum
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Date selection */}
              <h3 className="font-heading text-[15px] font-bold text-navy mb-3.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest" /> Choisissez une date
              </h3>

              <div className="mb-5">
                <div className="text-xs font-semibold text-grayText mb-2">Mars 2026</div>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1.5 mb-1">
                  {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                    <div key={i} className="text-center text-[11px] font-semibold text-grayText/60 py-1">{d}</div>
                  ))}

                  {/* March 2026: starts on Sunday (offset 6) */}
                  {Array.from({ length: 6 }).map((_, i) => <div key={`e${i}`} />)}

                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isAvailable = availableDays.includes(day);
                    const isSelected = day === selectedDay;
                    return (
                      <button
                        key={day}
                        onClick={() => isAvailable && setSelectedDay(day)}
                        className={cn(
                          "w-[38px] h-[38px] rounded-[5px] border-none text-sm font-medium mx-auto transition-all",
                          isSelected
                            ? "bg-deepForest text-white font-bold cursor-pointer"
                            : isAvailable
                              ? "bg-surface text-navy hover:bg-border cursor-pointer"
                              : "bg-transparent text-grayText/30 cursor-default",
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slot */}
              <h3 className="font-heading text-[15px] font-bold text-navy mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-forest" /> Choisissez un créneau
              </h3>

              <div className="flex flex-wrap gap-2 mb-5">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "px-4 py-2.5 rounded-[5px] text-sm font-semibold transition-all cursor-pointer",
                      selectedSlot === slot
                        ? "bg-deepForest text-white border-none"
                        : "bg-surface text-navy border border-border hover:bg-border",
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-navy mb-2 block">
                  Décrivez votre besoin <span className="text-red">*</span>
                </label>
                <textarea
                  placeholder="Ex : Fuite sous l'évier de la cuisine, le joint semble usé..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-[100px] rounded-[5px] border border-border bg-bgPage px-4 py-3.5 text-sm text-navy placeholder:text-grayText/50 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none transition-all"
                />
              </div>
            </>
          )}

          <button
            onClick={() => canProceedStep0 && setStep(1)}
            disabled={!canProceedStep0}
            className={cn(
              "w-full py-3.5 rounded-[5px] text-white font-bold text-sm transition-all flex items-center justify-center gap-2",
              canProceedStep0
                ? (isUrgency ? "bg-red hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(232,48,42,0.2)]" : "bg-deepForest hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(10,64,48,0.2)]")
                : "bg-border text-grayText cursor-default",
            )}
          >
            Continuer <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ━━━ STEP 1: Payment Method ━━━ */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Escrow explanation */}
          <div className="bg-deepForest/[0.04] border border-forest/15 rounded-[5px] p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-[5px] bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-5 h-5 text-forest" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy mb-1">Paiement par séquestre</p>
              <p className="text-xs text-grayText leading-relaxed">
                Votre carte sera enregistrée mais <span className="font-semibold text-navy">aucun montant ne sera débité maintenant</span>.
                Le paiement sera bloqué en séquestre uniquement après acceptation du devis, et libéré après validation de l'intervention.
              </p>
            </div>
          </div>

          {/* Card form */}
          <div className="bg-white border border-border rounded-[5px] p-6 shadow-sm">
            <h3 className="font-heading text-[15px] font-bold text-navy mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-forest" /> Moyen de paiement
            </h3>

            <div className="space-y-3.5">
              {/* Card number */}
              <div>
                <label className="text-xs font-semibold text-grayText mb-1.5 block">Numéro de carte</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="w-full h-12 pl-4 pr-12 rounded-[5px] border border-border bg-bgPage text-sm text-navy font-mono placeholder:text-grayText/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-7 h-5 rounded bg-navy/5 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-navy">VISA</span>
                    </div>
                    <div className="w-7 h-5 rounded bg-navy/5 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-navy">MC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expiry + CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-grayText mb-1.5 block">Expiration</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    className="w-full h-12 px-4 rounded-[5px] border border-border bg-bgPage text-sm text-navy font-mono placeholder:text-grayText/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-grayText mb-1.5 block">CVC</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="w-full h-12 px-4 rounded-[5px] border border-border bg-bgPage text-sm text-navy font-mono placeholder:text-grayText/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                  />
                </div>
              </div>

              {/* Card holder name */}
              <div>
                <label className="text-xs font-semibold text-grayText mb-1.5 block">Titulaire de la carte</label>
                <input
                  type="text"
                  placeholder="Nom sur la carte"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full h-12 px-4 rounded-[5px] border border-border bg-bgPage text-sm text-navy placeholder:text-grayText/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                />
              </div>

              {/* Save card checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <button
                  type="button"
                  onClick={() => setSaveCard(!saveCard)}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                    saveCard
                      ? "bg-forest border-forest"
                      : "bg-white border-border",
                  )}
                >
                  {saveCard && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </button>
                <span className="text-xs text-grayText">Enregistrer cette carte pour mes futurs paiements</span>
              </label>
            </div>
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4">
            {[
              { icon: <Lock className="w-3 h-3" />, text: "SSL 256-bit" },
              { icon: <Shield className="w-3 h-3" />, text: "3D Secure" },
              { icon: <CreditCard className="w-3 h-3" />, text: "PCI DSS" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1 text-[11px] text-grayText font-medium">
                {b.icon} {b.text}
              </div>
            ))}
          </div>

          <button
            onClick={() => canProceedStep1 && setStep(2)}
            disabled={!canProceedStep1}
            className={cn(
              "w-full py-3.5 rounded-[5px] text-white font-bold text-sm transition-all flex items-center justify-center gap-2",
              canProceedStep1
                ? (isUrgency ? "bg-red hover:-translate-y-0.5" : "bg-deepForest hover:-translate-y-0.5")
                : "bg-border text-grayText cursor-default",
            )}
          >
            Continuer <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ━━━ STEP 2: Confirmation ━━━ */}
      {step === 2 && (
        <div className="bg-white border border-border rounded-[5px] p-6 shadow-sm">
          <h3 className="font-heading text-[15px] font-bold text-navy mb-4">
            Récapitulatif
          </h3>

          {/* Summary rows */}
          <div className="divide-y divide-border mb-5">
            <div className="flex justify-between py-3">
              <span className="text-[13px] text-grayText">Artisan</span>
              <span className="text-[13px] font-semibold text-navy">{name}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-[13px] text-grayText">Métier</span>
              <span className="text-[13px] font-semibold text-navy">{trade}</span>
            </div>
            {isUrgency ? (
              <div className="flex justify-between py-3">
                <span className="text-[13px] text-grayText">Mode</span>
                <span className="text-[13px] font-bold text-red flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Urgence
                </span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-3">
                  <span className="text-[13px] text-grayText">Date</span>
                  <span className="text-[13px] font-semibold text-navy">{selectedDay} mars 2026</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-[13px] text-grayText">Créneau</span>
                  <span className="text-[13px] font-semibold text-navy">{selectedSlot}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-3">
              <span className="text-[13px] text-grayText">Paiement</span>
              <span className="text-[13px] font-semibold text-navy flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-grayText" />
                •••• {cardNumber.replace(/\s/g, "").slice(-4)}
              </span>
            </div>
          </div>

          {/* Description preview */}
          <div className="bg-bgPage rounded-[5px] p-3.5 mb-5">
            <div className="text-[11px] font-semibold text-grayText mb-1.5">Votre demande</div>
            <p className="text-sm text-navy leading-relaxed">{description}</p>
          </div>

          {/* Escrow info */}
          <div className="bg-deepForest rounded-[5px] p-4 mb-5 flex items-start gap-3">
            <Lock className="w-5 h-5 text-lightSage shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-white mb-0.5">Paiement sécurisé</p>
              <p className="text-xs text-white/60 leading-relaxed">
                Aucun prélèvement immédiat. Le montant du devis sera bloqué en séquestre et libéré uniquement après votre validation.
              </p>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-surface rounded-[5px] p-4 mb-5 border border-border">
            <div className="text-xs font-bold text-navy mb-3">Que se passe-t-il ensuite ?</div>
            <div className="space-y-2.5">
              {[
                { icon: <Bell className="w-3.5 h-3.5 text-forest" />, text: `${name} reçoit votre demande et est notifié` },
                { icon: <Calendar className="w-3.5 h-3.5 text-forest" />, text: "Il confirme le rendez-vous et propose un devis" },
                { icon: <Lock className="w-3.5 h-3.5 text-forest" />, text: "Vous signez le devis, le montant est bloqué en séquestre" },
                { icon: <Check className="w-3.5 h-3.5 text-forest" />, text: "Après l'intervention, vous validez et le paiement est libéré" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-forest/10 flex items-center justify-center shrink-0">
                    {s.icon}
                  </div>
                  <span className="text-xs text-grayText">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className={cn(
              "w-full py-4 rounded-[5px] text-white font-bold text-[15px] transition-all flex items-center justify-center gap-2",
              isUrgency
                ? "bg-red shadow-[0_6px_20px_rgba(232,48,42,0.25)] hover:-translate-y-0.5"
                : "bg-deepForest shadow-[0_6px_20px_rgba(10,64,48,0.25)] hover:-translate-y-0.5",
              submitting && "opacity-60 cursor-default translate-y-0",
            )}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Confirmation en cours...
              </>
            ) : (
              <>
                <Check className="w-4.5 h-4.5" />
                {isUrgency ? "Confirmer l'intervention urgente" : "Confirmer la demande"}
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-grayText mt-3">
            En confirmant, vous acceptez les{" "}
            <a href="/cgu" className="text-forest hover:underline">conditions générales</a>
            {" "}de Nova
          </p>
        </div>
      )}
    </div>
  );
}
