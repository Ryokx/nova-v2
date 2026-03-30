/**
 * Page d'accueil — / (Formulaire de mise en relation)
 *
 * Parcours en 5 étapes sans affichage d'artisans (anti-discrimination) :
 * 1. Choix du domaine d'intervention
 * 2. Détails + urgence + description
 * 3. Choix du moyen de paiement
 * 4. Création de compte ou connexion
 * 5. Confirmation — mise en relation avec un artisan proche
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, MapPin, User, Mail, Phone,
  FileText, CreditCard, Banknote, Shield, Check, Lock,
  AlertTriangle, Loader2, LogIn, Clock, Zap, ChevronRight,
  Calendar, Navigation, Car, Home as HomeIcon, Wrench, LocateFixed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/features/location-map"), { ssr: false });

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ------------------------------------------------------------------ */
/*  Sous-composant Stripe : formulaire d'ajout de carte                */
/* ------------------------------------------------------------------ */

function StripeCardForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Erreur de validation");
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Erreur lors de l'enregistrement");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="p-3 rounded-[6px] bg-bgPage border border-border space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-navy">Enregistrer une carte</span>
        <button onClick={onCancel} className="text-[11px] text-grayText hover:text-navy cursor-pointer">Annuler</button>
      </div>
      <PaymentElement options={{ layout: "tabs" }} />
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />{error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading || !stripe}
        className={cn(
          "w-full py-2.5 rounded-[6px] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2",
          loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-forest text-white hover:bg-deepForest cursor-pointer",
        )}
      >
        {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enregistrement...</> : "Enregistrer la carte"}
      </button>
      <p className="text-[10px] text-grayText text-center flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Empreinte bancaire sécurisée — aucun débit ne sera effectué
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Domaines                                                           */
/* ------------------------------------------------------------------ */

const TRADES = [
  { id: "plombier", name: "Plomberie", desc: "Fuites, robinets, chauffe-eau, canalisations", img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=250&fit=crop" },
  { id: "electricien", name: "Électricité", desc: "Prises, tableau électrique, éclairage, panne", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop" },
  { id: "serrurier", name: "Serrurerie", desc: "Portes, serrures, blindage, ouverture", img: "https://images.unsplash.com/photo-1677951570313-b0750351c461?w=400&h=250&fit=crop" },
  { id: "chauffagiste", name: "Chauffage / Clim", desc: "Chaudière, radiateurs, climatisation", img: "https://images.unsplash.com/photo-1599028274511-e02a767949a3?w=400&h=250&fit=crop" },
  { id: "peintre", name: "Peinture", desc: "Intérieur, extérieur, revêtements, finitions", img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=250&fit=crop" },
  { id: "menuisier", name: "Menuiserie", desc: "Portes, fenêtres, parquet, meubles sur mesure", img: "https://images.unsplash.com/photo-1626081062126-d3b192c1fcb0?w=400&h=250&fit=crop" },
  { id: "carreleur", name: "Carrelage", desc: "Sols, murs, salles de bain, terrasses", img: "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=400&h=250&fit=crop" },
  { id: "mecanicien", name: "Mécaniciens", desc: "Entretien, réparation, diagnostic automobile", img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=250&fit=crop" },
];

const PHONE_COUNTRIES = [
  { code: "FR", flag: "\u{1F1EB}\u{1F1F7}", dial: "+33", label: "France" },
  { code: "BE", flag: "\u{1F1E7}\u{1F1EA}", dial: "+32", label: "Belgique" },
  { code: "CH", flag: "\u{1F1E8}\u{1F1ED}", dial: "+41", label: "Suisse" },
  { code: "LU", flag: "\u{1F1F1}\u{1F1FA}", dial: "+352", label: "Luxembourg" },
  { code: "MC", flag: "\u{1F1F2}\u{1F1E8}", dial: "+377", label: "Monaco" },
  { code: "DE", flag: "\u{1F1E9}\u{1F1EA}", dial: "+49", label: "Allemagne" },
  { code: "ES", flag: "\u{1F1EA}\u{1F1F8}", dial: "+34", label: "Espagne" },
  { code: "IT", flag: "\u{1F1EE}\u{1F1F9}", dial: "+39", label: "Italie" },
  { code: "PT", flag: "\u{1F1F5}\u{1F1F9}", dial: "+351", label: "Portugal" },
  { code: "GB", flag: "\u{1F1EC}\u{1F1E7}", dial: "+44", label: "Royaume-Uni" },
  { code: "US", flag: "\u{1F1FA}\u{1F1F8}", dial: "+1", label: "USA" },
  { code: "MA", flag: "\u{1F1F2}\u{1F1E6}", dial: "+212", label: "Maroc" },
  { code: "DZ", flag: "\u{1F1E9}\u{1F1FF}", dial: "+213", label: "Algerie" },
  { code: "TN", flag: "\u{1F1F9}\u{1F1F3}", dial: "+216", label: "Tunisie" },
  { code: "SN", flag: "\u{1F1F8}\u{1F1F3}", dial: "+221", label: "Senegal" },
  { code: "CI", flag: "\u{1F1E8}\u{1F1EE}", dial: "+225", label: "Cote d'Ivoire" },
  { code: "CM", flag: "\u{1F1E8}\u{1F1F2}", dial: "+237", label: "Cameroun" },
];

const STEP_TITLES = [
  "Votre domaine",
  "Votre intervention",
  "Mode de paiement",
  "Votre compte",
  "Mise en relation",
];

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);

  /* Step 0 */
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [customTrade, setCustomTrade] = useState("");

  /* Step 1 */
  const [isUrgent, setIsUrgent] = useState(false);
  const [serviceMode, setServiceMode] = useState<"domicile" | "garage" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("FR");
  const [showPhoneCountries, setShowPhoneCountries] = useState(false);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [locating, setLocating] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [addressSearching, setAddressSearching] = useState(false);
  const [addressManual, setAddressManual] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [addressNotFound, setAddressNotFound] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState("");
  const addressDebounce = useRef<NodeJS.Timeout | null>(null);

  /* Step 2 */
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | null>(null);
  const [savedCards, setSavedCards] = useState<{ id: string; brand: string; last4: string; expiry: string }[]>([
    { id: "card_demo_1", brand: "Visa", last4: "4242", expiry: "09/28" },
    { id: "card_demo_2", brand: "Mastercard", last4: "8210", expiry: "03/27" },
  ]);
  const [selectedCard, setSelectedCard] = useState<string | null>("card_demo_1");
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [setupClientSecret, setSetupClientSecret] = useState<string | null>(null);

  /* Step 3 */
  const [accountMode, setAccountMode] = useState<"create" | "login" | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  /* Connexion inline (step 1) */
  const [showInlineLogin, setShowInlineLogin] = useState(false);
  const [inlineEmail, setInlineEmail] = useState("");
  const [inlinePassword, setInlinePassword] = useState("");
  const [inlineError, setInlineError] = useState("");
  const [inlineLoading, setInlineLoading] = useState(false);

  /* Step 4 */
  const [isMatching, setIsMatching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [matchSteps, setMatchSteps] = useState(0);

  /* Transition key — force re-mount for animation */
  const [stepKey, setStepKey] = useState(0);

  const trade = TRADES.find(t => t.id === selectedTrade);
  const tradeName = trade?.name ?? "";
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    setStepKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  /* Fetch saved cards when logged in and on step 2 */
  useEffect(() => {
    if (!isLoggedIn || step !== 2 || paymentMethod !== "card") return;
    let cancelled = false;
    setCardsLoading(true);
    fetch("/api/payment-methods/check")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled || !data) { if (!cancelled) setCardsLoading(false); return; }
        const cards = (data.cards ?? []).map((c: { id: string; card?: { brand: string; last4: string; exp_month: number; exp_year: number } }) => ({
          id: c.id,
          brand: c.card?.brand ?? "Visa",
          last4: c.card?.last4 ?? "****",
          expiry: c.card ? `${String(c.card.exp_month).padStart(2, "0")}/${String(c.card.exp_year).slice(-2)}` : "",
        }));
        // Ne remplacer que si l'API retourne des vraies cartes
        if (cards.length > 0) {
          setSavedCards(cards);
          if (!selectedCard) setSelectedCard(cards[0].id);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setCardsLoading(false); });
    return () => { cancelled = true; };
  }, [isLoggedIn, step, paymentMethod]);

  /* Pre-fill from session */
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) {
        const parts = session.user.name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (session.user.email) setEmail(session.user.email);
    }
  }, [session]);

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!selectedTrade;
      case 1: return firstName.trim().length >= 2 && email.includes("@") && address.trim().length >= 5 && description.trim().length >= 10 && (selectedTrade !== "mecanicien" || !!serviceMode);
      case 2: return paymentMethod === "cash" || (paymentMethod === "card" && (isLoggedIn ? !!selectedCard : true));
      case 3: return isLoggedIn || (accountMode === "create" && password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) || (accountMode === "login" && loginEmail.includes("@") && loginPassword.length >= 1);
      default: return true;
    }
  };

  const startMatching = () => {
    setIsMatching(true);
    setMatched(false);
    setMatchSteps(0);
    setTimeout(() => setMatchSteps(1), 800);
    setTimeout(() => setMatchSteps(2), 1600);
    setTimeout(() => setMatchSteps(3), 2400);
    setTimeout(() => {
      setIsMatching(false);
      setMatched(true);
      // Persister l'intervention en cours dans localStorage pour le dashboard + navbar
      try {
        localStorage.setItem("nova_active_mission", JSON.stringify({
          id: "m_" + Date.now(),
          trade: tradeName,
          address,
          isUrgent,
          paymentMethod,
          status: "SEARCHING", // SEARCHING → EN_ROUTE → ON_SITE → DEVIS_SIGNED
          createdAt: new Date().toISOString(),
        }));
      } catch {}
    }, 3200);
    setTimeout(() => {
      router.push("/dashboard");
    }, 6500);
  };

  const handleNext = async () => {
    if (step === 2 && isLoggedIn) {
      setStep(4);
      startMatching();
      return;
    }
    if (step === 3) {
      if (isLoggedIn) {
        setStep(4);
        startMatching();
        return;
      }
      setAuthError("");
      setAuthLoading(true);

      try {
        if (accountMode === "create") {
          /* 1. Créer le compte en BDD */
          const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fullName,
              email: email.trim(),
              password,
              role: "CLIENT",
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            setAuthError(data.error ?? "Erreur lors de la création du compte");
            setAuthLoading(false);
            return;
          }

          /* 2. Connecter la session automatiquement */
          const login = await signIn("credentials", {
            email: email.trim(),
            password,
            redirect: false,
          });
          if (login?.error) {
            setAuthError("Compte créé mais connexion échouée. Essayez de vous connecter.");
            setAuthLoading(false);
            return;
          }
        }

        if (accountMode === "login") {
          const login = await signIn("credentials", {
            email: loginEmail.trim(),
            password: loginPassword,
            redirect: false,
          });
          if (login?.error) {
            setAuthError("Email ou mot de passe incorrect");
            setAuthLoading(false);
            return;
          }
        }
      } catch {
        setAuthError("Erreur de connexion au serveur");
        setAuthLoading(false);
        return;
      }

      setAuthLoading(false);
      setStep(4);
      startMatching();
      return;
    }
    setStep(s => s + 1);
  };

  /* ---------------------------------------------------------------- */
  /*  Input helper                                                     */
  /* ---------------------------------------------------------------- */

  const fieldClass = "w-full px-3 py-2.5 rounded-[6px] border border-border bg-white text-sm text-navy placeholder:text-gray-400 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-colors duration-200";
  const fieldWithIconClass = "w-full pl-9 pr-3 py-2.5 rounded-[6px] border border-border bg-white text-sm text-navy placeholder:text-gray-400 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-colors duration-200";
  const labelClass = "text-xs font-semibold text-navy mb-1 block";

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="bg-bgPage flex flex-col min-h-screen">

      {/* ─── Sticky header ─── */}
      <header className="sticky top-0 z-40 bg-bgPage/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center gap-3">
          {step > 0 && step < 4 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="w-8 h-8 rounded-[6px] bg-forest/8 flex items-center justify-center text-forest hover:bg-forest/15 transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : null}
          <span className="flex-1 text-sm font-bold text-navy font-heading">{STEP_TITLES[step]}</span>
          {step < 4 && (
            <span className="text-xs text-grayText font-mono tabular-nums bg-surface px-2 py-1 rounded-[6px]">{step + 1}/5</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="max-w-5xl mx-auto px-5 pb-2 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-[3px] flex-1 rounded-sm transition-all duration-500",
                i <= step ? "bg-forest" : "bg-border",
              )}
            />
          ))}
        </div>
      </header>

      {/* ─── Main content ─── */}
      <main className={cn("max-w-5xl mx-auto w-full px-5 py-6", step === 0 ? "pb-6" : "pb-32")}>
       <div
         key={stepKey}
         className="animate-stepIn"
         style={{ animationDuration: "350ms", animationFillMode: "both" }}
       >
        {/* ════════════ STEP 0 — Domaine ════════════ */}
        {step === 0 && (
          <div>
            {/* Hero carte interactive — localisation */}
            <LocationMap onLocationChange={(addr) => { setAddress(addr); setAddressConfirmed(true); setDetectedAddress(addr); }} />

            {/* Hero banner with image */}
            <div className="relative rounded-[6px] overflow-hidden mb-6">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop"
                alt="Artisan en intervention"
                width={1200}
                height={400}
                className="w-full h-[200px] md:h-[240px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-deepForest/95 via-deepForest/80 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-8">
                <h2 className="text-xl md:text-2xl font-extrabold font-heading leading-tight mb-2 text-white max-w-md">
                  De quel service avez-vous besoin ?
                </h2>
                <p className="text-sm text-white/70 max-w-sm leading-relaxed">
                  Sélectionnez votre domaine. Un artisan certifié sera trouvé automatiquement.
                </p>
                <div className="flex items-center gap-5 mt-4">
                  {[
                    { icon: Shield, label: "Certifiés" },
                    { icon: Lock, label: "Séquestre" },
                    { icon: Clock, label: "< 30 min" },
                  ].map(({ icon: I, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <I className="w-3.5 h-3.5 text-lightSage" />
                      <span className="text-[11px] text-white/60 font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service grid 2x4 avec images */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TRADES.map(t => {
                const sel = selectedTrade === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTrade(t.id);
                      if (t.id !== "mecanicien") setServiceMode(null);
                      setTimeout(() => setStep(1), 400);
                    }}
                    className={cn(
                      "relative flex flex-col rounded-[6px] border overflow-hidden transition-all duration-200 text-left cursor-pointer group",
                      sel
                        ? "border-forest shadow-md scale-[0.97]"
                        : "border-border bg-white hover:border-forest/30 hover:shadow-sm",
                    )}
                  >
                    {/* Image */}
                    <div className="relative h-24 md:h-28 overflow-hidden">
                      <Image
                        src={t.img}
                        alt={t.name}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {sel && (
                        <div className="absolute inset-0 bg-forest/30" />
                      )}
                      {sel && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-forest flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Texte */}
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="text-[13px] font-bold text-navy mb-0.5">{t.name}</div>
                      <div className="text-[10px] text-grayText leading-snug flex-1">{t.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* ════════════ STEP 1 — Votre intervention ════════════ */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Header avec badge service */}
            <div>
              <h2 className="text-xl font-extrabold text-navy font-heading mb-1">Votre intervention</h2>
              <p className="text-sm text-grayText">Completez les details pour trouver le bon professionnel.</p>
            </div>

            {selectedTrade && (
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-surface border border-border/60">
                <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                  {tradeName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-navy">{tradeName}</div>
                  <div className="text-[11px] text-grayText">{trade?.desc}</div>
                </div>
                <button onClick={() => setStep(0)} className="text-[11px] text-forest font-semibold hover:text-deepForest cursor-pointer">Changer</button>
              </div>
            )}

            {/* Section 1 — Type d'intervention */}
            <div className="rounded-[12px] border border-border bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-bgPage border-b border-border">
                <span className="text-[11px] font-bold text-navy uppercase tracking-wider">1. Type d&apos;intervention</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsUrgent(false)}
                    className={cn(
                      "p-4 rounded-[10px] border-2 text-left transition-all duration-200 cursor-pointer",
                      !isUrgent ? "border-forest bg-forest/4 shadow-sm" : "border-border bg-white hover:border-forest/30",
                    )}
                  >
                    <div className="w-9 h-9 rounded-[8px] bg-forest/10 flex items-center justify-center mb-3">
                      <Calendar className="w-4.5 h-4.5 text-forest" />
                    </div>
                    <span className="text-[13px] font-bold text-navy block mb-1">Classique</span>
                    <p className="text-[11px] text-grayText leading-snug">Planifiee selon vos disponibilites. Devis sur place.</p>
                    {!isUrgent && (
                      <div className="mt-3 flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-forest flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>
                        <span className="text-[11px] font-semibold text-forest">Selectionne</span>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setIsUrgent(true)}
                    className={cn(
                      "p-4 rounded-[10px] border-2 text-left transition-all duration-200 cursor-pointer",
                      isUrgent ? "border-red bg-red/4 shadow-sm" : "border-border bg-white hover:border-red/30",
                    )}
                  >
                    <div className="w-9 h-9 rounded-[8px] bg-red/10 flex items-center justify-center mb-3">
                      <Zap className="w-4.5 h-4.5 text-red" />
                    </div>
                    <span className="text-[13px] font-bold text-navy block mb-1">Urgence 24h/24</span>
                    <p className="text-[11px] text-grayText leading-snug">Intervention rapide dans les plus brefs delais.</p>
                    {isUrgent && (
                      <div className="mt-3 flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-red flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>
                        <span className="text-[11px] font-semibold text-red">Selectionne</span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Choix domicile / garage (mecaniciens uniquement) */}
                {selectedTrade === "mecanicien" && (
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <label className="text-[11px] font-bold text-navy uppercase tracking-wider mb-2 block">Lieu de l&apos;intervention</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setServiceMode("domicile")}
                        className={cn(
                          "p-3.5 rounded-[10px] border-2 text-left transition-all duration-200 cursor-pointer",
                          serviceMode === "domicile" ? "border-forest bg-forest/4 shadow-sm" : "border-border bg-white hover:border-forest/30",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <HomeIcon className="w-4 h-4 text-forest" />
                          <span className="text-[13px] font-bold text-navy">A domicile</span>
                        </div>
                        <p className="text-[11px] text-grayText leading-snug">Le mecanicien se deplace chez vous.</p>
                        {serviceMode === "domicile" && (
                          <div className="mt-2.5 flex items-center gap-1">
                            <div className="w-3.5 h-3.5 rounded-full bg-forest flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>
                            <span className="text-[10px] font-semibold text-forest">Selectionne</span>
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => setServiceMode("garage")}
                        className={cn(
                          "p-3.5 rounded-[10px] border-2 text-left transition-all duration-200 cursor-pointer",
                          serviceMode === "garage" ? "border-forest bg-forest/4 shadow-sm" : "border-border bg-white hover:border-forest/30",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Wrench className="w-4 h-4 text-forest" />
                          <span className="text-[13px] font-bold text-navy">Au garage</span>
                        </div>
                        <p className="text-[11px] text-grayText leading-snug">Deposez votre vehicule au garage.</p>
                        {serviceMode === "garage" && (
                          <div className="mt-2.5 flex items-center gap-1">
                            <div className="w-3.5 h-3.5 rounded-full bg-forest flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>
                            <span className="text-[10px] font-semibold text-forest">Selectionne</span>
                          </div>
                        )}
                      </button>
                    </div>
                    {serviceMode && (
                      <div className="mt-3 flex items-start gap-2 p-2.5 rounded-[8px] bg-forest/5 border border-forest/15">
                        <Car className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                        <span className="text-[11px] text-grayText leading-snug">
                          {serviceMode === "domicile"
                            ? "Nous rechercherons des mecaniciens proposant le deplacement a domicile."
                            : "Nous rechercherons des garages partenaires proches de votre adresse."}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 2 — Vos coordonnees */}
            <div className="rounded-[12px] border border-border bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-bgPage border-b border-border flex items-center justify-between">
                <span className="text-[11px] font-bold text-navy uppercase tracking-wider">2. Vos coordonnees</span>
                {!isLoggedIn && !showInlineLogin && (
                  <button
                    onClick={() => setShowInlineLogin(true)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-forest hover:text-deepForest cursor-pointer"
                  >
                    <LogIn className="w-3 h-3" />
                    Deja un compte ?
                  </button>
                )}
              </div>
              <div className="p-4">
                {/* Inline login */}
                {!isLoggedIn && showInlineLogin && (
                  <div className="mb-4 p-4 rounded-[10px] bg-bgPage border border-border/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-navy">Connexion rapide</span>
                      <button onClick={() => { setShowInlineLogin(false); setInlineError(""); }} className="text-[11px] text-grayText hover:text-navy cursor-pointer">Annuler</button>
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                        <input type="email" value={inlineEmail} onChange={e => { setInlineEmail(e.target.value); setInlineError(""); }} placeholder="votre@email.fr" className={fieldWithIconClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                        <input type="password" value={inlinePassword} onChange={e => { setInlinePassword(e.target.value); setInlineError(""); }} placeholder="Votre mot de passe" className={fieldWithIconClass} />
                      </div>
                    </div>
                    {inlineError && (
                      <div className="flex items-center gap-2 text-xs text-red font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />{inlineError}
                      </div>
                    )}
                    <button
                      onClick={async () => {
                        if (!inlineEmail.includes("@") || !inlinePassword) { setInlineError("Veuillez remplir tous les champs"); return; }
                        setInlineLoading(true); setInlineError("");
                        const res = await signIn("credentials", { email: inlineEmail.trim(), password: inlinePassword, redirect: false });
                        setInlineLoading(false);
                        if (res?.error) { setInlineError("Email ou mot de passe incorrect"); }
                        else { setShowInlineLogin(false); setTimeout(() => setStep(2), 400); }
                      }}
                      disabled={inlineLoading}
                      className={cn(
                        "w-full py-2.5 rounded-[8px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200",
                        inlineLoading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-deepForest to-forest text-white shadow-sm hover:shadow-md cursor-pointer",
                      )}
                    >
                      {inlineLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</> : "Se connecter"}
                    </button>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="mb-4 p-3 rounded-[10px] bg-forest/5 border border-forest/15 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {(session?.user?.name ?? "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-navy font-semibold block truncate">{session?.user?.name ?? session?.user?.email}</span>
                      <span className="text-[10px] text-grayText">Connecte</span>
                    </div>
                    <Check className="w-4 h-4 text-forest shrink-0" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Prenom *</label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jean" className={fieldWithIconClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Nom</label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dupont" className={fieldWithIconClass} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@exemple.fr" className={fieldWithIconClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Telephone</label>
                    <div className="relative flex gap-0">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPhoneCountries(!showPhoneCountries)}
                          className="flex items-center gap-1.5 h-full px-3 py-2.5 rounded-l-[6px] border border-r-0 border-border bg-bgPage hover:bg-surface transition-colors cursor-pointer"
                        >
                          <span className="text-base leading-none">{PHONE_COUNTRIES.find(c => c.code === phoneCountry)?.flag}</span>
                          <span className="text-xs font-semibold text-navy">{PHONE_COUNTRIES.find(c => c.code === phoneCountry)?.dial}</span>
                          <svg className="w-3 h-3 text-grayText" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 4.5L6 7.5L9 4.5"/></svg>
                        </button>
                        {showPhoneCountries && (
                          <div className="absolute z-30 top-full left-0 mt-1 bg-white rounded-[8px] shadow-lg border border-border overflow-hidden max-h-[240px] overflow-y-auto w-[220px]">
                            {PHONE_COUNTRIES.map(c => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => { setPhoneCountry(c.code); setShowPhoneCountries(false); }}
                                className={cn(
                                  "w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-bgPage transition-colors cursor-pointer border-b border-border/20 last:border-0",
                                  phoneCountry === c.code && "bg-forest/5"
                                )}
                              >
                                <span className="text-base leading-none">{c.flag}</span>
                                <span className="text-xs text-navy font-medium flex-1">{c.label}</span>
                                <span className="text-xs text-grayText font-mono">{c.dial}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={phoneCountry === "FR" ? "06 12 34 56 78" : "Votre numero"} className="w-full px-3 py-2.5 rounded-r-[6px] border border-border bg-white text-sm text-navy placeholder:text-gray-400 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-colors duration-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 — Adresse & description */}
            <div className="rounded-[12px] border border-border bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-bgPage border-b border-border">
                <span className="text-[11px] font-bold text-navy uppercase tracking-wider">3. Intervention</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className={labelClass}>
                    {selectedTrade === "mecanicien" && serviceMode === "garage"
                      ? "Votre adresse (pour trouver un garage proche) *"
                      : selectedTrade === "mecanicien" && serviceMode === "domicile"
                        ? "Adresse d\u0027intervention (domicile) *"
                        : "Adresse d\u0027intervention *"}
                  </label>

                  {/* Adresse confirmée — affichage compact */}
                  {addressConfirmed && !addressManual ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-[6px] bg-forest/5 border border-forest/20">
                      <div className="w-5 h-5 rounded-full bg-forest flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[12px] text-navy font-medium flex-1 truncate">{address}</span>
                      <button
                        type="button"
                        onClick={() => { setAddressConfirmed(false); setAddress(""); setAddressManual(false); setAddressNotFound(false); }}
                        className="text-[11px] text-grayText hover:text-navy font-medium cursor-pointer"
                      >
                        Modifier
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Suggestion adresse detectee par la carte */}
                      {detectedAddress && !address && (
                        <button
                          type="button"
                          onClick={() => { setAddress(detectedAddress); setAddressConfirmed(true); }}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-[6px] bg-forest/5 border border-forest/20 hover:bg-forest/10 transition-colors cursor-pointer text-left"
                        >
                          <LocateFixed className="w-4 h-4 text-forest shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-semibold text-forest block">Adresse detectee</span>
                            <span className="text-[12px] text-navy truncate block">{detectedAddress}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-forest shrink-0" />
                        </button>
                      )}

                      {/* Champ de saisie avec autocomplete */}
                      <div className="relative">
                        <div className="relative flex gap-2">
                          <div className="relative flex-1">
                            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                            <input
                              type="text"
                              value={address}
                              onChange={e => {
                                const val = e.target.value;
                                setAddress(val);
                                setAddressConfirmed(false);
                                setAddressNotFound(false);
                                if (addressManual) return;
                                if (addressDebounce.current) clearTimeout(addressDebounce.current);
                                if (val.length < 3) { setAddressSuggestions([]); return; }
                                addressDebounce.current = setTimeout(async () => {
                                  setAddressSearching(true);
                                  try {
                                    const res = await fetch(
                                      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&countrycodes=fr&limit=5&addressdetails=1`,
                                      { headers: { "Accept-Language": "fr" } }
                                    );
                                    const data = await res.json();
                                    setAddressSuggestions(data);
                                    if (data.length === 0 && val.length >= 5) setAddressNotFound(true);
                                    else setAddressNotFound(false);
                                  } catch { setAddressSuggestions([]); }
                                  setAddressSearching(false);
                                }, 400);
                              }}
                              placeholder={addressManual ? "Saisissez votre adresse complète..." : "12 rue de Rivoli, 75004 Paris"}
                              className={fieldWithIconClass}
                            />
                            {addressSearching && (
                              <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-forest animate-spin" />
                            )}
                          </div>
                          {!address && !addressManual && (
                            <button
                              type="button"
                              onClick={() => {
                                if (!navigator.geolocation) return;
                                setLocating(true);
                                navigator.geolocation.getCurrentPosition(
                                  async (pos) => {
                                    try {
                                      const res = await fetch(
                                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&addressdetails=1`,
                                        { headers: { "Accept-Language": "fr" } }
                                      );
                                      const data = await res.json();
                                      if (data.address) {
                                        const a = data.address;
                                        const parts = [a.house_number, a.road, a.postcode, a.city || a.town || a.village || a.municipality].filter(Boolean);
                                        const addr = parts.length >= 2 ? parts.join(" ") : data.display_name.split(",").slice(0, 3).join(",").trim();
                                        setAddress(addr);
                                        setAddressConfirmed(true);
                                      }
                                    } catch {}
                                    setLocating(false);
                                  },
                                  () => setLocating(false),
                                  { enableHighAccuracy: true, timeout: 10000 }
                                );
                              }}
                              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-[6px] bg-forest/8 text-forest text-[11px] font-semibold hover:bg-forest/15 transition-colors cursor-pointer border border-forest/20"
                            >
                              {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                              Me localiser
                            </button>
                          )}
                        </div>

                        {/* Suggestions dropdown */}
                        {addressSuggestions.length > 0 && !addressManual && (
                          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-[6px] shadow-lg border border-border overflow-hidden max-h-[200px] overflow-y-auto">
                            {addressSuggestions.map((s, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setAddress(s.display_name.split(",").slice(0, 4).join(",").trim());
                                  setAddressSuggestions([]);
                                  setAddressConfirmed(true);
                                  setAddressNotFound(false);
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-bgPage transition-colors flex items-start gap-2 cursor-pointer border-b border-border/30 last:border-0"
                              >
                                <MapPin className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                                <span className="text-[11px] text-navy leading-snug">{s.display_name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Adresse introuvable */}
                      {addressNotFound && !addressManual && (
                        <div className="flex items-start gap-2.5 p-3 rounded-[6px] bg-gold/8 border border-gold/20">
                          <AlertTriangle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-[12px] font-semibold text-navy mb-1">Adresse introuvable</p>
                            <p className="text-[11px] text-grayText leading-snug mb-2">Nous n&apos;avons pas trouvé cette adresse. Vous pouvez la saisir manuellement.</p>
                            <button
                              type="button"
                              onClick={() => { setAddressManual(true); setAddressSuggestions([]); setAddressNotFound(false); }}
                              className="text-[11px] font-bold text-forest hover:text-deepForest cursor-pointer flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              Entrer l&apos;adresse manuellement
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Mode manuel activé */}
                      {addressManual && (
                        <div className="flex items-center gap-2 p-2 rounded-[6px] bg-surface border border-border/60">
                          <FileText className="w-3.5 h-3.5 text-grayText shrink-0" />
                          <span className="text-[11px] text-grayText flex-1">Mode saisie manuelle — la vérification est désactivée</span>
                          <button
                            type="button"
                            onClick={() => { setAddressManual(false); setAddress(""); setAddressConfirmed(false); }}
                            className="text-[11px] text-forest font-semibold hover:text-deepForest cursor-pointer"
                          >
                            Réactiver
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Description du besoin * <span className="font-normal text-grayText">(10 car. min)</span></label>
                  <div className="relative">
                    <FileText className="absolute left-2.5 top-2.5 w-4 h-4 text-grayText" />
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder={selectedTrade === "mecanicien"
                        ? "Decrivez le probleme ou l'entretien souhaite (marque, modele, kilometrage)..."
                        : "Decrivez votre probleme ou le travail a realiser..."}
                      rows={4}
                      className="w-full pl-9 pr-3 py-2.5 rounded-[8px] border border-border bg-white text-sm text-navy placeholder:text-gray-400 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-colors duration-200 resize-none"
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className={cn("text-xs font-mono", description.trim().length >= 10 ? "text-success" : "text-grayText")}>
                      {description.trim().length}/10{description.trim().length >= 10 && " \u2713"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicateur de progression */}
            <div className="flex items-center gap-3 p-3 rounded-[10px] bg-bgPage border border-border/40">
              <Shield className="w-4 h-4 text-forest shrink-0" />
              <p className="text-[11px] text-grayText leading-snug">
                <strong className="text-navy">100% securise</strong> — Vos donnees sont protegees et ne seront partagees qu&apos;avec l&apos;artisan selectionne.
              </p>
            </div>
          </div>
        )}

        {/* ════════════ STEP 2 — Paiement ════════════ */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-extrabold text-navy font-heading mb-1">Comment souhaitez-vous régler ?</h2>
            <p className="text-sm text-grayText mb-6">Ce choix déterminera comment vous réglerez l&apos;artisan après l&apos;intervention.</p>

            <div className="space-y-3">
              {/* Carte */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "w-full flex items-start gap-4 p-5 rounded-[6px] border-2 transition-all duration-200 text-left cursor-pointer",
                  paymentMethod === "card"
                    ? "border-forest bg-forest/4 shadow-sm"
                    : "border-border bg-white hover:border-forest/30",
                )}
              >
                <div className="w-11 h-11 rounded-[6px] bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-5 h-5 text-forest" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-navy">Paiement en ligne</div>
                  <div className="text-xs text-grayText mt-0.5">Carte bancaire, Apple Pay, virement bancaire</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-surface border border-forest/10">
                    <Shield className="w-3 h-3 text-forest" />
                    <span className="text-[11px] text-forest font-semibold">Séquestre activé — artisan payé après votre validation</span>
                  </div>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                  paymentMethod === "card" ? "border-forest bg-forest" : "border-gray-300",
                )}>
                  {paymentMethod === "card" && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>

              {/* Espèces */}
              <button
                onClick={() => setPaymentMethod("cash")}
                className={cn(
                  "w-full flex items-start gap-4 p-5 rounded-[6px] border-2 transition-all duration-200 text-left cursor-pointer",
                  paymentMethod === "cash"
                    ? "border-forest bg-forest/4 shadow-sm"
                    : "border-border bg-white hover:border-forest/30",
                )}
              >
                <div className="w-11 h-11 rounded-[6px] bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Banknote className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-navy">Paiement en espèces</div>
                  <div className="text-xs text-grayText mt-0.5">Réglez directement l&apos;artisan après l&apos;intervention</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-amber-50 border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span className="text-[11px] text-amber-700 font-medium">Le service de séquestre ne sera pas disponible</span>
                  </div>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                  paymentMethod === "cash" ? "border-forest bg-forest" : "border-gray-300",
                )}>
                  {paymentMethod === "cash" && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            </div>

            {/* Séquestre explainer */}
            {paymentMethod === "card" && (
              <div className="mt-6 p-4 rounded-[6px] bg-white border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-forest" />
                  <span className="text-sm font-bold text-navy">Comment fonctionne le séquestre ?</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { n: "1", text: "Votre paiement est bloqué sur un compte sécurisé Nova" },
                    { n: "2", text: "L'artisan se déplace et réalise l'intervention" },
                    { n: "3", text: "Vous validez la qualité du travail" },
                    { n: "4", text: "L'artisan est payé — vous êtes protégé à 100%" },
                  ].map(({ n, text }) => (
                    <div key={n} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-[6px] bg-forest/10 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-forest">{n}</span>
                      </div>
                      <span className="text-xs text-grayText leading-relaxed pt-0.5">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sélection de carte (utilisateur connecté + paiement en ligne) */}
            {paymentMethod === "card" && isLoggedIn && (
              <div className="mt-5 p-4 rounded-[6px] bg-white border border-border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-navy">Votre moyen de paiement</span>
                  {cardsLoading && <Loader2 className="w-4 h-4 text-forest animate-spin" />}
                </div>

                {/* Cartes sauvegardées */}
                {savedCards.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {savedCards.map(card => (
                      <button
                        key={card.id}
                        onClick={() => { setSelectedCard(card.id); setShowAddCard(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] border transition-all duration-200 text-left cursor-pointer",
                          selectedCard === card.id
                            ? "border-forest bg-forest/4"
                            : "border-border bg-bgPage hover:border-forest/30",
                        )}
                      >
                        <div className={cn(
                          "w-10 h-6 rounded-[4px] flex items-center justify-center text-[9px] font-bold text-white",
                          card.brand.toLowerCase() === "visa" ? "bg-[#1A1F71]" :
                          card.brand.toLowerCase() === "mastercard" ? "bg-[#EB001B]" : "bg-navy",
                        )}>
                          {card.brand.toUpperCase().slice(0, 4)}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-navy">{card.brand} •••• {card.last4}</span>
                          <span className="text-[11px] text-grayText ml-2">Exp. {card.expiry}</span>
                        </div>
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          selectedCard === card.id ? "border-forest bg-forest" : "border-gray-300",
                        )}>
                          {selectedCard === card.id && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Aucune carte */}
                {!cardsLoading && savedCards.length === 0 && !showAddCard && (
                  <p className="text-xs text-grayText mb-3">Aucun moyen de paiement enregistré.</p>
                )}

                {/* Ajouter une carte via Stripe Elements */}
                {showAddCard && setupClientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret: setupClientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#1B6B4E", borderRadius: "6px" } } }}>
                    <StripeCardForm
                      onSuccess={() => {
                        setShowAddCard(false);
                        setSetupClientSecret(null);
                        // Recharger les cartes
                        setCardsLoading(true);
                        fetch("/api/payment-methods/check")
                          .then(r => r.ok ? r.json() : { cards: [] })
                          .then(data => {
                            const cards = (data.cards ?? []).map((c: { id: string; card?: { brand: string; last4: string; exp_month: number; exp_year: number } }) => ({
                              id: c.id,
                              brand: c.card?.brand ?? "Visa",
                              last4: c.card?.last4 ?? "****",
                              expiry: c.card ? `${String(c.card.exp_month).padStart(2, "0")}/${String(c.card.exp_year).slice(-2)}` : "",
                            }));
                            setSavedCards(cards);
                            if (cards.length > 0) setSelectedCard(cards[cards.length - 1].id);
                          })
                          .catch(() => {})
                          .finally(() => setCardsLoading(false));
                      }}
                      onCancel={() => { setShowAddCard(false); setSetupClientSecret(null); }}
                    />
                  </Elements>
                ) : showAddCard ? (
                  <div className="p-4 rounded-[6px] bg-bgPage border border-border flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 text-forest animate-spin" />
                    <span className="text-xs text-grayText">Chargement du formulaire sécurisé...</span>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      setShowAddCard(true);
                      try {
                        const res = await fetch("/api/setup-intent", { method: "POST" });
                        const data = await res.json();
                        if (data?.clientSecret) {
                          setSetupClientSecret(data.clientSecret);
                        }
                      } catch {}
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[6px] border border-dashed border-forest/25 text-xs font-semibold text-forest hover:bg-forest/4 transition-colors duration-200 cursor-pointer"
                  >
                    + Ajouter une carte
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════ STEP 3 — Compte ════════════ */}
        {step === 3 && (
          <div>
            {isLoggedIn ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-success" />
                </div>
                <h2 className="text-lg font-extrabold text-navy font-heading mb-2">Vous etes connecte</h2>
                <p className="text-sm text-grayText">
                  Bonjour <strong className="text-navy">{session?.user?.name ?? ""}</strong>. Votre demande sera liee a votre compte.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-xl font-extrabold text-navy font-heading mb-1">Derniere etape</h2>
                  <p className="text-sm text-grayText">Creez votre compte ou connectez-vous pour finaliser.</p>
                </div>

                {/* Resume de la demande */}
                <div className="p-4 rounded-[12px] bg-surface border border-border/60">
                  <div className="text-[10px] font-semibold text-grayText uppercase tracking-wider mb-3">Resume de votre demande</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-[8px] bg-white">
                      <div className="text-[10px] text-grayText">Service</div>
                      <div className="text-xs text-navy font-bold truncate">{tradeName}</div>
                    </div>
                    <div className="p-2.5 rounded-[8px] bg-white">
                      <div className="text-[10px] text-grayText">Type</div>
                      <div className="text-xs font-bold truncate" style={{ color: isUrgent ? "#E8302A" : "#1B6B4E" }}>
                        {isUrgent ? "Urgence 24h/24" : "Classique"}
                      </div>
                    </div>
                    <div className="col-span-2 p-2.5 rounded-[8px] bg-white">
                      <div className="text-[10px] text-grayText">Adresse</div>
                      <div className="text-xs text-navy font-medium truncate">{address || "Non renseignee"}</div>
                    </div>
                  </div>
                </div>

                {/* Tabs Creer / Se connecter */}
                <div className="rounded-[12px] border border-border bg-white shadow-sm overflow-hidden">
                  <div className="grid grid-cols-2 border-b border-border">
                    <button
                      onClick={() => setAccountMode("create")}
                      className={cn(
                        "py-3.5 text-center text-xs font-bold transition-all cursor-pointer relative",
                        accountMode === "create"
                          ? "text-forest bg-white"
                          : "text-grayText bg-bgPage hover:text-navy",
                      )}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        Creer un compte
                      </div>
                      {accountMode === "create" && (
                        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-forest rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => setAccountMode("login")}
                      className={cn(
                        "py-3.5 text-center text-xs font-bold transition-all cursor-pointer relative",
                        accountMode === "login"
                          ? "text-forest bg-white"
                          : "text-grayText bg-bgPage hover:text-navy",
                      )}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <LogIn className="w-3.5 h-3.5" />
                        Se connecter
                      </div>
                      {accountMode === "login" && (
                        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-forest rounded-full" />
                      )}
                    </button>
                  </div>

                  <div className="p-5">
                    {/* Create */}
                    {accountMode === "create" && (
                      <div className="space-y-4">
                        {/* Infos pre-remplies */}
                        <div className="flex items-center gap-3 p-3 rounded-[8px] bg-bgPage">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                            {firstName ? firstName.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-navy truncate">
                              {firstName} {lastName}
                            </div>
                            <div className="text-xs text-grayText truncate">{email || "Email non renseigne"}</div>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest/10">
                            <Check className="w-3 h-3 text-forest" />
                            <span className="text-[10px] font-semibold text-forest">Pre-rempli</span>
                          </div>
                        </div>

                        {/* Mot de passe */}
                        <div>
                          <label className={labelClass}>Choisissez un mot de passe *</label>
                          <div className="relative">
                            <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                            <input
                              type="password"
                              value={password}
                              onChange={e => { setPassword(e.target.value); setAuthError(""); }}
                              placeholder="Min. 8 caracteres"
                              className={fieldWithIconClass}
                            />
                          </div>

                          {/* Indicateurs de force */}
                          <div className="mt-3 space-y-2">
                            <div className="flex gap-1.5">
                              {[
                                password.length >= 8,
                                /[A-Z]/.test(password),
                                /[0-9]/.test(password),
                              ].map((ok, i) => (
                                <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", ok ? "bg-success" : "bg-border")} />
                              ))}
                            </div>
                            <div className="flex justify-between">
                              {[
                                { ok: password.length >= 8, label: "8 caracteres" },
                                { ok: /[A-Z]/.test(password), label: "1 majuscule" },
                                { ok: /[0-9]/.test(password), label: "1 chiffre" },
                              ].map(({ ok, label }) => (
                                <span key={label} className={cn("text-[10px] font-medium flex items-center gap-1", ok ? "text-success" : "text-grayText")}>
                                  {ok ? <Check className="w-2.5 h-2.5" /> : <span className="w-2.5 h-2.5 rounded-full border border-current inline-block" />}
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* CGU */}
                        <p className="text-[11px] text-grayText leading-relaxed">
                          En creant votre compte, vous acceptez les{" "}
                          <span className="text-forest font-semibold cursor-pointer hover:underline">conditions generales</span>{" "}
                          et la{" "}
                          <span className="text-forest font-semibold cursor-pointer hover:underline">politique de confidentialite</span>{" "}
                          de Nova.
                        </p>
                      </div>
                    )}

                    {/* Login */}
                    {accountMode === "login" && (
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Email</label>
                          <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                            <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="votre@email.fr" className={fieldWithIconClass} />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Mot de passe</label>
                          <div className="relative">
                            <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grayText" />
                            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Votre mot de passe" className={fieldWithIconClass} />
                          </div>
                        </div>

                        {/* Separateur */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-[10px] text-grayText font-medium">OU</span>
                          <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Connexion sociale */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => signIn("google")}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-[8px] border border-border bg-white hover:bg-bgPage transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            <span className="text-xs font-semibold text-navy">Google</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => signIn("apple")}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-[8px] border border-border bg-white hover:bg-bgPage transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                            <span className="text-xs font-semibold text-navy">Apple</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-grayText text-center">
                          Les informations saisies seront automatiquement liees a votre demande.
                        </p>
                      </div>
                    )}

                    {/* Pas encore choisi */}
                    {!accountMode && (
                      <div className="py-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-bgPage flex items-center justify-center mx-auto mb-3">
                          <User className="w-5 h-5 text-grayText" />
                        </div>
                        <p className="text-sm text-grayText">Choisissez une option ci-dessus</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Auth error */}
                {authError && (
                  <div className="p-3 rounded-[8px] bg-red/5 border border-red/20 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red shrink-0" />
                    <span className="text-xs text-red font-medium">{authError}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════ STEP 4 — Matching ════════════ */}
        {step === 4 && (
          <div className="py-8">
            {isMatching && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-[6px] bg-forest/10 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-forest animate-spin" />
                </div>
                <h2 className="text-xl font-extrabold text-navy font-heading mb-2">
                  Recherche en cours...
                </h2>
                <p className="text-sm text-grayText mb-8">
                  Nous trouvons l&apos;artisan certifié le plus proche de <strong className="text-navy">{address}</strong>
                </p>
                <div className="max-w-lg mx-auto space-y-3 text-left">
                  {[
                    "Vérification des disponibilités",
                    "Analyse de la zone géographique",
                    "Sélection du meilleur profil",
                  ].map((label, i) => (
                    <div
                      key={label}
                      className={cn(
                        "flex items-center gap-3 text-sm transition-opacity duration-500",
                        matchSteps > i ? "opacity-100" : "opacity-20",
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0",
                        matchSteps > i ? "bg-forest" : "bg-border",
                      )}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={matchSteps > i ? "text-navy" : "text-grayText"}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matched && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-[6px] bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-xl font-extrabold text-navy font-heading mb-2">Artisan trouvé !</h2>
                <p className="text-sm text-grayText mb-8">
                  Un artisan certifié en <strong className="text-navy">{tradeName}</strong> proche de chez vous a été sélectionné.
                  {isUrgent && " Il est en route vers votre adresse."}
                </p>

                {/* Tracking en temps réel si urgence */}
                {isUrgent && (
                  <div className="bg-white rounded-[6px] border border-border shadow-sm p-5 text-left max-w-xl mx-auto mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
                      <span className="text-xs font-bold text-red uppercase tracking-wide">En direct — Urgence</span>
                    </div>

                    {/* Timeline tracking */}
                    <div className="space-y-0">
                      {[
                        { label: "Demande envoyée", sub: "Votre demande a été transmise", done: true, time: "À l\u2019instant" },
                        { label: "Artisan notifié", sub: "L\u2019artisan le plus proche a accepté", done: true, time: "Il y a 10s" },
                        { label: "En route", sub: "L\u2019artisan se dirige vers votre adresse", done: true, active: true, time: "Maintenant" },
                        { label: "Arrivée estimée", sub: address, done: false, time: "~20 min" },
                      ].map((s, i, arr) => (
                        <div key={s.label} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2",
                              s.active ? "border-forest bg-forest" :
                              s.done ? "border-forest bg-forest" : "border-gray-300 bg-white",
                            )}>
                              {s.done ? <Check className="w-3.5 h-3.5 text-white" /> :
                               <span className="text-[11px] text-grayText font-bold">{i + 1}</span>}
                            </div>
                            {i < arr.length - 1 && (
                              <div className={cn("w-0.5 h-10 my-1", s.done ? "bg-forest" : "bg-border")} />
                            )}
                          </div>
                          <div className={cn("pb-4", i === arr.length - 1 && "pb-0")}>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-sm font-semibold", s.active ? "text-forest" : s.done ? "text-navy" : "text-grayText")}>{s.label}</span>
                              {s.active && <span className="px-1.5 py-0.5 rounded-[4px] bg-forest/10 text-[10px] font-bold text-forest">EN COURS</span>}
                            </div>
                            <span className="text-xs text-grayText">{s.sub}</span>
                            <span className="block text-[11px] text-grayText/60 font-mono mt-0.5">{s.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ETA bar */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-navy">Temps d&apos;arrivée estimé</span>
                        <span className="text-lg font-bold text-forest font-mono">~20 min</span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-forest to-sage rounded-full animate-pulse" style={{ width: "35%" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Recap */}
                <div className="bg-white rounded-[6px] border border-border shadow-sm p-5 text-left max-w-xl mx-auto">
                  <div className="text-[11px] font-bold text-grayText uppercase tracking-wider mb-3">Récapitulatif</div>
                  {[
                    { label: "Domaine", value: tradeName },
                    { label: "Adresse", value: address },
                    { label: "Paiement", value: paymentMethod === "card" ? "En ligne (séquestre)" : "Espèces" },
                    { label: "Type", value: isUrgent ? "Urgence 24h" : "Classique" },
                  ].map(({ label, value }, i, arr) => (
                    <div key={label} className={cn(
                      "flex justify-between py-2.5 text-sm",
                      i < arr.length - 1 && "border-b border-border/50",
                    )}>
                      <span className="text-grayText">{label}</span>
                      <span className="font-semibold text-navy text-right">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 max-w-xl mx-auto">
                  <Link
                    href="/dashboard"
                    className="block w-full py-3.5 rounded-[6px] bg-gradient-to-r from-deepForest to-forest text-white text-sm font-bold text-center shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    Accéder au tableau de bord
                  </Link>
                  <p className="text-xs text-grayText flex items-center justify-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Redirection automatique vers votre tableau de bord...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
       </div>
      </main>

      {/* ─── Sticky CTA ─── */}
      {step > 0 && step < 4 ? (
        <div className="fixed bottom-0 inset-x-0 bg-bgPage/90 backdrop-blur-md border-t border-border z-30">
          <div className="max-w-5xl mx-auto px-5 py-4">
            <button
              onClick={handleNext}
              disabled={!canNext() || authLoading}
              className={cn(
                "w-full py-3.5 rounded-[6px] text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2",
                canNext() && !authLoading
                  ? "bg-gradient-to-r from-deepForest to-forest text-white shadow-md hover:shadow-lg cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed",
              )}
            >
              {authLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Chargement...</>
              ) : step === 3 && isLoggedIn ? "Lancer la recherche" :
               step === 3 && accountMode === "create" ? "Créer mon compte et lancer" :
               step === 3 && accountMode === "login" ? "Se connecter et lancer" :
               "Continuer"}
              {!authLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
