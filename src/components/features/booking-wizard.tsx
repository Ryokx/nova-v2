/**
 * BookingWizard — Flow unifié réservation + création de compte
 *
 * 5 étapes :
 * 0. Infos personnelles (prénom, nom, email, adresse, description)
 * 1. Date d'intervention (calendrier + créneau) — sauté si urgence
 * 2. Mode de paiement (espèces / en ligne)
 * 3. Empreinte bancaire Stripe — sauté si espèces
 * 4. Confirmation (compte créé, artisan notifié)
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowLeft, User, MapPin, Mail, Phone, FileText,
  Calendar, Clock, Banknote, CreditCard, Lock, Check,
  Shield, ChevronRight, AlertCircle, Zap, Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface WizardArtisan {
  id: string;
  trade: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  city?: string | null;
  name: string;
}

interface BookingWizardProps {
  artisan: WizardArtisan | null;
  category: string;
  isUrgency: boolean;
  onBack: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constantes                                                         */
/* ------------------------------------------------------------------ */

const slots = ["9h00", "10h00", "11h00", "14h00", "15h00", "16h00", "18h00"];

function getAvailableDays(): { day: number; date: Date; label: string }[] {
  const days: { day: number; date: Date; label: string }[] = [];
  const now = new Date();
  const weekdays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() !== 0) {
      days.push({ day: d.getDate(), date: d, label: weekdays[d.getDay()]! });
    }
    if (days.length >= 7) break;
  }
  return days;
}

/* ------------------------------------------------------------------ */
/*  Stripe CardForm (étape 3)                                          */
/* ------------------------------------------------------------------ */

function CardForm({ onSuccess }: { onSuccess: () => void }) {
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
      setError(stripeError.message ?? "Erreur lors de l'enregistrement");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 p-4 rounded-[14px] border border-border bg-bgPage">
        <PaymentElement />
      </div>
      {error && (
        <div className="bg-red/5 border border-red/20 rounded-[14px] px-4 py-3 mb-4 text-sm text-red font-medium">
          {error}
        </div>
      )}
      <div className="bg-deepForest/5 rounded-[14px] p-3.5 flex items-center gap-3 mb-5 border border-forest/10">
        <Lock className="w-5 h-5 text-forest shrink-0" />
        <div className="text-left">
          <div className="text-xs font-bold text-navy">Empreinte à 0,00 €</div>
          <div className="text-[11px] text-grayText">Simple vérification — aucun prélèvement ne sera effectué.</div>
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className={cn(
          "w-full py-3.5 rounded-[14px] text-white font-bold text-sm transition-all flex items-center justify-center gap-2",
          !stripe || loading ? "bg-border text-grayText" : "bg-deepForest hover:-translate-y-0.5",
        )}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Vérification...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" /> Valider l&apos;empreinte
          </>
        )}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export function BookingWizard({ artisan, category, isUrgency, onBack }: BookingWizardProps) {
  const router = useRouter();

  /* Étape courante */
  const [step, setStep] = useState(0);

  /* Étape 0 : Infos personnelles */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  /* Étape 1 : Date */
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const availableDays = getAvailableDays();

  /* Étape 2 : Paiement */
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | null>(null);

  /* Étape 3 : Stripe */
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  /* État global */
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);

  /* Labels des étapes */
  const stepLabels = isUrgency
    ? ["Vos informations", "Paiement", ...(paymentMethod === "online" ? ["Empreinte bancaire"] : []), "Confirmation"]
    : ["Vos informations", "Date", "Paiement", ...(paymentMethod === "online" ? ["Empreinte bancaire"] : []), "Confirmation"];

  /* Nombre total d'étapes effectives */
  const totalSteps = isUrgency
    ? (paymentMethod === "online" ? 4 : 3)
    : (paymentMethod === "online" ? 5 : 4);

  /* Étape effective (mappage step interne → logique) */
  const getEffectiveStep = () => {
    if (isUrgency) {
      // 0=infos, 1=paiement, 2=stripe(si online), 3=confirmation
      if (step === 0) return 0;
      if (step === 1) return 1; // date skipped
      if (step === 2) return paymentMethod === "online" ? 2 : 3;
      return step;
    }
    return step;
  };

  /* Validation étape 0 */
  const step0Valid =
    firstName.length >= 2 &&
    lastName.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    address.length >= 5 &&
    description.length >= 10;

  /* Validation étape 1 (date) */
  const step1Valid = isUrgency || (selectedDay !== null && selectedSlot !== null);

  /* ---- Soumission : crée le compte + la mission ---- */
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);

    try {
      /* Calculer la date programmée */
      let scheduledDate: string | undefined;
      if (selectedDay !== null) {
        const dayObj = availableDays.find((d) => d.day === selectedDay);
        if (dayObj) scheduledDate = dayObj.date.toISOString();
      }

      /* Appel API combiné */
      const res = await fetch("/api/book-and-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          address,
          description,
          artisanId: artisan?.id,
          category,
          scheduledDate,
          scheduledSlot: selectedSlot || undefined,
          paymentMethod,
          isUrgency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "EMAIL_EXISTS") {
          setError("Un compte existe déjà avec cet email. Connectez-vous pour continuer.");
        } else {
          setError(data.error || "Une erreur est survenue.");
        }
        setSubmitting(false);
        return;
      }

      setMissionId(data.mission.id);

      /* Auto sign-in */
      const signInResult = await signIn("credentials", {
        email,
        password: data.tempPassword,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Compte créé mais erreur de connexion. Connectez-vous manuellement.");
        setSubmitting(false);
        return;
      }

      /* Si paiement en ligne → charger SetupIntent pour l'étape suivante */
      if (paymentMethod === "online") {
        const setupRes = await fetch("/api/setup-intent", { method: "POST" });
        const setupData = await setupRes.json();
        if (setupData.clientSecret) {
          setClientSecret(setupData.clientSecret);
        }
        setSubmitting(false);
        /* Avancer à l'étape Stripe */
        setStep((s) => s + 1);
      } else {
        /* Espèces → directement à la confirmation */
        setSubmitting(false);
        setStep((s) => s + 1);
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
      setSubmitting(false);
    }
  }, [firstName, lastName, email, phone, address, description, artisan, category, selectedDay, selectedSlot, paymentMethod, isUrgency, availableDays]);

  /* ---- Navigation ---- */
  const handleNext = () => {
    if (step === 0 && !step0Valid) return;

    /* Si urgence, on saute l'étape date */
    if (step === 0 && isUrgency) {
      setStep(2); // sauter à paiement
      return;
    }

    if (step === 1 && !step1Valid) return;

    /* Si on est à l'étape paiement et qu'on a choisi → soumettre */
    if (step === 2 && paymentMethod) {
      handleSubmit();
      return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
      return;
    }
    /* Si urgence et on est à l'étape 2 (paiement), retour à 0 */
    if (isUrgency && step === 2) {
      setStep(0);
      return;
    }
    setStep((s) => s - 1);
  };

  /* Stripe card success → confirmation */
  const handleStripeSuccess = () => {
    setStep((s) => s + 1);
  };

  /* ---- Rendu des étapes ---- */

  /* Barre de progression */
  const progressPercent = Math.min(100, ((getEffectiveStep() + 1) / totalSteps) * 100);

  /* Dernier step ? */
  const isConfirmationStep =
    (paymentMethod === "online" && step === 4) ||
    (paymentMethod === "cash" && step === 3) ||
    (isUrgency && paymentMethod === "cash" && step === 3) ||
    (isUrgency && paymentMethod === "online" && step === 4);

  const isStripeStep =
    (paymentMethod === "online" && !isUrgency && step === 3) ||
    (paymentMethod === "online" && isUrgency && step === 3);

  return (
    <div className="max-w-[560px] mx-auto">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-navy" />
        </button>
        <div className="flex-1">
          <h2 className="font-heading text-xl font-extrabold text-navy">
            {isUrgency ? "Intervention urgente" : "Réserver un artisan"}
          </h2>
          {artisan && (
            <p className="text-sm text-grayText mt-0.5">{artisan.name} — {category}</p>
          )}
          {!artisan && isUrgency && (
            <p className="text-sm text-grayText mt-0.5">Urgence {category} — artisan assigné automatiquement</p>
          )}
        </div>
        {isUrgency && <Zap className="w-5 h-5 text-red" />}
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {stepLabels.map((label, i) => (
            <span
              key={label}
              className={cn(
                "text-[11px] font-semibold transition-colors",
                i <= getEffectiveStep() ? "text-forest" : "text-grayText/50",
              )}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-deepForest to-forest transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="bg-red/5 border border-red/20 rounded-[14px] px-4 py-3 mb-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red font-medium">{error}</p>
            {error.includes("Connectez-vous") && (
              <a href="/login?callbackUrl=/artisans" className="text-xs text-forest font-semibold hover:underline mt-1 inline-block">
                Se connecter →
              </a>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  ÉTAPE 0 : Informations personnelles                         */}
      {/* ============================================================ */}
      {step === 0 && (
        <div className="bg-white rounded-[20px] p-6 border border-border shadow-sm">
          <h3 className="font-heading text-[15px] font-bold text-navy mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-forest" /> Vos informations
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-navy mb-1 block">Prénom *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                  className="w-full h-11 px-4 rounded-[10px] border border-border bg-white text-sm text-navy placeholder:text-grayText/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-navy mb-1 block">Nom *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  className="w-full h-11 px-4 rounded-[10px] border border-border bg-white text-sm text-navy placeholder:text-grayText/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-navy mb-1 block flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-forest" /> Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@email.com"
                className="w-full h-11 px-4 rounded-[10px] border border-border bg-white text-sm text-navy placeholder:text-grayText/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy mb-1 block flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-forest" /> Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full h-11 px-4 rounded-[10px] border border-border bg-white text-sm text-navy placeholder:text-grayText/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy mb-1 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-forest" /> Adresse d&apos;intervention *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="12 rue de la Paix, 75001 Paris"
                className="w-full h-11 px-4 rounded-[10px] border border-border bg-white text-sm text-navy placeholder:text-grayText/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy mb-1 block flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-forest" /> Décrivez votre problème *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fuite sous l'évier de la cuisine, besoin d'un remplacement de joint..."
                rows={3}
                className="w-full px-4 py-3 rounded-[10px] border border-border bg-white text-sm text-navy placeholder:text-grayText/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all resize-none"
              />
              <p className="text-[11px] text-grayText mt-1">{description.length}/10 caractères minimum</p>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!step0Valid}
            className={cn(
              "w-full mt-5 py-3.5 rounded-[14px] font-bold text-sm transition-all flex items-center justify-center gap-2",
              step0Valid
                ? "bg-deepForest text-white hover:-translate-y-0.5"
                : "bg-border text-grayText",
            )}
          >
            Continuer <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/*  ÉTAPE 1 : Choix de la date                                   */}
      {/* ============================================================ */}
      {step === 1 && !isUrgency && (
        <div className="bg-white rounded-[20px] p-6 border border-border shadow-sm">
          <h3 className="font-heading text-[15px] font-bold text-navy mb-5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-forest" /> Date d&apos;intervention
          </h3>

          {/* Jours */}
          <div className="grid grid-cols-7 gap-2 mb-5">
            {availableDays.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={cn(
                  "flex flex-col items-center py-2.5 rounded-xl border transition-all text-center",
                  selectedDay === d.day
                    ? "border-forest bg-forest/5 text-forest"
                    : "border-border bg-white text-navy hover:border-forest/30",
                )}
              >
                <span className="text-[10px] font-medium text-grayText">{d.label}</span>
                <span className="text-lg font-bold">{d.day}</span>
              </button>
            ))}
          </div>

          {/* Créneaux */}
          <p className="text-xs font-semibold text-navy mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-forest" /> Créneau horaire
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                  selectedSlot === slot
                    ? "border-forest bg-forest/5 text-forest"
                    : "border-border bg-white text-navy hover:border-forest/30",
                )}
              >
                {slot}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!step1Valid}
            className={cn(
              "w-full py-3.5 rounded-[14px] font-bold text-sm transition-all flex items-center justify-center gap-2",
              step1Valid
                ? "bg-deepForest text-white hover:-translate-y-0.5"
                : "bg-border text-grayText",
            )}
          >
            Continuer <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/*  ÉTAPE 2 : Mode de paiement                                   */}
      {/* ============================================================ */}
      {step === 2 && (
        <div className="bg-white rounded-[20px] p-6 border border-border shadow-sm">
          <h3 className="font-heading text-[15px] font-bold text-navy mb-5 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-forest" /> Mode de paiement
          </h3>

          <div className="space-y-3">
            {/* Espèces */}
            <button
              onClick={() => setPaymentMethod("cash")}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-[14px] border-2 transition-all text-left",
                paymentMethod === "cash"
                  ? "border-forest bg-forest/5"
                  : "border-border bg-white hover:border-forest/30",
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                <Banknote className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-navy">Paiement en espèces</div>
                <div className="text-xs text-grayText mt-0.5">Vous payez directement l&apos;artisan après l&apos;intervention</div>
                <div className="text-xs text-amber-600 mt-1">⚠️ Le service de séquestre ne sera pas disponible avec ce mode de paiement.</div>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                paymentMethod === "cash" ? "border-forest bg-forest" : "border-gray-300",
              )}>
                {paymentMethod === "cash" && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>

            {/* En ligne */}
            <button
              onClick={() => setPaymentMethod("online")}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-[14px] border-2 transition-all text-left",
                paymentMethod === "online"
                  ? "border-forest bg-forest/5"
                  : "border-border bg-white hover:border-forest/30",
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-forest" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-navy">Empreinte bancaire en ligne</div>
                <div className="text-xs text-grayText mt-0.5">Sécurisez votre demande — empreinte à 0 € (aucun prélèvement)</div>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                paymentMethod === "online" ? "border-forest bg-forest" : "border-gray-300",
              )}>
                {paymentMethod === "online" && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={!paymentMethod || submitting}
            className={cn(
              "w-full mt-5 py-3.5 rounded-[14px] font-bold text-sm transition-all flex items-center justify-center gap-2",
              paymentMethod && !submitting
                ? "bg-deepForest text-white hover:-translate-y-0.5"
                : "bg-border text-grayText",
            )}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création du compte...
              </>
            ) : (
              <>
                Confirmer <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/*  ÉTAPE 3 : Empreinte bancaire Stripe                          */}
      {/* ============================================================ */}
      {isStripeStep && (
        <div className="bg-white rounded-[20px] p-6 border border-border shadow-sm">
          <h3 className="font-heading text-[15px] font-bold text-navy mb-1 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-forest" /> Empreinte bancaire
          </h3>
          <p className="text-xs text-grayText mb-5">Enregistrez un moyen de paiement. Aucun montant ne sera prélevé.</p>

          <div className="flex items-center gap-2 mb-5">
            <span className="text-[11px] text-grayText">Accepté :</span>
            <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-semibold text-navy">Visa</span>
            <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-semibold text-navy">Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-semibold">Apple Pay</span>
          </div>

          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#0A4030",
                    borderRadius: "10px",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  },
                },
              }}
            >
              <CardForm onSuccess={handleStripeSuccess} />
            </Elements>
          ) : (
            <div className="flex items-center justify-center gap-3 py-12">
              <span className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
              <span className="text-sm text-grayText">Chargement...</span>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/*  ÉTAPE FINALE : Confirmation                                  */}
      {/* ============================================================ */}
      {isConfirmationStep && (
        <div className="bg-white rounded-[20px] p-6 border border-border shadow-sm text-center">
          {/* Animation succès */}
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>

          <h3 className="font-heading text-xl font-extrabold text-navy mb-2">
            Demande envoyée !
          </h3>
          <p className="text-sm text-grayText mb-5 max-w-sm mx-auto">
            {artisan
              ? `${artisan.name} a été notifié de votre demande. En cas de refus, un autre artisan prendra automatiquement la relève.`
              : "Un artisan disponible a été notifié de votre demande d'urgence. En cas de refus, un autre artisan prendra automatiquement la relève."}
          </p>

          {/* Récap */}
          <div className="bg-surface rounded-[14px] p-4 mb-5 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-forest" />
              <span className="text-navy font-medium">{firstName} {lastName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-forest" />
              <span className="text-grayText">{address}</span>
            </div>
            {!isUrgency && selectedSlot && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-forest" />
                <span className="text-grayText">{selectedDay} — {selectedSlot}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Radio className="w-4 h-4 text-forest" />
              <span className="text-grayText">{paymentMethod === "cash" ? "Paiement en espèces" : "Empreinte bancaire enregistrée"}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-2.5">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3.5 rounded-[14px] bg-deepForest text-white font-bold text-sm hover:-translate-y-0.5 transition-all"
            >
              Voir mon tableau de bord
            </button>

            {isUrgency && (
              <button
                onClick={() => router.push(`/tracking/${missionId ?? "urgence-demo"}`)}
                className="w-full py-3.5 rounded-[14px] bg-red text-white font-bold text-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> Suivre en temps réel
              </button>
            )}

            <button
              onClick={onBack}
              className="w-full py-3 rounded-[14px] bg-white border border-border text-navy font-semibold text-sm hover:bg-surface transition-all"
            >
              Rechercher un autre artisan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
