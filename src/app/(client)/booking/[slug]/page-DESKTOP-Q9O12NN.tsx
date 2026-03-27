/**
 * Page de réservation (booking) en 2 étapes.
 * Étape 0 : Description du besoin + choix date/créneau (ou description urgence)
 * Étape 1 : Récapitulatif + confirmation
 * Après confirmation : écran de succès avec détails de la demande.
 *
 * Le paiement se fait plus tard via Stripe Checkout (page /payment/[id])
 * après que l'artisan ait envoyé un devis et que le client l'ait signé.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Shield, Star, Lock, Check,
  Calendar, Clock, Zap, Bell, ChevronRight, CreditCard,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Constantes                                                         */
/* ------------------------------------------------------------------ */

/** Créneaux horaires proposés */
const slots = ["9h00", "10h00", "11h00", "14h00", "15h00", "16h00", "18h00"];

/** Jours disponibles dans le calendrier (mars 2026) */
const availableDays = [24, 25, 26, 27, 28, 29, 31];

/** Labels des 3 étapes du parcours */
const stepLabels = ["Votre demande", "Empreinte bancaire", "Confirmation"];

/* ------------------------------------------------------------------ */
/*  Utilitaire                                                         */
/* ------------------------------------------------------------------ */

/** Retourne les initiales d'un nom */
function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  Formulaire carte (Stripe Elements)                                 */
/* ------------------------------------------------------------------ */

function CardForm({ onSuccess, isUrgency }: { onSuccess: () => void; isUrgency: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Erreur lors de l'enregistrement de la carte");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white border border-border rounded-[5px] p-6 shadow-sm">
        <h3 className="font-heading text-[15px] font-bold text-navy mb-1 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-forest" /> Empreinte bancaire
        </h3>
        <p className="text-xs text-grayText mb-4">
          Aucun montant ne sera prélevé. Votre moyen de paiement sera enregistré pour sécuriser la demande.
        </p>

        {/* Méthodes acceptées */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[11px] text-grayText">Accepté :</span>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-semibold text-navy">Visa</span>
            <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-semibold text-navy">Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-semibold">Apple Pay</span>
            <span className="px-2 py-0.5 rounded bg-white border border-border text-[10px] font-semibold text-navy flex items-center gap-0.5">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Pay
            </span>
          </div>
        </div>

        <div className="mb-5 p-4 rounded-[5px] border border-border bg-bgPage">
          <PaymentElement />
        </div>

        {error && (
          <div className="bg-red/5 border border-red/20 rounded-[5px] px-4 py-3 mb-4 text-sm text-red font-medium">
            {error}
          </div>
        )}

        <div className="bg-deepForest/5 rounded-[5px] p-3.5 flex items-center gap-3 mb-5 border border-forest/10">
          <Lock className="w-5 h-5 text-forest shrink-0" />
          <div className="text-left">
            <div className="text-xs font-bold text-navy">Paiement à 0,00 €</div>
            <div className="text-[11px] text-grayText">
              Simple vérification de votre moyen de paiement. Aucun prélèvement ne sera effectué.
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className={cn(
            "w-full py-3.5 rounded-[5px] text-white font-bold text-sm transition-all flex items-center justify-center gap-2",
            !stripe || loading
              ? "bg-border text-grayText cursor-default"
              : isUrgency
                ? "bg-red hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(232,48,42,0.2)]"
                : "bg-deepForest hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(10,64,48,0.2)]",
          )}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Vérification en cours...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Valider ma carte et confirmer
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: artisan, loading } = useFetch<ArtisanData>(`/api/artisans/${slug}`);

  /** Mode urgence activé via le paramètre ?mode=urgence */
  const isUrgency = searchParams.get("mode") === "urgence";

  /** Étape courante du parcours (0, 1) */
  const [step, setStep] = useState(0);

  /* --- Étape 0 : détails de la demande --- */
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  /* --- Étape 1 (empreinte bancaire) --- */
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardSaved, setCardSaved] = useState(false);

  /* --- Étape 2 : état de la soumission --- */
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  /* Crée le SetupIntent quand on arrive à l'étape 1 (empreinte bancaire) */
  useEffect(() => {
    if (step === 1 && !clientSecret) {
      fetch("/api/setup-intent", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
        })
        .catch(console.error);
    }
  }, [step, clientSecret]);

  /* Condition de validation pour l'étape 0 */
  const canProceedStep0 = isUrgency
    ? description.length >= 10
    : selectedDay !== null && selectedSlot !== null && description.length >= 10;

  /** Envoie la demande de mission à l'API */
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

  /* Squelette de chargement */
  if (loading) {
    return (
      <div className="max-w-[560px] mx-auto px-5 py-8">
        <Skeleton height={400} variant="rectangular" />
      </div>
    );
  }

  /* Valeurs avec fallback pour le prototype */
  const name = artisan?.user?.name ?? "Artisan";
  const initials = getInitials(name);
  const trade = artisan?.trade ?? "Artisan";
  const rating = artisan?.rating ?? 4.9;
  const reviewCount = artisan?.reviewCount ?? 127;
  const city = artisan?.city ?? "Paris";

  /* ================================================================ */
  /*  ÉCRAN DE SUCCÈS (après confirmation)                             */
  /* ================================================================ */
  if (confirmed) {
    return (
      <div className="max-w-[560px] mx-auto px-5 py-8">
        <div className="bg-white border border-border rounded-[5px] p-8 text-center shadow-sm">
          {/* Icône de succès animée */}
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

          {/* Récapitulatif artisan notifié */}
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

          {/* Badge séquestre */}
          <div className="bg-deepForest/5 rounded-[5px] p-3.5 flex items-center gap-3 mb-6 border border-forest/10">
            <Lock className="w-5 h-5 text-forest shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-navy">Paiement protégé par séquestre</div>
              <div className="text-[11px] text-grayText">Votre argent ne sera débité qu&apos;après validation de l&apos;intervention</div>
            </div>
          </div>

          {/* Boutons de navigation post-confirmation */}
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

  /* ================================================================ */
  /*  PARCOURS DE RÉSERVATION (3 étapes)                               */
  /* ================================================================ */
  return (
    <div className="max-w-[560px] mx-auto px-5 py-8">

      {/* Bouton retour (étape précédente ou page précédente) */}
      <button
        onClick={() => step > 0 ? setStep(step - 1) : router.back()}
        className="flex items-center gap-1.5 text-[13px] text-grayText font-medium mb-5 hover:text-navy transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> {step > 0 ? "Étape précédente" : "Retour"}
      </button>

      {/* Titre + badge urgence */}
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

      {/* Résumé de l'artisan (toujours visible) */}
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

      {/* Barre de progression des étapes */}
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

      {/* ============================================================ */}
      {/* ÉTAPE 0 : Détails de la demande                               */}
      {/* ============================================================ */}
      {step === 0 && (
        <div className="bg-white border border-border rounded-[5px] p-6 shadow-sm">
          {isUrgency ? (
            <>
              {/* Bandeau urgence */}
              <div className="bg-red/[0.05] border border-red/20 rounded-[5px] px-4 py-3 mb-5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-red" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">Intervention au plus vite</p>
                  <p className="text-xs text-grayText leading-relaxed mt-0.5">
                    L&apos;artisan sera notifié immédiatement et vous contactera dans les plus brefs délais.
                  </p>
                </div>
              </div>

              {/* Champ description urgence */}
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
              {/* Sélection de date (calendrier simplifié mars 2026) */}
              <h3 className="font-heading text-[15px] font-bold text-navy mb-3.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest" /> Choisissez une date
              </h3>

              <div className="mb-5">
                <div className="text-xs font-semibold text-grayText mb-2">Mars 2026</div>
                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 gap-1.5 mb-1">
                  {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                    <div key={i} className="text-center text-[11px] font-semibold text-grayText/60 py-1">{d}</div>
                  ))}

                  {/* Offset : mars 2026 commence un dimanche (6 cases vides) */}
                  {Array.from({ length: 6 }).map((_, i) => <div key={`e${i}`} />)}

                  {/* Jours du mois */}
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

              {/* Sélection de créneau horaire */}
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

              {/* Champ description du besoin */}
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

          {/* Bouton "Continuer" vers l'étape 1 */}
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

      {/* ============================================================ */}
      {/* ÉTAPE 1 : Empreinte bancaire (SetupIntent Stripe)             */}
      {/* ============================================================ */}
      {step === 1 && (
        clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#0A4030",
                  borderRadius: "5px",
                  fontFamily: "DM Sans, system-ui, sans-serif",
                },
              },
            }}
          >
            <CardForm
              isUrgency={isUrgency}
              onSuccess={() => {
                setCardSaved(true);
                setStep(2);
              }}
            />
          </Elements>
        ) : (
          <div className="bg-white border border-border rounded-[5px] p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
              <span className="text-sm text-grayText">Chargement du formulaire de paiement...</span>
            </div>
          </div>
        )
      )}

      {/* ============================================================ */}
      {/* ÉTAPE 2 : Récapitulatif + Confirmation                        */}
      {/* ============================================================ */}
      {step === 2 && (
        <div className="bg-white border border-border rounded-[5px] p-6 shadow-sm">
          <h3 className="font-heading text-[15px] font-bold text-navy mb-4">
            Récapitulatif
          </h3>

          {/* Lignes récapitulatives */}
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
              <span className="text-[13px] font-semibold text-forest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-forest" />
                Séquestre sécurisé
              </span>
            </div>
            {cardSaved && (
              <div className="flex justify-between py-3">
                <span className="text-[13px] text-grayText">Carte</span>
                <span className="text-[13px] font-semibold text-success flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-success" />
                  Enregistrée
                </span>
              </div>
            )}
          </div>

          {/* Aperçu de la description */}
          <div className="bg-bgPage rounded-[5px] p-3.5 mb-5">
            <div className="text-[11px] font-semibold text-grayText mb-1.5">Votre demande</div>
            <p className="text-sm text-navy leading-relaxed">{description}</p>
          </div>

          {/* Bandeau info séquestre */}
          <div className="bg-deepForest rounded-[5px] p-4 mb-5 flex items-start gap-3">
            <Lock className="w-5 h-5 text-lightSage shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-white mb-0.5">Paiement sécurisé</p>
              <p className="text-xs text-white/60 leading-relaxed">
                Aucun prélèvement immédiat. Le montant du devis sera bloqué en séquestre et libéré uniquement après votre validation.
              </p>
            </div>
          </div>

          {/* Explication des étapes suivantes */}
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

          {/* Bouton de confirmation finale */}
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
