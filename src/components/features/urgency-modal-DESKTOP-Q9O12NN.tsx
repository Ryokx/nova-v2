"use client";

/**
 * UrgencyModal — Modal animée de recherche d'artisan en urgence
 *
 * Flow complet :
 * 1. Localisation → Recherche → Artisan trouvé (animation)
 * 2. Si non connecté → écran login/inscription
 * 3. Si pas de CB → formulaire empreinte bancaire (Stripe Elements)
 * 4. Artisan notifié → Accepté → En chemin (animation)
 * 5. Bouton "Suivre en temps réel" → page tracking
 *
 * Pas de prix en séquestre : l'artisan fera le devis sur place.
 * Seule une empreinte bancaire (0€) est demandée.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Modal } from "@/components/ui/modal";
import {
  MapPin, Search, CheckCircle, Bell,
  Navigation, Phone, Clock, Star, Shield,
  UserPlus, LogIn, CreditCard, Lock, Loader2,
} from "lucide-react";

/* ━━━ Stripe ━━━ */
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ━━━ Types ━━━ */
interface UrgencyModalProps {
  open: boolean;
  onClose: () => void;
  tradeName?: string;
  /** Si true, saute l'animation et va directement à la vérification auth/CB */
  resume?: boolean;
}

/**
 * Phases du flow :
 * - locating/searching/found : animation de recherche
 * - auth : écran login/inscription (si non connecté)
 * - payment : formulaire CB (si pas de moyen de paiement)
 * - notified/accepted/onway : confirmation et suivi
 */
type Step = "locating" | "searching" | "found" | "auth" | "payment" | "notified" | "accepted" | "onway";

/** Étapes de l'animation uniquement (hors auth/payment) */
const ANIM_STEPS: Step[] = ["locating", "searching", "found", "notified", "accepted", "onway"];

/** Durée auto de chaque étape en ms (0 = pas de progression auto) */
const STEP_TIMINGS: Record<Step, number> = {
  locating: 2000,
  searching: 3500,
  found: 0,
  auth: 0,
  payment: 0,
  notified: 2000,
  accepted: 2000,
  onway: 0,
};

/** Données fictives de l'artisan trouvé */
const ARTISAN = {
  name: "Jean-Michel Petit",
  initials: "JM",
  trade: "Plombier",
  rating: 4.9,
  reviews: 127,
  eta: "23 min",
  distance: "2.4 km",
};

/** Étapes de progression affichées dans la fiche artisan */
const PROGRESS_STEPS = [
  { key: "found" as Step, label: "Artisan trouvé", icon: CheckCircle },
  { key: "notified" as Step, label: "Artisan notifié", icon: Bell },
  { key: "accepted" as Step, label: "Intervention acceptée", icon: CheckCircle },
  { key: "onway" as Step, label: "En chemin vers vous", icon: Navigation },
];

/* ━━━ Sous-composant : Formulaire CB inline (Stripe Elements) ━━━ */
function CardForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      /* Demande un SetupIntent au serveur */
      const res = await fetch("/api/setup-intent", { method: "POST" });
      const { clientSecret, error: apiError } = await res.json();
      if (apiError || !clientSecret) {
        setError(apiError || "Erreur serveur");
        setLoading(false);
        return;
      }

      /* Confirme le SetupIntent avec la carte saisie */
      const { error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (stripeError) {
        setError(stripeError.message || "Erreur de validation");
        setLoading(false);
      } else {
        onSuccess();
      }
    } catch {
      setError("Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-xl border border-border p-4 mb-3 bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "15px",
                fontFamily: "'DM Sans', sans-serif",
                color: "#0A1628",
                "::placeholder": { color: "#6B7280" },
              },
              invalid: { color: "#E8302A" },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      {error && (
        <p className="text-xs text-red font-medium mb-3">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full h-12 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
        style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)" }}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Vérification...</>
        ) : (
          <><Lock className="w-4 h-4" /> Enregistrer ma carte</>
        )}
      </button>
    </form>
  );
}

/* ━━━ Composant principal ━━━ */
export function UrgencyModal({ open, onClose, tradeName = "artisan", resume = false }: UrgencyModalProps) {
  const router = useRouter();
  useSession();
  const [step, setStep] = useState<Step>("locating");
  const [dots, setDots] = useState("");
  const checkedRef = useRef(false);

  /* Réinitialiser à l'ouverture */
  useEffect(() => {
    console.log("[UrgencyModal] effect — open:", open, "resume:", resume);
    if (open) {
      setDots("");
      checkedRef.current = false;
      if (resume) {
        console.log("[UrgencyModal] RESUME mode → step=found");
        setStep("found");
      } else {
        setStep("locating");
      }
    }
  }, [open, resume]);

  /* Animation des points de suspension */
  useEffect(() => {
    if (!open) return;
    const needsDots = ["locating", "searching", "notified"].includes(step);
    if (!needsDots) return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [open, step]);

  /**
   * Vérifie auth + CB quand on atteint "found".
   * En mode resume, appelle /api/auth/me directement pour ne pas dépendre
   * du timing de useSession() qui peut rester "loading" trop longtemps.
   */
  useEffect(() => {
    if (step !== "found" || checkedRef.current || !open) return;
    checkedRef.current = true;

    const checkAuthAndPayment = async () => {
      console.log("[UrgencyModal] checkAuthAndPayment — checking /api/auth/me...");
      /* Vérifie la session via l'API (fiable, pas de timing issue) */
      let isAuthenticated = false;
      try {
        const res = await fetch("/api/auth/me");
        console.log("[UrgencyModal] /api/auth/me status:", res.status);
        if (res.ok) {
          const data = await res.json();
          isAuthenticated = !!data.user;
          console.log("[UrgencyModal] authenticated:", isAuthenticated);
        }
      } catch (err) {
        console.log("[UrgencyModal] /api/auth/me error:", err);
      }

      if (!isAuthenticated) {
        console.log("[UrgencyModal] → step=auth");
        setStep("auth");
        return;
      }

      /* Connecté → vérifier le moyen de paiement */
      console.log("[UrgencyModal] checking /api/payment-methods/check...");
      try {
        const res = await fetch("/api/payment-methods/check");
        const data = await res.json();
        console.log("[UrgencyModal] hasPaymentMethod:", data.hasPaymentMethod);
        if (!data.hasPaymentMethod) {
          setStep("payment");
          return;
        }
      } catch {
        setStep("payment");
        return;
      }

      /* Tout est bon → continuer l'animation */
      console.log("[UrgencyModal] → step=notified");
      setStep("notified");
    };

    checkAuthAndPayment();
  }, [step, open]);

  /* Progression automatique entre les étapes d'animation */
  useEffect(() => {
    if (!open) return;
    const timing = STEP_TIMINGS[step];
    if (timing === 0) return;
    const timer = setTimeout(() => {
      setStep((prev) => {
        const idx = ANIM_STEPS.indexOf(prev);
        const next = ANIM_STEPS[idx + 1];
        return idx >= 0 && idx < ANIM_STEPS.length - 1 && next ? next : prev;
      });
    }, timing);
    return () => clearTimeout(timer);
  }, [open, step]);

  /* Quand la CB est enregistrée → continuer */
  const handlePaymentSuccess = useCallback(() => {
    setStep("notified");
  }, []);

  /* Helpers */
  const isSearching = step === "locating" || step === "searching";
  const isFound = !isSearching && step !== "auth" && step !== "payment";
  const animIdx = ANIM_STEPS.indexOf(step);

  /* ── Rendu écran Auth ── */
  const renderAuth = () => (
    <div className="w-full" style={{ animation: "urgency-slideUp 0.3s ease-out both" }}>
      <div className="w-14 h-14 rounded-full bg-forest/[0.08] flex items-center justify-center mx-auto mb-4">
        <Shield className="w-7 h-7 text-forest" />
      </div>
      <h3 className="font-heading text-xl font-extrabold text-navy text-center mb-2">
        Artisan trouvé !
      </h3>
      <p className="text-sm text-grayText text-center leading-relaxed mb-6">
        Connectez-vous ou créez un compte gratuit pour confirmer l&apos;intervention de votre {tradeName.toLowerCase()}.
      </p>
      <div className="flex flex-col gap-3 mb-5">
        <button
          onClick={() => {
            const cb = encodeURIComponent(`${window.location.pathname}?resume=true`);
            window.location.href = `/signup?callbackUrl=${cb}`;
          }}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-white font-bold text-[15px] transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)", boxShadow: "0 6px 20px rgba(10,64,48,0.25)" }}
        >
          <UserPlus className="w-4.5 h-4.5" />
          Créer un compte gratuit
        </button>
        <button
          onClick={() => {
            const cb = encodeURIComponent(`${window.location.pathname}?resume=true`);
            window.location.href = `/login?callbackUrl=${cb}`;
          }}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-white border-2 border-border text-navy font-bold text-[15px] transition-all hover:-translate-y-0.5 hover:border-forest/40"
        >
          <LogIn className="w-4.5 h-4.5" />
          J&apos;ai déjà un compte
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/60">
        {["Inscription gratuite", "Sans engagement", "Données protégées"].map((t) => (
          <span key={t} className="text-[11px] text-grayText font-medium">{t}</span>
        ))}
      </div>
    </div>
  );

  /* ── Rendu écran Payment ── */
  const renderPayment = () => (
    <div className="w-full" style={{ animation: "urgency-slideUp 0.3s ease-out both" }}>
      <div className="w-14 h-14 rounded-full bg-forest/[0.08] flex items-center justify-center mx-auto mb-4">
        <CreditCard className="w-7 h-7 text-forest" />
      </div>
      <h3 className="font-heading text-xl font-extrabold text-navy text-center mb-2">
        Enregistrez un moyen de paiement
      </h3>
      <p className="text-sm text-grayText text-center leading-relaxed mb-6">
        Une empreinte bancaire est nécessaire pour confirmer la demande. <strong className="text-navy">Aucun montant ne sera débité</strong> — le devis sera établi par l&apos;artisan sur place.
      </p>

      <Elements stripe={stripePromise}>
        <CardForm onSuccess={handlePaymentSuccess} />
      </Elements>

      <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-grayText">
        <Lock className="w-3 h-3" />
        <span>Paiement sécurisé par Stripe — Aucun prélèvement immédiat</span>
      </div>
    </div>
  );

  /* ── Rendu fiche artisan + progression ── */
  const renderArtisanCard = () => (
    <div
      className="w-full rounded-xl border border-border p-4 mb-4 text-left"
      style={{ animation: "urgency-slideUp 0.4s ease-out both" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)" }}
        >
          <span className="text-white font-heading font-bold text-sm">{ARTISAN.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-[15px] text-navy">{ARTISAN.name}</span>
            <Shield className="w-3.5 h-3.5 text-forest" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-grayText">{ARTISAN.trade}</span>
            <span className="text-grayText/30">·</span>
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span className="text-xs font-bold text-navy">{ARTISAN.rating}</span>
              <span className="text-xs text-grayText">({ARTISAN.reviews})</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-xs text-grayText">
            <MapPin className="w-3 h-3" />
            {ARTISAN.distance}
          </div>
          {(step === "onway" || step === "accepted") && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-forest" />
              <span className="text-xs font-bold text-forest">ETA {ARTISAN.eta}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info : pas de prix, devis sur place */}
      <div className="mt-3 px-3 py-2 rounded-lg bg-forest/5 border border-forest/10 flex items-start gap-2">
        <Shield className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
        <span className="text-[11px] text-forest leading-relaxed">
          Le devis sera établi sur place par l&apos;artisan. Vous ne payez qu&apos;après validation de l&apos;intervention.
        </span>
      </div>

      {/* Progression des étapes */}
      <div className="mt-4 pt-3 border-t border-border space-y-2">
        {PROGRESS_STEPS.map((s) => {
          const sIdx = ANIM_STEPS.indexOf(s.key);
          const done = sIdx >= 0 && sIdx <= animIdx;
          const active = s.key === step;
          return (
            <div key={s.key} className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: done ? "#D1FAE5" : "#F3F4F6" }}
              >
                <s.icon className="w-3 h-3" style={{ color: done ? "#065F46" : "#9CA3AF" }} />
              </div>
              <span className="text-xs font-medium" style={{ color: done ? "#0A1628" : "#9CA3AF" }}>
                {s.label}
                {active && step !== "onway" ? dots : ""}
              </span>
              {active && (
                <span className="ml-auto text-[10px] font-mono text-grayText">maintenant</span>
              )}
              {done && !active && (
                <CheckCircle className="ml-auto w-3 h-3 text-success" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex flex-col items-center text-center">

        {/* ── Zone de la fausse carte (visible sauf écrans auth/payment) ── */}
        {step !== "auth" && step !== "payment" && (
          <div
            className="relative w-full rounded-xl overflow-hidden mb-6"
            style={{
              height: 240,
              background: "linear-gradient(135deg, #E8F5EE 0%, #D4EBE0 40%, #c5e0d2 100%)",
            }}
          >
            {/* Grille simulant une carte */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(8)].map((_, i) => (
                <div key={`h-${i}`}>
                  <div
                    className="absolute w-full"
                    style={{ top: `${(i + 1) * 12}%`, height: 1, backgroundColor: "#1B6B4E", opacity: 0.3 }}
                  />
                  <div
                    className="absolute h-full"
                    style={{ left: `${(i + 1) * 12}%`, width: 1, backgroundColor: "#1B6B4E", opacity: 0.3 }}
                  />
                </div>
              ))}
            </div>

            {/* Fausses rues */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-[30%] left-0 right-0 h-[3px] bg-navy" />
              <div className="absolute top-[60%] left-[10%] right-[20%] h-[2px] bg-navy" />
              <div className="absolute left-[45%] top-0 bottom-0 w-[3px] bg-navy" />
              <div className="absolute left-[70%] top-[20%] bottom-[10%] w-[2px] bg-navy" />
              <div className="absolute left-[20%] top-[15%] bottom-[30%] w-[2px] bg-navy" />
            </div>

            {/* Marqueur client */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inset-0 w-16 h-16 -ml-5 -mt-5 rounded-full" style={{ backgroundColor: "rgba(232, 48, 42, 0.15)", animation: "urgency-pulse 2s ease-out infinite" }} />
              <span className="absolute inset-0 w-16 h-16 -ml-5 -mt-5 rounded-full" style={{ backgroundColor: "rgba(232, 48, 42, 0.1)", animation: "urgency-pulse 2s ease-out infinite 0.7s" }} />
              <span className="absolute inset-0 w-20 h-20 -ml-7 -mt-7 rounded-full" style={{ backgroundColor: "rgba(232, 48, 42, 0.06)", animation: "urgency-pulse 2s ease-out infinite 1.4s" }} />
              <div
                className="relative w-6 h-6 rounded-full flex items-center justify-center z-10"
                style={{ backgroundColor: "#E8302A", boxShadow: "0 0 0 3px white, 0 2px 12px rgba(232,48,42,0.4)" }}
              >
                <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Marqueur artisan */}
            {isFound && (
              <div className="absolute" style={{ top: "32%", left: "65%", animation: "urgency-drop 0.4s ease-out both" }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-heading font-bold text-[10px]"
                  style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)", boxShadow: "0 0 0 2px white, 0 2px 8px rgba(10,64,48,0.3)" }}
                >
                  JM
                </div>
                {(step === "onway" || step === "accepted") && (
                  <div
                    className="absolute top-4 left-4 w-[60px] h-[1px] origin-left"
                    style={{ borderTop: "2px dashed #1B6B4E", transform: "rotate(25deg)", opacity: 0.5, animation: "urgency-fadeIn 0.5s ease-out" }}
                  />
                )}
              </div>
            )}

            {/* Cercle de scan */}
            {isSearching && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ width: 180, height: 180, border: "2px solid rgba(232, 48, 42, 0.15)", animation: "urgency-scan 2.5s ease-in-out infinite" }}
              />
            )}

            {/* Badge de statut */}
            <div
              className="absolute bottom-3 left-3 right-3 rounded-lg px-3 py-2 flex items-center gap-2"
              style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}
            >
              {step === "locating" && (
                <><MapPin className="w-4 h-4 text-red shrink-0" /><span className="text-xs font-semibold text-navy">Localisation en cours{dots}</span></>
              )}
              {step === "searching" && (
                <><Search className="w-4 h-4 text-red shrink-0" style={{ animation: "urgency-spin 1.5s linear infinite" }} /><span className="text-xs font-semibold text-navy">Recherche d&apos;un {tradeName.toLowerCase()} à proximité{dots}</span></>
              )}
              {step === "found" && (
                <><CheckCircle className="w-4 h-4 text-success shrink-0" /><span className="text-xs font-bold text-success">Artisan trouvé !</span></>
              )}
              {step === "notified" && (
                <><Bell className="w-4 h-4 text-gold shrink-0" /><span className="text-xs font-semibold text-navy">Artisan notifié{dots}</span></>
              )}
              {step === "accepted" && (
                <><CheckCircle className="w-4 h-4 text-forest shrink-0" /><span className="text-xs font-bold text-forest">Intervention acceptée !</span></>
              )}
              {step === "onway" && (
                <>
                  <Navigation className="w-4 h-4 text-forest shrink-0" />
                  <span className="text-xs font-bold text-forest">En chemin vers vous</span>
                  <span className="ml-auto text-xs font-mono font-bold text-navy">{ARTISAN.eta}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Indicateurs de progression (barres) — visibles sauf auth/payment ── */}
        {step !== "auth" && step !== "payment" && (
          <div className="flex items-center gap-1.5 mb-5">
            {ANIM_STEPS.map((s, i) => (
              <div
                key={s}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: animIdx >= 0 && i <= animIdx ? 28 : 12,
                  backgroundColor: animIdx >= 0 && i <= animIdx ? "#E8302A" : "#D4EBE0",
                }}
              />
            ))}
          </div>
        )}

        {/* ── Écran Auth ── */}
        {step === "auth" && renderAuth()}

        {/* ── Écran Payment ── */}
        {step === "payment" && renderPayment()}

        {/* ── Fiche artisan ── */}
        {isFound && renderArtisanCard()}

        {/* ── Boutons d'action finale ── */}
        {step === "onway" && (
          <div className="w-full flex gap-2.5" style={{ animation: "urgency-fadeIn 0.4s ease-out both" }}>
            <button
              onClick={() => router.push("/tracking/urgence-demo")}
              className="flex-1 h-12 rounded-xl text-white text-sm font-bold cursor-pointer hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #0A4030, #1B6B4E)", border: "none" }}
            >
              <Navigation className="w-4 h-4" />
              Suivre en temps réel
            </button>
            <button
              onClick={onClose}
              className="h-12 px-5 rounded-xl text-navy text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              style={{ border: "1px solid #D4EBE0", background: "white" }}
            >
              <Phone className="w-4 h-4" />
              Appeler
            </button>
          </div>
        )}

        {/* Message de patience */}
        {isSearching && (
          <p className="text-xs text-grayText mt-1">
            Ne quittez pas, nous recherchons le meilleur {tradeName.toLowerCase()} disponible...
          </p>
        )}
      </div>

      {/* ── Animations CSS ── */}
      <style jsx>{`
        @keyframes urgency-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes urgency-scan {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          100% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
        }
        @keyframes urgency-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes urgency-drop {
          0% { transform: translateY(-20px); opacity: 0; }
          60% { transform: translateY(3px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes urgency-slideUp {
          0% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes urgency-fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </Modal>
  );
}
